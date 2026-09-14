/**
 * Minimal in-memory rate limiter for API routes. Tracks request counts
 * per key (e.g. IP address) within a sliding window. This is process-
 * local, so it resets on redeploy and won't coordinate across multiple
 * server instances - sufficient for a single small contact form, not a
 * substitute for a real rate-limiting service (e.g. Upstash, Vercel
 * Firewall) if traffic grows.
 */

type Bucket = {
  count: number;
  windowStart: number;
};

const buckets = new Map<string, Bucket>();

const DEFAULT_WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX_REQUESTS_PER_WINDOW = 5;

/**
 * @param key Unique bucket key, e.g. `contact:${ip}`.
 * @param maxRequests Optional override - defaults to 5, the right
 *   number for a form someone submits once per visit. A route with
 *   different usage patterns (e.g. a real back-and-forth chat, where
 *   several messages in a minute is normal, not abuse) should pass a
 *   more appropriate limit rather than reuse the form default.
 * @param windowMs Optional override - defaults to 60 seconds.
 */
export function isRateLimited(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS_PER_WINDOW,
  windowMs: number = DEFAULT_WINDOW_MS
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > maxRequests;
}
