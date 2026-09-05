import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware Link/useRouter/usePathname/redirect, matched to the
 * "as-needed" prefix strategy in routing.ts. Every file that
 * previously imported these from "next/link" or "next/navigation"
 * for site navigation now imports from here instead - the href/path
 * values themselves are unchanged (e.g. href="/about" still works),
 * only the import source changes, so this is a mechanical swap across
 * the codebase rather than a rewrite of every link.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
