import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Infrastructure Portal",
  description:
    "Your project command center. Track milestones, review deliverables, and message your JG Creative Tech team in one place.",
  alternates: { canonical: "/client-portal" },
  robots: { index: false, follow: false },
};

export default function ClientPortalPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl whisper-shadow flex justify-between items-center px-6 py-4 max-w-full">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Toggle navigation"
            className="material-symbols-outlined text-primary active:scale-95 transition-transform duration-200"
          >
            grid_view
          </button>
          <h1 className="text-xl font-newsreader font-bold text-primary">
            Infrastructure Portal
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors duration-300"
          >
            notifications
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden ring-2 ring-white/20">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIBf1KjMEDrXvrKF9HkokMIz6I26RoF6VTwWy-HEp21ZrIUj9WQlTiwTMpiITqKnJ4Nj1-9anO13JSlgX19iw3R24Tvrq7NNGUtgrqgeQJX_9SXKnfUnpheWnf6UbLUIUqvagUJnO0COeXs6GWoQYNzaCLN0k9zV4bDMch4kiGC5zaXyX0ssiO6MfNU0uvNzV5D01L2OpdOxIFu3zMGMI7hRUzTZd9-IeLt0kHojH8rwvI_yuPagclR5iN8h18anWVXUKMSb-35A"
              alt="Sarah's profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main id="main-content" className="pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section className="mt-8">
          <span className="text-on-tertiary-fixed-variant font-medium text-xs tracking-[0.2em] uppercase mb-2 block">
            Executive Overview
          </span>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="font-newsreader text-5xl md:text-6xl font-semibold text-primary tracking-tight">
                Welcome back, Sarah
              </h2>
              <p className="text-outline mt-3 max-w-xl text-lg leading-relaxed">
                Your infrastructure deployment is proceeding according to
                the Q4 roadmap. Here is the latest update on your digital
                assets.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-full whisper-shadow">
              <span className="bg-secondary/10 text-secondary text-xs font-bold px-4 py-2 rounded-full">
                SECURE PORTAL
              </span>
              <span className="text-outline text-xs pr-4">Last login: 2h ago</span>
            </div>
          </div>
        </section>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Active Project Card (Main) */}
          <div className="md:col-span-8 bg-primary text-on-primary rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLLrd33Fq7TnaAdEmjuLN-Qts4Y7Q2J6LP6a84rW7sOVRVvch51AcOX-g24jzQymvtGhM2IOPHc_TLXGqtr-A615A__gBopkZ1aVzT3at1mwY1ZPy7Ig5EN1_RR3uturOzpaATrh0yXA2Wcn8ZNQRYtb-EMlqcwEXNvp3VOAoMcB-rEoZnk5j_UDi5jsqRvaBpRAtu5mJgOIY2dtSPeHaPb4qFWucKn5rvIAl6XFU0LlnuVMqVal-H5Lixc2BSRK_j_vXCQhcLcg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-on-primary-container" aria-hidden="true">
                  account_tree
                </span>
                <span className="text-on-primary-container font-medium tracking-widest text-xs uppercase">
                  Active Project
                </span>
              </div>
              <h3 className="font-newsreader text-4xl font-semibold mb-2">
                E-commerce Infrastructure
              </h3>
              <p className="text-on-primary-container max-w-sm">
                Scaling global payment gateways and high-availability
                server clusters.
              </p>
            </div>
            <div className="z-10 w-full mt-12">
              <div className="flex justify-between items-end mb-4">
                <div className="space-y-1">
                  <span className="text-4xl font-bold tracking-tighter">80%</span>
                  <p className="text-xs uppercase tracking-widest opacity-60">Completion Rate</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-widest opacity-60 block mb-1">Status</span>
                  <span className="bg-on-primary-container/20 text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
                    ON TRACK
                  </span>
                </div>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-on-primary-container w-[80%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Upcoming Milestone */}
          <div className="md:col-span-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-[2rem] p-8 flex flex-col justify-between ghost-border">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-tertiary" aria-hidden="true">
                  event_upcoming
                </span>
              </div>
              <span className="text-on-tertiary-fixed-variant font-bold text-xs tracking-widest uppercase">
                Upcoming Milestone
              </span>
              <h3 className="font-newsreader text-3xl font-semibold mt-4 leading-tight">
                Launch Rehearsal
              </h3>
            </div>
            <div className="mt-8 border-t border-tertiary-fixed-dim pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold tracking-tighter">Nov 20</p>
                  <p className="text-xs uppercase tracking-widest opacity-70">2026 | 09:00 AM</p>
                </div>
                <button
                  type="button"
                  aria-label="View milestone details"
                  className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <a
              href="/contact"
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    upload_file
                  </span>
                </div>
                <span className="font-bold text-primary">Upload Documents</span>
              </div>
              <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                arrow_forward
              </span>
            </a>
            <a
              href="/contact"
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    forum
                  </span>
                </div>
                <span className="font-bold text-primary">Message Team</span>
              </div>
              <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                arrow_forward
              </span>
            </a>
            <a
              href="/contact"
              className="group flex items-center justify-between bg-surface-container-lowest p-6 rounded-[1.5rem] hover:bg-surface-container transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    receipt_long
                  </span>
                </div>
                <span className="font-bold text-primary">View Invoices</span>
              </div>
              <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                arrow_forward
              </span>
            </a>
          </div>

          {/* Recent Documents */}
          <div className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-newsreader text-2xl font-semibold">Recent Documents</h3>
              <button
                type="button"
                className="text-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Archive
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  arrow_right_alt
                </span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-white hover:shadow-lg transition-all ghost-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-error-container text-error rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      picture_as_pdf
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Strategic Roadmap.pdf</h4>
                    <p className="text-xs text-outline">Modified yesterday by Alex M.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-outline uppercase px-3 py-1 bg-surface-container rounded-full">
                    Shared
                  </span>
                  <button
                    type="button"
                    aria-label="Download Strategic Roadmap.pdf"
                    className="material-symbols-outlined text-outline hover:text-primary"
                  >
                    download
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-white hover:shadow-lg transition-all ghost-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      description
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Security Audit.docx</h4>
                    <p className="text-xs text-outline">Validated 3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-outline uppercase px-3 py-1 bg-surface-container rounded-full">
                    Internal
                  </span>
                  <button
                    type="button"
                    aria-label="Download Security Audit.docx"
                    className="material-symbols-outlined text-outline hover:text-primary"
                  >
                    download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Accent Section */}
        <section className="py-12 border-l-4 border-on-tertiary-container pl-8">
          <h4 className="font-newsreader text-3xl font-semibold text-primary">
            System Integrity Report
          </h4>
          <p className="text-outline mt-2 max-w-2xl">
            Global CDN performance is at 99.9% uptime. Database clusters in
            Nairobi and London are synchronized. All security patches have
            been deployed as of Nov 12.
          </p>
          <a
            href="/digital-architecture"
            className="mt-6 inline-block px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
          >
            Full Technical Audit
          </a>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav
        aria-label="Mobile"
        className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-6 bg-white/90 backdrop-blur-2xl rounded-t-[24px] shadow-[0_-8px_40px_-12px_rgba(25,28,30,0.06)] z-50 md:hidden"
      >
        <a
          className="flex flex-col items-center gap-1 bg-gradient-to-br from-primary to-primary-container text-white rounded-full px-5 py-2.5 shadow-lg scale-105 transition-transform duration-300"
          href="/client-portal"
          aria-current="page"
        >
          <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Overview</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2.5 hover:text-secondary active:scale-90 transition-all duration-300" href="/portfolio">
          <span className="material-symbols-outlined" aria-hidden="true">account_tree</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Projects</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2.5 hover:text-secondary active:scale-90 transition-all duration-300" href="/contact">
          <span className="material-symbols-outlined" aria-hidden="true">folder_open</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Documents</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2.5 hover:text-secondary active:scale-90 transition-all duration-300" href="/contact">
          <span className="material-symbols-outlined" aria-hidden="true">chat_bubble</span>
          <span className="font-manrope text-[11px] font-medium uppercase tracking-widest">Support</span>
        </a>
      </nav>

      {/* Desktop Sidebar/Nav (Hidden on mobile) */}
      <nav
        aria-label="Sidebar"
        className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-surface-container-low z-[60]"
      >
        <div className="mb-12">
          <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">token</span>
        </div>
        <div className="flex flex-col gap-8">
          <a href="/client-portal" aria-current="page" aria-label="Overview" className="material-symbols-outlined text-primary bg-white p-3 rounded-2xl shadow-md">
            dashboard
          </a>
          <a href="/portfolio" aria-label="Projects" className="material-symbols-outlined text-outline hover:text-primary transition-colors">
            account_tree
          </a>
          <a href="/contact" aria-label="Documents" className="material-symbols-outlined text-outline hover:text-primary transition-colors">
            folder_open
          </a>
          <a href="/contact" aria-label="Support" className="material-symbols-outlined text-outline hover:text-primary transition-colors">
            chat_bubble
          </a>
        </div>
        <div className="mt-auto">
          <a href="/client-portal#settings" aria-label="Settings" className="material-symbols-outlined text-outline hover:text-primary transition-colors">
            settings
          </a>
        </div>
      </nav>
    </div>
  );
}
