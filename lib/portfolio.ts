export type PortfolioProject = {
  slug: string;
  name: string;
  client: string;
  category: string;
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  stats: { label: string; value: string }[];
  services: string[];
};

/**
 * Single source of truth for portfolio case studies. Used by both the
 * /portfolio listing page (card previews) and /portfolio/[slug] (full
 * case study). Keeping this in one place means the listing and detail
 * page can never drift out of sync.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "sammy-dylax-logistics",
    name: "Sammy Dylax Logistics",
    client: "Sammy Dylax",
    category: "Infrastructure & Custom SaaS",
    tagline: "Fleet Management • Real-time Tracking",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXKr_mzlFasNdQTAlyqQkcFU5-LfUXpQJLD_bhNpUfBYcjmXn3SuO_cHH06wO8seQ7ZcqU4daz1MG6J7pSy98V1_wDI5KBPeRL1QPj4vXXFX_QcKEBULpOUKgyNfU0v-kz-pq7V2ljHgs5rygzUs8NxbsaJrD19LHPTVdKJxMKhwIy2Ku3VaxxUBrR3rm7brVXOIQobT3zQO-DWT9KYW3Yicy1_PBrJqUYuFmvk6ux_nyqoMe1KzbIqoyxuvFzHMwMuMDQZwzpiA",
    heroImageAlt:
      "Sammy Dylax Logistics dashboard interface showing fleet tracking and analytics",
    summary:
      "A custom SaaS platform replacing Sammy Dylax's spreadsheet-driven fleet operations with real-time tracking, automated dispatch, and a client-facing delivery portal.",
    challenge:
      "Sammy Dylax was coordinating a growing logistics fleet across Nairobi and Mombasa using shared spreadsheets and WhatsApp groups. Dispatch errors and delayed status updates were costing client trust as the business scaled past its original operating model.",
    approach:
      "We engineered a multi-tenant dispatch platform on Next.js and Firebase Firestore, with role-based access for dispatchers, drivers, and clients. Real-time location updates flow through Firestore listeners, and a dedicated client portal gives end customers live shipment visibility without a phone call.",
    outcome:
      "Dispatch time dropped significantly within the first month, and the client-facing portal eliminated the majority of status-check calls into the operations team, freeing staff to focus on exceptions rather than routine updates.",
    stats: [
      { label: "Dispatch Time", value: "-40%" },
      { label: "Status Calls", value: "-65%" },
      { label: "Fleet Visibility", value: "Real-time" },
    ],
    services: ["Custom SaaS", "Firebase Firestore", "Role-Based Access", "Client Portal"],
  },
  {
    slug: "gm-global-ventures",
    name: "GM Global Ventures",
    client: "GM Global",
    category: "Brand Identity & Web Ecosystem",
    tagline: "Cross-continental venture capital representation",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgbN4-kDUwF2MbLevsdgY_KeGN5WbPPpEZSkU72rT2xsA-p4Wftf4XZTxnqB8vutaexMtTway4m4zz66NuV5qkeO7CQ1TmvfRxrmmGK-PEmvaYXezqpJswZsgI1t-qM313sUaF4YW9NBYzeNbaUfoH8kVa0BhDzZ8ux2jI-qPxx92uGPD6Ed3WmcKuloV9ZfxhyVGIqT_nOD3IrgWgbQLO3SGl35sIYKLelPnWatObouJTRJZBtpNtFI4KRMCyP8lWT9O5usyhzQ",
    heroImageAlt:
      "Minimalist luxury brand stationery and digital devices for GM Global Ventures",
    summary:
      "A complete brand identity and web ecosystem for a venture capital firm operating between Nairobi and international markets, built to read as credible to institutional investors on both continents.",
    challenge:
      "GM Global needed a digital presence that could stand alongside established global venture firms while clearly communicating its East African market expertise — without looking like a regional add-on to a Western template.",
    approach:
      "We led with editorial-grade typography and a restrained navy-and-cream palette, then built the supporting site on Next.js with a CMS-driven portfolio of fund investments. Every page was designed to read equally well to a Nairobi founder and a London limited partner.",
    outcome:
      "The rebrand became the firm's primary credibility asset in fundraising conversations, and the new site now serves as the canonical reference point investors are pointed to during due diligence.",
    stats: [
      { label: "Markets Served", value: "2 Continents" },
      { label: "Brand Refresh", value: "Complete" },
      { label: "Portfolio Pages", value: "CMS-driven" },
    ],
    services: ["Brand Identity", "Editorial Design", "Next.js", "Headless CMS"],
  },
  {
    slug: "apex-realty",
    name: "Apex Realty",
    client: "Apex Realty",
    category: "Property Portal",
    tagline: "Modern listings platform for the Nairobi property market",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqdGOaHBWrXXJGyr3ZeChV5zlVEXP4sbCtK_6ZMQc5lN4YhfJTnsnY3HZ_2FiHzKgIrqugiKe8rQCyT4rilEwem_yta54hCG0tKT1e0IFVaXoC4KkwMU2APs0SBm5W1ktff3xCfD0iwoxiTbR8vvIVMXRZgxC-8oEXF-IkILolleRKlFy6uSAUj9zjs5Kb8M66NRdbbBWrbUp0699bOfXVR1iS03UKyzR55b3teqq_mRGkXDJSK7b6WWeN0Bk30l025eLYGnvZDQ",
    heroImageAlt: "Modern glass office building facade representing Apex Realty",
    summary:
      "A searchable property listings portal built to replace static PDF brochures with a fast, filterable browsing experience for prospective tenants and buyers.",
    challenge:
      "Apex Realty's listings lived in PDFs emailed on request, making it impossible for prospects to self-serve or compare properties without contacting an agent first — losing leads who wanted to browse on their own time.",
    approach:
      "We built a filterable listings portal with map-based search, image galleries optimized for fast mobile loading, and an inquiry flow that routes directly to the right agent based on property and location.",
    outcome:
      "Prospective tenants can now browse and shortlist independently, and inbound inquiries arrive pre-qualified with the specific property already identified, shortening the sales cycle.",
    stats: [
      { label: "Self-Serve Browsing", value: "Enabled" },
      { label: "Inquiry Routing", value: "Automated" },
      { label: "Mobile Load Time", value: "<2s" },
    ],
    services: ["Property Portal", "Map Search", "Lead Routing", "Performance Optimization"],
  },
];

export function getPortfolioProject(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.slug === slug);
}
