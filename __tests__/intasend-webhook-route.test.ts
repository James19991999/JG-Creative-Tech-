/**
 * @jest-environment node
 */
import { POST } from "@/app/api/webhooks/intasend/route";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCheckoutStatus, getIntaSendConfig } from "@/lib/billing/intasend-client";

jest.mock("@/lib/firebase-admin", () => ({
  getAdminDb: jest.fn(),
}));
jest.mock("@/lib/billing/intasend-client", () => ({
  getCheckoutStatus: jest.fn(),
  getIntaSendConfig: jest.fn(),
}));

const mockedGetDb = getAdminDb as jest.Mock;
const mockedGetConfig = getIntaSendConfig as jest.Mock;
const mockedGetCheckoutStatus = getCheckoutStatus as jest.Mock;

const originalEnv = process.env;

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/webhooks/intasend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    invoice_id: "INV123",
    state: "COMPLETE",
    api_ref: "uid1_inv1_999",
    value: "45.00",
    currency: "KES",
    challenge: "correct-challenge",
    ...overrides,
  };
}

describe("POST /api/webhooks/intasend", () => {
  let mockCheckoutGet: jest.Mock;
  let mockCheckoutDoc: jest.Mock;
  let mockTxUpdate: jest.Mock;
  let mockRunTransaction: jest.Mock;
  let mockCollection: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, INTASEND_WEBHOOK_CHALLENGE: "correct-challenge" };

    mockedGetConfig.mockReturnValue({
      publishableKey: "pub",
      secretKey: "sec",
      baseUrl: "https://sandbox.intasend.com/api/v1",
    });

    mockCheckoutGet = jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({ uid: "uid1", invoiceId: "inv1", resolved: false }),
    });
    mockCheckoutDoc = jest.fn(() => ({ get: mockCheckoutGet }));
    mockTxUpdate = jest.fn();
    mockRunTransaction = jest.fn(async (fn) => fn({ update: mockTxUpdate }));

    mockCollection = jest.fn((name: string) => {
      if (name === "intasendCheckouts") return { doc: mockCheckoutDoc };
      if (name === "clients") {
        return {
          doc: () => ({
            collection: () => ({
              doc: () => ({ id: "invoiceRef" }),
            }),
          }),
        };
      }
      throw new Error(`Unexpected collection: ${name}`);
    });

    mockedGetDb.mockReturnValue({
      collection: mockCollection,
      runTransaction: mockRunTransaction,
    });

    mockedGetCheckoutStatus.mockResolvedValue({
      invoiceId: "INV123",
      state: "COMPLETE",
      apiRef: "uid1_inv1_999",
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("accepts and no-ops when not configured, rather than erroring", async () => {
    mockedGetConfig.mockReturnValue(null);
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("rejects a request with the wrong challenge", async () => {
    const res = await POST(makeRequest(validPayload({ challenge: "wrong" })));
    expect(res.status).toBe(401);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("rejects a request with no challenge at all", async () => {
    const res = await POST(makeRequest(validPayload({ challenge: undefined })));
    expect(res.status).toBe(401);
  });

  it("rejects a challenge of the wrong length without leaking timing info via a crash", async () => {
    const res = await POST(makeRequest(validPayload({ challenge: "x" })));
    expect(res.status).toBe(401);
  });

  it("returns 400 when invoice_id or api_ref is missing", async () => {
    const res = await POST(makeRequest(validPayload({ invoice_id: undefined })));
    expect(res.status).toBe(400);
  });

  it("acknowledges but does not update anything for a non-COMPLETE state", async () => {
    const res = await POST(makeRequest(validPayload({ state: "PROCESSING" })));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("acknowledges and ignores an unknown api_ref (no matching checkout record)", async () => {
    mockCheckoutGet.mockResolvedValue({ exists: false });
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("is idempotent: does nothing if the checkout was already resolved", async () => {
    mockCheckoutGet.mockResolvedValue({
      exists: true,
      data: () => ({ uid: "uid1", invoiceId: "inv1", resolved: true }),
    });
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).not.toHaveBeenCalled();
    expect(mockedGetCheckoutStatus).not.toHaveBeenCalled();
  });

  it("independently re-verifies status against IntaSend's API before marking paid", async () => {
    await POST(makeRequest(validPayload()));
    expect(mockedGetCheckoutStatus).toHaveBeenCalledWith(expect.anything(), "INV123");
  });

  it("does NOT mark paid if the webhook says COMPLETE but the API lookup disagrees", async () => {
    mockedGetCheckoutStatus.mockResolvedValue({
      invoiceId: "INV123",
      state: "FAILED",
      apiRef: "uid1_inv1_999",
    });
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("fails closed (503) if the independent verification call errors", async () => {
    mockedGetCheckoutStatus.mockRejectedValue(new Error("network down"));
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(503);
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("marks the invoice paid and the checkout resolved when everything checks out", async () => {
    const res = await POST(makeRequest(validPayload()));
    expect(res.status).toBe(200);
    expect(mockRunTransaction).toHaveBeenCalled();
    expect(mockTxUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ status: "paid", intasendInvoiceId: "INV123" })
    );
    expect(mockTxUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ resolved: true })
    );
  });
});
