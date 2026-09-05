import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../globals.css";
import { AuthProvider } from "@/components/client-portal/AuthProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { RouteTransition } from "@/components/RouteTransition";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { themeInitScript } from "@/lib/theme-script";

/**
 * The client portal is a separate Next.js "root layout" from the
 * marketing site (see app/[locale]/layout.tsx) - it renders its own
 * <html>/<body> rather than sharing one, because it's deliberately
 * kept outside the locale system entirely (see middleware.ts and the
 * portal setup notes in README.md). Next.js supports multiple root
 * layouts like this as long as there's no single app/layout.tsx above
 * both; each top-level segment provides its own.
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001e40",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jgcreativetech.solutions"),
  title: {
    default: "Infrastructure Portal | JG Creative Tech",
    template: "%s | JG Creative Tech",
  },
  description: "Client infrastructure portal.",
  robots: { index: false, follow: false },
};

export default function ClientPortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* See app/[locale]/layout.tsx for the full note on why this
            project uses a <link> tag instead of next/font/google. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- see app/[locale]/layout.tsx */}
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- see app/[locale]/layout.tsx */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="bg-background text-on-surface font-body antialiased selection:bg-secondary-container">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-lg focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <RouteTransition>
          <AuthProvider>{children}</AuthProvider>
        </RouteTransition>
        <CookieBanner />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
