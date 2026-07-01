"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "jg-cookie-consent";

type ConsentState = "accepted" | "declined" | null;

/**
 * Cookie consent banner. Shown on first visit; decision persisted in
 * localStorage. Compliant with GDPR and Kenya's Data Protection Act 2019.
 *
 * - "Accept" sets analytics consent and clears the banner.
 * - "Decline" records the decline and clears the banner (no analytics).
 * - Links to /legal/cookies for full policy.
 * - Renders nothing once consent has been given (either way).
 */
export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState | "loading">("loading");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
      setConsent(stored);
    } catch {
      setConsent(null);
    }
  }, []);

  function handleDecision(decision: "accepted" | "declined") {
    try {
      localStorage.setItem(CONSENT_KEY, decision);
    } catch {
      // localStorage unavailable — consent still visually dismissed
    }
    setConsent(decision);
  }

  // Don't render during SSR or after a decision has been made
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] md:bottom-6 md:left-6 md:right-auto md:max-w-md"
    >
      <div className="bg-primary text-on-primary shadow-2xl md:rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4 mb-5">
          <span
            className="material-symbols-outlined text-2xl text-secondary-fixed mt-0.5 flex-shrink-0"
            aria-hidden="true"
          >
            cookie
          </span>
          <div>
            <h2 className="font-newsreader font-bold text-lg mb-1">
              We use cookies
            </h2>
            <p className="text-primary-fixed-dim text-sm leading-relaxed">
              We use essential cookies to keep the site running and optional
              analytics cookies to understand how visitors use it — no
              advertising or tracking.{" "}
              <Link
                href="/legal/cookies"
                className="underline hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleDecision("accepted")}
            className="flex-1 bg-on-primary text-primary font-manrope font-bold text-sm py-3 rounded-full hover:opacity-90 transition-all active:scale-95"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => handleDecision("declined")}
            className="flex-1 border border-white/20 text-on-primary font-manrope font-medium text-sm py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
