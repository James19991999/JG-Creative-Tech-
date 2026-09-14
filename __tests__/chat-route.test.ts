/**
 * @jest-environment node
 */
import { POST } from "@/app/api/chat/route";
import { isRateLimited } from "@/lib/rate-limit";
import { getAnthropicConfig, sendChatMessage } from "@/lib/ai-chat/anthropic-client";

jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(() => false),
}));
jest.mock("@/lib/ai-chat/anthropic-client", () => ({
  getAnthropicConfig: jest.fn(),
  sendChatMessage: jest.fn(),
}));

const mockedIsRateLimited = isRateLimited as jest.Mock;
const mockedGetConfig = getAnthropicConfig as jest.Mock;
const mockedSendChatMessage = sendChatMessage as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsRateLimited.mockReturnValue(false);
    mockedGetConfig.mockReturnValue({ apiKey: "sk-ant-test" });
    mockedSendChatMessage.mockResolvedValue("Here's the answer.");
  });

  it("returns 429 when rate limited, with a chat-appropriate higher threshold than the form default", async () => {
    mockedIsRateLimited.mockReturnValue(true);
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }));
    expect(res.status).toBe(429);
    // Confirms this route passes its own (higher) limit rather than
    // relying on isRateLimited's 5/minute form default.
    expect(mockedIsRateLimited).toHaveBeenCalledWith(expect.stringContaining("chat:"), 15, 60000);
  });

  it("returns 503 when Anthropic isn't configured", async () => {
    mockedGetConfig.mockReturnValue(null);
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }));
    expect(res.status).toBe(503);
    expect(mockedSendChatMessage).not.toHaveBeenCalled();
  });

  it("returns 400 when messages is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 when messages is an empty array", async () => {
    const res = await POST(makeRequest({ messages: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when the conversation exceeds the length cap", async () => {
    const messages = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "hi",
    }));
    const res = await POST(makeRequest({ messages }));
    expect(res.status).toBe(400);
    expect(mockedSendChatMessage).not.toHaveBeenCalled();
  });

  it("returns 400 for a message over the character limit", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "x".repeat(1001) }] }));
    expect(res.status).toBe(400);
    expect(mockedSendChatMessage).not.toHaveBeenCalled();
  });

  it("returns 400 when a message has an invalid role", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "system", content: "hi" }] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when the conversation doesn't end with a user message", async () => {
    const res = await POST(
      makeRequest({
        messages: [
          { role: "user", content: "hi" },
          { role: "assistant", content: "hello!" },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect(mockedSendChatMessage).not.toHaveBeenCalled();
  });

  it("returns the reply on a valid request", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "What do you do?" }] }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.reply).toBe("Here's the answer.");
  });

  it("passes the full conversation history through to Anthropic in order", async () => {
    const messages = [
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello!" },
      { role: "user", content: "tell me more" },
    ];
    await POST(makeRequest({ messages }));
    expect(mockedSendChatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(String),
      messages
    );
  });

  it("returns 502 when the Anthropic call itself fails", async () => {
    mockedSendChatMessage.mockRejectedValue(new Error("network error"));
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }));
    expect(res.status).toBe(502);
  });
});
