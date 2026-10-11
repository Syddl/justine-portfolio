# Redesign Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Personal About with a better code card, real hackathon placements, three more stack items, project rows and one set of page parts site-wide (no `//` eyebrows), and a macOS-style cursor.

**Architecture:** Mostly component restyling on the existing tokens and `SectionHeading`; one new data field (`kind` on projects) with a data test; the cursor is pure CSS (two SVG data URIs as custom properties, applied in `@layer base`).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, framer-motion 12, react-icons 5.5, node:test.

**Spec:** `docs/superpowers/specs/2026-10-12-redesign-round-2-design.md`

## Global Constraints

- Branch `feat/redesign-feel` (round 1 is already on it, unpushed). Never `git add -A` or `git add .`; stage only the files a task lists.
- Edit source files with the Edit tool (Write for full replacements the plan gives), never sed/perl/node/PowerShell scripted replaces: files may be CRLF. Read a file before editing it and match its exact text.
- No copy changes except the ones this plan spells out (the About text, the two hackathon tags, the /projects intro's last sentence, contact row labels "Email"/"Copy", and the share image's dropped `// `).
- Token classes only (`text-ink`, `text-ink-2`, `text-body`, `text-muted`, `text-faint`, `bg-surface`, `bg-hover`, `border-line`, `border-line-strong`, `divide-line`, `text-accent` ...). No hex colours or `neutral-*`/`gray-*`/`amber-*` in components.
- Column `max-w-col` with `px-6`. Section headings via `SectionHeading` (`title`, optional `lede`, `action`, `className`).
- Reduced motion never changes markup (hydration); JS reads `matchMedia` only inside effects and event handlers.
- No synchronous `setState` inside `useEffect`.
- Every commit message ends with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- A Next.js dev server runs at http://localhost:3000 (Turbopack, hot reload). Do not start another, do not kill it, and do not run `npm run build` while it runs (it shares `.next`); the final task builds after stopping nothing — see Task 7.
- The Chrome extension tab may be hidden (requestAnimationFrame paused): the first-load cover then stays until its 2s CSS failsafe, so wait 2.5s after each load before screenshots, and scroll with `window.scrollTo`.

---

### Task 1: Data: hackathon placements, stack items, project kinds

**Files:**
- Modify: `src/data/hackathons.js`, `src/component/HackathonSection.jsx`, `src/data/stackdata.js`, `src/data/projects.js`, `src/data/data.test.mjs`

**Interfaces:**
- Produces: every project in `src/data/projects.js` has `kind: string` (≤ 24 chars). Task 3 renders it.

- [ ] **Step 1: Write the failing data test**

Append to `src/data/data.test.mjs`:

```js
// The project row shows `kind` on the right ("Personal product"), so every
// project needs a short one.
test("every project has a short kind for its row", () => {
  for (const project of projects) {
    assert.equal(typeof project.kind, "string", `${project.slug} has no kind`);
    assert.ok(project.kind.length > 0 && project.kind.length <= 24, `${project.slug}: "${project.kind}"`);
  }
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`
Expected: FAIL "coopilot has no kind".

- [ ] **Step 3: Add `kind` to both projects in `src/data/projects.js`**

After the line `    slug: "coopilot",` add `    kind: "Thesis · team of 4",`.
After the line `    slug: "quizylite",` add `    kind: "Personal product",`.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Hackathon tags in `src/data/hackathons.js`**

| Old | New |
|---|---|
| `    tag: "Finalist",` | `    tag: "Top 5 finalist",` |
| `    tag: "24h build",` | `    tag: "Top 10 · Mindanao leg",`<br>`    highlight: true,` |

(The second row adds a new `highlight: true,` line directly under the tag.)

- [ ] **Step 6: Widen the tag column in `src/component/HackathonSection.jsx`**

| Old | New |
|---|---|
| `sm:grid-cols-[7.5rem_1fr]` | `sm:grid-cols-[11rem_1fr]` |

- [ ] **Step 7: Stack items in `src/data/stackdata.js`**

1. Imports:
   - add `SiMysql,` to the `react-icons/si` import list (after `SiMongodb,`);
   - change `import { TbBrandReactNative } from "react-icons/tb";` to `import { TbBrandReactNative, TbDatabaseSearch } from "react-icons/tb";`;
   - add a new line after it: `import { PiVectorThree } from "react-icons/pi";`.
2. Comment: replace
   `// Only things used in shipped work belong here. BullMQ and Playwright have no`
   `// brand icon in react-icons, so they borrow a neutral Feather one.`
   with
   `// Only things used in shipped work belong here. BullMQ and Playwright have no`
   `// brand icon in react-icons, so they borrow a neutral Feather one; Embeddings`
   `// and pgvector use generic vector and database-search icons.`
3. In the "AI & agents" items, after `{ icon: SiOpenai, name: "OpenAI API" },` add `{ icon: PiVectorThree, name: "Embeddings" },`.
4. In the "Data & storage" items, after `{ icon: SiPostgresql, name: "PostgreSQL" },` add:
   ```js
      { icon: TbDatabaseSearch, name: "pgvector" },
      { icon: SiMysql, name: "MySQL" },
   ```

- [ ] **Step 8: Lint and test**

Run: `npm run lint`, `npm test`
Expected: both clean.

- [ ] **Step 9: Check in the browser**

On `http://localhost:3000/` (wait 2.5s), confirm the Hackathons section shows "TOP 5 FINALIST" and "TOP 10 · MINDANAO LEG" in green, each on one line at desktop width, and the Tech stack shows Embeddings, pgvector and MySQL with icons. If the browser tools are not connected, use `curl -s http://localhost:3000/` and confirm the strings are in the HTML.

- [ ] **Step 10: Commit**

```bash
git add src/data/hackathons.js src/component/HackathonSection.jsx src/data/stackdata.js src/data/projects.js src/data/data.test.mjs
git commit -m "content: hackathon placements, Embeddings/pgvector/MySQL, project kinds

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: About: personal text, code card under it

**Files:**
- Modify: `src/component/AboutMeSection.jsx` (full replacement), `src/component/DeveloperCard.jsx`, `src/component/motion/TiltCard.jsx`, `src/app/globals.css`

- [ ] **Step 1: Replace `src/component/AboutMeSection.jsx`**

```jsx
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import DeveloperCard from "@/component/DeveloperCard";

// About the person, not the work: where the interest came from, what fills
// the days now, where it is heading. Projects and experience have their own
// sections. The full name is in the first sentence so it is in the server
// HTML for search. The code card sits under the text at full column width:
// side by side, the 640px column squeezed both.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading title="About me" />

      <div className="text-[17px] text-body leading-relaxed space-y-4">
        <p>
          I&apos;m Justine Jude Cuevas. Before I ever wrote code, I was into
          video games and anything tech. My first job was graphic design, and
          on the side I edited videos and made YouTube content.
        </p>
        <p>
          Games are what pulled me in. I got curious about how they, and the
          systems behind everyday apps, actually work, and I fell for it. Code
          meant I could build anything I wanted, and with AI in the loop I can
          build it a lot faster.
        </p>
        <p>
          These days most of my time goes to school and to learning, lately a
          deep dive into AI. I can be lazy about things that don&apos;t grab
          me, but when one does, I lock in until it&apos;s done.
        </p>
        <p>
          Looking ahead, I want to work as an AI engineer, building products
          people actually use. Want to talk shop, or just say hi? The inbox is
          open.
        </p>
      </div>

      <div className="mt-10">
        <DeveloperCard />
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
```

- [ ] **Step 2: Arrays on one line in `src/component/DeveloperCard.jsx`**

1. Replace the comment and helper

```jsx
// Arrays print two items per line, as the original card did, so the block
// never needs to scroll sideways inside its 18rem column.
const rowsOf = (items, size) =>
  items.reduce((rows, item, i) => {
    if (i % size === 0) rows.push([]);
    rows[rows.length - 1].push(item);
    return rows;
  }, []);
```

with

```jsx
// Arrays print on one line. The card spans the 640px column, where the
// longest line fits; on phones the <pre> wraps instead of scrolling, so the
// card never slides sideways under a trackpad.
```

2. Replace the whole `if (Array.isArray(value)) { ... }` block inside `Value` (from `  if (Array.isArray(value)) {` through its closing `  }` before `  if (typeof value === "boolean") {`) with:

```jsx
  if (Array.isArray(value)) {
    return (
      <>
        <Punct>[</Punct>
        {value.map((item, i) => (
          <span key={item}>
            <Str>{item}</Str>
            {i < value.length - 1 && <Punct>, </Punct>}
          </span>
        ))}
        <Punct>]</Punct>
      </>
    );
  }
```

3. In the `<pre>` className, replace `font-mono text-xs leading-relaxed overflow-x-auto` with `font-mono text-xs leading-relaxed whitespace-pre-wrap sm:whitespace-pre`.

- [ ] **Step 3: Subtler tilt in `src/component/motion/TiltCard.jsx`**

| Old | New |
|---|---|
| `const MAX_TILT = 9;` | `const MAX_TILT = 3;` |

- [ ] **Step 4: Float without rotation in `src/app/globals.css`**

Replace the `@keyframes float-card` block

```css
@keyframes float-card {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(-0.5deg);
  }
}
```

with

```css
@keyframes float-card {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
```

- [ ] **Step 5: Lint and test**

Run: `npm run lint`, `npm test`
Expected: clean.

- [ ] **Step 6: Check the card in the browser**

On `http://localhost:3000/` (wait 2.5s), scroll the About section into view and run:

```js
const pre = document.querySelector(".float-card pre");
({ client: pre.clientWidth, scroll: pre.scrollWidth, white: getComputedStyle(pre).whiteSpace })
```

Expected at desktop width: `scroll <= client`, `white` is `"pre"`. Resize the window to its minimum width and run it again: `scroll <= client`, `white` is `"pre-wrap"`. Screenshot the About section in light and dark (`document.documentElement.dataset.theme`).

- [ ] **Step 7: Commit**

```bash
git add src/component/AboutMeSection.jsx src/component/DeveloperCard.jsx src/component/motion/TiltCard.jsx src/app/globals.css
git commit -m "feat: personal About text with the code card below it

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Project rows and the /projects page

**Files:**
- Modify: `src/component/ProjectCard.jsx` (full replacement), `src/app/projects/ProjectsView.jsx` (full replacement)

**Interfaces:**
- Consumes: `project.kind` (Task 1), `SectionHeading`.
- Produces: `ProjectCard({ project, variants, headingLevel = "h3" })` renders one link row; `ProjectSection.jsx` (home) keeps using it unchanged inside its `divide-y divide-line` list.

- [ ] **Step 1: Replace `src/component/ProjectCard.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// One project as a single link row, used by the home page and /projects: a
// small cover, the name and summary, and the project's kind on the right
// (under the summary on phones). The whole row opens the case study; the
// live demo and code links live there.
// headingLevel: "h3" under a section h2.
const ProjectCard = ({ project, variants, headingLevel = "h3" }) => {
  const Heading = headingLevel;

  return (
    <motion.div variants={variants}>
      <Link
        href={`/projects/${project.slug}`}
        className="group -mx-3 flex items-center gap-4 rounded-card px-3 py-4 transition-colors duration-150 hover:bg-hover"
      >
        <div
          className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-hover"
          style={project.image ? undefined : { background: project.gradientStyle }}
        >
          {project.image && (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Heading className="font-medium text-ink">{project.name}</Heading>
          <p className="text-sm leading-snug text-muted">{project.summary}</p>
          <p className="mt-1 text-xs text-muted sm:hidden">{project.kind}</p>
        </div>

        <span className="hidden shrink-0 text-sm text-muted sm:block">
          {project.kind}
        </span>
        <FiArrowRight
          className="size-4 shrink-0 text-faint transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
```

- [ ] **Step 2: Replace `src/app/projects/ProjectsView.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ProjectCard from "@/component/ProjectCard";
import SectionHeading from "@/component/SectionHeading";

const container = staggerContainer(0.08, 0.2);
const rowVariant = fadeInUp(14, 0.5);

// The same parts as every other page: a back link, the headline, one intro
// line, then a labelled list of project rows with the count on the right.
export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <FiArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Home
        </Link>
        <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
          Projects
        </h1>
        <p className="text-body text-[15px] leading-relaxed max-w-xl">
          Each case study covers the problem, what I built and how it went.
          Where a project is live, the demo link is in its case study.
        </p>
      </motion.div>

      <SectionHeading
        title="Selected work"
        className="mb-2"
        action={
          <span className="font-mono text-sm text-muted">
            {String(projects.length).padStart(2, "0")}
          </span>
        }
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="divide-y divide-line"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variants={rowVariant} />
        ))}
      </motion.div>
    </main>
  );
}
```

- [ ] **Step 3: Lint and test**

Run: `npm run lint`, `npm test`
Expected: clean.

- [ ] **Step 4: Check in the browser**

Screenshot `http://localhost:3000/projects` and the home page's Selected work section, light and dark (wait 2.5s after load). Expected: compact rows (thumbnail, name, summary, kind on the right, arrow), the whole row is one link (`document.querySelectorAll('main a[href^="/projects/"]').length` equals the number of projects on /projects), "Selected work · 02" label on /projects.

- [ ] **Step 5: Commit**

```bash
git add src/component/ProjectCard.jsx src/app/projects/ProjectsView.jsx
git commit -m "feat: project rows and a /projects page in the shared layout

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Case study, 404 and share image without boxes or `//`

**Files:**
- Modify: `src/component/CaseStudyView.jsx` (full replacement), `src/app/not-found.js`, `src/app/opengraph-image.js`

- [ ] **Step 1: Replace `src/component/CaseStudyView.jsx`**

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
import SharedReveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Case-study sections are <div>s inside the <main>; the shared wrapper
// defaults to <section>.
const Reveal = ({ children, className = "" }) => (
  <SharedReveal as="div" className={className}>
    {children}
  </SharedReveal>
);

// Built from the site's shared parts: a page header, sections under small
// labels with a hairline, label/value rows and plain numbers instead of
// boxed cards, and one pill for the call to action.
export default function CaseStudyView({ project }) {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12 text-body text-[17px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/projects"
          className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          All projects
        </Link>

        <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
          {project.name}
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-10">
          {project.tagline}
        </p>

        {/* Meta: label/value rows between hairlines */}
        <dl className="mb-12 border-t border-line">
          {[
            ["Role", project.role],
            ["Timeline", project.timeline],
            ["Stack", project.stack.join(" · ")],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-1 border-b border-line py-3 sm:grid-cols-[7rem_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted pt-0.5">
                {label}
              </dt>
              <dd className="text-sm text-ink-2">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* Results - only when real, verifiable numbers exist */}
      {project.results?.length > 0 && (
        <Reveal className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-14">
          {project.results.map((result) => (
            <div key={result.label}>
              <p className="text-[2rem] font-medium tracking-[-0.02em] leading-none text-ink">
                {result.metric}
              </p>
              <p className="text-sm text-muted mt-2">{result.label}</p>
            </div>
          ))}
        </Reveal>
      )}

      <Reveal className="mb-12">
        <SectionHeading title="The problem" />
        <p className="leading-relaxed">{project.problem}</p>
      </Reveal>

      <Reveal className="mb-12">
        <SectionHeading title="What I built" />
        <div className="space-y-4 leading-relaxed">
          {project.solution.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {/* Screenshots */}
      {project.screenshots?.length > 0 && (
        <Reveal className="mb-12 space-y-6">
          {project.screenshots.map((shot) => (
            <figure key={shot.src}>
              <div className="relative aspect-[16/9] rounded-card border border-line overflow-hidden">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 688px) 100vw, 640px"
                  className="object-cover object-top"
                />
              </div>
              {shot.caption && (
                <figcaption className="text-xs text-muted mt-2">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </Reveal>
      )}

      <Reveal className="mb-12">
        <SectionHeading title="How it went" />
        <ul className="space-y-3">
          {project.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-3">
              <FiCheck
                className="w-4 h-4 text-accent mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Tech notes - for the occasional technical evaluator */}
      <Reveal className="mb-14">
        <SectionHeading title="Tech notes" />
        <p className="text-sm text-body leading-relaxed">{project.techNotes}</p>
        <div className="flex items-center gap-4 mt-4">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5" />
              Code
            </a>
          )}
        </div>
      </Reveal>

      {/* CTA - its own wording, not the contact page intro repeated */}
      <Reveal>
        <div className="border-t border-line pt-10">
          <h2 className="text-ink text-xl font-semibold mb-2">
            Have a similar project in mind?
          </h2>
          <p className="text-body text-sm leading-relaxed max-w-md mb-6">
            Tell me what you&apos;re replacing or building, and I&apos;ll tell
            you what it would take.
          </p>
          <Link href="/contact" className="pill group">
            Let&apos;s talk
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
```

- [ ] **Step 2: Drop the `// 404` line in `src/app/not-found.js`**

Delete the line `      <p className="font-mono text-muted mb-3">{`// 404`}</p>` (the whole line). Nothing else changes.

- [ ] **Step 3: Drop `// ` in `src/app/opengraph-image.js`**

| Old | New |
|---|---|
| `{"// ai full-stack engineer · philippines"}` | `{"ai full-stack engineer · philippines"}` |

- [ ] **Step 4: No eyebrows left**

Run: `grep -rn '{`// \|{"// ' src --include=*.js --include=*.jsx`
Expected: no output.

- [ ] **Step 5: Lint and test**

Run: `npm run lint`, `npm test`
Expected: clean.

- [ ] **Step 6: Check in the browser**

Screenshot `http://localhost:3000/projects/coopilot` (top, results, and the bottom CTA) in light and dark, and `http://localhost:3000/nope`. Expected: no boxed cards, meta as rows between hairlines, results as plain numbers, section labels with hairlines, CTA pill left-aligned, no `//` text.

- [ ] **Step 7: Commit**

```bash
git add src/component/CaseStudyView.jsx src/app/not-found.js src/app/opengraph-image.js
git commit -m "feat: case study, 404 and share image in the shared parts, no // eyebrows

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Contact links as rows

**Files:**
- Modify: `src/app/contact/ContactView.jsx`

**Interfaces:**
- Consumes: `email`, `github`, `githubHandle`, `linkedin` from `@/lib/site`; `SectionHeading`.

- [ ] **Step 1: Imports**

Replace the four icon import lines

```js
import { BiLogoGmail } from "react-icons/bi";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FiSend, FiCheck } from "react-icons/fi";
```

with

```js
import {
  FiArrowUpRight,
  FiCheck,
  FiCopy,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiSend,
} from "react-icons/fi";
```

Replace `import { email, github, linkedin } from "@/lib/site";` with

```js
import { email, github, githubHandle, linkedin } from "@/lib/site";
import SectionHeading from "@/component/SectionHeading";
```

After the line `const cardItem = fadeInUp(20, 0.4);` add:

```js
// One row style for every contact link, matching the project rows.
const rowClass =
  "group -mx-3 flex w-full items-center gap-4 rounded-card px-3 py-3.5 text-left transition-colors duration-150 hover:bg-hover";
const iconTile =
  "grid size-9 shrink-0 place-items-center rounded-card border border-line-strong bg-surface text-ink-2";
const linkedinHandle = linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "");
```

- [ ] **Step 2: Replace the three tiles with rows**

Replace everything from the comment `{/* Social links, laid out as an inverted triangle: email + LinkedIn on` down to and including the closing `</motion.div>` of that tile grid (the one right before `{/* Contact form */}`) with:

```jsx
      {/* Where to reach me, as rows like the rest of the site. The email row
          copies the address (falling back to the mail app); the others open
          in a new tab. */}
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-14 border-t border-line divide-y divide-line"
      >
        <motion.li variants={cardItem}>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className={rowClass}
          >
            <span className={iconTile}>
              <FiMail className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">Email</span>
              <span className="block truncate text-sm text-muted">{email}</span>
            </span>
            <span className="text-sm text-muted">{copied ? "Copied" : "Copy"}</span>
            {copied ? (
              <FiCheck className="size-4 text-accent" aria-hidden="true" />
            ) : (
              <FiCopy className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
            )}
          </button>
        </motion.li>

        <motion.li variants={cardItem}>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
          >
            <span className={iconTile}>
              <FiLinkedin className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">LinkedIn</span>
              <span className="block truncate text-sm text-muted">{linkedinHandle}</span>
            </span>
            <FiArrowUpRight className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
          </a>
        </motion.li>

        <motion.li variants={cardItem}>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
          >
            <span className={iconTile}>
              <FiGithub className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">GitHub</span>
              <span className="block truncate text-sm text-muted">@{githubHandle}</span>
            </span>
            <FiArrowUpRight className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
          </a>
        </motion.li>
      </motion.ul>
```

- [ ] **Step 3: "Send a message" as a section label**

Replace

```jsx
        <div className="mb-6">
          <h2 className="text-ink text-xl font-semibold mb-1">
            Send a message
          </h2>
          <p className="text-body text-sm">
            A rough idea is enough. &quot;We track this in a spreadsheet and
            it&apos;s breaking&quot; is a perfectly good first message.
          </p>
        </div>
```

with

```jsx
        <SectionHeading
          title="Send a message"
          lede={
            <>
              A rough idea is enough. &quot;We track this in a spreadsheet and
              it&apos;s breaking&quot; is a perfectly good first message.
            </>
          }
        />
```

- [ ] **Step 4: Nothing left of the tiles**

Run: `grep -n "cursor-pointer\|BiLogoGmail\|FaLinkedin\|FaSquareGithub\|Click to copy\|h-36" src/app/contact/ContactView.jsx`
Expected: no output.

- [ ] **Step 5: Lint and test**

Run: `npm run lint`, `npm test`
Expected: clean.

- [ ] **Step 6: Check in the browser**

Screenshot `http://localhost:3000/contact` in light and dark (wait 2.5s). Click the Email row: its right side changes to "Copied" with a green check (clipboard may be blocked in the extension tab; if so, the page falls back to `mailto:` — do not let that navigation hang the session: run the click through `javascript_tool` with `document.querySelector('button[aria-label="Copy email address"]').click()` and read the row text right after).

- [ ] **Step 7: Commit**

```bash
git add src/app/contact/ContactView.jsx
git commit -m "feat: contact links as rows in the shared style

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: macOS-style cursor

**Files:**
- Modify: `src/app/globals.css` (append), `src/component/TechStackSection.jsx`

- [ ] **Step 1: Append the cursor rules to the end of `src/app/globals.css`**

Copy this block exactly; the two data URIs must stay byte-for-byte as written (every `%` inside them is already escaped as `%25`).

```css
/* macOS-style cursor: a black arrow with a white outline everywhere, a
   white pointing hand with a black outline on things you can click. Same
   in both themes, as on macOS. Pure CSS, so nothing trails the pointer and
   there is nothing to switch off for reduced motion; touch screens never
   show it. In @layer base so utilities (cursor-arrow, disabled pills) can
   still override it. The hand is Phosphor Icons' HandPointing (MIT).
   Ceiling: browsers rasterise SVG cursors at 1x, so edges are slightly soft
   on 2x screens; image-set() with 2x PNGs is the upgrade if it matters. */
:root {
  --cursor-arrow: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cfilter id='s' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeDropShadow dx='0' dy='1' stdDeviation='0.7' flood-opacity='0.35'/%3E%3C/filter%3E%3Cpath d='M3 2L3 18.5L7.1 14.7L9.7 20.6L12.4 19.4L9.9 13.6L15.4 13.6Z' fill='%23000' stroke='%23fff' stroke-width='1.6' stroke-linejoin='round' paint-order='stroke' filter='url(%23s)'/%3E%3C/svg%3E") 3 2;
  --cursor-hand: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 256 256'%3E%3Cfilter id='s' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeDropShadow dx='0' dy='8' stdDeviation='7' flood-opacity='0.3'/%3E%3C/filter%3E%3Cg filter='url(%23s)'%3E%3Cpath d='M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Z' fill='%23fff'/%3E%3Cpath d='M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0v20a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z' fill='%23000'/%3E%3C/g%3E%3C/svg%3E") 11 2;
}

@layer base {
  html {
    cursor: var(--cursor-arrow), auto;
  }

  a,
  button,
  summary,
  select,
  label[for],
  [role="button"] {
    cursor: var(--cursor-hand), pointer;
  }

  input,
  textarea,
  [contenteditable="true"] {
    cursor: text;
  }
}

/* The arrow on something that is technically a button but should not look
   clickable (the stack section's tool chips). */
@utility cursor-arrow {
  cursor: var(--cursor-arrow), auto;
}
```

- [ ] **Step 2: Stack chips use the arrow**

In `src/component/TechStackSection.jsx`, in the tool button's className, replace `cursor-default` with `cursor-arrow`.

- [ ] **Step 3: No system-cursor utilities left**

Run: `grep -rn "cursor-pointer\|cursor-default" src --include=*.js --include=*.jsx`
Expected: no output.

- [ ] **Step 4: Lint and test**

Run: `npm run lint`, `npm test`
Expected: clean.

- [ ] **Step 5: Check in the browser**

On `http://localhost:3000/` (wait 2.5s) run:

```js
const c = (el) => getComputedStyle(el).cursor;
({
  html: c(document.documentElement).slice(-12),
  link: c(document.querySelector("header a[href='/projects']")).slice(-16),
  toggle: c(document.querySelector('button[aria-label="Toggle dark mode"]')).slice(-16),
  chip: c(document.querySelector('button[aria-describedby="stack-help"]')).slice(-12),
})
```

Expected: `html` ends with `") 3 2, auto"`, `link` and `toggle` end with `") 11 2, pointer"`, `chip` ends with `") 3 2, auto"`. On `/contact`, an `input` reports `"text"`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/component/TechStackSection.jsx
git commit -m "feat: macOS-style arrow and pointing-hand cursor

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Whole-site check

**Files:** none changed unless a check fails.

- [ ] **Step 1: Tests and lint**

Run: `npm test`, `npm run lint`
Expected: pass.

- [ ] **Step 2: Build without fighting the dev server**

The dev server owns `.next`, so build in a throwaway worktree with its own real install (no `node_modules` junction):

```bash
git worktree add ../justine-portfolio-build HEAD
cd ../justine-portfolio-build && npm ci && npm run build
cd ../justine-portfolio && git worktree remove ../justine-portfolio-build --force
```

Expected: the build succeeds (without `.env.local` the GitHub section logs its missing-token warning; that is expected).

- [ ] **Step 3: Browser pass**

In the extension tab, for `/`, `/projects`, `/projects/coopilot`, `/contact`, `/nope`: wait 2.5s after load, screenshot light and dark, read the console (no hydration warnings or errors; the framer-motion "non-static position" warning predates this work). Confirm: About card not clipped at desktop and at the window's minimum width; hackathon tags on one line; project rows clickable; no `//`; cursor values as in Task 6.

- [ ] **Step 4: Hand to Justine**

Ask Justine to check in their own browser: the macOS cursor (arrow, hand on links, text cursor in the form), the About section, /projects, a case study and /contact, plus the round-1 motion items still open (first-load dissolve, theme switch, scroll feel, flick-then-click a case study, phone width in DevTools at 390px). Then finish the branch (PR) with superpowers:finishing-a-development-branch once they approve; remind them the resume PDF with their WhatsApp number becomes public on push.
