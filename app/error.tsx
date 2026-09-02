"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Next.js App Router error boundary. Catches unhandled runtime errors in
 * the subtree below the root layout and renders a branded fallback instead
 * of the default unstyled error screen.
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to your error-reporting service here (e.g. Sentry.captureException)
    console.error("[app/error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-6 block">
            Something went wrong
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-ink"
              style={{ fontFamily: "var(--font-newsreader, Georgia, serif)" }}>
            We hit an unexpected wall.
          </h1>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
            Our team has been notified. In the meantime, try refreshing — it
            usually resolves itself.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="px-8 py-4 rounded-full font-bold text-white"
              style={{ background: "linear-gradient(135deg, #001e40 0%, #003366 100%)" }}
            >
              Try again
            </button>
            <a
              href="/"
              className="px-8 py-4 rounded-full font-bold border border-outline-variant/40 text-ink hover:bg-surface-container-low transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
