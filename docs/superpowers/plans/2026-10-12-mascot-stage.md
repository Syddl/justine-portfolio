# Mini Justine Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the hero mascot row into a stage with a dual-monitor desk. Mini Justine can be dragged anywhere and falls back to its row, and it walks to the desk and codes when the visitor is idle. In the dark theme the lit monitors glow.

**Architecture:**
- New pose maps and the desk go into the existing pure sprite module, and the stage's numbers and rules into a new pure `stage.js`. Both are unit-tested.
- `HeroMascot` becomes the stage island. Its modes are `stand`, `walk`, `held` and `desk`; it renders x/y positions as CSS transforms with transitions, and it adds drag, the idle routine and the bubble.
- Layers switch by opacity in `globals.css`, and all motion stays CSS or WAAPI with reduced-motion overrides.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, node:test.

**Spec:** `docs/superpowers/specs/2026-10-12-mascot-stage-design.md` (builds on `docs/superpowers/specs/2026-10-12-mascot-design.md`).

## Global Constraints

- **Git:**
  - Work on branch `feat/mascot` (PR #10).
  - Stage explicit paths only: `git add -A`, `git add .` and `git add --all` are denied by the guard.
  - Read `git diff --cached --name-only` before every commit, and run `git branch --show-current` in the same command as the commit.
  - Write each commit message to a file in the scratchpad and run `git commit -F <file>`. End it with a blank line, then `Co-Authored-By: Claude <Model> 5.5 <noreply@anthropic.com>` naming the model that did the work.
- **Editing:** edit existing files with the Edit tool (several have CRLF endings; no sed, perl or scripted replaces), and create new files with the Write tool. After editing, read `git diff` for each edited file: only the intended lines may change.
- **Copy:** approved verbatim, with no em-dashes in user-facing text. The only new line is "Whoa! Put me down!".
- **Colours:**
  - The mascot palette (including the new desk colours) lives only in `src/lib/mascot/sprites.js`.
  - The outline and the monitor glow are tokens in `globals.css` (`--mascot-outline`, `--mascot-glow`).
  - Every other colour is a token class.
- **Reduced motion:** never changes markup. CSS turns animations and transitions off, and JS checks `matchMedia` only inside effects and event handlers.
- **Hydration:** mount-only values use `useSyncExternalStore` with a `null` server snapshot or start as `null` state set from an observer. The server renders `stand` at the left edge with the fallback greeting.
- **Effects:** no synchronous `setState` inside `useEffect` bodies; timers, observers and event handlers may set state. No reading or writing `ref.current` during render.
- **House style:** keep template literals single-level and single-line.
- **Layer switching:** all hero layers stay mounted and switch by opacity, so the load wave never restarts.
- **Checks:**
  - While working, run `npm run lint && npm test` and `npm run check:hooks`.
  - Claim-green on the pushed tip runs the full suite: `npm run lint && npm test && npm run check:hooks && npm run build`.
  - Do not run `npm run build` while a dev server is running (they share `.next`).
  - A pre-existing `MODULE_TYPELESS_PACKAGE_JSON` warning in test output is known.
- **Browser checks:** use headless Edge over the DevTools protocol (scratchpad `cdp.mjs`); the Chrome extension tab pauses `requestAnimationFrame`.

## File map

| File | Responsibility |
|---|---|
| `src/lib/mascot/sprites.js` (+ test) | New palette keys, poses (`walkA`, `walkB`, `held`, `seatedA`, `seatedB`), `DESK`, `DESK_CODE`, width/height layers, overlays. Pure. |
| `src/lib/mascot/stage.js` (+ test, new) | Stage sizes, timings and pure rules (seat, free range, clamp, landing, next walk, durations, bubble side, tilt). |
| `src/lib/mascot/lines.js` (+ test) | `HELD_LINE`. |
| `src/component/mascot/Sprite.jsx` | `width`/`height` viewBox; exports `SpritePaths`. |
| `src/component/mascot/Desk.jsx` (new) | Server-safe desk SVG with the two screen-code frames. |
| `src/component/mascot/useIdle.js` (new) | `useIdle(ms)`: true once the visitor has been inactive for `ms`. |
| `src/component/mascot/HeroMascot.jsx` | The stage island. |
| `src/app/globals.css` | `--mascot-glow`, body sideways clip, stage CSS, reduced-motion overrides. |

---

### Task 1: New poses, the desk and width/height layers

**Files:**
- Modify: `src/lib/mascot/sprites.js`, `src/lib/mascot/sprites.test.mjs`, `src/component/mascot/Sprite.jsx`

**Interfaces:**
- Produces:
  - `PALETTE` gains `N`, `T`, `t`, `P`.
  - `POSES` gains `walkA`, `walkB`, `held`, `seatedA`, `seatedB`.
  - `DESK` (string[27], each 36 wide) and `DESK_CODE` ([frameA, frameB], each 36 x 27).
  - `spriteLayers(map) -> { width, height, paths, whites, pupils }`. This replaces `size`.
  - `overlayPaths(map) -> [{ key, d }]`, with no outline and shifted by 1 for the padding.
  - `DESK_LAYERS = spriteLayers(DESK)` and `DESK_CODE_LAYERS = DESK_CODE.map(overlayPaths)`.
  - `Sprite.jsx` exports `SpritePaths({ paths })`.

- [ ] **Step 1: Update the tests first** in `src/lib/mascot/sprites.test.mjs`.

1. Replace the import block

```js
import {
  BASE,
  EYE_ROWS,
  EYE_WHITES,
  PALETTE,
  POSES,
  POSE_LAYERS,
  PUPILS,
  SIZE,
  hasEyes,
  patch,
  spriteLayers,
  withOutline,
} from "./sprites.js";
```

with

```js
import {
  BASE,
  DESK,
  DESK_CODE,
  DESK_CODE_LAYERS,
  DESK_LAYERS,
  EYE_ROWS,
  EYE_WHITES,
  PALETTE,
  POSES,
  POSE_LAYERS,
  PUPILS,
  SIZE,
  hasEyes,
  overlayPaths,
  patch,
  spriteLayers,
  withOutline,
} from "./sprites.js";
```

2. Replace the eyes test

```js
test("the eyes are where the eye layers expect them, except under sunglasses", () => {
  for (const name of ["idle", "waveA", "waveB", "typingA", "typingB", "envelope"]) {
    assert.ok(hasEyes(POSES[name]), `${name} should show eyes`);
  }
  assert.equal(hasEyes(POSES.sunglasses), false);
});
```

with

```js
test("the front eyes show where the eye layers expect them, and nowhere else", () => {
  for (const name of ["idle", "waveA", "waveB", "typingA", "typingB", "envelope", "held"]) {
    assert.ok(hasEyes(POSES[name]), `${name} should show eyes`);
  }
  for (const name of ["sunglasses", "walkA", "walkB", "seatedA", "seatedB"]) {
    assert.equal(hasEyes(POSES[name]), false, `${name} should not show the front eyes`);
  }
});
```

3. In the test "the layers draw every filled and outline pixel exactly once", replace the two lines

```js
    const { size, paths, whites, pupils } = spriteLayers(map);
    assert.equal(size, SIZE + 2);
```

with

```js
    const { width, height, paths, whites, pupils } = spriteLayers(map);
    assert.equal(width, SIZE + 2);
    assert.equal(height, SIZE + 2);
```

4. Append these tests to the end of the file:

```js
test("the desk is 36 x 27 and uses only palette keys", () => {
  const allowed = new Set([".", ...Object.keys(PALETTE)]);
  assert.equal(DESK.length, 27);
  for (const row of DESK) {
    assert.equal(row.length, 36);
    for (const ch of row) assert.ok(allowed.has(ch), `desk: unknown pixel "${ch}"`);
  }
});

test("the desk's layers are 38 x 29 and draw each outlined pixel once", () => {
  const expected = new Set();
  withOutline(DESK).forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== ".") expected.add(`${x},${y}`);
    }),
  );
  assert.equal(DESK_LAYERS.width, 38);
  assert.equal(DESK_LAYERS.height, 29);
  const drawn = DESK_LAYERS.paths.flatMap(({ d }) => cells(d));
  assert.equal(drawn.length, new Set(drawn).size);
  assert.deepEqual(new Set(drawn), expected);
  assert.equal(DESK_LAYERS.whites, "");
});

test("the screen code sits on the screens, and frame B types more", () => {
  const screen = new Set(cells(DESK_LAYERS.paths.find((p) => p.key === "N").d));
  for (const [i, layer] of DESK_CODE_LAYERS.entries()) {
    const code = layer.flatMap(({ d }) => cells(d));
    assert.ok(code.length > 0, `frame ${i} is empty`);
    for (const cell of code) assert.ok(screen.has(cell), `frame ${i}: ${cell} is off the screens`);
  }
  const count = (layer) => layer.flatMap(({ d }) => cells(d)).length;
  assert.ok(count(DESK_CODE_LAYERS[1]) > count(DESK_CODE_LAYERS[0]));
  assert.equal(DESK_CODE.length, 2);
  for (const frame of DESK_CODE) assert.equal(frame.length, DESK.length);
});

test("an overlay is drawn without an outline, shifted by the padding", () => {
  assert.deepEqual(overlayPaths(["G."]), [{ key: "G", d: "M1 1h1v1h-1z" }]);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `npm test`
Expected: FAIL in `sprites.test.mjs` (`DESK` / `overlayPaths` are not exported, and `held` / `walkA` are missing from `POSES`).

- [ ] **Step 3: Implement in `src/lib/mascot/sprites.js`**

1. In `PALETTE`, after the line `  G: "#3fbf73", // laptop logo, envelope seal` add:

```js
  N: "#262b38", // monitor screens
  T: "#b08259", // desk top
  t: "#7c5638", // desk edge and legs
  P: "#c96f4a", // plant pot, mug
```

2. Directly before `export const POSES = {` add:

```js
// Picked up: both arms up, mouth open, feet hanging. The front eyes stay,
// so it still blinks and looks around while held.
const HELD = [
  [6, 0, "S"],
  [7, 0, "S"],
  [8, 0, "L"],
  [9, 0, "L"],
  [10, 1, "L"],
  [11, 1, "L"],
  [12, 1, "L"],
  [13, 2, "L"],
  [6, 18, "S"],
  [7, 18, "S"],
  [8, 18, "L"],
  [9, 18, "L"],
  [10, 17, "L"],
  [11, 17, "L"],
  [12, 17, "L"],
  [13, 16, "L"],
  [19, 1, "L"],
  [19, 17, "L"],
  [12, 9, "K"],
  [20, 3, ".DDDD...DDDD."],
  [21, 3, "..KKK...KKK.."],
];

// Side view, facing right (CSS mirrors it to walk left): rows 0-19 are the
// head and body; each walk frame adds its hand and its two rows of legs.
const SIDE = [
  "......HHHHHH..........",
  "....HHHHHHHHhH........",
  "...HHHHHHHHHHhHH......",
  "..HHHHHHHHHHHHHHH.....",
  ".HHHHHHHHHHHHHHHHH....",
  ".HHHHHHHHHHHHHHHHH....",
  ".HHHHHHHHHHHHHHHHHH...",
  ".HHHHHHHHHSSSSSSSH....",
  ".HHHHHHHHSSSSSSSSS....",
  ".HHHHHHHSSSSSSWKSS....",
  ".HHHHHHHsSSSSSWKSS....",
  "..HHHHHHSSSSSSSSSSS...",
  "..HHHHHSSSSSSSSSsS....",
  "...HHHHSSSSSSSSSS.....",
  ".....MMMMKKKK.........",
  "....MLLLLLKKLL........",
  "....LLLLLLLLLLL.......",
  "....LLLLLLLLLBL.......",
  "....LLLLLLLLLLL.......",
  ".....LLLLLLLLL........",
];
const WALK_A = [
  ...patch(SIDE, [
    [17, 12, "S"],
    [18, 12, "S"],
  ]),
  ".....DD....DD.........",
  "....KKK....KKKK.......",
];
const WALK_B = [
  ...patch(SIDE, [[19, 8, "S"]]),
  "......DDDDD...........",
  ".......KKKKK..........",
];

// Seated at the desk, seen from behind; the elbows take turns typing.
const SEATED = [
  "......................",
  "......................",
  "......................",
  "......HHHHHHH.........",
  "....HHHHHhHHHHH.......",
  "...HHHHHHHHhHHHH......",
  "..HHHHHHHHHHHHHHH.....",
  "..HHHHHHHHHHHHHHH.....",
  ".SHHHHHHHHHHHHHHHS....",
  "..HHHHHHHHHHHHHHH.....",
  "...HHHHHHHHHHHHH......",
  "....HHHHHHHHHHH.......",
  "...MMMMSSSSSMMMM......",
  "..MLLLLMMMMMLLLLM.....",
  ".LLLLLLLMMMLLLLLLL....",
  "LLLLLLLLLLLLLLLLLLL...",
  "LLLKKKKKKKKKKKKKLLL...",
  "...KDDDDDDDDDDDK......",
  "...KDDDDDDDDDDDK......",
  "...KDDDDDDDDDDDK......",
  "...KKKKKKKKKKKKK......",
  ".....K...K...K........",
];
```

3. In `POSES`, after the line `  envelope: patch(BASE, ENVELOPE),` add:

```js
  walkA: WALK_A,
  walkB: WALK_B,
  held: patch(BASE, HELD),
  seatedA: patch(SEATED, [[17, 1, "LL"]]),
  seatedB: patch(SEATED, [[17, 16, "LL"]]),
```

4. Directly after the closing `};` of `POSES` add:

```js
// The desk at the right end of the hero stage: two monitors on stands, a
// plant and a mug. 36 x 27; the screens are N.
const MONITORS = ".KNNNNNNNNNNNNNNK..KNNNNNNNNNNNNNNK.";
const BEZEL = ".KKKKKKKKKKKKKKKK..KKKKKKKKKKKKKKKK.";
const LEGS = ".tt..............................tt.";
export const DESK = [
  BEZEL,
  ...Array(9).fill(MONITORS),
  BEZEL,
  "........KK................KK........",
  "........KK................KK........",
  "..G.....KK................KK........",
  ".GGG....KK................KK...PP...",
  "GGGGG...KK................KK...PPP..",
  ".PPP..KKKKKK............KKKKKK.PP...",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "tttttttttttttttttttttttttttttttttttt",
  ...Array(8).fill(LEGS),
];

// What the screens show while Mini Justine codes: code on the left, a page
// preview on the right. Frame B has typed a few more characters.
const SCREEN = [
  [2, 3, "BBBB.WWWW"],
  [4, 4, "GGGGGG"],
  [6, 4, "MMM.WWWWW"],
  [8, 3, "BB"],
  [2, 21, "MMMMMMMMMMMM"],
  [4, 26, "GGGGG"],
  [5, 26, "GGGGG"],
  [7, 22, "WWWWWWWWWWW"],
  [8, 22, "WWWWWWW"],
];
const BLANK_DESK = DESK.map((row) => ".".repeat(row.length));
export const DESK_CODE = [
  patch(BLANK_DESK, SCREEN),
  patch(BLANK_DESK, [...SCREEN, [8, 3, "BB.WWWW"]]),
];
```

5. Replace `runsPath` (the whole function and its comment)

```js
// One SVG path for one colour: every horizontal run becomes a 1-high rect.
const runsPath = (rows, key) => {
  let d = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== key) {
        x += 1;
        continue;
      }
      let end = x;
      while (row[end] === key) end += 1;
      d += `M${x} ${y}h${end - x}v1h-${end - x}z`;
      x = end;
    }
  });
  return d;
};
```

with

```js
// One SVG path for one colour: every horizontal run becomes a 1-high rect,
// moved by `offset` (1 for an overlay drawn on a padded sprite).
const runsPath = (rows, key, offset = 0) => {
  let d = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== key) {
        x += 1;
        continue;
      }
      let end = x;
      while (row[end] === key) end += 1;
      d += `M${x + offset} ${y + offset}h${end - x}v1h-${end - x}z`;
      x = end;
    }
  });
  return d;
};
```

6. In `spriteLayers`, replace

```js
  return {
    size: SIZE + 2,
    paths,
```

with

```js
  return {
    width: map[0].length + 2,
    height: map.length + 2,
    paths,
```

7. Replace the end of the file

```js
// Every pose's layers, computed once at import.
export const POSE_LAYERS = Object.fromEntries(
  Object.entries(POSES).map(([name, map]) => [name, spriteLayers(map)]),
);
```

with

```js
// An overlay drawn on a sprite without an outline (the screen code): one
// path per colour, shifted by the padding of the sprite underneath.
export const overlayPaths = (map) =>
  Object.keys(PALETTE)
    .map((key) => ({ key, d: runsPath(map, key, 1) }))
    .filter((layer) => layer.d);

// Every pose's layers, and the desk's, computed once at import.
export const POSE_LAYERS = Object.fromEntries(
  Object.entries(POSES).map(([name, map]) => [name, spriteLayers(map)]),
);
export const DESK_LAYERS = spriteLayers(DESK);
export const DESK_CODE_LAYERS = DESK_CODE.map(overlayPaths);
```

8. Replace the file's top comment

```js
// Mini Justine, drawn as pixel maps: one character per pixel, "." empty.
// Spec: docs/superpowers/specs/2026-10-12-mascot-design.md. Pure (no DOM),
// so node --test covers it. The palette is character art with fixed colours;
// only the outline is themed, through --mascot-outline in globals.css.
```

with

```js
// Mini Justine and the desk, drawn as pixel maps: one character per pixel,
// "." empty. Specs: docs/superpowers/specs/2026-10-12-mascot-design.md and
// docs/superpowers/specs/2026-10-12-mascot-stage-design.md. Pure (no DOM),
// so node --test covers it. The palette is character art with fixed colours;
// only the outline is themed, through --mascot-outline in globals.css.
```

- [ ] **Step 4: Update `src/component/mascot/Sprite.jsx`** (full replacement):

```jsx
import { PALETTE, POSE_LAYERS } from "@/lib/mascot/sprites";

// A sprite's colour paths; the outline reads --mascot-outline (globals.css).
// Shared by Sprite and the desk.
export const SpritePaths = ({ paths }) =>
  paths.map(({ key, d }) =>
    key === "O" ? (
      <path key={key} d={d} className="mascot-outline" />
    ) : (
      <path key={key} d={d} fill={PALETTE[key]} />
    ),
  );

// One pose of Mini Justine as a crisp SVG that fills its parent. Server-safe.
// In poses with eyes, .mascot-eyes is the blink target and .mascot-pupils
// shifts by --look (set by HeroMascot).
const Sprite = ({ pose, className = "" }) => {
  const { width, height, paths, whites, pupils } = POSE_LAYERS[pose];

  return (
    <svg
      className={`mascot-sprite ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <SpritePaths paths={paths} />
      {whites && (
        <g className="mascot-eyes">
          <path d={whites} fill={PALETTE.W} />
          <path d={pupils} fill={PALETTE.K} className="mascot-pupils" />
        </g>
      )}
    </svg>
  );
};

export default Sprite;
```

- [ ] **Step 5: Run lint and tests and watch them pass**

Run: `npm run lint` then `npm test`
Expected: lint clean; all tests pass (the 4 new sprite tests included).

- [ ] **Step 6: Commit**

```bash
git add src/lib/mascot/sprites.js src/lib/mascot/sprites.test.mjs src/component/mascot/Sprite.jsx
git diff --cached --name-only
git branch --show-current && git commit -F <message file>
```

Message subject: `feat: Mini Justine walk, held and seated poses, and the desk`.

---

### Task 2: Stage rules and the held line

**Files:**
- Create: `src/lib/mascot/stage.js`, `src/lib/mascot/stage.test.mjs`
- Modify: `src/lib/mascot/lines.js`, `src/lib/mascot/lines.test.mjs`

**Interfaces:**
- Consumes: `POSE_LAYERS`, `DESK_LAYERS` (Task 1): the sizes come from the maps (one owner).
- Produces:
  - Numbers: `MASCOT_PX` 96, `DESK_W` 152, `DESK_H` 116, `SEAT_OFFSET` 36, `WALK_PX_PER_S` 70, `IDLE_MS` 8000, `STAND_MS` 3000, `DESK_MS` 25000, `BUBBLE_MS` 6000, `DRAG_PX` 4, `MAX_TILT_DEG` 20.
  - Functions:
    - `seatX(width)`, `freeMax(width)`, `clampX(x, width)`
    - `landing(x, width) -> { mode: "desk" | "stand", x }`
    - `nextWalk(x, width, random) -> number`
    - `walkMs(from, to)`, `fallMs(dy)`
    - `bubbleSide(x, width) -> "left" | "right"`
    - `tiltDeg(dx)`
  - `HELD_LINE` in lines.js.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/mascot/stage.test.mjs`:

```js
// Does NOT exercise: the timers, pointer events and CSS that use these
// numbers in HeroMascot (browser check only).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DESK_H,
  DESK_W,
  MASCOT_PX,
  bubbleSide,
  clampX,
  fallMs,
  freeMax,
  landing,
  nextWalk,
  seatX,
  tiltDeg,
  walkMs,
} from "./stage.js";

test("the stage sizes are the sprites drawn at 4x", () => {
  assert.equal(MASCOT_PX, 96);
  assert.equal(DESK_W, 152);
  assert.equal(DESK_H, 116);
});

test("the seat and the free range at desktop and phone widths", () => {
  assert.equal(seatX(640), 524);
  assert.equal(freeMax(640), 392);
  assert.equal(seatX(342), 226);
  assert.equal(freeMax(342), 94);
  assert.equal(freeMax(200), 0);
});

test("clampX keeps Mini Justine on the stage", () => {
  assert.equal(clampX(-30, 640), 0);
  assert.equal(clampX(300, 640), 300);
  assert.equal(clampX(900, 640), 544);
});

test("a drop over the desk lands in the chair; anywhere else it stands where it lands", () => {
  assert.deepEqual(landing(500, 640), { mode: "desk", x: 524 });
  assert.deepEqual(landing(380, 640), { mode: "stand", x: 380 });
  assert.deepEqual(landing(-50, 640), { mode: "stand", x: 0 });
});

test("from the seat the routine wanders; from anywhere else it heads to the seat", () => {
  assert.equal(nextWalk(524, 640, () => 0.5), 196);
  assert.equal(nextWalk(524, 640, () => 0), 0);
  assert.equal(nextWalk(100, 640, () => 0.5), 524);
});

test("a walk takes distance at 70 px/s; a fall stays between 220 and 750 ms", () => {
  assert.equal(walkMs(0, 70), 1000);
  assert.equal(walkMs(524, 0), 7486);
  assert.equal(fallMs(0), 220);
  assert.equal(fallMs(-100), 280);
  assert.equal(fallMs(-2000), 750);
});

test("the bubble aligns to the half of the stage Mini Justine is in", () => {
  assert.equal(bubbleSide(0, 640), "left");
  assert.equal(bubbleSide(524, 640), "right");
});

test("the tilt leans against the drag and stops at 20 degrees", () => {
  assert.equal(tiltDeg(4), -6);
  assert.equal(tiltDeg(-4), 6);
  assert.equal(tiltDeg(100), -20);
});
```

In `src/lib/mascot/lines.test.mjs`:
- Add `HELD_LINE,` to the import list, after `FALLBACK_GREETING,`.
- In the em-dash test, add `HELD_LINE,` after `FALLBACK_GREETING,` in the `all` array.

- [ ] **Step 2: Run the tests and watch them fail**

Run: `npm test`
Expected: FAIL: `./stage.js` cannot be found, and `HELD_LINE` is undefined.

- [ ] **Step 3: Implement**

Create `src/lib/mascot/stage.js`:

```js
// Mini Justine's stage in the hero: sizes, timings and the pure rules
// HeroMascot follows. Spec: docs/superpowers/specs/2026-10-12-mascot-stage-design.md.
// Positions are px from the stage's left edge; the desk stands at the right.
import { DESK_LAYERS, POSE_LAYERS } from "./sprites.js";

// Sprites are drawn at 4 CSS px per pixel; their sizes come from the maps.
const SCALE = 4;
export const MASCOT_PX = POSE_LAYERS.idle.width * SCALE;
export const DESK_W = DESK_LAYERS.width * SCALE;
export const DESK_H = DESK_LAYERS.height * SCALE;
// Seated, Mini Justine is drawn this far in from the desk's left edge.
export const SEAT_OFFSET = 36;
export const WALK_PX_PER_S = 70;
export const IDLE_MS = 8000;
export const STAND_MS = 3000;
export const DESK_MS = 25000;
export const BUBBLE_MS = 6000;
// A press becomes a drag after this much movement.
export const DRAG_PX = 4;
export const MAX_TILT_DEG = 20;

export const seatX = (width) => width - DESK_W + SEAT_OFFSET;

// The free range ends where a standing Mini Justine would touch the desk.
export const freeMax = (width) => Math.max(0, width - DESK_W - MASCOT_PX);

export const clampX = (x, width) => Math.min(Math.max(x, 0), Math.max(0, width - MASCOT_PX));

// Let go with its centre past the desk's left edge, it lands in the chair.
export const landing = (x, width) =>
  x + MASCOT_PX / 2 > width - DESK_W
    ? { mode: "desk", x: seatX(width) }
    : { mode: "stand", x: clampX(x, width) };

// The idle routine: just up from the seat, wander somewhere free; from
// anywhere else, go back to the seat. `random` is Math.random in the app.
export const nextWalk = (x, width, random) =>
  Math.abs(x - seatX(width)) < 1 ? random() * freeMax(width) : seatX(width);

export const walkMs = (from, to) => Math.round((Math.abs(to - from) / WALK_PX_PER_S) * 1000);

// Longer drops take longer, within limits that still feel snappy.
export const fallMs = (dy) => Math.round(Math.min(750, Math.max(220, Math.sqrt(Math.abs(dy)) * 28)));

export const bubbleSide = (x, width) => (x + MASCOT_PX / 2 > width / 2 ? "right" : "left");

// Leans against the latest horizontal pointer movement.
export const tiltDeg = (dx) => Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, -dx * 1.5));
```

In `src/lib/mascot/lines.js`, after the `THEME_LINES` object add:

```js

// While the visitor holds Mini Justine up in the air.
export const HELD_LINE = "Whoa! Put me down!";
```

- [ ] **Step 4: Run lint and tests and watch them pass**

Run: `npm run lint` then `npm test`
Expected: clean; all pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mascot/stage.js src/lib/mascot/stage.test.mjs src/lib/mascot/lines.js src/lib/mascot/lines.test.mjs
git diff --cached --name-only
git branch --show-current && git commit -F <message file>
```

Message subject: `feat: Mini Justine stage rules and the held line`.

---

### Task 3: The stage in the hero

**Files:**
- Create: `src/component/mascot/useIdle.js`, `src/component/mascot/Desk.jsx`
- Modify: `src/component/mascot/HeroMascot.jsx` (full replacement), `src/app/globals.css`

**Interfaces:**
- Consumes:
  - From Task 1: `SpritePaths`, `Sprite`, `DESK_LAYERS`, `DESK_CODE_LAYERS`.
  - From Task 2: everything listed under Produces.
  - From the earlier mascot work: `CLICK_LINES`, `FALLBACK_GREETING`, `THEME_LINES`, `greeting`, `nextLineIndex`.
- Produces: the stage markup. The stage div `.mascot-stage` carries `data-mode` (stand | walk | held | desk), `data-pose` (idle | sunglasses), `data-dir` (1 | -1), `data-motion` (none | walk | down | up) and the `--mascot-move` duration. Inside it are `.mascot-glow`, the desk SVG (`.mascot-code`, `.mascot-code-b`), `.mascot-x`, `.mascot-y`, the bubble `p.mascot-bubble` (`data-side`, `data-on`, `aria-live="polite"`), and `button.mascot` ("Mini Justine, say something") with its layers: `.mascot-wave`, `.mascot-idle`, `.mascot-sunglasses`, `.mascot-walk`, `.mascot-held`, `.mascot-seated`.

- [ ] **Step 1: Create `src/component/mascot/useIdle.js`**

```js
"use client";

import { useEffect, useState } from "react";

const ACTIVITY = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];

// True once the visitor has done nothing (no pointer, key, wheel, touch or
// scroll) for `ms`; false again on the next activity. False on the server
// and on the first render, so hydration matches.
const useIdle = (ms) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let last = Date.now();
    const onActivity = () => {
      last = Date.now();
      setIdle(false);
    };
    const check = setInterval(() => setIdle(Date.now() - last >= ms), 1000);
    ACTIVITY.forEach((type) => window.addEventListener(type, onActivity, { passive: true }));
    return () => {
      clearInterval(check);
      ACTIVITY.forEach((type) => window.removeEventListener(type, onActivity));
    };
  }, [ms]);

  return idle;
};

export default useIdle;
```

- [ ] **Step 2: Create `src/component/mascot/Desk.jsx`**

```jsx
import { SpritePaths } from "@/component/mascot/Sprite";
import { DESK_CODE_LAYERS, DESK_LAYERS } from "@/lib/mascot/sprites";
import { DESK_H, DESK_W } from "@/lib/mascot/stage";

// The dual-monitor desk at the right end of the hero stage, with the glow
// the lit monitors cast behind it. The glow and the screens' code (two
// frames) show only while Mini Justine sits here (globals.css). Server-safe.
const Desk = () => (
  <div className="absolute bottom-0 right-0" style={{ width: DESK_W, height: DESK_H }}>
    <div className="mascot-glow" aria-hidden="true" />
    <svg
      className="relative block"
      width={DESK_W}
      height={DESK_H}
      viewBox={`0 0 ${DESK_LAYERS.width} ${DESK_LAYERS.height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <SpritePaths paths={DESK_LAYERS.paths} />
      {DESK_CODE_LAYERS.map((paths, i) => (
        <g key={i} className={i === 0 ? "mascot-code" : "mascot-code mascot-code-b"}>
          <SpritePaths paths={paths} />
        </g>
      ))}
    </svg>
  </div>
);

export default Desk;
```

- [ ] **Step 3: Replace `src/component/mascot/HeroMascot.jsx`** with:

```jsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Desk from "@/component/mascot/Desk";
import Sprite from "@/component/mascot/Sprite";
import useIdle from "@/component/mascot/useIdle";
import {
  CLICK_LINES,
  FALLBACK_GREETING,
  HELD_LINE,
  THEME_LINES,
  greeting,
  nextLineIndex,
} from "@/lib/mascot/lines";
import {
  BUBBLE_MS,
  DESK_H,
  DESK_MS,
  DRAG_PX,
  IDLE_MS,
  MASCOT_PX,
  STAND_MS,
  bubbleSide,
  clampX,
  fallMs,
  landing,
  nextWalk,
  seatX,
  tiltDeg,
  walkMs,
} from "@/lib/mascot/stage";

// The hop on click: squash, jump, settle (about half a second).
const HOP = [
  { transform: "translateY(0) scale(1, 1)" },
  { transform: "translateY(0) scale(1.12, 0.86)", offset: 0.15 },
  { transform: "translateY(-14px) scale(0.94, 1.08)", offset: 0.45 },
  { transform: "translateY(0) scale(1.08, 0.92)", offset: 0.75 },
  { transform: "translateY(0) scale(1, 1)" },
];
// The landing after a fall from above.
const SQUASH = [{ transform: "scale(1.14, 0.84)" }, { transform: "scale(1, 1)" }];
const SUNGLASSES_MS = 4000;
// The pupils look left or right only once the pointer is this far from the
// mascot's centre, so they rest while the pointer is on it.
const LOOK_DEADZONE_PX = 24;
// A click this soon after a drop is the drop's own click, not a new one.
const DROP_CLICK_MS = 300;
// The tilt eases back to upright once the pointer rests this long.
const TILT_REST_MS = 120;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const play = (el, keyframes, duration) => {
  if (!el || reducedMotion()) return;
  el.animate(keyframes, { duration, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" });
};

// The visitor's hour, read on the client only. The server snapshot is null,
// so the server HTML and the first client render show the fallback greeting
// and hydration always matches.
const noSubscribe = () => () => {};
const getHour = () => new Date().getHours();
const getServerHour = () => null;

// Mini Justine's stage in the hero, with the dual-monitor desk at the right.
// It waves on load (CSS) and greets by the visitor's time. Its eyes follow a
// fine pointer, and a click makes it hop and say the next line. It reacts to
// the theme toggle. It can be dragged anywhere and falls back to its row,
// and when the visitor is idle it walks to the desk and codes. Specs:
// docs/superpowers/specs/2026-10-12-mascot-design.md and
// docs/superpowers/specs/2026-10-12-mascot-stage-design.md.
const HeroMascot = () => {
  const hour = useSyncExternalStore(noSubscribe, getHour, getServerHour);
  const idle = useIdle(IDLE_MS);
  const [lineIndex, setLineIndex] = useState(-1); // -1 until the first click
  const [override, setOverride] = useState(null); // a theme or held line
  const [bubbleOn, setBubbleOn] = useState(true);
  const [pose, setPose] = useState("idle"); // "idle" or "sunglasses"
  const [mode, setMode] = useState("stand"); // stand, walk, held or desk
  const [width, setWidth] = useState(null); // the stage's width, client only
  const [x, setX] = useState(0);
  const [y, setY] = useState(0); // 0 on the row; negative is up
  const [dir, setDir] = useState(1);
  const [motion, setMotion] = useState(null); // { kind: walk | down | up, ms }
  const [landTo, setLandTo] = useState(null); // after a drop: { mode, squash }
  const [tilt, setTilt] = useState(0);
  const stageRef = useRef(null);
  const liftRef = useRef(null);
  const buttonRef = useRef(null);
  const bodyRef = useRef(null);
  const modeRef = useRef(mode);
  const dragRef = useRef(null);
  const dropAtRef = useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // The stage's width: where the desk is and how far Mini Justine can go.
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Eyes follow a fine pointer: --look on the button, no React state.
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reducedMotion()) return undefined;
    let frame = 0;
    let pointerX = 0;
    const onMove = (e) => {
      pointerX = e.clientX;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = buttonRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = pointerX - (rect.left + rect.width / 2);
        let look = 0;
        if (dx > LOOK_DEADZONE_PX) look = 1;
        if (dx < -LOOK_DEADZONE_PX) look = -1;
        el.style.setProperty("--look", String(look));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // React to the theme toggle (data-theme on <html>), not to an OS change.
  // Only a standing Mini Justine puts on sunglasses or hops.
  useEffect(() => {
    let timer;
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme;
      if (theme !== "light" && theme !== "dark") return;
      clearTimeout(timer);
      setOverride(THEME_LINES[theme]);
      setBubbleOn(true);
      if (modeRef.current !== "stand") return;
      if (theme === "light") {
        setPose("sunglasses");
        timer = setTimeout(() => setPose("idle"), SUNGLASSES_MS);
      } else {
        setPose("idle");
        play(bodyRef.current, HOP, 520);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // The bubble fades a while after its line last changed.
  useEffect(() => {
    if (!bubbleOn) return undefined;
    const timer = setTimeout(() => setBubbleOn(false), BUBBLE_MS);
    return () => clearTimeout(timer);
  }, [bubbleOn, override, lineIndex]);

  // The idle routine: from standing, walk (to the seat, or away from it);
  // seated, code for a while, then stand up. Nothing new starts once the
  // visitor is back, and it never runs under reduced motion.
  useEffect(() => {
    if (!idle || width === null || reducedMotion()) return undefined;
    if (mode !== "stand" && mode !== "desk") return undefined;
    const timer = setTimeout(
      () => {
        if (mode === "desk") {
          setX(seatX(width));
          setMode("stand");
          return;
        }
        const from = clampX(x, width);
        const to = nextWalk(from, width, Math.random);
        setDir(to >= from ? 1 : -1);
        setMotion({ kind: "walk", ms: walkMs(from, to) });
        setX(to);
        setMode("walk");
      },
      mode === "desk" ? DESK_MS : STAND_MS,
    );
    return () => clearTimeout(timer);
  }, [idle, mode, x, width]);

  // A walk ends at its target: in the chair if that is the seat.
  useEffect(() => {
    if (mode !== "walk" || !motion) return undefined;
    const timer = setTimeout(() => {
      setMotion(null);
      setMode(width !== null && Math.abs(x - seatX(width)) < 1 ? "desk" : "stand");
    }, motion.ms);
    return () => clearTimeout(timer);
  }, [mode, motion, x, width]);

  // A drop ends on the row (or in the chair), with a squash after a fall.
  useEffect(() => {
    if (!landTo) return undefined;
    const timer = setTimeout(
      () => {
        setMotion(null);
        setMode(landTo.mode);
        setLandTo(null);
        if (landTo.squash) play(bodyRef.current, SQUASH, 280);
      },
      motion ? motion.ms : 0,
    );
    return () => clearTimeout(timer);
  }, [landTo, motion]);

  // Where Mini Justine is drawn right now (mid-walk included), from the stage.
  const drawnAt = () => {
    const stage = stageRef.current.getBoundingClientRect();
    const box = liftRef.current.getBoundingClientRect();
    return { box, x: box.left - stage.left };
  };

  const onClick = () => {
    if (Date.now() - dropAtRef.current < DROP_CLICK_MS || landTo) return;
    if (mode === "walk") {
      setMotion(null);
      setX(drawnAt().x);
    }
    if (mode === "desk" && width !== null) setX(seatX(width));
    setMode("stand");
    setOverride(null);
    setLineIndex(nextLineIndex);
    setBubbleOn(true);
    play(bodyRef.current, HOP, 520);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 || landTo) return;
    const { box } = drawnAt();
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      grabX: e.clientX - box.left,
      grabY: e.clientY - box.top,
      lastX: e.clientX,
      moved: false,
      rest: 0,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_PX) return;
      drag.moved = true;
      setMotion(null);
      setPose("idle");
      setMode("held");
      setOverride(HELD_LINE);
      setBubbleOn(true);
    }
    const stage = stageRef.current.getBoundingClientRect();
    setX(e.clientX - stage.left - drag.grabX);
    setY(e.clientY - (stage.bottom - MASCOT_PX) - drag.grabY);
    if (!reducedMotion()) setTilt(tiltDeg(e.clientX - drag.lastX));
    drag.lastX = e.clientX;
    clearTimeout(drag.rest);
    drag.rest = setTimeout(() => setTilt(0), TILT_REST_MS);
  };

  const onPointerUp = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    clearTimeout(drag.rest);
    if (!drag.moved) return; // a plain press: onClick takes it
    dropAtRef.current = Date.now();
    setTilt(0);
    const land = landing(x, width ?? MASCOT_PX);
    setMotion({ kind: y < 0 ? "down" : "up", ms: reducedMotion() ? 0 : fallMs(y) });
    setX(land.x);
    setY(0);
    setLandTo({ mode: land.mode, squash: land.mode === "stand" && y < -8 });
  };

  let line = FALLBACK_GREETING;
  if (override) line = override;
  else if (lineIndex >= 0) line = CLICK_LINES[lineIndex];
  else if (hour !== null) line = greeting(hour);

  let left = x;
  if (width !== null && mode === "desk") left = seatX(width);
  else if (width !== null && mode !== "held") left = clampX(x, width);
  const side = width === null ? "left" : bubbleSide(left, width);
  // The CSS reads the running move's duration and the desk's height.
  const stageVars = {
    "--i": 3,
    "--mascot-move": `${motion ? motion.ms : 0}ms`,
    "--mascot-desk-h": `${DESK_H}px`,
  };

  return (
    <div
      ref={stageRef}
      className="mascot-stage rise-in relative mt-4 h-36"
      data-mode={mode}
      data-pose={pose}
      data-dir={dir}
      data-motion={motion ? motion.kind : "none"}
      style={stageVars}
    >
      <Desk />
      <div
        className="mascot-x absolute bottom-0 left-0 size-24"
        style={{ transform: `translateX(${left}px)` }}
      >
        <div
          ref={liftRef}
          className="mascot-y relative size-full"
          style={{ transform: `translateY(${y}px)` }}
        >
          <p
            aria-live="polite"
            data-side={side}
            data-on={bubbleOn}
            className="mascot-bubble rounded-card border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink"
          >
            {line}
          </p>
          <button
            ref={buttonRef}
            type="button"
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="Mini Justine, say something"
            className="mascot relative block size-full touch-none select-none"
          >
            <span
              ref={bodyRef}
              className="mascot-body block size-full origin-bottom"
              style={{ rotate: `${tilt}deg` }}
            >
              <span className="mascot-bob relative block size-full">
                <span className="mascot-layer mascot-wave">
                  <Sprite pose="waveA" />
                  <Sprite pose="waveB" className="mascot-frame-b" />
                </span>
                <span className="mascot-layer mascot-idle">
                  <Sprite pose="idle" />
                </span>
                <span className="mascot-layer mascot-sunglasses">
                  <Sprite pose="sunglasses" />
                </span>
                <span className="mascot-layer mascot-walk">
                  <Sprite pose="walkA" />
                  <Sprite pose="walkB" className="mascot-frame-b" />
                </span>
                <span className="mascot-layer mascot-held">
                  <Sprite pose="held" />
                </span>
                <span className="mascot-layer mascot-seated">
                  <Sprite pose="seatedA" />
                  <Sprite pose="seatedB" className="mascot-frame-b" />
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroMascot;
```

- [ ] **Step 4: Update `src/app/globals.css`** (Edit tool, one replacement at a time):

1. After the `--mascot-outline: light-dark(#1b1b1f, #6a6a72);` line add:

```css
  /* The lit monitors' glow behind the desk: dark theme only. */
  --mascot-glow: light-dark(transparent, rgb(150 180 255 / 0.45));
```

2. Replace this block:

```css
.mascot-sunglasses {
  opacity: 0;
}

.mascot[data-pose="sunglasses"] .mascot-wave,
.mascot[data-pose="sunglasses"] .mascot-idle {
  opacity: 0;
}

.mascot[data-pose="sunglasses"] .mascot-sunglasses {
  opacity: 1;
}

/* The hero bubble's tail points left, at the mascot. */
.mascot-bubble {
  position: relative;
}

.mascot-bubble::before {
  content: "";
  position: absolute;
  left: -5px;
  top: 50%;
  width: 8px;
  height: 8px;
  background: var(--surface);
  border-left: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
  transform: translateY(-50%) rotate(45deg);
}
```

with

```css
.mascot-sunglasses,
.mascot-walk,
.mascot-held,
.mascot-seated {
  opacity: 0;
}

.mascot-stage[data-pose="sunglasses"] .mascot-wave,
.mascot-stage[data-pose="sunglasses"] .mascot-idle {
  opacity: 0;
}

.mascot-stage[data-pose="sunglasses"] .mascot-sunglasses {
  opacity: 1;
}

/* The hero stage (HeroMascot): away from standing, only the mode's own
   layer shows. These come after the pose rules, so they win. Spec:
   docs/superpowers/specs/2026-10-12-mascot-stage-design.md. */
.mascot-stage:not([data-mode="stand"]) .mascot-wave,
.mascot-stage:not([data-mode="stand"]) .mascot-idle,
.mascot-stage:not([data-mode="stand"]) .mascot-sunglasses {
  opacity: 0;
}

.mascot-stage[data-mode="walk"] .mascot-walk,
.mascot-stage[data-mode="held"] .mascot-held,
.mascot-stage[data-mode="desk"] .mascot-seated {
  opacity: 1;
}

/* Held, it is drawn above the sticky header (z-30) and below the grain (z-40). */
.mascot-stage[data-mode="held"] {
  z-index: 35;
}

/* Walking left mirrors the side view. */
.mascot-stage[data-dir="-1"] .mascot-walk {
  transform: scaleX(-1);
}

.mascot-stage[data-mode="walk"] .mascot-walk .mascot-frame-b {
  animation: mascot-flip 0.4s steps(1) infinite;
}

/* Seated: typing and the screen code flip together (they start together). */
.mascot-stage[data-mode="desk"] .mascot-seated .mascot-frame-b,
.mascot-stage[data-mode="desk"] .mascot-code-b {
  animation: mascot-flip 0.6s steps(1) infinite;
}

.mascot-stage[data-mode="desk"] .mascot-bob {
  animation: none;
}

.mascot-stage[data-mode="held"] .mascot-bob {
  transform-origin: 50% 0;
  animation: mascot-dangle 1s ease-in-out infinite;
}

.mascot-body {
  transition: rotate 0.25s ease-out;
}

/* Position: x and y are transforms set by HeroMascot; --mascot-move is the
   running walk or fall (0ms while dragging, so it follows the pointer). */
.mascot-x,
.mascot-y {
  transition-property: transform;
  transition-duration: var(--mascot-move, 0ms);
}

.mascot-stage[data-motion="walk"] .mascot-x {
  transition-timing-function: linear;
}

.mascot-stage[data-motion="down"] .mascot-x,
.mascot-stage[data-motion="up"] .mascot-x,
.mascot-stage[data-motion="up"] .mascot-y {
  transition-timing-function: ease-out;
}

/* Let go above the row, it falls: slow at first, then faster. */
.mascot-stage[data-motion="down"] .mascot-y {
  transition-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
}

/* The screens are dark until Mini Justine sits down. */
.mascot-code {
  opacity: 0;
}

.mascot-stage[data-mode="desk"] .mascot-code {
  opacity: 1;
}

.mascot-stage[data-mode="desk"] .mascot-code-b {
  opacity: 0;
}

/* The monitors light up the wall around them (the token is transparent in
   the light theme): centred on the screens, which fill the desk's top 44px. */
.mascot-glow {
  position: absolute;
  left: 50%;
  top: 24px;
  translate: -50% -50%;
  width: 280px;
  height: 180px;
  background: radial-gradient(closest-side, var(--mascot-glow), transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.mascot-stage[data-mode="desk"] .mascot-glow {
  opacity: 1;
}

/* The glow and a dragged Mini Justine can reach past the column; the page
   still never scrolls sideways. clip, unlike hidden, keeps the sticky header. */
body {
  overflow-x: clip;
}

/* The hero bubble floats above Mini Justine's head (above the desk while
   seated), on the stage's side it is in, with its tail pointing down. */
.mascot-bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  width: max-content;
  max-width: 18rem;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.mascot-bubble[data-side="left"] {
  left: 0;
}

.mascot-bubble[data-side="right"] {
  right: 0;
}

.mascot-bubble[data-on="false"] {
  opacity: 0;
}

.mascot-stage[data-mode="desk"] .mascot-bubble {
  bottom: calc(var(--mascot-desk-h) + 8px);
}

.mascot-bubble::before {
  content: "";
  position: absolute;
  bottom: -5px;
  width: 8px;
  height: 8px;
  background: var(--surface);
  border-right: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
  transform: rotate(45deg);
}

.mascot-bubble[data-side="left"]::before {
  left: 40px;
}

.mascot-bubble[data-side="right"]::before {
  right: 40px;
}
```

3. After the `@keyframes mascot-bob { ... }` block add:

```css
@keyframes mascot-dangle {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}
```

4. In the `@media (prefers-reduced-motion: reduce)` block, replace

```css
  .mascot-pupils,
  .mascot-cameo-line {
    transition: none;
  }
```

with

```css
  .mascot-stage[data-mode="held"] .mascot-bob,
  .mascot-stage[data-mode="walk"] .mascot-walk .mascot-frame-b,
  .mascot-stage[data-mode="desk"] .mascot-seated .mascot-frame-b,
  .mascot-stage[data-mode="desk"] .mascot-code-b {
    animation: none;
  }

  .mascot-pupils,
  .mascot-cameo-line,
  .mascot-body,
  .mascot-glow,
  .mascot-bubble {
    transition: none;
  }
```

5. Replace the mascot block's top comment

```css
/* Mini Justine (src/component/mascot): pose layers, idle bob and blink, the
   wave on load, the typing loop and the speech bubbles. All motion is CSS so
   it starts without JavaScript; reduced motion turns it off below. Spec:
   docs/superpowers/specs/2026-10-12-mascot-design.md. */
```

with

```css
/* Mini Justine (src/component/mascot): pose layers, idle bob and blink, the
   wave on load, the typing loop, the hero stage and the speech bubbles. Idle
   motion is CSS so it starts without JavaScript; reduced motion turns it off
   below. Specs: docs/superpowers/specs/2026-10-12-mascot-design.md and
   docs/superpowers/specs/2026-10-12-mascot-stage-design.md. */
```

- [ ] **Step 5: Lint and test**

Run: `npm run lint`, `npm test`, `npm run check:hooks`
Expected: all clean. If lint flags a react-hooks rule on this code, stop and report it with the exact output (do not restructure on your own).

- [ ] **Step 6: Commit**

```bash
git add src/component/mascot/useIdle.js src/component/mascot/Desk.jsx src/component/mascot/HeroMascot.jsx src/app/globals.css
git diff --cached --name-only
git branch --show-current && git commit -F <message file>
```

Message subject: `feat: Mini Justine's stage: drag anywhere, idle routine, the desk`.

---

### Task 4: Whole-feature check (controller)

**Files:** none unless a check fails.

- [ ] **Step 1:** `npm run lint`, `npm test`, `npm run check:hooks` pass.
- [ ] **Step 2:** Start the dev server. In headless Edge (`cdp.mjs`), on `/`:
  - **Server HTML:** it has the stage with `data-mode="stand"` and the fallback greeting. After load: the time greeting, and the bubble fades after about 6 s (`data-on="false"`).
  - **Drag:** press on the mascot, move 200px right and 150px up with the button held. Expect `data-mode="held"`, "Whoa! Put me down!", and a computed stage `z-index` of 35. Release: within 1 s it is back on the row (`.mascot-y` transform `translateY(0)`), `data-mode="stand"`, and a click right after the drop changes no line.
  - **Desk:** drag and release above the desk. Expect `data-mode="desk"`, `.mascot-code` opacity 1, glow opacity 1. In dark, the glow's background is a visible gradient; in light, `--mascot-glow` resolves to transparent.
  - **Click while seated:** `data-mode="stand"` and the next click line.
  - **Idle:** with no input for about 12 s, it walks (`data-mode="walk"`, mirrored when walking left), then sits.
  - **Reduced motion:** no routine after 15 s idle; a drag still works and lands at once.
  - **Coverage:** light and dark screenshots; `/`, `/projects`, `/contact` and `/projects/coopilot` show no horizontal scroll at 390px and 1280px, and no hydration warnings.
- [ ] **Step 3:** Hand to Justine on the PR preview: the feel of the walk, the drag (and on a phone), the fall, the desk scene and the glow in dark.
