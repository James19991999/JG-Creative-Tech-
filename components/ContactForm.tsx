"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Contact form client component. Posts to /api/contact, shows inline
 * field errors from the server's validation response, and a success
 * or error state after submit. Mirrors the Stitch "Contact Form
 * Section" floating-label inputs.
 */
export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setFormError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      details: (form.elements.namedItem("details") as HTMLTextAreaElement)
        .value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setState("error");
        setFormError(result.error ?? "Something went wrong.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setFormError("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="bg-surface-container-lowest rounded-xl p-8 text-center"
      >
        <span
          className="material-symbols-outlined text-4xl text-secondary mb-4 block"
          aria-hidden="true"
        >
          check_circle
        </span>
        <h3 className="font-newsreader text-xl font-bold text-ink mb-2">
          Message sent.
        </h3>
        <p className="text-on-surface-variant text-sm">
          Thanks for reaching out - our team will get back to you within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {formError ? (
        <p role="alert" className="text-error text-sm font-bold">
          {formError}
        </p>
      ) : null}

      <div className="relative">
        <label
          htmlFor="name"
          className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container text-on-surface"
        />
        {fieldErrors.name ? (
          <p id="name-error" className="text-error text-xs mt-1">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
        >
          Business Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container text-on-surface"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-error text-xs mt-1">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <label
          htmlFor="details"
          className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
        >
          Project Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={3}
          required
          aria-invalid={Boolean(fieldErrors.details)}
          aria-describedby={fieldErrors.details ? "details-error" : undefined}
          className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container text-on-surface resize-none"
        />
        {fieldErrors.details ? (
          <p id="details-error" className="text-error text-xs mt-1">
            {fieldErrors.details}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-manrope font-bold py-4 rounded-full shadow-[0_8px_24px_rgba(0,30,64,0.15)] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Sending..." : "Send Message"}
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          send
        </span>
      </button>
    </form>
  );
}
