import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleJsonLd({ post }: { post: NonNullable<ReturnType<typeof getPostBySlug>> }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Insights", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.fullName, url: siteConfig.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
    </>
  );
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      <SiteHeader />

      <main id="main-content" className="pt-32 px-6 md:px-12 max-w-3xl mx-auto pb-24">
        <Link
          href="/blog"
          className="text-secondary font-bold text-sm inline-flex items-center gap-1 mb-8 hover:gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            arrow_back
          </span>
          All Insights
        </Link>

        <div className="flex items-center gap-3 mb-4 text-xs font-manrope font-bold uppercase tracking-widest">
          <span className="text-accent">{post.category}</span>
          <span className="text-on-surface-variant" aria-hidden="true">·</span>
          <span className="text-on-surface-variant">{formatDate(post.date)}</span>
          <span className="text-on-surface-variant" aria-hidden="true">·</span>
          <span className="text-on-surface-variant">{post.readingTimeMinutes} min read</span>
        </div>

        <h1 className="font-newsreader text-4xl md:text-5xl text-ink font-semibold leading-tight mb-8">
          {post.title}
        </h1>

        <article
          className="prose-blog max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-16 pt-8 border-t border-outline-variant/30">
          <p className="text-on-surface-variant text-sm mb-4">
            Want to talk through how this applies to your own project?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav />
      <ArticleJsonLd post={post} />
    </div>
  );
}
