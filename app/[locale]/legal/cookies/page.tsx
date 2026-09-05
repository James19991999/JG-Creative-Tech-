import type { Metadata } from "next";
import Image from "next/image";
import { CookiePreferences } from "@/components/CookiePreferences";
import { ClearStorageButton } from "@/components/ClearStorageButton";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How JG Creative Tech Solution uses cookies and tracking technologies to build a seamless, secure, and personalized experience.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-surface selection:bg-on-primary-container selection:text-white min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <a
            href="/"
            aria-label="Back to home"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-ink" aria-hidden="true">
              arrow_back
            </span>
          </a>
          <h1 className="font-newsreader font-semibold text-lg text-ink">Cookie Policy</h1>
        </div>
      </header>

      <main id="main-content" className="pt-24 pb-32 px-6 max-w-4xl mx-auto space-y-16">
        {/* Hero/Introduction Section */}
        <section className="space-y-6">
          <div className="inline-block border-l-4 border-on-tertiary-container pl-4">
            <span className="text-accent font-manrope text-xs font-bold uppercase tracking-widest">
              Digital Infrastructure
            </span>
          </div>
          <h2 className="font-newsreader text-5xl md:text-6xl font-extrabold text-ink leading-tight">
            Architecting your <span className="italic font-normal">digital privacy</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <div className="md:col-span-8 space-y-4">
              <p className="text-on-surface-variant leading-relaxed text-lg">
                At JG Creative Tech, we view transparency as the
                cornerstone of digital stability. This Cookie Policy
                explains how we use tracking technologies to build a
                seamless, secure, and personalized experience for our SME
                partners.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Cookies are small text files stored on your device that
                help us understand how you interact with our platform,
                ensuring that our technical infrastructure remains agile
                and responsive to your specific needs.
              </p>
            </div>
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-sm">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC76Vs4dX0Ww3UM_QEdAZ_uWkQ1F0kPrFJQDa2ki2wk2zwyPvvc8NROUh3WSL0IMRwJLbEg0qsYf6TGt_LZ38qqHUgayBzJHLU9SodgP508qBXWl-viJYHyoxVeEr8Sdd9CjXvYRBA5wa2XlKfw2tbHPyK-447gTGPEJgbZ4gvpUWiTsbBUD9eLdw3b-Cc1QG9BiJTo86j11D3UjyykMsw8gqVZt1E-TJh3zIdS922gxvboegccJJCZW3XAoMrgSZQuLC0ShqGFzw"
                  alt="Modern minimalist architectural detail with clean lines and soft shadows on white concrete surfaces in daylight"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 300px"
                  className="object-cover grayscale opacity-80 mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: Cookie Categories (real toggle state) */}
        <CookiePreferences />

        {/* Retention Section */}
        <section className="bg-surface-container rounded-xl p-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-newsreader text-3xl font-bold text-ink">
              Data Retention Lifecycle
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Cookies have a finite lifecycle. Session cookies expire as
              soon as you close your browser, while persistent cookies
              remain for up to 12 months to remember your regional
              preferences and business settings.
            </p>
            <ClearStorageButton />
          </div>
          <div className="relative">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPEBJ7Ep6bLUtZE6BjGcy-FFksx7RPb4n5Dps15SA3Xe5LlQhw3i4X1PeAU9cRJoehvvLE8c2f-VJN9tjZQhrfRi9x4BQHdtEqihadlCrW4azzZ9a7uTZr-QlzfjrH8f-fKZ3QcHciiD2nWJRAqX4GQQqrJckb8eX4YYuz1DYudg8wJj1sjNG3Cw0N_SxXRVVzc9Day2RQWCDRptjQRTXdZcniGxJquzvWX5qrXQlWntLEkjc1BZsp6ESH2nLG18-0RhA8R6W-yw"
                alt="Top down view of clean office workspace with white notepad, elegant fountain pen, and soft natural window light"
                fill
                sizes="(max-width: 768px) 90vw, 500px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-on-tertiary-fixed-variant text-white px-4 py-2 rounded-lg text-xs font-bold font-manrope uppercase">
              Institutional Standard
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center py-8 border-t border-outline-variant/15">
          <h3 className="font-newsreader text-2xl font-bold text-ink mb-4">
            Inquiries regarding data sovereignty?
          </h3>
          <p className="text-on-surface-variant mb-8 max-w-lg mx-auto">
            If you require clarification on our technical frameworks or
            data retention protocols, please reach out to our specialist.
          </p>
          <a
            className="text-secondary font-bold inline-flex items-center gap-2 group"
            href={`mailto:${siteConfig.contact.dpoEmail}`}
          >
            {siteConfig.contact.dpoEmail}
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform" aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav
        aria-label="Mobile"
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 bg-surface-container-lowest z-50 rounded-t-xl border-t border-outline-variant/15 shadow-[0_-8px_24px_rgba(25,28,30,0.06)]"
      >
        <a
          className="flex flex-col items-center justify-center bg-primary-fixed text-primary rounded-full px-5 py-1 active:scale-90 transition-transform"
          href="/legal/cookies"
          aria-current="page"
        >
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            gavel
          </span>
          <span className="font-manrope text-[11px] font-medium tracking-wide uppercase mt-0.5">
            Policy
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-1 hover:bg-surface-container-low active:scale-90 transition-transform"
          href="/legal/privacy"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            tune
          </span>
          <span className="font-manrope text-[11px] font-medium tracking-wide uppercase mt-0.5">
            Preferences
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-1 hover:bg-surface-container-low active:scale-90 transition-transform"
          href="/contact"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            mail
          </span>
          <span className="font-manrope text-[11px] font-medium tracking-wide uppercase mt-0.5">
            Contact
          </span>
        </a>
      </nav>
    </div>
  );
}
