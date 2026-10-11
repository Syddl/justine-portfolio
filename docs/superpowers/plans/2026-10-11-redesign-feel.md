# Redesign Feel Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the portfolio with light and dark themes, Figtree and Newsreader, greys plus green, a sticky header, a photo hero with a Resume pill, Lenis smooth scroll, a first-load pixel dissolve and a pixel-dissolve theme switch.

**Architecture:** Colour tokens are CSS custom properties defined once with `light-dark()` in `globals.css` and exposed to Tailwind v4 through `@theme inline`; `color-scheme` (OS by default, pinned by `data-theme`) picks the half. The dither maths lives in one pure module (`src/lib/dither.js`): an inline script built from it runs the first-load cover before React, and `ThemeToggle` uses it to build View Transition mask frames. Everything else is component restyling onto the tokens.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, framer-motion 12, next/font/google, `lenis@1.3.26` (new), node:test.

**Spec:** `docs/superpowers/specs/2026-10-11-redesign-feel-design.md`

## Global Constraints

- No copy changes: every sentence on the site stays as it is.
- The only new dependency is `lenis@1.3.26`.
- Fonts: Figtree (`font-sans`), Newsreader italic 400 (`font-serif`, the hero accent word only), JetBrains Mono (`font-mono`). Inter is removed by the end.
- Amber is removed everywhere; green (`accent`) takes every place amber had.
- Components use token classes only (`text-ink`, `bg-surface`, `border-line`, `text-accent/40` ...). No hex colours, `neutral-*`, `gray-*` or `amber-*` in components. Exceptions: `opengraph-image.js` and `twitter-image.js` (out of scope) and the code card's red/yellow/green traffic-light dots.
- Column: `max-w-col` (43rem = 640px + 24px padding each side) with `px-6` on header, main and footer of every page.
- Reduced motion never changes markup (hydration). CSS (`prefers-reduced-motion` / `motion-reduce:`) hides or zeroes animations; JS reads `matchMedia` only inside effects and event handlers.
- No synchronous `setState` inside `useEffect` (`react-hooks/set-state-in-effect` lint rule).
- `src/component/SectionHeading.jsx` has an uncommitted edit by Justine (it drops the unused `eyebrow` param). Task 7 rewrites that file in the same direction. **Never `git add -A` or `git add .`**: stage only the files a task lists.
- Edit source files with the Edit tool, not `sed`/`perl`/PowerShell `-replace` (CRLF files). Write any script to a file and run the file.
- Every commit message ends with:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- The Chrome extension tab is hidden: `requestAnimationFrame` is paused there, so the dissolve never runs, View Transitions are skipped and Lenis does not scroll on wheel events. In that tab, verify by reading DOM state and computed styles, scroll with `window.scrollTo`, and wait 2.5s after load for the cover's CSS failsafe before screenshots. Justine judges motion in a real browser.

## File map

| File | Responsibility |
|---|---|
| `src/app/globals.css` | Tokens, Tailwind theme, `dark:` variant, `pill`, header, View Transition, cover, rise-in, click-burst rules |
| `src/app/globals.test.mjs` (new) | WCAG contrast check of the text tokens |
| `.gitattributes` (new) | LF for `globals.css`, which a check reads |
| `src/app/fonts.js` | Figtree, Newsreader, JetBrains Mono with CSS variables |
| `src/app/layout.js` | html/body classes, theme head script, cover canvas + intro script, header, smooth scroll, click burst, footer |
| `src/lib/theme.js` (+ test, new) | Theme rules and the `<head>` script |
| `src/lib/dither.js` (+ test, new) | Dither thresholds, easing, timings, inline intro script |
| `src/component/SiteHeader.jsx` (new) | Sticky header |
| `src/component/ThemeToggle.jsx` (new) | Theme button and the masked View Transition |
| `src/component/motion/SmoothScroll.jsx` (new) | Lenis |
| `src/component/motion/ClickBurst.jsx` (new) | Click lines |
| `src/component/HeroSection.jsx` | New hero |
| `src/component/SectionHeading.jsx` | Label + hairline heading |
| `src/component/ProjectCard.jsx` | Project row |
| other components and pages | Token and font swaps |
| `src/component/MouseHoverEffect.jsx` | Deleted |
| `public/justine.jpg`, `public/Justine_Jude_Cuevas_Resume.pdf` (new) | Hero assets |

---

### Task 1: Colour tokens, fonts and the contrast check

**Files:**
- Create: `.gitattributes`, `src/app/globals.test.mjs`
- Modify: `src/app/globals.css` (full replacement), `src/app/fonts.js` (full replacement), `src/app/layout.js` (imports, `<html>`, `<body>`)

**Interfaces:**
- Produces: CSS variables `--bg --surface --hover --ink --ink-2 --body --muted --faint --line --line-strong --accent`; Tailwind colours `bg surface hover ink ink-2 body muted faint line line-strong accent`; `font-sans`, `font-serif`, `font-mono`; `max-w-col`; `rounded-card`; the `dark:` variant (effective theme); the `pill` utility. `fonts.js` exports `figtree`, `newsreader`, `jetbrainsMono` (each with `.variable`) and, until Task 8, `inter`.

- [ ] **Step 1: Pin line endings for the file the check reads**

Create `.gitattributes`:

```
# globals.test.mjs parses this file; keep it LF on every checkout.
src/app/globals.css text eol=lf
```

- [ ] **Step 2: Write the failing contrast test**

Create `src/app/globals.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Parses the light-dark() colour tokens out of globals.css and checks WCAG
// AA contrast (4.5:1) for every text token on every background, in both
// themes. \r is stripped so a CRLF checkout parses the same as LF.
const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8").replace(/\r/g, "");

const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
    ),
  ].map(([, name, light, dark]) => [name, { light, dark }]),
);

const luminance = (hex) => {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((h) => {
      const c = parseInt(h, 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TEXT = ["ink", "ink-2", "body", "muted", "accent"];
const BACKGROUNDS = ["bg", "surface", "hover"];

test("the contrast maths matches known WCAG values", () => {
  assert.equal(contrast("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(contrast("#777777", "#ffffff").toFixed(2), "4.48");
});

test("every token the check reads is a light-dark(#rrggbb, #rrggbb) pair", () => {
  for (const name of [...TEXT, ...BACKGROUNDS]) {
    assert.ok(tokens[name], `--${name} is missing or not a light-dark() hex pair`);
  }
});

test("text tokens reach 4.5:1 on every background in both themes", () => {
  for (const theme of ["light", "dark"]) {
    for (const text of TEXT) {
      for (const bg of BACKGROUNDS) {
        const ratio = contrast(tokens[text][theme], tokens[bg][theme]);
        assert.ok(ratio >= 4.5, `${theme}: --${text} on --${bg} is ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
```

- [ ] **Step 3: Run it and watch it fail**

Run: `npm test`
Expected: FAIL in `globals.test.mjs`: "--ink is missing or not a light-dark() hex pair" (and the 4.5:1 test errors). The existing tests still pass.

- [ ] **Step 4: Replace `src/app/globals.css`**

Full new content (the four existing rule groups at the bottom are kept unchanged; `.page-enter` is removed in Task 4):

```css
@import "tailwindcss";

::-webkit-scrollbar {
  display: none;
}

/* Colour tokens. Each holds its light and its dark value; light-dark()
   picks the half that matches the computed color-scheme. With no saved
   choice the scheme is "light dark", so the OS decides, live. When the
   visitor picks a theme, the <head> script in layout.js sets data-theme,
   which pins the scheme. Text tokens (ink, ink-2, body, muted, accent) must
   stay at 4.5:1 or more on bg, surface and hover in both themes:
   globals.test.mjs checks it. faint, line and line-strong are non-text
   only (dots, icons, punctuation, borders). */
:root {
  color-scheme: light dark;
  --bg: light-dark(#fcfcfb, #0f0f11);
  --surface: light-dark(#ffffff, #19191c);
  --hover: light-dark(#f3f3f1, #212125);
  --ink: light-dark(#111113, #ececee);
  --ink-2: light-dark(#3a3a3f, #c6c6cb);
  --body: light-dark(#4a4a4f, #adadb3);
  --muted: light-dark(#67676c, #8b8b91);
  --faint: light-dark(#9a9a9e, #66666c);
  --line: light-dark(#ebebea, #232327);
  --line-strong: light-dark(#dcdcda, #34343a);
  --accent: light-dark(#1d7a44, #5fd08a);
}

:root[data-theme="light"] {
  color-scheme: light;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}

/* Tailwind names for the tokens: text-ink, bg-surface, border-line,
   text-accent/40 and so on. "inline" makes utilities read the variables at
   runtime, so a theme switch needs nothing rebuilt. The font variables are
   set on <html> by next/font (src/app/fonts.js). */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-hover: var(--hover);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-body: var(--body);
  --color-muted: var(--muted);
  --color-faint: var(--faint);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --font-sans: var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-newsreader), ui-serif, Georgia, serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

@theme {
  /* max-w-col: the 640px column plus px-6 (24px) on each side. */
  --container-col: 43rem;
  --radius-card: 10px;
}

/* dark: follows the effective theme, not only the OS: a saved
   data-theme="dark", or the OS in dark mode with no saved light choice. */
@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(:root:not([data-theme="light"]), :root:not([data-theme="light"]) *) {
      @slot;
    }
  }
}

/* The one button shape: outline pill, hover fill, a small press. */
@utility pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--line-strong);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink);
  transition:
    background-color 150ms ease,
    transform 150ms ease;
  &:hover {
    background-color: var(--hover);
  }
  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Server-rendered page entrance - replaces the framer-motion page wrapper so
   the hero paints before hydration (LCP) while keeping the same feel. */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: page-enter 0.7s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .page-enter {
    animation: none;
  }
}

/* Entrance for the stack section's caption: a keyed span remounts when the
   hovered tool changes, so the new text is there immediately and only fades
   in. No JavaScript animation, nothing to wait for. */
@keyframes caption-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.caption-in {
  animation: caption-in 0.15s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .caption-in {
    animation: none;
  }
}

/* The About code card's idle float: the original framer-motion loop, moved
   to CSS so the card stays a server component. */
@keyframes float-card {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(-0.5deg);
  }
}

.float-card {
  animation: float-card 6s ease-in-out infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .float-card {
    animation: none;
  }
}

/* Film-style grain over the whole page. The tile is an inline SVG
   (feTurbulence, desaturated to grey), so it costs no request and stays crisp
   at any DPI; stitchTiles keeps the repeat seamless. It sits above the content
   so the texture reaches the cards too, at an opacity low enough not to touch
   legibility. Tune --grain-opacity to taste: 0 removes it, 0.06 is heavy. */
:root {
  --grain-opacity: 0.035;
}

.grain {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 5: Run the tests and watch them pass**

Run: `npm test`
Expected: PASS, all tests including the three in `globals.test.mjs`.

- [ ] **Step 6: Replace `src/app/fonts.js`**

```js
import { Figtree, Inter, JetBrains_Mono, Newsreader } from "next/font/google";

// Figtree is the site face. Newsreader italic is only for the accent word in
// the hero headline. JetBrains Mono is for the logo, dates, tags, the ASCII
// calendar and the code card. Each sets a CSS variable on <html>; globals.css
// maps Tailwind's font-sans, font-serif and font-mono onto them.
export const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: "italic",
  weight: "400",
  variable: "--font-newsreader",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
});

// Still imported by components until Task 8 of the redesign plan moves them
// to font-sans; deleted there.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
```

- [ ] **Step 7: Wire fonts and tokens into `src/app/layout.js`**

Three edits:

1. `import { inter, jetbrainsMono } from "./fonts";` becomes
   `import { figtree, inter, jetbrainsMono, newsreader } from "./fonts";`
2. `<html lang="en">` becomes
   ```jsx
   <html
     lang="en"
     className={`${figtree.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
   >
   ```
3. `<body className="bg-neutral-900 w-full min-h-screen flex flex-col">` becomes
   `<body className="bg-bg text-body font-sans antialiased w-full min-h-screen flex flex-col">`

- [ ] **Step 8: Lint and build**

Run: `npm run lint` then `npm run build`
Expected: both succeed. (The page still uses the old grey classes in components, so in light mode the text is wrong until Tasks 6–8. That is expected on this branch.)

- [ ] **Step 9: Commit**

```bash
git add .gitattributes src/app/globals.test.mjs src/app/globals.css src/app/fonts.js src/app/layout.js
git commit -m "feat: colour tokens for light and dark, Figtree and Newsreader

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Theme rules and dither maths (pure modules)

**Files:**
- Create: `src/lib/theme.js`, `src/lib/theme.test.mjs`, `src/lib/dither.js`, `src/lib/dither.test.mjs`

**Interfaces:**
- Produces, `src/lib/theme.js`:
  - `THEME_KEY: "theme"` (localStorage key)
  - `savedTheme(value) -> "light" | "dark" | null`
  - `nextTheme(saved, prefersDark: boolean) -> "light" | "dark"`
  - `themeScript: string` (inline `<head>` script)
- Produces, `src/lib/dither.js`:
  - `DITHER_PX = 3`, `INTRO_MS = 900`, `THEME_MS = 800`
  - `ditherThresholds(cols, rows, random = Math.random) -> Float32Array` (length `cols*rows`, values in [0, 1))
  - `ditherCut(progress: number) -> number` (0 at 0, 1.02 at 1, clamped)
  - `introScript: string` (inline script that runs the first-load cover)

- [ ] **Step 1: Write the failing theme test**

Create `src/lib/theme.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { nextTheme, savedTheme, themeScript } from "./theme.js";

test("savedTheme accepts only light or dark", () => {
  assert.equal(savedTheme("light"), "light");
  assert.equal(savedTheme("dark"), "dark");
  assert.equal(savedTheme(null), null);
  assert.equal(savedTheme(undefined), null);
  assert.equal(savedTheme("system"), null);
});

test("nextTheme flips a saved choice, whatever the OS says", () => {
  assert.equal(nextTheme("dark", false), "light");
  assert.equal(nextTheme("dark", true), "light");
  assert.equal(nextTheme("light", true), "dark");
  assert.equal(nextTheme("light", false), "dark");
});

test("with no saved choice, nextTheme flips the OS theme", () => {
  assert.equal(nextTheme(undefined, true), "light");
  assert.equal(nextTheme(null, false), "dark");
  assert.equal(nextTheme("bogus", true), "light");
});

// Runs the real inline script against a fake document and localStorage.
const runHeadScript = (storage) => {
  const root = { dataset: {} };
  new Function("document", "localStorage", themeScript)(
    { documentElement: root },
    storage,
  );
  return root.dataset.theme;
};

test("the head script pins a saved theme and ignores anything else", () => {
  assert.equal(runHeadScript({ getItem: () => "dark" }), "dark");
  assert.equal(runHeadScript({ getItem: () => "light" }), "light");
  assert.equal(runHeadScript({ getItem: () => null }), undefined);
  assert.equal(runHeadScript({ getItem: () => "purple" }), undefined);
});

test("the head script survives blocked storage", () => {
  const blocked = {
    getItem: () => {
      throw new Error("SecurityError");
    },
  };
  assert.equal(runHeadScript(blocked), undefined);
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`
Expected: FAIL: cannot find module `./theme.js`.

- [ ] **Step 3: Write `src/lib/theme.js`**

```js
// Theme choice. Pure so node --test can cover it; ThemeToggle and the
// <head> script in layout.js both follow these rules.
//
// A saved choice ("light" or "dark" in localStorage) pins the theme. With
// none, the OS decides through `color-scheme: light dark` in globals.css.
export const THEME_KEY = "theme";

export const savedTheme = (value) =>
  value === "light" || value === "dark" ? value : null;

// The theme a click switches to: the opposite of the one showing now.
export const nextTheme = (saved, prefersDark) => {
  const current = savedTheme(saved) ?? (prefersDark ? "dark" : "light");
  return current === "dark" ? "light" : "dark";
};

// Inlined into <head> so a saved theme is applied before first paint and the
// other theme never flashes. Plain ES5 with no imports: it ships as a string.
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write the failing dither test**

Create `src/lib/dither.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { ditherCut, ditherThresholds, introScript } from "./dither.js";

test("thresholds stay inside [0, 1), even at the noise extremes", () => {
  for (const random of [() => 0, () => 0.9999999]) {
    for (const value of ditherThresholds(40, 30, random)) {
      assert.ok(value >= 0 && value < 1, `threshold ${value}`);
    }
  }
});

test("without noise, every row turns over after the row above it", () => {
  const cols = 8;
  const rows = 10;
  const t = ditherThresholds(cols, rows, () => 0);
  assert.equal(t.length, cols * rows);
  for (let row = 1; row < rows; row++) {
    assert.ok(t[row * cols] > t[(row - 1) * cols], `row ${row}`);
    assert.equal(t[row * cols], t[row * cols + cols - 1], `row ${row} is level`);
  }
});

test("ditherCut eases from 0 to past every threshold, and clamps", () => {
  assert.equal(ditherCut(0), 0);
  assert.equal(ditherCut(0.5), 0.51);
  assert.equal(ditherCut(1), 1.02);
  assert.equal(ditherCut(-1), 0);
  assert.equal(ditherCut(3), 1.02);
  assert.ok(ditherCut(0.25) < 0.25, "starts slowly");
  assert.ok(ditherCut(0.75) > 0.75, "finishes fast, then settles");
});

test("the inline intro script is valid JavaScript", () => {
  assert.doesNotThrow(() => new Function(introScript));
});
```

- [ ] **Step 6: Run it and watch it fail**

Run: `npm test`
Expected: FAIL: cannot find module `./dither.js`.

- [ ] **Step 7: Write `src/lib/dither.js`**

```js
// The pixel dissolve shared by the first-load cover and the theme switch.
//
// Every canvas pixel gets a threshold: mostly how far down the screen its
// row is, plus some noise, so the edge sweeping down the page is dithered
// instead of a straight line. As the eased progress (ditherCut) passes a
// pixel's threshold, that pixel turns over: on load the cover pixel goes
// clear; on a theme switch the new theme shows through it.
//
// ditherThresholds and ditherCut are self-contained on purpose (no imports,
// no outside helpers): introScript inlines their source text into the page,
// so each must work on its own, minified or not.

export const DITHER_PX = 3; // one canvas pixel per 3x3 screen pixels
export const INTRO_MS = 900;
export const THEME_MS = 800;

export const ditherThresholds = (cols, rows, random = Math.random) => {
  const thresholds = new Float32Array(cols * rows);
  for (let i = 0; i < thresholds.length; i++) {
    thresholds[i] = (Math.floor(i / cols) / rows) * 0.72 + random() * 0.28;
  }
  return thresholds;
};

// Ease-in-out progress, scaled to 1.02 so even the highest threshold (just
// under 1) has been passed when the animation ends.
export const ditherCut = (progress) => {
  const x = Math.min(1, Math.max(0, progress));
  return 1.02 * (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
};

// The first-load cover. layout.js renders <canvas class="dither-cover">
// with this script straight after it, so it runs while the HTML is still
// parsing, before first paint and before React loads. It paints the canvas
// in the page background, then clears it pixel by pixel, top first.
// Reduced motion: hidden at once. If anything goes wrong, the CSS failsafe
// on .dither-cover (globals.css) hides it after 2s. ES5 on purpose: this is
// inlined as text, not bundled.
function runIntro(thresholds, cut, px, ms) {
  var canvas = document.currentScript.previousElementSibling;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }
  var w = Math.ceil(innerWidth / px);
  var h = Math.ceil(innerHeight / px);
  canvas.width = w;
  canvas.height = h;
  var rgb = (
    getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [15, 15, 17]
  ).map(Number);
  var ctx = canvas.getContext("2d");
  var image = ctx.createImageData(w, h);
  var data = image.data;
  var th = thresholds(w, h);
  for (var i = 0; i < th.length; i++) {
    data[4 * i] = rgb[0];
    data[4 * i + 1] = rgb[1];
    data[4 * i + 2] = rgb[2];
    data[4 * i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  var start;
  var frame = function (now) {
    if (start === undefined) start = now;
    var progress = (now - start) / ms;
    var line = cut(progress);
    for (var j = 0; j < th.length; j++) data[4 * j + 3] = th[j] < line ? 0 : 255;
    ctx.putImageData(image, 0, 0);
    if (progress < 1) requestAnimationFrame(frame);
    else canvas.style.display = "none";
  };
  requestAnimationFrame(frame);
}

export const introScript = `(${runIntro})(${ditherThresholds}, ${ditherCut}, ${DITHER_PX}, ${INTRO_MS})`;
```

- [ ] **Step 8: Run the tests and watch them pass**

Run: `npm test`
Expected: PASS, all suites.

- [ ] **Step 9: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add src/lib/theme.js src/lib/theme.test.mjs src/lib/dither.js src/lib/dither.test.mjs
git commit -m "feat: theme rules and dither maths as tested pure modules

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Sticky header and the animated theme switch

**Files:**
- Create: `src/component/SiteHeader.jsx`, `src/component/ThemeToggle.jsx`
- Modify: `src/component/Logo.jsx`, `src/app/globals.css` (append), `src/app/layout.js`

**Interfaces:**
- Consumes: `THEME_KEY`, `nextTheme`, `themeScript` from `@/lib/theme`; `DITHER_PX`, `THEME_MS`, `ditherCut`, `ditherThresholds` from `@/lib/dither`; `dark:` variant, `max-w-col`, tokens from Task 1.
- Produces: `<SiteHeader />` (default export, server component); `<ThemeToggle />` (default export, client).

- [ ] **Step 1: Write `src/component/ThemeToggle.jsx`**

```jsx
"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { DITHER_PX, THEME_MS, ditherCut, ditherThresholds } from "@/lib/dither";
import { THEME_KEY, nextTheme } from "@/lib/theme";

const FRAMES = 30;
let cached = null;

// The dither as mask keyframes: FRAMES snapshots of the dissolve, each a
// small canvas turned into a data URL and scaled up DITHER_PX times. Built
// on the first switch and reused until the viewport size changes.
const maskFrames = () => {
  const cols = Math.ceil(innerWidth / DITHER_PX);
  const rows = Math.ceil(innerHeight / DITHER_PX);
  const key = `${cols}x${rows}`;
  if (cached?.key === key) return cached.frames;

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(cols, rows);
  const thresholds = ditherThresholds(cols, rows);
  const frames = Array.from({ length: FRAMES }, (_, k) => {
    const line = ditherCut(k / (FRAMES - 1));
    for (let i = 0; i < thresholds.length; i++) {
      image.data[4 * i + 3] = thresholds[i] < line ? 255 : 0;
    }
    ctx.putImageData(image, 0, 0);
    return {
      maskImage: `url(${canvas.toDataURL()})`,
      maskSize: `${cols * DITHER_PX}px ${rows * DITHER_PX}px`,
      maskRepeat: "no-repeat",
      imageRendering: "pixelated",
    };
  });
  cached = { key, frames };
  return frames;
};

// Flips the theme and saves the choice. With View Transitions the new theme
// is revealed through the dither mask, top first; without them, or with
// reduced motion, it switches at once. Which icon shows is decided in CSS
// (the dark: variant), so the server and client markup are identical.
const ThemeToggle = () => {
  const toggle = () => {
    const root = document.documentElement;
    const next = nextTheme(
      root.dataset.theme,
      matchMedia("(prefers-color-scheme: dark)").matches,
    );
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Storage blocked (private mode): the switch still holds for this page.
      }
    };

    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    const frames = maskFrames();
    document.startViewTransition(apply).ready.then(
      () =>
        root.animate(frames, {
          duration: THEME_MS,
          pseudoElement: "::view-transition-new(root)",
        }),
      () => {},
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-ink active:scale-[0.97]"
    >
      <FiMoon className="size-4 dark:hidden" aria-hidden="true" />
      <FiSun className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
```

- [ ] **Step 2: Write `src/component/SiteHeader.jsx`**

```jsx
import Link from "next/link";
import Logo from "@/component/Logo";
import ThemeToggle from "@/component/ThemeToggle";

// Sticky header in the content column. Transparent over the top of the page;
// once the page scrolls, .site-header (globals.css) fades in a blurred
// surface and a hairline. Server component: only the toggle ships JS.
const SiteHeader = () => {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-col items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-4 text-[15px] text-muted sm:gap-6">
          <Link href="/projects" className="transition-colors hover:text-ink">
            Projects
          </Link>
          <Link href="/contact" className="transition-colors hover:text-ink">
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
```

- [ ] **Step 3: Recolour `src/component/Logo.jsx`**

Edits:

| Old | New |
|---|---|
| `import { jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `// else. Amber matches the string-literal accent in the hero.` | `// else. Green: the site's one accent colour.` |
| ``className={`${jetbrainsMono.className} group font-semibold text-lg tracking-tight text-[#A8ADB2] hover:text-gray-100 transition-colors duration-200`}`` | `className="font-mono group font-semibold text-lg tracking-tight text-ink-2 hover:text-ink transition-colors duration-200"` |
| `className="inline-block h-[1.32em] w-[0.6em] text-amber-300 group-hover:text-amber-200 transition-colors duration-200"` | `className="inline-block h-[1.32em] w-[0.6em] text-accent"` |

(The comment line to change is the last line of the block comment: `// else. Amber matches the string-literal accent in the hero.` Check the exact text in the file before editing.)

- [ ] **Step 4: Append header and View Transition rules to `src/app/globals.css`**

Add at the end of the file:

```css
/* Header backdrop. Always on as the fallback; where scroll-driven
   animations exist it starts transparent and fades in over the first 64px
   of scroll, so text never sits on a bare background in any browser. */
.site-header {
  background-color: color-mix(in oklab, var(--surface) 80%, transparent);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

@supports (animation-timeline: scroll()) {
  @keyframes header-at-top {
    from {
      background-color: transparent;
      border-bottom-color: transparent;
      -webkit-backdrop-filter: blur(0);
      backdrop-filter: blur(0);
    }
  }

  .site-header {
    animation: header-at-top linear both;
    animation-timeline: scroll(root);
    animation-range: 0 64px;
  }
}

/* Theme switch: ThemeToggle reveals the new snapshot through an animated
   dither mask, so the default cross-fade is switched off. */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

- [ ] **Step 5: Use the header and the theme script in `src/app/layout.js`**

Edits:

1. Imports: delete `import Link from "next/link";` and `import Logo from "@/component/Logo";`. Add:
   ```js
   import SiteHeader from "@/component/SiteHeader";
   import { themeScript } from "@/lib/theme";
   ```
2. Add `suppressHydrationWarning` to `<html>` (the head script sets `data-theme` before React hydrates), and a `<head>` as its first child:
   ```jsx
   <html
     lang="en"
     className={`${figtree.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
     suppressHydrationWarning
   >
     <head>
       {/* Applies a saved theme before first paint. See src/lib/theme.js. */}
       <script dangerouslySetInnerHTML={{ __html: themeScript }} />
     </head>
   ```
3. Replace the whole `{/* Header, main, and footer share one column ... */}` comment and `<header ...>...</header>` block with:
   ```jsx
   <SiteHeader />
   ```

- [ ] **Step 6: Lint and build**

Run: `npm run lint` then `npm run build`
Expected: both succeed. If lint reports `@next/next/no-head-element`, remove the `<head>` wrapper and make the theme `<script>` the first child of `<body>` instead; it still runs before any content is parsed.

- [ ] **Step 7: Check the switch in the browser**

Start `npm run dev` in the background. In a Chrome extension tab on `http://localhost:3000`, run:

```js
const root = document.documentElement;
const before = getComputedStyle(document.body).backgroundColor;
document.querySelector('button[aria-label="Toggle dark mode"]').click();
const after = getComputedStyle(document.body).backgroundColor;
({ theme: root.dataset.theme, saved: localStorage.getItem("theme"), before, after,
   sunShown: getComputedStyle(document.querySelector('button[aria-label="Toggle dark mode"] svg:last-child')).display })
```

Expected: `theme` and `saved` are equal ("light" or "dark"), `before !== after` (one is `rgb(252, 252, 251)`, the other `rgb(15, 15, 17)`), and `sunShown` is `"block"` when theme is "dark", `"none"` when "light". (The View Transition is skipped in this hidden tab; the callback still runs.) Reload the page and confirm `document.documentElement.dataset.theme` is still the saved value. Then run `localStorage.removeItem("theme")` to reset.

- [ ] **Step 8: Commit**

```bash
git add src/component/SiteHeader.jsx src/component/ThemeToggle.jsx src/component/Logo.jsx src/app/globals.css src/app/layout.js
git commit -m "feat: sticky header and a pixel-dissolve theme switch

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: First-load dissolve and the rise-in entrance

**Files:**
- Modify: `src/app/globals.css` (remove `.page-enter`, append cover and rise-in), `src/app/layout.js`, `src/component/motion/Reveal.jsx`, `src/app/page.js`

**Interfaces:**
- Consumes: `introScript` from `@/lib/dither`.
- Produces: CSS classes `.dither-cover` and `.rise-in` (stagger with inline style `--i`); `Reveal` default `y` is now 14.

- [ ] **Step 1: Remove `.page-enter` from `src/app/globals.css`**

Delete the block that starts with the comment `/* Server-rendered page entrance - replaces the framer-motion page wrapper so` and ends with the `@media (prefers-reduced-motion: reduce) { .page-enter { animation: none; } }` rule (three rules: the comment + `@keyframes page-enter`, `.page-enter`, and its media query).

- [ ] **Step 2: Append the cover and rise-in rules to `src/app/globals.css`**

```css
/* First-load cover (layout.js runs introScript from src/lib/dither.js right
   after it). The script sizes, paints and dissolves the canvas; this rule
   places it and, as a failsafe, hides it after 2s whatever the script did. */
.dither-cover {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 60;
  pointer-events: none;
  image-rendering: pixelated;
  animation: dither-failsafe 0s linear 2s forwards;
}

@keyframes dither-failsafe {
  to {
    visibility: hidden;
  }
}

/* Above-the-fold entrance: blocks rise 14px and settle. Stagger them with
   style={{ "--i": n }}. Below the fold, Reveal does the same on scroll. */
@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
}

.rise-in {
  animation: rise-in 0.56s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 60ms);
}

@media (prefers-reduced-motion: reduce) {
  .dither-cover {
    display: none;
  }

  .rise-in {
    animation: none;
  }
}
```

- [ ] **Step 3: Add the cover to `src/app/layout.js`**

1. Add the import: `import { introScript } from "@/lib/dither";`
2. Make these the first children of `<body>` (before the JSON-LD scripts):
   ```jsx
   {/* First-load pixel dissolve: the script right after the canvas paints
       and dissolves it while the HTML is still parsing, before React. */}
   <canvas className="dither-cover" aria-hidden="true" suppressHydrationWarning />
   <script dangerouslySetInnerHTML={{ __html: introScript }} />
   ```

- [ ] **Step 4: Retune `src/component/motion/Reveal.jsx`**

Edits:

| Old | New |
|---|---|
| `  y = 30,` | `  y = 14,` |
| `          : { duration: 0.6, ease: "easeOut", delay }` | `          : { duration: 0.56, ease: [0.22, 1, 0.36, 1], delay }` |
| `rather than fading in over 0.6s.` | `rather than fading in over 0.56s.` |

- [ ] **Step 5: Update `src/app/page.js`**

| Old | New |
|---|---|
| `The entrance animation is the` | `The hero's entrance is the` |
| ``// CSS `.page-enter` keyframe;`` | ``// CSS `.rise-in` keyframe;`` |
| `<main className="page-enter flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10">` | `<main className="flex-grow mx-auto max-w-col w-full px-6 pt-10 pb-6 lg:pt-16 mb-10">` |

- [ ] **Step 6: Run tests, lint and build**

Run: `npm test`, `npm run lint`, `npm run build`
Expected: all pass.

- [ ] **Step 7: Check the cover in the browser**

Reload `http://localhost:3000` in the extension tab and immediately run:

```js
const c = document.querySelector(".dither-cover");
({ next: c.nextElementSibling.tagName, width: c.width, expected: Math.ceil(innerWidth / 3),
   height: c.height, expectedH: Math.ceil(innerHeight / 3), visibility: getComputedStyle(c).visibility })
```

Expected: `next` is `"SCRIPT"`, `width === expected`, `height === expectedH` (the script ran and sized it), `visibility` `"visible"`. Wait 2.5s and read `getComputedStyle(c).visibility` again: `"hidden"` (failsafe; rAF is paused in this tab, so the dissolve itself cannot run here). Check the console for hydration warnings: there must be none.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/layout.js src/component/motion/Reveal.jsx src/app/page.js
git commit -m "feat: first-load pixel dissolve and rise-in entrance

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Smooth scroll and the click burst; remove the cursor glow

**Files:**
- Create: `src/component/motion/SmoothScroll.jsx`, `src/component/motion/ClickBurst.jsx`
- Modify: `package.json`, `package-lock.json` (via npm), `src/app/globals.css` (append), `src/app/layout.js`
- Delete: `src/component/MouseHoverEffect.jsx`

**Interfaces:**
- Produces: `<SmoothScroll />`, `<ClickBurst />` (default exports, client, render `null`).

- [ ] **Step 1: Install Lenis**

Run: `npm install lenis@1.3.26`
Then: `ls node_modules/lenis/dist/lenis.css`
Expected: the file exists, and `package.json` lists `"lenis": "^1.3.26"` under dependencies.

- [ ] **Step 2: Write `src/component/motion/SmoothScroll.jsx`**

```jsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Inertial wheel and trackpad scrolling; touch keeps the phone's own
// momentum. Lenis moves the real window scroll position, so framer-motion's
// whileInView and useScroll and the header's CSS scroll timeline keep
// working. Reduced motion is read inside the effect, never in markup (this
// renders none).
const SmoothScroll = () => {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
```

- [ ] **Step 3: Write `src/component/motion/ClickBurst.jsx`**

```jsx
"use client";

import { useEffect } from "react";

// Directions of the five lines, as rotations of a line pointing down:
// left, up-left, up, up-right, right.
const ANGLES = [90, 135, 180, 225, 270];

// Five short lines spray from every left mouse click and fade (.click-burst
// in globals.css, hidden there under reduced motion). Mouse only: on touch a
// tap is usually a scroll or a link, and the burst would sit under a finger.
// Renders nothing.
const ClickBurst = () => {
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      for (const angle of ANGLES) {
        const line = document.createElement("span");
        line.style.setProperty("--a", `${angle}deg`);
        burst.append(line);
      }
      document.body.append(burst);
      setTimeout(() => burst.remove(), 500);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
};

export default ClickBurst;
```

- [ ] **Step 4: Append the click-burst rules to `src/app/globals.css`**

```css
/* ClickBurst.jsx: five 1px lines from the click point, gone in 0.42s. */
.click-burst {
  position: fixed;
  z-index: 60;
  pointer-events: none;
}

.click-burst span {
  position: absolute;
  left: -0.5px;
  top: 0;
  width: 1px;
  height: 6px;
  background: var(--ink-2);
  transform-origin: 50% 0;
  animation: click-burst 0.42s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
}

@keyframes click-burst {
  from {
    transform: rotate(var(--a)) translateY(4px) scaleY(1);
    opacity: 1;
  }
  to {
    transform: rotate(var(--a)) translateY(13px) scaleY(0.3);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .click-burst {
    display: none;
  }
}
```

- [ ] **Step 5: Swap the glow for the new pieces in `src/app/layout.js`**

1. Delete `import MouseHoverEffect from "@/component/MouseHoverEffect";` and add:
   ```js
   import SmoothScroll from "@/component/motion/SmoothScroll";
   import ClickBurst from "@/component/motion/ClickBurst";
   ```
2. Replace `<MouseHoverEffect />` with:
   ```jsx
   <SmoothScroll />
   <ClickBurst />
   ```

- [ ] **Step 6: Delete the glow component**

Run: `git rm src/component/MouseHoverEffect.jsx`
Then: `grep -rn "MouseHoverEffect" src`
Expected: no output.

- [ ] **Step 7: Lint and build**

Run: `npm run lint` then `npm run build`
Expected: both succeed.

- [ ] **Step 8: Check both in the browser**

Reload `http://localhost:3000` in the extension tab and run:

```js
window.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0, clientX: 200, clientY: 200 }));
({ lenis: document.documentElement.classList.contains("lenis"),
   bursts: document.querySelectorAll(".click-burst").length,
   lines: document.querySelectorAll(".click-burst span").length })
```

Expected: `lenis: true`, `bursts: 1`, `lines: 5`. (Smooth-scroll feel itself is for Justine to judge in a real browser.)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json src/component/motion/SmoothScroll.jsx src/component/motion/ClickBurst.jsx src/app/globals.css src/app/layout.js
git commit -m "feat: Lenis smooth scroll and click burst; drop the cursor glow

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(`git rm` in Step 6 already staged the deletion.)

---

### Task 6: The hero

**Files:**
- Create: `public/justine.jpg`, `public/Justine_Jude_Cuevas_Resume.pdf`
- Modify: `src/lib/site.js`, `src/component/HeroSection.jsx` (full replacement)

**Interfaces:**
- Consumes: `.rise-in`, `pill`, tokens.
- Produces: `resumeUrl` export in `@/lib/site`.

- [ ] **Step 1: Crop the photo**

Write this script to `$env:TEMP\justine-crop.ps1` (outside the repo; it is a one-off):

```powershell
param([string]$Source, [string]$Dest, [int]$X, [int]$Y, [int]$Size, [int]$Out = 480)
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile($Source)
$bmp = New-Object System.Drawing.Bitmap $Out, $Out
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $Out, $Out), (New-Object System.Drawing.Rectangle $X, $Y, $Size, $Size), [System.Drawing.GraphicsUnit]::Pixel)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq "image/jpeg"
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 90L
$bmp.Save($Dest, $codec, $params)
$g.Dispose(); $bmp.Dispose(); $src.Dispose()
Get-Item $Dest | Select-Object Name, Length
```

Run it with PowerShell:

```powershell
& "$env:TEMP\justine-crop.ps1" -Source "C:\Users\justine\Downloads\542665530_800969639027801_601551259716625810_n.jpg" -Dest "C:\Users\justine\Documents\code\justine-portfolio\public\justine.jpg" -X 265 -Y 150 -Size 600
```

Expected: `justine.jpg`, about 31 KB. Open it with the Read tool: a 480x480 head-and-shoulders crop with the face roughly centred.

- [ ] **Step 2: Copy the resume**

Run: `cp "/c/Users/justine/Documents/code/job-hunt/Justine_Jude_Cuevas_Resume.pdf" /c/Users/justine/Documents/code/justine-portfolio/public/`
Expected: `public/Justine_Jude_Cuevas_Resume.pdf` exists (about 69 KB). It contains Justine's WhatsApp number; committing it puts the number in this public repo's history for good. Justine was told and chose to use it "for now"; if they supply a version without the number before this step, use that file instead.

- [ ] **Step 3: Add `resumeUrl` to `src/lib/site.js`**

Append after the `linkedin` line:

```js
// Served from public/. Replace the file to update the resume; the name stays.
export const resumeUrl = "/Justine_Jude_Cuevas_Resume.pdf";
```

- [ ] **Step 4: Replace `src/component/HeroSection.jsx`**

```jsx
import Image from "next/image";
import { FiFileText, FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";
import { availability } from "@/data/availability";
import { github, linkedin, resumeUrl } from "@/lib/site";

// Server component on purpose: the name lands in the initial HTML. Who,
// what, where: photo, name and role with the resume beside them, then the
// tagline as the headline. The three blocks rise in 60ms apart (.rise-in in
// globals.css) while the first-load dissolve clears.
const HeroSection = () => {
  return (
    <section className="mb-20">
      {/* Phones: photo on the left of name and role, resume pill under
          them. sm and up: one row, pill on the right. */}
      <div
        className="rise-in grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 sm:grid-cols-[auto_1fr_auto]"
        style={{ "--i": 0 }}
      >
        <Image
          src="/justine.jpg"
          alt="Justine Jude Cuevas"
          width={80}
          height={80}
          loading="eager"
          className="row-span-2 size-16 rounded-full object-cover sm:row-span-1 sm:size-20"
        />
        <div>
          <h1 className="text-[22px] font-semibold leading-tight text-ink">
            Justine Jude Cuevas
          </h1>
          <p className="text-[17px] text-muted">AI Full-Stack Engineer</p>
        </div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill col-start-2 justify-self-start sm:col-start-3"
        >
          <FiFileText className="size-4" aria-hidden="true" />
          Resume
        </a>
      </div>

      <p
        className="rise-in mt-8 text-[1.75rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-[2.125rem]"
        style={{ "--i": 1 }}
      >
        I build LLM-powered products end to end, and the{" "}
        <em className="font-serif font-normal italic">agent tooling</em> I
        build them with.
      </p>

      <div
        className="rise-in mt-8 flex flex-wrap items-center gap-x-4 gap-y-3"
        style={{ "--i": 2 }}
      >
        {availability.open ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {availability.note}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-hover px-3 py-1 text-sm font-medium text-muted">
            Currently booked
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <FiMapPin className="size-3.5" aria-hidden="true" />
          Philippines
        </span>
        <span className="flex items-center gap-3 text-muted">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="transition-colors hover:text-ink"
          >
            <FiGithub className="size-5" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="transition-colors hover:text-ink"
          >
            <FiLinkedin className="size-5" />
          </a>
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint` then `npm run build`
Expected: both succeed.

- [ ] **Step 6: Look at the hero in both themes and on a phone**

In the extension tab at `http://localhost:3000`, wait 2.5s after load, then screenshot the hero with `document.documentElement.dataset.theme = "light"` and again with `"dark"`. Resize the window to 390px wide and screenshot once more. Expected: photo circle with the face visible; name, role; Resume pill at the right (desktop) or under the name (phone); headline with "agent tooling" in serif italic; green availability badge. Check that `http://localhost:3000/Justine_Jude_Cuevas_Resume.pdf` returns 200 (`fetch(...).then(r => r.status)`).

- [ ] **Step 7: Commit**

```bash
git add public/justine.jpg public/Justine_Jude_Cuevas_Resume.pdf src/lib/site.js src/component/HeroSection.jsx
git commit -m "feat: hero with photo, name, role and a Resume pill

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Home sections

**Files:**
- Modify: `src/component/SectionHeading.jsx` (full replacement), `src/component/ProjectCard.jsx` (full replacement), `src/component/AboutMeSection.jsx`, `src/component/DeveloperCard.jsx`, `src/component/ExperienceSection.jsx`, `src/component/HackathonSection.jsx`, `src/component/TechStackSection.jsx`, `src/component/GithubSection.jsx`, `src/component/TestimonialsSection.jsx`, `src/component/ProjectSection.jsx`, `src/data/hackathons.js` (one comment)

**Interfaces:**
- Produces: `SectionHeading({ title, lede?, action?, className? })` with no `eyebrow` prop; `ProjectCard({ project, variants, headingLevel })` unchanged signature, now a row (Task 8's `ProjectsView` relies on it).

In every table below, "Old" is an exact string in the file and "New" replaces it; "(all)" means every occurrence.

- [ ] **Step 1: Replace `src/component/SectionHeading.jsx`**

This includes Justine's uncommitted edit (no `eyebrow` param).

```jsx
// One heading for every home section: a small muted label (still the
// section's h2) over a hairline, an optional right-aligned action such as
// "View all", and an optional lede. Server-safe: no hooks, no motion.
const SectionHeading = ({ title, lede, action, className = "mb-6" }) => {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-sm font-medium text-muted">{title}</h2>
        {action}
      </div>
      {lede && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-body">
          {lede}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
```

- [ ] **Step 2: Replace `src/component/ProjectCard.jsx`**

```jsx
"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// One project as a row, used by the home page and /projects: a small cover,
// then name, summary, stack and links, with a soft fill on hover. Case study
// is the primary action; live demo and code are secondary.
// headingLevel: "h3" under a section h2 (home), "h2" directly under a page h1.
const ProjectCard = ({ project, variants, headingLevel = "h3" }) => {
  const Heading = headingLevel;

  return (
    <motion.div
      variants={variants}
      className="group -mx-3 flex flex-col gap-4 rounded-card px-3 py-5 transition-colors duration-150 hover:bg-hover sm:flex-row sm:gap-5"
    >
      <div
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-card border border-line sm:w-40"
        style={project.image ? undefined : { background: project.gradientStyle }}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.name} landing page`}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover object-top"
          />
        )}
      </div>

      <div className="min-w-0">
        <Heading className="font-semibold text-ink">{project.name}</Heading>
        <p className="mt-1 text-sm leading-relaxed text-body">
          {project.summary}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {project.stack.join(" · ")}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="group/case inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
          >
            Read case study
            <FiArrowRight className="size-3.5 transition-transform group-hover/case:translate-x-1" />
          </Link>
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <FiExternalLink className="size-3.5" />
              Live Demo
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <FiGithub className="size-3.5" />
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

- [ ] **Step 3: `src/component/ProjectSection.jsx`**

| Old | New |
|---|---|
| `import { inter } from "@/app/fonts";\n` | *(delete the line)* |
| `const cardVariant = fadeInUp(30, 0.5);` | `const cardVariant = fadeInUp(14, 0.5);` |
| `<Reveal as="div" y={20}>` | `<Reveal as="div">` |
| `          eyebrow="selected work"\n` | *(delete the line)* |
| ``className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors group/link whitespace-nowrap`}`` | `className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group/link whitespace-nowrap"` |
| `className="grid grid-cols-1 md:grid-cols-2 gap-5"` | `className="divide-y divide-line"` |

- [ ] **Step 4: `src/component/AboutMeSection.jsx`**

| Old | New |
|---|---|
| `import { inter } from "@/app/fonts";\n` | *(delete the line)* |
| `<SectionHeading eyebrow="about" title="About me" />` | `<SectionHeading title="About me" />` |
| ``className={`${inter.className} md:col-span-3 text-[#A8ADB2] leading-relaxed space-y-4`}`` | `className="md:col-span-3 text-[17px] text-body leading-relaxed space-y-4"` |

- [ ] **Step 5: `src/component/DeveloperCard.jsx`**

| Old | New |
|---|---|
| `import { jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `// Colours stay inside the site's palette: strings amber, everything else` | `// Colours stay inside the site's palette: strings green, everything else` |
| `<span className="text-neutral-500">{children}</span>` | `<span className="text-faint">{children}</span>` |
| `<span className="text-amber-300">&quot;{children}&quot;</span>` | `<span className="text-accent">&quot;{children}&quot;</span>` |
| `<span className="text-neutral-200">{String(value)}</span>` | `<span className="text-ink-2">{String(value)}</span>` |
| `<TiltCard className="rounded-xl border border-neutral-700/60 bg-neutral-900/80 backdrop-blur-sm p-5 shadow-2xl shadow-black/40">` | `<TiltCard className="rounded-card border border-line-strong bg-surface/80 backdrop-blur-sm p-5 shadow-xl shadow-black/5 dark:shadow-black/40">` |
| ``className={`${jetbrainsMono.className} text-xs leading-relaxed overflow-x-auto`}`` | `className="font-mono text-xs leading-relaxed overflow-x-auto"` |
| `<span className="text-neutral-400">const</span>` | `<span className="text-muted">const</span>` |
| `<span className="text-gray-100">developer</span>` | `<span className="text-ink">developer</span>` |
| `<span className="text-neutral-300">{key}</span>` | `<span className="text-ink-2">{key}</span>` |

The red/yellow/green traffic-light dots stay as they are.

- [ ] **Step 6: `src/component/ExperienceSection.jsx`**

| Old | New |
|---|---|
| `import { inter, jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `amber as the rail is drawn past it.` | `green as the rail is drawn past it.` |
| `<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />` | `<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />` |
| `<span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-green-500" />` | `<span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-accent" />` |
| `ring-4 ring-neutral-900 transition-colors duration-300 motion-reduce:bg-neutral-600 ${` | `ring-4 ring-bg transition-colors duration-300 motion-reduce:bg-faint ${` |
| `lit ? "bg-amber-300" : "bg-neutral-600"` | `lit ? "bg-accent" : "bg-faint"` |
| `// The amber rail draws from the top as the list scrolls through the` | `// The green rail draws from the top as the list scrolls through the` |
| `<SectionHeading eyebrow="experience" title="Work experience" />` | `<SectionHeading title="Work experience" />` |
| `className="absolute left-[5px] top-2 bottom-2 w-px bg-neutral-800"` | `className="absolute left-[5px] top-2 bottom-2 w-px bg-line"` |
| `className="absolute left-[5px] top-2 bottom-2 w-px bg-amber-300/70 origin-top motion-reduce:hidden"` | `className="absolute left-[5px] top-2 bottom-2 w-px bg-accent/70 origin-top motion-reduce:hidden"` |

Then wrap the entry's text in a hover-fill box. Replace the block from `      {job.type && (` down to and including the closing `      )}` of the `{job.tech?.length > 0 && (...)}` block (everything after the dot, before `    </div>\n  );\n};`) with:

```jsx
      {/* Hover fill on the text only, so the dot and rail stay put. The
          negative margins keep the layout identical to the unpadded box. */}
      <div className="-mx-3 -my-2 rounded-card px-3 py-2 transition-colors duration-150 hover:bg-hover">
        {job.type && (
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
            {job.type}
          </p>
        )}

        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-ink font-semibold">
            {job.title}
            <span className="text-muted font-normal"> · {job.company}</span>
          </h3>
          <span className="text-xs text-muted whitespace-nowrap">
            {job.dates}
          </span>
        </div>

        {job.location && (
          <p className="text-xs text-muted mt-1">{job.location}</p>
        )}

        {job.description && (
          <p className="text-sm text-body leading-relaxed mt-2">
            {job.description}
          </p>
        )}

        {job.metrics?.length > 0 && (
          <ul className="font-mono text-xs text-muted mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {job.metrics.map((metric, i) => (
              <li key={metric.label}>
                <span className="sr-only">{metric.sentence}</span>
                <span aria-hidden="true">
                  {i > 0 && <span className="text-faint mr-3">·</span>}
                  <span className="text-ink-2">
                    {metric.before ? `${metric.before} → ${metric.after}` : metric.after}
                  </span>{" "}
                  {metric.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {job.tech?.length > 0 && (
          <p className="text-xs text-muted mt-3">{job.tech.join("  ·  ")}</p>
        )}
      </div>
```

- [ ] **Step 7: `src/component/HackathonSection.jsx`**

| Old | New |
|---|---|
| `import { inter, jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `        eyebrow="hackathons"\n` | *(delete the line)* |
| `className="border-t border-neutral-800 divide-y divide-neutral-800"` | `className="divide-y divide-line"` |
| ``className={`${jetbrainsMono.className} uppercase tracking-wider pt-0.5 ${`` | ``className={`font-mono uppercase tracking-wider pt-0.5 ${`` |
| `? "text-xs font-semibold text-amber-300"` | `? "text-xs font-semibold text-accent"` |
| `: "text-[11px] text-neutral-500"` | `: "text-[11px] text-muted"` |
| ``<h3 className={`${inter.className} text-gray-100 font-medium`}>`` | `<h3 className="text-ink font-medium">` |
| `<span className="text-neutral-500 font-normal"> · {item.org}</span>` | `<span className="text-muted font-normal"> · {item.org}</span>` |
| ``className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-1.5`}`` | `className="text-sm text-body leading-relaxed mt-1.5"` |

In `src/data/hackathons.js`, line 6: `// is what turns the tag amber.` becomes `// is what turns the tag green.`

- [ ] **Step 8: `src/component/TechStackSection.jsx`**

| Old | New |
|---|---|
| `import { inter, jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `<span className="text-amber-300">{contexts.join(" · ")}</span>` | `<span className="text-accent">{contexts.join(" · ")}</span>` |
| ``className={`${active ? jetbrainsMono.className : inter.className} caption-in block`}`` | ``className={`${active ? "font-mono " : ""}caption-in block`}`` |
| `          eyebrow="stack"\n` | *(delete the line)* |
| ``className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-400 pt-1`}`` | `className="font-mono text-[11px] uppercase tracking-wider text-muted pt-1"` |
| ``className={`${inter.className} inline-flex items-center gap-1.5 text-sm cursor-default rounded-sm transition-[color,opacity] duration-200 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 ${`` | ``className={`inline-flex items-center gap-1.5 text-sm cursor-default rounded-sm transition-[color,opacity] duration-200 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-muted ${`` |
| `? "text-amber-300"` | `? "text-accent"` |
| `: "text-neutral-300 hover:text-gray-100"` | `: "text-ink-2 hover:text-ink"` |

- [ ] **Step 9: `src/component/GithubSection.jsx`**

| Old | New |
|---|---|
| `import { jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `"text-neutral-700",` | `"text-faint",` |
| `"text-amber-300/40",` | `"text-accent/40",` |
| `"text-amber-300/60",` | `"text-accent/60",` |
| `"text-amber-300/80",` | `"text-accent/80",` |
| `"text-amber-300",` | `"text-accent",` |
| `        eyebrow="github"\n` | *(delete the line)* |
| ``className={`${jetbrainsMono.className} inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-gray-100 transition-colors whitespace-nowrap`}`` | `className="font-mono inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors whitespace-nowrap"` |
| ``<p className={`${jetbrainsMono.className} text-sm text-neutral-400 mb-4`}>`` | `<p className="font-mono text-sm text-muted mb-4">` |
| `<span className="text-gray-100">{total}</span>` | `<span className="text-ink">{total}</span>` |
| ``className={`${jetbrainsMono.className} w-max text-sm leading-none tracking-[0.35em]`}`` | `className="font-mono w-max text-sm leading-none tracking-[0.35em]"` |

- [ ] **Step 10: `src/component/TestimonialsSection.jsx`**

| Old | New |
|---|---|
| `import { inter } from "@/app/fonts";\n` | *(delete the line)* |
| `<SectionHeading eyebrow="testimonials" title="What clients say" />` | `<SectionHeading title="What clients say" />` |
| `<figure className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-6">` | `<figure className="rounded-card border border-line-strong bg-surface p-6">` |
| ``className={`${inter.className} text-gray-100 text-lg leading-relaxed`}`` | `className="text-ink text-lg leading-relaxed"` |
| ``className={`${inter.className} text-sm text-neutral-400 mt-4`}`` | `className="text-sm text-muted mt-4"` |
| `<span className="text-neutral-200 font-medium">{featured.name}</span>` | `<span className="text-ink-2 font-medium">{featured.name}</span>` |
| `decoration-neutral-700 hover:text-neutral-100` | `decoration-line-strong hover:text-ink` |

- [ ] **Step 11: Check nothing on the home page still uses the old palette**

Run:
```bash
grep -rnE "amber|inter\.className|jetbrainsMono\.className|A8ADB2|neutral-|gray-|eyebrow" src/component src/data/hackathons.js
```
Expected: matches only in files Task 8 handles (`CaseStudyView.jsx`, `TimezoneLine.jsx`, `ScrollProgress.jsx`). Nothing in the files touched above.

- [ ] **Step 12: Lint, test, build**

Run: `npm run lint`, `npm test`, `npm run build`
Expected: all pass.

- [ ] **Step 13: Look at the home page**

In the extension tab, wait 2.5s after load, then screenshot each section in light and dark (`document.documentElement.dataset.theme = ...`, scroll with `window.scrollTo(0, y)`). Expected: small grey section labels over a hairline; experience rail and lit dots green; project rows with thumbnails; ASCII calendar green if the GitHub section renders (it needs `GITHUB_TOKEN`); code card readable in both themes.

- [ ] **Step 14: Commit**

```bash
git add src/component/SectionHeading.jsx src/component/ProjectCard.jsx src/component/ProjectSection.jsx src/component/AboutMeSection.jsx src/component/DeveloperCard.jsx src/component/ExperienceSection.jsx src/component/HackathonSection.jsx src/component/TechStackSection.jsx src/component/GithubSection.jsx src/component/TestimonialsSection.jsx src/data/hackathons.js
git commit -m "feat: home sections on the new tokens, labels and project rows

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Other pages, footer, and removing Inter

**Files:**
- Modify: `src/app/projects/ProjectsView.jsx`, `src/component/CaseStudyView.jsx`, `src/app/contact/ContactView.jsx`, `src/component/TimezoneLine.jsx`, `src/component/ScrollProgress.jsx`, `src/app/not-found.js` (full replacement), `src/app/layout.js` (footer, font import), `src/app/fonts.js` (drop `inter`)

**Interfaces:**
- Consumes: `ProjectCard` row (Task 7), `pill`, tokens.
- Produces: `fonts.js` exports only `figtree`, `newsreader`, `jetbrainsMono`.

Page titles (h1) on /projects, case studies, /contact and 404 take the hero headline style: `text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink`.

- [ ] **Step 1: `src/app/projects/ProjectsView.jsx`**

| Old | New |
|---|---|
| `import { inter } from "@/app/fonts";\n` | *(delete the line)* |
| `const cardVariant = fadeInUp(30, 0.5);` | `const cardVariant = fadeInUp(14, 0.5);` |
| `max-w-3xl` | `max-w-col` |
| ``className={`${inter.className} font-bold text-4xl text-gray-100 mb-3`}`` | `className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3"` |
| ``className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-2xl`}`` | `className="text-body text-[15px] leading-relaxed max-w-xl"` |
| `className="grid grid-cols-1 md:grid-cols-2 gap-5"` | `className="divide-y divide-line"` |

- [ ] **Step 2: `src/component/CaseStudyView.jsx`**

| Old | New |
|---|---|
| `import { inter, jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| `<SharedReveal as="div" y={24} className={className}>` | `<SharedReveal as="div" className={className}>` |
| `max-w-3xl w-full px-6 pt-8 pb-24 lg:pt-12 text-[#A8ADB2]` | `max-w-col w-full px-6 pt-8 pb-24 lg:pt-12 text-body text-[17px]` |
| ``className={`${inter.className} group inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors mb-8`}`` | `className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"` |
| ``<p className={`${jetbrainsMono.className} text-neutral-500 text-sm mb-3`}>`` | `<p className="font-mono text-muted text-sm mb-3">` |
| ``className={`${inter.className} font-bold text-4xl text-gray-100 mb-3`}`` | `className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3"` |
| ``<p className={`${inter.className} text-lg leading-relaxed max-w-2xl mb-8`}>`` | `<p className="text-lg leading-relaxed max-w-xl mb-8">` |
| `rounded-xl border border-neutral-700/60 bg-neutral-800/30` (all, 3) | `rounded-card border border-line-strong bg-surface` |
| ``className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 mb-1`}`` | `className="font-mono text-[11px] uppercase tracking-wider text-muted mb-1"` |
| ``<p className={`${inter.className} text-sm text-neutral-300`}>`` | `<p className="text-sm text-ink-2">` |
| ``className={`${jetbrainsMono.className} text-2xl font-semibold text-gray-100 mb-1`}`` | `className="font-mono text-2xl font-semibold text-ink mb-1"` |
| ``<p className={`${inter.className} text-xs text-neutral-500`}>`` | `<p className="text-xs text-muted">` |
| ``className={`${inter.className} text-gray-100 text-xl font-bold mb-4`}`` (all, 3) | `className="text-ink text-xl font-semibold mb-4"` |
| ``<p className={`${inter.className} leading-relaxed`}>{project.problem}</p>`` | `<p className="leading-relaxed">{project.problem}</p>` |
| ``<div className={`${inter.className} space-y-4 leading-relaxed`}>`` | `<div className="space-y-4 leading-relaxed">` |
| `className="relative aspect-[16/9] rounded-2xl border border-white/[0.06] overflow-hidden"` | `className="relative aspect-[16/9] rounded-card border border-line overflow-hidden"` |
| ``className={`${inter.className} text-xs text-neutral-500 mt-2`}`` | `className="text-xs text-muted mt-2"` |
| ``<ul className={`${inter.className} space-y-3`}>`` | `<ul className="space-y-3">` |
| `className="w-4 h-4 text-green-500/80 mt-1 shrink-0"` | `className="w-4 h-4 text-accent mt-1 shrink-0"` |
| ``className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 mb-2`}`` | `className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2"` |
| ``className={`${inter.className} text-sm text-neutral-400 leading-relaxed`}`` | `className="text-sm text-body leading-relaxed"` |
| ``className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}`` (all, 2) | `className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"` |
| `<div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-8 text-center">` | `<div className="rounded-card border border-line-strong bg-surface p-8 text-center">` |
| ``className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}`` | `className="text-ink text-xl font-semibold mb-2"` |
| ``className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-6`}`` | `className="text-body text-sm leading-relaxed max-w-md mx-auto mb-6"` |
| ``className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}`` | `className="pill group"` |

- [ ] **Step 3: `src/app/contact/ContactView.jsx`**

| Old | New |
|---|---|
| `import { inter } from "@/app/fonts";\n` | *(delete the line)* |
| `max-w-3xl` | `max-w-col` |
| ``className={`${inter.className} mb-10`}`` | `className="mb-10"` |
| `<h1 className="text-gray-100 text-3xl font-bold mb-3">` | `<h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">` |
| `<p className="text-neutral-400 text-sm leading-relaxed max-w-2xl mb-4">` | `<p className="text-body text-[15px] leading-relaxed max-w-xl mb-4">` |
| `whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}` (all, 3) | `whileHover={{ y: -3 }}` |
| `className="h-36 rounded-xl flex` (all, 3) | `className="h-36 rounded-card flex` |
| `border border-neutral-700/60 bg-neutral-800/30` (all, 3) | `border border-line-strong bg-surface` |
| `hover:bg-neutral-800/60` (all, 3) | `hover:bg-hover` |
| `<FiCheck className="text-5xl text-green-500" />` | `<FiCheck className="text-5xl text-accent" />` |
| `text-5xl text-neutral-200` (all, 3) | `text-5xl text-ink-2` |
| ``className={`${inter.className} flex flex-col items-center gap-1`}`` | `className="flex flex-col items-center gap-1"` |
| `<span className="text-xs text-neutral-400 break-all px-2">` | `<span className="text-xs text-muted break-all px-2">` |
| `<span className="text-[11px] text-neutral-600">` | `<span className="text-[11px] text-muted">` |
| ``<span className={`${inter.className} text-xs text-neutral-400`}>`` (all, 2) | `<span className="text-xs text-muted">` |
| ``<div className={`${inter.className} mb-6`}>`` | `<div className="mb-6">` |
| `<h2 className="text-gray-100 text-xl font-bold mb-1">` | `<h2 className="text-ink text-xl font-semibold mb-1">` |
| `<p className="text-neutral-400 text-sm">` | `<p className="text-body text-sm">` |
| ``className={`${inter.className} text-gray-100`}`` | `className="text-ink"` |
| `className="text-sm font-medium text-neutral-300"` (all, 3) | `className="text-sm font-medium text-ink-2"` |
| `bg-neutral-800/50 border border-neutral-700/60 rounded-lg` (all, 3) | `bg-surface border border-line-strong rounded-card` |
| `text-neutral-100 placeholder-neutral-500` (all, 3) | `text-ink placeholder:text-muted` |
| `focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30` (all, 3) | `focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted/30` |

Then replace the submit button (the whole `<motion.button type="submit" ...>...</motion.button>` element) with:

```jsx
          <button type="submit" disabled={loading} className="pill">
            <FiSend className="w-4 h-4" />
            {loading ? "Sending..." : "Send Message"}
          </button>
```

- [ ] **Step 4: `src/component/TimezoneLine.jsx`**

| Old | New |
|---|---|
| `import { jetbrainsMono } from "@/app/fonts";\n` | *(delete the line)* |
| ``<p className={`${jetbrainsMono.className} text-xs text-neutral-400`}>`` | `<p className="font-mono text-xs text-muted">` |
| `<span className="text-neutral-200">` (all, 2) | `<span className="text-ink-2">` |

- [ ] **Step 5: `src/component/ScrollProgress.jsx`**

| Old | New |
|---|---|
| `bg-amber-300/70` | `bg-accent/70` |

- [ ] **Step 6: Replace `src/app/not-found.js`**

```jsx
import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 py-24 flex flex-col items-start text-body">
      <p className="font-mono text-muted mb-3">{`// 404`}</p>
      <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
        This page doesn&apos;t exist.
      </h1>
      <p className="leading-relaxed max-w-md mb-8">
        The link may be old, or the page may have moved. Everything worth
        seeing is one click away:
      </p>
      <div className="flex items-center gap-4">
        <Link href="/" className="pill">
          Back to home
        </Link>
        <Link
          href="/projects"
          className="text-sm text-muted hover:text-ink underline underline-offset-4 decoration-line-strong transition-colors"
        >
          See my work
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Footer and font import in `src/app/layout.js`**

| Old | New |
|---|---|
| `import { figtree, inter, jetbrainsMono, newsreader } from "./fonts";` | `import { figtree, jetbrainsMono, newsreader } from "./fonts";` |
| `<footer className="border-t border-solid border-gray-800">` | `<footer className="border-t border-line">` |
| `<div className="mx-auto max-w-3xl w-full px-6 min-h-15` | `<div className="mx-auto max-w-col w-full px-6 min-h-15` |
| ``className={`${inter.className} text-sm font-semibold text-[#A8ADB2] whitespace-nowrap`}`` | `className="text-sm font-medium text-muted whitespace-nowrap"` |
| ``className={`${jetbrainsMono.className} flex items-center gap-4 text-xs text-neutral-400`}`` | `className="font-mono flex items-center gap-4 text-xs text-muted"` |
| `className="hover:text-gray-100 transition-colors"` (all, 3) | `className="hover:text-ink transition-colors"` |

- [ ] **Step 8: Drop Inter from `src/app/fonts.js`**

Change the import to `import { Figtree, JetBrains_Mono, Newsreader } from "next/font/google";` and delete the `// Still imported by components until Task 8 ...` comment and the `export const inter = Inter({...});` block.

- [ ] **Step 9: Prove the old palette and Inter are gone**

Run:
```bash
grep -rnE "amber|inter\.className|jetbrainsMono\.className|\binter\b.*fonts|A8ADB2|neutral-|gray-|#111113|white/\[" src --include=*.js --include=*.jsx | grep -vE "opengraph-image|twitter-image"
```
Expected: no output.

- [ ] **Step 10: Lint, test, build**

Run: `npm run lint`, `npm test`, `npm run build`
Expected: all pass.

- [ ] **Step 11: Commit**

```bash
git add src/app/projects/ProjectsView.jsx src/component/CaseStudyView.jsx src/app/contact/ContactView.jsx src/component/TimezoneLine.jsx src/component/ScrollProgress.jsx src/app/not-found.js src/app/layout.js src/app/fonts.js
git commit -m "feat: projects, case study, contact and 404 on the new look; drop Inter

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Whole-site check and hand-off

**Files:** none changed unless a check fails.

- [ ] **Step 1: Full checks**

Run: `npm test`, `npm run lint`, `npm run build`
Expected: all pass. `git status --short` shows nothing unexpected (only untracked files that predate the branch, if any).

- [ ] **Step 2: Every page, both themes, desktop and phone**

With `npm run dev` running, in the extension tab visit `/`, `/projects`, one case study (`/projects/<slug>` from `src/data/projects.js`), `/contact`, and a missing page (`/nope`). On each: wait 2.5s, set `document.documentElement.dataset.theme` to `"light"` then `"dark"`, screenshot at full width and at 390px wide. Read the console after each load: no hydration warnings or errors.

Expected: text readable everywhere in both themes, no leftover dark-only greys on a light background, header blur visible after `window.scrollTo(0, 400)` (in Chrome, which supports scroll timelines), pills consistent.

- [ ] **Step 3: Hand to Justine for the motion check**

Ask Justine to open `http://localhost:3000` in their own browser and judge, with OS animations on:
1. the first-load dissolve (hard reload),
2. the theme switch dissolve (header toggle),
3. wheel and trackpad scroll feel,
4. the click burst and hover fills,
5. light-mode grain strength (`--grain-opacity`, default 0.035).

Record any tuning they ask for (timings live in `src/lib/dither.js`, `.rise-in` in `globals.css`, Lenis options in `SmoothScroll.jsx`) and apply it as a follow-up commit.

- [ ] **Step 4: Finish the branch**

Use superpowers:finishing-a-development-branch (PR from `feat/redesign-feel` to `main` with `gh`).
