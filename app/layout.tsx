import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { CookieBanner } from "@/components/CookieBanner";
import { RouteTransition } from "@/components/RouteTransition";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001e40",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jgcreativetech.solutions"),
  title: {
    default: "JG Creative Tech Solution | Digital Infrastructure for Kenyan SMEs",
    template: "%s | JG Creative Tech",
  },
  description:
    "JG Creative Tech engineers premium digital infrastructure, web development, editorial design, and growth strategy for ambitious Kenyan and East African SMEs.",
  keywords: [
    "JG Creative Tech",
    "Kenyan SME digital infrastructure",
    "web development Nairobi",
    "digital strategy Kenya",
    "UI UX design Kenya",
  ],
  authors: [{ name: "JG Creative Tech Solution" }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://www.jgcreativetech.solutions",
    siteName: "JG Creative Tech",
    title: "JG Creative Tech Solution | Digital Infrastructure for Kenyan SMEs",
    description:
      "Premium digital infrastructure, web development, and growth strategy for Kenyan SMEs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JG Creative Tech Solution",
    description:
      "Premium digital infrastructure, web development, and growth strategy for Kenyan SMEs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          NOTE FOR DEPLOYMENT: This project ships with a <link> tag for
          Google Fonts instead of next/font/google because the build
          sandbox used to generate this code has no network access to
          fonts.googleapis.com. next/font/google fails the build entirely
          when it can't fetch font CSS at build time, so it's not a safe
          default here.

          On Vercel (or any environment with normal internet access) you
          should switch to next/font for the performance, privacy, and
          zero-layout-shift benefits of self-hosted fonts:

            import { Newsreader, Manrope } from "next/font/google";
            const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: ["normal","italic"], weight: ["200","300","400","500","600","700","800"] });
            const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["200","300","400","500","600","700","800"] });

          Then apply `${newsreader.variable} ${manrope.variable}` to the
          <html> className and remove the <link> tags below.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional: see note above, next/font/google requires build-time network access this environment doesn't have */}
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols icon font, same rationale as above */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className="bg-background text-on-surface font-body antialiased selection:bg-secondary-container">
        {/* Skip to main content — visible on keyboard focus, hidden otherwise */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-lg focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <RouteTransition>{children}</RouteTransition>
        <CookieBanner />
      </body>
    </html>
  );
}
