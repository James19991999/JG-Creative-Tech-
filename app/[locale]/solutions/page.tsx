import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutions" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/solutions" },
  };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutions" });

  const processSteps = [
    { number: "01", title: t("step1Title"), description: t("step1Desc") },
    { number: "02", title: t("step2Title"), description: t("step2Desc") },
    { number: "03", title: t("step3Title"), description: t("step3Desc") },
    { number: "04", title: t("step4Title"), description: t("step4Desc") },
  ];

  return (
    <>
      <SiteHeader activeHref="/solutions" />

      <main id="main-content" className="pt-24 pb-24 md:pb-24 pb-28">
        {/* Hero Section */}
        <section className="relative px-6 py-20 overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb6BaJIckfSaE3xIGeIFwv8uRUTbuw1O7EDAGzM9ubEOzd-gj5ophklEO348JOzei88cw94S0OFaFauTvsL4PTFfwDpEH-A42n6UElL9LjW17tCVnmBhd_omYk9YyUWk75VM8L09197DrKWI3kh-fre_jpEEy7W6lGHK4E0DbTJgtWxPOGe_QhNjj-KSgIm4Jil4SKQcSXvq60KyRn8tMgNc45sXq4_YsEzH3uBgt-sbZFUVgeSA3IYfFVKuhDuclK6Cl8k11i_Q"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {t("heroKicker")}
              </span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl text-white italic tracking-tight leading-tight mb-8">
              {t("heroTitle")}
            </h1>
            <p className="text-primary-fixed-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Solutions Grid (Bento Style) */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="w-12 h-1 bg-on-tertiary-container mb-4" />
            <h2 className="font-headline text-4xl text-ink">
              {t("gridTitle")}
            </h2>
            <p className="text-on-surface-variant mt-2 max-w-md">
              {t("gridSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Web Development */}
            <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden whisper-shadow-lg">
              <div className="flex flex-col h-full">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6" aria-hidden="true">
                  terminal
                </span>
                <h3 className="font-headline text-3xl text-ink mb-4">
                  {t("webDevTitle")}
                </h3>
                <p className="text-on-surface-variant leading-relaxed max-w-lg mb-8">
                  {t("webDevDesc")}
                </p>
                <div className="mt-auto">
                  <ul className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-tighter text-on-surface-variant mb-6">
                    <li className="bg-surface-container px-3 py-1 rounded">Next.js</li>
                    <li className="bg-surface-container px-3 py-1 rounded">Microservices</li>
                    <li className="bg-surface-container px-3 py-1 rounded">API Integration</li>
                  </ul>
                  <Link
                    href="/digital-architecture"
                    className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-ink transition-colors"
                  >
                    {t("exploreArchitecture")}
                    <span className="material-symbols-outlined text-base" aria-hidden="true">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Editorial Design */}
            <div className="md:col-span-4 bg-primary-container p-8 rounded-xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-secondary-fixed text-4xl mb-6" aria-hidden="true">
                  auto_stories
                </span>
                <h3 className="font-headline text-3xl mb-4 italic">
                  {t("editorialTitle")}
                </h3>
                <p className="text-primary-fixed-dim leading-relaxed mb-4">
                  {t("editorialDesc")}
                </p>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-1 text-sm font-bold text-secondary-fixed hover:text-white transition-colors"
                >
                  {t("seeDesignWork")}
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="relative mt-12 h-32 w-full rounded-lg overflow-hidden grayscale opacity-40">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2I-2Vsa-QxSdqP4THjEEoCsOJUgfyBAZpgm-o2wJuIZ4bLbVonhx49aFjhEDnRSN5gSTZbNA0M6qGItoNGELQT8xjHFlqkJVO1N6eMLU4NRwJRMns_SJ2gEqPr6QFfOh5TVv-LiVPgyu6ky_V-mY0O2lMxFAU54-i63ODWL7Nur7C5_8IkTe9xhK_23PYwkwucPo01-kz5y0ARRC8zYawK9pmX-TMo6kTIYOCqNDtlox4QtCs1PoGU55Jd1EMjZYr3Nzeem_btg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Growth Marketing */}
            <div className="md:col-span-4 bg-surface-container-low p-8 rounded-xl ghost-border">
              <span className="material-symbols-outlined text-accent text-4xl mb-6" aria-hidden="true">
                query_stats
              </span>
              <h3 className="font-headline text-3xl text-ink mb-4">
                {t("growthTitle")}
              </h3>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                {t("growthDesc")}
              </p>
              <Link
                href="/digital-strategy"
                className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-ink transition-colors"
              >
                {t("viewStrategyFramework")}
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </div>
            {/* Digital Coaching */}
            <div className="md:col-span-8 bg-surface-container-highest p-8 rounded-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center whisper-shadow-lg">
              <div className="flex-1">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6" aria-hidden="true">
                  psychology
                </span>
                <h3 className="font-headline text-3xl text-ink mb-4">
                  {t("coachingTitle")}
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-4">
                  {t("coachingDesc")}
                </p>
                <Link
                  href="/innovation-lab"
                  className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-ink transition-colors"
                >
                  {t("visitInnovationLab")}
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="flex-1 w-full h-48 md:h-full bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
                <div className="h-2 w-3/4 bg-surface-container rounded" />
                <div className="h-2 w-full bg-surface-container rounded" />
                <div className="h-2 w-5/6 bg-secondary/10 rounded" />
                <div className="mt-4 flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container" />
                  <div className="w-8 h-8 rounded-full bg-secondary" />
                  <div className="w-8 h-8 rounded-full bg-on-tertiary-container" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-surface-container py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl text-ink italic">
                {t("processTitle")}
              </h2>
              <p className="text-on-surface-variant mt-2">
                {t("processSubtitle")}
              </p>
            </div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-outline-variant/30 -translate-y-1/2"
              />
              <ol className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {processSteps.map((step) => (
                  <li key={step.number}>
                    <div className="bg-surface-container-lowest w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-6">
                      <span className="text-ink font-bold">{step.number}</span>
                    </div>
                    <h3 className="font-headline text-2xl text-ink mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center bg-surface-container-lowest">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-headline text-5xl text-ink leading-tight mb-8">
              {t("ctaTitle")}
            </h2>
            <p className="text-on-surface-variant mb-10 text-lg">
              {t("ctaBody")}
            </p>
            <Button href="/schedule-consultation" size="lg">
              {t("ctaButton")}
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
