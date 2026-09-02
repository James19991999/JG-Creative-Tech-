import type { Metadata } from "next";
import Image from "next/image";
import { PrivacyContactForm } from "@/components/PrivacyContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Protecting the digital foundations of Kenyan innovation. How JG Creative Tech Solution collects, uses, and protects your personal data under DPA 2019.",
  alternates: { canonical: "/legal/privacy" },
};

const drawerItems = [
  { href: "#introduction", label: "Introduction", icon: "verified_user" },
  { href: "#data-collection", label: "Data Collection", icon: "database" },
  { href: "#user-rights", label: "User Rights", icon: "shield_person" },
  { href: "#cookies", label: "Cookie Policy", icon: "cookie" },
  { href: "#retention", label: "Retention Policy", icon: "history" },
];

const dataCards = [
  {
    icon: "contact_page",
    title: "Contact Information",
    description:
      "Names, email addresses, and professional titles used strictly for service delivery and technical communication.",
  },
  {
    icon: "analytics",
    title: "Technical Logs",
    description:
      "IP addresses, browser metadata, and interaction timestamps to optimize our infrastructure performance and security protocols.",
  },
  {
    icon: "cookie",
    title: "Session Data",
    description:
      "Essential cookies that maintain secure sessions and user preferences during your navigation of our technical portal.",
  },
];

const rights = [
  {
    title: "The Right to Access",
    description:
      "You may request a copy of all personal data we hold about you at any time. We provide this in a machine-readable format.",
  },
  {
    title: "The Right to Rectification",
    description:
      "Inaccurate or incomplete data can be corrected upon request to our Data Protection Officer.",
  },
  {
    title: "The Right to Erasure",
    description:
      "Under certain conditions, you have the 'right to be forgotten' from our active marketing and analytical databases.",
  },
  {
    title: "The Right to Object",
    description:
      "You have the right to object to the processing of your data for direct marketing purposes.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-8 py-6 max-w-full mx-auto">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-ink text-3xl" aria-hidden="true">
              gavel
            </span>
            <span className="text-2xl font-newsreader font-black text-ink">
              Privacy Infrastructure
            </span>
          </div>
          <nav aria-label="Main" className="hidden md:flex gap-8 items-center">
            <a className="text-ink font-bold border-b-2 border-on-tertiary-container transition-colors" href="/legal/privacy">
              Framework
            </a>
            <a className="text-on-surface-variant font-medium hover:text-ink transition-colors" href="/legal/terms">
              Governance
            </a>
            <a className="text-on-surface-variant font-medium hover:text-ink transition-colors" href="/legal/cookies">
              Security
            </a>
            <a
              href="/contact"
              className="bg-primary px-6 py-2 rounded-full text-on-primary text-sm font-semibold active:opacity-70 active:scale-95 transition-all"
            >
              Contact Legal
            </a>
          </nav>
        </div>
      </header>

      {/* NavigationDrawer */}
      <aside className="fixed left-0 top-0 h-full w-72 p-6 z-40 bg-surface-container-low hidden lg:block rounded-r-3xl shadow-xl shadow-primary/5 mt-24">
        <div className="mb-10">
          <p className="text-lg font-newsreader font-bold text-ink">Policy Framework</p>
        </div>
        <nav aria-label="Legal pages" className="flex flex-col gap-2 font-manrope text-sm font-semibold tracking-wide">
          {drawerItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={
                index === 0
                  ? "bg-primary text-white rounded-full px-4 py-3 flex items-center gap-3 transition-all active:translate-x-1 duration-300"
                  : "text-on-surface-variant hover:bg-surface-container rounded-full px-4 py-3 flex items-center gap-3 transition-all"
              }
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content Canvas */}
      <main id="main-content" className="lg:ml-72 pt-32 px-6 md:px-12 lg:px-24 pb-24 max-w-7xl">
        {/* Hero Header */}
        <section className="mb-20 scroll-mt-32" id="introduction">
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-accent text-xs font-bold uppercase tracking-widest font-manrope">
              Privacy &amp; Sovereignty
            </span>
            <h1 className="text-5xl md:text-7xl font-newsreader text-ink leading-tight italic">
              Protecting the digital foundations of Kenyan innovation.
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 bg-surface-container-lowest p-8 md:p-12 rounded-xl">
              <p className="text-xs text-accent font-bold mb-4 uppercase tracking-widest">
                Last Updated: June 1, 2026
              </p>
              <p className="text-xl leading-relaxed text-on-surface-variant mb-6 font-manrope">
                At JG Creative Tech, we believe that privacy is the
                bedrock of trust in the digital age. Our commitment to
                digital sovereignty means that your data is treated with
                the same precision and care as the high-end
                infrastructure we build. This policy outlines how we
                protect your information while delivering world-class
                technical solutions.
              </p>
              <a href="#user-rights" className="flex items-center gap-4 text-secondary font-bold">
                <span>Read Our Commitment to DPA 2019</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  north_east
                </span>
              </a>
            </div>
            <div className="md:col-span-4 h-full">
              <div className="bg-primary-container text-on-primary-container p-8 rounded-xl h-full flex flex-col justify-end">
                <span
                  className="material-symbols-outlined text-4xl mb-4"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
                <h2 className="text-2xl font-newsreader italic mb-2">Zero-Trust Architecture</h2>
                <p className="text-sm text-white/70">
                  We employ industry-leading encryption and access
                  controls to ensure your infrastructure remains yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Section: Data Collection */}
        <section className="mb-24 scroll-mt-32" id="data-collection">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-12 bg-on-tertiary-container" />
            <h2 className="text-4xl font-newsreader">What we collect, and why.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataCards.map((card) => (
              <div key={card.title} className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-ink mb-6 block text-3xl" aria-hidden="true">
                  {card.icon}
                </span>
                <h3 className="text-xl font-newsreader italic mb-4">{card.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use of Information Section */}
        <section className="mb-24 bg-surface-container p-8 md:p-16 rounded-[2rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-newsreader mb-6">Information Usage</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                We transform raw data into architectural insights. Your
                information is never sold; it is leveraged to refine the
                performance, security, and scalability of our services.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary" aria-hidden="true">
                    check_circle
                  </span>
                  <div>
                    <p className="font-bold">Service Optimization</p>
                    <p className="text-sm text-on-surface-variant">
                      Improving the latency and reliability of our
                      localized cloud solutions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary" aria-hidden="true">
                    check_circle
                  </span>
                  <div>
                    <p className="font-bold">Legal Compliance</p>
                    <p className="text-sm text-on-surface-variant">
                      Ensuring our operations meet the strict requirements
                      of the Kenya Data Protection Act.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl w-full h-80 overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ltNjGClP7_LBlnepOeV3ShMBH-CgAFnedmiFsIM7OyRZaS_JXelKOW7WG2dGpeInQKs5F-m8Rcczh8L_zgBSXbe20c1f3FaMwJE23hVE802rC-t4gyMd9Ksm1tAjjpSYpvWsIXYtmAejqfyNpPdlygu1e-T_NJMTKm3yK2rtIZ0MRleELsweIJI8Ijj-XZzDw4YqLsvIctKQsAvuPRft659-XVxO0NsQhHo9V8yRgFR5rLaAB3iAK4WMED5m8VlCDoHOxHF1KA"
                  alt="Abstract close-up of blue glowing server racks in a high-tech data center with dramatic lighting"
                  fill
                  sizes="(max-width: 1024px) 90vw, 500px"
                  className="object-cover grayscale opacity-80 hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* User Rights Section */}
        <section className="mb-24 scroll-mt-32" id="user-rights">
          <h2 className="text-4xl font-newsreader mb-12">Global Rights, Local Presence.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/20 rounded-2xl overflow-hidden">
            {rights.map((right, index) => (
              <div
                key={right.title}
                className={`bg-surface p-10 flex flex-col gap-4 ${
                  index % 2 === 1 ? "md:border-l border-outline-variant/10" : ""
                } ${index >= 2 ? "border-t border-outline-variant/10" : ""}`}
              >
                <h3 className="text-xl font-bold font-manrope">{right.title}</h3>
                <p className="text-sm text-on-surface-variant">{right.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch scroll-mt-32" id="retention">
          <div className="md:col-span-7 bg-surface-container-lowest p-12 rounded-3xl">
            <h2 className="text-4xl font-newsreader mb-4 italic">Get in touch.</h2>
            <p className="text-on-surface-variant mb-10">
              Have questions about your data? Our dedicated DPO is here
              to assist with any inquiries regarding our privacy
              framework.
            </p>
            <PrivacyContactForm />
          </div>
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-secondary-container p-8 rounded-3xl flex-1">
              <h3 className="font-bold text-lg mb-2">Legal Office</h3>
              <p className="text-sm text-on-secondary-container">
                JG Creative Tech HQ
                <br />
                {siteConfig.contact.address}
              </p>
            </div>
            <div className="bg-tertiary-fixed p-8 rounded-3xl flex-1">
              <h3 className="font-bold text-lg mb-2 text-on-tertiary-fixed-variant">DPO Direct</h3>
              <p className="text-sm text-on-tertiary-fixed-variant">
                {siteConfig.contact.dpoEmail}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white w-full mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full max-w-full mx-auto">
          <div className="flex flex-col gap-2 mb-8 md:mb-0">
            <span className="text-white font-newsreader italic text-xl">JG Creative Tech</span>
            <p className="font-manrope text-xs uppercase tracking-widest text-on-primary-container">
              © 2026 Digital Architect Agency. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-manrope text-xs uppercase tracking-widest">
            <a className="text-on-tertiary-container font-bold active:scale-95 transition-all" href="/legal/terms">
              Terms of Service
            </a>
            <a className="text-on-primary-container hover:text-white transition-colors active:scale-95" href="/legal/privacy">
              Privacy Policy
            </a>
            <a className="text-on-primary-container hover:text-white transition-colors active:scale-95" href="/legal/cookies">
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
