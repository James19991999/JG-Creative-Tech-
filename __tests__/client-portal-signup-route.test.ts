/**
 * @jest-environment node
 */
import { POST } from "@/app/api/client-portal/sign-up/route";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { isRateLimited } from "@/lib/rate-limit";
import { getEmailConfig, sendEmailBestEffort } from "@/lib/email/resend-client";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(() => false),
}));
jest.mock("@/lib/email/resend-client", () => ({
  getEmailConfig: jest.fn(),
  sendEmailBestEffort: jest.fn(),
}));

const mockedGetAdminAuth = getAdminAuth as jest.Mock;
const mockedGetAdminDb = getAdminDb as jest.Mock;
const mockedIsRateLimited = isRateLimited as jest.Mock;
const mockedGetEmailConfig = getEmailConfig as jest.Mock;
const mockedSendEmail = sendEmailBestEffort as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/client-portal/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: "newclient@example.com",
  password: "a-strong-password",
  displayName: "Jane Doe",
};

describe("POST /api/client-portal/sign-up", () => {
  let createUserSpy: jest.Mock;
  let getUserByEmailSpy: jest.Mock;
  let setSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockedGetEmailConfig.mockReturnValue({ apiKey: "re_test", fromAddress: "hi@example.com" });
    mockedSendEmail.mockResolvedValue(true);

    getUserByEmailSpy = jest.fn().mockRejectedValue(new Error("not found"));
    createUserSpy = jest.fn().mockResolvedValue({ uid: "new-uid-123" });
    mockedGetAdminAuth.mockReturnValue({
      getUserByEmail: getUserByEmailSpy,
      createUser: createUserSpy,
    });

    setSpy = jest.fn().mockResolvedValue(undefined);
    mockedGetAdminDb.mockReturnValue({
      collection: () => ({ doc: () => ({ set: setSpy }) }),
    });
  });

  it("returns 503 when Firebase isn't configured", async () => {
    mockedGetAdminAuth.mockReturnValue(null);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
  });

  it("returns 429 when rate limited", async () => {
    mockedIsRateLimited.mockReturnValue(true);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for a password under 8 characters", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "short" }));
    expect(res.status).toBe(400);
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it("returns 409 when an account already exists for that email", async () => {
    getUserByEmailSpy.mockResolvedValue({ uid: "existing-uid" });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it("creates the Auth user and the Firestore profile, flagged for review", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(createUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({ email: validBody.email, displayName: validBody.displayName })
    );
    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "Jane Doe",
        activeProjectStatus: "New sign-up - pending review",
      })
    );
  });

  it("notifies the site owner when a new account is created", async () => {
    await POST(makeRequest(validBody));
    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ to: "info@jgcreativetechsolution.org" }),
      "client portal signup notification"
    );
  });

  it("still succeeds even if the notification email fails to send", async () => {
    mockedSendEmail.mockResolvedValue(false);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
  });

  it("returns 502 if the Auth account creation itself fails", async () => {
    createUserSpy.mockRejectedValue(new Error("network error"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it("does not fail the whole request if only the profile write fails", async () => {
    setSpy.mockRejectedValue(new Error("firestore down"));
    const res = await POST(makeRequest(validBody));
    // The Auth account already exists at this point - the route
    // should still report success rather than leaving the person
    // stuck with an account they can't retry creating.
    expect(res.status).toBe(200);
  });
});
