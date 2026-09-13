import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCheckoutStatus, getIntaSendConfig } from "@/lib/billing/intasend-client";

/**
 * POST /api/webhooks/intasend
 *
 * Real payload shape, confirmed against IntaSend's own docs
 * (https://developers.intasend.com/docs/payment-collection-events)
 * rather than assumed:
 *   {
 *     "invoice_id": "BRZKGPR",
 *     "state": "COMPLETE" | "PROCESSING" | "FAILED" | ...,
 *     "api_ref": "<our own reference from checkout creation>",
 *     "value": "10.36",
 *     "currency": "KES",
 *     "challenge": "<the shared secret set in the IntaSend dashboard>",
 *     ...
 *   }
 *
 * Security note, stated plainly rather than glossed over: IntaSend's
 * webhook authentication is currently just this shared "challenge"
 * string included in the plain JSON body - there is no HMAC request
 * signing (unlike Stripe's Stripe-Signature header, for example).
 * Comparing the challenge with crypto.timingSafeEqual at least closes
 * the timing side-channel, but this is a genuinely weaker scheme than
 * a signed payload, not a merely different one - documenting that
 * here rather than implying otherwise.
 *
 * Because of that weaker guarantee, this handler treats the webhook
 * body as a *hint* to check, not the final word: after the challenge
 * passes, it independently re-confirms the payment status directly
 * against IntaSend's own API (using the secret key) before ever
 * marking an invoice paid. A forged webhook body alone can't move
 * money or flip an invoice's status without also fooling that
 * independent lookup.
 */
export async function POST(request: Request) {
  const config = getIntaSendConfig();
  const db = getAdminDb();
  const expectedChallenge = process.env.INTASEND_WEBHOOK_CHALLENGE;

  if (!config || !db || !expectedChallenge) {
    // Not configured - accept and no-op rather than error, since a
    // misconfigured-but-registered webhook would otherwise get
    // deactivated by IntaSend after repeated failures (see their
    // "20 failed requests" note in the webhook setup docs).
    return NextResponse.json({ received: true });
  }

  let body: {
    invoice_id?: string;
    state?: string;
    api_ref?: string;
    challenge?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (!isValidChallenge(body.challenge, expectedChallenge)) {
    return NextResponse.json({ error: "Invalid challenge." }, { status: 401 });
  }

  if (!body.invoice_id || !body.api_ref) {
    return NextResponse.json({ error: "Missing invoice_id/api_ref." }, { status: 400 });
  }

  if (body.state !== "COMPLETE") {
    // PENDING/PROCESSING/FAILED all just get acknowledged - only a
    // confirmed completion should ever touch the invoice record.
    return NextResponse.json({ received: true });
  }

  const checkoutRef = db.collection("intasendCheckouts").doc(body.api_ref);
  const checkoutSnap = await checkoutRef.get();

  if (!checkoutSnap.exists) {
    console.error(
      `[intasend-webhook] No checkout record for api_ref=${body.api_ref} - ignoring.`
    );
    return NextResponse.json({ received: true });
  }

  const checkout = checkoutSnap.data() as {
    uid: string;
    invoiceId: string;
    resolved: boolean;
  };

  // Idempotency: IntaSend (like most payment providers) can and does
  // redeliver webhooks. If this checkout was already resolved, don't
  // process it again.
  if (checkout.resolved) {
    return NextResponse.json({ received: true });
  }

  // The webhook body says COMPLETE - now independently confirm that
  // directly against IntaSend's API before trusting it, per the
  // reasoning above.
  try {
    const verified = await getCheckoutStatus(config, body.invoice_id);
    if (verified.state !== "COMPLETE") {
      console.error(
        `[intasend-webhook] Webhook claimed COMPLETE but API lookup says ${verified.state} for invoice_id=${body.invoice_id} - not marking paid.`
      );
      return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error("[intasend-webhook] Status verification call failed:", error);
    // Fail closed: if we can't independently verify, don't mark paid.
    // IntaSend will retry the webhook, giving us another chance once
    // the API is reachable again.
    return NextResponse.json({ error: "Verification unavailable." }, { status: 503 });
  }

  const invoiceRef = db
    .collection("clients")
    .doc(checkout.uid)
    .collection("invoices")
    .doc(checkout.invoiceId);

  await db.runTransaction(async (tx) => {
    tx.update(invoiceRef, {
      status: "paid",
      paidAt: new Date().toISOString(),
      intasendInvoiceId: body.invoice_id,
    });
    tx.update(checkoutRef, { resolved: true, resolvedAt: new Date().toISOString() });
  });

  return NextResponse.json({ received: true });
}

function isValidChallenge(received: unknown, expected: string): boolean {
  if (typeof received !== "string") return false;
  const receivedBuf = Buffer.from(received);
  const expectedBuf = Buffer.from(expected);
  if (receivedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(receivedBuf, expectedBuf);
}
