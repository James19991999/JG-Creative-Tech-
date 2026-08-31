/**
 * Central site configuration. Single source of truth for navigation
 * links, contact details, and footer content so every page and
 * component stays in sync. Mirrors the copy used across the Stitch
 * screens (home, contact, footers).
 */

export const siteConfig = {
  name: "JG Creative Tech",
  fullName: "JG Creative Tech Solution",
  description:
    "Premium digital infrastructure, web development, and growth strategy for Kenyan SMEs.",
  url: "https://www.jgcreativetech.solutions",
  contact: {
    email: "info@jgcreativetechsolution.org",
    legalEmail: "legal@jgcreative.tech",
    dpoEmail: "privacy@jgcreative.tech",
    address: "Westlands Business District, Nairobi, Kenya",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/james-maruti-a6738231a",
    github: "https://github.com/James19991999",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const primaryNavLinks: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerServiceLinks: NavLink[] = [
  { label: "Web Development", href: "/solutions" },
  { label: "Digital Architecture", href: "/digital-architecture" },
  { label: "Digital Strategy", href: "/digital-strategy" },
  { label: "Innovation Lab", href: "/innovation-lab" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
  { label: "Client Portal", href: "/client-portal" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];
