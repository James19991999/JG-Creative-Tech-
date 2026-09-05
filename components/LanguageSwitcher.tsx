"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  sw: "SW",
};

/**
 * Switches between English and Swahili while staying on the same
 * page (e.g. /about <-> /sw/about). Uses next-intl's locale-aware
 * router, which handles the "as-needed" prefix rewriting (English
 * drops the prefix, Swahili adds /sw/) automatically.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-0.5 border border-outline-variant rounded-full p-0.5"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={locale === loc}
          aria-label={loc === "en" ? "Switch to English" : "Badili kwa Kiswahili"}
          className={`px-2.5 py-1 rounded-full text-xs font-manrope font-bold transition-colors ${
            locale === loc
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-ink"
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
