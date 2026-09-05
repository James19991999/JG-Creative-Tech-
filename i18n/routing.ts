import { defineRouting } from "next-intl/routing";

/**
 * "as-needed" prefix strategy: the default locale (English) keeps
 * every existing URL exactly as it is today (/about, /solutions, ...)
 * - no SEO regression on the site's current indexed pages. Swahili
 * gets a real, separate, crawlable URL under /sw/... for every page
 * (e.g. /sw/about) rather than a client-side text swap that search
 * engines can't index as distinct content.
 */
export const routing = defineRouting({
  locales: ["en", "sw"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
