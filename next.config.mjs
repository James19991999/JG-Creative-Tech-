import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets next/jest transform next-intl's ESM-only build during tests
  // instead of skipping it - without this, every component that
  // imports i18n/navigation.ts fails to load under Jest with a
  // "Unexpected token 'export'" error (next/jest defaults to ignoring
  // all of node_modules unless a package is explicitly listed here).
  transpilePackages: [
    "next-intl",
    "use-intl",
    "@formatjs/fast-memoize",
    "@formatjs/icu-messageformat-parser",
    "@formatjs/icu-skeleton-parser",
    "@schummar/icu-type-parser",
    "icu-minify",
    "intl-messageformat",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent this site from being embedded in iframes on other domains
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stop browsers from MIME-sniffing the declared content-type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't send the full URL as Referrer to third-party sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Only allow the browser features we actually use
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          // Force HTTPS for 1 year once first visited
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy — tightened for this project's real dependencies
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js inline scripts and Google Fonts script helper
              "script-src 'self' 'unsafe-inline'",
              // Tailwind and inline styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Newsreader, Manrope, Material Symbols font files
              "font-src 'self' https://fonts.gstatic.com",
              // Stitch/Google-hosted project images
              "img-src 'self' data: https://lh3.googleusercontent.com",
              // API calls only go back to same origin
              "connect-src 'self'",
              // No Flash, Silverlight, Java, etc.
              "object-src 'none'",
              // Block mixed content
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // Aggressive caching for immutable Next.js build assets
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache favicon/icons for a day (OG images are handled by Next's
      // own file-convention route caching, not this rule)
      {
        source: "/(favicon.ico|icon.png|apple-icon.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
