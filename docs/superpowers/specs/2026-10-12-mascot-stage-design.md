# Mini Justine on the move: Design Spec

**Date:** 2026-10-12
**Status:** Approved by Justine in chat ("yes that should be it", plus the side-view walk they asked for)
**Branch:** `feat/mascot` (extends PR #10; ships with it)
**Builds on:** `docs/superpowers/specs/2026-10-12-mascot-design.md` (everything there still holds unless this spec changes it)

## Goal

Make the hero mascot feel alive: it can be picked up and carried anywhere (it falls back to its row when let go), and when the visitor goes quiet it walks over to a dual-monitor desk and codes. Justine has a dual-monitor setup in real life.

## Decisions made with the user

- Drag and drop: the visitor can pick Mini Justine up and carry it anywhere, including up and away from its row (Justine's follow-up; this replaces the first "sideways only" idea). Let go and it falls back down to its row. It only ever walks along its row.
- In the dark theme, the lit monitors cast a soft glow on their surroundings (Justine's follow-up).
- Idle routine: when the visitor isn't doing anything, it moves on its own, mainly coding at the desk.
- A desk with two monitors at the right end of the row (Justine left the details to Claude: a small plant and a mug were added).
- Walking uses a side view, facing the way it walks (Justine's follow-up request).
- New line, the only new copy: "Whoa! Put me down!"
- Shown as an interactive mock in the visual companion; approved as shown.

## Non-goals

- Walking or resting anywhere but its row (only a drag takes it elsewhere, and it always falls back).
- Dragging with the keyboard (the movement is decorative; Enter and Space still make it talk).
- Remembering its position between visits.
- Changing the cameos.

## Stage

The hero's mascot row becomes a stage as wide as the text column, 160px tall (`h-40`), under the status row in the same place.

- The desk stands at the right end, bottom-aligned: 152 x 116 px (a 36 x 27 map plus outline, at 4x).
- Mini Justine stands on the stage floor, 96 x 96 px as before, starting at the left edge.
- While seated, Mini Justine is drawn 36px in from the desk's left edge (the seat), in front of the desk, so its head sits between the two monitors.
- The free range is from the left edge to where a standing Mini Justine would touch the desk (stage width minus desk minus 96px, never below 0).
- The speech bubble moves with Mini Justine, floating above its head (above the desk while seated). It is left-aligned with Mini Justine when Mini Justine is in the left half of the stage and right-aligned in the right half, so it never leaves the stage. It fades out about 6 s after it last changed.

## Behaviour

Modes: `stand`, `walk`, `held`, `desk`.

- **Load:** `stand` at the left edge, the CSS wave, and the greeting bubble as today.
- **Drag:** a press on Mini Justine followed by 4px or more of movement in any direction picks it up (`held`).
  - It follows the pointer anywhere on the page, keeping the spot where it was grabbed under the pointer.
  - While held, it is drawn above everything, including the sticky header.
  - It swings gently, tilts against the drag direction (up to 20 degrees, from the latest horizontal pointer movement, easing back to upright when the pointer stops), and says "Whoa! Put me down!".
- **Drop:** on release, it returns to its row.
  - Sideways, it goes to where it was let go, clamped to the stage.
  - Vertically, it falls with gravity (ease-in) when let go above the row, or rises back (ease-out) when let go below it.
  - The fall takes `clamp(220, sqrt(distance in px) x 28, 750)` ms. A fall from above ends with a landing squash.
  - If its centre is past the desk's left edge, it lands in the chair: `desk`. Otherwise it stands where it landed.
  - A drag never counts as a click.
- **Touch:** `touch-action: none` on Mini Justine, so a drag that starts on it moves it in any direction. A swipe that starts on it does not scroll the page; it is 96px wide, and everywhere else scrolls as usual.
- **Click (or Enter/Space):** as today, a hop and the next click line.
  - A click while walking stops the walk where Mini Justine is.
  - A click while seated makes Mini Justine stand up at the seat, then hop and talk.
- **Idle routine:** the visitor is idle after 8 s with no pointer movement, press, key, wheel, touch or scroll. While idle:
  - When standing, Mini Justine waits 3 s. Then, if it is at the seat (it just got up), it walks to a random spot in the free part of the row. Otherwise it walks to the seat and sits.
  - When seated, it codes for 25 s, then stands up.
  - A walk is 70 px/s, and the routine then loops.
  - When the visitor becomes active again, nothing new starts. A walk in progress finishes and Mini Justine stands, and if seated it keeps coding. A click or a drag gets its attention at any time.
- **Seated:** the back view types (two frames, 300 ms each), and the monitors light up with code that changes with each keystroke frame. The monitors are dark when nobody sits at the desk.
- **Monitor glow:** while seated, a soft radial glow fades in (0.6 s) behind the desk, 280 x 180 px, centred on the monitors, so the screens light up the wall around them. Its colour is the token `--mascot-glow: light-dark(transparent, rgb(150 180 255 / 0.45))`, so it only shows in the dark theme.
- **Walking:** the side view, two frames (stride and passing, 200 ms each), mirrored when walking left.
- **Theme toggle:** standing reacts as today (sunglasses + "Too bright!", or a hop + "Ahh, much better."). Walking, held or seated shows the line only.
- **Eyes:** follow the pointer as today wherever the pose shows the front eyes (idle, held). The side and back views have no pupils layer.
- **Reduced motion:** no idle routine (it never walks on its own), no swing, no tilt, no fall animation (it is back on its row at once), no hop. Frame loops (typing, screens) hold still and the glow appears without fading. Drag still works. Markup never changes for reduced motion.
- **Resize:** positions are clamped to the stage width; a seated Mini Justine stays on the seat.

## Sprite additions

The palette gains four fixed colours (character art, like the rest):

| Key | Colour | Use |
|---|---|---|
| `N` | `#262b38` | monitor screen |
| `T` | `#b08259` | desk top |
| `t` | `#7c5638` | desk edge and legs |
| `P` | `#c96f4a` | plant pot, mug |

New poses (22 x 22, same conventions as the base spec):

**Held:** the base plus `[6,0,"S"] [7,0,"S"] [8,0,"L"] [9,0,"L"] [10,1,"L"] [11,1,"L"] [12,1,"L"] [13,2,"L"] [6,18,"S"] [7,18,"S"] [8,18,"L"] [9,18,"L"] [10,17,"L"] [11,17,"L"] [12,17,"L"] [13,16,"L"] [19,1,"L"] [19,17,"L"] [12,9,"K"] [20,3,".DDDD...DDDD."] [21,3,"..KKK...KKK.."]`. Both arms go up, the mouth opens and the feet hang. The front eyes are kept, so it still blinks and looks around.

**Walk (side view, facing right):** both frames share this head and body:

```
......HHHHHH..........
....HHHHHHHHhH........
...HHHHHHHHHHhHH......
..HHHHHHHHHHHHHHH.....
.HHHHHHHHHHHHHHHHH....
.HHHHHHHHHHHHHHHHH....
.HHHHHHHHHHHHHHHHHH...
.HHHHHHHHHSSSSSSSH....
.HHHHHHHHSSSSSSSSS....
.HHHHHHHSSSSSSWKSS....
.HHHHHHHsSSSSSWKSS....
..HHHHHHSSSSSSSSSSS...
..HHHHHSSSSSSSSSsS....
...HHHHSSSSSSSSSS.....
.....MMMMKKKK.........
....MLLLLLKKLL........
....LLLLLLLLLLL.......
....LLLLLLLLLBL.......
....LLLLLLLLLLL.......
.....LLLLLLLLL........
```

These are rows 0-19; rows 20-21 are the legs:

- **Stride (`walkA`):** patches `[17,12,"S"] [18,12,"S"]` (hand forward). Legs: `.....DD....DD.........` / `....KKK....KKKK.......`.
- **Passing (`walkB`):** patch `[19,8,"S"]`. Legs: `......DDDDD...........` / `.......KKKKK..........`.

**Seated (back view):**

```
......................
......................
......................
......HHHHHHH.........
....HHHHHhHHHHH.......
...HHHHHHHHhHHHH......
..HHHHHHHHHHHHHHH.....
..HHHHHHHHHHHHHHH.....
.SHHHHHHHHHHHHHHHS....
..HHHHHHHHHHHHHHH.....
...HHHHHHHHHHHHH......
....HHHHHHHHHHH.......
...MMMMSSSSSMMMM......
..MLLLLMMMMMLLLLM.....
.LLLLLLLMMMLLLLLLL....
LLLLLLLLLLLLLLLLLLL...
LLLKKKKKKKKKKKKKLLL...
...KDDDDDDDDDDDK......
...KDDDDDDDDDDDK......
...KDDDDDDDDDDDK......
...KKKKKKKKKKKKK......
.....K...K...K........
```

Typing frames: `seatedA` = seated plus `[17,1,"LL"]`, `seatedB` = seated plus `[17,16,"LL"]` (the elbows take turns).

**Desk (36 x 27):**

```
.KKKKKKKKKKKKKKKK..KKKKKKKKKKKKKKKK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.
.KKKKKKKKKKKKKKKK..KKKKKKKKKKKKKKKK.
........KK................KK........
........KK................KK........
..G.....KK................KK........
.GGG....KK................KK...PP...
GGGGG...KK................KK...PPP..
.PPP..KKKKKK............KKKKKK.PP...
TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
tttttttttttttttttttttttttttttttttttt
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
.tt..............................tt.
```

**Screen code** (two 36 x 27 overlays drawn on the screens without an outline, alternating with the typing frames):

- Frame A: `[2,3,"BBBB.WWWW"] [4,4,"GGGGGG"] [6,4,"MMM.WWWWW"] [8,3,"BB"] [2,21,"MMMMMMMMMMMM"] [4,26,"GGGGG"] [5,26,"GGGGG"] [7,22,"WWWWWWWWWWW"] [8,22,"WWWWWWW"]`.
- Frame B: frame A plus `[8,3,"BB.WWWW"]`.

The left screen shows code and the right one a page preview.

## Architecture

| Unit | Change |
|---|---|
| `src/lib/mascot/sprites.js` | The palette keys above; poses `walkA`, `walkB`, `held`, `seatedA`, `seatedB`; `DESK`, `DESK_CODE` (two overlays); `spriteLayers` reports `width` and `height` from the map (the desk is not square); an overlay helper draws a map without an outline. Pure. |
| `src/lib/mascot/stage.js` (new) | The stage numbers (sizes, seat offset, speeds, timings, drag threshold) and pure helpers: the seat position, the free range, clamping, where a drop lands, where the routine walks next, how long a walk and a fall take, and which side the bubble aligns to. Pure. |
| `src/lib/mascot/lines.js` | `HELD_LINE = "Whoa! Put me down!"`. |
| `src/component/mascot/useIdle.js` (new) | `useIdle(ms)`: true once the visitor has been inactive for `ms`; false on the server and on first render. |
| `src/component/mascot/Desk.jsx` (new) | The desk SVG with both screen-code overlays. Server-safe. |
| `src/component/mascot/Sprite.jsx` | Uses `width` and `height` for the viewBox. |
| `src/component/mascot/HeroMascot.jsx` | Becomes the stage: desk, Mini Justine, bubble; modes, drag, routine, click, theme and eyes. |
| `src/app/globals.css` | The `--mascot-glow` token and the glow; layer visibility per mode, walk mirror, swing and tilt, the held stacking order, screen code, typing and walk frames, the bubble tail pointing down, reduced-motion overrides. |

Rules that still apply: all layers stay mounted and switch by opacity (so the wave never restarts); no synchronous `setState` in effect bodies (timers, observers and event handlers set state); `matchMedia` only inside effects and handlers; the server renders `stand` at the left edge with the fallback greeting.

## Testing and verification

- `sprites.test.mjs`:
  - the new poses pass the existing checks (size, palette, layers);
  - `held` shows the front eyes and the walk and seated poses do not;
  - the desk is 36 x 27 with palette keys only;
  - every screen-code pixel sits on a screen (`N`) pixel of the desk;
  - the desk's layers report width 38 and height 29.
- `stage.test.mjs`:
  - the seat position, the free range and clamping at wide and phone widths;
  - a drop over the desk sits, and a drop elsewhere stands where it landed;
  - from the seat the routine walks somewhere in the free range, and from elsewhere it walks to the seat;
  - walk duration, and fall duration at its 220 ms and 750 ms bounds;
  - bubble alignment by half.
- `lines.test.mjs`: the held line has no em-dash.
- Browser (headless Edge):
  - a drag carries it up and away from its row, held above the header;
  - a release above the row brings it back down onto its row;
  - a release above the desk sits it in the chair and lights the screens, and the glow shows in dark only;
  - a release elsewhere stands it where it landed;
  - a click after a drag is ignored;
  - after waiting out the idle time with no input, it walks to the desk and sits;
  - reduced motion: no routine;
  - light and dark, phone width, no hydration warnings.
- Justine on the preview: the feel of the walk, the drag and the routine, and dragging on a phone.
