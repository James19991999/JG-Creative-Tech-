/**
 * @jest-environment node
 */
import { POST } from "@/app/api/contact/route";
import { getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(() => false),
}));
jest.mock("@/lib/email/resend-client", () => ({
  getEmailConfig: jest.fn(),
  sendEmailBestEffort: jest.fn(),
}));

const mockedGetDb = getAdminDb as jest.Mock;
const mockedIsRateLimited = isRateLimited as jest.Mock;
const mockedGetEmailConfig = getEmailConfig as jest.Mock;
const mockedSendEmail = sendEmailBestEffort as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = { name: "Jane Doe", email: "jane@example.com", details: "I need a website." };

describe("POST /api/contact - email integration", () => {
  let mockAdd: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockAdd = jest.fn().mockResolvedValue(undefined);
    mockedGetDb.mockReturnValue({ collection: () => ({ add: mockAdd }) });
    mockedSendEmail.mockResolvedValue(true);
  });

  it("sends both a notification and a confirmation email when Resend is configured", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(200);
    expect(mockedSendEmail).toHaveBeenCalledTimes(2);

    const [notificationArgs, confirmationArgs] = mockedSendEmail.mock.calls.map((c) => c[1]);
    expect(notificationArgs.to).toBe("info@jgcreativetechsolution.org");
    expect(notificationArgs.replyTo).toBe("jane@example.com");
    expect(confirmationArgs.to).toBe("jane@example.com");
  });

  it("skips email entirely (without erroring) when Resend isn't configured", async () => {
    mockedGetEmailConfig.mockReturnValue(null);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(200);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("still succeeds even if the email send itself fails", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });
    mockedSendEmail.mockResolvedValue(false);

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("still writes to Firestore and does not skip persistence just because email is configured", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    await POST(makeRequest(validBody));

    expect(mockAdd).toHaveBeenCalled();
  });

  it("does not attempt to send email for an invalid submission", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    const res = await POST(makeRequest({ name: "", email: "not-an-email", details: "" }));

    expect(res.status).toBe(422);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });
});
