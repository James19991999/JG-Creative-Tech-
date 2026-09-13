import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { createCheckout, getIntaSendConfig } from "@/lib/billing/intasend-client";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * POST /api/billing/intasend-checkout
 *
 * Body: { invoiceId: string }
 * Header: Authorization: Bearer <Firebase ID token>
 *
 * Creates a real IntaSend checkout session for one of the calling
 * client's own invoices and returns the hosted checkout URL to
 * redirect them to. The amount and currency are always read from the
 * invoice document itself, never from the request body - a client
 * could otherwise ask to "pay" any amount they liked for any invoice.
 *
 * This route only creates the checkout session; it never marks an
 * invoice as paid. That happens exclusively in the webhook handler
 * (app/api/webhooks/intasend/route.ts) once IntaSend confirms the
 * payment actually completed.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`intasend-checkout:${ip}`)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const config = getIntaSendConfig();
  const auth = getAdminAuth();
  const db = getAdminDb();

  if (!config || !auth || !db) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await auth.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const invoiceId =
    typeof body === "object" && body !== null && "invoiceId" in body
      ? String((body as { invoiceId: unknown }).invoiceId)
      : null;
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId is required." }, { status: 400 });
  }

  const invoiceRef = db
    .collection("clients")
    .doc(uid)
    .collection("invoices")
    .doc(invoiceId);
  const invoiceSnap = await invoiceRef.get();

  if (!invoiceSnap.exists) {
    // Deliberately the same 404 whether the invoice doesn't exist or
    // belongs to someone else - never confirm/deny another client's
    // invoice IDs to an authenticated-but-unrelated caller.
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const invoice = invoiceSnap.data() as {
    number: string;
    amountCents: number;
    currency: string;
    status: string;
  };

  if (invoice.status === "paid") {
    return NextResponse.json(
      { error: "This invoice has already been paid." },
      { status: 409 }
    );
  }
  if (invoice.status === "draft") {
    return NextResponse.json(
      { error: "This invoice isn't ready for payment yet." },
      { status: 409 }
    );
  }

  let email = "";
  let displayName = "Client";
  try {
    const userRecord = await auth.getUser(uid);
    email = userRecord.email ?? "";
    displayName = userRecord.displayName ?? "Client";
  } catch (error) {
    console.error("[intasend-checkout] Failed to load user record:", error);
  }
  if (!email) {
    return NextResponse.json(
      { error: "Your account has no email on file - contact support." },
      { status: 422 }
    );
  }

  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ") || "Client";

  // IntaSend's checkout payload has no metadata field to echo back on
  // the webhook, so api_ref is how we recover which client + invoice
  // this checkout was for once payment completes.
  const apiRef = `${uid}_${invoiceId}_${Date.now()}`;
  const origin = new URL(request.url).origin;

  try {
    const checkout = await createCheckout(config, {
      amount: invoice.amountCents / 100,
      currency: invoice.currency || "KES",
      email,
      firstName: firstName || "Client",
      lastName,
      apiRef,
      redirectUrl: `${origin}/client-portal?payment=complete`,
    });

    await db.collection("intasendCheckouts").doc(apiRef).set({
      uid,
      invoiceId,
      checkoutId: checkout.id,
      createdAt: new Date().toISOString(),
      resolved: false,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("[intasend-checkout] Checkout creation failed:", error);
    return NextResponse.json(
      { error: "Couldn't start payment. Please try again shortly." },
      { status: 502 }
    );
  }
}
