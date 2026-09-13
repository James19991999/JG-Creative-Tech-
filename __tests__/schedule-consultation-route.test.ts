/**
 * @jest-environment node
 */
import { POST } from "@/app/api/schedule-consultation/route";
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
  return new Request("https://example.com/api/schedule-consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Sam Otieno",
  email: "sam@example.com",
  date: "2026-09-20",
  time: "10:30 AM",
};

describe("POST /api/schedule-consultation - email integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockedGetDb.mockReturnValue({ collection: () => ({ add: jest.fn().mockResolvedValue(undefined) }) });
    mockedSendEmail.mockResolvedValue(true);
  });

  it("sends both a notification (reply-to the requester) and a confirmation email", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(200);
    expect(mockedSendEmail).toHaveBeenCalledTimes(2);
    const [notificationArgs, confirmationArgs] = mockedSendEmail.mock.calls.map((c) => c[1]);
    expect(notificationArgs.to).toBe("info@jgcreativetechsolution.org");
    expect(notificationArgs.replyTo).toBe("sam@example.com");
    expect(confirmationArgs.to).toBe("sam@example.com");
  });

  it("skips email without erroring when Resend isn't configured", async () => {
    mockedGetEmailConfig.mockReturnValue(null);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("carries discovery context through to the notification when present", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    await POST(
      makeRequest({ ...validBody, goal: "growth", businessStage: "scaling", moreInfo: "SEO help" })
    );

    const notificationCall = mockedSendEmail.mock.calls.find(
      (c) => c[1].to === "info@jgcreativetechsolution.org"
    );
    expect(notificationCall[1].html).toContain("growth");
    expect(notificationCall[1].html).toContain("SEO help");
  });
});
