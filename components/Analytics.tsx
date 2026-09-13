"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useCookieConsent } from "@/lib/cookie-consent";

/**
 * Google Analytics 4 via gtag.js, wired to this site's real cookie
 * consent state through Google's Consent Mode v2 - not just "load the
 * script if consented, skip it otherwise." Verified this is Google's
 * actual current recommended pattern before building it this way
 * (rather than assumed): a consent-gated site should still load
 * gtag.js and call `consent: default` with everything denied
 * immediately, then send `consent: update` once the visitor decides,
 * so Google's tags never fire without an explicit signal about what
 * they're allowed to do - simply not injecting the script tag at all
 * until consent is granted skips this signal entirely.
 *
 * Maps this site's two existing cookie categories (analytics,
 * marketing - see lib/cookie-consent.ts and CookiePreferences.tsx) to
 * the four Consent Mode v2 signals: analytics -> analytics_storage,
 * marketing -> ad_storage/ad_user_data/ad_personalization. This site
 * doesn't run Google Ads today, but wiring the marketing signal
 * correctly now means it's already in place if that ever changes,
 * rather than needing rework later.
 *
 * Renders nothing at all if NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set -
 * no script tags, no console errors - matching how every other
 * optional integration in this project degrades when unconfigured.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function toSignal(granted: boolean): "granted" | "denied" {
  return granted ? "granted" : "denied";
}

function consentUpdatePayload(analytics: boolean, marketing: boolean) {
  return {
    analytics_storage: toSignal(analytics),
    ad_storage: toSignal(marketing),
    ad_user_data: toSignal(marketing),
    ad_personalization: toSignal(marketing),
  };
}

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!measurementId || consent === "loading" || !consent.hasDecided) return;
    if (typeof window.gtag !== "function") return;

    window.gtag("consent", "update", consentUpdatePayload(consent.analytics, consent.marketing));
  }, [measurementId, consent]);

  if (!measurementId) return null;

  return (
    <>
      {/* Must run before gtag.js itself, so Google's tags never fire
          without a default consent state already in place. */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
