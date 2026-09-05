import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  footerCompanyLinks,
  footerLegalLinks,
  footerServiceLinks,
  siteConfig,
} from "@/lib/site-config";
import { NewsletterSignup } from "@/components/NewsletterSignup";

/**
 * Footer shared by the main marketing pages. Mirrors the Stitch "Footer"
 * component: wordmark + blurb, three link columns, social icons, and a
 * bottom legal bar.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-primary-container text-on-primary-container py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="text-2xl font-newsreader font-bold text-white mb-6">
            JG Creative Tech
          </div>
          <p className="font-manrope text-sm text-white/80 leading-relaxed mb-6">
            {t("blurb")}
          </p>
          <div className="mb-6">
            <p className="text-white font-bold font-newsreader text-sm mb-3">
              {t("stayInLoop")}
            </p>
            <NewsletterSignup />
          </div>
          <p className="font-manrope text-sm text-white/80">
            {t("copyright", { year })}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <nav aria-label={t("servicesLandmark")}>
            <h2 className="text-white font-bold font-newsreader text-lg mb-6">
              {t("services")}
            </h2>
            <ul className="space-y-4 font-manrope text-sm">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("companyLandmark")}>
            <h2 className="text-white font-bold font-newsreader text-lg mb-6">
              {t("company")}
            </h2>
            <ul className="space-y-4 font-manrope text-sm">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-white font-bold font-newsreader text-lg mb-6">
              {t("connect")}
            </h2>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("linkedinLabel")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("githubLabel")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.42.36.78 1.07.78 2.16v3.2c0 .31.2.67.8.56A11.5 11.5 0 0 0 12 .5z" />
                </svg>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                aria-label={t("emailLabel")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  mail
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-8 text-xs font-manrope text-white/70">
          {footerLegalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline font-bold">
              {tNav(link.key)}
            </Link>
          ))}
        </div>
        <div className="text-xs font-manrope text-white/70 italic">
          {t("craftedIn")}
        </div>
      </div>
    </footer>
  );
}
