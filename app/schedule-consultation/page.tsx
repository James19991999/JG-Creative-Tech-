import type { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Select a Consultation Time | The Digital Architect",
  description:
    "Choose a date and time that fits your infrastructure roadmap. Our architects are ready to translate your vision into a scalable digital blueprint.",
  alternates: { canonical: "/schedule-consultation" },
  robots: { index: false, follow: false },
};

export default function ScheduleConsultationPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-secondary-container min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "1.75rem" }} aria-hidden="true">
              architecture
            </span>
            <span className="text-2xl font-newsreader text-primary tracking-tight">
              The Digital Architect
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant font-manrope font-medium hover:bg-surface-container-low transition-colors px-3 py-2 rounded" href="/get-started/discovery">
              Discovery
            </a>
            <span className="text-primary font-manrope font-semibold px-3 py-2 rounded">
              Consultation
            </span>
            <a className="text-on-surface-variant font-manrope font-medium hover:bg-surface-container-low transition-colors px-3 py-2 rounded" href="/about">
              Agency
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 max-w-xs">
            <span className="text-on-tertiary-fixed-variant font-manrope text-sm uppercase tracking-widest font-bold">
              Step 2 of 2
            </span>
            <span className="text-on-surface-variant text-sm font-medium">Finalizing Schedule</span>
          </div>
          <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container w-full" />
          </div>
        </div>

        {/* Header */}
        <header className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-on-tertiary-container" />
            <h1 className="font-newsreader text-5xl text-primary tracking-tight">
              Select a Consultation Time
            </h1>
          </div>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Choose a date and time that fits your infrastructure roadmap.
            Our architects are ready to translate your vision into a
            scalable digital blueprint.
          </p>
        </header>

        <BookingForm />

        {/* Extra Content: Trust Section (Asymmetric) */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-xl overflow-hidden h-[400px]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4xoNEV6q-NQhudsHrv1OEY7_R5WMTystabX8OOzCQBU2rc1pIpm5Xesdfr0Tjz8k6VOv2MBQcRL7BgEUBUbOUe4OItB-U7bqusbSfXTuNn2FKni6L-vVbsPSVLLQXoD8JcY64RmBLwmP6htOFYDm-mse5qceqkxupmN8Gkg_GkunauSlrebNfbra6F8HEaCmOqmfHqHb7R9lJZFwXGl8xqj3K_DkQmP_BA44EFjRvsZBKJ4095_NQElLmweRV6REk3QCVdOkULQ"
              alt="Ultra modern minimal office space with large windows and sophisticated architectural lighting"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white font-newsreader text-2xl leading-tight">
                &quot;The quality of the architecture defines the longevity
                of the business.&quot;
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-newsreader text-3xl text-primary">
              Institutional stability for the digital age.
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              At JG Creative Tech, we don&apos;t just build software. We
              engineer the digital bone structure that allows Kenyan SMEs
              to scale beyond borders. Our consultations are the first
              step in creating that resilient foundation.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-4xl font-newsreader text-on-tertiary-fixed-variant">25+</p>
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  Projects Delivered
                </p>
              </div>
              <div>
                <p className="text-4xl font-newsreader text-on-tertiary-fixed-variant">2+yr</p>
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  Avg Experience
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 mt-24 bg-primary text-on-primary-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-screen-2xl mx-auto">
          <p className="font-manrope text-sm uppercase tracking-widest">
            © 2026 JG Creative Tech Solution. Institutional Stability
            through Agile Innovation.
          </p>
          <div className="flex flex-wrap gap-8 justify-start md:justify-end">
            <a className="font-manrope text-sm uppercase tracking-widest hover:text-white transition-colors" href="/get-started/discovery">
              Discovery
            </a>
            <a className="font-manrope text-sm uppercase tracking-widest hover:text-white transition-colors" href="/legal/privacy">
              Privacy
            </a>
            <a className="font-manrope text-sm uppercase tracking-widest hover:text-white transition-colors" href="/legal/terms">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
