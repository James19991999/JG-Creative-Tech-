import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Digital Architect philosophy: how JG Creative Tech builds resilient, editorial-grade digital infrastructure for Kenyan SMEs.",
  alternates: { canonical: "/about" },
};

const coreValues = [
  {
    icon: "verified",
    title: "Integrity",
    description: "Transparent engineering and honest timelines, every project.",
  },
  {
    icon: "bolt",
    title: "Innovation",
    description: "Agile-minded infrastructure that anticipates what's next, not just what's now.",
  },
  {
    icon: "shield_person",
    title: "Resilience",
    description: "Systems built to withstand market shifts and rapid scaling.",
  },
  {
    icon: "design_services",
    title: "Craftsmanship",
    description: "Editorial-grade attention to detail in every interface we ship.",
  },
];

const team = [
  { name: "James Gathuru", role: "Founding Architect" },
  { name: "Sarah Kamau", role: "Strategy Lead" },
  { name: "David Mwangi", role: "Design Collective Lead" },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader activeHref="/about" />

      <main id="main-content" className="pt-32 pb-24">
        {/* Hero */}
        <section className="px-6 md:px-8 max-w-4xl mx-auto text-center mb-24">
          <span className="text-on-tertiary-fixed-variant font-manrope font-bold text-xs uppercase tracking-widest mb-4 block">
            The Digital Architect
          </span>
          <h1 className="text-5xl md:text-6xl font-newsreader text-primary font-bold leading-tight mb-8">
            Architecture Rooted in Purpose.
          </h1>
          <div className="relative aspect-video rounded-xl overflow-hidden whisper-shadow ghost-border max-w-2xl mx-auto">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl-bFV5Gr1Vt8xoxaYQFX-l_5BGvVVSTTsaC9WkF5sNbPwCGeI__D2pWCXj1CLp_A4WV7lC1Dbgwvfj1BI4uZYSy8mEt_exiIjr_B4tLgAx5I9qJHQx0yzTOiS4kh6nlltkneZXIqrjTGE3-WreaHw2xU1NLx5A6ti_SfEoO1W04UoWGCRbrPwyZtpzUqp6IEVOS_ZoOor69zquDPHFbX311NSVByuZFZmtalFgVrqZQ4Wlkqh1LDYnE--w"
              alt="Modern minimalist workspace symbolizing the Digital Architect philosophy"
              priority
              fill
              sizes="(max-width: 768px) 90vw, 700px"
              className="object-cover"
            />
          </div>
        </section>

        {/* Story */}
        <section className="px-6 md:px-8 max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-newsreader text-primary font-bold mb-6 italic">
            The Story of the Architect
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-4">
            JG Creative Tech systems are the cornerstone and soul of the
            modern marketplace. Without an intentionally crafted digital
            foundation, businesses are merely treading water.
          </p>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            At JG Creative Tech, we engineer experiences that combine the
            authority of editorial craft with the rigor of enterprise-grade
            infrastructure, ensuring our partners are equipped for global
            performance from a Kenyan foundation.
          </p>
        </section>

        {/* Core Values */}
        <section className="px-6 md:px-8 max-w-6xl mx-auto mb-24">
          <h2 className="text-center font-newsreader italic text-3xl text-primary mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={
                  index === 1
                    ? "bg-primary-container text-on-primary p-8 rounded-xl whisper-shadow"
                    : "bg-surface-container-lowest text-primary p-8 rounded-xl ghost-border whisper-shadow"
                }
              >
                <span
                  className={
                    index === 1
                      ? "material-symbols-outlined text-3xl text-secondary-fixed mb-4 block"
                      : "material-symbols-outlined text-3xl text-secondary mb-4 block"
                  }
                  aria-hidden="true"
                >
                  {value.icon}
                </span>
                <h3 className="font-newsreader font-bold text-xl mb-2">
                  {value.title}
                </h3>
                <p
                  className={
                    index === 1
                      ? "text-sm text-on-primary-container"
                      : "text-sm text-on-surface-variant"
                  }
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="px-6 md:px-8 max-w-6xl mx-auto mb-24">
          <h2 className="text-center font-newsreader italic text-3xl text-primary mb-12">
            The Minds Behind the Blueprint
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-high mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-outline" aria-hidden="true">
                    person
                  </span>
                </div>
                <h3 className="font-newsreader font-bold text-primary text-lg">
                  {member.name}
                </h3>
                <p className="text-sm text-on-surface-variant">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8">
          <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-newsreader text-white font-bold mb-4">
              Join the Evolution.
            </h2>
            <p className="text-on-primary-container mb-8 max-w-md mx-auto">
              Ready to architect your future? Let&apos;s talk about your
              digital infrastructure.
            </p>
            <Button href="/schedule-consultation" size="lg">
              Book Your Slot
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
