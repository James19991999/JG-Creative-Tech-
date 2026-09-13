/**
 * Server-only IntaSend client. Deliberately a direct fetch wrapper
 * rather than the intasend-node package - this keeps the payment
 * path free of an unaudited third-party dependency and gives full
 * control/visibility over exactly what's sent, consistent with how
 * this project treats every other server-only integration.
 *
 * Verified against IntaSend's own docs before writing this (not
 * assumed from training data, since API details for a live payment
 * integration are exactly the kind of thing worth getting wrong):
 *   - Checkout creation: POST /api/v1/checkout/ with `public_key` in
 *     the JSON body (https://developers.intasend.com/docs/checkout-links)
 *   - Other protected resources (status lookups, refunds, wallets):
 *     Authorization: Bearer <secret key>
 *     (https://developers.intasend.com/docs/authentication)
 *   - Sandbox vs live is a different HOST, not a query param -
 *     sandbox.intasend.com vs payment.intasend.com. This client picks
 *     the host automatically from the secret key's own prefix
 *     ("ISSecretKey_test_..." vs "ISSecretKey_live_...") so the
 *     environment can never drift out of sync with which key is
 *     actually configured.
 */

export type IntaSendConfig = {
  publishableKey: string;
  secretKey: string;
  baseUrl: string;
};

export function getIntaSendConfig(): IntaSendConfig | null {
  const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY;
  const secretKey = process.env.INTASEND_SECRET_KEY;

  if (!publishableKey || !secretKey) return null;

  const isTest =
    secretKey.includes("test") || publishableKey.includes("test");
  const baseUrl = isTest
    ? "https://sandbox.intasend.com/api/v1"
    : "https://payment.intasend.com/api/v1";

  return { publishableKey, secretKey, baseUrl };
}

export class IntaSendError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
  }
}

export type CreateCheckoutParams = {
  amount: number; // major currency units (e.g. 4500.00, not cents)
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  apiRef: string; // our own reference - echoed back on the webhook
  redirectUrl: string;
};

export type CreateCheckoutResult = {
  id: string;
  url: string;
};

export async function createCheckout(
  config: IntaSendConfig,
  params: CreateCheckoutParams
): Promise<CreateCheckoutResult> {
  const response = await fetch(`${config.baseUrl}/checkout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      public_key: config.publishableKey,
      amount: params.amount,
      currency: params.currency,
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      country: "KE",
      api_ref: params.apiRef,
      redirect_url: params.redirectUrl,
      // method intentionally omitted - IntaSend's hosted checkout page
      // then lets the payer choose card or M-Pesa themselves, which is
      // the actual "card + M-Pesa in one integration" behavior.
    }),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => undefined);
    throw new IntaSendError(
      `IntaSend checkout creation failed (${response.status})`,
      details
    );
  }

  const data = await response.json();
  if (!data.id || !data.url) {
    throw new IntaSendError("IntaSend checkout response missing id/url", data);
  }

  return { id: data.id, url: data.url };
}

export type CheckoutStatus = {
  invoiceId: string;
  state: string; // "COMPLETE" | "FAILED" | "PENDING" | ...
  apiRef: string | null;
};

/**
 * Independently re-confirms a payment's status directly against
 * IntaSend's API using the secret key, rather than trusting the
 * webhook payload alone - a webhook body can be replayed or (given
 * IntaSend's webhook security is currently just a shared challenge
 * string, not HMAC-signed - see the note in the webhook route) is
 * inherently the weaker of the two signals, so this lookup is the
 * real source of truth before marking anything paid.
 */
export async function getCheckoutStatus(
  config: IntaSendConfig,
  invoiceId: string
): Promise<CheckoutStatus> {
  const response = await fetch(
    `${config.baseUrl}/payment/status/?invoice_id=${encodeURIComponent(invoiceId)}`,
    {
      headers: { Authorization: `Bearer ${config.secretKey}` },
    }
  );

  if (!response.ok) {
    const details = await response.json().catch(() => undefined);
    throw new IntaSendError(
      `IntaSend status lookup failed (${response.status})`,
      details
    );
  }

  const data = await response.json();
  return {
    invoiceId: data.invoice?.invoice_id ?? invoiceId,
    state: data.invoice?.state ?? "UNKNOWN",
    apiRef: data.invoice?.api_ref ?? null,
  };
}
