import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Insights | JG Creative Tech Solution",
  description:
    "Practical thinking on digital infrastructure, engineering decisions, and what actually holds up when a Kenyan SME's website has to work under real load.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Insights | JG Creative Tech Solution",
    description:
      "Practical thinking on digital infrastructure and what holds up under real load.",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      <SiteHeader />

      <main id="main-content" className="pt-32 px-6 md:px-12 max-w-5xl mx-auto pb-24">
        <header className="mb-16">
          <span className="text-accent font-medium text-xs tracking-[0.2em] uppercase mb-3 block">
            Insights
          </span>
          <h1 className="font-newsreader text-5xl md:text-7xl text-ink leading-[1.1] italic">
            Field notes from the build.
          </h1>
          <p className="text-on-surface-variant mt-6 max-w-2xl text-lg leading-relaxed">
            Practical thinking on infrastructure, engineering decisions, and
            what actually holds up once a system has real users depending
            on it.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-on-surface-variant">No posts published yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-surface-container-lowest p-8 rounded-2xl whisper-shadow ghost-border hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 text-xs font-manrope font-bold uppercase tracking-widest">
                  <span className="text-accent">
                    {post.category}
                  </span>
                  <span className="text-on-surface-variant" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-on-surface-variant">
                    {formatDate(post.date)}
                  </span>
                  <span className="text-on-surface-variant" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-on-surface-variant">
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="font-newsreader text-2xl md:text-3xl text-ink font-semibold mb-3 group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-on-surface-variant leading-relaxed max-w-2xl">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
      <MobileBottomNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "JG Creative Tech Solution Insights",
            url: `${siteConfig.url}/blog`,
            publisher: { "@type": "Organization", name: siteConfig.fullName },
          }),
        }}
      />
    </div>
  );
}
