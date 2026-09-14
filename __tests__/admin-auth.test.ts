/**
 * @jest-environment node
 */
import { verifyAdminRequest } from "@/lib/admin-auth";

function makeRequest(authHeader?: string) {
  return new Request("https://example.com/api/admin/overview", {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
}

describe("verifyAdminRequest", () => {
  it("returns null when there's no Authorization header", async () => {
    const auth = { verifyIdToken: jest.fn() } as any;
    const result = await verifyAdminRequest(makeRequest(), auth);
    expect(result).toBeNull();
    expect(auth.verifyIdToken).not.toHaveBeenCalled();
  });

  it("returns null when the token is invalid", async () => {
    const auth = { verifyIdToken: jest.fn().mockRejectedValue(new Error("bad token")) } as any;
    const result = await verifyAdminRequest(makeRequest("Bearer bad-token"), auth);
    expect(result).toBeNull();
  });

  it("returns null when the token is valid but lacks the admin claim", async () => {
    const auth = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "uid1", admin: undefined }),
    } as any;
    const result = await verifyAdminRequest(makeRequest("Bearer valid-token"), auth);
    expect(result).toBeNull();
  });

  it("returns null when admin is falsy but present (not exactly true)", async () => {
    const auth = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "uid1", admin: "yes" }),
    } as any;
    const result = await verifyAdminRequest(makeRequest("Bearer valid-token"), auth);
    expect(result).toBeNull();
  });

  it("returns the uid when the token is valid and admin is exactly true", async () => {
    const auth = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "uid1", admin: true }),
    } as any;
    const result = await verifyAdminRequest(makeRequest("Bearer valid-token"), auth);
    expect(result).toBe("uid1");
  });
});
