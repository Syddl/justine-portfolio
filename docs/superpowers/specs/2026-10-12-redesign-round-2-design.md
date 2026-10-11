# Redesign round 2: Design Spec

**Date:** 2026-10-12
**Status:** Approved by Justine in chat (About text, macOS-style cursor, layout and page changes)
**Branch:** `feat/redesign-feel` (same branch as round 1, not yet pushed)
**Builds on:** `2026-10-11-redesign-feel-design.md`. Everything there stands
unless changed below. The mascot is still a separate, later spec.

## Goal

Six follow-ups after Justine looked at round 1: a personal About with a
better-proportioned code card, real hackathon placements, three more stack
items, a /projects page and site-wide pages built from the same parts, no
`//` eyebrows, and a macOS-style cursor.

## 1. About section

Text (approved verbatim on 2026-10-12, a shortened second version so the
text ends about level with the card; the full name stays in the first
sentence for search):

> I'm Justine Jude Cuevas. I was into video games and anything tech long
> before I wrote code: my first job was graphic design, and on the side I
> edited videos and made YouTube content.
>
> Curiosity about how games and apps work behind the scenes pulled me into
> programming, and I fell for it. These days it's school and AI, and when
> something grabs me, I lock in until it's done.
>
> Next, I want to work as an AI engineer. Want to talk shop? The inbox is
> open.

Rules: nothing about recent work (no employer, no day-job project); no SQL
competition; "AI", not "RAG". This supersedes the Sept 11 rule "About
mentions no past job or school": graphic design and school are now in, at
Justine's request.

Layout (revised 2026-10-12 after Justine saw the stacked version: "the side
is better"): the card stays beside the text on md and up, under it on
phones.

- Grid `md:grid-cols-[minmax(0,1fr)_18rem]`, `items-start`: a fixed 18rem
  card track so the code never clips.
- The card is `md:sticky md:top-24`, so it stays in view beside the longer
  text column instead of floating loose in the middle of it.
- Arrays print two items per line (they fit 18rem). The `<pre>` is
  `whitespace-pre-wrap` with no `overflow-x-auto`: on a very narrow phone a
  long line wraps instead of scrolling, so the card never slides sideways
  under a trackpad.
- The idle float keeps its vertical bob (8px) but loses its rotation; the
  pointer tilt drops from 9 to 3 degrees.

## 2. Hackathons

- PropTech Hackathon (Filipino Homes): tag **Top 5 finalist**, highlighted.
- Byte Forward Hackathon (Converge ICT): tag **Top 10 · Mindanao leg**,
  highlighted (green).
- The tag column widens from 7.5rem to 11rem so the longer tag fits.

## 3. Stack

- AI & agents: **Embeddings** (react-icons `PiVectorThree`).
- Data & storage: **pgvector** (`TbDatabaseSearch`) and **MySQL**
  (`SiMysql`). Order: PostgreSQL, pgvector, MySQL, Supabase, MongoDB,
  Firebase, Redis.

## 4. One set of parts on every page

Every page is built from: a page header (back link where there is a
parent, headline-style h1, one intro line), sections under a small muted
label with a hairline (`SectionHeading`), rows with a hover fill, and pills
for actions. No boxed cards except the code card and screenshots. No `//`
eyebrows anywhere.

### Project rows (home "Selected work" and /projects)

Each project is one link row to its case study: a 56x40 thumbnail, name,
one-line summary, a short `kind` tag on the right (under the summary on
phones), and an arrow. Live and code links move off the row; they remain
in the case study's Tech notes.

New data field `kind`: CooPilot **Thesis · team of 4**, QuizyLite
**Personal product**.

### /projects

`← Home` link, h1 "Projects", the intro line, then a "Selected work" label
with the project count on the right (`02`), then the rows. The intro's
last sentence changes from "the demo link is on its card" to "the demo link
is in its case study" because rows no longer carry it.

### Case study

`← All projects`, h1, tagline (no `// case study`). Role, Timeline and
Stack become a definition list of label/value rows between hairlines.
Results become plain large numbers (sans, 2rem) with a label under each,
no boxes. "The problem", "What I built", "How it went" and "Tech notes"
use `SectionHeading`. The closing call to action loses its box: a hairline,
the heading, the line, and the "Let's talk" pill, left-aligned.

### Contact

The three icon tiles become link rows between hairlines: an icon tile,
a name and handle, and on the right an arrow (LinkedIn, GitHub) or
"Copy"/"Copied" (email copies to the clipboard as before, falling back to
the mail app). Names: Email, LinkedIn, GitHub; handles come from
`src/lib/site.js`. Icons switch to the Feather set used in the hero. "Send
a message" becomes a `SectionHeading` with its existing lede.

### 404 and share image

`// 404` is removed. The share image line `// ai full-stack engineer ·
philippines` drops the `// `.

## 5. macOS-style cursor

Justine first picked a pixel-art cursor (option A), then asked for a macOS
design instead (2026-10-12). The pixel version is dropped.

- A black arrow with a white outline and a soft drop shadow on
  everything; a white pointing hand with a black outline on links,
  buttons, `summary`, `label[for]`, `select` and `[role=button]`. Text
  inputs keep the system text cursor; disabled pills keep `not-allowed`.
- Same cursor in both themes, as on macOS: the white outline carries it on
  dark backgrounds, the black fill on light ones.
- Inline SVG data URIs at 24x24. The arrow is drawn for this site; the hand
  is Phosphor Icons' "HandPointing" (MIT, already installed via
  react-icons): its outer contour filled white under its outline ring in
  black. Hotspots: arrow tip (3, 2), fingertip (11, 2).
- Pure CSS (`cursor: url(...) x y, auto`) in `@layer base`, so utilities
  can override. No JavaScript, nothing trails the pointer, nothing to turn
  off for reduced motion; touch screens never show it.
- Ceiling: browsers rasterise SVG cursors at 1x, so on 2x screens the
  edges are slightly soft. Upgrade path: `image-set()` with 2x PNGs if it
  bothers anyone.
- The stack section's tool buttons used `cursor-default`; they switch to a
  new `cursor-arrow` utility so they show the custom arrow, not the system
  one.

## Testing and verification

- `data.test.mjs`: every project has a `kind` of at most 24 characters.
- `npm test`, `npm run lint`, `npm run build` pass.
- Grep: no `cursor-pointer`, `cursor-default` or `//` eyebrow strings in
  `src/`.
- Browser: computed `cursor` on `<html>` contains the arrow data URI and
  on a link the hand; About card `<pre>` has `scrollWidth <= clientWidth`
  at desktop and phone widths; screenshots of About, /projects, a case
  study and /contact in both themes.
- Justine checks the cursor and the motion items from round 1 in a real
  browser before the PR.
