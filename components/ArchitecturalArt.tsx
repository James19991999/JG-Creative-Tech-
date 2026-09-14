/**
 * Reusable, theme-aware SVG illustrations replacing dead external
 * placeholder images (lh3.googleusercontent.com/aida-public/... -
 * leftover Stitch design-export preview URLs, confirmed to return 403
 * rather than assumed) found across 13 pages sitewide, not just one.
 *
 * Abstract illustrations rather than stock photos - no real
 * photography was available to license for any of these spots, and
 * hotlinking third-party images found via search would carry both
 * real copyright risk on a commercial site and the exact same
 * external-URL fragility that caused this bug in the first place.
 * Built as inline SVG using this site's own theme tokens
 * (fill-primary, fill-accent, etc.), so every variant adapts to dark
 * mode automatically like everything else on the site, with zero
 * separate dark-mode asset needed.
 *
 * Three variants for visual variety across pages that would
 * otherwise all show the identical graphic:
 * - "planes": overlapping architectural planes over a blueprint grid
 * - "tower": stacked, offset rectangles suggesting a building elevation
 * - "network": connected nodes, for tech/strategy-themed pages
 */

type Variant = "planes" | "tower" | "network";

function PlanesArt() {
  return (
    <>
      <g className="stroke-outline-variant" strokeWidth="0.5" opacity="0.4">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="394" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="700" y2={i * 50} />
        ))}
      </g>
      <rect x="140" y="90" width="260" height="260" rx="4" className="fill-primary-container" opacity="0.9" />
      <rect x="260" y="150" width="300" height="180" rx="4" className="fill-primary" opacity="0.95" />
      <rect x="330" y="60" width="180" height="140" rx="4" className="fill-accent" opacity="0.85" />
      <g className="stroke-on-primary" strokeWidth="1" opacity="0.35">
        <line x1="300" y1="150" x2="300" y2="330" />
        <line x1="420" y1="150" x2="420" y2="330" />
        <line x1="260" y1="220" x2="560" y2="220" />
      </g>
    </>
  );
}

function TowerArt() {
  return (
    <>
      <g className="stroke-outline-variant" strokeWidth="0.5" opacity="0.35">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="700" y2={i * 50} />
        ))}
      </g>
      <rect x="230" y="240" width="240" height="120" rx="3" className="fill-primary-container" opacity="0.9" />
      <rect x="260" y="150" width="180" height="110" rx="3" className="fill-primary" opacity="0.95" />
      <rect x="285" y="70" width="130" height="100" rx="3" className="fill-accent" opacity="0.9" />
      <g className="stroke-on-primary" strokeWidth="1" opacity="0.3">
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`t${i}`} x1={260 + i * 45} y1="150" x2={260 + i * 45} y2="260" />
        ))}
      </g>
    </>
  );
}

function NetworkArt() {
  const nodes = [
    { x: 180, y: 120 }, { x: 350, y: 80 }, { x: 520, y: 140 },
    { x: 230, y: 260 }, { x: 420, y: 290 }, { x: 550, y: 240 },
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
  ];
  return (
    <>
      <g className="stroke-primary" strokeWidth="1" opacity="0.4">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 2 ? 22 : 14}
          className={i === 2 ? "fill-accent" : i % 2 === 0 ? "fill-primary" : "fill-primary-container"}
          opacity="0.9"
        />
      ))}
    </>
  );
}

export function ArchitecturalArt({
  variant = "planes",
  label,
  className = "",
}: {
  variant?: Variant;
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 700 394" className={className} role="img" aria-label={label}>
      <rect width="700" height="394" className="fill-surface-container-low" />
      {variant === "planes" ? <PlanesArt /> : null}
      {variant === "tower" ? <TowerArt /> : null}
      {variant === "network" ? <NetworkArt /> : null}
    </svg>
  );
}
