"use client";

import Link from "next/link";

export type SidebarItem = {
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  items: SidebarItem[];
  activeHref: string;
  /** Small wordmark/icon shown at the top of the rail. */
  brandLabel?: string;
  brandIcon?: string;
  className?: string;
};

/**
 * Reusable sidebar navigation with icons, satisfying the brief's
 * "Sidebar navigation with icons (Home, About, Services, Contact-style)"
 * requirement. Used on the Client Portal and Digital Architecture pages,
 * which are the screens where the Stitch export itself used a persistent
 * side rail rather than a top nav.
 *
 * Collapses to icon-only on tablet widths and is hidden below `lg`, where
 * MobileBottomNav (or a page-specific bottom nav) takes over - matching
 * the responsive behavior specified in the Stitch screens.
 */
export function Sidebar({
  items,
  activeHref,
  brandLabel,
  brandIcon = "architecture",
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-full w-20 xl:w-64 flex-col items-center xl:items-stretch py-8 xl:px-4 bg-surface-container-low z-40 ${className}`}
    >
      <div className="mb-12 flex items-center gap-3 xl:px-2">
        <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">
          {brandIcon}
        </span>
        {brandLabel ? (
          <span className="hidden xl:inline font-newsreader font-bold text-primary text-lg">
            {brandLabel}
          </span>
        ) : null}
      </div>
      <nav aria-label="Sidebar" className="flex flex-col gap-2 w-full">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "flex items-center gap-3 justify-center xl:justify-start bg-white text-primary p-3 xl:px-4 xl:py-3 rounded-2xl shadow-md font-bold transition-colors"
                  : "flex items-center gap-3 justify-center xl:justify-start text-on-surface-variant hover:text-primary hover:bg-white/60 p-3 xl:px-4 xl:py-3 rounded-2xl transition-colors"
              }
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {item.icon}
              </span>
              <span className="hidden xl:inline font-manrope text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
