"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js for offline support. Deliberately scoped to
 * production only - registering a caching service worker in local dev
 * means every code change competes with a stale cache, which is a
 * confusing, easy-to-misdiagnose problem to hand a developer. Vercel
 * builds set NODE_ENV=production, so this fires correctly there.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("[pwa] service worker registration failed:", error);
    });
  }, []);

  return null;
}
