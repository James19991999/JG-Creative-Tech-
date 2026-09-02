"use client";

import { useEffect, useState } from "react";
import { useCommandPalette } from "@/components/CommandPalette";

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
}

export function SearchTriggerButton() {
  const { open } = useCommandPalette();
  const [mac, setMac] = useState(false);

  // Read navigator.platform only after mount, so server and first
  // client render match (avoids a hydration mismatch warning).
  useEffect(() => {
    setMac(isMac());
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search (Cmd+K)"
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:text-ink hover:border-outline transition-colors text-sm"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          search
        </span>
        <span className="font-manrope">Search</span>
        <kbd className="font-manrope text-xs bg-surface-container px-1.5 py-0.5 rounded">
          {mac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <button
        type="button"
        onClick={open}
        aria-label="Search"
        className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-ink transition-colors"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">
          search
        </span>
      </button>
    </>
  );
}
