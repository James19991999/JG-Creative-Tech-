"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { primaryNavLinks } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";

type SiteHeaderProps = {
  activeHref?: string;
  className?: string;
};

/**
 * Top navigation bar. On desktop: horizontal link row + CTA.
 * On mobile: wordmark + CTA visible at all times; tapping the menu
 * icon slides in a full-screen drawer covering all primary nav links,
 * including pages not reachable from MobileBottomNav (About, Digital
 * Architecture, Digital Strategy, Innovation Lab, Legal).
 */
export function SiteHeader({ activeHref, className = "" }: SiteHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const allNavLinks = [
    ...primaryNavLinks,
    { label: "Digital Architecture", href: "/digital-architecture" },
    { label: "Digital Strategy", href: "/digital-strategy" },
    { label: "Innovation Lab", href: "/innovation-lab" },
    { label: "Client Portal", href: "/client-portal" },
    { label: "Privacy Policy", href: "/legal/privacy" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md glass-nav ${className}`}
      >
        <nav
          aria-label="Primary"
          className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="text-2xl font-newsreader font-bold text-ink"
          >
            JG Creative Tech
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center">
            {primaryNavLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "text-ink border-b-2 border-primary font-bold pb-1 font-newsreader tracking-tight transition-colors duration-300"
                      : "text-on-surface-variant font-manrope hover:text-ink transition-colors duration-300"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* CTA — always visible */}
            <Link
              href="/schedule-consultation"
              className="gradient-primary text-on-primary px-5 py-2.5 rounded-full font-manrope font-bold text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Get Started
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span
                className={`block h-0.5 w-5 bg-primary transition-transform duration-300 origin-center ${
                  drawerOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-primary transition-opacity duration-300 ${
                  drawerOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-primary transition-transform duration-300 origin-center ${
                  drawerOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        aria-hidden={!drawerOpen}
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Panel */}
        <nav
          aria-label="Mobile"
          className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-surface shadow-2xl flex flex-col pt-24 pb-8 px-6 transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-1 flex-1">
            {allNavLinks.map((link) => {
              const isActive =
                activeHref === link.href || pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-manrope font-medium transition-colors ${
                      isActive
                        ? "bg-primary-container text-on-primary-container font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Footer inside drawer */}
          <div className="border-t border-outline-variant/20 pt-6">
            <Link
              href="/schedule-consultation"
              className="block w-full text-center gradient-primary text-on-primary px-6 py-3 rounded-full font-manrope font-bold hover:opacity-90 transition-all"
            >
              Book a Consultation
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
