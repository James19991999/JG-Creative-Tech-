import { getAllPosts } from "@/lib/blog";
import { portfolioProjects } from "@/lib/portfolio";

export type SearchItem = {
  title: string;
  description: string;
  category: string;
  url: string;
};

/**
 * Static site pages, hand-listed with their real title/description
 * (copied from each page's own `export const metadata`, not
 * paraphrased) so the command palette's results match what a search
 * engine or social share would actually show for that page. Excludes
 * pages that shouldn't be publicly discoverable: the client portal
 * (auth-gated), the consultation/discovery funnel's intermediate
 * steps (only useful mid-flow, confusing to jump into directly), and
 * /offline (a fallback state, not a destination).
 */
const staticPages: SearchItem[] = [
  {
    title: "Home",
    description:
      "We build the digital foundations that allow local resilience to scale globally. Premium architecture for businesses that demand excellence.",
    category: "Pages",
    url: "/",
  },
  {
    title: "About Us",
    description:
      "The Digital Architect philosophy: how JG Creative Tech builds resilient, editorial-grade digital infrastructure for Kenyan SMEs.",
    category: "Pages",
    url: "/about",
  },
  {
    title: "Solutions",
    description:
      "We engineer premium digital infrastructure for ambitious SMEs, bridging the gap between legacy operations and future-proof innovation.",
    category: "Pages",
    url: "/solutions",
  },
  {
    title: "Portfolio",
    description:
      "A curated anthology of digital ecosystems, institutional infrastructure, and high-performance brand environments engineered for the Kenyan SME frontier.",
    category: "Pages",
    url: "/portfolio",
  },
  {
    title: "Digital Architecture",
    description:
      "We don't just build software; we engineer digital sovereignty. Frameworks designed to withstand the pressures of scale.",
    category: "Pages",
    url: "/digital-architecture",
  },
  {
    title: "Digital Strategy",
    description:
      "We don't just build tools; we design the roadmap for your digital dominance. Engineering institutional stability.",
    category: "Pages",
    url: "/digital-strategy",
  },
  {
    title: "Innovation Lab",
    description:
      "Experimental tech designed to scale the Kenyan digital economy through intentional infrastructure and agile R&D.",
    category: "Pages",
    url: "/innovation-lab",
  },
  {
    title: "Insights",
    description:
      "Practical thinking on digital infrastructure, engineering decisions, and what actually holds up when a Kenyan SME's website has to work under real load.",
    category: "Pages",
    url: "/blog",
  },
  {
    title: "Contact Our Team",
    description:
      "Let's architect your digital future. Reach out to discuss infrastructure, strategy, or creative solutions for your business.",
    category: "Pages",
    url: "/contact",
  },
  {
    title: "Schedule a Consultation",
    description:
      "Choose a date and time that fits your infrastructure roadmap. Our architects are ready to translate your vision into a scalable digital blueprint.",
    category: "Pages",
    url: "/schedule-consultation",
  },
  {
    title: "Terms of Service",
    description:
      "The terms governing your access to and use of JG Creative Tech's digital infrastructure services, frameworks, and consulting protocols.",
    category: "Legal",
    url: "/legal/terms",
  },
  {
    title: "Privacy Policy",
    description:
      "Protecting the digital foundations of Kenyan innovation. How JG Creative Tech Solution collects, uses, and protects your personal data under DPA 2019.",
    category: "Legal",
    url: "/legal/privacy",
  },
  {
    title: "Cookie Policy",
    description:
      "How JG Creative Tech Solution uses cookies and tracking technologies to build a seamless, secure, and personalized experience.",
    category: "Legal",
    url: "/legal/cookies",
  },
];

/**
 * Builds the full search index at build/request time (this runs
 * server-side only, since getAllPosts() reads from the filesystem -
 * see lib/blog.ts). The root layout calls this and passes the result
 * as a prop into the client-side CommandPalette.
 */
export function getSearchIndex(): SearchItem[] {
  const blogItems: SearchItem[] = getAllPosts().map((post) => ({
    title: post.title,
    description: post.description,
    category: `Insights - ${post.category}`,
    url: `/blog/${post.slug}`,
  }));

  const portfolioItems: SearchItem[] = portfolioProjects.map((project) => ({
    title: project.name,
    description: project.tagline,
    category: `Portfolio - ${project.category}`,
    url: `/portfolio/${project.slug}`,
  }));

  return [...staticPages, ...blogItems, ...portfolioItems];
}
