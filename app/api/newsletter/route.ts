import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";
import { newsletterNotificationEmail, newsletterWelcomeEmail } from "@/lib/email/templates";
import { siteConfig } from "@/lib/site-config";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter
 *
 * Accepts { email } for newsletter signups. Same Firebase-or-log
 * fallback pattern as /api/contact, written to the
 * "newsletter_subscribers" collection. Also sends a real notification
 * email to the site owner and a welcome email to the new subscriber,
 * independent of whether the Firestore write succeeds.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`newsletter:${ip}`)) {
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

  const record = (body ?? {}) as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email.trim() : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address.", fieldErrors: { email: "Enter a valid email address." } },
      { status: 422 }
    );
  }

  try {
    const db = getAdminDb();
    if (db) {
      await db.collection("newsletter_subscribers").add({
        email,
        createdAt: new Date().toISOString(),
        ip,
      });
    } else {
      console.info("[newsletter] Firebase not configured, logging signup:", email);
    }
  } catch (error) {
    console.error("[newsletter] Failed to persist signup:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const emailConfig = getEmailConfig();
  if (emailConfig) {
    const notification = newsletterNotificationEmail(email);
    const welcome = newsletterWelcomeEmail();
    await Promise.all([
      sendEmailBestEffort(
        emailConfig,
        { to: siteConfig.contact.email, ...notification },
        "newsletter notification"
      ),
      sendEmailBestEffort(emailConfig, { to: email, ...welcome }, "newsletter welcome"),
    ]);
  } else {
    console.info("[newsletter] Resend not configured, skipping email notification.");
  }

  return NextResponse.json({ success: true });
}
