/**
 * @jest-environment node
 *
 * API route handlers run server-side and use the Fetch API's Request/
 * Response globals, which jsdom (this project's default test
 * environment) doesn't provide. Node 18+ has them natively.
 */
import { POST } from "@/app/api/billing/intasend-checkout/route";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { createCheckout, getIntaSendConfig } from "@/lib/billing/intasend-client";
import { isRateLimited } from "@/lib/rate-limit";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/billing/intasend-client", () => ({
  createCheckout: jest.fn(),
  getIntaSendConfig: jest.fn(),
}));
jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(() => false),
}));

const mockedGetAuth = getAdminAuth as jest.Mock;
const mockedGetDb = getAdminDb as jest.Mock;
const mockedGetConfig = getIntaSendConfig as jest.Mock;
const mockedCreateCheckout = createCheckout as jest.Mock;
const mockedIsRateLimited = isRateLimited as jest.Mock;

function makeRequest(body: unknown, token = "valid-token") {
  return new Request("https://example.com/api/billing/intasend-checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

function makeInvoiceDoc(data: Record<string, unknown> | null) {
  return {
    exists: data !== null,
    data: () => data,
  };
}

describe("POST /api/billing/intasend-checkout", () => {
  let mockSet: jest.Mock;
  let mockGet: jest.Mock;
  let mockDoc: jest.Mock;
  let mockCollection: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockedGetConfig.mockReturnValue({
      publishableKey: "pub",
      secretKey: "sec",
      baseUrl: "https://sandbox.intasend.com/api/v1",
    });

    mockSet = jest.fn().mockResolvedValue(undefined);
    mockGet = jest.fn();
    mockDoc = jest.fn(() => ({ get: mockGet, collection: mockCollection, set: mockSet }));
    mockCollection = jest.fn(() => ({ doc: mockDoc }));

    mockedGetDb.mockReturnValue({ collection: mockCollection });
    mockedGetAuth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "uid1" }),
      getUser: jest.fn().mockResolvedValue({ email: "client@example.com", displayName: "Jane Doe" }),
    });
  });

  it("returns 503 when payments aren't configured", async () => {
    mockedGetConfig.mockReturnValue(null);
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(503);
  });

  it("returns 429 when rate limited", async () => {
    mockedIsRateLimited.mockReturnValue(true);
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(429);
  });

  it("returns 401 when there's no Authorization header", async () => {
    const res = await POST(makeRequest({ invoiceId: "inv1" }, ""));
    expect(res.status).toBe(401);
  });

  it("returns 401 when the ID token is invalid", async () => {
    mockedGetAuth.mockReturnValue({
      verifyIdToken: jest.fn().mockRejectedValue(new Error("bad token")),
    });
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when invoiceId is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 404 when the invoice doesn't exist", async () => {
    mockGet.mockResolvedValue(makeInvoiceDoc(null));
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(404);
  });

  it("returns 409 for an already-paid invoice, without calling IntaSend", async () => {
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 100000, currency: "KES", status: "paid" })
    );
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(409);
    expect(mockedCreateCheckout).not.toHaveBeenCalled();
  });

  it("returns 409 for a draft invoice, without calling IntaSend", async () => {
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 100000, currency: "KES", status: "draft" })
    );
    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(409);
    expect(mockedCreateCheckout).not.toHaveBeenCalled();
  });

  it("always uses the invoice's own server-side amount, never a client-supplied one", async () => {
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 450000, currency: "KES", status: "sent" })
    );
    mockedCreateCheckout.mockResolvedValue({ id: "chk1", url: "https://checkout.example/chk1" });

    // Attacker-supplied body tries to smuggle a different amount in -
    // the route must ignore it entirely.
    await POST(makeRequest({ invoiceId: "inv1", amountCents: 1 }));

    expect(mockedCreateCheckout).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ amount: 4500, currency: "KES" })
    );
  });

  it("returns the checkout url on success", async () => {
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 100000, currency: "KES", status: "overdue" })
    );
    mockedCreateCheckout.mockResolvedValue({ id: "chk1", url: "https://checkout.example/chk1" });

    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.url).toBe("https://checkout.example/chk1");
    expect(mockSet).toHaveBeenCalled(); // records the checkout lookup
  });

  it("returns 422 when the account has no email on file", async () => {
    mockedGetAuth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "uid1" }),
      getUser: jest.fn().mockResolvedValue({ email: null, displayName: "Jane" }),
    });
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 100000, currency: "KES", status: "sent" })
    );

    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(422);
    expect(mockedCreateCheckout).not.toHaveBeenCalled();
  });

  it("returns 502 when IntaSend checkout creation fails", async () => {
    mockGet.mockResolvedValue(
      makeInvoiceDoc({ number: "001", amountCents: 100000, currency: "KES", status: "sent" })
    );
    mockedCreateCheckout.mockRejectedValue(new Error("network error"));

    const res = await POST(makeRequest({ invoiceId: "inv1" }));
    expect(res.status).toBe(502);
  });
});
