"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Message = { role: "user" | "assistant"; content: string };

/**
 * Floating AI chat assistant. Answers visitor questions about the
 * business using a system prompt grounded in this site's own real
 * FAQ content (lib/ai-chat/system-prompt.ts) - it doesn't invent
 * pricing, timelines, or commitments the business hasn't actually
 * made, and hands off to WhatsApp/the contact form/booking a
 * consultation for anything that needs a real person or transaction.
 *
 * Conversation lives only in React state - never persisted anywhere,
 * client or server. These are anonymous site visitors, not
 * authenticated client-portal users with an account to attach history
 * to, so there's no natural place to store it and no reason to.
 *
 * Positioned above WhatsAppButton (bottom-44 mobile / md:bottom-24
 * desktop vs. its bottom-24/md:bottom-6), stacked rather than
 * replacing it - both are real, separate, complementary contact
 * paths, not a case of one superseding the other.
 *
 * Hidden on the same focused-onboarding funnel pages as
 * WhatsAppButton, for the same reason: those pages deliberately
 * suppress the main nav to remove distraction mid-form.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const t = useTranslations("chat");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const hiddenOn = ["/get-started/discovery", "/schedule-consultation"];
  if (hiddenOn.includes(pathname)) return null;

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(res.status === 429 ? t("errorRateLimit") : data.error || t("errorGeneric"));
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setIsSending(false);
    }
  }

  function handleNewConversation() {
    setMessages([]);
    setError(null);
  }

  return (
    <div role="complementary" aria-label="Chat assistant">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t("closeChat") : t("openChat")}
        aria-expanded={isOpen}
        className="fixed z-40 bottom-44 right-6 md:bottom-24 md:right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">
          {isOpen ? "close" : "chat"}
        </span>
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          className="fixed z-40 bottom-[15.5rem] right-6 md:bottom-[10.5rem] md:right-6 w-[calc(100vw-3rem)] max-w-sm h-[28rem] max-h-[70vh] bg-surface-container-lowest rounded-2xl whisper-shadow flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-on-primary shrink-0">
            <h2 className="font-newsreader font-bold">{t("title")}</h2>
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={handleNewConversation}
                aria-label={t("newConversation")}
                className="text-on-primary/70 hover:text-on-primary"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  refresh
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-surface-container text-ink rounded-bl-sm">
              {t("greeting")}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-on-primary rounded-br-sm"
                    : "bg-surface-container text-ink rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isSending ? (
              <div className="bg-surface-container text-on-surface-variant rounded-2xl rounded-bl-sm p-3 text-sm max-w-[85%]">
                …
              </div>
            ) : null}
            {error ? (
              <p role="alert" className="text-error text-xs font-bold px-1">
                {error}
              </p>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <p className="px-4 pb-1 text-[10px] text-on-surface-variant text-center shrink-0">
            {t("disclaimer")}
          </p>

          <div className="flex gap-2 p-3 border-t border-outline-variant/20 shrink-0">
            <label htmlFor="chat-input" className="sr-only">
              {t("placeholder")}
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder={t("placeholder")}
              disabled={isSending}
              className="flex-1 px-4 py-2 rounded-full border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              aria-label={t("send")}
              className="w-10 h-10 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                send
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
