import { siteConfig } from "@/lib/site-config";

/**
 * Organization structured data (schema.org/Organization), injected once
 * in the root layout so every page benefits from the same rich-result
 * eligibility in search engines.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.fullName,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
      streetAddress: siteConfig.contact.address,
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
