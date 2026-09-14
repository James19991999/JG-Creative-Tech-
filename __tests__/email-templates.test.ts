import {
  bookingConfirmationEmail,
  bookingNotificationEmail,
  contactConfirmationEmail,
  contactNotificationEmail,
  invoiceDueSoonEmail,
  invoiceOverdueEmail,
  invoiceReminderDigestEmail,
  newsletterNotificationEmail,
  newsletterWelcomeEmail,
} from "@/lib/email/templates";

describe("contact email templates", () => {
  const data = { name: "Jane Doe", email: "jane@example.com", details: "I need a website." };

  it("notification includes the submitter's name and message", () => {
    const email = contactNotificationEmail(data);
    expect(email.subject).toContain("Jane Doe");
    expect(email.html).toContain("Jane Doe");
    expect(email.html).toContain("jane@example.com");
    expect(email.html).toContain("I need a website.");
    expect(email.text).toContain("I need a website.");
  });

  it("confirmation addresses the submitter by name and echoes their message", () => {
    const email = contactConfirmationEmail(data);
    expect(email.html).toContain("Jane Doe");
    expect(email.html).toContain("I need a website.");
  });

  it("escapes HTML in submitted content to prevent injection into the email", () => {
    const malicious = {
      name: '<img src=x onerror=alert(1)>',
      email: "a@b.com",
      details: "<script>alert('xss')</script>",
    };
    const email = contactNotificationEmail(malicious);
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;script&gt;");
  });
});

describe("booking email templates", () => {
  const data = {
    name: "Sam Otieno",
    email: "sam@example.com",
    date: "2026-09-20",
    time: "10:00 AM",
    goal: "growth",
    businessStage: "scaling",
    moreInfo: "Need help with SEO.",
  };

  it("notification includes all provided discovery context", () => {
    const email = bookingNotificationEmail(data);
    expect(email.html).toContain("growth");
    expect(email.html).toContain("scaling");
    expect(email.html).toContain("Need help with SEO.");
    expect(email.html).toContain("2026-09-20");
    expect(email.html).toContain("10:00 AM");
  });

  it("notification omits discovery fields entirely when not provided", () => {
    const minimal = { name: "Sam", email: "sam@example.com", date: "2026-09-20", time: "10:00 AM" };
    const email = bookingNotificationEmail(minimal);
    expect(email.html).not.toContain("Primary goal");
    expect(email.html).not.toContain("Business stage");
    expect(email.html).not.toContain("Additional context");
  });

  it("confirmation states the date and time back to the requester", () => {
    const email = bookingConfirmationEmail(data);
    expect(email.html).toContain("Sam Otieno");
    expect(email.html).toContain("2026-09-20");
    expect(email.html).toContain("10:00 AM");
  });
});

describe("newsletter email templates", () => {
  it("notification includes the subscriber's email", () => {
    const email = newsletterNotificationEmail("new@example.com");
    expect(email.html).toContain("new@example.com");
    expect(email.text).toContain("new@example.com");
  });

  it("welcome email is a fixed template with no per-subscriber content", () => {
    const email = newsletterWelcomeEmail();
    expect(email.subject).toBeTruthy();
    expect(email.html).toContain("subscri");
  });
});

describe("invoice reminder email templates", () => {
  const invoice = { number: "INV-042", amountFormatted: "$450.00", dueDate: "September 20, 2026" };

  it("due-soon email addresses the client by name and states the amount and date", () => {
    const email = invoiceDueSoonEmail("Jane", invoice);
    expect(email.subject).toContain("INV-042");
    expect(email.html).toContain("Jane");
    expect(email.html).toContain("$450.00");
    expect(email.html).toContain("September 20, 2026");
    expect(email.html).toContain("/client-portal");
  });

  it("overdue email states the invoice is overdue and offers a disregard-if-paid note", () => {
    const email = invoiceOverdueEmail("Jane", invoice);
    expect(email.subject.toLowerCase()).toContain("overdue");
    expect(email.html.toLowerCase()).toContain("overdue");
    expect(email.html.toLowerCase()).toContain("already paid");
  });

  it("escapes HTML in the client's name", () => {
    const email = invoiceDueSoonEmail("<script>alert(1)</script>", invoice);
    expect(email.html).not.toContain("<script>");
  });

  it("owner digest lists every entry with its type", () => {
    const digest = invoiceReminderDigestEmail([
      { clientEmail: "a@example.com", invoiceNumber: "001", type: "due-soon" },
      { clientEmail: "b@example.com", invoiceNumber: "002", type: "overdue" },
    ]);
    expect(digest.subject).toContain("2");
    expect(digest.html).toContain("a@example.com");
    expect(digest.html).toContain("b@example.com");
    expect(digest.html).toContain("due-soon reminder sent");
    expect(digest.html).toContain("overdue reminder sent");
  });
});
