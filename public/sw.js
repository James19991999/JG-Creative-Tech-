/**
 * Service worker for offline support. Bump CACHE_VERSION on any
 * change to this file's caching behavior - the activate handler uses
 * it to delete every previously cached version, so a stale cache
 * never lingers across deploys.
 *
 * Strategy, deliberately different per request type:
 * - Page navigations: network-first, falling back to the cached copy
 *   of that exact page, then to /offline if it was never visited.
 *   Always prefers fresh content when online; only serves cache when
 *   the network genuinely fails.
 * - Static assets (_next/static, images, fonts, videos): stale-while-
 *   revalidate - serve the cached copy instantly if present, and
 *   refresh the cache in the background for next time.
 * - API routes and the entire /client-portal path: never touched by
 *   this service worker at all. Caching auth-gated or form-submission
 *   requests is a correctness/security risk, not a convenience - the
 *   client portal already has its own real-time Firestore listeners
 *   and doesn't need (or want) a stale cached shell.
 */

const CACHE_VERSION = "v1";
const CACHE_NAME = `jgct-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = ["/", "/offline"];

const STATIC_ASSET_PATTERN =
  /\.(png|jpg|jpeg|svg|webp|avif|ico|woff2?|css|js|mp4|webm)$/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/client-portal")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") || STATIC_ASSET_PATTERN.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchAndUpdate = fetch(request)
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || fetchAndUpdate;
        })
      )
    );
  }
});
