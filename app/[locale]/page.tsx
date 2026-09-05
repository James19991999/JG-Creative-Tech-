import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { HeroVideo } from "@/components/HeroVideo";
import { portfolioProjects } from "@/lib/portfolio";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/" },
  };
}

const testimonials = [
  {
    quoteKey: "testimonial1Quote",
    name: "Samuel D.",
    role: "CEO, Sammy Dylax",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwHcbZ6nRx4bM_SmdThxrWHEQ0Wt-ZQx03jtj3TstvuAJTJjAdf8bnffaG2e2s4acz8gyZEhCjwvZ8-B99b_n6jBOWnF7c2UNwg8nLcGlGiyliMJuLwsExOjIwx0RpE4xIxuBqY0oZje-p2hS-c_PGIT3rBfyZ7HCJGQQtBe9KKh5ZsFKmSgNeo1Na4uD_bkH5ejOP6jqp7oIpR8BoyqMwxFjwSZX-ZvNBLw6E8CozNhTs6veBHQcePM4pZh0gTmj-UkJbJUI9KA",
  },
  {
    quoteKey: "testimonial2Quote",
    name: "Grace M.",
    role: "Managing Director, GM Global",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDseZqR0Yfhs2f9l6Z_7QhsTctRLGL2sCu9dPqtC87cAOn7v2q2KR_JKkZo-CzkO5ohZzCUR--9gkX2ghtMkxoBLSZ-NXpd9c1JXow4OQ7-eYylzilwZHkFpvfDKNF4B0-ErC0LX-ZpMM6DYnnLN4o7Ny-zPbmPhKQhjKXLYIj6ZRHP6F3ArMoq9qWZtikYJAmculdDdLdmDOmF2DNyHOUqyTAGDSMFLjoxY0KJn-d7UWwT_isr-O_DXi5E1ik7TCK_yMVXQasHQ",
  },
];

// Show the two most recent case studies from the shared portfolio data
// source on the homepage. Linking to /portfolio/[slug] keeps these
// thumbnails in sync with the real case study pages.
const portfolioPreview = portfolioProjects.slice(0, 2);

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <SiteHeader activeHref="/solutions" />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span
                className="hero-reveal inline-block text-on-tertiary-fixed-variant font-manrope font-bold tracking-widest text-xs uppercase mb-4 px-3 py-1 bg-tertiary-fixed rounded-full"
                style={{ animationDelay: "0ms" }}
              >
                {t("heroKicker")}
              </span>
              <h1
                className="hero-reveal text-5xl md:text-7xl font-newsreader text-ink leading-tight font-bold mb-6"
                style={{ animationDelay: "100ms" }}
              >
                {t("heroTitlePart1")}{" "}
                <span className="italic">{t("heroTitleItalic")}</span>{" "}
                {t("heroTitlePart3")}
              </h1>
              <p
                className="hero-reveal text-lg md:text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed"
                style={{ animationDelay: "220ms" }}
              >
                {t("heroSubtitle")}
              </p>
              <div
                className="hero-reveal flex flex-wrap gap-4"
                style={{ animationDelay: "340ms" }}
              >
                <Button href="/schedule-consultation" size="lg" icon="arrow_forward">
                  {t("ctaStartEvolution")}
                </Button>
                <Button href="/solutions" variant="secondary" size="lg">
                  {t("ctaViewSolutions")}
                </Button>
              </div>
            </div>
            <div className="relative">
              <HeroVideo
                mp4Src="/videos/hero-showcase.mp4"
                webmSrc="/videos/hero-showcase.webm"
                poster="/videos/hero-poster.jpg"
              />
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-xl whisper-shadow z-20 ghost-border md:block hidden max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="material-symbols-outlined text-accent"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  <span className="font-manrope font-bold text-ink">
                    {t("localResilienceLabel")}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-manrope">
                  {t("localResilienceDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About / Stats Section */}
        <section className="py-24 bg-surface-container-low px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="md:w-1/3">
                <div className="w-12 h-1 bg-on-tertiary-container mb-6" />
                <h2 className="text-4xl font-newsreader text-ink font-bold leading-tight">
                  {t("statsTitle")}
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-manrope text-on-surface-variant mb-8 leading-relaxed italic">
                  {t("statsBody")}
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-ink font-bold text-2xl font-newsreader mb-2">
                      {t("stat1Number")}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-manrope">
                      {t("stat1Label")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-ink font-bold text-2xl font-newsreader mb-2">
                      {t("stat2Number")}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-manrope">
                      {t("stat2Label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid (Bento Style) */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-accent font-manrope font-bold text-xs uppercase tracking-widest">
                {t("capabilitiesKicker")}
              </span>
              <h2 className="text-4xl md:text-5xl font-newsreader text-ink font-bold mt-2">
                {t("capabilitiesTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <FeatureCard
                span="md:col-span-4"
                icon="developer_mode"
                title={t("serviceWebDevTitle")}
                description={t("serviceWebDevDesc")}
              />
              <FeatureCard
                span="md:col-span-2"
                variant="dark"
                icon="architecture"
                title={t("serviceEditorialTitle")}
                description={t("serviceEditorialDesc")}
              />
              <FeatureCard
                span="md:col-span-2"
                variant="muted"
                icon="campaign"
                title={t("serviceGrowthTitle")}
                description={t("serviceGrowthDesc")}
              />
              <FeatureCard
                span="md:col-span-4"
                icon="psychology"
                title={t("serviceCoachingTitle")}
                description={t("serviceCoachingDesc")}
                decoration={
                  <span className="material-symbols-outlined text-[200px]" aria-hidden="true">
                    hub
                  </span>
                }
              />
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="py-24 bg-primary px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-newsreader text-on-primary font-bold">
                  {t("portfolioTitle")}
                </h2>
                <p className="text-on-primary-container mt-4 text-lg">
                  {t("portfolioSubtitle")}
                </p>
              </div>
              <Link
                href="/portfolio"
                className="text-on-primary-container font-manrope font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                {t("viewAllCaseStudies")}
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_outward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {portfolioPreview.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6 ghost-border bg-slate-800">
                    <Image
                      src={project.heroImage}
                      alt={project.heroImageAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-2xl font-newsreader font-bold">
                          {project.name}
                        </h3>
                        <span
                          className="material-symbols-outlined text-on-primary-container text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                          aria-hidden="true"
                        >
                          north_east
                        </span>
                      </div>
                      <p className="text-on-primary-container font-manrope text-sm mt-1">
                        {project.category}
                      </p>
                    </div>
                    <div className="h-10 w-auto opacity-60 grayscale brightness-200">
                      <span className="font-newsreader font-bold text-white tracking-widest text-lg">
                        {project.client.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <h2 className="text-4xl font-newsreader text-ink font-bold mb-6">
                  {t("testimonialsTitle")}
                </h2>
                <p className="text-on-surface-variant font-manrope leading-relaxed">
                  {t("testimonialsBody")}
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((item) => (
                  <blockquote
                    key={item.name}
                    className="bg-surface-container-lowest p-8 rounded-xl whisper-shadow border-l-4 border-on-tertiary-container"
                  >
                    <p className="font-newsreader italic text-lg text-ink mb-6">
                      &quot;{t(item.quoteKey)}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
                        <Image
                          src={item.image}
                          alt={`Portrait of ${item.name}`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-manrope font-bold text-ink text-sm not-italic">
                          {item.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant not-italic">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-5xl mx-auto gradient-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-newsreader text-white font-bold mb-8">
                {t("finalCtaTitle")}
              </h2>
              <p className="text-on-primary-container text-lg md:text-xl max-w-2xl mx-auto mb-12">
                {t("finalCtaBody")}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/schedule-consultation"
                  className="bg-on-tertiary-fixed-variant text-white px-10 py-5 rounded-full font-bold whisper-shadow hover:scale-105 transition-transform active:scale-95"
                >
                  {t("bookConsultation")}
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  {t("contactOurTeam")}
                </Link>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary-container/20 rounded-full blur-3xl -ml-32 -mb-32"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
