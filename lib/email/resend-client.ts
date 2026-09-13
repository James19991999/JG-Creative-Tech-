/**
 * Server-only Resend client. Direct fetch wrapper rather than the
 * `resend` npm package, consistent with every other server-only
 * integration in this project (see lib/billing/intasend-client.ts for
 * the same reasoning) - no unaudited third-party dependency in a path
 * that sends real email on this site's behalf.
 *
 * Verified against Resend's own docs before writing this, not
 * assumed: POST https://api.resend.com/emails, Authorization: Bearer
 * <API key>, JSON body with from/to/subject/html
 * (https://resend.com/docs/api-reference/emails/send-email).
 */

export type EmailConfig = {
  apiKey: string;
  fromAddress: string;
};

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromAddress) return null;
  return { apiKey, fromAddress };
}

export class EmailSendError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
  }
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail(
  config: EmailConfig,
  params: SendEmailParams
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromAddress,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => undefined);
    throw new EmailSendError(
      `Resend email send failed (${response.status})`,
      details
    );
  }
}

/**
 * Sends an email but never throws - logs the failure and returns
 * false instead. Used for notification emails specifically: a failed
 * notification email should never be the reason a contact form,
 * booking, or newsletter signup itself fails for the person
 * submitting it. The submission is still persisted (or logged) either
 * way; this only affects whether the site owner gets pinged about it.
 */
export async function sendEmailBestEffort(
  config: EmailConfig,
  params: SendEmailParams,
  context: string
): Promise<boolean> {
  try {
    await sendEmail(config, params);
    return true;
  } catch (error) {
    console.error(`[email] Failed to send (${context}):`, error);
    return false;
  }
}
