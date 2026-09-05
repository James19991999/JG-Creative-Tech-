import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/lib/portfolio";
import { getAllPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const baseUrl = "https://www.jgcreativetech.solutions";

/**
 * Generates /sitemap.xml at build/request time. Excludes pages marked
 * noindex (client portal, consultation funnel steps) since those
 * shouldn't be discovered by search engines.
 *
 * Every route gets an entry for each locale (English at its existing
 * unprefixed URL, Swahili at /sw/...), with alternates.languages
 * cross-linking the two versions of each page - this is what tells
 * search engines "these are the same page in different languages"
 * rather than two unrelated pages, and is the actual mechanism that
 * makes the Swahili content discoverable/indexable in the first
 * place, not just reachable by URL.
 */
function localizedPath(path: string, locale: string): string {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/solutions", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/digital-architecture", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/digital-strategy", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/strategic-context", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/innovation-lab", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const portfolioRoutes = portfolioProjects.map((project) => ({
    path: `/portfolio/${project.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const blogRoutes = getAllPosts().map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const allRoutes = [...routes, ...portfolioRoutes, ...blogRoutes];

  return allRoutes.flatMap((route) => {
    const languageAlternates: Record<string, string> = {};
    for (const locale of routing.locales) {
      languageAlternates[locale] = `${baseUrl}${localizedPath(route.path, locale)}`;
    }

    // Google's sitemap i18n guidance: every language version gets its
    // own <url> entry (not just an alternate reference hanging off the
    // default-locale entry), and each entry lists every version
    // (including itself) in its alternates - so Swahili pages are
    // independently discoverable, not just linked from the English one.
    return routing.locales.map((locale) => ({
      url: `${baseUrl}${localizedPath(route.path, locale)}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: languageAlternates },
    }));
  });
}
