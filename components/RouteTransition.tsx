"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The one orchestrated, felt-everywhere motion moment for the site:
 * a brief fade+rise as each new page's content mounts. Keyed by
 * pathname so React treats each route as a fresh subtree and replays
 * the animation on every navigation, not just first load.
 *
 * Deliberately just this one effect at the root, rather than adding
 * scroll-triggered reveals to every section - see the .page-transition
 * keyframes in globals.css, and the global prefers-reduced-motion
 * override that already disables all animation site-wide for anyone
 * who has that preference set.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
