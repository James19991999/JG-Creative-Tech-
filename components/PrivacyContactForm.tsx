"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "submitting" | "success" | "error";

/**
 * DPO inquiry form on the Privacy Policy page's "Get in touch" section.
 * Submits to /api/contact (tagged as a privacy inquiry) rather than
 * being a static mockup form with no handler.
 */
export function PrivacyContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError(null);

    const form = event.currentTarget;
    const name = (form.elements.namedItem("dpo-name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("dpo-email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("dpo-message") as HTMLTextAreaElement).value;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          details: `[Privacy/DPO Inquiry]\n\n${message}`,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setState("error");
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div role="status" className="text-center py-8">
        <span className="material-symbols-outlined text-4xl text-secondary mb-4 block" aria-hidden="true">
          check_circle
        </span>
        <p className="font-newsreader text-xl text-primary font-bold">Inquiry sent.</p>
        <p className="text-on-surface-variant text-sm mt-2">
          Our Data Protection Officer will respond within one business
          day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? (
        <p role="alert" className="text-error text-sm font-bold">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="dpo-name" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Full Name
          </label>
          <input
            id="dpo-name"
            name="dpo-name"
            type="text"
            required
            className="bg-surface-container-highest border-none rounded-xl p-4 focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="dpo-email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Email Address
          </label>
          <input
            id="dpo-email"
            name="dpo-email"
            type="email"
            required
            className="bg-surface-container-highest border-none rounded-xl p-4 focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="dpo-message" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Message
        </label>
        <textarea
          id="dpo-message"
          name="dpo-message"
          rows={4}
          required
          className="bg-surface-container-highest border-none rounded-xl p-4 focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-full shadow-lg shadow-primary/10 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
