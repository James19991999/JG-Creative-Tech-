import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { HeroVideo } from "@/components/HeroVideo";
import { portfolioProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "JG Creative Tech Solution | Digital Infrastructure for Kenyan SMEs",
  description:
    "We build the digital foundations that allow local resilience to scale globally. Premium architecture for businesses that demand excellence.",
  alternates: { canonical: "/" },
};

const testimonials = [
  {
    quote:
      "JG Creative Tech transformed our messy legacy systems into a streamlined powerhouse. The reliability is unmatched.",
    name: "Samuel D.",
    role: "CEO, Sammy Dylax",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwHcbZ6nRx4bM_SmdThxrWHEQ0Wt-ZQx03jtj3TstvuAJTJjAdf8bnffaG2e2s4acz8gyZEhCjwvZ8-B99b_n6jBOWnF7c2UNwg8nLcGlGiyliMJuLwsExOjIwx0RpE4xIxuBqY0oZje-p2hS-c_PGIT3rBfyZ7HCJGQQtBe9KKh5ZsFKmSgNeo1Na4uD_bkH5ejOP6jqp7oIpR8BoyqMwxFjwSZX-ZvNBLw6E8CozNhTs6veBHQcePM4pZh0gTmj-UkJbJUI9KA",
  },
  {
    quote:
      "Their eye for design and performance is world-class. We finally have a digital presence that reflects our stature.",
    name: "Grace M.",
    role: "Managing Director, GM Global",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDseZqR0Yfhs2f9l6Z_7QhsTctRLGL2sCu9dPqtC87cAOn7v2q2KR_JKkZo-CzkO5ohZzCUR--9gkX2ghtMkxoBLSZ-NXpd9c1JXow4OQ7-eYylzilwZHkFpvfDKNF4B0-ErC0LX-ZpMM6DYnnLN4o7Ny-zPbmPhKQhjKXLYIj6ZRHP6F3ArMoq9qWZtikYJAmculdDdLdmDOmF2DNyHOUqyTAGDSMFLjoxY0KJn-d7UWwT_isr-O_DXi5E1ik7TCK_yMVXQasHQ",
  },
];

// Show the two most recent case studies from the shared portfolio data
// source on the homepage. Linking to /portfolio/[slug] keeps these
// thumbnails in sync with the real case study pages.
const portfolioPreview = portfolioProjects.slice(0, 2);

export default function HomePage() {
  return (
    <>
      <SiteHeader activeHref="/solutions" />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span
                className="hero-reveal inline-block text-on-tertiary-fixed-variant font-manrope font-bold tracking-widest text-xs uppercase mb-4 px-3 py-1 bg-tertiary-fixed rounded-full"
                style={{ animationDelay: "0ms" }}
              >
                Digital Infrastructure as a Craft
              </span>
              <h1
                className="hero-reveal text-5xl md:text-7xl font-newsreader text-primary leading-tight font-bold mb-6"
                style={{ animationDelay: "100ms" }}
              >
                Empowering Kenyan SMEs with{" "}
                <span className="italic">Future-Ready</span> Technology.
              </h1>
              <p
                className="hero-reveal text-lg md:text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed"
                style={{ animationDelay: "220ms" }}
              >
                We build the digital foundations that allow local resilience
                to scale globally. Premium architecture for businesses that
                demand excellence.
              </p>
              <div
                className="hero-reveal flex flex-wrap gap-4"
                style={{ animationDelay: "340ms" }}
              >
                <Button href="/schedule-consultation" size="lg" icon="arrow_forward">
                  Start Your Evolution
                </Button>
                <Button href="/solutions" variant="secondary" size="lg">
                  View Solutions
                </Button>
              </div>
            </div>
            <div className="relative">
              <HeroVideo
                mp4Src="/videos/hero-showcase.mp4"
                webmSrc="/videos/hero-showcase.webm"
                poster="/videos/hero-poster.jpg"
              />
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-xl whisper-shadow z-20 ghost-border md:block hidden max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="material-symbols-outlined text-on-tertiary-fixed-variant"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  <span className="font-manrope font-bold text-primary">
                    Local Resilience
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-manrope">
                  Engineered for the unique demands of the East African
                  digital landscape.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About / Stats Section */}
        <section className="py-24 bg-surface-container-low px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="md:w-1/3">
                <div className="w-12 h-1 bg-on-tertiary-container mb-6" />
                <h2 className="text-4xl font-newsreader text-primary font-bold leading-tight">
                  Architecture Rooted in Local Ground.
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-manrope text-on-surface-variant mb-8 leading-relaxed italic">
                  At JG Creative Tech, we believe that digital infrastructure
                  is more than just code—it is the skeletal system of modern
                  business. We focus on &quot;Local Resilience,&quot;
                  ensuring every solution we build is robust enough to
                  handle the complexities of the Kenyan market while
                  maintaining a global aesthetic.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-primary font-bold text-2xl font-newsreader mb-2">
                      25+
                    </h3>
                    <p className="text-sm text-on-surface-variant font-manrope">
                      Solutions Delivered across East Africa
                    </p>
                  </div>
                  <div>
                    <h3 className="text-primary font-bold text-2xl font-newsreader mb-2">
                      98%
                    </h3>
                    <p className="text-sm text-on-surface-variant font-manrope">
                      Client Retention &amp; Ecosystem Growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid (Bento Style) */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-on-tertiary-fixed-variant font-manrope font-bold text-xs uppercase tracking-widest">
                Our Capabilities
              </span>
              <h2 className="text-4xl md:text-5xl font-newsreader text-primary font-bold mt-2">
                Comprehensive Digital Infrastructure
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <FeatureCard
                span="md:col-span-4"
                icon="developer_mode"
                title="Web Development"
                description="Scalable, high-performance web applications built with modern frameworks for seamless user journeys."
              />
              <FeatureCard
                span="md:col-span-2"
                variant="dark"
                icon="architecture"
                title="Editorial Design"
                description="Elevating brand identity through sophisticated visual systems."
              />
              <FeatureCard
                span="md:col-span-2"
                variant="muted"
                icon="campaign"
                title="Growth Marketing"
                description="Data-driven strategies to amplify your digital footprint."
              />
              <FeatureCard
                span="md:col-span-4"
                icon="psychology"
                title="Digital Coaching"
                description="Empowering your team to master the infrastructure we build. Knowledge transfer is our core value."
                decoration={
                  <span className="material-symbols-outlined text-[200px]" aria-hidden="true">
                    hub
                  </span>
                }
              />
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="py-24 bg-primary px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-newsreader text-on-primary font-bold">
                  The Archive of Excellence
                </h2>
                <p className="text-on-primary-container mt-4 text-lg">
                  Curated projects that define modern Kenyan business.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="text-on-primary-container font-manrope font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                View All Case Studies
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_outward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {portfolioPreview.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6 ghost-border bg-slate-800">
                    <Image
                      src={project.heroImage}
                      alt={project.heroImageAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-2xl font-newsreader font-bold">
                          {project.name}
                        </h3>
                        <span
                          className="material-symbols-outlined text-on-primary-container text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                          aria-hidden="true"
                        >
                          north_east
                        </span>
                      </div>
                      <p className="text-on-primary-container font-manrope text-sm mt-1">
                        {project.category}
                      </p>
                    </div>
                    <div className="h-10 w-auto opacity-60 grayscale brightness-200">
                      <span className="font-newsreader font-bold text-white tracking-widest text-lg">
                        {project.client.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <h2 className="text-4xl font-newsreader text-primary font-bold mb-6">
                  Voice of the Partners.
                </h2>
                <p className="text-on-surface-variant font-manrope leading-relaxed">
                  Our success is measured by the growth of our clients. We
                  don&apos;t just deliver products; we build long-term
                  digital partnerships.
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t) => (
                  <blockquote
                    key={t.name}
                    className="bg-surface-container-lowest p-8 rounded-xl whisper-shadow border-l-4 border-on-tertiary-container"
                  >
                    <p className="font-newsreader italic text-lg text-primary mb-6">
                      &quot;{t.quote}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
                        <Image
                          src={t.image}
                          alt={`Portrait of ${t.name}`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-manrope font-bold text-primary text-sm not-italic">
                          {t.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant not-italic">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 md:px-8">
          <div className="max-w-5xl mx-auto gradient-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-newsreader text-white font-bold mb-8">
                Ready to transform?
              </h2>
              <p className="text-on-primary-container text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Join the elite network of Kenyan SMEs scaling with premium
                digital infrastructure. Let&apos;s craft your future today.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/schedule-consultation"
                  className="bg-on-tertiary-fixed-variant text-white px-10 py-5 rounded-full font-bold whisper-shadow hover:scale-105 transition-transform active:scale-95"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary-container/20 rounded-full blur-3xl -ml-32 -mb-32"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
