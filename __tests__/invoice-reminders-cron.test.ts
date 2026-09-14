/**
 * @jest-environment node
 */
import { GET } from "@/app/api/cron/invoice-reminders/route";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/email/resend-client", () => ({
  getEmailConfig: jest.fn(),
  sendEmailBestEffort: jest.fn(),
}));

const mockedGetAdminAuth = getAdminAuth as jest.Mock;
const mockedGetAdminDb = getAdminDb as jest.Mock;
const mockedGetEmailConfig = getEmailConfig as jest.Mock;
const mockedSendEmail = sendEmailBestEffort as jest.Mock;

const originalEnv = process.env;

function makeRequest(token = "correct-secret") {
  return new Request("https://example.com/api/cron/invoice-reminders", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function makeInvoiceDoc(
  id: string,
  uid: string,
  data: Record<string, unknown>,
  updateSpy: jest.Mock
) {
  return {
    ref: {
      parent: { parent: { id: uid } },
      update: updateSpy,
    },
    data: () => data,
    id,
  };
}

describe("GET /api/cron/invoice-reminders", () => {
  let updateSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, CRON_SECRET: "correct-secret" };
    updateSpy = jest.fn().mockResolvedValue(undefined);
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });
    mockedSendEmail.mockResolvedValue(true);
    mockedGetAdminAuth.mockReturnValue({
      getUser: jest.fn().mockResolvedValue({ email: "client@example.com", displayName: "Jane Doe" }),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 503 when CRON_SECRET isn't configured", async () => {
    delete process.env.CRON_SECRET;
    const res = await GET(makeRequest());
    expect(res.status).toBe(503);
  });

  it("returns 401 when the bearer token doesn't match", async () => {
    const res = await GET(makeRequest("wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when there's no Authorization header at all", async () => {
    const res = await GET(makeRequest(""));
    expect(res.status).toBe(401);
  });

  it("sends nothing and returns cleanly when email isn't configured", async () => {
    mockedGetEmailConfig.mockReturnValue(null);
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [] }) }) }),
    });
    const res = await GET(makeRequest());
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.note).toContain("not configured");
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("sends a due-soon reminder for an invoice due in 2 days with no prior reminder", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(2) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ to: "client@example.com", subject: expect.stringContaining("due soon") }),
      "invoice due-soon reminder"
    );
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ reminder3DaySentAt: expect.any(String) })
    );
  });

  it("does not send a due-soon reminder twice for the same invoice", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      {
        number: "001",
        amountCents: 10000,
        currency: "USD",
        status: "sent",
        dueAt: daysFromNow(2),
        reminder3DaySentAt: new Date().toISOString(),
      },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("does not send a due-soon reminder for an invoice due in 10 days", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(10) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("flips a past-due 'sent' invoice to overdue and sends the first overdue reminder", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(-2) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ subject: expect.stringContaining("overdue") }),
      "invoice overdue reminder"
    );
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: "overdue", lastOverdueReminderSentAt: expect.any(String) })
    );
  });

  it("does not re-send an overdue reminder within 7 days of the last one", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      {
        number: "001",
        amountCents: 10000,
        currency: "USD",
        status: "overdue",
        dueAt: daysFromNow(-10),
        lastOverdueReminderSentAt: daysFromNow(-2),
      },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("sends a follow-up overdue reminder once 7+ days have passed since the last one", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      {
        number: "001",
        amountCents: 10000,
        currency: "USD",
        status: "overdue",
        dueAt: daysFromNow(-20),
        lastOverdueReminderSentAt: daysFromNow(-8),
      },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ subject: expect.stringContaining("overdue") }),
      "invoice overdue reminder"
    );
    expect(updateSpy).toHaveBeenCalledWith(
      expect.not.objectContaining({ status: "overdue" })
    );
  });

  it("skips an invoice with no resolvable client email rather than crashing", async () => {
    mockedGetAdminAuth.mockReturnValue({
      getUser: jest.fn().mockResolvedValue({ email: null, displayName: "No Email" }),
    });
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(1) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("sends the owner a digest only when at least one reminder actually went out", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(1) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    const digestCall = mockedSendEmail.mock.calls.find(
      (c) => c[2] === "invoice reminder digest"
    );
    expect(digestCall).toBeDefined();
    expect(digestCall[1].to).toBe("info@jgcreativetechsolution.org");
  });

  it("does not send an owner digest when nothing needed a reminder", async () => {
    const doc = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(30) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc] }) }) }),
    });

    await GET(makeRequest());

    const digestCall = mockedSendEmail.mock.calls.find(
      (c) => c[2] === "invoice reminder digest"
    );
    expect(digestCall).toBeUndefined();
  });

  it("reports the count of reminders sent in the response", async () => {
    const doc1 = makeInvoiceDoc(
      "inv1",
      "uid1",
      { number: "001", amountCents: 10000, currency: "USD", status: "sent", dueAt: daysFromNow(1) },
      updateSpy
    );
    const doc2 = makeInvoiceDoc(
      "inv2",
      "uid1",
      { number: "002", amountCents: 5000, currency: "USD", status: "sent", dueAt: daysFromNow(-1) },
      updateSpy
    );
    mockedGetAdminDb.mockReturnValue({
      collectionGroup: () => ({ where: () => ({ get: async () => ({ docs: [doc1, doc2] }) }) }),
    });

    const res = await GET(makeRequest());
    const json = await res.json();
    expect(json.remindersSent).toBe(2);
  });
});
