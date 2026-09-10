# Client-First Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio for business clients (services, process, case studies, CTAs) and migrate SEO to justinecuevas.me, keeping the existing visual design untouched.

**Architecture:** Data-driven sections (new files in `src/data/`) rendered by new/modified section components; a new statically-generated `/projects/[slug]` case-study route; home page converted from a client component to a server component with CSS entrance animation; all SEO constants centralized in `src/lib/site.js`.

**Tech Stack:** Next.js 16 App Router (JS), React 19, Tailwind v4, Framer Motion, react-icons, Sonner. **Zero new dependencies.**

## Global Constraints

- Canonical domain: `https://justinecuevas.me` — no `devjustine.me` string may remain in `src/`.
- Design tokens unchanged: bg-neutral-900 body, text `#A8ADB2`, headings `text-gray-100 text-xl font-bold mb-8` (Inter), mono accents (JetBrains Mono), card tokens `rounded-xl border border-neutral-700/60 bg-neutral-800/30` (soft card) and `rounded-2xl border border-white/[0.06] bg-[#111113]` (project card).
- Motion: reuse `staggerContainer`/`fadeInUp` from `src/lib/animations.js`; guard bespoke animation with `useReducedMotion`.
- Copy: first-person "I", never "we" (except "How we'll work together" heading, which refers to client + Justine). No invented metrics, no fake testimonials.
- Verification cycle per task (no test framework in repo): `npm run lint` and `npm run build` pass; then visual/manual check listed in the task.
- Existing page pattern: server `page.jsx` exports metadata via `pageMetadata()`; interactive UI lives in client `*View.jsx` / section components.

---

### Task 1: Site constants + domain migration + SEO plumbing fixes

**Files:**
- Create: `src/lib/site.js`
- Modify: `src/app/layout.js`, `src/lib/seo.js`, `src/app/sitemap.js`, `src/app/robots.js`, `src/app/opengraph-image.js`

**Interfaces:**
- Produces: `src/lib/site.js` exporting:

```js
export const siteUrl = "https://justinecuevas.me";
export const siteName = "Justine Jude Cuevas";
export const email = "justinecuevas19@gmail.com";
export const github = "https://github.com/Syddl";
export const linkedin = "https://www.linkedin.com/in/justinejudecuevas";
export const personId = `${siteUrl}/#person`;
```

- [ ] **Step 1:** Create `src/lib/site.js` with the exports above.
- [ ] **Step 2:** `src/lib/seo.js`: import `siteUrl`/`siteName` from `@/lib/site`; delete local constants. No other behavior change.
- [ ] **Step 3:** `src/app/layout.js`: import from `@/lib/site`; delete local `siteUrl`. Remove the root `alternates: { canonical: "/" }` (canonical footgun — each page declares its own). Update all LinkedIn hrefs in the codebase to the `linkedin` constant value (layout JSON-LD; HeroSection and ContactView get theirs in later tasks).
- [ ] **Step 4:** `src/app/sitemap.js` + `src/app/robots.js`: import `siteUrl`; remove the Google-ignored `host` field from robots. (Sitemap entries/lastModified rework happens in Task 6.)
- [ ] **Step 5:** `src/app/opengraph-image.js`: replace the literal "devjustine.me" text with "justinecuevas.me" (derive from `siteUrl`).
- [ ] **Step 6:** Verify: `Select-String -Path src -Pattern "devjustine" -Recurse` → zero matches; `npm run lint`; `npm run build` → pass.
- [ ] **Step 7:** Commit: `feat: centralize site constants, migrate to justinecuevas.me`

### Task 2: Content data files

**Files:**
- Create: `src/data/availability.js`, `src/data/services.js`, `src/data/process.js`, `src/data/faq.js`, `src/data/testimonials.js`
- Modify: `src/data/projects.js`, `src/data/experience.js`

**Interfaces (produced, consumed by Tasks 3–7):**

```js
// availability.js
export const availability = {
  open: true,
  note: "Booking new projects",     // short, concrete
  ctaLabel: "Start a project",
  ctaHref: "/contact",              // swap to Cal.com URL later
  currentlyBuilding: "QuizyLite",   // shown in About code card
};

// services.js — export const services = [{ icon, title, outcome, description, timeline, proof: { label, href } }]
// process.js — export const processSteps = [{ step: "01", title, description }]  (4 entries)
// faq.js — export const faqs = [{ q, a }]  (7 entries per spec topics)
// testimonials.js — export const testimonials = [];  // { quote, name, role, source, href } — renders only when non-empty
```

```js
// projects.js — each project gains:
// slug, tagline (result headline), summary (1-line problem→result for cards),
// problem (string), solution (string[]), outcomes (string[] — truthful, non-numeric OK),
// results ([{ metric, label }] — only verifiable numbers, else []),
// screenshots ([{ src, alt, caption }] — reuse existing images),
// role, timeline, techNotes (string), date ("2025-06-01" style, for sitemap lastModified)
```

- [ ] **Step 1:** Write `availability.js`, `services.js` (3 services per spec §Services with plain-language copy, timeline lines like "Typical timeline: 4–6 weeks", proof links to `/projects/<slug>`), `process.js` (4 steps per spec §5), `faq.js` (7 Q&As: pricing approach — fixed quote after scoping, no surprise hourly billing; typical timeline; weekly-demo communication; timezone GMT+8 with US/EU morning overlap; client owns code and accounts; 2 weeks of post-launch fixes included, ongoing support available; yes to improving existing apps), `testimonials.js` (empty array + comment explaining the shape and that the section auto-appears).
- [ ] **Step 2:** Extend `projects.js` with case-study fields. Fix GitHub links: QuizyLite → `https://github.com/Syddl/QuizyLite`, StaffTrackr → `https://github.com/Syddl/StaffTrackr` — **verify these repos exist via `gh repo list Syddl` or the GitHub API first; if private/absent, omit the `github` field for that project and hide the Code link.** Case-study narratives written from resume facts only (QuizyLite: highlight→recall-card flow, mistake review, progress tracking; StaffTrackr: attendance, payroll schedules with tax/deduction handling, pre-run validation; ExpenSync: categorized expense tracking with instant summaries). `results` numbers only where verifiable; otherwise use qualitative `outcomes`.
- [ ] **Step 3:** Rewrite `experience.js` descriptions to resume strength (93%→3% false quality flags, A/V drift ~430ms→sub-frame, SaaS layer: Supabase Auth/RLS across 42 migrations, Stripe credit ledger, admin dashboard, Docker deploy). Keep shape unchanged.
- [ ] **Step 4:** `npm run lint` → pass. Commit: `feat: add client-focused content data (services, process, faq, availability, case studies)`

### Task 3: Home page server conversion + hero rewrite + credibility strip

**Files:**
- Modify: `src/app/page.js`, `src/component/HeroSection.jsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `availability` from Task 2, `pageMetadata` from `src/lib/seo.js`.
- Produces: `page.js` as a **server component** exporting `metadata` and rendering sections in spec order (Hero → Services → SelectedWork → Process → Testimonials → About → Experience → TechStack → FinalCta). Sections not yet built land in Tasks 4–5; wire them as they exist (this task wires Hero + placeholder order for existing sections).

- [ ] **Step 1:** `globals.css`: add `.page-enter` keyframe fade-up (`opacity 0→1, translateY 30px→0, 0.7s ease-out`) with `@media (prefers-reduced-motion: reduce)` disabling it.
- [ ] **Step 2:** `src/app/page.js`: remove `"use client"` and framer-motion; plain `<main>` with existing container classes + `page-enter`; export `metadata = pageMetadata({ title: "Justine Jude Cuevas — Freelance Full Stack Developer", description: <entity/service sentence per spec SEO table>, path: "/" })`. Note: layout template makes title `... | Justine Jude Cuevas`; pass `title` as the full string via `{ absolute: ... }` to avoid "Justine Jude Cuevas — ... | Justine Jude Cuevas" duplication.
- [ ] **Step 3:** Rewrite `HeroSection.jsx` (stays server-safe — no hooks): mono eyebrow (`justinecuevas.me — full-stack developer`), headline `I turn "we need a system for this" into working software.` at existing h1 scale, subhead with full-name entity sentence (spec §Hero), availability badge fed by `availability` (green pulse kept; text `Available — ${availability.note}`), primary CTA button (`bg-neutral-100 text-neutral-900` like the form submit) using `availability.ctaLabel/ctaHref`, secondary "or email me" `mailto:` text link, social icons kept (LinkedIn → vanity URL). Below: credibility strip — 4 short true facts in mono x-small caps separated by `·`.
- [ ] **Step 4:** `npm run build`; view `/` — hero paints without JS (check page source has hero text + full name), animations below fold still work. Commit: `feat: server-render home with client-first hero and credibility strip`

### Task 4: Services, Process, Testimonials, FinalCta sections + About/Experience/SelectedWork updates

**Files:**
- Create: `src/component/ServicesSection.jsx`, `src/component/ProcessSection.jsx`, `src/component/TestimonialsSection.jsx`, `src/component/FinalCtaSection.jsx`
- Modify: `src/component/ProjectSection.jsx`, `src/component/AboutMeSection.jsx`, `src/app/page.js`

**Interfaces:**
- Consumes: `services`, `processSteps`, `testimonials`, `availability` (Task 2).
- Produces: default-export client section components matching existing section conventions (`motion.section` fade-in, `h2` heading classes, `mb-16`).

- [ ] **Step 1:** `ServicesSection.jsx`: heading "What I can build for you"; 3 soft-token cards (icon, outcome title in `text-gray-100 font-semibold`, description `text-sm text-neutral-400`, mono timeline line, proof link with the house arrow-slide hover from ProjectSection's "View all"). CTA line beneath grid: "Not sure which fits? →  Describe your project" → /contact.
- [ ] **Step 2:** `ProcessSection.jsx`: heading "How we'll work together"; `<ol>` timeline reusing ExperienceSection rail (`absolute left-[5px] w-px bg-neutral-800`), JetBrains Mono `01`–`04` step numbers instead of dots, staggered `fadeInUp`.
- [ ] **Step 3:** `TestimonialsSection.jsx`: `if (!testimonials.length) return null;` else single featured `<figure>/<blockquote>/<figcaption>` on soft card tokens, source link when `href` present.
- [ ] **Step 4:** `FinalCtaSection.jsx`: soft card, heading "Have a project in mind?", de-risk line "Free intro chat — you'll get an honest estimate, whether or not we end up working together.", primary button (availability cta) + "or email me" mailto link.
- [ ] **Step 5:** `ProjectSection.jsx`: retitle "Selected work"; replace generic blurb ("curated selection… expertise") with client line; card body shows `project.summary`; whole-card primary link → `/projects/${slug}` ("Read case study" with arrow-slide), Live/Code as small secondary links (Code only when `project.github` exists).
- [ ] **Step 6:** `AboutMeSection.jsx`: compress copy per spec (human, client-facing, mentions day job credibility); code card gains `currentlyBuilding: "<availability.currentlyBuilding>"` line.
- [ ] **Step 7:** Assemble final order in `page.js` (spec §Home order). `npm run lint` + `npm run build`; visual pass at `/`. Commit: `feat: add services, process, testimonials, final CTA sections; refocus about and selected work`

### Task 5: Case-study route `/projects/[slug]` + scroll progress + projects listing update

**Files:**
- Create: `src/app/projects/[slug]/page.jsx`, `src/component/CaseStudyView.jsx`, `src/component/ScrollProgress.jsx`
- Modify: `src/app/projects/ProjectsView.jsx`, `src/app/not-found.js` (create)

**Interfaces:**
- Consumes: extended `projects` (Task 2), `pageMetadata`, `siteUrl`/`personId` (Task 1).
- Produces: `generateStaticParams()` returning `projects.map(p => ({ slug: p.slug }))`; `CaseStudyView({ project })` client component; `ScrollProgress` client component (fixed top 2px, `useScroll` + `scaleX`, blue→violet gradient, `useReducedMotion` → null).

- [ ] **Step 1:** `[slug]/page.jsx` (server): `generateStaticParams`, `generateMetadata` (per-project title/description from spec SEO table via `pageMetadata` with `path: /projects/${slug}`), `notFound()` on bad slug, render JSON-LD `<script>`s: `BreadcrumbList` (Home → Projects → name) and `CreativeWork` (`author: { "@id": personId }`, `url` live link), then `<ScrollProgress />` + `<CaseStudyView project={...} />`.
- [ ] **Step 2:** `CaseStudyView.jsx`: breadcrumb back-link ("← All projects"), h1 + tagline, metric row (only when `results.length` — mono numerals on soft cards), sections "The problem" / "What I built" / "How it went" (business language from data), screenshots via `next/image` (existing images; `sizes` set; captions `text-xs text-neutral-500`), collapsed-style tech-notes block (mono, small), CTA card "Have a similar project in mind? → Let's talk" → /contact. Motion: `fadeInUp` whileInView, consistent with home.
- [ ] **Step 3:** `ProjectsView.jsx`: page blurb → client-focused; cards link primarily to case study (same pattern as Task 4 Step 5).
- [ ] **Step 4:** Create `src/app/not-found.js`: server component, on-brand 404 (mono "404", line, links to `/` and `/projects`).
- [ ] **Step 5:** `npm run build` → confirm `/projects/quizylite|stafftrackr|expensync` in build output as SSG; click through all three; verify 404 page. Commit: `feat: add case-study pages with structured data, scroll progress, custom 404`

### Task 6: Contact page upgrades + FAQ + structured data + sitemap

**Files:**
- Create: `src/component/FaqAccordion.jsx`
- Modify: `src/app/contact/page.jsx`, `src/app/contact/ContactView.jsx`, `src/app/layout.js`, `src/app/sitemap.js`

**Interfaces:**
- Consumes: `faqs` (Task 2), `email`/`siteUrl`/`personId` (Task 1), `projects` dates (Task 2).

- [ ] **Step 1:** `FaqAccordion.jsx` (client): APG pattern — each item `h3 > button` with `aria-expanded`/`aria-controls`, panel `role="region" aria-labelledby`; `AnimatePresence initial={false}` + `motion.div` height 0↔auto with `overflow-hidden`; instant (no animation) under `useReducedMotion`; rotating `FiChevronDown`; multiple open allowed; soft card tokens.
- [ ] **Step 2:** `contact/page.jsx`: metadata → `Hire a Freelance Full Stack Developer — Contact Justine` + spec description; emit `FAQPage` JSON-LD from `faqs`.
- [ ] **Step 3:** `ContactView.jsx`: add indexable intro (h1 "Let's build something for your business" moved above grid + short paragraph: freelance full-stack developer, Philippines GMT+8, overlaps US/EU mornings, replies within 24 hours); Gmail card → copy-email card (`navigator.clipboard.writeText(email)` in try/catch → `toast.success("Email copied")` + 2s `FiCheck` swap; secondary small `mailto:` link "or open in your mail app"); LinkedIn href → vanity URL; append `<FaqAccordion />` below the form under heading "Common questions".
- [ ] **Step 4:** `layout.js` structured data: upgrade `personJsonLd` (`@id: personId`, givenName/familyName, email `mailto:`, description, `knowsAbout` array from resume stack, `worksFor` Interactive Content Digital s.r.o., `hasOccupation` Full Stack Developer, sameAs); add `WebSite` JSON-LD (`publisher: {"@id": personId}`); add `ProfilePage` JSON-LD (`mainEntity: {"@id": personId}`) emitted from `src/app/page.js` (home only, not layout).
- [ ] **Step 5:** `sitemap.js`: entries for `/`, `/projects`, `/contact`, and each `/projects/${slug}`; `lastModified` from fixed dates (`projects[].date` for case studies; a `const contentUpdated = "2026-09-01"` for static routes), not `new Date()`.
- [ ] **Step 6:** `npm run build`; fetch `/sitemap.xml` locally → 6 URLs; validate JSON-LD blocks parse (paste-check structure). Commit: `feat: contact conversion polish, FAQ with schema, enriched entity data, real sitemap dates`

### Task 7: Final verification + docs

**Files:**
- Create: `docs/seo-checklist.md`
- Modify: `README.md`

**Interfaces:** none (terminal task).

- [ ] **Step 1:** `docs/seo-checklist.md` — owner's off-page checklist from spec §SEO overhaul (Vercel domain add + 301 devjustine.me→justinecuevas.me with exact Vercel steps, GSC both domains + Change of Address, Bing Webmaster Tools import, GitHub profile website field + pin repos + repo About links to case-study URLs, LinkedIn Featured/Contact-Info consistency, resume/email-signature URL, OnlineJobs.ph + Peerlist, quarterly AI-visibility check prompts).
- [ ] **Step 2:** README: update live URL to justinecuevas.me; add one line about data-driven content (`src/data/*` — edit availability/testimonials there).
- [ ] **Step 3:** Full sweep: `npm run lint`, `npm run build`; grep `src/` for `devjustine` (0 hits) and `Open to work` (replaced); keyboard-walk FAQ; check reduced-motion via devtools emulation; confirm every route in build output.
- [ ] **Step 4:** Commit: `docs: add owner SEO checklist, update README`. Push branch, open PR to main.

## Self-Review

- **Spec coverage:** domain migration (T1), data (T2), hero/server home (T3), sections + about/experience (T2/T4), case studies + 404 + scroll progress (T5), contact/FAQ/JSON-LD/sitemap (T6), off-page checklist + verification (T7). Rejected-features list requires no task. ✓
- **Placeholder scan:** case-study narrative text lives in Task 2 Step 2 sourced from resume facts listed there; hero/final copy specified in Tasks 3–4. ✓
- **Consistency:** `availability`/`services`/`processSteps`/`faqs`/`testimonials` names match across tasks; `personId` defined T1, consumed T5/T6. ✓
