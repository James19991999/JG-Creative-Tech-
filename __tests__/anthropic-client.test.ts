import { AnthropicError, getAnthropicConfig, sendChatMessage } from "@/lib/ai-chat/anthropic-client";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe("getAnthropicConfig", () => {
  it("returns null when ANTHROPIC_API_KEY isn't set", () => {
    delete process.env.ANTHROPIC_API_KEY;
    expect(getAnthropicConfig()).toBeNull();
  });

  it("returns a config when the key is set", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    expect(getAnthropicConfig()).toEqual({ apiKey: "sk-ant-test" });
  });
});

describe("sendChatMessage", () => {
  const config = { apiKey: "sk-ant-test" };

  it("authenticates with x-api-key, not a Bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ type: "text", text: "Hi there!" }] }),
    });

    await sendChatMessage(config, "system prompt", [{ role: "user", content: "hi" }]);

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(options.headers["x-api-key"]).toBe("sk-ant-test");
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers["anthropic-version"]).toBe("2023-06-01");
  });

  it("sends the system prompt and message history in the request body", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ type: "text", text: "reply" }] }),
    });

    await sendChatMessage(config, "You are a helpful assistant.", [
      { role: "user", content: "hello" },
      { role: "assistant", content: "hi!" },
      { role: "user", content: "how are you?" },
    ]);

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.system).toBe("You are a helpful assistant.");
    expect(body.messages).toEqual([
      { role: "user", content: "hello" },
      { role: "assistant", content: "hi!" },
      { role: "user", content: "how are you?" },
    ]);
    expect(body.model).toContain("claude");
    expect(body.max_tokens).toBeGreaterThan(0);
  });

  it("extracts the text block from the response content array", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "The answer is 42." }],
      }),
    });

    const reply = await sendChatMessage(config, "system", [{ role: "user", content: "hi" }]);
    expect(reply).toBe("The answer is 42.");
  });

  it("throws AnthropicError on a non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "invalid key" } }),
    });

    await expect(
      sendChatMessage(config, "system", [{ role: "user", content: "hi" }])
    ).rejects.toThrow(AnthropicError);
  });

  it("throws AnthropicError when the response has no text content block", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [] }),
    });

    await expect(
      sendChatMessage(config, "system", [{ role: "user", content: "hi" }])
    ).rejects.toThrow(AnthropicError);
  });
});
