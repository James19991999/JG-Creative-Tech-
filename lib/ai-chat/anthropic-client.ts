/**
 * Server-only Anthropic client. Direct fetch wrapper rather than the
 * @anthropic-ai/sdk package - consistent with every other server-only
 * integration in this project (lib/billing/intasend-client.ts,
 * lib/email/resend-client.ts): no unaudited dependency in a path that
 * sends real requests (and here, incurs real per-token cost) on this
 * site's behalf.
 *
 * Verified against Anthropic's own official docs before writing this,
 * not assumed - including the one genuinely easy detail to get wrong:
 * unlike most APIs in this project (IntaSend, Resend), Anthropic's
 * native authentication is an `x-api-key` header, not
 * `Authorization: Bearer` (https://docs.anthropic.com/en/api/overview,
 * "Authentication" section - confirmed directly from that page's own
 * text, not inferred from third-party proxy examples that don't
 * always match Anthropic's own native scheme).
 */

export type AnthropicConfig = {
  apiKey: string;
};

export function getAnthropicConfig(): AnthropicConfig | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return { apiKey };
}

export class AnthropicError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
  }
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Cheapest/fastest current Claude model - the right choice for a
// customer-facing FAQ/lead-qualification widget where cost scales
// with every website visitor who opens it, not a task that needs the
// most capable model available.
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 500;

export async function sendChatMessage(
  config: AnthropicConfig,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => undefined);
    throw new AnthropicError(
      `Anthropic API request failed (${response.status})`,
      details
    );
  }

  const data = await response.json();
  const textBlock = data.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  if (!textBlock?.text) {
    throw new AnthropicError("Anthropic response had no text content", data);
  }

  return textBlock.text;
}
