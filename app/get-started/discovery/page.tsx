import type { Metadata } from "next";
import { DiscoveryForm } from "@/components/DiscoveryForm";

export const metadata: Metadata = {
  title: "Project Discovery | The Digital Architect",
  description:
    "Step 1 of 2: Tell us about your vision so we can architect the infrastructure for your success.",
  alternates: { canonical: "/get-started/discovery" },
  robots: { index: false, follow: false },
};

export default function ProjectDiscoveryPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative">
      {/* TopAppBar - Suppressed main nav for focused onboarding journey */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-ink text-2xl" aria-hidden="true">
              architecture
            </span>
            <span className="font-newsreader text-2xl font-bold tracking-tight text-ink">
              The Digital Architect
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-manrope uppercase tracking-widest text-on-surface-variant">
              Step 1 of 2
            </span>
            <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-on-tertiary-container" />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="pt-32 pb-16 px-6 md:px-12 max-w-2xl mx-auto">
        {/* Hero Section for Onboarding */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-on-tertiary-container" />
            <span className="text-accent font-manrope uppercase tracking-widest font-semibold text-xs">
              Initiation Phase
            </span>
          </div>
          <h1 className="font-newsreader text-4xl md:text-5xl text-ink font-bold mb-4 leading-tight">
            Project Discovery
          </h1>
          <p className="text-on-surface-variant text-lg max-w-prose">
            Welcome to the first step of your digital evolution. Tell us
            about your vision so we can architect the infrastructure for
            your success.
          </p>
        </section>

        <DiscoveryForm />
      </main>

      {/* Footer - Simplified for onboarding */}
      <footer className="w-full py-16 px-8 mt-24 bg-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-screen-2xl mx-auto">
          <div>
            <p className="font-manrope text-sm uppercase tracking-widest text-on-primary-container">
              © 2026 JG Creative Tech Solution. Institutional Stability
              through Agile Innovation.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 justify-start md:justify-end">
            <a
              className="text-on-primary-container hover:text-white transition-colors font-manrope text-sm uppercase tracking-widest"
              href="/legal/privacy"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-primary-container hover:text-white transition-colors font-manrope text-sm uppercase tracking-widest"
              href="/contact"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Side Graphic (Decorative Desktop Element) */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed right-0 top-0 h-full w-1/4 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary-container opacity-5" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 border-2 border-primary/10 rounded-full" />
        <div className="absolute top-1/2 right-10 w-40 h-40 border-2 border-on-tertiary-container/20 rounded-full" />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative fixed-position background element, next/image's fill behavior conflicts with this fixed/absolute layering */}
        <img
          alt=""
          className="absolute bottom-0 right-0 w-full h-1/2 object-cover grayscale opacity-20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCklYjdZGUJJA317b7s7A3gc3V6XKchhvVi22QcMrmJPJfQ0DNfRcL1jV3LAcRbo47Khy8aM1BuExfZLGx16jGRoso-G3MKun1ki8ikYtJJqOWbHLeAbqPlKkLj3wNLPKfL0I_dq3WVPanImBzIiDW3rKXjPSgMv_91Cn-ZipmrBFt1ZVPvrf7sEudB0pco96dNfbKzH9ldDQk5LAHkdJkMjSZYpqSW5wy7Wt5n_5vZ1pnfd8ZWRGy39K6GSqnDcX0uZueQtYDNGQ"
        />
      </div>
    </div>
  );
}
