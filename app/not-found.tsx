import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-lg text-center">
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-6 block">
            404 Error
          </span>
          <h1 className="font-newsreader text-6xl md:text-7xl text-ink font-bold mb-6">
            Lost in the architecture.
          </h1>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved. Let&apos;s get you back to solid ground.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/" size="lg">
              Back to Home
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
