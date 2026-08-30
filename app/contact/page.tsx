import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Our Team",
  description:
    "Let's architect your digital future. Reach out to discuss infrastructure, strategy, or creative solutions for your business.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader activeHref="/contact" />

      <main id="main-content" className="pt-32 pb-28 md:pb-32 px-6 max-w-md mx-auto">
        {/* Editorial Header */}
        <section className="mb-10">
          <span className="text-on-tertiary-fixed-variant font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">
            Connect With Us
          </span>
          <div className="flex items-start">
            <div className="w-1 h-12 bg-on-tertiary-container mr-4 rounded-full" />
            <div>
              <h1 className="font-newsreader headline-md font-bold tracking-tight text-primary leading-tight">
                Contact Our Team
              </h1>
              <p className="mt-3 text-on-surface-variant leading-relaxed opacity-90">
                Let&apos;s architect your digital future. Reach out to
                discuss infrastructure, strategy, or creative solutions for
                your business.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-surface-container-lowest rounded-xl p-6 mb-8">
          <ContactForm />
        </section>

        {/* Quick Contact Bento */}
        <section className="grid grid-cols-2 gap-4 mb-10">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="bg-surface-container-low p-5 rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <div className="bg-primary-container w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white">
              <span className="material-symbols-outlined" aria-hidden="true">
                mail
              </span>
            </div>
            <h2 className="font-manrope font-bold text-sm text-primary mb-1">
              Email Us
            </h2>
            <p className="text-[11px] text-on-surface-variant break-all">
              {siteConfig.contact.email}
            </p>
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              siteConfig.contact.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-low p-5 rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white">
              <span className="material-symbols-outlined" aria-hidden="true">
                location_on
              </span>
            </div>
            <h2 className="font-manrope font-bold text-sm text-primary mb-1">
              Visit Us
            </h2>
            <p className="text-[11px] text-on-surface-variant">
              Nairobi, Kenya
            </p>
          </a>
        </section>

        {/* Visual Anchor */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-surface-container-high">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5wBDc71MfWKiTWpwEL18CEG7fKDC-UgkkxCZ1449zUCZ2c8IDI-Jfe7DKqDNGJ2vYjyWpaTHTv3t7UyMkd44DICkNvxDU-mODRwGOWIDVvbpNPbNgpYWv0-2Tuo-5FalUp8sWm0OLMw8J0PHId974nLIPk1iWDRo5d8Z16PSIF-c7z3P1EeZIGz21rVxuIR_p0dplBZ39rjhGPORaT1tNj-1EFG5PkmZTQ2UeqO8Fab5MkOwCLhOm-cFzte2r5Z18ZUNS7yrlJA"
            alt="Architectural detail of a modern glass building reflecting a Nairobi sunset"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-1">
              Regional Hub
            </p>
            <h2 className="font-newsreader italic text-lg">
              East Africa Headquarters
            </h2>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
