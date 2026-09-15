import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import {
  AnthropicError,
  getAnthropicConfig,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/ai-chat/anthropic-client";
import { buildSystemPrompt } from "@/lib/ai-chat/system-prompt";

// Chat is a genuine back-and-forth, unlike the one-shot forms
// elsewhere in this project - 5 requests/minute (the default) would
// block a normal conversation. Still capped, since every message here
// costs real per-token money, unlike a form submission.
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;

const MAX_MESSAGE_LENGTH = 1000;
const MAX_CONVERSATION_LENGTH = 20; // messages, not characters - bounds cost per request

/**
 * POST /api/chat
 *
 * Body: { messages: { role: "user" | "assistant", content: string }[] }
 *
 * The client sends its whole conversation so far (kept in React state,
 * not persisted - see components/ChatWidget.tsx) and this route
 * forwards it to Anthropic along with the grounding system prompt.
 * Deliberately stateless server-side: no conversation is stored in
 * Firestore or anywhere else, since these are anonymous site visitors,
 * not authenticated client-portal users with a real account to
 * attach history to.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`chat:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429 }
    );
  }

  const config = getAnthropicConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Chat isn't configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages =
    typeof body === "object" && body !== null && "messages" in body
      ? (body as { messages: unknown }).messages
      : null;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required." }, { status: 400 });
  }
  if (messages.length > MAX_CONVERSATION_LENGTH) {
    return NextResponse.json(
      { error: "This conversation has gotten long - please start a new one." },
      { status: 400 }
    );
  }

  const validatedMessages: ChatMessage[] = [];
  for (const m of messages) {
    if (
      typeof m !== "object" ||
      m === null ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.trim().length === 0
    ) {
      return NextResponse.json({ error: "Invalid message in conversation." }, { status: 400 });
    }
    if (m.content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }
    validatedMessages.push({ role: m.role, content: m.content });
  }

  if (validatedMessages[validatedMessages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "The last message must be from the visitor." },
      { status: 400 }
    );
  }

  try {
    const reply = await sendChatMessage(config, buildSystemPrompt(), validatedMessages);
    return NextResponse.json({ reply });
  } catch (error) {
    // AnthropicError.details holds the actual response body Anthropic
    // sent back (e.g. "invalid x-api-key", "insufficient credits",
    // "model not found") - the single most useful piece of
    // information for diagnosing a real failure, and it was being
    // silently dropped here: console.error(error) alone only prints
    // an Error's message/stack, not custom properties on a subclass.
    // Logging it explicitly means the next real failure shows up in
    // Vercel's function logs with the actual reason, not just "it
    // failed."
    if (error instanceof AnthropicError) {
      console.error("[chat] Anthropic request failed:", error.message, error.details);
    } else {
      console.error("[chat] Anthropic request failed:", error);
    }
    return NextResponse.json(
      { error: "Couldn't get a response right now. Please try again." },
      { status: 502 }
    );
  }
}
