import type { Metadata } from "next";
import Image from "next/image";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnvB3CDDXBtIJ-T-6cKTHNh6TvW9YKMIgBNq6yQ7YqxYUZT0ucM9sgjDLqIb5i7zg5QJInH-WOT-sRRcCMXBDQnNBMARl3i3KQ3Xk8rxpXTqw_dX7M1gzr3vKlEvXvswU_XgWjNjDbfFLN83ZCNemDdTeISR5vX1NgOXsFcFzzyccO1eVzRLbxI5rpfxkXfquoMlK2blq7EoubDFL256afIY335j-9XjSqQdFuLswfFmJDVjhns4PPUBi-DjTJcyy6rbTaC1xbuQ",
    imageAlt:
      "Modern logistics hub with automated sorting systems and digital displays in a clean industrial setting with blue highlights",
  },
  {
    status: "Beta",
    statusClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    icon: "token",
    title: "Blockchain for Local Supply Chains",
    description:
      "Securing transparency for agricultural exports through decentralized ledger protocols.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCALelTs8iWU4VC7fiZlm6qRhjcWHfSfe7zRUVVFLA954cuCem1y2vCNYUgHk6ZLIaeK_bp6mSMX9HpVYU86MCcy3Q6GWQaLZHM6bKoOWK4EP0XsqMSz23qBCGtSaSaVVPFYb1W80jGqPPnRJ0ZobjMWgeSE6vmlxbM_ysZPSnOAiJi7Itzh_Vh4mWpPgMOiCZU5S5p-AvQy3n3HPIs78WzoYlUsCl_LnM-rW7LFk4eT_v8JtDDf-2v6Xq3zCO68lZs7B185-lVHA",
    imageAlt:
      "Crystalline digital data structures floating in a dark void with sharp lighting and cyan energy nodes",
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
            <a href="/" aria-label="Back to home" className="material-symbols-outlined text-primary">
              menu
            </a>
            <h1 className="font-newsreader text-xl font-bold text-primary">Innovation</h1>
          </div>
          <a href="/about" aria-label="About JG Creative Tech" className="w-10 h-10 rounded-full overflow-hidden block">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWB5Qslv_JuNPmG9UdNzWu78-pJ-c_T1z8ivmz4T06uRMpNTtrWYMVPHsCvJe4CL6tx1982MMorj2SDHzxC29RQy4E0RxzlunptSqxSbnDpUL0e0G5vOsEUHduUEvcllV06ro_DWKsRf0ZuPBK5KU5SLYAucmkeyzIKoXdLklpmbPQwcFxjbVYDreEuLVLWwd1UgP3vg4tPtIvLwmrNJUL9bNUkY-1cQLO2vumLogeFCk4gUqItq7Xpd6RLdfi7QtJ6xTaKSbCHw"
              alt="Creative director portrait"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      </header>

      <main id="main-content" className="pt-20 pb-32">
        {/* Hero Section */}
        <section className="px-6 py-12 relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-br from-primary to-primary-container opacity-95" />
          <div aria-hidden="true" className="absolute inset-0 z-0 mix-blend-overlay opacity-40">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQxdB86Z4XKXXe-qFJ8FcE4Fp8ZOhV0Ys9G2RSEoWJ-s_MI2yPRKQtcdDjrK711bUekSG6vthIp0ZZJRk7rndPGjkaBIZNdFDGI1T5gYAczul8ufEqeLHJEKwRzlXDM9A6A-KdgfDzxi5-mBoAnZawBINYrhuXZo3CD6fjqYEeBJTz8CCqc7V2ApImWt4_7JjQrPrSNa4xnQxNGXg46lcdnxYxyR-44b2PAVYLeY8p9OddMgkBMC9P7q_ZN7XuyktY2HP_96LdCQ"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
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
            <h3 className="font-newsreader text-2xl font-bold text-primary">Active Experiments</h3>
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
                  <span className="material-symbols-outlined text-outline" aria-hidden="true">
                    {exp.icon}
                  </span>
                </div>
                <h4 className="font-newsreader text-xl font-bold text-primary mb-3">{exp.title}</h4>
                <p className={exp.image ? "text-on-surface-variant text-sm mb-6" : "text-on-surface-variant text-sm"}>
                  {exp.description}
                </p>
                {exp.image ? (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <Image src={exp.image} alt={exp.imageAlt} fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Deep Dive */}
        <section className="px-6 py-16">
          <h3 className="font-newsreader text-2xl font-bold text-primary mb-8 text-center italic">
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
                  <h5 className="font-manrope font-bold text-primary mb-1">{item.title}</h5>
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
          <h3 className="font-newsreader text-3xl font-bold text-primary mb-4">Ready to pioneer?</h3>
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
