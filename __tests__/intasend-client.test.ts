import {
  createCheckout,
  getCheckoutStatus,
  getIntaSendConfig,
  IntaSendError,
} from "@/lib/billing/intasend-client";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe("getIntaSendConfig", () => {
  it("returns null when keys aren't set", () => {
    delete process.env.INTASEND_PUBLISHABLE_KEY;
    delete process.env.INTASEND_SECRET_KEY;
    expect(getIntaSendConfig()).toBeNull();
  });

  it("picks the sandbox host when the secret key contains 'test'", () => {
    process.env.INTASEND_PUBLISHABLE_KEY = "ISPubKey_test_abc";
    process.env.INTASEND_SECRET_KEY = "ISSecretKey_test_xyz";
    expect(getIntaSendConfig()?.baseUrl).toBe("https://sandbox.intasend.com/api/v1");
  });

  it("picks the live host when neither key contains 'test'", () => {
    process.env.INTASEND_PUBLISHABLE_KEY = "ISPubKey_live_abc";
    process.env.INTASEND_SECRET_KEY = "ISSecretKey_live_xyz";
    expect(getIntaSendConfig()?.baseUrl).toBe("https://payment.intasend.com/api/v1");
  });
});

describe("createCheckout", () => {
  const config = {
    publishableKey: "ISPubKey_test_abc",
    secretKey: "ISSecretKey_test_xyz",
    baseUrl: "https://sandbox.intasend.com/api/v1",
  };

  it("posts the expected payload shape to the checkout endpoint", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "chk_123", url: "https://sandbox.intasend.com/checkout/chk_123" }),
    });

    await createCheckout(config, {
      amount: 4500,
      currency: "KES",
      email: "client@example.com",
      firstName: "Jane",
      lastName: "Doe",
      apiRef: "uid1_inv1_123",
      redirectUrl: "https://example.com/client-portal",
    });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://sandbox.intasend.com/api/v1/checkout/");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      public_key: "ISPubKey_test_abc",
      amount: 4500,
      currency: "KES",
      email: "client@example.com",
      first_name: "Jane",
      last_name: "Doe",
      api_ref: "uid1_inv1_123",
      redirect_url: "https://example.com/client-portal",
    });
    // No `method` field - the hosted page must let the payer choose
    // card or M-Pesa themselves.
    expect(body.method).toBeUndefined();
  });

  it("returns the checkout id and url", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "chk_123", url: "https://sandbox.intasend.com/checkout/chk_123" }),
    });

    const result = await createCheckout(config, {
      amount: 100,
      currency: "KES",
      email: "a@b.com",
      firstName: "A",
      lastName: "B",
      apiRef: "ref1",
      redirectUrl: "https://example.com",
    });

    expect(result).toEqual({ id: "chk_123", url: "https://sandbox.intasend.com/checkout/chk_123" });
  });

  it("throws IntaSendError on a non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ detail: "invalid amount" }),
    });

    await expect(
      createCheckout(config, {
        amount: -1,
        currency: "KES",
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        apiRef: "ref1",
        redirectUrl: "https://example.com",
      })
    ).rejects.toThrow(IntaSendError);
  });

  it("throws IntaSendError when the response is missing id/url", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(
      createCheckout(config, {
        amount: 100,
        currency: "KES",
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        apiRef: "ref1",
        redirectUrl: "https://example.com",
      })
    ).rejects.toThrow(IntaSendError);
  });
});

describe("getCheckoutStatus", () => {
  const config = {
    publishableKey: "ISPubKey_test_abc",
    secretKey: "ISSecretKey_test_xyz",
    baseUrl: "https://sandbox.intasend.com/api/v1",
  };

  it("sends the secret key as a bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ invoice: { invoice_id: "INV1", state: "COMPLETE", api_ref: "ref1" } }),
    });

    await getCheckoutStatus(config, "INV1");

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer ISSecretKey_test_xyz");
  });

  it("parses the invoice state from the response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ invoice: { invoice_id: "INV1", state: "COMPLETE", api_ref: "ref1" } }),
    });

    const result = await getCheckoutStatus(config, "INV1");
    expect(result).toEqual({ invoiceId: "INV1", state: "COMPLETE", apiRef: "ref1" });
  });
});
