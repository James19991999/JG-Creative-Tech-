import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { validateContactForm } from "@/lib/validate-contact";

/**
 * POST /api/contact
 *
 * Accepts { name, email, details } from the Contact page form. Validates
 * the payload, applies a basic per-IP rate limit, and writes the
 * submission to Firestore (collection: "contact_submissions") when
 * Firebase Admin credentials are configured. If Firebase isn't
 * configured (e.g. local dev without secrets), the submission is logged
 * to the server console instead so the form remains usable end-to-end.
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

  return NextResponse.json({ success: true });
}
