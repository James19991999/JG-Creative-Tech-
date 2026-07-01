import type { Metadata } from "next";
import Image from "next/image";
import { StrategicContextForm } from "@/components/StrategicContextForm";

export const metadata: Metadata = {
  title: "Strategic Context | Discovery Session",
  description:
    "Help us understand the landscape of your digital ecosystem to better architect your solution.",
  alternates: { canonical: "/strategic-context" },
  robots: { index: false, follow: false },
};

export default function StrategicContextPage() {
  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed w-full top-0 z-50 bg-surface/80 backdrop-blur-md glass-nav whisper-shadow">
        <nav className="flex items-center justify-between px-8 py-6 max-w-full mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">
              analytics
            </span>
            <span className="font-newsreader text-2xl italic font-bold text-primary">
              Discovery Session
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="text-primary border-b-2 border-primary font-bold text-sm tracking-wide uppercase">
              Strategic Context
            </span>
            <a
              className="text-on-surface-variant font-normal text-sm tracking-wide uppercase hover:bg-surface-container-low transition-colors duration-300 px-3 py-1 rounded"
              href="/digital-architecture"
            >
              Methodology
            </a>
            <a
              className="text-on-surface-variant font-normal text-sm tracking-wide uppercase hover:bg-surface-container-low transition-colors duration-300 px-3 py-1 rounded"
              href="/digital-strategy"
            >
              Framework
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/client-portal" aria-label="Account">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">
                account_circle
              </span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-on-tertiary-fixed-variant font-bold text-xs uppercase tracking-[0.2em] block mb-1">
                Architecture Journey
              </span>
              <span className="font-newsreader text-xl text-primary">
                Step 2 of 2: Finalizing Strategy
              </span>
            </div>
            <span className="font-manrope font-bold text-primary">100%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container w-full rounded-full" />
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="font-newsreader text-5xl md:text-6xl text-primary leading-tight mb-6">
                Strategic Context
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Help us understand the landscape of your digital ecosystem
                to better architect your solution.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[4/5] hidden lg:block whisper-shadow">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMkc188ebDz6jVZoUXpvtqUEsBYukLiQxiiL9Rem5QhQNN2OGPjJxAJ3yq3qVToqKoOAIQeHZiziowZD1LPnHwPBuN1msXHP19q5PntZ25HsygJWVKFz5KtG0EwVC9j_0-ee2niULgegzglJ5na8RZKPdlHSS221b_q9f_mTEFfIRC8BkOBbg2shSVFCuGyjlRgAr7YC8h1fYLixtXrY3OT9lWvbpXhVvZCYZ_mgdJBsCVMiB4hG5dJqEYrlAV57xawqTxzyGUfQ"
                alt="Modern architectural blueprint on a clean white desk with minimalist office supplies"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-newsreader italic text-xl">
                  &quot;Infrastructure is the silent partner of
                  innovation.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <StrategicContextForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container w-full py-12 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <span className="font-newsreader text-xl font-semibold text-primary-container">
              The Digital Architect
            </span>
            <p className="font-manrope text-sm text-on-surface-variant max-w-xs">
              © 2026 JG Creative Tech Solution. Editorial Digital
              Infrastructure for Global SMEs.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="font-manrope text-sm tracking-wide uppercase text-on-surface-variant hover:text-secondary transition-all duration-200"
              href="/digital-strategy"
            >
              Strategic Framework
            </a>
            <a
              className="font-manrope text-sm tracking-wide uppercase text-on-surface-variant hover:text-secondary transition-all duration-200"
              href="/digital-architecture"
            >
              Architecture Methodology
            </a>
            <a
              className="font-manrope text-sm tracking-wide uppercase text-on-surface-variant hover:text-secondary transition-all duration-200"
              href="/legal/terms"
            >
              Legal Integrity
            </a>
            <a
              className="font-manrope text-sm tracking-wide uppercase text-on-surface-variant hover:text-secondary transition-all duration-200"
              href="/contact"
            >
              Executive Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
