import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Innovation",
  description:
    "Experimental tech designed to scale the Kenyan digital economy through intentional infrastructure and agile R&D.",
  alternates: { canonical: "/innovation-lab" },
};

const experiments = [
  {
    status: "In-Lab",
    statusClass: "bg-secondary-container text-on-secondary-container",
    icon: "science",
    title: "AI-Driven Logistics Optimization",
    description:
      "Leveraging neural networks to solve last-mile delivery challenges in high-density urban areas.",
  },
  {
    status: "Beta",
    statusClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    icon: "token",
    title: "Blockchain for Local Supply Chains",
    description:
      "Securing transparency for agricultural exports through decentralized ledger protocols.",
  },
  {
    status: "Proof of Concept",
    statusClass: "bg-surface-container-highest text-on-surface-variant",
    icon: "precision_manufacturing",
    title: "Edge-Computing for Rural IoT",
    description:
      "Reducing latency in remote sensing networks through localized data processing units.",
    image: null,
    imageAlt: "",
  },
];

const stack = [
  {
    icon: "memory",
    title: "Rust & Safety",
    description:
      "Building memory-safe, blazing-fast systems that redefine reliability in local finance tech.",
  },
  {
    icon: "web_asset",
    title: "WebAssembly (Wasm)",
    description:
      "Bringing near-native performance to the browser for complex data visualization and local tools.",
  },
  {
    icon: "cloud_sync",
    title: "Edge Computing",
    description:
      "Distributing computation away from centralized clouds to the network's periphery for instant response.",
  },
];

export default function InnovationLabPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="Back to home" className="material-symbols-outlined text-ink">
              menu
            </a>
            <h1 className="font-newsreader text-xl font-bold text-ink">Innovation</h1>
          </div>
          <a href="/about" aria-label="About JG Creative Tech" className="w-10 h-10 rounded-full overflow-hidden block">
            <Logo className="w-10 h-10 text-sm" />
          </a>
        </div>
      </header>

      <main id="main-content" className="pt-20 pb-32">
        {/* Hero Section */}
        <section className="px-6 py-12 relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-br from-primary to-primary-container opacity-95" />
          <div className="relative z-10">
            <span className="inline-block text-on-tertiary-container font-manrope text-xs tracking-widest uppercase mb-4">
              The Digital Frontier
            </span>
            <h2 className="font-newsreader text-5xl font-bold text-on-primary leading-tight mb-6">
              Architecting the Future.
            </h2>
            <p className="font-body text-on-primary/80 text-lg leading-relaxed max-w-md">
              Experimental Tech designed to scale the Kenyan digital
              economy through intentional infrastructure and agile R&amp;D.
            </p>
          </div>
        </section>

        {/* Active Experiments (Bento-style Grid) */}
        <section className="px-6 py-16 bg-surface-container-low">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-on-tertiary-container" />
            <h3 className="font-newsreader text-2xl font-bold text-ink">Active Experiments</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {experiments.map((exp) => (
              <div
                key={exp.title}
                className="bg-surface-container-lowest p-6 rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 ${exp.statusClass} text-[10px] font-bold uppercase tracking-wider rounded-full`}>
                    {exp.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">
                    {exp.icon}
                  </span>
                </div>
                <h4 className="font-newsreader text-xl font-bold text-ink mb-3">{exp.title}</h4>
                <p className="text-on-surface-variant text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Deep Dive */}
        <section className="px-6 py-16">
          <h3 className="font-newsreader text-2xl font-bold text-ink mb-8 text-center italic">
            The Architecture of Performance
          </h3>
          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {stack.map((item) => (
              <div key={item.title} className="flex items-start gap-6">
                <div className="w-12 h-12 flex-shrink-0 bg-primary-container rounded-xl flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-manrope font-bold text-ink mb-1">{item.title}</h4>
                  <p className="text-on-surface-variant text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visionary Statement */}
        <section className="px-6 py-20 bg-primary text-on-primary text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute -top-12 -left-12 w-48 h-48 bg-on-tertiary-container opacity-10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-on-tertiary-container mb-6 inline-block scale-150" aria-hidden="true">
              format_quote
            </span>
            <blockquote className="font-newsreader text-2xl italic leading-snug mb-8">
              &quot;Digital sovereignty is the foundation of the next
              decade. We aren&apos;t just adopting tech; we are building
              the digital infrastructure that will anchor Kenya&apos;s
              economic resurgence.&quot;
            </blockquote>
            <p className="font-manrope text-xs uppercase tracking-[0.2em] text-on-primary/60">
              JG Innovation Council, 2026
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 text-center">
          <h3 className="font-newsreader text-3xl font-bold text-ink mb-4">Ready to pioneer?</h3>
          <p className="font-body text-on-surface-variant mb-10 max-w-xs mx-auto">
            Join our ecosystem and co-create the next standard of
            enterprise technology.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg transition-transform active:scale-95"
          >
            Collaborate on a Pilot
          </a>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}
