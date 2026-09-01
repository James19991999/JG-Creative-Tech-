import { ImageResponse } from "next/og";

/**
 * Shared template for every route's opengraph-image.tsx. Next.js
 * discovers those files by convention and wires the resulting image
 * into each page's metadata automatically - no manual <meta> tags
 * needed per page.
 *
 * Deliberately uses ImageResponse's built-in system font rather than
 * fetching Newsreader/Manrope from Google Fonts at generation time.
 * These images are generated at build time for static routes, which
 * runs in whatever environment does the build - including sandboxes
 * that can't reach fonts.gstatic.com (see the next/font/google note
 * in app/layout.tsx for the same underlying constraint). A system
 * font that renders identically everywhere beats a branded font that
 * only sometimes resolves.
 */

export const ogImageSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const NAVY = "#001e40";
const NAVY_LIGHT = "#003366";
const ACCENT = "#ff6f3a";

export function OgTemplate({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
        position: "relative",
      }}
    >
      {/* Single restrained decorative accent - one orb, not clutter */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: ACCENT,
            display: "flex",
          }}
        />
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          JG Creative Tech
        </span>
      </div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        {kicker ? (
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: "0.08em",
              marginBottom: 20,
            }}
          >
            {kicker}
          </span>
        ) : null}
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </span>
      </div>

      {/* Footer URL */}
      <span style={{ fontSize: 20, color: "#799dd6", display: "flex" }}>
        jgcreativetech.solutions
      </span>
    </div>
  );
}

export function renderOgImage(props: { kicker?: string; title: string }) {
  return new ImageResponse(<OgTemplate {...props} />, ogImageSize);
}
