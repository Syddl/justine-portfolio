# Repetition & Texture Pass — Design Spec

**Date:** 2026-09-02
**Status:** Approved by Justine (Part 1 explicitly; Part 2 by "do it")
**Branch:** `redesign/client-first-content`
**Builds on:** `2026-09-01-client-first-portfolio-design.md`

## Goal

Cut the repetition that crept into the home page during the client-first
rewrite, give the page visual peaks instead of six identical sections, and add
a handful of interactions that reinforce the story ("I turn *'we need a system
for this'* into working software") rather than decorate it. The visual language
(neutral-900, Inter + JetBrains Mono, muted greys, amber-300 accent,
restrained motion) is unchanged; the leftover blue/violet secondary accent is
retired.

## Findings the design answers

From three audits run on 2026-09-02 (content, screenshots at 1280px,
interaction research):

- "Philippines" 4× in the first two screens; "AI video platform" 4× on the
  home page; "clear scope / weekly demos" twice within 400px.
- The About code card carries zero new facts (name, role, location,
  `openToWork`, stack are all already on screen) and is the only continuous
  animation on the page.
- The strongest evidence on the site (93%→3% false flags, ~430 ms→<1 frame
  drift, 70+ CI gates, $0.70/min) is buried mid-paragraph in 14px grey.
- Header uses `lg:w-[50%] lg:left-[25%]` + `md:gap-120` instead of the content
  column, so logo, content, `/projects` title and footer have different left
  edges.
- A second accent system (blue mouse glow, blue card hover, blue→violet scroll
  bar and gradient washes, syntax rainbow, window dots) runs beside amber.
- Every section shares one skeleton (`text-xl` h2 → grey sub-line → `mb-16`);
  no visual tier exists between the 48px h1 and the 20px h2s.
- Tech Stack is 30 bordered chips in 8 rows (~600px), the tallest section.
- `ProjectSection` and `ProjectsView` are ~85% duplicated JSX; `/projects`
  shows the same two cards as home.

## Decisions made with the user (2026-09-02)

- **Accent:** amber-300 is the single chromatic accent. Green is reserved for
  live/current state (availability badge, current-role dot, check icons).
  Blue/violet is removed everywhere.
- **About card:** replaced by a proof-numbers block with count-up animation.
- **Interactions:** hero requirement cycler, stack↔work cross-highlight,
  self-drawing timeline rail, live timezone line on Contact. Count-up numbers
  ride along with the proof block.
- **Structure:** tighten in place. Section order stays Hero → (Testimonials
  when data exists) → About → Experience → Hackathons → Stack → Selected work.
- Still rejected from yesterday: ⌘K palette, magnetic buttons, per-card
  spotlights, theme toggle, carousels.

## Constraints

- Zero new npm dependencies. framer-motion 12.11 (`import from "framer-motion"`)
  is the only animation library; verified APIs used: `motion`,
  `AnimatePresence`, `useScroll`, `useSpring`, `useTransform`,
  `useMotionValue`, `useMotionValueEvent`, `useInView`, `useReducedMotion`,
  `animate`.
- No new fonts, no new spacing scale, no new palette. New components reuse
  the existing card chrome (`rounded-xl border-neutral-700/60 bg-neutral-800/30`).
- Hero stays a server component; the full name and the canonical headline are
  in the initial HTML.
- Every new interaction: renders a useful static state on first paint, has a
  `useReducedMotion` branch, and works on touch or degrades to plain content.
- Copy stays first-person, anchored in real work, no invented numbers. The
  "<1 frame" drift figure is never turned into a made-up millisecond value.
- Content stays data-driven; nothing hard-coded in components that belongs in
  `src/data/`.

## Global frame

- Header, `<main>`, and footer share one column: `mx-auto max-w-3xl w-full px-6`.
  Remove `lg:w-[50%] lg:left-[25%]`, `md:justify-center md:gap-120`. The
  `/projects` page drops from `max-w-4xl` to `max-w-3xl`.
- `<body>` becomes `min-h-screen flex flex-col`; `<main>` keeps `flex-grow` so
  the footer sits at the bottom on short pages.
- `MouseHoverEffect`: `rgba(59,130,246,0.15)` at 600px → `rgba(252,211,77,0.06)`
  at 700px (amber-300). Wrapper opacity unchanged.
- `ScrollProgress`: blue→violet gradient → `bg-amber-300/70`.
- Project cards: hover border `border-blue-500/20` → `border-white/[0.12]`;
  drop the `hover:shadow-blue-500/[0.03]` shadow.
- Remove the blue/violet gradient washes (About card, case-study CTA box).
- **`SectionHeading`** (`src/component/SectionHeading.jsx`, server-safe):
  props `eyebrow`, `title`, `lede?`, `action?` (right-aligned slot, used by
  Selected work's "View all"). Renders a JetBrains Mono eyebrow
  (`text-xs text-neutral-500`, e.g. `// about`), h2 `text-2xl font-bold
  text-gray-100`, optional lede `text-sm text-neutral-400 max-w-xl`. Ledes are
  used only on Hackathons and Selected work.
- **`Reveal`** (`src/component/motion/Reveal.jsx`, client): the
  `initial={{opacity:0,y:30}} whileInView viewport={{once:true,margin:"-80px"}}`
  wrapper currently copy-pasted in six files. Props: `as` (default `section`),
  `className`, `y`, `delay`. CaseStudyView's local `Reveal` is replaced by it.
- Section spacing varies slightly: hero `mb-24`, About `mb-20`, the rest
  `mb-16`, so the page has rhythm rather than a uniform gap.

## Hero (`HeroSection.jsx`, server component)

Four rows instead of nine.

1. **h1** — three lines: "I turn" (`text-gray-100`, same tone as line 3),
   the amber quote, "into working software." The mono eyebrow line is removed.
   - The quote is `RequirementCycler` (`src/component/RequirementCycler.jsx`,
     client). Props: `phrases` from `src/data/hero.js`:
     `["we need a system for this", "payroll is still in a spreadsheet",
     "can it turn a PDF into flashcards?", "the audio is 430 ms out of sync"]`.
     `phrases[0]` is rendered as static text in the server HTML; after mount it
     cycles every 3500 ms with `AnimatePresence mode="wait"` (opacity + 6px y,
     ~250 ms each way). A mono block cursor (`▍`, amber, CSS blink) sits after
     the active phrase.
     Layout: a `grid` where every phrase occupies `[grid-area:1/1]`; inactive
     phrases are `invisible` and `aria-hidden`, so the cell is always as tall as
     the longest phrase and nothing shifts when one wraps on mobile.
     A11y: the container has `aria-live="off"`; the h1 carries
     `aria-label="I turn 'we need a system for this' into working software."`.
     `useReducedMotion` → static `phrases[0]`, no cursor.
2. **Paragraph** — *"I'm Justine Jude Cuevas, a full-stack developer in the
   Philippines. I build the software small teams run on: payroll that checks
   itself before payday, a study tool that turns PDF highlights into recall
   cards, video pipelines that catch their own mistakes."* (StaffTrackr,
   QuizyLite, day job.) "Scoped clearly, demoed weekly, shipped in weeks" moves
   to About.
3. **Status row** — the green availability badge only. `🏠Philippines.` and the
   `now full-stack engineer…` line are removed.
4. **CTA row** — "Start a project" button, "or email me" link, then a 1px
   `bg-neutral-800` divider and the GitHub/LinkedIn icons at `text-xl
   text-neutral-500 hover:text-gray-100`.

## About (`AboutMeSection.jsx`)

Grid unchanged (3/5 text, 2/5 card). Heading via `SectionHeading` (`// about`,
no lede).

- **Left copy** (shares no phrase with hero or Experience):
  *"Most of my week goes into production software where "works on my machine"
  isn't good enough: payments, media pipelines, and the failures that only show
  up once real users arrive."*
  *"That habit carries into client work. We agree on scope before I write code,
  you see a working demo every week, and what ships is built to survive real
  data. If something important in your business still runs on a spreadsheet, or
  an idea needs to become a product, tell me about it."*
- **Right: `ProofBlock`** (`src/component/ProofBlock.jsx`, client). Card chrome
  `rounded-xl border-neutral-700/60 bg-neutral-800/30 p-5`; no window dots, no
  float loop, no gradient. Header: mono eyebrow `// day job, in numbers`, then
  `AI video platform · since June 2026` in `text-xs text-neutral-500`
  (derived from `experience[0]`: `usageLabel` + start of `dates`).
  Rows (from `experience[0].metrics`, see data):
  | figure | label |
  |---|---|
  | `93% → 3%` | false quality flags on generated clips |
  | `~430 ms → <1 frame` | audio/video drift |
  | `70+` | zero-cost CI gates |
  | `$0.70` | per output minute, end to end |
  Figures are JetBrains Mono `text-gray-100`; the arrow is `text-amber-300`;
  labels are Inter `text-sm text-neutral-400`. Rows separated by
  `divide-y divide-neutral-800`.
  Each row has `aria-label` = its `sentence` field (e.g. "false quality flags
  on generated clips cut from 93% to 3%").
- **`useCountUp`** (`src/lib/useCountUp.js`): `useCountUp({ from, to, duration
  = 1.2, inView })` → returns the current rounded number. Implementation:
  `useMotionValue(from)`, `animate(mv, to, { duration, ease: "easeOut" })` when
  `inView` first becomes true, `useMotionValueEvent(mv, "change", setState)`.
  With `useReducedMotion` it returns `to` immediately. `ProofBlock` gets
  `inView` from `useInView(ref, { once: true, margin: "-80px" })`.
  Metric rendering rule: a metric with numeric `count: { from, to, format }`
  animates its final figure; a metric without `count` (the drift row) simply
  fades in with the stagger. The "before" part of a pair is static text.

## Experience (`ExperienceSection.jsx`)

- Heading via `SectionHeading` (`// experience`, no lede).
- **Rail**: keep the `bg-neutral-800` base rail; add an absolutely positioned
  amber overlay (`bg-amber-300/70 origin-top`) whose `scaleY` is
  `useSpring(useScroll({ target: listRef, offset: ["start 80%", "end 60%"] })
  .scrollYProgress)`. Non-current dots switch `bg-neutral-600` →
  `bg-amber-300` once the progress passes their vertical position (position
  measured with `getBoundingClientRect` relative to the list on mount/resize;
  compared via `useMotionValueEvent`). The current role keeps its green ping.
  Reduced motion → base rail and static dots, as today.
- **Entry**: mono `type` tag (`text-[11px] uppercase tracking-wider
  text-neutral-500`) above the title — the data comment promised it, the
  component never rendered it. Then title · company, dates, location,
  description, tech line (unchanged styles).
- **Data** (`src/data/experience.js`):
  - Current role: add `usageLabel: "AI video platform"`, `metrics: [...]`
    (shape below), and trim `description` to prose with no numbers:
    *"I build and maintain an AI video platform that turns a script into a
    1080p narrated video with a lip-synced avatar. I own the pipeline's quality
    guards (LLM vision checks, checkpoint resume, pre-spend cost guards, a
    zero-cost CI suite) and the SaaS layer around it: a Next.js console,
    Supabase Auth with RLS, role-based team seats, a Stripe-backed credit
    ledger, an admin dashboard, and a Dockerized deploy."*
  - `tech` split into single tools: `"Python / FastAPI"` → `"Python"`,
    `"FastAPI"`; `"BullMQ / Redis"` → `"BullMQ"`, `"Redis"`.
  - MicroPets description rewritten for clients: *"Promotional graphics for
    MicroPets' marketing campaigns: social posts, banners, and launch visuals.
    It's also why projects with me don't need a second hire for mockups and
    launch assets."*
  - `metrics` shape:
    ```js
    metrics: [
      { before: "93%", after: "3%", count: { from: 93, to: 3, format: (v) => `${v}%` },
        label: "false quality flags on generated clips",
        sentence: "False quality flags on generated clips cut from 93% to 3%" },
      { before: "~430 ms", after: "<1 frame",
        label: "audio/video drift",
        sentence: "Audio/video drift cut from about 430 milliseconds to under one frame" },
      { after: "70+", count: { from: 0, to: 70, format: (v) => `${v}+` },
        label: "zero-cost CI gates",
        sentence: "More than 70 zero-cost CI gates" },
      { after: "$0.70", count: { from: 0, to: 0.7, format: (v) => `$${v.toFixed(2)}` },
        label: "per output minute, end to end",
        sentence: "About 70 cents per output minute, end to end" },
    ]
    ```

## Hackathons (`HackathonSection.jsx`)

- Heading via `SectionHeading` (`// hackathons`, lede kept: "Where I find out
  how much of a working product I can get to under a deadline.").
- Ledger layout unchanged. Highlighted tag: `text-xs font-semibold
  text-amber-300` (was 11px regular). Non-highlighted tags unchanged.
- Row reveal switches to `Reveal` + existing stagger variants.

## Tech stack (`TechStackSection.jsx`)

- Heading via `SectionHeading` (`// stack`). The lede slot holds the live
  caption instead of a static sentence.
- **Layout**: one row per group, `grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-2`
  (stacked on mobile). Label: mono `text-[11px] uppercase tracking-wider
  text-neutral-500`. Items: `button` elements (`type="button"`) rendered
  inline (`flex flex-wrap gap-x-4 gap-y-2`), icon `w-4 h-4` + name,
  `text-sm text-neutral-300`, no border/fill, no per-item spring. Hover/focus:
  `text-gray-100`; the active item: `text-amber-300`. Section height drops from
  ~600px to roughly 220px on desktop.
- **Cross-highlight**: component state `active` (tool name or null). Set on
  `pointerenter`/`focus`, cleared on `pointerleave`/`blur`; on touch, tap
  toggles and a document `pointerdown` outside the section or `Escape` clears.
  When `active` has usage: every item not sharing at least one usage context
  with `active` gets `opacity-40` (200 ms transition); the caption reads
  `used in: StaffTrackr · AI video platform` (mono, amber-300 for the list).
  When `active` has no usage: nothing dims; caption reads
  `used in: work without a public write-up yet`. Default caption:
  "Everything here is in something I've shipped. Hover a tool to see where."
  Caption swaps with `AnimatePresence` (opacity only) and is `aria-live="polite"`.
- **`src/lib/stackUsage.js`**: `buildStackUsage()` returns
  `Map<toolName, string[]>` from `projects[].stack` (context = project `name`)
  and `experience[].tech` (context = `usageLabel`, entries without one are
  skipped). `sharesContext(a, b)` helper for the dim test. Exact-name matching,
  so data is canonicalised (below).
- **Data**:
  - `projects.js` stack arrays: `"NextJS"` → `"Next.js"`, `"Shadcn"` →
    `"shadcn/ui"`, `"Motion"` → `"Framer Motion"`. Stays as-is: `TypeScript`,
    `Tailwind`, `MongoDB`, `Supabase`.
  - `stackdata.js`: add `{ icon: SiFramer, name: "Framer Motion" }` to
    Frontend. Everything else unchanged.

## Selected work (`ProjectSection.jsx`, `ProjectsView.jsx`, new `ProjectCard.jsx`)

- **`ProjectCard`** (`src/component/ProjectCard.jsx`, client): the home
  card's markup (h-44 image header with top gradient, `p-5` body, tech pills,
  text links "Read case study" / "Live Demo" / "Code"). Accepts `project` and
  `variants` (for stagger). Hover: `y: -4` spring, border `white/[0.12]`.
  Used by both `ProjectSection` and `ProjectsView`; the duplicated JSX is
  deleted.
- `ProjectSection`: heading via `SectionHeading` (`// selected work`, lede
  kept, `action` = "View all" link). The action renders only when
  `projects.length > featured.length`.
- `ProjectsView`: `max-w-3xl`, same grid, uses `ProjectCard`.
- Pills read canonical names from data (no display mapping).

## Contact (`ContactView.jsx`, new `TimezoneLine.jsx`)

- Intro paragraph: *"I'm a freelance full-stack developer in the Philippines,
  working remotely with clients worldwide. Describe your project in a couple of
  sentences and I'll reply within 24 hours with an honest read on scope and
  cost."* (The "US evenings / European mornings" sentence is replaced by the
  live line.)
- **`TimezoneLine`** (client) directly under the intro, JetBrains Mono
  `text-xs text-neutral-500`, values in `text-neutral-300`:
  `Manila 22:14 · your time 16:14 · 6 h ahead`. Rules:
  - Manila time via `Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Manila",
    hour: "2-digit", minute: "2-digit", hour12: false })`; visitor time via the
    same formatter without `timeZone`.
  - Offset difference = `8 - (-(new Date().getTimezoneOffset()) / 60)`;
    rendered as `N h ahead`, `N h behind`, or `same time zone` (half-hour zones
    render as e.g. `5.5 h ahead`).
  - If `availability.hours` is set (`{ start: 9, end: 21 }`, Manila, 24h),
    append `· online 09:00–21:00 Manila (03:00–15:00 your time)`. Default:
    unset — no invented hours.
  - Renders `Manila --:-- · your time --:--` until mounted (avoids hydration
    mismatch), then updates every 60 s. No motion.
- Link cards and form unchanged.

## Case study (`CaseStudyView.jsx`)

- Local `Reveal` replaced by the shared one.
- CTA box: gradient wash removed; body copy becomes *"Tell me what you're
  replacing or building, and I'll tell you what it would take."* Heading and
  button unchanged.
- `ScrollProgress` amber (global change).

## Footer (`layout.js`)

- Same `max-w-3xl px-6` column. Left: `© {year} Justine Jude Cuevas`. Right:
  `GitHub · LinkedIn · email` as JetBrains Mono `text-xs text-neutral-500
  hover:text-gray-100` links from `src/lib/site.js`.

## Data & docs

- `src/data/hero.js` (new): `heroPhrases` array with a comment explaining that
  `[0]` is the server-rendered canonical headline and the rest must each fit
  on two lines at 360px.
- `src/data/availability.js`: optional `hours` documented in the header
  comment; `currentlyBuilding` removed (its only consumer was the code card).
- README "data-driven" paragraph mentions `hero.js`, `metrics`, `usageLabel`,
  and `hours`.

## Files

New: `src/component/SectionHeading.jsx`, `src/component/motion/Reveal.jsx`,
`src/component/RequirementCycler.jsx`, `src/component/ProofBlock.jsx`,
`src/component/ProjectCard.jsx`, `src/component/TimezoneLine.jsx`,
`src/lib/useCountUp.js`, `src/lib/stackUsage.js`, `src/data/hero.js`.

Modified: `src/app/layout.js`, `src/app/page.js`, `src/app/projects/ProjectsView.jsx`,
`src/app/contact/ContactView.jsx`, `src/component/{HeroSection,AboutMeSection,
ExperienceSection,HackathonSection,TechStackSection,ProjectSection,
TestimonialsSection,CaseStudyView,ScrollProgress,MouseHoverEffect}.jsx`,
`src/data/{experience,projects,stackdata,availability}.js`, `README.md`.

## Verification

- `npm run lint` and `npm run build` pass.
- Screenshot pass at 1280px and 390px (390px via a local HTML page that
  embeds the dev server in a 390px-wide iframe, since the Chrome window will
  not resize below desktop width): header, content and footer share a left
  edge; hero is four rows; no phrase in the cycler forces a layout shift;
  stack section ≤ ~1/3 of its previous height; no blue/violet anywhere.
- Interaction checks: cycler runs and pauses under reduced motion; count-up
  fires once on scroll-in; rail draws and dots light; stack cross-highlight
  works with mouse, keyboard (Tab/Escape) and tap; timezone line renders
  placeholders before mount and correct values after.
- Content checks: "Philippines" appears once on the home page body,
  "AI video platform" once outside the proof block, no metric figure appears
  twice outside the hero cycler (whose "430 ms" is client-speak, not a
  metric), `grep -rn "blue-\|violet-" src/` returns nothing.
