# JG Creative Tech Solution — Production Website

A production-ready, responsive marketing + light-portal website for JG
Creative Tech Solution, built from the Stitch "Editorial Infrastructure /
Savannah Nexus" design export. Next.js 14 App Router, TypeScript,
TailwindCSS, and a Firebase-backed contact/newsletter/booking API.

---

## 1. Quick Start

```bash
cp .env.example .env          # fill in Firebase credentials (optional — forms work without them)
npm install
npm run dev                   # http://localhost:3000
npm run build                 # production build
npm run test                  # Jest (84 tests, 15 suites)
npm run lint                  # ESLint
```

---

## 2. Route Map

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Source: `home_jg_creative_tech_solution_2` |
| `/about` | About Us | Reconstructed from Stitch screenshot (no `code.html` in export) |
| `/solutions` | Solutions | Service bento cards link to deep-dive pages |
| `/portfolio` | Portfolio | Filterable client-side grid |
| `/portfolio/[slug]` | Case Study | Static: sammy-dylax-logistics, gm-global-ventures, apex-realty |
| `/contact` | Contact | Live form → `/api/contact` → Firestore |
| `/digital-architecture` | Digital Architecture | Sidebar layout, brand label "Architectural Framework" |
| `/digital-strategy` | Digital Strategy | |
| `/innovation-lab` | Innovation | Source: `innovation_lab_jg_creative_tech` — real experiment names (AI-Driven Logistics, Blockchain Supply Chains, Edge-Computing IoT) |
| `/client-portal` | Infrastructure Portal | Source: `client_portal_jg_creative_tech` — "Welcome back, Sarah", E-commerce Infrastructure project, `noindex` |
| `/get-started/discovery` | Project Discovery (step 1 of 2) | Source: `project_discovery_step_1`. Saves goal/businessStage/moreInfo to sessionStorage, `noindex` |
| `/schedule-consultation` | Select a Consultation Time (step 2 of 2) | Source: `schedule_consultation_step_2`. Real monthly calendar + time slots, reads Discovery's sessionStorage, `noindex` |
| `/strategic-context` | Strategic Context | Source: `strategic_context_step_2`. **Standalone** entry point (own "Discovery Session" header), not part of the Discovery→Schedule flow. KPI selector + technical priorities, submits to `/api/contact`, `noindex` |
| `/legal/privacy` | Privacy Infrastructure | Source: `privacy_policy_jg_creative_tech_2` — own nav drawer, bento data-collection grid, working DPO contact form |
| `/legal/terms` | Legal Infrastructure | Source: `terms_of_service_jg_creative_tech` — own sidebar ("Legal Directory"), numbered article sections |
| `/legal/cookies` | Cookie Policy | Source: `cookie_policy_jg_creative_tech` — real toggle switches (Analytics/Marketing), "Clear Local Storage" action |
| `/_not-found` | Custom 404 | On-brand, links back to home and contact |

**Screens intentionally not built as separate routes:**
- `home_jg_creative_tech_solution_1` — superseded by `_2` per design review.
- `untitled_prototype` — byte-for-byte identical to `home_2`.
- `privacy_policy_jg_creative_tech_1` — superseded by `_2`.
- `digital_strategy_jg_creative_tech_1` — superseded by `_2`.

### A note on fidelity

An earlier draft of `/get-started/discovery`, `/schedule-consultation` (then a 3rd "step" of a fictional combined funnel), `/client-portal`, `/innovation-lab`, and all three legal pages diverged from the actual Stitch source — generic placeholder copy and layouts were substituted instead of the real markup. This was caught and corrected: all 6 pages now match their original Stitch screens exactly (content, structure, and the "no-line" / ghost-border / bento-grid conventions from `savannah_nexus/DESIGN.md`), with interactivity added only where the source was a static mockup (toggle switches, KPI selector, calendar, forms) that needed real state to function as a live site.

The Discovery→Schedule flow is genuinely 2 steps per the source (`Step 1 of 2` / `Step 2 of 2`), not 3. Strategic Context is its own standalone screen with a distinct "Discovery Session" header and is not wired into that funnel — it's reachable from Digital Architecture's hero CTAs instead, matching how the source treats it as an independent entry point.

| Route | Purpose |
|---|---|
| `POST /api/contact` | Contact form → `contact_submissions` Firestore collection |
| `POST /api/newsletter` | Newsletter signup → `newsletter_subscribers` Firestore collection |
| `POST /api/schedule-consultation` | Consultation booking (includes full funnel context) → `consultation_bookings` Firestore collection |

---

## 3. Architecture

```
app/                       Next.js App Router pages and API routes
components/
  layout/
    SiteHeader.tsx         Top nav with real active-page aria-current
    SiteFooter.tsx         Real LinkedIn/GitHub social links (siteConfig-driven)
    MobileBottomNav.tsx    Fixed bottom nav for mobile
    Sidebar.tsx            Icon rail sidebar (Digital Architecture, Client Portal, Legal)
    LegalPageLayout.tsx    Shared shell for the 3 legal pages
  ui/
    Button.tsx             primary / secondary / tertiary CTA button
    FeatureCard.tsx        Bento-grid service/feature card
  ContactForm.tsx          Client component → /api/contact
  BookingForm.tsx          Client component → /api/schedule-consultation (includes funnel data)
  DiscoveryForm.tsx        Step 1 funnel form with sessionStorage persistence
  ContextForm.tsx          Step 2 funnel form with sessionStorage persistence
  PortfolioFilterGrid.tsx  Client-side filterable portfolio grid (real filter tabs)
  PortalProjectList.tsx    Client-side searchable project list in Client Portal
  JsonLd.tsx               Organization JSON-LD structured data

lib/
  site-config.ts           Nav links, contact info, real social URLs (single source of truth)
  portfolio.ts             Shared portfolio project data (listing + case study pages)
  firebase-admin.ts        Server-only Admin SDK init (graceful no-op without env vars)
  validate-contact.ts      Contact form validation
  validate-booking.ts      Booking form validation (includes optional funnel fields)
  rate-limit.ts            In-memory per-IP rate limiter
  use-funnel-storage.ts    sessionStorage hook for multi-step funnel persistence

__tests__/                 15 test suites, 84 tests
public/
  og-image.png             Real 1200×630 social share image (JG brand, navy/cream)
app/
  favicon.ico              Real JG monogram favicon (navy background, cream JG)
  icon.png                 512×512 app icon (Next.js file convention)
  apple-icon.png           180×180 Apple touch icon
  sitemap.ts               Dynamic sitemap.xml (includes portfolio slugs)
  robots.ts                robots.txt (excludes portal/funnel from indexing)
```

---

## 4. What Changed in the World-Class Audit Pass

### Round 2 — Structural gaps (mobile nav, security, PWA, errors)

| Gap | Fix |
|---|---|
| No mobile navigation on pages outside the bottom nav's 4 links (About, Digital Architecture, Digital Strategy, Innovation Lab, Client Portal, Legal pages were unreachable on mobile once you left Home/Solutions/Portfolio/Contact) | `SiteHeader` now has a full hamburger drawer with all pages, closes on route change, traps scroll, `aria-modal` |
| Fixed `MobileBottomNav` (≈80px) overlapped the last section of content on every page that used it | Added `pb-28 md:pb-*` safe-area padding to all 8 affected pages |
| No cookie consent UI despite a Cookie Policy explaining cookies are used | `CookieBanner` — Accept/Decline, persisted in localStorage, links to policy |
| `/api/newsletter` existed with zero UI to use it | `NewsletterSignup` in the footer, wired to the real endpoint |
| Runtime errors showed Next.js's bare default error screen | `app/error.tsx` — branded fallback with retry + home link |
| No PWA manifest (no "Add to Home Screen" support) | `app/manifest.ts` → `/manifest.webmanifest` |
| Only 2 of ~7 hero images had `priority`, hurting LCP | Added `priority` to all above-fold hero images (About, Solutions, Digital Strategy, Innovation Lab, Digital Architecture) |
| No security headers (clickjacking, MIME-sniffing, no CSP) | `next.config.mjs` now sets X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, and a CSP scoped to this site's actual dependencies (Google Fonts, lh3.googleusercontent.com) |
| No skip-to-content link | Visually-hidden skip link in `app/layout.tsx`, focuses on Tab, jumps to `id="main-content"` on every page |
| Case study pages had no structured data | Added `BreadcrumbList` + `Article` JSON-LD per case study |

### Round 1 — Broken/inert elements

| Issue | Fix |
|---|---|
| Portfolio project cards showed external-link icon but weren't linked | Built real `/portfolio/[slug]` case study pages for all 3 projects |
| Portfolio filter tabs (All / SaaS / Branding / Web) were inert buttons | `PortfolioFilterGrid` client component with real filter logic |
| Schedule Consultation day/time picker did nothing when clicked | `BookingForm` client component with real selection state and API submission |
| Multi-step funnel discarded all entered data when "Continue" was clicked | `useFunnelStorage` hook persists answers in sessionStorage across all 3 steps |
| Client Portal search input had no handler | `PortalProjectList` filters by name/phase in real time |
| Footer LinkedIn was `https://linkedin.com` (no profile) | Real URL: `linkedin.com/in/james-maruti-a6738231a` |
| Footer had placeholder phone number | Removed; added real GitHub link instead |
| `/public/og-image.png` referenced but didn't exist | Generated real 1200×630 branded OG image |
| `app/favicon.ico` was the default Next.js placeholder | Generated real JG monogram favicon |
| No custom 404 page | `app/not-found.tsx` |
| Two `<header>` landmarks per page | Hero sections changed to `<section>` |
| "Strategic Dashboards" div implied clickability with no link | Converted to real `<a href="/client-portal">` |
| Solutions page service cards had no links to deep-dive pages | Added "Learn more" links to all 4 deep-dive pages |



---

## 5. Fonts — Deployment Note

`next/font/google` fails the build in this sandbox (no network access to `fonts.googleapis.com`). The project uses a `<link>` tag in `app/layout.tsx` instead.

**On Vercel, switch to `next/font` for better performance:**

```tsx
import { Newsreader, Manrope } from "next/font/google";
const newsreader = Newsreader({
  subsets: ["latin"], style: ["normal", "italic"],
  weight: ["200","300","400","500","600","700","800"],
  variable: "--font-newsreader",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800"],
  variable: "--font-manrope",
});
```

Apply `${newsreader.variable} ${manrope.variable}` to `<html>` className, remove the `<link>` tags.

---

## 6. Backend / Firebase

All three API routes follow the same pattern:
1. Per-IP rate limit (5 req/min, in-memory)
2. Server-side validation
3. Write to Firestore **if** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set (see `.env.example`)
4. **Fall back to `console.info`** if Firebase isn't configured — forms stay testable in local dev without real credentials

Firestore collections: `contact_submissions`, `newsletter_subscribers`, `consultation_bookings`

---

## 7. Testing

**111 tests across 18 suites.** Run with `npm test`.

| Suite | What it covers |
|---|---|
| `validate-contact.test.ts` | Field validation, edge cases, malformed input |
| `validate-booking.test.ts` | Date/time validation, optional Discovery context fields, malformed input |
| `rate-limit.test.ts` | Window/key isolation, limit enforcement |
| `use-funnel-storage.test.ts` | sessionStorage read/write/clear, isLoaded timing, cross-step merging |
| `DiscoveryForm.test.tsx` | Goal radio cards (defaults to "growth"), stage select, sessionStorage save, pre-fill on back, "Save and Exit" link |
| `BookingForm.test.tsx` | Calendar day selection, time slot state, API submission with date, Discovery context pass-through, storage clear on success |
| `StrategicContextForm.test.tsx` | KPI button defaults (Operational Efficiency), priority checkboxes, structured detail formatting, success/error states |
| `ContactForm.test.tsx` | Submit flow, success/error/network states |
| `PrivacyContactForm.test.tsx` | DPO-tagged submission to /api/contact, success/error states |
| `NewsletterSignup.test.tsx` | Submit flow, success/error states |
| `CookieBanner.test.tsx` | Show/hide logic, Accept/Decline persistence, policy link |
| `CookiePreferences.test.tsx` | Analytics/Marketing toggle defaults, toggle behavior, localStorage persistence, saved confirmation |
| `PortfolioFilterGrid.test.tsx` | Filter tab state, case study links, empty state |
| `SiteHeader.test.tsx` | Desktop nav with aria-current, mobile drawer open/close, full page list in drawer |
| `SiteFooter.test.tsx` | All link destinations, real LinkedIn/GitHub, no placeholder phone |
| `Sidebar.test.tsx` | All items, active aria-current, landmark |
| `Button.test.tsx` | Link/button rendering, onClick, disabled, icon, variants |
| `FeatureCard.test.tsx` | Title, description, heading role, decoration, variant styling |

---

## 8. Accessibility

- One `<header>` landmark per page (hero sections use `<section>`, not `<header>`)
- `aria-current="page"` on active nav links in header, sidebar, and bottom nav
- All decorative icons use `aria-hidden="true"`
- Form inputs have `<label htmlFor>`, `aria-invalid`, `aria-describedby` for errors
- Progress bars use `role="progressbar"` with `aria-valuenow/min/max`
- Filter tabs use `role="tablist"` / `role="tab"` / `aria-selected`
- Live regions (`aria-live="polite"`) on filterable grid and search results
- Respects `prefers-reduced-motion`

---

## 9. SEO

- Per-page `metadata` with title, description, canonical URL
- Root Open Graph + Twitter card pointing to real `/public/og-image.png`
- Organization JSON-LD structured data site-wide
- Dynamic `sitemap.xml` including all portfolio case study URLs
- `robots.txt` disallows the client portal and consultation funnel
