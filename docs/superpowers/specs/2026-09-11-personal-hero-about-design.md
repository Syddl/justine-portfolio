# Personal Hero & About — Design Spec

**Date:** 2026-09-11
**Status:** Approved by Justine (chat, this session)
**Branch:** `redesign/client-first-content`
**Supersedes:** the Hero and About sections of
`2026-09-02-repetition-and-texture-design.md`. Everything else in that spec
stands.

## Goal

Return the hero and About to the original, personal look (pre Sept 1) with
better writing. The page should read as "about me", not "what I can do for
you". Reference for tone and length: the ~50-word intro on bryllim.com.

## Decisions made with the user

- Revert to the ORIGINAL hero and About (name/title hero, paragraph plus the
  floating `const developer = {...}` card), not the Sept 2 version.
- About mentions no employer, no past job, no degree, no hackathons. Those
  stay in the Experience and Hackathons sections.
- Keep it minimal: one paragraph (about 40 words) plus the card.
- Code card syntax is amber and grey (the amber-only palette chosen on
  Sept 2); the blue-violet glow does not return; traffic-light dots stay.
- The four verified day-job numbers move to one mono line under the current
  role in Experience. The cycling headline, the proof block, and their data
  and hook are deleted.

## Hero (`HeroSection.jsx`, server component)

1. Mono eyebrow: `Hello, my name is`
2. h1, three lines, `text-5xl md:text-6xl`: `Justine` (gray-100) /
   `Full Stack` / `Developer`
3. Mono tagline: `I build web apps, front to back, and ship my own on the side.`
4. Status row: availability badge from `availability.js` plus
   `🏠 General Santos City, Philippines`
5. GitHub and LinkedIn icons. No CTA button, no email link (nav has Contact,
   footer has email).

## About (`AboutMeSection.jsx`, server component)

- Heading via `SectionHeading` (`// about`, "About me") so it matches the
  other sections.
- Left (3/5): one paragraph:
  *"I'm Justine Jude Cuevas, a full-stack developer from General Santos
  City, Philippines. I like taking an idea from a blank repo to something
  people actually open. Right now that's QuizyLite, a study tool that turns
  PDF highlights into flashcards."*
- Right (2/5): `DeveloperCard` (new, server-safe). Original card chrome
  (`rounded-xl border-neutral-700/60 bg-neutral-900/80 backdrop-blur-sm p-5
  shadow-2xl shadow-black/40`), three traffic-light dots, a `const developer
  = {...}` block with keys `name`, `role`, `location`, `openToWork`,
  `currentlyBuilding`, `frontend`, `backend`. `openToWork` and
  `currentlyBuilding` read from `availability.js` (`currentlyBuilding`
  restored there). Colours: keys neutral-300, strings amber-300,
  booleans neutral-200, punctuation neutral-500, `const` neutral-400,
  identifier gray-100. The 6 s float is a CSS keyframe (`.float-card`) with
  a `prefers-reduced-motion` override, so no client JS and no hydration
  branching.

## Experience

`ExperienceSection` renders `job.metrics` (when present) as one mono line
under the description: `93% → 3% false quality flags · ~430 ms → <1 frame
audio/video drift · 70+ zero-cost CI gates · $0.70 per output minute`. Each
item carries its `sentence` for screen readers. The `count` fields (only
consumer was the deleted count-up hook) are removed from the data.

## Removed

`RequirementCycler.jsx`, `ProofBlock.jsx`, `useCountUp.js`,
`src/data/hero.js`, the `.cursor-blink` CSS. README updated to match.

## Verification

`npm run lint`, `npm test`, `npm run build` pass; the home page renders the
new hero and About at desktop width; `grep -rn "blue-\|violet-\|emerald-"
src/` stays empty; "AI video platform" appears only in `experience.js`.
