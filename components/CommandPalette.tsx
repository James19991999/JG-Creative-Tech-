"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { fuzzySearch } from "@/lib/fuzzy-search";
import type { SearchItem } from "@/lib/search-index";

const MAX_RESULTS = 8;

type CommandPaletteContextValue = {
  open: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

/**
 * Exposes `open()` to any component in the tree, so the trigger
 * button in SiteHeader can open the palette without prop-drilling the
 * search index through every page that renders SiteHeader.
 */
export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}

/**
 * Mounted once in the root layout. Owns the global Cmd+K / Ctrl+K
 * keyboard shortcut, the dialog's open state, and renders the actual
 * search UI. `items` is computed server-side in the root layout (see
 * lib/search-index.ts, which reads the filesystem for blog posts and
 * so can't run in the browser) and passed down once here.
 */
export function CommandPaletteProvider({
  items,
  children,
}: {
  items: SearchItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    return fuzzySearch(query, items, MAX_RESULTS).map((r) => r.item);
  }, [query, items]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    triggerRef.current?.focus();
  }, []);

  const openPalette = useCallback(() => {
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
  }, []);

  useEffect(() => {
    function handleGlobalKeydown(e: globalThis.KeyboardEvent) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        setOpen((current) => {
          if (current) return current;
          triggerRef.current = (document.activeElement as HTMLElement) ?? null;
          return true;
        });
      }
    }
    document.addEventListener("keydown", handleGlobalKeydown);
    return () => document.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function navigateTo(url: string) {
    close();
    router.push(url);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[activeIndex];
      if (selected) navigateTo(selected.url);
    }
  }

  return (
    <CommandPaletteContext.Provider value={{ open: openPalette }}>
      {children}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search this site"
          className="fixed inset-0 z-[200] bg-black/40 flex items-start justify-center px-4 pt-24"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-xl whisper-shadow overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
              <span
                className="material-symbols-outlined text-on-surface-variant"
                aria-hidden="true"
              >
                search
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, insights, portfolio..."
                aria-label="Search this site"
                aria-controls="command-palette-results"
                aria-activedescendant={
                  results[activeIndex] ? `command-palette-result-${activeIndex}` : undefined
                }
                role="combobox"
                aria-expanded={results.length > 0}
                autoComplete="off"
                className="flex-1 bg-transparent outline-none text-lg text-ink placeholder:text-on-surface-variant"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="text-on-surface-variant hover:text-ink transition-colors"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {query.trim().length === 0 ? (
              <p className="px-5 py-8 text-center text-on-surface-variant text-sm">
                Start typing to search the site.
              </p>
            ) : results.length === 0 ? (
              <p className="px-5 py-8 text-center text-on-surface-variant text-sm">
                No results for &quot;{query}&quot;.
              </p>
            ) : (
              <ul
                id="command-palette-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-96 overflow-y-auto py-2"
              >
                {results.map((result, i) => (
                  <li
                    key={result.url}
                    id={`command-palette-result-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => navigateTo(result.url)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`cursor-pointer text-left px-5 py-3 flex flex-col gap-0.5 transition-colors ${
                      i === activeIndex
                        ? "bg-surface-container text-ink"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span className="font-bold text-sm text-ink">{result.title}</span>
                    <span className="text-xs">
                      {result.category} · {result.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </CommandPaletteContext.Provider>
  );
}
