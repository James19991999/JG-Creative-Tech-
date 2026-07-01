import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { PortfolioFilterGrid } from "@/components/PortfolioFilterGrid";
import { portfolioProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A curated anthology of digital ecosystems, institutional infrastructure, and high-performance brand environments engineered for the Kenyan SME frontier.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader activeHref="/portfolio" />

      <main id="main-content" className="pt-32 pb-28 md:pb-32 max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <section className="mb-24">
          <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-6 rounded-full">
            Selected Works
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="font-headline text-5xl md:text-7xl text-primary leading-[1.1] mb-8 italic">
                The Archive of Excellence
              </h1>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-xl">
                A curated anthology of digital ecosystems, institutional
                infrastructure, and high-performance brand environments
                engineered for the Kenyan SME frontier.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-px w-12 bg-outline-variant/30 self-center hidden lg:block" />
              <span className="font-headline text-2xl italic text-secondary/40">
                Est. 2024
              </span>
            </div>
          </div>
        </section>

        <PortfolioFilterGrid projects={portfolioProjects} />

        {/* Platform Performance Stat Banner */}
        <section className="mb-32 bg-primary-container rounded-xl p-12 flex flex-col justify-center text-on-primary relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-9xl">architecture</span>
          </div>
          <div className="relative z-10">
            <span className="font-label text-xs uppercase tracking-[0.3em] text-on-primary-container font-bold mb-4 block">
              Platform Performance
            </span>
            <h2 className="font-headline text-4xl italic mb-8">
              99.9% Operational Reliability across all deployed
              infrastructure.
            </h2>
            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="font-headline text-3xl">12k+</div>
                <div className="font-label text-[10px] uppercase tracking-tighter opacity-60">
                  Monthly Active Users
                </div>
              </div>
              <div>
                <div className="font-headline text-3xl">4ms</div>
                <div className="font-label text-[10px] uppercase tracking-tighter opacity-60">
                  Avg. API Latency
                </div>
              </div>
              <div>
                <div className="font-headline text-3xl">24/7</div>
                <div className="font-label text-[10px] uppercase tracking-tighter opacity-60">
                  Uptime Monitoring
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Behind the Craft Section */}
        <section className="bg-surface-container-low rounded-[32px] p-8 md:p-16 mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline text-4xl text-primary mb-6">
                Behind the Craft
              </h2>
              <p className="font-body text-on-surface-variant mb-8 text-lg">
                We don&apos;t just build sites; we architect systems. Every
                project in our archive adheres to rigorous engineering
                standards designed for longevity.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary" aria-hidden="true">terminal</span>
                  <div>
                    <span className="font-body font-bold block text-primary">
                      Micro-Service Architecture
                    </span>
                    <span className="font-body text-sm text-on-surface-variant">
                      Decoupled frontends with robust Go/Rust backends for
                      ultimate scalability.
                    </span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary" aria-hidden="true">speed</span>
                  <div>
                    <span className="font-body font-bold block text-primary">
                      Edge-First Performance
                    </span>
                    <span className="font-body text-sm text-on-surface-variant">
                      Sub-second load times globally via Vercel Edge &amp;
                      Cloudflare Workers.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm ghost-border">
                <span className="material-symbols-outlined text-on-tertiary-container mb-4 block" aria-hidden="true">cloud</span>
                <h4 className="font-body font-bold text-primary mb-2">Cloud Native</h4>
                <p className="font-body text-xs text-on-surface-variant">AWS &amp; Google Cloud infrastructure.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm ghost-border mt-8">
                <span className="material-symbols-outlined text-on-tertiary-container mb-4 block" aria-hidden="true">security</span>
                <h4 className="font-body font-bold text-primary mb-2">Hardened Security</h4>
                <p className="font-body text-xs text-on-surface-variant">Enterprise-grade encryption by default.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm ghost-border -mt-8">
                <span className="material-symbols-outlined text-on-tertiary-container mb-4 block" aria-hidden="true">database</span>
                <h4 className="font-body font-bold text-primary mb-2">Elastic Data</h4>
                <p className="font-body text-xs text-on-surface-variant">PostgreSQL and NoSQL hybrid systems.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm ghost-border">
                <span className="material-symbols-outlined text-on-tertiary-container mb-4 block" aria-hidden="true">api</span>
                <h4 className="font-body font-bold text-primary mb-2">Seamless APIs</h4>
                <p className="font-body text-xs text-on-surface-variant">GraphQL &amp; RESTful integrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center py-24">
          <h2 className="font-headline text-5xl md:text-7xl text-primary mb-12 italic">
            Ready to build the future?
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Button href="/schedule-consultation" size="lg" className="tracking-widest text-sm uppercase">
              Start Your Own Evolution
            </Button>
            <Button href="/solutions" variant="tertiary" icon="trending_flat" className="tracking-widest text-sm uppercase">
              View All Services
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
