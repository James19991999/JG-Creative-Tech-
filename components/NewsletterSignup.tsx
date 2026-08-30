"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "submitting" | "success" | "error";

/**
 * Compact newsletter signup form used in the site footer.
 * Posts to /api/newsletter; collapses to a success message on subscribe.
 */
export function NewsletterSignup() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError(null);

    const email = (
      event.currentTarget.elements.namedItem("nl-email") as HTMLInputElement
    ).value;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setState("success");
    } catch {
      setState("error");
      setError("Network error — please try again.");
    }
  }

  if (state === "success") {
    return (
      <p className="text-sm font-manrope text-secondary-fixed font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          check_circle
        </span>
        You&apos;re subscribed — welcome aboard.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <p className="text-xs font-manrope text-white/80">
        Insights on digital infrastructure for Kenyan SMEs, once a month. No
        spam.
      </p>
      <div className="flex gap-2">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          name="nl-email"
          type="email"
          required
          placeholder="your@company.com"
          className="flex-1 min-w-0 bg-white/10 border border-white/20 text-on-primary placeholder:text-on-primary/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex-shrink-0 bg-on-primary text-primary font-manrope font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
        >
          {state === "submitting" ? "…" : "Subscribe"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-on-tertiary-container">
          {error}
        </p>
      ) : null}
    </form>
  );
}
