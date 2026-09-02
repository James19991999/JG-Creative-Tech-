"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavItem = {
  label: string;
  href: string;
  icon: string;
};

const items: MobileNavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Solutions", href: "/solutions", icon: "grid_view" },
  { label: "Portfolio", href: "/portfolio", icon: "auto_stories" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

/**
 * Fixed bottom navigation shown on small screens only, mirroring the
 * Stitch "BottomNavBar" pattern used on Solutions/Portfolio/Contact.
 * Hidden at the md breakpoint where the SiteHeader desktop nav takes over.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/90 backdrop-blur-lg rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-2 scale-105 -translate-y-1 transition-all"
                : "flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-ink transition-colors"
            }
          >
            <span
              className="material-symbols-outlined mb-1"
              aria-hidden="true"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-manrope text-[11px] uppercase tracking-wider font-bold">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
