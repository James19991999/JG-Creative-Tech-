import {
  EmailSendError,
  getEmailConfig,
  sendEmail,
  sendEmailBestEffort,
} from "@/lib/email/resend-client";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe("getEmailConfig", () => {
  it("returns null when RESEND_API_KEY is missing", () => {
    delete process.env.RESEND_API_KEY;
    process.env.RESEND_FROM_EMAIL = "test@example.com";
    expect(getEmailConfig()).toBeNull();
  });

  it("returns null when RESEND_FROM_EMAIL is missing", () => {
    process.env.RESEND_API_KEY = "re_test";
    delete process.env.RESEND_FROM_EMAIL;
    expect(getEmailConfig()).toBeNull();
  });

  it("returns a config when both are set", () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "test@example.com";
    expect(getEmailConfig()).toEqual({
      apiKey: "re_test",
      fromAddress: "test@example.com",
    });
  });
});

describe("sendEmail", () => {
  const config = { apiKey: "re_test", fromAddress: "JG Creative Tech <hi@example.com>" };

  it("posts the expected payload shape to Resend's API", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });

    await sendEmail(config, {
      to: "client@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
      replyTo: "reply@example.com",
    });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(options.body);
    expect(body).toEqual({
      from: "JG Creative Tech <hi@example.com>",
      to: ["client@example.com"],
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
      reply_to: "reply@example.com",
    });
  });

  it("omits reply_to when not provided", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });

    await sendEmail(config, {
      to: "client@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(JSON.parse(options.body).reply_to).toBeUndefined();
  });

  it("throws EmailSendError on a non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: "invalid from address" }),
    });

    await expect(
      sendEmail(config, { to: "a@b.com", subject: "x", html: "x", text: "x" })
    ).rejects.toThrow(EmailSendError);
  });
});

describe("sendEmailBestEffort", () => {
  const config = { apiKey: "re_test", fromAddress: "hi@example.com" };

  it("returns true on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });
    const result = await sendEmailBestEffort(
      config,
      { to: "a@b.com", subject: "x", html: "x", text: "x" },
      "test"
    );
    expect(result).toBe(true);
  });

  it("returns false and never throws when sending fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));
    const result = await sendEmailBestEffort(
      config,
      { to: "a@b.com", subject: "x", html: "x", text: "x" },
      "test"
    );
    expect(result).toBe(false);
  });
});
