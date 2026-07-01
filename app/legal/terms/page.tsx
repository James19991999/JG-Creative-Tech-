import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your access to and use of JG Creative Tech's digital infrastructure services, frameworks, and consulting protocols.",
  alternates: { canonical: "/legal/terms" },
};

const navItems = [
  { href: "#acceptance", label: "1. Acceptance of Terms" },
  { href: "#intellectual", label: "2. Intellectual Property" },
  { href: "#responsibilities", label: "3. User Responsibilities" },
  { href: "#liability", label: "4. Limitation of Liability" },
  { href: "#governing", label: "5. Governing Law" },
  { href: "#updates", label: "6. Updates to Terms" },
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-surface text-on-surface font-manrope selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-xl fixed w-full top-0 z-50 shadow-[0_8px_40px_rgba(25,28,30,0.06)]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden">
              <span className="font-newsreader text-sm">JG</span>
            </div>
            <span className="font-newsreader text-xl font-bold text-primary">Legal Infrastructure</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="font-manrope text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-300" href="/legal/terms">
              Overview
            </a>
            <a className="font-manrope text-sm font-medium text-primary border-b-2 border-tertiary-fixed-variant pb-1" href="/legal/terms">
              User Agreement
            </a>
            <a className="font-manrope text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-300" href="/legal/privacy">
              Privacy Standards
            </a>
            <a className="font-manrope text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-300" href="/legal/cookies">
              Compliance
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="font-manrope text-xs uppercase tracking-widest text-on-tertiary-fixed-variant mb-4">
                Institutional Framework
              </p>
              <h1 className="font-newsreader text-5xl md:text-6xl text-primary tracking-tight mb-6">
                Terms of Service
              </h1>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  calendar_today
                </span>
                <span className="font-manrope text-sm">Last Updated: June 1, 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 space-y-1">
              <div className="bg-surface-container-low p-6 rounded-xl">
                <h3 className="font-newsreader text-lg text-on-tertiary-fixed-variant mb-6">
                  Legal Directory
                </h3>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={
                        index === 0
                          ? "bg-primary-container text-on-primary-container rounded-lg font-bold p-3 font-manrope text-sm block transition-transform duration-200 hover:translate-x-1"
                          : "text-on-surface-variant hover:bg-surface-container-low rounded-lg p-3 font-manrope text-sm block transition-transform duration-200 hover:translate-x-1"
                      }
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="mt-8 p-6 bg-primary-container rounded-xl overflow-hidden relative">
                <div aria-hidden="true" className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                <h4 className="font-newsreader text-white text-xl relative z-10">Need clarity?</h4>
                <p className="text-on-primary-container text-sm mt-2 relative z-10">
                  Our legal desk is available for infrastructure
                  consultation.
                </p>
                <a
                  className="inline-block mt-4 text-secondary-fixed-dim font-bold text-sm hover:underline relative z-10"
                  href="/contact"
                >
                  Contact Legal Team
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content */}
          <div className="lg:col-span-9 space-y-16">
            {/* Section 1: Introduction */}
            <article className="bg-surface-container-lowest p-8 md:p-12 rounded-xl relative overflow-hidden scroll-mt-32" id="acceptance">
              <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-on-tertiary-container" />
              <div className="flex items-center gap-4 mb-6">
                <span className="font-newsreader text-4xl text-primary opacity-20">01</span>
                <h2 className="font-newsreader text-3xl text-primary">
                  Introduction &amp; Acceptance of Terms
                </h2>
              </div>
              <div className="space-y-6 text-on-surface-variant font-manrope leading-relaxed">
                <p>
                  Welcome to <span className="font-bold text-primary italic">JG Creative Tech</span>.
                  These Terms of Service (&quot;Terms&quot;) constitute a
                  legally binding agreement between you, whether
                  personally or on behalf of an entity (&quot;Client&quot;),
                  and JG Creative Tech, concerning your access to and use
                  of our digital infrastructure services, frameworks, and
                  consulting protocols.
                </p>
                <p>
                  By accessing our services, you acknowledge that you have
                  read, understood, and agreed to be bound by these Terms.
                  If you do not agree with all of these Terms, then you
                  are expressly prohibited from using our services and
                  must discontinue use immediately.
                </p>
              </div>
            </article>

            {/* Section 2: Intellectual Property */}
            <article className="bg-surface-container-low p-8 md:p-12 rounded-xl scroll-mt-32" id="intellectual">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-newsreader text-4xl text-primary opacity-20">02</span>
                <h2 className="font-newsreader text-3xl text-primary">Intellectual Property Rights</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-manrope text-lg font-bold text-primary">Proprietary Architecture</h4>
                  <p className="text-on-surface-variant text-sm">
                    Unless otherwise indicated, all digital architecture,
                    source code, databases, functionality, software,
                    website designs, audio, video, text, and graphics
                    (collectively, the &quot;Infrastructure
                    Content&quot;) are our proprietary property.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-lg border-l-4 border-secondary shadow-sm">
                  <p className="text-primary font-bold text-sm mb-2">The &quot;Digital Architect&quot; Clause:</p>
                  <p className="text-on-surface-variant text-sm italic">
                    Clients are granted a non-exclusive license to use the
                    delivered infrastructure, but the underlying
                    proprietary frameworks remain the exclusive
                    intellectual property of JG Creative Tech.
                  </p>
                </div>
              </div>
            </article>

            {/* Image Break */}
            <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLHJV7P4LBwe88yXNpgKdg5tJFBPvxxwLu6JLsVJUm2neoI3zrzAywmdy7-X6VB3HWYiW2xZUAWUzykjDiWeHsAUUwom_pcDXzBdnW-wvPMjeCvhnx4V4ya1bx0woeZSBt4jyo0Y6AxMhmPu-4G9murN5QXVzmw2lVPlQvGh5RWmsOuRegJkc6Ctu4f-odoXgDzPeSkkepzaqifqiIGJU3UWr123dp5U-3HC-aZ0pvAsxzXcROwkmjGMLCJeUP4Kca86DArapoIg"
                alt="Sophisticated architectural interior of a modern legal office in Nairobi with glass walls, mahogany accents, and soft morning sunlight"
                fill
                sizes="(max-width: 1024px) 90vw, 900px"
                className="object-cover grayscale contrast-125"
              />
            </div>

            {/* Section 3: User Responsibilities */}
            <article className="bg-surface-container-lowest p-8 md:p-12 rounded-xl scroll-mt-32" id="responsibilities">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-newsreader text-4xl text-primary opacity-20">03</span>
                <h2 className="font-newsreader text-3xl text-primary">User Responsibilities</h2>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-on-tertiary-container mt-1" aria-hidden="true">
                    check_circle
                  </span>
                  <div>
                    <h5 className="font-manrope font-bold text-primary">Compliance Standards</h5>
                    <p className="text-on-surface-variant text-sm">
                      Users must ensure that all data and interactions
                      with our systems comply with Kenyan data protection
                      laws and international standards.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-on-tertiary-container mt-1" aria-hidden="true">
                    check_circle
                  </span>
                  <div>
                    <h5 className="font-manrope font-bold text-primary">Integrity of Systems</h5>
                    <p className="text-on-surface-variant text-sm">
                      Users are prohibited from reverse-engineering,
                      attempting to gain unauthorized access, or
                      disrupting the operational stability of the JG
                      Creative Tech ecosystem.
                    </p>
                  </div>
                </li>
              </ul>
            </article>

            {/* Section 4 & 5 Bento Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <article className="bg-primary text-on-primary p-8 md:p-10 rounded-xl scroll-mt-32" id="liability">
                <h2 className="font-newsreader text-3xl mb-6">Limitation of Liability</h2>
                <p className="font-manrope text-sm opacity-80 leading-relaxed">
                  To the maximum extent permitted by applicable law, JG
                  Creative Tech shall not be liable for any indirect,
                  incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits,
                  data, or use, arising out of our professional services.
                </p>
              </article>
              <article className="bg-surface-container-high p-8 md:p-10 rounded-xl flex flex-col justify-between scroll-mt-32" id="governing">
                <div>
                  <h2 className="font-newsreader text-3xl text-primary mb-6">Governing Law</h2>
                  <p className="font-manrope text-sm text-on-surface-variant">
                    These Terms shall be governed by and defined following
                    the laws of <span className="font-bold">Kenya</span>.
                    JG Creative Tech and yourself irrevocably consent that
                    the courts of Kenya shall have exclusive jurisdiction
                    to resolve any dispute.
                  </p>
                </div>
              </article>
            </div>

            {/* Section 6: Updates */}
            <article className="bg-surface-container-lowest p-8 md:p-12 rounded-xl text-center scroll-mt-32" id="updates">
              <div className="max-w-xl mx-auto">
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">
                  update
                </span>
                <h2 className="font-newsreader text-3xl text-primary mb-4">Updates to Terms</h2>
                <p className="text-on-surface-variant font-manrope text-sm mb-8">
                  We reserve the right to modify these Terms at any time.
                  We will notify clients of material changes via the
                  email associated with their account or through a
                  prominent notice on our infrastructure dashboard.
                </p>
                <a
                  href={`mailto:${siteConfig.contact.legalEmail}`}
                  className="inline-block bg-surface-container-highest text-primary font-bold px-6 py-3 rounded-full hover:bg-outline-variant/30 transition-colors"
                >
                  Subscribe to Legal Alerts
                </a>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary w-full">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-newsreader italic text-on-tertiary-fixed-variant text-xl font-bold">
              JG Creative Tech
            </span>
            <p className="font-manrope text-xs uppercase tracking-widest text-on-primary/70">
              © 2026 JG Creative Tech. Engineered for Excellence.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-manrope text-xs uppercase tracking-widest text-on-primary/70 hover:text-white transition-opacity" href="/legal/terms">
              Terms of Service
            </a>
            <a className="font-manrope text-xs uppercase tracking-widest text-on-primary/70 hover:text-white transition-opacity" href="/legal/privacy">
              Privacy Policy
            </a>
            <a className="font-manrope text-xs uppercase tracking-widest text-on-primary/70 hover:text-white transition-opacity" href="/legal/cookies">
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
