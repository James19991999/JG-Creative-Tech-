import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { ArchitecturalArt } from "@/components/ArchitecturalArt";

export const metadata: Metadata = {
  title: "Digital Strategy",
  description:
    "We don't just build tools; we design the roadmap for your digital dominance. Engineering institutional stability through intentional digital craftsmanship.",
  alternates: { canonical: "/digital-strategy" },
};

const framework = [
  {
    number: "01",
    icon: "analytics",
    title: "Deep Audit",
    description:
      "We dissect your current digital presence, identifying structural leaks and hidden opportunities in your local market.",
  },
  {
    number: "02",
    icon: "map",
    title: "Strategic Mapping",
    description:
      "We engineer a bespoke roadmap aligning your technical infrastructure with your long-term commercial objectives.",
  },
  {
    number: "03",
    icon: "trending_up",
    title: "Precision Scale",
    description:
      "Execution phase focused on sustainable growth, ensuring your platform scales seamlessly with demand.",
  },
];

export default function DigitalStrategyPage() {
  return (
    <>
      <SiteHeader activeHref="/digital-strategy" />

      <main id="main-content" className="pt-24 pb-28 md:pb-0">
        {/* Hero */}
        <section className="relative px-6 md:px-8 py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-6 block">
                Premium Architecture
              </span>
              <h1 className="font-newsreader text-5xl md:text-7xl text-ink leading-tight mb-8">
                Architecting Your <br />
                <span className="italic text-ink">
                  Growth Strategy.
                </span>
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                We don&apos;t just build tools; we design the roadmap for
                your digital dominance. Engineering institutional stability
                through intentional digital craftsmanship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/schedule-consultation" size="lg">
                  Book a Strategic Session
                </Button>
                <Button href="/digital-architecture" variant="tertiary" icon="arrow_forward">
                  Our Methodology
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
                <ArchitecturalArt
                  variant="network"
                  label="Abstract illustration of connected strategic nodes"
                  className="absolute inset-0 w-full h-full"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-8 rounded-xl shadow-2xl max-w-xs hidden lg:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-on-tertiary-container rounded-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined" aria-hidden="true">query_stats</span>
                  </div>
                  <div className="font-bold text-ink text-xl">+124% Growth</div>
                </div>
                <p className="text-on-surface-variant text-sm">
                  Average digital ROI for Kenyan SMEs following our
                  Strategic Framework.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Framework */}
        <section className="bg-surface-container-low py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-on-tertiary-container" />
                  <h2 className="font-newsreader text-4xl text-ink font-bold">
                    The Strategic Framework
                  </h2>
                </div>
                <p className="text-on-surface-variant text-lg">
                  Our proprietary 3-step process designed to elevate local
                  businesses to a global visual and operational standard.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {framework.map((step) => (
                <div
                  key={step.number}
                  className="relative overflow-hidden bg-surface-container-lowest p-10 rounded-xl hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                >
                  <div aria-hidden="true" className="absolute top-0 right-0 p-4 font-newsreader text-6xl text-on-surface-variant/65">
                    {step.number}
                  </div>
                  <span className="material-symbols-outlined text-4xl text-ink mb-8 block" aria-hidden="true">
                    {step.icon}
                  </span>
                  <h3 className="text-2xl font-bold text-ink mb-4">{step.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data-Driven Insights */}
        <section className="py-24 px-6 md:px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-primary-container rounded-xl p-12 text-on-primary flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                <div className="relative z-10">
                  <h2 className="font-newsreader text-4xl mb-6 leading-tight">
                    Data-Driven <br />
                    <span className="text-secondary-fixed">Growth Engines.</span>
                  </h2>
                  <p className="text-primary-fixed/80 max-w-md text-lg leading-relaxed mb-8">
                    We transform raw analytics into actionable intelligence.
                    Leverage real-time insights to pivot faster than the
                    competition.
                  </p>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-secondary-fixed mb-1">
                      Efficiency
                    </div>
                    <div className="text-3xl font-bold">+45%</div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 grid grid-rows-2 gap-6">
                <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-center">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-4" aria-hidden="true">hub</span>
                  <h3 className="text-xl font-bold text-ink mb-2">Connected Ecosystems</h3>
                  <p className="text-on-surface-variant text-sm">
                    Synchronizing your digital touchpoints into one cohesive
                    growth funnel.
                  </p>
                </div>
                <a
                  href="/client-portal"
                  className="bg-on-tertiary-fixed rounded-xl p-8 flex items-center justify-between hover:bg-on-tertiary-fixed-variant transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Strategic Dashboards</h3>
                    <p className="text-white/60 text-sm">Visualize your trajectory with precision.</p>
                  </div>
                  <span className="material-symbols-outlined text-white text-3xl" aria-hidden="true">
                    chevron_right
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Stability */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                    <ArchitecturalArt
                      variant="tower"
                      label="Abstract illustration of a building elevation"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <ArchitecturalArt
                      variant="planes"
                      label="Abstract illustration of overlapping architectural planes"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
                <div className="pt-12 space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <ArchitecturalArt
                      variant="network"
                      label="Abstract illustration of connected data nodes"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                    <ArchitecturalArt
                      variant="planes"
                      label="Abstract illustration of overlapping architectural planes"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-6 block">
                Long-Term Resilience
              </span>
              <h2 className="font-newsreader text-5xl text-ink leading-tight mb-8">
                Engineering <br />
                <span className="italic">Institutional Stability.</span>
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Our strategies are built on bedrock, not sand. We ensure
                your digital infrastructure can withstand market shifts,
                technical evolutions, and rapid scaling without
                compromising performance.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-accent" aria-hidden="true">
                    verified_user
                  </span>
                  <div>
                    <span className="block font-bold text-ink">Risk Mitigation</span>
                    <span className="text-on-surface-variant text-sm">
                      Hardened architectures that protect your brand equity.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-accent" aria-hidden="true">
                    history
                  </span>
                  <div>
                    <span className="block font-bold text-ink">Future-Proofing</span>
                    <span className="text-on-surface-variant text-sm">
                      Continuous evolution cycles that keep you ahead of the
                      curve.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-5xl mx-auto bg-surface-container-low rounded-3xl p-16 text-center">
            <h2 className="font-newsreader text-4xl md:text-5xl text-ink mb-8">
              Ready to dominate your <br />
              digital landscape?
            </h2>
            <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto">
              Join the leading Kenyan SMEs who have transformed their
              digital trajectory with JG Creative Tech.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button href="/schedule-consultation" size="lg">
                Book a Strategic Session
              </Button>
              <Button href="/portfolio" variant="tertiary">
                View Our Work
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
