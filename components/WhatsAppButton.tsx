"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";

/**
 * Persistent floating WhatsApp click-to-chat button. For this site's
 * market (Kenyan/East African SME owners), WhatsApp is often the
 * primary channel people expect to reach a business through - this is
 * meant to sit alongside the contact form and command palette search,
 * not replace either.
 *
 * Deliberately hidden on /get-started/discovery and
 * /schedule-consultation: both pages are intentionally built as
 * "focused onboarding" with the main nav suppressed (see their own
 * code comments) specifically to remove distractions while someone is
 * mid-form. A persistent chat bubble there would undercut that same
 * design intent.
 *
 * Positioned to clear MobileBottomNav's ~90px height on mobile
 * (bottom-24) rather than the usual bottom-6, and to sit at
 * bottom-right on desktop where CookieBanner's desktop layout
 * (bottom-left) leaves it clear - checked both before picking this
 * position, not assumed.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const t = useTranslations("whatsapp");

  const hiddenOn = ["/get-started/discovery", "/schedule-consultation"];
  if (hiddenOn.includes(pathname)) return null;

  const href = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encodeURIComponent(
    siteConfig.whatsapp.defaultMessage
  )}`;

  return (
    <div role="complementary" aria-label="Contact via WhatsApp">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("chatOnWhatsApp")}
        className="fixed z-40 bottom-24 right-6 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.05 2C6.578 2 2.14 6.438 2.14 11.91c0 1.899.53 3.674 1.45 5.187L2 22l5.02-1.564a9.86 9.86 0 0 0 5.03 1.374h.004c5.472 0 9.91-4.438 9.91-9.91C21.964 6.428 17.522 2 12.05 2Zm0 18.026a8.075 8.075 0 0 1-4.126-1.13l-.296-.176-3.05.951.966-3.023-.193-.31a8.09 8.09 0 0 1-1.24-4.328c0-4.484 3.65-8.132 8.145-8.132 4.485 0 8.133 3.647 8.133 8.132 0 4.485-3.648 8.133-8.133 8.133Z" />
        </svg>
      </a>
    </div>
  );
}
