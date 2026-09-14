import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";
import {
  invoiceDueSoonEmail,
  invoiceOverdueEmail,
  invoiceReminderDigestEmail,
  type ReminderDigestEntry,
} from "@/lib/email/templates";
import { siteConfig } from "@/lib/site-config";

const DAYS_BEFORE_DUE_TO_REMIND = 3;
const DAYS_BETWEEN_OVERDUE_REMINDERS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}

function formatAmount(amountCents: number, currency: string): string {
  return (amountCents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: currency || "USD",
  });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

/**
 * GET /api/cron/invoice-reminders
 *
 * Triggered daily by Vercel Cron (see vercel.json). Vercel sends
 * CRON_SECRET as a Bearer token automatically on its own scheduled
 * invocations once that env var is set - verified against Vercel's
 * current documentation before building this, not assumed
 * (https://vercel.com/docs/cron-jobs/manage-cron-jobs).
 *
 * For every client's invoice still marked "sent" (not yet paid):
 *   - within 3 days of its due date and no reminder sent yet ->
 *     sends one due-soon reminder, marks reminder3DaySentAt
 *   - past its due date -> flips status to "overdue" and sends the
 *     first overdue reminder
 * For invoices already "overdue": sends a follow-up reminder every
 * 7 days rather than daily, to avoid becoming noise.
 *
 * Queries across every client's invoices subcollection via a
 * Firestore collection-group query (requires the index declared in
 * firestore.indexes.json - see README.md for the deploy step).
 *
 * Sends the site owner a single digest email at the end summarizing
 * what went out, but only if at least one reminder was actually sent
 * - a daily "nothing happened" email is exactly the kind of thing
 * that trains a recipient to stop reading an inbox.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Cron is not configured yet." }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getAdminDb();
  const auth = getAdminAuth();
  const emailConfig = getEmailConfig();

  if (!db || !auth) {
    return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });
  }
  if (!emailConfig) {
    return NextResponse.json({ received: true, note: "Email is not configured - nothing sent." });
  }

  const now = new Date();
  const digestEntries: ReminderDigestEntry[] = [];

  const snapshot = await db
    .collectionGroup("invoices")
    .where("status", "in", ["sent", "overdue"])
    .get();

  for (const doc of snapshot.docs) {
    const invoice = doc.data() as {
      number: string;
      amountCents: number;
      currency: string;
      status: "sent" | "overdue";
      dueAt: string;
      reminder3DaySentAt?: string;
      lastOverdueReminderSentAt?: string;
    };

    const uid = doc.ref.parent.parent?.id;
    if (!uid) continue;

    const dueDate = new Date(invoice.dueAt);
    if (Number.isNaN(dueDate.getTime())) continue;

    const daysUntilDue = daysBetween(dueDate, now);

    let shouldSendDueSoon = false;
    let shouldSendOverdue = false;
    let shouldFlipToOverdue = false;

    if (invoice.status === "sent") {
      if (daysUntilDue < 0) {
        shouldFlipToOverdue = true;
        shouldSendOverdue = true;
      } else if (daysUntilDue <= DAYS_BEFORE_DUE_TO_REMIND && !invoice.reminder3DaySentAt) {
        shouldSendDueSoon = true;
      }
    } else if (invoice.status === "overdue") {
      const lastSent = invoice.lastOverdueReminderSentAt
        ? new Date(invoice.lastOverdueReminderSentAt)
        : null;
      const daysSinceLastReminder = lastSent ? daysBetween(now, lastSent) : Infinity;
      if (daysSinceLastReminder >= DAYS_BETWEEN_OVERDUE_REMINDERS) {
        shouldSendOverdue = true;
      }
    }

    if (!shouldSendDueSoon && !shouldSendOverdue) continue;

    let email = "";
    let displayName = "there";
    try {
      const userRecord = await auth.getUser(uid);
      email = userRecord.email ?? "";
      displayName = userRecord.displayName?.split(" ")[0] ?? "there";
    } catch (error) {
      console.error(`[invoice-reminders] Failed to load user ${uid}:`, error);
      continue;
    }
    if (!email) continue;

    const summary = {
      number: invoice.number,
      amountFormatted: formatAmount(invoice.amountCents, invoice.currency),
      dueDate: formatDate(invoice.dueAt),
    };

    const updates: Record<string, string> = {};

    if (shouldSendDueSoon) {
      const template = invoiceDueSoonEmail(displayName, summary);
      const sent = await sendEmailBestEffort(
        emailConfig,
        { to: email, ...template },
        "invoice due-soon reminder"
      );
      if (sent) {
        updates.reminder3DaySentAt = now.toISOString();
        digestEntries.push({ clientEmail: email, invoiceNumber: invoice.number, type: "due-soon" });
      }
    }

    if (shouldSendOverdue) {
      const template = invoiceOverdueEmail(displayName, summary);
      const sent = await sendEmailBestEffort(
        emailConfig,
        { to: email, ...template },
        "invoice overdue reminder"
      );
      if (sent) {
        updates.lastOverdueReminderSentAt = now.toISOString();
        if (shouldFlipToOverdue) updates.status = "overdue";
        digestEntries.push({ clientEmail: email, invoiceNumber: invoice.number, type: "overdue" });
      }
    }

    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates);
    }
  }

  if (digestEntries.length > 0) {
    const digest = invoiceReminderDigestEmail(digestEntries);
    await sendEmailBestEffort(
      emailConfig,
      { to: siteConfig.contact.email, ...digest },
      "invoice reminder digest"
    );
  }

  return NextResponse.json({ received: true, remindersSent: digestEntries.length });
}
