/**
 * Compact "JG" monogram badge, matching the brand mark already used
 * as the site's PWA icon (app/icon.png) - rebuilt here as text/CSS
 * rather than an <Image> so it renders crisp at any size, needs no
 * extra network request, and follows the same theme-aware --color-
 * primary variable as the rest of the site (adapts correctly in dark
 * mode, unlike a static PNG baked with one fixed background color).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-xl bg-primary text-on-primary font-newsreader font-bold select-none ${className}`}
    >
      JG
    </span>
  );
}
