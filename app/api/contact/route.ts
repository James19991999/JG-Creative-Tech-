import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { validateContactForm } from "@/lib/validate-contact";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";
import { contactConfirmationEmail, contactNotificationEmail } from "@/lib/email/templates";
import { siteConfig } from "@/lib/site-config";

/**
 * POST /api/contact
 *
 * Accepts { name, email, details } from the Contact page form. Validates
 * the payload, applies a basic per-IP rate limit, writes the submission
 * to Firestore (collection: "contact_submissions") when Firebase Admin
 * credentials are configured, and sends two real emails via Resend: a
 * notification to the site owner (with reply-to set to the submitter,
 * so replying in an inbox goes straight back to them) and a short
 * confirmation to the person who submitted. Email sending is
 * independent of Firestore - it's attempted either way, since a
 * missing/failed database write should never be the reason the site
 * owner doesn't hear about an inquiry. If Firebase isn't configured
 * (e.g. local dev without secrets), the submission is logged to the
 * server console instead so the form remains usable end-to-end.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = validateContactForm(body);
  if (!result.valid) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: result.errors },
      { status: 422 }
    );
  }

  const submission = {
    ...result.data,
    source: "contact_page",
    createdAt: new Date().toISOString(),
    ip,
  };

  try {
    const db = getAdminDb();
    if (db) {
      await db.collection("contact_submissions").add(submission);
    } else {
      // Firebase not configured (e.g. local dev) - log so the form is
      // still functionally testable end-to-end.
      console.info("[contact] Firebase not configured, logging submission:", submission);
    }
  } catch (error) {
    console.error("[contact] Failed to persist submission:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }

  const emailConfig = getEmailConfig();
  if (emailConfig) {
    const notification = contactNotificationEmail(result.data);
    const confirmation = contactConfirmationEmail(result.data);
    await Promise.all([
      sendEmailBestEffort(
        emailConfig,
        { to: siteConfig.contact.email, replyTo: result.data.email, ...notification },
        "contact notification"
      ),
      sendEmailBestEffort(
        emailConfig,
        { to: result.data.email, ...confirmation },
        "contact confirmation"
      ),
    ]);
  } else {
    console.info("[contact] Resend not configured, skipping email notification.");
  }

  return NextResponse.json({ success: true });
}
