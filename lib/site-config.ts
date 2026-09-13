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
  /**
   * WhatsApp click-to-chat number, in full international format with
   * no spaces/dashes/plus sign (e.g. "254712345678" for a Kenyan
   * number) - this is exactly the format wa.me links require.
   *
   * PLACEHOLDER - REPLACE BEFORE DEPLOYING. "254700000000" is not a
   * real number; shipping this as-is would silently send every
   * WhatsApp click to a dead/wrong number. See components/
   * WhatsAppButton.tsx for where this is used.
   */
  whatsapp: {
    phoneNumber: "254700000000",
    defaultMessage: "Hi! I'd like to talk about a project.",
  },
} as const;

export type NavLink = {
  key: string;
  label: string;
  href: string;
};

export const primaryNavLinks: NavLink[] = [
  { key: "solutions", label: "Solutions", href: "/solutions" },
  { key: "about", label: "About", href: "/about" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio" },
  { key: "insights", label: "Insights", href: "/blog" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export const footerServiceLinks: NavLink[] = [
  { key: "webDevelopment", label: "Web Development", href: "/solutions" },
  { key: "digitalArchitecture", label: "Digital Architecture", href: "/digital-architecture" },
  { key: "digitalStrategy", label: "Digital Strategy", href: "/digital-strategy" },
  { key: "innovationLab", label: "Innovation Lab", href: "/innovation-lab" },
];

export const footerCompanyLinks: NavLink[] = [
  { key: "about", label: "About", href: "/about" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "clientPortal", label: "Client Portal", href: "/client-portal" },
];

export const footerLegalLinks: NavLink[] = [
  { key: "privacyPolicy", label: "Privacy Policy", href: "/legal/privacy" },
  { key: "termsOfService", label: "Terms of Service", href: "/legal/terms" },
  { key: "cookiePolicy", label: "Cookie Policy", href: "/legal/cookies" },
];
