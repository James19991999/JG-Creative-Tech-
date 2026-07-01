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

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}
