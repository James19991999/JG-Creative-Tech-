import type { Metadata } from "next";
import Image from "next/image";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Digital Architecture",
  description:
    "We don't just build software; we engineer digital sovereignty. Frameworks designed to withstand the pressures of scale while maintaining the elegance of high-end craft.",
  alternates: { canonical: "/digital-architecture" },
};

const sidebarItems: SidebarItem[] = [
  { label: "Principles", href: "/digital-architecture#principles", icon: "account_tree" },
  { label: "Technology Stack", href: "/digital-architecture#stack", icon: "layers" },
  { label: "System Infrastructure", href: "/digital-architecture", icon: "cloud_done" },
  { label: "Case Studies", href: "/portfolio", icon: "menu_book" },
];

const principles = [
  {
    icon: "security",
    title: "Resilience",
    description:
      "Self-healing systems designed to maintain continuity under extreme load and unpredictable environmental shifts.",
  },
  {
    icon: "unfold_more",
    title: "Scalability",
    description:
      "Elastic infrastructure that expands and contracts with your user base, ensuring performance never lags behind growth.",
  },
  {
    icon: "shield_person",
    title: "Sovereignty",
    description:
      "Ownership of data and logic. We build portable, open-standard systems that keep you in control of your digital destiny.",
  },
];

const stack = [
  { name: "Next.js", label: "Frontend Engine" },
  { name: "Go/Rust", label: "Logic & Performance" },
  { name: "AWS/GCP", label: "Global Cloud" },
  { name: "Postgres", label: "Relational Truth" },
];

const lifecycle = [
  {
    title: "Discovery & Mapping",
    description:
      "We begin by auditing your current technical debt and mapping the future requirements of your business ecosystem.",
  },
  {
    title: "The Blueprint Phase",
    description:
      "Detailed schema design, infrastructure-as-code planning, and security protocol definition before a single line of logic is written.",
  },
  {
    title: "Agile Deployment",
    description:
      "Phased rollouts with continuous integration and automated testing pipelines to ensure zero-downtime evolution.",
  },
];

export default function DigitalArchitecturePage() {
  return (
    <>
      <Sidebar items={sidebarItems} activeHref="/digital-architecture" brandLabel="Architectural Framework" />

      <main id="main-content" className="lg:ml-20 xl:ml-64 pb-28 md:pb-0">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center px-6 md:px-8 py-24 overflow-hidden bg-surface">
          <div className="max-w-4xl relative z-10">
            <span className="text-on-tertiary-fixed-variant font-manrope text-xs tracking-widest uppercase mb-4 block">
              Structural Integrity
            </span>
            <h1 className="text-6xl md:text-8xl font-headline italic tracking-tight text-primary leading-tight mb-8">
              Architecture as a <br />
              <span className="not-italic font-bold">Foundation</span>
            </h1>
            <p className="text-xl text-on-surface-variant font-body max-w-xl leading-relaxed mb-10">
              We don&apos;t just build software; we engineer digital
              sovereignty. Our frameworks are designed to withstand the
              pressures of scale while maintaining the elegance of
              high-end craft.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button href="/schedule-consultation" size="lg">
                Initiate Consultation
              </Button>
              <Button href="/digital-strategy" variant="secondary" size="lg">
                The Blueprint
              </Button>
              <Button href="/strategic-context" variant="tertiary" icon="arrow_forward">
                Define Your Strategic Context
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-20">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBssQ00PgBeiHmhXhUEse-qlTR0_V7q17obmYe4gmbBFkHYSr5VrhhWco6Coiqr4hyIJEthwJ7NTO763kOKhCl5XBoyPV1dbOFYC966x760dztmRLtyUwA9Us5sbi1gn3rbx2zdwVQPZINfjlIFucWF0ghUPNn9FtXTI1XLzup5UYXZo4KlnZxI1y8crupAeG5hJcUiXllx3JT0tDJORof-x2gov8K_nSoLJh0VtjS2mSEeecE1FD1mJ4iaWY5zS_w5MFO6aZMBlw"
              alt=""
              fill
              priority
              className="object-cover grayscale"
            />
          </div>
        </section>

        {/* Core Principles */}
        <section id="principles" className="scroll-mt-24 px-6 md:px-8 py-24 bg-surface-container-low">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-1 h-12 bg-on-tertiary-container" />
              <h2 className="text-4xl font-headline font-bold text-primary">
                Core Principles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="bg-surface-container-lowest p-10 rounded-xl hover:bg-surface-container-high transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-4xl text-secondary mb-6 block" aria-hidden="true">
                    {p.icon}
                  </span>
                  <h3 className="text-2xl font-newsreader font-bold mb-4">{p.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="scroll-mt-24 px-6 md:px-8 py-24 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-headline font-bold text-primary mb-6">
                The Tech Stack
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                A curated selection of high-performance technologies chosen
                for their stability, speed, and developer ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stack.map((tech) => (
                <div
                  key={tech.name}
                  className="group relative overflow-hidden rounded-xl aspect-square bg-surface-container flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-primary-container"
                >
                  <span className="text-4xl font-black font-manrope text-primary group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                  <span className="mt-4 text-xs tracking-widest uppercase opacity-60 group-hover:text-white transition-colors">
                    {tech.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure Lifecycle */}
        <section className="px-6 md:px-8 py-24 bg-primary-container text-on-primary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-headline italic mb-16 text-on-primary-container">
              Infrastructure Lifecycle
            </h2>
            <ol className="space-y-16 relative">
              <div aria-hidden="true" className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
              {lifecycle.map((step, index) => (
                <li key={step.title} className="relative flex flex-col md:flex-row gap-8 md:pl-20 items-start">
                  <div className="absolute left-2 md:left-4 top-0 w-8 h-8 rounded-full bg-on-tertiary-container flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-newsreader font-bold mb-2">{step.title}</h3>
                    <p className="text-on-primary-container/80 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-32 bg-surface">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-8">
              Build Your Future
            </h2>
            <p className="text-xl text-on-surface-variant mb-12">
              Ready to solidify your agency&apos;s digital foundation?
              Let&apos;s discuss your architectural needs.
            </p>
            <Button href="/schedule-consultation" variant="primary" size="lg" icon="arrow_forward">
              Start the Blueprint
            </Button>
          </div>
        </section>

        <SiteFooter />
      </main>

      <MobileBottomNav />
    </>
  );
}
