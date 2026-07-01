import type { MetadataRoute } from "next";

const baseUrl = "https://www.jgcreativetech.solutions";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/client-portal", "/get-started/", "/schedule-consultation", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
