import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { Logo } from "@/components/Logo";
import { ArchitecturalArt } from "@/components/ArchitecturalArt";

export const metadata: Metadata = {
  title: "Select a Consultation Time",
  description:
    "Choose a date and time that fits your infrastructure roadmap. Our architects are ready to translate your vision into a scalable digital blueprint.",
  alternates: { canonical: "/schedule-consultation" },
  robots: { index: false, follow: false },
};

export default function ScheduleConsultationPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-secondary-container min-h-screen">
      {/* TopAppBar - deliberately minimal (no primary nav) to keep this
          focused-onboarding step free of distraction, same as
          /get-started/discovery. The two-step progress indicator below
          is what actually communicates where the person is in the
          flow - a full nav row here would be redundant with it. */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center px-6 md:px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <a href="/" aria-label="JG Creative Tech — Home" className="shrink-0">
            <Logo className="w-10 h-10 text-lg" />
          </a>
        </div>
      </header>

      <main id="main-content" className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 max-w-xs">
            <span className="text-accent font-manrope text-sm uppercase tracking-widest font-bold">
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
            <h1 className="font-newsreader text-5xl text-ink tracking-tight">
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
            <ArchitecturalArt
              variant="planes"
              label="Abstract illustration of overlapping architectural planes"
              className="absolute inset-0 w-full h-full"
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
            <h2 className="font-newsreader text-3xl text-ink">
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
                <p className="text-4xl font-newsreader text-accent">25+</p>
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  Projects Delivered
                </p>
              </div>
              <div>
                <p className="text-4xl font-newsreader text-accent">2+yr</p>
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
            © 2026 JG Creative Tech Solution. Crafted in Nairobi for the
            Global Stage.
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
