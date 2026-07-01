import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/lib/portfolio";

const baseUrl = "https://www.jgcreativetech.solutions";

/**
 * Generates /sitemap.xml at build/request time. Excludes pages marked
 * noindex (client portal, consultation funnel steps) since those
 * shouldn't be discovered by search engines.
 */
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

  return [...routes, ...portfolioRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
