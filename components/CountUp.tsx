"use client";

import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 1800;

/**
 * Parses a label like "25+", "98%", or "-40%" into a numeric part to
 * animate plus the surrounding prefix/suffix characters to keep
 * static (the "-", "+", "%", etc). Deliberately permissive: if the
 * string doesn't contain a clean number (e.g. "Real-time", "Enabled",
 * "CMS-driven" - several of this site's real portfolio stat values),
 * returns null rather than guessing, so the caller can fall back to
 * rendering the original text unchanged. This is what makes the
 * component safe to drop onto any stat value sitewide without
 * needing to know in advance which ones are numeric.
 */
function parseNumericLabel(
  label: string
): { prefix: string; target: number; suffix: string; decimals: number } | null {
  const match = label.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
  if (!match) return null;
  const [, prefix, numberPart, suffix] = match;
  const decimals = numberPart.includes(".") ? numberPart.split(".")[1].length : 0;
  return { prefix, target: parseFloat(numberPart), suffix, decimals };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a stat value counting up from 0 once it scrolls into view.
 * Runs exactly once per mount (re-scrolling past it doesn't replay
 * the count), respects prefers-reduced-motion (jumps straight to the
 * final value, no animation), and keeps the animated span aria-hidden
 * with a static visually-hidden alternative carrying the real value -
 * a screen reader should hear the actual number once, not a stream of
 * rapidly changing interim values or risk reading "0" mid-animation.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const parsed = parseNumericLabel(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!parsed || !ref.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();
        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
          const current = parsed!.target * easeOutCubic(progress);
          setDisplay(`${parsed!.prefix}${current.toFixed(parsed!.decimals)}${parsed!.suffix}`);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setDisplay(value); // land exactly on the original string, no float rounding drift
          }
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
