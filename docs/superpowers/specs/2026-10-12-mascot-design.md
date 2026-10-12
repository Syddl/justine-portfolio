# Mini Justine mascot: Design Spec

**Date:** 2026-10-12
**Status:** Approved by Justine in chat (character, placement, behaviour, lines, poses)
**Branch:** `feat/mascot`
**Reference:** sethyuri.vercel.app (pixel mascot that greets, reacts and appears in several sections). Builds on the redesign (`docs/decisions/0002-redesign-visual-language.md`).

## Goal

A small animated pixel version of Justine that greets visitors in the hero, reacts when clicked and when the theme changes, and makes two quiet cameos further down the page. It should feel alive without getting in the way of reading.

## Decisions made with the user

- Character: **Mini Justine** (chosen over a tarsier and a terminal caret): messy black hair with a fringe, grey hoodie with a blue print, black tee, from Justine's photo.
- Placement: **hero plus two cameos.** In the hero it stands under the status row with its speech bubble to the right (option A of three). Cameos: typing on a laptop in Tech stack, holding an envelope in Contact.
- Behaviour in the hero: waves with a time-of-day greeting, eyes follow the cursor, clicking makes it hop (squash and stretch) and say the next line, and it reacts to the theme toggle.
- Lines: approved verbatim (see Lines).
- Poses: approved as drawn (see Sprite).

## Non-goals

- A loader or anything that delays the page (the first-load dissolve stays the intro).
- A cursor follower (rejected in September; this mascot stays in place).
- Sound, extra pages, or a mascot on /projects and case studies.

## Sprite

Pixel maps are text grids, one character per pixel, 22 wide and 22 tall: the body is centred on column 9 and the two spare columns on the right hold the raised arm. `.` is transparent. A one-pixel outline is added automatically around every filled pixel (4-neighbourhood), so the drawn sprite is 24 by 24.

Palette (character art, so fixed colours; the only themed colour is the outline):

| Key | Colour | Use |
|---|---|---|
| `W` | `#f4f4f2` | eye whites, envelope |
| `K` | `#151517` | pupils, tee, shoes, sunglasses |
| `H` | `#1e1b1a` | hair |
| `h` | `#3d3634` | hair highlight |
| `S` | `#e6b38c` | skin |
| `s` | `#c48f6a` | mouth |
| `L` | `#cfcfd3` | hoodie |
| `M` | `#9a9aa1` | hood rim, laptop, envelope folds |
| `D` | `#55555c` | trousers, laptop edge |
| `B` | `#3b5bcc` | hoodie print |
| `G` | `#3fbf73` | laptop logo, envelope seal |
| outline | `light-dark(#1b1b1f, #6a6a72)` | a CSS token, so black hair keeps a visible rim on the dark background |

Base (idle):

```
......HHHHHHH.........
....HHHHHHHhHHH.......
...HHHHHHHHHhHHH......
..HHHHHHHHHHHHHHH.....
..HHHHHHHHHHHHHHHH....
.HHHHHHHHHHHHHHHHH....
.HHHSHHHHSHHHHSHHH....
..HSSSSSSSSSSSSSH.....
..HSSSSSSSSSSSSSH.....
..SSSWKWSSSWKWSSS.....
..SSSWKWSSSWKWSSS.....
..SSSSSSSSSSSSSSS.....
...SSSSSSsSSSSSS......
....SSSSSSSSSSS.......
...MMMMKKKKKMMMM......
..MLLLLKKKKKLLLLM.....
.LLLLLLLLLLLLLLLLL....
.LLLLBBBLLLBBBLLLL....
.LLLLLLLLLLLLLLLLL....
.SLLLLLLLLLLLLLLLS....
...DDDDD...DDDDD......
...KKKKK...KKKKK......
```

Every other pose is the base plus patches; a patch writes a string at (row, col), `.` clears a pixel and a space keeps it:

- **Wave A:** `[8,19,"SS"] [9,19,"SS"] [10,19,"L"] [11,18,"LL"] [12,18,"L"] [13,17,"LL"] [14,16,"LL"] [16,17,"."] [17,17,"."] [18,17,"."] [19,17,"."]`
- **Wave B:** Wave A plus `[8,19,".SS"] [9,19,".SS"] [10,19,"LL"]`
- **Sunglasses:** `[9,4,"KKKKKKKKKKK"] [10,4,"KKKK"] [10,11,"KKKK"] [10,8,"SSS"] [9,5,"W"] [9,12,"W"]`
- **Laptop** (shared by both typing frames): `[15,3,"DDDDDDDDDDDDD"] [16,3,"DMMMMMMMMMMMD"] [17,3,"DMMMMMGMMMMMD"] [18,3,"DMMMMMMMMMMMD"] [19,2,"SDDDDDDDDDDDDDS"] [19,1,"."] [19,17,"."]`
- **Typing A:** Laptop plus `[18,2,"S"]`; **Typing B:** Laptop plus `[18,16,"S"]`
- **Envelope:** `[15,5,"WWWWWWWWW"] [16,5,"WMWWWWWMW"] [17,5,"WWMWWWMWW"] [18,5,"WWWMGMWWW"] [19,5,"WWWWWWWWW"] [17,4,"S"] [17,14,"S"] [19,1,"."] [19,17,"."]`

Eyes: rows 9 and 10, columns 5-7 and 11-13 (white, pupil, white). In poses that show eyes, those twelve pixels are drawn on their own layers (whites, then pupils) over skin, so a blink can squash them and the pupils can shift one pixel left or right without redrawing the face.

Rendering: one `<path>` per colour (runs of equal pixels merged), `shape-rendering="crispEdges"`, scaled by CSS: 4x in the hero (96px), 2x in cameos (48px). The SVG is decorative (`aria-hidden`).

## Lines

Owned by one module; the copy is approved verbatim and has no em-dashes.

- Greeting by the visitor's local hour: 0-4 "Up late too? I'm Justine." 5-11 "Good morning! I'm Justine." 12-17 "Good afternoon! I'm Justine." 18-23 "Good evening! I'm Justine." Before the browser knows the time (server render): "Hi! I'm Justine."
- Click lines, in order, looping: "I'm Justine. Well, the pixel version." / "I got into code because of games." / "Before coding, I did graphic design." / "Right now I'm building LoreOS." / "When something grabs me, I lock in." / "Try the theme switch up top." / "Okay, okay. You can stop clicking now."
- Theme toggle: to light "Too bright!" (sunglasses on for about 4 s); to dark "Ahh, much better." (with a hop).
- Cameos, shown on hover, focus or tap: typing "Shipping something."; envelope "Send me a message!"

## Hero behaviour

- Lives under the status row in `HeroSection`, left-aligned: the mascot (a `<button>`) and the bubble to its right. On phones the same row, the bubble wrapping.
- On load it waves for about 2.4 s (wave frames alternate every 250 ms), then idles: a 3px bob every 1.8 s and a blink about every 4 s. Pure CSS, so it starts with the first frame and needs no JavaScript.
- Greeting: the server renders the fallback line; the browser swaps in the time-of-day greeting through `useSyncExternalStore` with a `null` server snapshot (the project's rule for mount-only values), so hydration never mismatches.
- Eyes: on a fine pointer, pointer movement left or right of the mascot's centre (beyond 24px) shifts the pupils one pixel that way; no React state per move (a CSS variable on the button, updated at most once per animation frame).
- Click or tap: a hop (about 0.5 s of squash, jump and settle through the Web Animations API) and the next click line. The site's click burst fires as usual.
- Theme toggle: a `MutationObserver` on `<html data-theme>` reacts to the toggle (not to an OS theme change): to light it shows the sunglasses pose and "Too bright!" for about 4 s, then returns to idle; to dark it hops and says "Ahh, much better."
- Accessibility: the button's name is "Mini Justine, say something"; the bubble is an `aria-live="polite"` region, so a click's new line is announced. Keyboard users trigger it with Enter or Space like any button.
- Reduced motion: no bob, blink, wave, hop, typing loop or eye movement (all via CSS or checks inside handlers, never by changing markup). Lines and the sunglasses pose still change.

## Cameos

- Rendered in the `action` slot of the section heading, standing on the hairline at the right: Tech stack (typing, frames alternating every 300 ms) and Contact's "Send a message" (envelope, with the idle bob).
- A small `<button>` per cameo: hovering or focusing shows its line in a bubble; tapping toggles it (touch has no hover).

## Architecture

| Unit | Responsibility |
|---|---|
| `src/lib/mascot/sprites.js` | Palette, base map, patches, `poseMap(name)`, `spriteLayers(map)` (paths per colour, eye layers split out). Pure. |
| `src/lib/mascot/lines.js` | `greeting(hour)`, `FALLBACK_GREETING`, `CLICK_LINES`, `nextLineIndex(i)`, `THEME_LINES`, `CAMEO_LINES`. Pure. |
| `src/component/mascot/Sprite.jsx` | Server-safe SVG for one pose. |
| `src/component/mascot/HeroMascot.jsx` | Client: button, stacked poses, bubble, greeting, eyes, click, theme reaction. |
| `src/component/mascot/Cameo.jsx` | Client: one pose plus its line on hover, focus or tap. |
| `src/app/globals.css` | Mascot keyframes and the `--mascot-outline` token, with reduced-motion overrides. |

`HeroSection`, `TechStackSection` and `ContactView` each add one element.

## Testing and verification

- `src/lib/mascot/sprites.test.mjs`: every pose is 22 by 22 with only palette keys; patches stay inside the grid; the eye pixels are where the eye layers expect them in every pose that shows eyes; the generated layers cover exactly the filled pixels plus their outline.
- `src/lib/mascot/lines.test.mjs`: greeting at the hour boundaries (0, 4, 5, 11, 12, 17, 18, 23); click lines loop; no em-dash in any line.
- `npm run lint && npm test && npm run check:hooks && npm run build`, claimed green on the pushed tip.
- Browser: no hydration warnings; the hero shows the fallback in the server HTML and the greeting after load; a click changes the line and the bubble is `aria-live`; cameos show their lines on hover; both themes; phone width. The Chrome extension tab pauses animation, so motion itself is Justine's check on the preview.
