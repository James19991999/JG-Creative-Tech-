/**
 * @jest-environment node
 */
import { POST } from "@/app/api/newsletter/route";
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
  return new Request("https://example.com/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter - email integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockedGetDb.mockReturnValue({ collection: () => ({ add: jest.fn().mockResolvedValue(undefined) }) });
    mockedSendEmail.mockResolvedValue(true);
  });

  it("notifies the site owner and welcomes the new subscriber", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });

    const res = await POST(makeRequest({ email: "new@example.com" }));

    expect(res.status).toBe(200);
    expect(mockedSendEmail).toHaveBeenCalledTimes(2);
    const recipients = mockedSendEmail.mock.calls.map((c) => c[1].to);
    expect(recipients).toContain("info@jgcreativetechsolution.org");
    expect(recipients).toContain("new@example.com");
  });

  it("skips email without erroring when Resend isn't configured", async () => {
    mockedGetEmailConfig.mockReturnValue(null);
    const res = await POST(makeRequest({ email: "new@example.com" }));
    expect(res.status).toBe(200);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("does not send any email for an invalid address", async () => {
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(422);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });
});
