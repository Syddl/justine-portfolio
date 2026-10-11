# Redesign "feel" pass: Design Spec

**Date:** 2026-10-11
**Status:** Approved by Justine in chat (look and motion, both sections)
**Branch:** `feat/redesign-feel`
**References:** marwieang.com (feel, type, colour, hero, motion) and
sethyuri.vercel.app (pixel mascot, which is a separate spec).
**Supersedes:** the frozen visual language in the Sept 1, Sept 2 and Sept 11
specs (Inter, neutral-900, amber as the only accent, no theme toggle).
Content, copy, data files and section order from those specs stand.

## Goal

Make a first visit feel crafted: a quiet pixel-dissolve on load, glide-on-
flick scrolling, a light and a dark theme with an animated switch, and a
cleaner, editorial layout. Theme: **"pixel-rendered"**. The pixel dissolve,
the ASCII GitHub calendar, the mono logo and, later, the pixel mascot share
one visual idea, so the borrowed techniques read as Justine's own.

## Decisions made with the user

- Fonts: Figtree (UI, headings, body), Newsreader italic (one accent word),
  JetBrains Mono kept for logo, dates, tags, ASCII calendar and code card.
  Inter is removed.
- Colour: neutral greys plus green, close to Mar Wie's. **Amber is removed
  everywhere** ("I don't like the amber").
- The reference's sidebar becomes a sticky top header.
- Hero: photo, name, role, Resume pill, then the existing tagline as the
  headline with one serif-italic accent.
- The amber cursor glow (`MouseHoverEffect`) is deleted.
- Theme follows the OS until the visitor picks; the pick is remembered.
- The pixel dissolve plays on every full page load (not on client-side
  navigation) and on every theme switch.
- The resume is linked as given, including its WhatsApp number (user
  supplied it "for now"; flagged in chat).

## Non-goals

- The mascot (separate spec, after this one ships, so it can use the final
  palette in both themes).
- Copy changes. Every sentence on the site stays as it is.
- The Open Graph / Twitter share images (`opengraph-image.js`,
  `twitter-image.js`) keep their current dark look.
- Click-sound, cursor follower, page-transition animations between routes.

## Colour tokens

Each token is defined once in `globals.css` with `light-dark()`, and
`color-scheme` decides which half applies:

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#fcfcfb` | `#0f0f11` | page |
| `surface` | `#ffffff` | `#19191c` | cards, code card, header when scrolled |
| `hover` | `#f3f3f1` | `#212125` | row hover fill |
| `ink` | `#111113` | `#ececee` | names, titles |
| `ink-2` | `#3a3a3f` | `#c6c6cb` | emphasised body |
| `body` | `#4a4a4f` | `#adadb3` | paragraphs |
| `muted` | `#67676c` | `#8b8b91` | labels, dates, meta |
| `faint` | `#9a9a9e` | `#66666c` | non-text only: icons, dots, punctuation |
| `line` | `#ebebea` | `#232327` | dividers |
| `line-strong` | `#dcdcda` | `#34343a` | pill and card borders |
| `accent` | `#1d7a44` | `#5fd08a` | green: everything amber did, plus live state |

Every text token (`ink` to `muted`, and `accent`) is at least 4.5:1 on
`bg`, `surface` and `hover` in both themes (lowest: dark `muted` on
`hover`, 4.74). This also retires the old below-AA `neutral-500` greys.

Tokens are exposed to Tailwind v4 through `@theme inline`, so components use
`text-ink`, `bg-surface`, `border-line`, `text-accent` and so on. No
component keeps a hardcoded hex or `neutral-*`/`gray-*` class.

Green replaces amber in: the logo tittle, the ASCII calendar levels (40, 60,
80, 100% of `accent`), the experience rail and its lit dots, the stack
cross-highlight, the hackathon win tag, code-card strings and the case-study
reading bar. The availability badge stays green as now.

Grain stays at `--grain-opacity: 0.035` in both themes. If Justine finds it
too strong or weak in light mode on a real display, it gets a light-mode
value (judged by eye, not by screenshot: JPEG hides grain).

## Typography

- Loaded with `next/font/google`: Figtree (variable weight), Newsreader
  (italic, 400 only), JetBrains Mono (400, 600). Their CSS variables sit on
  `<html>`; Tailwind's `font-sans`, `font-serif` and `font-mono` point at them.
- `body` uses `font-sans`, so components drop their per-element
  `inter.className`. Mono spots use the `font-mono` class.
- Hero headline: 34px (`text-[2.125rem]`), weight 500, tracking -0.02em,
  line-height 1.25; on phones about 28px.
- Body text 17px, `text-body`, relaxed leading.

## Layout

- One column, **640px** max width plus 24px side padding, shared by header,
  main and footer on every page (home, /projects, case studies, /contact,
  404).
- `SectionHeading`: the title becomes a small `text-muted` label (still an
  `h2`) with a 1px `line` rule under it, plus an optional right-aligned
  action. The optional lede stays, in `text-body`.
- Radius 10px for cards and thumbnails; buttons are pills
  (`rounded-full`, 1px `line-strong` border, no fill, `hover` fill on hover).
- Experience keeps its drawn timeline; each entry gets the soft hover fill.
- Hackathons keep their divided rows, recoloured.
- Project cards become rows: small cover thumbnail (10px radius), name,
  summary, stack tags and the same three links (case study, live, code),
  with the hover fill. Used on home and /projects.
- Footer: same content, tokens and Figtree.

## Header (`SiteHeader`, in `layout.js`)

- Sticky at the top, same 640px column.
- Left: the `.just\ne` logo (tittle in `accent`). Right: Projects,
  Contact, theme toggle (sun and moon icons from `react-icons`).
- At the top of the page it is transparent. Once the page scrolls, a
  `surface`-tinted translucent background with `backdrop-blur` and a 1px
  `line` border fades in. This is driven by a CSS scroll-driven animation
  (`animation-timeline: scroll()`); browsers without it get the scrolled
  look all the time (`@supports` fallback), so text never overlaps.
- Same header on phones.

## Hero (`HeroSection.jsx`, stays a server component)

```
 (photo)  Justine Jude Cuevas                 [ Resume ↗ ]
          AI Full-Stack Engineer

 I build LLM-powered products end to end, and the
 agent tooling I build them with.

 ● Available for work   Philippines   GitHub  LinkedIn
```

- Photo: `public/justine.jpg` (the photo Justine supplied, copied as is),
  rendered by `next/image` in an 80px circle with `object-cover` and an
  `object-position` that centres the face. No image tooling.
- Name is the page `h1` (22px, weight 600, `text-ink`); role below in
  `text-muted`.
- Resume pill on the right: file icon plus "Resume", opens
  `/Justine_Jude_Cuevas_Resume.pdf` in a new tab. The URL lives in
  `src/lib/site.js` as `resumeUrl`. On phones the pill moves under the name.
- Headline is a `<p>` with the existing tagline; "agent tooling" is wrapped
  in `<em className="font-serif italic">`.
- Status row: availability badge (from `availability.js`, recoloured),
  location, GitHub and LinkedIn icons.
- "Hello, my name is" is removed.

## Motion

All motion respects `prefers-reduced-motion: reduce`: the cover, rise-in,
click burst and smooth scroll are off, and the theme switches instantly.
Per the repo rule, reduced motion never changes markup: CSS media queries
hide or zero animations, and JS checks `matchMedia` only inside effects and
event handlers.

### Smooth scroll (`SmoothScroll.jsx`, client)

- `lenis` (the only new dependency), started in an effect from
  `layout.js`. Default inertia (`lerp` 0.1); touch keeps native scrolling.
- Not started under reduced motion. Hash links keep working
  (`anchors: true`).
- framer-motion's `whileInView` reveals keep working because Lenis drives
  the native scroll position.

### First-load pixel dissolve

- An inline script placed first in `<body>` builds a full-viewport
  `<canvas>` at one third resolution (3px pixels), fills it with the current
  `bg` colour and, over about 900ms (ease-in-out), makes its pixels
  transparent from top to bottom. Each pixel's threshold is
  `row / rows * 0.72 + random * 0.28`, which gives a dithered edge rather
  than a straight wipe. Then the canvas is removed.
- Because it is a plain inline script, it starts with the first frame and
  does not wait for React. The hero HTML is underneath from the start.
- Failsafe: a CSS animation hides the canvas after 2s whatever happens.
- Only on full page loads; client-side navigation between pages does not
  replay it. Skipped under reduced motion.
- The threshold formula lives once in `src/lib/dither.js`; the inline
  script and the theme switch both use it.

### Rise-in

- Hero blocks (identity row, headline, status row) rise 14px, scale from
  0.985 and fade in: 560ms, `cubic-bezier(0.22, 1, 0.36, 1)`, 60ms
  stagger. Pure CSS keyframes on server-rendered markup.
- Below-the-fold sections keep `Reveal`, retuned to the same distance and
  curve. The old whole-page `.page-enter` slide is removed.

### Theme switch (`ThemeToggle.jsx`, client)

- A small inline script in `<head>` sets `data-theme` on `<html>` before
  first paint **only if** the visitor saved a choice. With no saved choice,
  `color-scheme: light dark` lets the OS decide, live.
- `<html>` has `suppressHydrationWarning` (the attribute differs from the
  server render by design).
- Which icon shows (sun or moon) is decided in CSS from `data-theme` and
  the OS media query, so server and client markup are identical.
- On click: the next theme is the opposite of the current effective
  theme. Inside `document.startViewTransition`, `data-theme` flips; the new
  snapshot (`::view-transition-new(root)`) is revealed through a dithered
  mask, top to bottom, about 800ms, using the same thresholds and 3px
  pixels as the intro. Mask frames are generated once and reused.
- No View Transitions support, or reduced motion: instant switch.
- The choice is saved in `localStorage` (wrapped in try/catch).

### Small touches

- `ClickBurst.jsx` (client): on a mouse `pointerdown`, five 1px lines spray
  outward from the click point and fade in 0.4s. Mouse only, not touch.
- Rows: 150ms background fade to `hover`. Pills and buttons:
  `active:scale-[0.97]`.
- Kept: `TiltCard` on the code card, count-up, the drawn experience rail,
  the case-study reading bar, grain.
- Removed: `MouseHoverEffect`, `.page-enter`.

## Files

New: `src/lib/dither.js` (+ test), `src/lib/theme.js` (+ test),
`src/component/SiteHeader.jsx`, `src/component/ThemeToggle.jsx`,
`src/component/motion/SmoothScroll.jsx`,
`src/component/motion/ClickBurst.jsx`, `public/justine.jpg`,
`public/Justine_Jude_Cuevas_Resume.pdf`.

Changed: `globals.css`, `fonts.js`, `layout.js`, `page.js`, `site.js`,
every component and page that uses `inter`, hex greys, `neutral-*`/`gray-*`
or amber (18 files today), and `Reveal.jsx`.

Deleted: `MouseHoverEffect.jsx`.

## Testing and verification

- `npm test` gains:
  - `dither.test.mjs`: thresholds are in [0, 1); on average, rows near the
    top clear before rows near the bottom.
  - `theme.test.mjs`: next theme from (saved choice, OS prefers dark).
  - a contrast check that parses the `light-dark()` tokens from
    `globals.css` and asserts every text token is at least 4.5:1 on `bg`,
    `surface` and `hover` in both themes. It strips `\r` before matching.
- `npm run lint` and `npm run build` pass.
- Grep shows no `amber`, `inter`, `#A8ADB2`, `neutral-` or `gray-` left in
  `src/` (OG image files excepted).
- Visual check by Justine in a real browser: the Chrome extension tab is
  hidden, so `requestAnimationFrame` is paused there and it cannot judge the
  dissolve, the theme switch or scroll feel. Static layout and both themes
  can still be checked there by setting `data-theme`.
