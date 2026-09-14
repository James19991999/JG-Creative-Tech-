/**
 * @jest-environment node
 */
import { POST } from "@/app/api/admin/reply/route";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/admin-auth", () => ({
  verifyAdminRequest: jest.fn(),
}));

const mockedGetAdminAuth = getAdminAuth as jest.Mock;
const mockedGetAdminDb = getAdminDb as jest.Mock;
const mockedVerifyAdmin = verifyAdminRequest as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/admin/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/reply", () => {
  let addSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAdminAuth.mockReturnValue({});
    mockedVerifyAdmin.mockResolvedValue("admin-uid");
    addSpy = jest.fn().mockResolvedValue(undefined);
    mockedGetAdminDb.mockReturnValue({
      collection: () => ({
        doc: () => ({
          collection: () => ({ add: addSpy }),
        }),
      }),
    });
  });

  it("returns 403 when the caller isn't a verified admin", async () => {
    mockedVerifyAdmin.mockResolvedValue(null);
    const res = await POST(makeRequest({ uid: "uid1", body: "hi" }));
    expect(res.status).toBe(403);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("returns 400 when uid is missing", async () => {
    const res = await POST(makeRequest({ body: "hi" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an empty message", async () => {
    const res = await POST(makeRequest({ uid: "uid1", body: "   " }));
    expect(res.status).toBe(400);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for a message over 2000 characters", async () => {
    const res = await POST(makeRequest({ uid: "uid1", body: "x".repeat(2001) }));
    expect(res.status).toBe(400);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("writes the reply with sentBy 'team' on success", async () => {
    const res = await POST(makeRequest({ uid: "uid1", body: "Thanks for reaching out!" }));
    expect(res.status).toBe(200);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({ body: "Thanks for reaching out!", sentBy: "team" })
    );
  });
});
