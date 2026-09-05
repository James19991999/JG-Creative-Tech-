import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/about" },
  };
}

const coreValueIcons = ["verified", "bolt", "shield_person", "design_services"];

const team = [
  { name: "James Gathuru", roleKey: "role1" },
  { name: "Sarah Kamau", roleKey: "role2" },
  { name: "David Mwangi", roleKey: "role3" },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const coreValues = [
    { icon: coreValueIcons[0], title: t("value1Title"), description: t("value1Desc") },
    { icon: coreValueIcons[1], title: t("value2Title"), description: t("value2Desc") },
    { icon: coreValueIcons[2], title: t("value3Title"), description: t("value3Desc") },
    { icon: coreValueIcons[3], title: t("value4Title"), description: t("value4Desc") },
  ];

  return (
    <>
      <SiteHeader activeHref="/about" />

      <main id="main-content" className="pt-32 pb-24">
        {/* Hero */}
        <section className="px-6 md:px-8 max-w-4xl mx-auto text-center mb-24">
          <span className="text-accent font-manrope font-bold text-xs uppercase tracking-widest mb-4 block">
            {t("heroKicker")}
          </span>
          <h1 className="text-5xl md:text-6xl font-newsreader text-ink font-bold leading-tight mb-8">
            {t("heroTitle")}
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
          <h2 className="text-3xl font-newsreader text-ink font-bold mb-6 italic">
            {t("storyTitle")}
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-4">
            {t("storyPara1")}
          </p>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            {t("storyPara2")}
          </p>
        </section>

        {/* Core Values */}
        <section className="px-6 md:px-8 max-w-6xl mx-auto mb-24">
          <h2 className="text-center font-newsreader italic text-3xl text-ink mb-12">
            {t("coreValuesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={
                  index === 1
                    ? "bg-primary-container text-on-primary p-8 rounded-xl whisper-shadow"
                    : "bg-surface-container-lowest text-ink p-8 rounded-xl ghost-border whisper-shadow"
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
          <h2 className="text-center font-newsreader italic text-3xl text-ink mb-12">
            {t("teamTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-high mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-outline" aria-hidden="true">
                    person
                  </span>
                </div>
                <h3 className="font-newsreader font-bold text-ink text-lg">
                  {member.name}
                </h3>
                <p className="text-sm text-on-surface-variant">{t(member.roleKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8">
          <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-newsreader text-white font-bold mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-on-primary-container mb-8 max-w-md mx-auto">
              {t("ctaBody")}
            </p>
            <Button href="/schedule-consultation" size="lg">
              {t("ctaButton")}
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
