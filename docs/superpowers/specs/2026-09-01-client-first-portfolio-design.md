# Client-First Portfolio Redesign — Design Spec

**Date:** 2026-09-01
**Status:** Approved by Justine (design review, this session)
**Branch:** `redesign/client-first-content`

## Goal

Reposition the portfolio from a job-seeker resume site into a client-converting
site for small businesses and startups, while keeping the existing visual design
(dark neutral-900 palette, Inter + JetBrains Mono, muted grays, restrained
framer-motion, existing card tokens) completely unchanged. Add case-study pages,
client-trust sections, and a full SEO overhaul targeting the new canonical
domain **justinecuevas.me**.

## Decisions made with the user

- **Canonical domain:** `https://justinecuevas.me` (code currently says
  devjustine.me; resume says justinecuevas.me). All code references change.
- **Audience:** clients first; recruiter content (experience, tech stack) kept
  but demoted.
- **Testimonials:** none published now. Ship a data-driven section that renders
  nothing while `src/data/testimonials.js` is empty and shows a single featured
  quote once real quotes are added. Never fabricate.
- **Scope:** full — new sections, case-study pages, SEO overhaul, interactive
  polish.
- **Hero headline:** must not be generic; anchor in the specific systems Justine
  actually builds.
- **Primary CTA:** "Start a project" → `/contact` (no booking service yet).
  Structure the CTA target in data so a Cal.com link is a one-line swap later.

## Constraints

- No design-token, color, font, or motion-language changes. Reuse existing card
  styles (`border-neutral-700/60 bg-neutral-800/30 rounded-xl` and
  `rounded-2xl border-white/[0.06] bg-[#111113]`), existing
  `staggerContainer`/`fadeInUp` variants, and `useReducedMotion` guards.
- Zero new npm dependencies.
- Honesty guardrails: first-person "I" (never "we"), no invented metrics, no
  fake logos/testimonials. Case-study metrics limited to verifiable facts from
  the resume; unknown metrics get clearly-marked optional TODO slots in data.
- Follow the existing page pattern: server `page.jsx` exporting metadata via
  `pageMetadata()`, client `*View.jsx` for interactive UI.

## Home page structure (new order)

1. **Hero** (`HeroSection.jsx`, rewritten copy, same typography scale)
   - Mono eyebrow line (replaces "Hello, my name is").
   - Non-generic outcome headline. Working copy:
     `I turn "we need a system for this" into working software.`
   - Subhead naming the audience + full name entity statement in crawlable
     text: "I'm **Justine Jude Cuevas**, a full-stack developer in the
     Philippines. I build web apps for startups and small businesses — payroll
     and attendance platforms, client dashboards, AI-powered tools — scoped
     clearly, demoed weekly, shipped in weeks."
   - Availability badge from `src/data/availability.js` (status + concrete
     note, e.g. "Booking projects for October"). Replaces hard-coded
     "Open to work".
   - Primary CTA button "Start a project" → `/contact`; secondary plain text
     link "or email me" (copies email, see contact polish). Social icons kept.
2. **Credibility strip** — thin row of 3–4 true facts (production engineer at
   an AI video platform; payments/payroll systems experience — Stripe, credit
   ledgers, payroll runs; PropTech hackathon finalist; live products with
   public demos). Mono small-caps styling consistent with section labels.
3. **Services** (`ServicesSection.jsx` + `src/data/services.js`) — 3 cards,
   outcome-titled, plain language, no framework names on the card face,
   each with a "typical timeline" line and a proof line linking to work:
   - **MVP & product development** — idea to launch-ready product
     (auth, payments, admin) in weeks. Proof: QuizyLite + day-job SaaS layer.
   - **Business tools & dashboards** — replace spreadsheets/manual admin with
     custom software. Proof: StaffTrackr, ExpenSync.
   - **AI & automation integration** — document processing, media pipelines,
     AI features in existing products. Proof: AI video platform work.
4. **Selected work** (`ProjectSection.jsx` modified) — existing card visuals;
   each card gains a one-line problem→result summary; primary link goes to
   `/projects/[slug]`; GitHub/Live demoted to secondary links.
5. **Process** (`ProcessSection.jsx` + `src/data/process.js`) — "How we'll work
   together": 01 Intro call & scoping → 02 Fixed scope, honest quote →
   03 Build, with weekly demos → 04 Launch & handover (you own the code).
   Reuses the Experience timeline rail visual language with JetBrains Mono
   step numbers; `<ol>` semantics; staggered fadeInUp; no click-to-expand.
6. **Testimonials** (`TestimonialsSection.jsx` + `src/data/testimonials.js`) —
   renders `null` when the array is empty; with ≥1 entry renders a single
   featured `<figure>/<blockquote>` quote (no carousel, no grid).
7. **About** (`AboutMeSection.jsx`, copy compressed/humanized) — code card
   stays, gains `currentlyBuilding` key sourced from availability data.
8. **Experience** (`ExperienceSection.jsx`, visuals unchanged) — content in
   `src/data/experience.js` upgraded to match the resume's stronger bullets
   (93%→3% false-flag reduction, sub-frame A/V drift, SaaS layer with Stripe
   credit ledger, Supabase RLS).
9. **Tech stack** (`TechStackSection.jsx`, unchanged) — moved to last content
   section, for technical evaluators.
10. **Final CTA** (`FinalCtaSection.jsx`) — restates outcome, de-risks:
    "Free intro chat — you'll get an honest estimate whether or not we work
    together." Button → `/contact`.

CTA plan: one repeated goal. Placements: hero, after services, final block.
Wording varies ("Start a project", "Discuss your project"), target constant.

## New route: case-study pages `/projects/[slug]`

- `src/app/projects/[slug]/page.jsx` — server component, `generateStaticParams`
  over `projects`, `generateMetadata` via `pageMetadata()`, `notFound()` for
  unknown slugs.
- Extend `src/data/projects.js` per project: `slug`, `tagline` (result
  headline), `problem`, `solution` (paragraphs), `results` (array of
  `{ metric, label }` — truthful only), `screenshots` (`{ src, alt, caption }`),
  `role`, `timeline`, `techNotes`. Fix wrong GitHub links (QuizyLite,
  StaffTrackr currently point at the profile root).
- Page shape: breadcrumb back-link → h1 + tagline → metric callout row
  (JetBrains Mono numerals, existing card tokens) → Problem / What I built /
  How it went sections in business language (~600–900 words) → screenshots via
  `next/image` with captions → small tech-notes block → CTA ("Have a similar
  project? Let's talk" → /contact).
- Scroll progress bar (client component, framer-motion `useScroll`, 2px,
  blue→violet gradient, hidden under reduced motion) on case-study pages only.
- JSON-LD per page: `BreadcrumbList` + `CreativeWork` (author → Person `@id`).
- `/projects` listing cards link to case studies as primary action.

## Contact page upgrades

- Server page gains client-focused title/description (see SEO table) and
  `FAQPage` JSON-LD from `src/data/faq.js`.
- Indexable intro paragraph above the grid ("Hire a freelance full-stack
  developer… Philippines (GMT+8), overlaps US/EU mornings, replies within
  24 hours").
- **FAQ accordion** (`FaqAccordion.jsx`): W3C APG pattern — `h3` >
  `<button aria-expanded aria-controls>`, panel `role="region"
  aria-labelledby`; framer-motion `AnimatePresence initial={false}` height
  auto animation; instant toggle under `useReducedMotion`; multiple open
  allowed. Questions: pricing approach, typical timeline, communication
  cadence, timezone, code ownership, post-launch support, existing projects.
- **Copy-email-to-clipboard**: Gmail card becomes a copy-email card
  (`navigator.clipboard` in try/catch → sonner toast + brief `FiCheck` swap),
  with a `mailto:` fallback link.

## SEO overhaul

- **`src/lib/site.js`** — single source for `siteUrl`
  (`https://justinecuevas.me`), site name, email, social URLs (LinkedIn vanity
  URL from resume: `linkedin.com/in/justinejudecuevas`). Consumed by layout,
  seo helper, sitemap, robots, OG image (OG image text updated to
  justinecuevas.me).
- **Home page → server component**: remove `"use client"`/motion from
  `src/app/page.js`; page-level entrance becomes a CSS keyframe fade-up in
  `globals.css`; HeroSection stays a server component; motion remains in
  below-fold client sections. Home exports its own `metadata` (incl.
  `canonical: "/"`).
- **Canonical footgun**: remove `alternates` from root layout metadata.
- **Sitemap**: add case-study URLs; real `lastModified` dates from a
  per-route/project date field, not `new Date()`.
- **Structured data** (all server-rendered JSON-LD):
  - Upgraded `Person` in layout: `@id: <siteUrl>/#person`, given/family name,
    `email`, `description`, `knowsAbout`, `worksFor` (Interactive Content
    Digital s.r.o.), `hasOccupation`, `sameAs` (GitHub + LinkedIn vanity).
  - `WebSite` (layout) with `publisher → @id`.
  - `ProfilePage` (home) with `mainEntity → @id`.
  - `CreativeWork` + `BreadcrumbList` (case-study pages).
  - `FAQPage` (contact). No `ProfessionalService` (local-business type; skip).
- **Titles/descriptions** (≤60-char titles, ~155-char descriptions):
  - Home: `Justine Jude Cuevas — Freelance Full Stack Developer` +
    entity/service description with Philippines + stack + audience.
  - /projects: `Full Stack Projects & Case Studies — Next.js, React, FastAPI`.
  - /projects/quizylite: `QuizyLite — PDF Study Tool Built with Next.js & MongoDB`.
  - /projects/stafftrackr: `StaffTrackr — Workforce & Payroll App with Next.js & Supabase`.
  - /projects/expensync: `ExpenSync — Expense Tracker Built with React & Firebase`.
  - /contact: `Hire a Freelance Full Stack Developer — Contact Justine`.
- **Misc fixes**: remove useless `host` from robots; custom `not-found.js`
  (on-brand, links home/projects); keep GA as-is.
- **Off-page checklist** → `docs/seo-checklist.md` for Justine: Vercel domain
  add + 301 from devjustine.me, GSC (both domains) + Change of Address, Bing
  Webmaster Tools, GitHub profile/repo About links, LinkedIn consistency,
  resume/signature URL, OnlineJobs.ph/Peerlist, quarterly AI-visibility check.

## Explicitly rejected (researched, wrong for this audience)

GitHub contribution calendar, view counters, ⌘K command palette, magnetic
buttons, per-card spotlights (global cursor spotlight already exists), light
theme toggle, inline booking iframe, auto-rotating testimonial carousel.

## Verification

- `npm run lint` and `npm run build` pass.
- Manual checks: all routes render; case-study static params generate; FAQ
  keyboard-accessible; reduced-motion honored; JSON-LD validates (structure
  reviewed against schema.org types); sitemap contains 6 URLs; no remaining
  `devjustine.me` references anywhere in `src/`.
