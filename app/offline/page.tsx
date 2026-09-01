import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { OfflineReloadButton } from "@/components/OfflineReloadButton";

export const metadata: Metadata = {
  title: "You're Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <>
      <SiteHeader />

      <main
        id="main-content"
        className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-24"
      >
        <div className="max-w-lg text-center">
          <span className="text-on-tertiary-fixed-variant font-bold tracking-widest uppercase text-xs mb-6 block">
            No Connection
          </span>
          <h1 className="font-newsreader text-6xl md:text-7xl text-primary font-bold mb-6">
            You&apos;re offline.
          </h1>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
            This page hasn&apos;t been saved for offline viewing yet. Pages
            you&apos;ve already visited will still work without a
            connection — try going back, or reconnect and try again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <OfflineReloadButton />
            <Button href="/" variant="secondary" size="lg">
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
