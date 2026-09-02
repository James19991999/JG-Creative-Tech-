import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { getPortfolioProject, portfolioProjects } from "@/lib/portfolio";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getPortfolioProject(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.name} | JG Creative Tech`,
      description: project.summary,
      images: [{ url: project.heroImage }],
    },
  };
}

function CaseStudyJsonLd({ project }: { project: ReturnType<typeof getPortfolioProject> }) {
  if (!project) return null;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portfolio", item: `${siteConfig.url}/portfolio` },
      { "@type": "ListItem", position: 2, name: project.name, item: `${siteConfig.url}/portfolio/${project.slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.name,
    description: project.summary,
    image: project.heroImage,
    author: { "@type": "Organization", name: siteConfig.fullName, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.fullName, url: siteConfig.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/portfolio/${project.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
    </>
  );
}

export default function PortfolioCaseStudyPage({ params }: Props) {
  const project = getPortfolioProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <CaseStudyJsonLd project={project} />
      <SiteHeader activeHref="/portfolio" />

      <main id="main-content" className="pt-32 pb-28 md:pb-32 max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-on-surface-variant font-manrope">
            <li>
              <a href="/portfolio" className="hover:text-ink transition-colors">
                Portfolio
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink font-bold">{project.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="mb-16">
          <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-6 rounded-full">
            {project.category}
          </span>
          <h1 className="font-newsreader text-5xl md:text-6xl text-ink font-bold leading-tight mb-6">
            {project.name}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            {project.summary}
          </p>
        </section>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-16 whisper-shadow-lg">
          <Image
            src={project.heroImage}
            alt={project.heroImageAlt}
            fill
            sizes="(max-width: 1024px) 90vw, 1024px"
            priority
            className="object-cover"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16 bg-surface-container-low rounded-xl p-8">
          {project.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-newsreader text-3xl text-ink font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <section>
            <h2 className="font-newsreader text-xl text-ink font-bold mb-3">
              The Challenge
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {project.challenge}
            </p>
          </section>
          <section>
            <h2 className="font-newsreader text-xl text-ink font-bold mb-3">
              Our Approach
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {project.approach}
            </p>
          </section>
          <section>
            <h2 className="font-newsreader text-xl text-ink font-bold mb-3">
              The Outcome
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {project.outcome}
            </p>
          </section>
        </div>

        {/* Services used */}
        <div className="mb-20">
          <h2 className="font-newsreader text-xl text-ink font-bold mb-4">
            Services Delivered
          </h2>
          <ul className="flex flex-wrap gap-3">
            {project.services.map((service) => (
              <li
                key={service}
                className="bg-surface-container px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-on-surface-variant"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <section className="bg-primary rounded-3xl p-12 text-center">
          <h2 className="font-newsreader text-3xl md:text-4xl text-white font-bold mb-4">
            Have a similar challenge?
          </h2>
          <p className="text-on-primary-container mb-8 max-w-md mx-auto">
            Let&apos;s talk about what a project like this could look like
            for your business.
          </p>
          <Button href="/contact" size="lg">
            Start the Conversation
          </Button>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
