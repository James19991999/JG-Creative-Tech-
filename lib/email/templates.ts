import { siteConfig } from "@/lib/site-config";
import type { ContactFormData } from "@/lib/validate-contact";
import type { BookingFormData } from "@/lib/validate-booking";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapHtml(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, sans-serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
    ${bodyHtml}
    <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #888;">
      ${escapeHtml(siteConfig.fullName)} &middot; ${escapeHtml(siteConfig.contact.address)}
    </p>
  </body>
</html>`;
}

// ---- Contact form ----

export function contactNotificationEmail(data: ContactFormData) {
  return {
    subject: `New contact form message from ${data.name}`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">New contact form submission</h2>
      <p><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${escapeHtml(data.details)}</p>
      <p style="font-size: 13px; color: #666;">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p>
    `),
    text: `New contact form submission\n\nFrom: ${data.name} <${data.email}>\n\nMessage:\n${data.details}\n\nReply to this email to respond directly.`,
  };
}

export function contactConfirmationEmail(data: ContactFormData) {
  return {
    subject: `We've received your message - ${siteConfig.fullName}`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">Thanks for reaching out, ${escapeHtml(data.name)}.</h2>
      <p>We've received your message and someone from our team will get back to you shortly.</p>
      <p><strong>What you sent us:</strong></p>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${escapeHtml(data.details)}</p>
    `),
    text: `Thanks for reaching out, ${data.name}.\n\nWe've received your message and someone from our team will get back to you shortly.\n\nWhat you sent us:\n${data.details}`,
  };
}

// ---- Consultation booking ----

function bookingDetailsLines(data: BookingFormData): string[] {
  const lines = [`Date: ${data.date}`, `Time: ${data.time}`];
  if (data.goal) lines.push(`Primary goal: ${data.goal}`);
  if (data.businessStage) lines.push(`Business stage: ${data.businessStage}`);
  if (data.moreInfo) lines.push(`Additional context: ${data.moreInfo}`);
  return lines;
}

export function bookingNotificationEmail(data: BookingFormData) {
  const lines = bookingDetailsLines(data);
  return {
    subject: `New consultation booking - ${data.name} (${data.date})`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">New consultation request</h2>
      <p><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
      <ul style="background: #f5f5f5; padding: 16px 16px 16px 32px; border-radius: 8px;">
        ${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}
      </ul>
      <p style="font-size: 13px; color: #666;">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p>
    `),
    text: `New consultation request\n\nFrom: ${data.name} <${data.email}>\n\n${lines.join("\n")}\n\nReply to this email to respond directly.`,
  };
}

export function bookingConfirmationEmail(data: BookingFormData) {
  return {
    subject: `Your consultation request - ${siteConfig.fullName}`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">You're on the calendar, ${escapeHtml(data.name)}.</h2>
      <p>We've received your consultation request for <strong>${escapeHtml(data.date)} at ${escapeHtml(data.time)}</strong>. Our team will confirm shortly.</p>
    `),
    text: `You're on the calendar, ${data.name}.\n\nWe've received your consultation request for ${data.date} at ${data.time}. Our team will confirm shortly.`,
  };
}

// ---- Newsletter ----

export function newsletterNotificationEmail(email: string) {
  return {
    subject: "New newsletter subscriber",
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">New newsletter subscriber</h2>
      <p>${escapeHtml(email)} just subscribed.</p>
    `),
    text: `New newsletter subscriber: ${email}`,
  };
}

export function newsletterWelcomeEmail() {
  return {
    subject: `You're subscribed - ${siteConfig.fullName}`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">You're on the list.</h2>
      <p>Thanks for subscribing to updates from ${escapeHtml(siteConfig.fullName)}. We'll only email when we have something worth sharing.</p>
    `),
    text: `You're on the list.\n\nThanks for subscribing to updates from ${siteConfig.fullName}. We'll only email when we have something worth sharing.`,
  };
}

// ---- Invoice reminders ----

export type ReminderInvoiceSummary = {
  number: string;
  amountFormatted: string;
  dueDate: string;
};

const PORTAL_URL_PATH = "/client-portal";

export function invoiceDueSoonEmail(clientName: string, invoice: ReminderInvoiceSummary) {
  const portalUrl = `${siteConfig.url}${PORTAL_URL_PATH}`;
  return {
    subject: `Reminder: Invoice ${invoice.number} is due soon`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">Hi ${escapeHtml(clientName)},</h2>
      <p>Just a friendly reminder that invoice <strong>${escapeHtml(invoice.number)}</strong> for <strong>${escapeHtml(invoice.amountFormatted)}</strong> is due on <strong>${escapeHtml(invoice.dueDate)}</strong>.</p>
      <p><a href="${portalUrl}" style="display: inline-block; background: #001e40; color: #fff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: bold;">View and pay in your portal</a></p>
    `),
    text: `Hi ${clientName},\n\nJust a friendly reminder that invoice ${invoice.number} for ${invoice.amountFormatted} is due on ${invoice.dueDate}.\n\nView and pay: ${portalUrl}`,
  };
}

export function invoiceOverdueEmail(clientName: string, invoice: ReminderInvoiceSummary) {
  const portalUrl = `${siteConfig.url}${PORTAL_URL_PATH}`;
  return {
    subject: `Invoice ${invoice.number} is now overdue`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">Hi ${escapeHtml(clientName)},</h2>
      <p>Invoice <strong>${escapeHtml(invoice.number)}</strong> for <strong>${escapeHtml(invoice.amountFormatted)}</strong> was due on <strong>${escapeHtml(invoice.dueDate)}</strong> and is now overdue. If you've already paid, please disregard this message.</p>
      <p><a href="${portalUrl}" style="display: inline-block; background: #001e40; color: #fff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: bold;">View and pay in your portal</a></p>
    `),
    text: `Hi ${clientName},\n\nInvoice ${invoice.number} for ${invoice.amountFormatted} was due on ${invoice.dueDate} and is now overdue. If you've already paid, please disregard this message.\n\nView and pay: ${portalUrl}`,
  };
}

export type ReminderDigestEntry = {
  clientEmail: string;
  invoiceNumber: string;
  type: "due-soon" | "overdue";
};

/**
 * Sent to the site owner once per cron run, and only when at least one
 * reminder actually went out - a daily "nothing happened" email would
 * just be noise that trains the recipient to ignore this address.
 */
export function invoiceReminderDigestEmail(entries: ReminderDigestEntry[]) {
  const rows = entries
    .map(
      (e) =>
        `<li>${escapeHtml(e.invoiceNumber)} (${escapeHtml(e.clientEmail)}) - ${
          e.type === "due-soon" ? "due-soon reminder sent" : "overdue reminder sent"
        }</li>`
    )
    .join("");
  const textRows = entries
    .map(
      (e) =>
        `- ${e.invoiceNumber} (${e.clientEmail}) - ${e.type === "due-soon" ? "due-soon reminder sent" : "overdue reminder sent"}`
    )
    .join("\n");

  return {
    subject: `Invoice reminders sent (${entries.length})`,
    html: wrapHtml(`
      <h2 style="margin-bottom: 4px;">Automated invoice reminders sent today</h2>
      <ul style="background: #f5f5f5; padding: 16px 16px 16px 32px; border-radius: 8px;">${rows}</ul>
    `),
    text: `Automated invoice reminders sent today:\n\n${textRows}`,
  };
}
