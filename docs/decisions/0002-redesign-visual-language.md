---
id: 0002
title: Lift the visual freeze for the 2026-10 redesign
date: 2026-10-12
status: accepted
superseded_by:
---

# Lift the visual freeze for the 2026-10 redesign

## Decision

The visual language is no longer the dark-only, amber-accented, Inter and JetBrains Mono look. It is now:

- Light and dark themes from colour tokens in `src/app/globals.css` (`light-dark()` pairs exposed to Tailwind as `text-ink`, `bg-surface`, `border-line` and so on). The OS picks the theme until the visitor toggles it; the choice is remembered.
- One chromatic accent: green (`accent`). Amber is retired.
- Figtree for text, Newsreader italic for the one accent word in the hero, JetBrains Mono for code-like details.
- Motion: a first-load pixel dissolve, the same dissolve on a theme switch, a rise-in entrance, Lenis smooth scrolling, a click burst, and a macOS-style CSS cursor.

The specs are `docs/superpowers/specs/2026-10-11-redesign-feel-design.md` and `docs/superpowers/specs/2026-10-12-redesign-round-2-design.md`. Components use the tokens only; no hex greys, `neutral-*`, `gray-*` or `amber-*` classes (the share images and the code card's traffic-light dots excepted).

## Why

Justine asked for the redesign on 2026-10-11, modelled on the feel of marwieang.com (light and dark themes, an animated switch, a smooth glide on scroll, a refined type pairing), and chose the green accent and the fonts. The earlier freeze recorded a preference that this replaces.

## Kill switch

None at runtime. Reverting means reverting the redesign commits; the tokens in `globals.css` are the single place the palette lives.

## Reopen only if

Justine asks for a different look, or a contrast check fails: every text token must stay at 4.5:1 or more on `bg`, `surface` and `hover` in both themes (`src/app/globals.test.mjs`).
