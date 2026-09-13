import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/faq" },
  };
}

const QUESTION_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const items = QUESTION_KEYS.map((n) => ({
    question: t(`q${n}Question`),
    answer: t(`q${n}Answer`),
  }));

  /**
   * FAQPage schema still validates and is still worth including even
   * though Google retired the FAQ rich-result search feature itself
   * on May 7, 2026 - it's harmless, costs nothing, and other
   * consumers of structured data (AI answer engines, internal
   * tooling) may still make use of a clean question/answer structure
   * even without Google's SERP treatment. What it's NOT is a ranking
   * lever or a guarantee of any particular search appearance - this
   * page's actual SEO value is the genuine, specific answers below,
   * not the markup wrapping them.
   */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteHeader />

      <main id="main-content" className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <section className="mb-16 text-center">
          <span className="text-accent font-manrope font-bold text-xs uppercase tracking-widest mb-4 block">
            {t("kicker")}
          </span>
          <h1 className="text-4xl md:text-5xl font-newsreader text-ink font-bold leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </section>

        {/* Native <details>/<summary> - correct keyboard support and
            screen reader expanded/collapsed announcement built into
            the browser, no hand-rolled ARIA needed. */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-bold text-ink text-lg">
                {item.question}
                <span
                  className="material-symbols-outlined shrink-0 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  add
                </span>
              </summary>
              <p className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
