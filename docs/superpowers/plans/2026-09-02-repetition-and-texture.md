# Repetition & Texture Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the repeated facts and identical section skeletons from the portfolio home page, retire the stray blue/violet accent, and add five story-reinforcing interactions (requirement cycler, proof count-up, self-drawing rail, stack cross-highlight, live timezone line).

**Architecture:** Next.js 16 App Router site; home page is a server component composed of section components. Content is data-driven from `src/data/`. New shared primitives (`SectionHeading`, `Reveal`, `useCountUp`, `stackUsage`) are built first, then each section is rewritten to use them. The only pure-logic module (`stackUsage.js`) takes its data as arguments so it is unit-tested with Node's built-in test runner; everything else is verified with `npm run lint`, `npm run build`, and a screenshot pass.

**Tech Stack:** Next.js 16.2, React 19, Tailwind CSS v4, framer-motion 12.11 (`import … from "framer-motion"`), react-icons 5, Node 22 (`node --test`).

**Spec:** `docs/superpowers/specs/2026-09-02-repetition-and-texture-design.md`

## Global Constraints

- Zero new npm dependencies.
- No new fonts, no new palette, no new spacing scale. Only `amber-300` (accent), greens (live/current state), and the existing neutral greys. After this plan, `grep -rn "blue-\|violet-\|emerald-" src/` must return nothing.
- New cards reuse `rounded-xl border border-neutral-700/60 bg-neutral-800/30`.
- Hero stays a server component; `heroPhrases[0]` and the full name are in the initial HTML.
- Every new interaction renders a useful static state on first paint, respects reduced motion, and works on touch or degrades to plain content.
- Hydration rule (found in review of Task 4): framer-motion's `useReducedMotion()` is `null` on the server and the real boolean on the first client render, so it must never change MARKUP. Use it only for transitions, effects, and motion values; hide decorative motion elements with CSS (`prefers-reduced-motion` / Tailwind `motion-reduce:*`). Tasks 1 and 4 were amended to follow this (`Reveal` zeroes its transition, `useCountUp` starts at `to`, the cycler cursor is hidden by CSS); Task 6's code below already follows it.
- Copy is first person, anchored in real work, no invented numbers. Never turn "<1 frame" into a millisecond value.
- Content belongs in `src/data/`; components render data.
- Match existing style: 2-space indent, double quotes, trailing semicolons, `${inter.className}` / `${jetbrainsMono.className}` on text elements, short "why" comments above non-obvious blocks, no em-dashes in copy or comments (use `-`, `:` or `,`).
- After every task: `npm run lint` and `npm run build` pass (build needs no env vars; the contact form key may be unset).
- Commit after every task with a conventional-commit subject and the footer:
  ```
  Co-Authored-By: Claude Code <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01U5ku1jaszvq78RjxEmu3Rq
  ```

---

## File map

| File | Responsibility |
|---|---|
| `src/component/SectionHeading.jsx` (new) | Mono eyebrow + `text-2xl` h2 + optional lede/action; server-safe |
| `src/component/motion/Reveal.jsx` (new, client) | The reveal-on-scroll wrapper, hoisted |
| `src/lib/useCountUp.js` (new, client) | Count from → to once `inView`; reduced-motion aware |
| `src/lib/stackUsage.js` (new, pure) | tool → contexts map + `sharesContext` |
| `src/lib/stackUsage.test.mjs` (new) | `node --test` coverage for the above |
| `src/data/hero.js` (new) | `heroPhrases` |
| `src/component/RequirementCycler.jsx` (new, client) | Cycling amber quote inside the h1 |
| `src/component/ProofBlock.jsx` (new, client) | Day-job metrics card with count-up |
| `src/component/ProjectCard.jsx` (new, client) | One card for home and `/projects` |
| `src/component/TimezoneLine.jsx` (new, client) | Manila / visitor clock line |
| `src/app/layout.js` | One content column, body flex, footer links |
| `src/app/globals.css` | Cursor blink keyframe |
| `src/component/MouseHoverEffect.jsx`, `ScrollProgress.jsx` | Amber accent |
| `src/component/{Hero,AboutMe,Experience,Hackathon,TechStack,Project,Testimonials}Section.jsx`, `CaseStudyView.jsx` | Section rewrites |
| `src/app/projects/ProjectsView.jsx`, `src/app/contact/ContactView.jsx` | Page rewrites |
| `src/data/{experience,projects,stackdata,availability}.js` | Data changes |
| `package.json`, `.github/workflows/ci.yml`, `README.md` | Test script, CI, docs |

---

### Task 1: Shared primitives (`SectionHeading`, `Reveal`, `useCountUp`)

**Files:**
- Create: `src/component/SectionHeading.jsx`
- Create: `src/component/motion/Reveal.jsx`
- Create: `src/lib/useCountUp.js`

**Interfaces:**
- Produces: `SectionHeading({ eyebrow: string, title: string, lede?: ReactNode, action?: ReactNode, className?: string })` - default export, server-safe.
- Produces: `Reveal({ as?: "section" | "div" | "ul" | "li", className?: string, y?: number, delay?: number, children })` - default export, client component.
- Produces: `useCountUp({ from: number, to: number, duration?: number, inView: boolean }): number` - named export.

- [ ] **Step 1: Create `SectionHeading`**

```jsx
// src/component/SectionHeading.jsx
import { inter, jetbrainsMono } from "@/app/fonts";

// One heading treatment for every home section: a mono "// eyebrow" (the same
// idiom the case-study pages already use), a 2xl title, and an optional lede.
// `action` is a right-aligned slot for a link such as "View all". Server-safe:
// no hooks, no motion.
const SectionHeading = ({
  eyebrow,
  title,
  lede,
  action,
  className = "mb-8",
}) => {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className={`${jetbrainsMono.className} text-xs text-neutral-500 mb-2`}
          >
            {`// ${eyebrow}`}
          </p>
          <h2
            className={`${inter.className} text-gray-100 text-2xl font-bold leading-tight`}
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {lede && (
        <p
          className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mt-3`}
        >
          {lede}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
```

- [ ] **Step 2: Create `Reveal`**

```jsx
// src/component/motion/Reveal.jsx
"use client";

import { motion } from "framer-motion";

// The reveal-on-scroll wrapper that every home section used to copy-paste.
// `as` picks the element so sections keep their semantics (<section>, <div>).
const Reveal = ({
  as = "section",
  className = "",
  y = 30,
  delay = 0,
  children,
}) => {
  const Tag = motion[as];

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
```

- [ ] **Step 3: Create `useCountUp`**

```js
// src/lib/useCountUp.js
"use client";

import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

// Counts from `from` to `to` the first time `inView` becomes true and returns
// the live value. Format it at the call site (round, add units). Under reduced
// motion the final value is returned immediately.
export function useCountUp({ from, to, duration = 1.2, inView }) {
  const prefersReducedMotion = useReducedMotion();
  const value = useMotionValue(from);
  const [current, setCurrent] = useState(from);

  useMotionValueEvent(value, "change", (v) => setCurrent(v));

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion) {
      value.set(to);
      return undefined;
    }
    const controls = animate(value, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, prefersReducedMotion, value, to, duration]);

  return prefersReducedMotion ? to : current;
}
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0 (the new files are not imported yet, so build output is unchanged).

- [ ] **Step 5: Commit**

```bash
git add src/component/SectionHeading.jsx src/component/motion/Reveal.jsx src/lib/useCountUp.js
git commit -m "feat: add SectionHeading, Reveal, and useCountUp primitives"
```

---

### Task 2: One content column + amber-only accent

**Files:**
- Modify: `src/app/layout.js` (header lines 123-135, body line 113, footer lines 138-146)
- Modify: `src/component/MouseHoverEffect.jsx:16`
- Modify: `src/component/ScrollProgress.jsx:17`
- Modify: `src/component/CaseStudyView.jsx` (lines 1-29 Reveal, 213-238 CTA)
- Modify: `src/app/globals.css` (append)

**Interfaces:**
- Consumes: `Reveal` from Task 1.

- [ ] **Step 1: Rewrite the layout's body, header and footer**

Replace everything from `<body …>` to `</body>` in `src/app/layout.js` with:

```jsx
      <body className="bg-neutral-900 w-full min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <MouseHoverEffect />
        {/* Header, main, and footer share one column so every left edge lines
            up: the old half-width header only matched the content by accident
            at ~1280px. */}
        <header className="mx-auto max-w-3xl w-full px-6">
          <div className="text-[#A8ADB2] flex justify-between items-center py-5">
            <Logo />
            <nav className={`${inter.className} flex gap-8`}>
              <Link href="/projects" className="text-[16px] hover:text-gray-100">
                Projects
              </Link>
              <Link href="/contact" className="text-[16px] hover:text-gray-100">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster richColors />
        <footer className="border-t border-solid border-gray-800">
          <div className="mx-auto max-w-3xl w-full px-6 h-15 flex items-center justify-between gap-4">
            <p
              className={`${inter.className} text-sm font-semibold text-[#A8ADB2]`}
            >
              © {year} Justine Jude Cuevas
            </p>
            <nav
              aria-label="Elsewhere"
              className={`${jetbrainsMono.className} flex items-center gap-4 text-xs text-neutral-500`}
            >
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 transition-colors"
              >
                GitHub
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${email}`}
                className="hover:text-gray-100 transition-colors"
              >
                email
              </a>
            </nav>
          </div>
        </footer>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
```

And change the fonts import at the top of the file to:

```js
import { inter, jetbrainsMono } from "./fonts";
```

- [ ] **Step 2: Amber mouse glow**

In `src/component/MouseHoverEffect.jsx` replace line 16 with:

```js
          // amber-300 at 6%: warm and dim, the one accent the page already uses
          el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(252, 211, 77, 0.06), transparent 40%)`;
```

- [ ] **Step 3: Amber scroll progress**

In `src/component/ScrollProgress.jsx` replace the `className` on line 17 with:

```jsx
      className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-amber-300/70 z-50"
```

- [ ] **Step 4: Case study uses the shared `Reveal`, loses the gradient, gets its own CTA copy**

In `src/component/CaseStudyView.jsx`:

Replace lines 1-29 (imports through the local `Reveal`) with:

```jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
  FiGithub,
  FiCheck,
} from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import SharedReveal from "@/component/motion/Reveal";

// Case-study sections are <div>s inside the <main>; the shared wrapper
// defaults to <section>.
const Reveal = ({ children, className = "" }) => (
  <SharedReveal as="div" y={24} className={className}>
    {children}
  </SharedReveal>
);
```

Replace the CTA block (from `{/* CTA */}` to the closing `</Reveal>` before `</main>`) with:

```jsx
      {/* CTA - its own wording, not the contact page intro repeated */}
      <Reveal>
        <div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-8 text-center">
          <h2
            className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}
          >
            Have a similar project in mind?
          </h2>
          <p
            className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-6`}
          >
            Tell me what you&apos;re replacing or building, and I&apos;ll tell
            you what it would take.
          </p>
          <Link
            href="/contact"
            className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}
          >
            Let&apos;s talk
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>
```

- [ ] **Step 5: Cursor blink keyframe (used by Task 4)**

Append to `src/app/globals.css`:

```css

/* Block cursor after the cycling hero phrase. steps(1) gives a hard blink,
   not a fade. */
@keyframes cursor-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.cursor-blink {
  animation: cursor-blink 1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .cursor-blink {
    animation: none;
  }
}
```

- [ ] **Step 6: Lint, build, and check the greps**

Run: `npm run lint && npm run build`
Expected: exit 0.

Run: `grep -rn "violet-" src/`
Expected: only `src/component/AboutMeSection.jsx` (removed in Task 5).

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.js src/app/globals.css src/component/MouseHoverEffect.jsx src/component/ScrollProgress.jsx src/component/CaseStudyView.jsx
git commit -m "refactor: align header, main, and footer in one column; retire the blue accent"
```

---

### Task 3: Data changes (experience metrics, canonical stack names, hero phrases)

**Files:**
- Modify: `src/data/experience.js`
- Modify: `src/data/projects.js:47,91`
- Modify: `src/data/stackdata.js`
- Create: `src/data/hero.js`

**Interfaces:**
- Produces: `experience[0].usageLabel: string`, `experience[0].metrics: Array<{ before?: string, after: string, count?: { from: number, to: number, format: (v: number) => string }, label: string, sentence: string }>`; `experience[i].tech` holds single tool names.
- Produces: `heroPhrases: string[]` (named export from `src/data/hero.js`).
- Produces: project `stack` arrays use the exact names in `stackdata.js`.

- [ ] **Step 1: Rewrite `src/data/experience.js`**

```js
// Work experience entries - most recent first.
// `type` renders as a small mono tag, e.g. "Full-time" | "Internship" | "Freelance".
// A green "current" pulse shows automatically when `dates` ends in "Present".
// `location`, `description`, and `tech` are all optional per entry.
//
// `usageLabel` is how the stack section names this job when a tool is hovered
// ("used in: AI video platform"); entries without one are left out of that
// lookup. `tech` must use the exact names from src/data/stackdata.js.
//
// `metrics` (current role only) feed the proof block in the About section.
// Each entry: `before`/`after` are the displayed strings; `count` animates the
// `after` figure from `from` to `to` and formats it (omit `count` for a figure
// that is not a number, like "<1 frame"); `sentence` is what screen readers
// get. Only verifiable numbers belong here.
export const experience = [
  {
    type: "Full-time",
    title: "Full Stack Developer",
    company: "Interactive Content Digital s.r.o.",
    usageLabel: "AI video platform",
    dates: "June 2026 - Present",
    location: "Remote",
    description:
      "I build and maintain an AI video platform that turns a script into a 1080p narrated video with a lip-synced avatar. I own the pipeline's quality guards (LLM vision checks, checkpoint resume, pre-spend cost guards, a zero-cost CI suite) and the SaaS layer around it: a Next.js console, Supabase Auth with RLS, role-based team seats, a Stripe-backed credit ledger, an admin dashboard, and a Dockerized deploy.",
    metrics: [
      {
        before: "93%",
        after: "3%",
        count: { from: 93, to: 3, format: (v) => `${Math.round(v)}%` },
        label: "false quality flags on generated clips",
        sentence:
          "False quality flags on generated clips cut from 93% to 3%",
      },
      {
        before: "~430 ms",
        after: "<1 frame",
        label: "audio/video drift",
        sentence:
          "Audio and video drift cut from about 430 milliseconds to under one frame",
      },
      {
        after: "70+",
        count: { from: 0, to: 70, format: (v) => `${Math.round(v)}+` },
        label: "zero-cost CI gates",
        sentence: "More than 70 zero-cost CI gates",
      },
      {
        after: "$0.70",
        count: { from: 0, to: 0.7, format: (v) => `$${v.toFixed(2)}` },
        label: "per output minute, end to end",
        sentence: "About 70 cents per output minute, end to end",
      },
    ],
    tech: [
      "Node.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "FFmpeg",
      "BullMQ",
      "Redis",
      "Supabase",
      "Stripe",
      "Docker",
    ],
  },
  {
    type: "Full-time",
    title: "Graphic Designer",
    company: "MicroPets",
    dates: "June 2024 - Jan 2025",
    location: "General Santos City",
    description:
      "Promotional graphics for MicroPets' marketing campaigns: social posts, banners, and launch visuals. It's also why projects with me don't need a second hire for mockups and launch assets.",
    tech: ["Photoshop", "Canva"],
  },
];
```

- [ ] **Step 2: Canonical stack names in `src/data/projects.js`**

Line 47 becomes:

```js
    stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
```

Line 91 becomes:

```js
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "shadcn/ui", "Framer Motion"],
```

Also update the header comment (line 2) to read:

```js
// Card fields: name, summary, stack (exact names from src/data/stackdata.js),
//   image, gradientStyle, live, github
```

- [ ] **Step 3: Add Framer Motion to `src/data/stackdata.js`**

Add `SiFramer` to the `react-icons/si` import list, and add this item after `shadcn/ui` in the Frontend group:

```js
      { icon: SiFramer, name: "Framer Motion" },
```

- [ ] **Step 4: Create `src/data/hero.js`**

```js
// The amber line in the hero headline: "I turn <phrase> into working software."
// Rendered by RequirementCycler. [0] is the canonical headline: it is what
// crawlers, the OG image copy, and reduced-motion visitors see, so change it
// deliberately. Every phrase is real client-speak for something on this site
// (StaffTrackr, QuizyLite, the day job) and must fit on two lines at 360px.
export const heroPhrases = [
  "we need a system for this",
  "payroll is still in a spreadsheet",
  "can it turn a PDF into flashcards?",
  "the audio is 430 ms out of sync",
];
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: exit 0. (The Experience section still renders `description` and `tech`; the About card reads `availability.currentlyBuilding`, untouched until Task 5.)

- [ ] **Step 6: Commit**

```bash
git add src/data/experience.js src/data/projects.js src/data/stackdata.js src/data/hero.js
git commit -m "feat: add role metrics, usage labels, hero phrases; canonicalise stack names"
```

---

### Task 4: Hero - four rows and the requirement cycler

**Files:**
- Create: `src/component/RequirementCycler.jsx`
- Modify: `src/component/HeroSection.jsx` (full rewrite)

**Interfaces:**
- Consumes: `heroPhrases` (Task 3), `.cursor-blink` (Task 2).
- Produces: `RequirementCycler({ phrases: string[], className?: string })` default export.

- [ ] **Step 1: Create `RequirementCycler`**

```jsx
// src/component/RequirementCycler.jsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTERVAL_MS = 3500;

// The quoted line inside the hero h1. phrases[0] is rendered on the server so
// the canonical headline is in the initial HTML; the rest cycle after mount.
//
// Layout: every phrase is drawn invisibly in the same grid cell as the live
// one, so the block is always as tall as the longest phrase and a wrapping
// phrase on a phone never shifts the lines around it.
const Cursor = () => (
  <span
    aria-hidden="true"
    className="cursor-blink inline-block w-[0.5ch] h-[0.85em] bg-amber-300 ml-1 align-[-0.1em]"
  />
);

const RequirementCycler = ({ phrases, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || phrases.length < 2) return undefined;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion, phrases.length]);

  const phrase = phrases[index];

  return (
    <span className={`grid ${className}`}>
      {phrases.map((p) => (
        <span
          key={p}
          aria-hidden="true"
          className="[grid-area:1/1] invisible"
        >
          {`"${p}"`}
          <Cursor />
        </span>
      ))}
      <span className="[grid-area:1/1]" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phrase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="block"
          >
            {`"${phrase}"`}
            {!prefersReducedMotion && <Cursor />}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

export default RequirementCycler;
```

- [ ] **Step 2: Rewrite `src/component/HeroSection.jsx`**

```jsx
import Link from "next/link";
import { FiGithub, FiLinkedin, FiArrowRight } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import { heroPhrases } from "@/data/hero";
import { email, github, linkedin } from "@/lib/site";
import RequirementCycler from "@/component/RequirementCycler";

// Server component on purpose: the name and the canonical headline land in the
// initial HTML. The cycling quote is the only client island. Four rows, each
// with one job: headline, who/what, status, action.
const HeroSection = () => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-24">
      <h1
        className={`${inter.className} text-4xl font-extrabold md:text-5xl flex flex-col gap-1 leading-tight text-gray-100 mb-6`}
        aria-label={`I turn "${heroPhrases[0]}" into working software.`}
      >
        <span>I turn</span>
        <RequirementCycler
          phrases={heroPhrases}
          className={`${jetbrainsMono.className} font-semibold text-amber-300 text-3xl md:text-4xl`}
        />
        <span>into working software.</span>
      </h1>

      <p className={`${inter.className} mb-6 max-w-xl leading-relaxed`}>
        I&apos;m <span className="text-gray-100">Justine Jude Cuevas</span>, a
        full-stack developer in the Philippines. I build the software small
        teams run on: payroll that checks itself before payday, a study tool
        that turns PDF highlights into recall cards, video pipelines that catch
        their own mistakes.
      </p>

      <div className="mb-6">
        {availability.open ? (
          <div className="flex items-center bg-green-600/20 rounded-2xl py-1 px-3 gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span
              className={`${inter.className} text-green-600 font-bold text-sm`}
            >
              {availability.note}
            </span>
          </div>
        ) : (
          <div className="flex items-center bg-neutral-700/30 rounded-2xl py-1 px-3">
            <span
              className={`${inter.className} text-neutral-400 font-bold text-sm`}
            >
              Currently booked
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href={availability.ctaHref}
          className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}
        >
          {availability.ctaLabel}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href={`mailto:${email}`}
          className={`${inter.className} text-sm text-neutral-400 hover:text-neutral-100 underline underline-offset-4 decoration-neutral-700 transition-colors`}
        >
          or email me
        </a>
        <span className="hidden sm:block h-4 w-px bg-neutral-800" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <FiGithub className="text-xl text-neutral-500 hover:text-gray-100 transition-colors" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <FiLinkedin className="text-xl text-neutral-500 hover:text-gray-100 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: exit 0.

- [ ] **Step 4: Check the server HTML carries the canonical headline**

Run (bash):

```bash
npm run build && (npm run start -- --port 3222 > /dev/null 2>&1 &) && sleep 4 \
  && curl -s http://localhost:3222/ | grep -o 'we need a system for this' | head -1; \
  npx --yes kill-port 3222 > /dev/null 2>&1 || true
```

Expected: `we need a system for this` is printed once (it is in the SSR HTML, not only after hydration). If `kill-port` is unavailable, stop the server with `Stop-Process` on the node process listening on 3222.

- [ ] **Step 5: Commit**

```bash
git add src/component/RequirementCycler.jsx src/component/HeroSection.jsx
git commit -m "feat: collapse the hero to four rows and cycle the requirement line"
```

---

### Task 5: About - copy rewrite and the proof block

**Files:**
- Create: `src/component/ProofBlock.jsx`
- Modify: `src/component/AboutMeSection.jsx` (full rewrite)
- Modify: `src/data/availability.js` (remove `currentlyBuilding`, document `hours`)

**Interfaces:**
- Consumes: `useCountUp`, `Reveal`, `SectionHeading` (Task 1); `experience[0].metrics/usageLabel/dates` (Task 3); `staggerContainer`, `fadeInUp` from `src/lib/animations.js`.
- Produces: `availability.hours` may be `{ start: number, end: number }` (Manila, 24h) or absent - read by Task 10.

- [ ] **Step 1: Create `ProofBlock`**

```jsx
// src/component/ProofBlock.jsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { experience } from "@/data/experience";
import { useCountUp } from "@/lib/useCountUp";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const role = experience[0];
const since = role.dates.split(" - ")[0];
const container = staggerContainer(0.12);
const row = fadeInUp(10, 0.4);

// One metric's figure. Metrics with `count` animate their final number once
// the block scrolls into view; the rest are static text.
const Figure = ({ metric, inView }) => {
  const value = useCountUp({
    from: metric.count?.from ?? 0,
    to: metric.count?.to ?? 0,
    inView,
  });
  const after = metric.count ? metric.count.format(value) : metric.after;

  return (
    <span
      aria-hidden="true"
      className={`${jetbrainsMono.className} text-gray-100 text-lg font-semibold whitespace-nowrap`}
    >
      {metric.before && (
        <>
          <span>{metric.before}</span>
          <span className="text-amber-300 mx-1.5">→</span>
        </>
      )}
      {after}
    </span>
  );
};

// Replaces the old code card, which repeated the hero. Same card chrome, but
// the content is the four numbers that make the day job credible, pulled from
// experience[0].metrics so they appear exactly once on the page.
const ProofBlock = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-5"
    >
      <p className={`${jetbrainsMono.className} text-xs text-neutral-500`}>
        {`// day job, in numbers`}
      </p>
      <p className={`${inter.className} text-xs text-neutral-500 mt-1 mb-4`}>
        {role.usageLabel} · since {since}
      </p>

      <ul className="divide-y divide-neutral-800">
        {role.metrics.map((metric) => (
          <motion.li
            key={metric.label}
            variants={row}
            className="py-3 first:pt-0 last:pb-0 flex flex-col gap-0.5"
          >
            <span className="sr-only">{metric.sentence}</span>
            <Figure metric={metric} inView={inView} />
            <span
              aria-hidden="true"
              className={`${inter.className} text-sm text-neutral-400`}
            >
              {metric.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProofBlock;
```

- [ ] **Step 2: Rewrite `src/component/AboutMeSection.jsx`**

```jsx
import { inter } from "@/app/fonts";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import ProofBlock from "@/component/ProofBlock";

// Copy here shares no phrase with the hero (who/what) or Experience (the job
// itself): this is about how the work gets done.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading eyebrow="about" title="About me" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div
          className={`${inter.className} md:col-span-3 text-[#A8ADB2] space-y-4 leading-relaxed`}
        >
          <p>
            Most of my week goes into production software where &quot;works on
            my machine&quot; isn&apos;t good enough: payments, media pipelines,
            and the failures that only show up once real users arrive.
          </p>
          <p>
            That habit carries into client work. We agree on scope before I
            write code, you see a working demo every week, and what ships is
            built to survive real data. If something important in your
            business still runs on a spreadsheet, or an idea needs to become a
            product, tell me about it.
          </p>
        </div>

        <div className="md:col-span-2">
          <ProofBlock />
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
```

- [ ] **Step 3: Clean up `src/data/availability.js`**

```js
// Single source of truth for availability + the primary CTA.
// Edit this file only - the hero badge and every CTA button read from here.
//
// `note`: keep it concrete when you can ("Booking projects for October")
// - a dated note reads more professional than a bare "open to work".
// `ctaHref`: point this at a Cal.com/Calendly link later to turn every
// primary CTA into a booking button in one edit.
// `hours`: optional { start, end } in Manila 24h time. When set, the contact
// page's timezone line adds "online 09:00-21:00 Manila (…your time)". Leave
// it out rather than guess.
export const availability = {
  open: true,
  note: "Open for new projects",
  ctaLabel: "Start a project",
  ctaHref: "/contact",
};
```

- [ ] **Step 4: Lint, build, grep**

Run: `npm run lint && npm run build`
Expected: exit 0.

Run: `grep -rn "currentlyBuilding\|violet-\|emerald-\|blue-" src/`
Expected: matches only in `src/component/ProjectSection.jsx` and `src/app/projects/ProjectsView.jsx` (`border-blue-500/20`, removed in Task 9).

- [ ] **Step 5: Commit**

```bash
git add src/component/ProofBlock.jsx src/component/AboutMeSection.jsx src/data/availability.js
git commit -m "feat: replace the About code card with a proof block that counts up"
```

---

### Task 6: Experience - self-drawing rail and type tag

**Files:**
- Modify: `src/component/ExperienceSection.jsx` (full rewrite)

**Interfaces:**
- Consumes: `Reveal`, `SectionHeading` (Task 1); `experience[i].type` (Task 3).

- [ ] **Step 1: Rewrite `src/component/ExperienceSection.jsx`**

```jsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { experience } from "@/data/experience";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Where an entry's dot sits as a fraction of the rail, re-measured on resize,
// so the dot can light up the moment the drawn rail reaches it.
const useRailThreshold = (entryRef, railRef) => {
  const [threshold, setThreshold] = useState(1);

  useEffect(() => {
    const measure = () => {
      const rail = railRef.current;
      const entry = entryRef.current;
      if (!rail || !entry) return;
      // The dot is drawn 6px below the entry's top edge.
      setThreshold((entry.offsetTop + 6) / rail.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [entryRef, railRef]);

  return threshold;
};

const Entry = ({ job, railRef, progress }) => {
  const ref = useRef(null);
  const threshold = useRailThreshold(ref, railRef);
  const isCurrent = /present/i.test(job.dates);
  const lit = progress >= threshold;

  return (
    <div ref={ref} className="relative pl-8">
      {/* Timeline dot: pulses green for the current role, otherwise turns
          amber as the rail is drawn past it. */}
      {isCurrent ? (
        <span
          className="absolute left-0 top-1.5 flex h-[11px] w-[11px]"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-green-500" />
        </span>
      ) : (
        <span
          className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-neutral-900 transition-colors duration-300 motion-reduce:bg-neutral-600 ${
            lit ? "bg-amber-300" : "bg-neutral-600"
          }`}
          aria-hidden="true"
        />
      )}

      {job.type && (
        <p
          className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 mb-1`}
        >
          {job.type}
        </p>
      )}

      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className={`${inter.className} text-gray-100 font-semibold`}>
          {job.title}
          <span className="text-neutral-400 font-normal"> · {job.company}</span>
        </h3>
        <span
          className={`${inter.className} text-xs text-neutral-500 whitespace-nowrap`}
        >
          {job.dates}
        </span>
      </div>

      {job.location && (
        <p className={`${inter.className} text-xs text-neutral-500 mt-1`}>
          {job.location}
        </p>
      )}

      {job.description && (
        <p
          className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-2`}
        >
          {job.description}
        </p>
      )}

      {job.tech?.length > 0 && (
        <p className={`${inter.className} text-xs text-neutral-500 mt-3`}>
          {job.tech.join("  ·  ")}
        </p>
      )}
    </div>
  );
};

const ExperienceSection = () => {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // The amber rail draws from the top as the list scrolls through the
  // viewport; a spring keeps it from snapping between scroll events.
  // Reduced motion is handled in CSS (motion-reduce:*), never by branching
  // the markup: useReducedMotion() is null on the server and resolved on the
  // first client render, which would be a hydration mismatch.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  useMotionValueEvent(scaleY, "change", (v) => setProgress(v));

  return (
    <Reveal className="mb-16">
      <SectionHeading eyebrow="experience" title="Work experience" />

      <div ref={railRef} className="relative">
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px bg-neutral-800"
          aria-hidden="true"
        />
        <motion.div
          style={{ scaleY }}
          className="absolute left-[5px] top-2 bottom-2 w-px bg-amber-300/70 origin-top motion-reduce:hidden"
          aria-hidden="true"
        />

        <div className="space-y-10">
          {experience.map((job) => (
            <Entry
              key={`${job.company}-${job.title}-${job.dates}`}
              job={job}
              railRef={railRef}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default ExperienceSection;
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/component/ExperienceSection.jsx
git commit -m "feat: draw the experience rail on scroll and render the role type tag"
```

---

### Task 7: Hackathons and Testimonials headings

**Files:**
- Modify: `src/component/HackathonSection.jsx`
- Modify: `src/component/TestimonialsSection.jsx`

**Interfaces:**
- Consumes: `Reveal`, `SectionHeading` (Task 1).

- [ ] **Step 1: Rewrite `src/component/HackathonSection.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { hackathons } from "@/data/hackathons";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

const container = staggerContainer(0.1);
const rowVariant = fadeInUp(16, 0.45);

// Deliberately not the timeline used by Work Experience: these are not a
// career sequence and have no meaningful order, so they read as a ledger of
// results instead. The tag column carries the one fact worth scanning.
const HackathonSection = () => {
  return (
    <Reveal className="mb-16">
      <SectionHeading
        eyebrow="hackathons"
        title="Hackathons & competitions"
        lede="Where I find out how much of a working product I can get to under a deadline."
      />

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="border-t border-neutral-800 divide-y divide-neutral-800"
      >
        {hackathons.map((item) => (
          <motion.li
            key={item.event}
            variants={rowVariant}
            className="py-5 grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <span
              className={`${jetbrainsMono.className} uppercase tracking-wider pt-0.5 ${
                item.highlight
                  ? "text-xs font-semibold text-amber-300"
                  : "text-[11px] text-neutral-500"
              }`}
            >
              {item.tag}
            </span>

            <div>
              <h3 className={`${inter.className} text-gray-100 font-medium`}>
                {item.event}
                <span className="text-neutral-500 font-normal"> · {item.org}</span>
              </h3>
              <p
                className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-1.5`}
              >
                {item.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </Reveal>
  );
};

export default HackathonSection;
```

- [ ] **Step 2: Rewrite `src/component/TestimonialsSection.jsx`**

```jsx
import { inter } from "@/app/fonts";
import { testimonials } from "@/data/testimonials";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Renders nothing until src/data/testimonials.js has at least one real
// quote - then a single featured quote appears here. No grids of empty
// slots, no carousel of one.
const TestimonialsSection = () => {
  if (!testimonials.length) return null;

  const featured = testimonials[0];

  return (
    <Reveal className="mb-16">
      <SectionHeading eyebrow="testimonials" title="What clients say" />

      <figure className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-6">
        <blockquote
          className={`${inter.className} text-gray-100 text-lg leading-relaxed`}
        >
          &ldquo;{featured.quote}&rdquo;
        </blockquote>
        <figcaption
          className={`${inter.className} text-sm text-neutral-400 mt-4`}
        >
          <span className="text-neutral-200 font-medium">{featured.name}</span>
          {featured.role && <>, {featured.role}</>}
          {featured.href && featured.source && (
            <>
              {" · "}
              <a
                href={featured.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-neutral-700 hover:text-neutral-100 transition-colors"
              >
                via {featured.source}
              </a>
            </>
          )}
        </figcaption>
      </figure>
    </Reveal>
  );
};

export default TestimonialsSection;
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/component/HackathonSection.jsx src/component/TestimonialsSection.jsx
git commit -m "refactor: hackathons and testimonials use the shared heading and reveal"
```

---

### Task 8: Stack - compact rows with cross-highlight (tested helper)

**Files:**
- Create: `src/lib/stackUsage.js`
- Create: `src/lib/stackUsage.test.mjs`
- Modify: `package.json` (add `test` script)
- Modify: `.github/workflows/ci.yml` (Node 22, lint + test steps)
- Modify: `src/component/TechStackSection.jsx` (full rewrite)

**Interfaces:**
- Consumes: `projects[].stack`, `experience[].tech/usageLabel` (Task 3); `Reveal`, `SectionHeading` (Task 1).
- Produces: `buildStackUsage({ projects, experience }): Map<string, string[]>`, `sharesContext(usage, a, b): boolean` (named exports).

- [ ] **Step 1: Write the failing test**

```js
// src/lib/stackUsage.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStackUsage, sharesContext } from "./stackUsage.js";

const projects = [
  { name: "StaffTrackr", stack: ["Next.js", "Supabase"] },
  { name: "QuizyLite", stack: ["Next.js", "MongoDB"] },
];
const experience = [
  { usageLabel: "AI video platform", tech: ["Supabase", "FFmpeg"] },
  { tech: ["Photoshop"] },
];

test("maps each tool to the projects and jobs that use it, in data order", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.deepEqual(usage.get("Next.js"), ["StaffTrackr", "QuizyLite"]);
  assert.deepEqual(usage.get("Supabase"), ["StaffTrackr", "AI video platform"]);
  assert.deepEqual(usage.get("FFmpeg"), ["AI video platform"]);
});

test("skips jobs without a usageLabel and tools nobody uses", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.equal(usage.has("Photoshop"), false);
  assert.equal(usage.has("Firebase"), false);
});

test("does not repeat a context when a tool appears twice in it", () => {
  const usage = buildStackUsage({
    projects: [{ name: "Twice", stack: ["Zod", "Zod"] }],
    experience: [],
  });
  assert.deepEqual(usage.get("Zod"), ["Twice"]);
});

test("sharesContext is true only when two tools overlap somewhere", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.equal(sharesContext(usage, "Next.js", "MongoDB"), true);
  assert.equal(sharesContext(usage, "MongoDB", "FFmpeg"), false);
  assert.equal(sharesContext(usage, "Next.js", "Firebase"), false);
});
```

- [ ] **Step 2: Add the test script and run it to see it fail**

In `package.json` scripts add:

```json
    "test": "node --test \"src/**/*.test.mjs\""
```

(Node expands the glob itself, so this works from PowerShell and cmd as well as bash, and it never scans `.next/`.)

Run: `npm test`
Expected: FAIL - `Cannot find module '…/src/lib/stackUsage.js'`.

- [ ] **Step 3: Implement `src/lib/stackUsage.js`**

```js
// Pure helpers behind the stack section's cross-highlight. Data comes in as
// arguments (not imported) so this is testable with `node --test` and fixture
// data. Tool names must match exactly across src/data/*.js.

// tool name -> ordered, de-duplicated list of contexts: project names first,
// then jobs that declare a `usageLabel`.
export function buildStackUsage({ projects = [], experience = [] }) {
  const usage = new Map();

  const add = (tool, context) => {
    const contexts = usage.get(tool) ?? [];
    if (!contexts.includes(context)) contexts.push(context);
    usage.set(tool, contexts);
  };

  for (const project of projects) {
    for (const tool of project.stack ?? []) add(tool, project.name);
  }
  for (const job of experience) {
    if (!job.usageLabel) continue;
    for (const tool of job.tech ?? []) add(tool, job.usageLabel);
  }

  return usage;
}

export function sharesContext(usage, a, b) {
  const contextsA = usage.get(a) ?? [];
  const contextsB = usage.get(b) ?? [];
  return contextsA.some((context) => contextsB.includes(context));
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: `# pass 4`, `# fail 0`.

- [ ] **Step 5: CI runs lint and tests on Node 22**

Replace the `steps` in `.github/workflows/ci.yml` with:

```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_WEB3FORMS_KEY: ${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}
```

- [ ] **Step 6: Rewrite `src/component/TechStackSection.jsx`**

```jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { stackGroups } from "@/data/stackdata";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { buildStackUsage, sharesContext } from "@/lib/stackUsage";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

const usage = buildStackUsage({ projects, experience });

const DEFAULT_CAPTION =
  "Everything here is in something I've shipped. Hover a tool to see where.";

// The caption under the heading doubles as the section lede and as the
// answer to "where did you use this?". Swapped with a short fade so it never
// jumps.
const Caption = ({ active }) => {
  const contexts = active ? (usage.get(active) ?? []) : [];

  let text = DEFAULT_CAPTION;
  if (active && contexts.length) {
    text = (
      <>
        used in:{" "}
        <span className="text-amber-300">{contexts.join(" · ")}</span>
      </>
    );
  } else if (active) {
    text = "used in: work without a public write-up yet";
  }

  return (
    <span aria-live="polite" className="block min-h-[1.5em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ?? "default"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`${active ? jetbrainsMono.className : inter.className} block`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Thirty tools in plain rows instead of thirty bordered chips. Hover, focus,
// or tap a tool and everything that was never shipped alongside it dims,
// which turns the list into a claim the visitor can check.
const TechStackSection = () => {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  // Touch has no hover: a tap toggles a tool; a tap outside the section or
  // Escape clears it.
  useEffect(() => {
    if (!active) return undefined;
    const onPointerDown = (e) => {
      if (!sectionRef.current?.contains(e.target)) setActive(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const activeHasUsage = active ? (usage.get(active) ?? []).length > 0 : false;

  return (
    <Reveal className="mb-16">
      <div ref={sectionRef}>
        <SectionHeading
          eyebrow="stack"
          title="Tech stack"
          lede={<Caption active={active} />}
        />

        <div className="space-y-4">
          {stackGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-y-2 sm:grid-cols-[9rem_1fr] sm:gap-x-6"
            >
              <p
                className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 pt-1`}
              >
                {group.label}
              </p>

              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {group.items.map(({ icon: Icon, name }) => {
                  const isActive = active === name;
                  const dim =
                    active &&
                    activeHasUsage &&
                    !isActive &&
                    !sharesContext(usage, active, name);

                  return (
                    <li key={name}>
                      <button
                        type="button"
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") setActive(name);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") setActive(null);
                        }}
                        onPointerDown={(e) => {
                          if (e.pointerType !== "mouse") {
                            setActive((current) => (current === name ? null : name));
                          }
                        }}
                        onFocus={() => setActive(name)}
                        onBlur={() => setActive(null)}
                        className={`${inter.className} inline-flex items-center gap-1.5 text-sm cursor-default rounded-sm transition-[color,opacity] duration-200 focus-visible:outline-1 focus-visible:outline-neutral-500 ${
                          isActive
                            ? "text-amber-300"
                            : "text-neutral-300 hover:text-gray-100"
                        } ${dim ? "opacity-40" : "opacity-100"}`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default TechStackSection;
```

- [ ] **Step 7: Lint, test, build**

Run: `npm run lint && npm test && npm run build`
Expected: all exit 0; `# pass 4`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/stackUsage.js src/lib/stackUsage.test.mjs package.json .github/workflows/ci.yml src/component/TechStackSection.jsx
git commit -m "feat: compact tech stack rows with a tested stack-to-work cross-highlight"
```

---

### Task 9: One `ProjectCard` for home and `/projects`

**Files:**
- Create: `src/component/ProjectCard.jsx`
- Modify: `src/component/ProjectSection.jsx` (full rewrite)
- Modify: `src/app/projects/ProjectsView.jsx` (full rewrite)

**Interfaces:**
- Consumes: `SectionHeading` (Task 1); `staggerContainer`, `fadeInUp`.
- Produces: `ProjectCard({ project, variants? })` default export.

- [ ] **Step 1: Create `ProjectCard`**

```jsx
// src/component/ProjectCard.jsx
"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { inter } from "@/app/fonts";

// The one project card, used by the home page and /projects. Case study is
// the primary action; live demo and code are secondary.
const ProjectCard = ({ project, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-white/[0.12] bg-[#111113] overflow-hidden transition-colors duration-300"
    >
      {project.image ? (
        <div className="relative h-44 overflow-hidden border-b border-white/[0.04]">
          <Image
            src={project.image}
            alt={`${project.name} landing page`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-40" />
        </div>
      ) : (
        <div
          className="h-44 relative overflow-hidden border-b border-white/[0.04]"
          style={{ background: project.gradientStyle }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.04,
            }}
          />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />
        </div>
      )}

      <div className="p-5">
        <h3
          className={`${inter.className} text-lg font-semibold text-neutral-100 mb-2`}
        >
          {project.name}
        </h3>

        <p
          className={`${inter.className} text-sm text-neutral-400 leading-relaxed mb-4`}
        >
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={`${inter.className} text-xs px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-neutral-400`}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href={`/projects/${project.slug}`}
            className={`${inter.className} group/case inline-flex items-center gap-1.5 text-sm text-neutral-200 hover:text-white transition-colors`}
          >
            Read case study
            <FiArrowRight className="w-3.5 h-3.5 group-hover/case:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
          >
            <FiExternalLink className="w-3.5 h-3.5" />
            Live Demo
          </Link>
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
            >
              <FiGithub className="w-3.5 h-3.5" />
              Code
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
```

- [ ] **Step 2: Rewrite `src/component/ProjectSection.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import ProjectCard from "@/component/ProjectCard";

const featured = projects.slice(0, 2);
const container = staggerContainer(0.15);
const cardVariant = fadeInUp(30, 0.5);

const ProjectSection = () => {
  return (
    <section className="mb-16">
      <Reveal as="div" y={20}>
        <SectionHeading
          eyebrow="selected work"
          title="Selected work"
          lede="Real products with live demos, plus a case study on how each one was scoped, built, and shipped."
          action={
            // Only worth a link when /projects has more than the cards below.
            projects.length > featured.length ? (
              <Link
                href="/projects"
                className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors group/link whitespace-nowrap`}
              >
                View all
                <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            ) : null
          }
        />
      </Reveal>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {featured.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            variants={cardVariant}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectSection;
```

- [ ] **Step 3: Rewrite `src/app/projects/ProjectsView.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ProjectCard from "@/component/ProjectCard";

const container = staggerContainer(0.2, 0.3);
const cardVariant = fadeInUp(30, 0.5);

export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-3xl w-full px-6 pt-8 pb-24 lg:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1
          className={`${inter.className} font-bold text-4xl text-gray-100 mb-3`}
        >
          Projects
        </h1>
        <p
          className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-2xl`}
        >
          Every project here is live. Click the demo, poke around, then read
          the case study for what problem it solves and how it was built.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            variants={cardVariant}
          />
        ))}
      </motion.div>
    </main>
  );
}
```

- [ ] **Step 4: Lint, build, grep**

Run: `npm run lint && npm run build`
Expected: exit 0.

Run: `grep -rn "blue-\|violet-\|emerald-" src/`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/component/ProjectCard.jsx src/component/ProjectSection.jsx src/app/projects/ProjectsView.jsx
git commit -m "refactor: share one ProjectCard between the home page and /projects"
```

---

### Task 10: Contact - live timezone line

**Files:**
- Create: `src/component/TimezoneLine.jsx`
- Modify: `src/app/contact/ContactView.jsx:86-105`

**Interfaces:**
- Consumes: `availability.hours` (optional, Task 5).
- Produces: `TimezoneLine()` default export.

- [ ] **Step 1: Create `TimezoneLine`**

```jsx
// src/component/TimezoneLine.jsx
"use client";

import { useEffect, useState } from "react";
import { jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";

// Asia/Manila has no daylight saving, so a constant is safe.
const MANILA_OFFSET_HOURS = 8;

const clock = (date, timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);

// 9 -> "09:00", 9.5 -> "09:30"
const hhmm = (hours) =>
  `${String(Math.floor(hours)).padStart(2, "0")}:${hours % 1 ? "30" : "00"}`;

// `diff` is Manila minus the visitor, in hours.
const describeOffset = (diff) => {
  if (diff === 0) return "same time zone";
  const abs = Math.abs(diff);
  const n = Number.isInteger(abs) ? abs : abs.toFixed(1);
  return `${n} h ${diff > 0 ? "ahead" : "behind"}`;
};

const onlineWindow = (hours, diff) => {
  const toVisitor = (h) => (((h - diff) % 24) + 24) % 24;
  return `online ${hhmm(hours.start)}-${hhmm(hours.end)} Manila (${hhmm(
    toVisitor(hours.start),
  )}-${hhmm(toVisitor(hours.end))} your time)`;
};

// "Manila 22:14 · your time 16:14 · 6 h ahead", computed for whoever is
// looking. Renders placeholders until mounted so the server HTML and the
// first client render match, then ticks once a minute.
const TimezoneLine = () => {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const manila = now ? clock(now, "Asia/Manila") : "--:--";
  const local = now ? clock(now) : "--:--";
  const diff = now ? MANILA_OFFSET_HOURS + now.getTimezoneOffset() / 60 : null;

  return (
    <p className={`${jetbrainsMono.className} text-xs text-neutral-500`}>
      Manila <span className="text-neutral-300">{manila}</span>
      {" · "}your time <span className="text-neutral-300">{local}</span>
      {diff !== null && <>{" · "}{describeOffset(diff)}</>}
      {diff !== null && availability.hours && (
        <>{" · "}{onlineWindow(availability.hours, diff)}</>
      )}
    </p>
  );
};

export default TimezoneLine;
```

- [ ] **Step 2: Update the contact intro**

In `src/app/contact/ContactView.jsx`, add the import:

```js
import TimezoneLine from "@/component/TimezoneLine";
```

and replace the intro block (from `{/* Intro - indexable copy, not just a form */}` through its closing `</motion.div>`) with:

```jsx
      {/* Intro - indexable copy, not just a form. The timezone line replaces
          the old "my mornings overlap with US evenings" sentence with the
          visitor's own numbers. */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${inter.className} mb-10`}
      >
        <h1 className="text-gray-100 text-3xl font-bold mb-3">
          Let&apos;s build something for your business
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl mb-4">
          I&apos;m a freelance full-stack developer in the Philippines, working
          remotely with clients worldwide. Describe your project in a couple of
          sentences and I&apos;ll reply within 24 hours with an honest read on
          scope and cost.
        </p>
        <TimezoneLine />
      </motion.div>
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/component/TimezoneLine.jsx src/app/contact/ContactView.jsx
git commit -m "feat: show Manila and visitor time on the contact page"
```

---

### Task 11: README, memory of the data shape, and the screenshot pass

**Files:**
- Modify: `README.md` (the "data-driven" paragraph)

- [ ] **Step 1: Update README**

Replace the second paragraph of `README.md` with:

```markdown
All content is data-driven: availability status (and optional online hours
for the contact page's timezone line), testimonials, work experience (with
the current role's verifiable `metrics` that feed the About proof block),
tech stack, hero phrases, and project case studies live in `src/data/`. Edit
those files, not the components, to change what the site says. Tool names
must match across `stackdata.js`, `projects.js`, and `experience.js`; the
stack section's cross-highlight looks them up by exact name.
`src/lib/site.js` is the single source for the canonical URL, email, and
social links. `docs/seo-checklist.md` tracks the off-site SEO actions.
```

Also add `- \`npm test\` — run the Node test suite` to the Scripts list.

- [ ] **Step 2: Full verification**

Run: `npm run lint && npm test && npm run build`
Expected: all exit 0.

Run these content checks from the repo root:

```bash
grep -rn "blue-\|violet-\|emerald-" src/            # expect: nothing
grep -rn "currentlyBuilding" src/                   # expect: nothing
grep -c "Philippines" src/component/HeroSection.jsx # expect: 1
grep -rn "AI video platform" src/component/ src/data/experience.js
# expect: only experience.js (description + usageLabel); no component hard-codes it
```

- [ ] **Step 3: Screenshot pass**

Start the dev server (`npm run dev -- --port 3111`) and, in Chrome, check at 1280px and inside a 390px-wide iframe (write a scratch HTML file with `<iframe src="http://localhost:3111/" style="width:390px;height:844px">` and open it):
- Header, hero text, section headings, and footer share one left edge on `/`, `/projects`, `/contact`, `/projects/stafftrackr`.
- Hero: four rows; the amber line cycles; no layout shift when "payroll is still in a spreadsheet" wraps at 390px.
- About: proof block counts 93→3 and 0→70 on scroll-in; no window dots, no gradient.
- Experience: amber rail draws on scroll; the MicroPets dot turns amber once the rail passes it; `FULL-TIME` tags render.
- Stack: rows, not chips; hovering "Supabase" dims tools never shipped with it and shows `used in: StaffTrackr · AI video platform`; Tab reaches each tool; Escape clears.
- Contact: the timezone line shows real times after load.
- Footer sits at the bottom of `/contact` and `/projects`.
- Nothing blue or violet anywhere, including the mouse glow.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: describe the new data fields and test script"
```
