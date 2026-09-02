import type { ReactNode } from "react";

type FeatureCardVariant = "light" | "dark" | "muted";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  /** Tailwind col-span utility, e.g. "md:col-span-4". Defaults to no span override. */
  span?: string;
  variant?: FeatureCardVariant;
  /** Optional trailing decorative content (e.g. a large background icon). */
  decoration?: ReactNode;
  className?: string;
};

const variantStyles: Record<FeatureCardVariant, string> = {
  light:
    "bg-surface-container-lowest text-ink whisper-shadow ghost-border hover:bg-surface-container-high",
  dark: "bg-primary-container text-on-primary whisper-shadow",
  muted: "bg-surface-container text-ink ghost-border",
};

const descriptionVariantStyles: Record<FeatureCardVariant, string> = {
  light: "text-on-surface-variant",
  dark: "text-on-primary-container",
  muted: "text-on-surface-variant",
};

// The "dark" variant sits on the deep-navy primary-container background,
// where the default teal (text-secondary) icon color fails WCAG contrast
// (1.96:1, needs 3:1 for a large glyph). on-primary-container is the
// token this component already pairs with primary-container elsewhere
// (see descriptionVariantStyles above), and it clears contrast at ~4.6:1.
const iconVariantStyles: Record<FeatureCardVariant, string> = {
  light: "text-secondary",
  dark: "text-on-primary-container",
  muted: "text-secondary",
};

/**
 * Reusable feature/service card used across the bento-style grids on the
 * Home, Solutions, and Digital Architecture pages. Mirrors the Stitch
 * "Services Grid (Bento Style)" markup: icon, headline, description, and
 * an optional col-span for asymmetric layouts.
 */
export function FeatureCard({
  icon,
  title,
  description,
  span = "",
  variant = "light",
  decoration,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-10 transition-all duration-500 group ${variantStyles[variant]} ${span} ${className}`}
    >
      <div className="relative z-10">
        <span
          className={`material-symbols-outlined text-4xl mb-6 block ${iconVariantStyles[variant]}`}
          aria-hidden="true"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h3 className="text-2xl font-newsreader font-bold mt-2 mb-4">{title}</h3>
        <p className={`max-w-md ${descriptionVariantStyles[variant]}`}>
          {description}
        </p>
      </div>
      {decoration ? (
        <div className="absolute right-0 bottom-0 opacity-10 scale-150 pointer-events-none">
          {decoration}
        </div>
      ) : null}
    </div>
  );
}
