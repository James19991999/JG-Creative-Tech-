import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { validateBookingForm } from "@/lib/validate-booking";

/**
 * POST /api/schedule-consultation
 *
 * Accepts { name, email, day, time } from the Schedule Consultation
 * page. Same validate -> rate-limit -> Firestore-or-log pattern as
 * /api/contact, written to a dedicated "consultation_bookings"
 * collection so booking requests don't get mixed in with general
 * contact form inquiries.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`booking:${ip}`)) {
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

  const result = validateBookingForm(body);
  if (!result.valid) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: result.errors },
      { status: 422 }
    );
  }

  const booking = {
    ...result.data,
    status: "requested",
    createdAt: new Date().toISOString(),
    ip,
  };

  try {
    const db = getAdminDb();
    if (db) {
      await db.collection("consultation_bookings").add(booking);
    } else {
      console.info("[schedule-consultation] Firebase not configured, logging booking:", booking);
    }
  } catch (error) {
    console.error("[schedule-consultation] Failed to persist booking:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
