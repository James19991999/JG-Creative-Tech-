"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "jgct-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Toggles between light/dark and persists the explicit choice to
 * localStorage. Before any explicit choice is made, the site follows
 * the system's prefers-color-scheme (set by the blocking script in
 * app/layout.tsx - see ThemeScript - which also prevents a flash of
 * the wrong theme on first paint).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Avoid rendering a possibly-wrong icon before we've read the real
  // preference on mount (theme starts null server-side/pre-hydration).
  if (theme === null) {
    return (
      <button
        type="button"
        aria-label="Toggle dark mode"
        disabled
        className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant opacity-0"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">
          dark_mode
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-ink transition-colors"
    >
      <span className="material-symbols-outlined text-xl" aria-hidden="true">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
