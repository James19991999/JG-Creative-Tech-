import type { Config } from "tailwindcss";

// Design tokens lifted verbatim from the Stitch "Editorial Infrastructure"
// design system export (savannah_nexus/DESIGN.md) so visual output matches
// the approved Stitch screens exactly.
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /*
          Every dynamic token below reads from a CSS variable (defined
          for :root/light and .dark in globals.css) via the
          rgb(var(--x) / <alpha-value>) pattern, which is what lets
          Tailwind's opacity modifiers (bg-primary/60, text-secondary/70,
          etc.) keep working correctly in both themes - a plain
          "var(--x)" reference would break every /NN opacity utility
          already used throughout this codebase.

          "-fixed" family tokens stay as static hex: Material 3 defines
          "fixed" roles as identical across light/dark by design, and
          this codebase's existing usages of them were already
          dark-mode-safe. tertiary/on-tertiary/on-tertiary-container
          also stay static - verified to clear WCAG AA against both the
          light and dark surfaces they're actually used against.
        */
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",
        "surface-dim": "rgb(var(--color-surface-dim) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-background": "rgb(var(--color-on-background) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",

        // New token this project introduces to resolve a real conflict:
        // the original Stitch export used "primary" both as heading ink
        // (needs to flip light<->dark) AND as a solid dark decorative
        // background/button color (needs to stay dark in both modes).
        // One CSS variable can't correctly serve both roles at once, so
        // "ink" now carries the heading-text role and "primary" keeps
        // the background role. See the dark-mode commit notes for the
        // full reasoning and contrast verification.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",

        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--color-on-primary-container) / <alpha-value>)",

        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--color-on-secondary-container) / <alpha-value>)",

        error: "rgb(var(--color-error) / <alpha-value>)",
        "on-error": "rgb(var(--color-on-error) / <alpha-value>)",
        "error-container": "rgb(var(--color-error-container) / <alpha-value>)",
        "on-error-container": "rgb(var(--color-on-error-container) / <alpha-value>)",

        "inverse-surface": "rgb(var(--color-inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--color-inverse-on-surface) / <alpha-value>)",
        "inverse-primary": "rgb(var(--color-inverse-primary) / <alpha-value>)",
        "surface-tint": "rgb(var(--color-surface-tint) / <alpha-value>)",

        // Static, mode-invariant tokens (M3 "fixed" family + tertiary)
        "tertiary-fixed-dim": "#ffb59c",
        "tertiary-container": "#611b00",
        tertiary: "#3d0e00",
        "on-secondary-fixed": "#002020",
        "primary-fixed": "#d5e3ff",
        "on-primary-fixed-variant": "#1f477b",
        "on-tertiary-fixed": "#390c00",
        "on-tertiary-container": "#ff6f3a",
        "tertiary-fixed": "#ffdbcf",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed-variant": "#832700",
        "on-secondary-fixed-variant": "#004f4f",
        "on-primary-fixed": "#001b3c",
        "secondary-fixed-dim": "#76d6d5",
        "primary-fixed-dim": "#a7c8ff",
        "secondary-fixed": "#93f2f2",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        newsreader: ["var(--font-newsreader)", "serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
        headline: ["var(--font-newsreader)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        label: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1" }],
        "headline-md": ["1.75rem", { lineHeight: "1.25" }],
        "title-lg": ["1.375rem", { lineHeight: "1.4" }],
        "body-md": ["0.875rem", { lineHeight: "1.5" }],
        "label-md": ["0.75rem", { lineHeight: "1.3" }],
      },
      boxShadow: {
        whisper: "0 8px 32px rgba(25, 28, 30, 0.06)",
        "whisper-lg": "0 8px 40px -12px rgba(25, 28, 30, 0.06)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #001e40 0%, #003366 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
