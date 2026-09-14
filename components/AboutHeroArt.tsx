/**
 * Replaces a dead external placeholder image
 * (lh3.googleusercontent.com/aida-public/... - a leftover Stitch
 * design-export preview URL that returns 403, confirmed directly
 * rather than assumed) that was leaving an empty space on the About
 * page hero.
 *
 * An abstract, editorial illustration rather than a stock photo -
 * no real photography was available to license, and hotlinking a
 * third-party image found via search would have both real copyright
 * risk on a commercial site and the exact same external-URL fragility
 * that caused this bug in the first place. Built as inline SVG using
 * this site's own theme tokens (fill-primary, fill-accent, etc. - the
 * same CSS variables every other themed element on the site uses),
 * so it correctly adapts to dark mode automatically rather than
 * needing a separate dark-mode asset.
 *
 * Composition: overlapping architectural planes over a light
 * blueprint grid - a literal nod to "digital architecture" without
 * trying to fake a photorealistic workspace scene.
 */
export function AboutHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 700 394"
      className={className}
      role="img"
      aria-label="Abstract illustration of overlapping architectural planes over a blueprint grid, symbolizing the Digital Architect philosophy"
    >
      <rect width="700" height="394" className="fill-surface-container-low" />

      {/* Blueprint grid */}
      <g className="stroke-outline-variant" strokeWidth="0.5" opacity="0.4">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="394" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="700" y2={i * 50} />
        ))}
      </g>

      {/* Overlapping architectural planes */}
      <rect x="140" y="90" width="260" height="260" rx="4" className="fill-primary-container" opacity="0.9" />
      <rect x="260" y="150" width="300" height="180" rx="4" className="fill-primary" opacity="0.95" />
      <rect x="330" y="60" width="180" height="140" rx="4" className="fill-accent" opacity="0.85" />

      {/* Structural lines suggesting a floor plan within the largest plane */}
      <g className="stroke-on-primary" strokeWidth="1" opacity="0.35">
        <line x1="300" y1="150" x2="300" y2="330" />
        <line x1="420" y1="150" x2="420" y2="330" />
        <line x1="260" y1="220" x2="560" y2="220" />
      </g>
    </svg>
  );
}
