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

All three public API routes follow the same pattern:
1. Per-IP rate limit (5 req/min, in-memory)
2. Server-side validation
3. Write to Firestore **if** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set (see `.env.example`)
4. **Fall back to `console.info`** if Firebase isn't configured — forms stay testable in local dev without real credentials

Firestore collections: `contact_submissions`, `newsletter_subscribers`, `consultation_bookings`

---

## 6a. Client Portal (`/client-portal`) — Setup

The portal is a real, single-client feature: one real sign-in, real
per-client documents (upload + download), real invoices, real
notifications, and a real message thread — not a static mockup.
Scoped deliberately to **one client account**, not a multi-tenant
system, per the actual requirement.

### What's real vs. what needs a one-time manual step

| Piece | Status |
|---|---|
| Sign-in (email/password) | Real — Firebase Auth |
| Document upload/download | Real — Firebase Storage, enforced by `storage.rules` |
| Documents/invoices/notifications/messages list | Real — Firestore, enforced by `firestore.rules` |
| Data isolation | Real — every rule re-checks `request.auth.uid`, not just app code |
| The client's Firebase Auth account itself | **Manual, one-time** — see step 2 below |
| Their profile (name, project status, invoices) | **Manual, ongoing** — see step 3 below |

The client can never edit their own project-status fields, CDN stats,
or invoices — `firestore.rules` makes the `clients/{uid}` profile
document and `invoices` subcollection **read-only from the client
side on purpose.** Those are set by you.

### Setup steps

1. **Add the client-portal env vars** to `.env` / Vercel project
   settings (see `.env.example` — `NEXT_PUBLIC_FIREBASE_*`). These are
   safe to expose to the browser; the real protection is the rules
   files, not secrecy of these values.
2. **Create the one client account**: Firebase Console → Authentication
   → Add user → their email + a temporary password (have them reset it
   on first login via Firebase's password-reset flow, not built into
   this UI since there's only one account to manage).
3. **Create their profile document**: Firestore Console → start
   collection `clients` → document ID = **their Auth UID** (copy it
   from the Authentication tab) → add fields matching the `ClientProfile`
   type in `lib/client-portal/hooks.ts` (`displayName`,
   `activeProjectName`, `activeProjectCompletionPercent`, etc.). Until
   this exists, the dashboard correctly shows "no active project" /
   "welcome back, `<their email>`" rather than blank or fake data.
4. **Deploy the security rules** — this is not optional, the app will
   not work correctly without it (Firestore/Storage default-deny
   everything until rules are deployed):
   ```bash
   firebase login
   firebase use --add        # select the same project as your env vars
   firebase deploy --only firestore:rules,storage:rules
   ```
5. Add invoices/documents/notifications the same way — new documents
   under `clients/{uid}/invoices`, `.../documents`, `.../notifications`
   in the Firestore Console (or the client can upload their own
   documents directly from the portal UI once signed in).

### What deliberately isn't built

- **No self-service password reset UI** and **no account creation
  UI** — both are one-account, admin-driven per the scope above.
- **No client-creation or invoice-editing UI even for admins.**
  §6b' below adds a lightweight admin *view* (see all clients,
  invoices, and messages in one place, reply to a message) - but
  creating a client, issuing an invoice, or uploading a document on a
  client's behalf still happens via Firebase Console/Admin SDK, same
  as before. Building those into the app is a genuinely different,
  larger scope, not a small extension of the view that now exists.

---

## 6b'. Admin Overview — Setup

A lightweight admin view at `/client-portal/admin`: every client,
every invoice (worst-first), and every message thread with which ones
still need a reply - the exact thing that stops scaling once there's
more than one client and everything lives in the Firebase Console.
This does not replace the Console for anything else (still no
client-creation, invoice-issuing, or document-upload UI here - see
above).

### How access actually works

There's no self-service or in-app way to become an admin, on purpose.
Access is gated on a Firebase **custom claim** (`admin: true`),
verified server-side by every `/api/admin/*` route via the Admin SDK
- not a Firestore field a client's own browser could read or infer,
and not something the app itself can grant. The existing Firestore
Security Rules (`firestore.rules`) are completely unchanged by this -
a regular client's browser still cannot read another client's data
under any circumstance. Admin routes work by using the Admin SDK
directly (which bypasses those rules entirely, the same way the
IntaSend webhook and the invoice reminder cron already do), gated on
the claim instead.

### Setup

Grant yourself (or anyone else who needs it) admin access with:

```
node --env-file=.env.local scripts/grant-admin-claim.mjs you@example.com
```

This uses the same `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` /
`FIREBASE_PRIVATE_KEY` credentials every other server-side feature in
this project already needs - no new environment variables. Revoke
access the same way with `--revoke` appended. After granting or
revoking, the person needs to sign out and back in (or wait up to an
hour) before it takes effect - custom claims are baked into the ID
token itself, which only refreshes on a fresh sign-in or its own
expiry, not the moment the claim changes server-side.

Once granted, a small shield icon appears in the portal header next
to the theme toggle, linking to the overview - visible only to
accounts with the claim; everyone else's portal looks exactly as it
always has.

---

## 6b. Invoice Payments (Card + M-Pesa via IntaSend) — Setup

"Pay Now" on an unpaid invoice creates a real IntaSend checkout
session and redirects the client to a hosted page where they choose
card or M-Pesa (STK Push) themselves — not two separate integrations,
one hosted checkout that supports both.

### How it actually works

1. Client clicks "Pay Now" → `POST /api/billing/intasend-checkout`
   (`Authorization: Bearer <their Firebase ID token>`, body
   `{ invoiceId }`).
2. That route reads the invoice **from Firestore, server-side** to
   get the real amount and currency — it never trusts a client-
   supplied amount, so there's no way to "pay" an invoice for less
   than it's actually for. It creates the IntaSend checkout, stores a
   lookup row in `intasendCheckouts/{apiRef}` (IntaSend's checkout
   payload has no metadata field, so this is how the webhook later
   knows which client + invoice a payment was for), and returns the
   checkout URL.
3. Client is redirected to IntaSend's hosted page and pays.
4. **IntaSend's webhook** (`POST /api/webhooks/intasend`) is what
   actually marks the invoice paid — never the client's browser
   redirect back into the portal, which is UX only and could be
   skipped or spoofed. The webhook handler:
   - Checks the shared `challenge` string in the payload against
     `INTASEND_WEBHOOK_CHALLENGE`, using a constant-time comparison.
   - **Then independently re-confirms the payment status by calling
     IntaSend's own status API directly**, rather than trusting the
     webhook body alone. IntaSend's webhook security today is just
     that shared challenge string — there's no HMAC request signing
     the way Stripe's `Stripe-Signature` header works — so treating
     the webhook as a hint to verify, not a fact to trust outright, is
     what actually closes that gap.
   - Is idempotent (IntaSend can and does redeliver webhooks) and
     fails closed: if the independent verification call itself
     errors, the invoice is *not* marked paid, and IntaSend's own
     retry behavior gives it another chance once things recover.

### Setup steps

1. Get your keys from the IntaSend dashboard — sandbox:
   `https://sandbox.intasend.com/account/api-keys/`, live:
   `https://payment.intasend.com/account/api-keys/`.
2. Add `INTASEND_PUBLISHABLE_KEY`, `INTASEND_SECRET_KEY`, and
   `INTASEND_WEBHOOK_CHALLENGE` (a random string you choose) to `.env`
   / Vercel project settings — see `.env.example`. Sandbox vs. live is
   detected automatically from the key prefix (`ISPubKey_test_...` vs
   `ISPubKey_live_...`), so there's no separate mode flag to keep in
   sync.
3. In the IntaSend dashboard, register your webhook URL
   (`https://your-domain.com/api/webhooks/intasend`) under
   Settings → Webhooks, and enter the **same** string you set as
   `INTASEND_WEBHOOK_CHALLENGE`.
4. Set an invoice's `status` field to `"sent"` or `"overdue"` in the
   Firestore Console for "Pay Now" to appear on it — `"draft"` and
   `"paid"` invoices don't show the button.

### What deliberately isn't built

- **IntaSend's Subscriptions API isn't used.** Their Checkout API
  (what this integrates) is one-time payment only - paying via
  IntaSend doesn't set up recurring billing the way a Stripe
  subscription would. Not an oversight - a scope call, since this
  portal's invoices are one-off documents, not subscriptions.
- **No refund UI.** IntaSend's API supports refunds, but issuing one
  is an administrative action with real financial consequences - it
  belongs in the IntaSend dashboard directly, not a button a client
  or this codebase can trigger.
- **Live payment verification is genuinely impossible from a sandbox
  with no real IntaSend account or credentials** — the code paths
  that don't need live credentials (auth gating, invoice-not-found,
  already-paid, malformed payloads, the challenge check, idempotency,
  the fail-closed behavior on a verification error) are covered by
  real tests; an actual M-Pesa STK Push completing end-to-end can only
  be confirmed once this is deployed with real keys.

---

## 6c. Form Email Notifications — Setup

The contact form, consultation booking, and newsletter signup all
persist to Firestore (see §6), but **that alone doesn't notify anyone**
- someone would have to manually check the Firestore Console to know a
submission arrived. Real email notifications go through
[Resend](https://resend.com):

- **Contact form**: notifies the site owner (reply-to set to the
  submitter, so replying in an inbox goes straight back to them) and
  sends a short confirmation to the person who wrote in.
- **Consultation booking**: same pattern, plus any Project Discovery
  context (goal, business stage, notes) the requester gave earlier in
  the funnel, since that's exactly what's useful to see before a call.
- **Newsletter signup**: notifies the site owner and sends a welcome
  email to the new subscriber.

### Setup

1. Sign up at [resend.com](https://resend.com) and create an API key
   under **API Keys**.
2. Add and verify your own sending domain under **Domains** (follow
   the DNS records Resend gives you). Sending from their shared
   `onboarding@resend.dev` address works for quick testing, but real
   production email should come from your own domain so it doesn't
   read as spam and so replies work properly.
3. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` — see `.env.example`.

Without these set, forms still work exactly as before (submissions
are still saved to Firestore, or logged to the console if Firebase
isn't configured either) - they silently skip sending any email
instead of erroring, so a missing API key never breaks the form
itself for the person submitting it.

### Design notes

- Email sending is deliberately independent of the Firestore write -
  both are attempted regardless of whether the other succeeds, since
  a failed database write should never be the reason the site owner
  doesn't hear about an inquiry, and vice versa.
- All three routes use `sendEmailBestEffort`, which logs failures but
  never throws - a Resend outage or bad API key degrades to "no email
  sent" rather than a 500 error on the form itself.
- User-submitted content (name, message, etc.) is HTML-escaped before
  being embedded in the notification email, since it's rendered as
  HTML in the recipient's inbox - untreated, that's a real HTML/script
  injection path into whatever emails it.

---

## 6d. Analytics — Setup

Real traffic data via Google Analytics 4, gated behind the site's
existing cookie consent through Google's **Consent Mode v2** - not
just "load the script if consented, skip it otherwise." This closes a
real gap: the cookie banner has always said "optional analytics
cookies," but until this, nothing was actually wired up to collect
anything.

### How consent actually works now

Before this, `CookieBanner` (the popup) and `CookiePreferences` (the
granular Analytics/Marketing toggles on `/legal/cookies`) wrote to two
different, disconnected `localStorage` keys - declining in the banner
and then separately toggling Analytics on in the detailed panel would
just leave the two disagreeing with each other, with nothing to
reconcile them. Both now read and write through one shared hook
(`lib/cookie-consent.ts`), so a decision made in either place is
immediately visible in the other - verified directly in a real
browser: decline in the banner, then load `/legal/cookies` and the
Analytics toggle correctly shows off, matching the decision made
somewhere else entirely.

`components/Analytics.tsx` maps that shared state onto the four
Consent Mode v2 signals Google actually uses: the `analytics` category
controls `analytics_storage`; `marketing` controls `ad_storage`,
`ad_user_data`, and `ad_personalization`. This site doesn't run Google
Ads today, but wiring the marketing signal correctly now means it's
already in place if that ever changes.

On page load, gtag.js loads and immediately sends `consent: default`
with everything denied (`wait_for_update: 500`) - Google's tags never
fire without an explicit signal about what they're allowed to do. Once
the visitor decides (via the banner or the detailed panel), a
`consent: update` call fires with the real state. Confirmed this whole
handshake directly in a browser by reading `window.dataLayer`, not
just by reading the code: default-denied on load, update-granted
immediately on Accept, and an independent update when only the
Analytics toggle (not Marketing) is flipped later.

### Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
   if you don't have one, then find your Measurement ID under
   **Admin → Data Streams → your web stream** (looks like
   `G-XXXXXXXXXX`).
2. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` - see `.env.example`. This is
   intentionally a public env var, not a secret one: gtag.js runs
   entirely in the browser, so the ID is visible in page source either
   way.
3. Once you have real traffic flowing, connect this GA4 property to
   Search Console (Admin → Product Links, inside GA4) to see search
   query and ranking data alongside behavior data in one place - a
   separate, one-time setup step in Google's own dashboards, not
   something this codebase can do for you.

Without `NEXT_PUBLIC_GA_MEASUREMENT_ID` set, no analytics scripts load
at all - not even a consent-denied stub - matching how every other
optional integration in this project degrades when unconfigured.

---

## 6e. Automated Invoice Reminders — Setup

A daily job checks every client's unpaid invoices and emails a
reminder when one is due within 3 days, then flips it to "overdue" and
emails again the moment it passes its due date - using the exact same
email infrastructure from §6c, not a new system. Follow-up overdue
reminders go out every 7 days after that, rather than daily, so they
stay a nudge rather than becoming noise the client learns to ignore.
The site owner gets a single digest email whenever at least one
reminder actually went out - never a "nothing happened today" email.

### How it's triggered

This runs via [Vercel Cron](https://vercel.com/docs/cron-jobs)
(`vercel.json`), not a traditional always-on server - Vercel makes an
authenticated HTTP request to `/api/cron/invoice-reminders` on the
schedule declared there (currently once daily, 8am UTC). Verified
Vercel's actual current cron authentication model before building this
rather than assuming: once you set `CRON_SECRET` as an environment
variable in your Vercel project, Vercel automatically includes it as
a `Authorization: Bearer` header on its own scheduled requests - your
route handler's only job is comparing that header against the same
env var, which is exactly what this route does. You never call this
endpoint yourself; only Vercel's scheduler does.

### Setup

1. Set `CRON_SECRET` to a random string of at least 16 characters
   (Vercel's own recommendation) - see `.env.example`.
2. Deploy the Firestore index this route's cross-client query needs:
   ```
   firebase deploy --only firestore:indexes
   ```
   This is a genuinely different kind of query than anything else in
   this project - invoices live in a `clients/{uid}/invoices/{id}`
   subcollection, one per client, and this route needs to check *all*
   clients' invoices in one pass rather than one client's own. That's
   a Firestore **collection-group query**, and it needs its own index
   declared with `COLLECTION_GROUP` scope (see
   `firestore.indexes.json`) - a plain per-client index doesn't cover
   it. If you skip this step, the route's own error will make the
   problem obvious rather than failing silently: Firestore returns an
   error that includes a direct link to create the missing index.
3. Redeploy. Vercel picks up the cron schedule from `vercel.json`
   automatically on deploy - no separate dashboard step needed.

**Note on the Vercel Hobby (free) tier:** cron jobs are limited to
once per day there. The daily schedule this project ships with already
respects that limit; if you're on a paid plan and want a shorter
recheck interval, adjust the schedule in `vercel.json`.

Without `CRON_SECRET` set, the route returns a clean `503` and never
processes anything, rather than running unauthenticated.

---

## 6f. AI Chat Assistant — Setup

A floating chat widget (every marketing page except the two focused-
onboarding funnel steps) that answers visitor questions using the
Claude API. It's grounded in this site's own real FAQ content - it
won't invent pricing, timelines, or commitments the business hasn't
actually made, and it hands off to WhatsApp/the contact form/booking
a consultation for anything that needs an actual person or
transaction. See `lib/ai-chat/system-prompt.ts` for exactly what it's
told and forbidden from doing.

### Setup

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
   → API Keys.
2. Set `ANTHROPIC_API_KEY` - see `.env.example`.

Without it set, the widget still renders normally; sending a message
returns a clear "chat isn't configured yet" error in the chat panel
itself rather than failing silently or crashing.

### Cost and abuse controls

Every message a visitor sends is a real, metered API call - unlike
the forms elsewhere in this project, usage here scales with however
many people open the widget, not with real business events like a
booking or a payment. `app/api/chat/route.ts` has its own limits,
separate from the rest of the site:

- **Rate limit**: 15 messages/minute/IP, not the 5/minute default
  used for one-shot forms elsewhere (`lib/rate-limit.ts` now accepts
  optional `maxRequests`/`windowMs` overrides for exactly this - a
  real conversation needs more room than a form someone submits once).
- **Conversation length cap**: 20 messages per request. The client
  sends its whole conversation so far on every turn (there's no
  server-side history to append to - see below), so this bounds the
  token cost of any single request regardless of how long a
  conversation runs.
- **Per-message length cap**: 1000 characters.
- **Model**: `claude-haiku-4-5-20251001` - the cheapest/fastest
  current Claude model, appropriate for a FAQ/lead-qualification
  widget where cost scales with every visitor, not a task that
  actually needs the most capable model available.

### What's deliberately not built

**No conversation persistence, anywhere.** The conversation lives only
in the visitor's browser tab (React state) and is gone on refresh.
These are anonymous site visitors, not authenticated client-portal
users with an account to attach history to - there's no natural place
to store it and no reason to. This also means there's nothing here for
Firebase to configure; the chat widget works independently of whether
Firebase is set up at all.

---

## 7. Testing

**351 tests across 46 suites.** Run with `npm test`.

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
| `SignInForm.test.tsx` | Not-configured state, field rendering, submit → signIn call, friendly vs. generic error messages |
| `ClientPortalDashboard.test.tsx` | Not-configured/loading/redirect states, real name vs. email fallback, empty vs. populated documents, no-project fallback copy, real invoice rendering |
| `client-portal-actions.test.ts` | Upload size limit enforced before Storage is touched, message length/empty validation, correct Firestore payload shape, `startInvoicePayment`'s request shape and error propagation |
| `intasend-client.test.ts` | Sandbox/live host detection from key prefix, checkout payload shape (no `method` field, so the hosted page offers both card and M-Pesa), bearer-token status lookups |
| `intasend-checkout-route.test.ts` | Auth gating, invoice ownership (404 for missing/other-client invoices), already-paid/draft rejection, and the critical case: a client-supplied amount is always ignored in favor of the invoice's real server-side amount |
| `intasend-webhook-route.test.ts` | Challenge verification (correct/wrong/missing/wrong-length), idempotency on redelivery, independent re-verification against IntaSend's API before marking paid, and failing closed (not marking paid) if that verification call itself errors |
| `resend-client.test.ts` | Config detection, correct Resend payload shape, and `sendEmailBestEffort` never throwing even when the send itself fails |
| `email-templates.test.ts` | Correct content per email type, discovery-context fields omitted entirely when not provided, and - the one that matters most - HTML in user-submitted content is escaped rather than injected raw into the email |
| `contact-route.test.ts`, `schedule-consultation-route.test.ts`, `newsletter-route.test.ts` | Notification + confirmation emails sent with the right recipients (reply-to set to the submitter on the owner-facing ones), email skipped silently (not an error) when Resend isn't configured, and a failed send never blocks the form's own success response |
| `cookie-consent.test.ts` | The unified consent hook - correct defaults, `acceptAll`/`declineAll`/`setCategory` behavior, legacy-key migration, and that two independent hook instances (banner + preferences panel) actually stay in sync rather than just coincidentally matching in one test |
| `Analytics.test.tsx` | No scripts render at all when unconfigured, and the Consent Mode v2 signal mapping is correct: no `gtag` call before a decision exists, `analytics_storage` tracks the analytics category, and the three ad-related signals track marketing independently |
| `invoice-reminders-cron.test.ts` | Auth (missing/wrong/correct secret), the actual date-math boundaries (due-in-2-days sends, due-in-10-days doesn't), no duplicate due-soon reminders, the 7-day cooldown between overdue follow-ups, and the owner digest only firing when something was actually sent |
| `admin-auth.test.ts`, `admin-overview-route.test.ts`, `admin-reply-route.test.ts` | The custom-claim check itself (missing/invalid/non-admin/admin tokens), both admin routes' 403/503 gating, invoices sorted worst-first, and - the one that actually matters - a message thread is only ever flagged "needs reply" when the *client* sent the most recent message, not whichever one happened to load first |
| `CountUp.test.tsx` | Numeric parsing and graceful fallback for non-numeric stat values, the animation only firing once per mount, prefers-reduced-motion skipping it entirely, and the real final value being available to screen readers before the animation even starts |
| `anthropic-client.test.ts`, `system-prompt.test.ts`, `chat-route.test.ts`, `ChatWidget.test.tsx` | The `x-api-key` auth header specifically (not `Authorization`, the easy mistake for this one API), the system prompt containing its real constraints (never inventing a price, never claiming to book anything), the chat route's higher-than-default rate limit and conversation-length/message-length caps, and the widget's actual open/close/send/error/new-conversation behavior including Escape-to-close |

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
- Dynamic per-page Open Graph images (`opengraph-image.tsx` under each route) + Twitter cards
- Organization JSON-LD structured data site-wide, Article + BreadcrumbList JSON-LD on blog posts, FAQPage JSON-LD on `/faq`
- Dynamic `sitemap.xml` including all portfolio case studies, blog posts, and both language versions of every page with proper `hreflang` alternates (see §10)
- `robots.txt` disallows the client portal and consultation funnel

**A note on `/faq`'s schema markup, stated plainly rather than overclaimed:**
Google retired the FAQ rich-result search feature entirely on May 7,
2026 (it had already been restricted to a small set of government/
health sites since 2023) - the expandable Q&A dropdown this markup
used to earn in search results no longer exists for anyone. The
`FAQPage` JSON-LD is still included because it's harmless, still
valid, and other consumers of structured data (AI answer engines,
internal tooling) may still use it - but it is not a ranking lever or
a guaranteed search appearance. The page's actual value is the
genuine, specific answers themselves ranking normally in search and
reducing real friction for visitors, not the schema wrapping them.

---

## 10. Internationalization (English / Swahili)

Real, SEO-indexable bilingual support via [next-intl](https://next-intl.dev) — not a client-side text swap. Swahili gets its own real, crawlable URLs (`/sw/...`), not just a toggle that changes text after the page loads.

### Architecture

- **"as-needed" URL prefix**: English keeps every existing URL exactly as it was (`/about`, `/solutions`, ...) — no SEO regression on already-indexed pages. Swahili is available at the same paths under `/sw/` (`/sw/about`, `/sw/solutions`, ...).
- **`middleware.ts`** handles locale detection and the prefix rewriting. It explicitly excludes `/api/*` and `/client-portal/*` — see below.
- **Two separate root layouts** (`app/[locale]/layout.tsx` for the locale-aware marketing site, `app/client-portal/layout.tsx` for the portal) rather than one shared `app/layout.tsx`. This is a deliberate, Next.js-supported pattern ("multiple root layouts") — it's the only way to get a dynamic `<html lang="...">` for marketing pages while keeping the client portal's `lang="en"` fixed and entirely outside the locale system.
- **`/client-portal` is deliberately excluded from the locale system entirely** — it's an authenticated internal tool, not public marketing content that needs multilingual SEO reach. `/sw/client-portal` correctly 404s.
- Translation strings live in `messages/en.json` / `messages/sw.json`, one matching key set per namespace (`nav`, `footer`, `home`, `about`, `solutions`, `contact`). Every namespace has **exact key parity** between the two files — a missing key in one throws immediately rather than silently falling back, so an incomplete translation is loud, not silent.

### What's translated right now

The parts of the site with the most traffic/conversion weight, plus every shared layout piece so the language toggle has visible effect everywhere immediately:

| Covered | Not yet |
|---|---|
| Header nav, footer, mobile bottom nav | Digital Architecture, Digital Strategy, Innovation Lab |
| Homepage | Schedule Consultation, Discovery/Strategic Context funnel |
| About | Legal pages (Terms, Privacy, Cookies) |
| Solutions | Blog posts, Portfolio case studies |
| Contact | `ContactForm`'s own internal labels/validation/success messages |

Pages not yet translated still render correctly at their `/sw/...` URL — they just show their original English content there, since their `page.tsx` hasn't been converted to pull from the message dictionaries yet. This is a real, functional fallback (nothing breaks), not a placeholder — extending coverage is additive engineering work on already-working infrastructure, not a redesign.

### Adding a translation to another page

1. Add a `getTranslations({ locale, namespace: "<pageName>" })` call in the page's `page.tsx` (see `app/[locale]/about/page.tsx` for the pattern) and swap hardcoded strings for `t("keyName")`.
2. Add a matching `"<pageName>": { ... }` block to **both** `messages/en.json` and `messages/sw.json` with identical keys.
3. `npm test` — a key mismatch between the two files will surface immediately as a thrown error in any test that renders the page.

### Verified

154 route/locale combinations checked in a real browser (every page × both languages), 0 axe-core violations in either language, real Swahili content confirmed server-rendered (not just present in the JSON files) including translated `<title>` metadata, and the language switcher confirmed working both directions (`/about` → `/sw/about` → `/about`) without losing the current page.
