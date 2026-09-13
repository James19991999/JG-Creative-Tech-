"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Single source of truth for cookie consent, shared by CookieBanner
 * (accept all / decline) and CookiePreferences (granular per-category
 * toggles on /legal/cookies). Before this, the two components wrote to
 * two different, disconnected localStorage keys - a visitor could
 * "Decline" in the banner, then separately flip Analytics on in the
 * detailed panel, and the two would just disagree with no reconciliation.
 * Now both read and write the exact same state through this hook.
 *
 * Migrates the old simple "jg-cookie-consent" ("accepted"/"declined")
 * key on first read if the new unified key doesn't exist yet, so a
 * real visitor's prior decision under the old system carries over
 * correctly instead of silently resetting to "undecided."
 */

const STORAGE_KEY = "jg-cookie-consent-detailed";
const LEGACY_SIMPLE_KEY = "jg-cookie-consent";
const CONSENT_CHANGED_EVENT = "jg-cookie-consent-changed";

export type CookieConsent = {
  hasDecided: boolean;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: CookieConsent = {
  hasDecided: false,
  analytics: false,
  marketing: false,
};

function readConsent(): CookieConsent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        hasDecided: Boolean(parsed.hasDecided),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      };
    }

    // One-time migration from the old simple accept/decline key
    const legacy = localStorage.getItem(LEGACY_SIMPLE_KEY);
    if (legacy === "accepted") {
      return { hasDecided: true, analytics: true, marketing: true };
    }
    if (legacy === "declined") {
      return { hasDecided: true, analytics: false, marketing: false };
    }
  } catch {
    // localStorage unavailable - fall through to default
  }
  return DEFAULT_CONSENT;
}

function writeConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    // Keep the legacy key in sync too, in case anything still reads it
    localStorage.setItem(
      LEGACY_SIMPLE_KEY,
      consent.analytics && consent.marketing ? "accepted" : "declined"
    );
  } catch {
    // localStorage unavailable - consent still updates in memory for this tab
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
}

export function useCookieConsent() {
  const [consent, setConsentState] = useState<CookieConsent | "loading">("loading");

  useEffect(() => {
    setConsentState(readConsent());

    function handleExternalChange(event: Event) {
      setConsentState((event as CustomEvent<CookieConsent>).detail);
    }
    window.addEventListener(CONSENT_CHANGED_EVENT, handleExternalChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleExternalChange);
  }, []);

  const acceptAll = useCallback(() => {
    const next = { hasDecided: true, analytics: true, marketing: true };
    writeConsent(next);
    setConsentState(next);
  }, []);

  const declineAll = useCallback(() => {
    const next = { hasDecided: true, analytics: false, marketing: false };
    writeConsent(next);
    setConsentState(next);
  }, []);

  const setCategory = useCallback((category: "analytics" | "marketing", value: boolean) => {
    setConsentState((current) => {
      const base = current === "loading" ? DEFAULT_CONSENT : current;
      const next = { ...base, hasDecided: true, [category]: value };
      writeConsent(next);
      return next;
    });
  }, []);

  return { consent, acceptAll, declineAll, setCategory };
}
