// Does NOT exercise: rendering, the CSS motion, or HeroMascot/Cameo behaviour (browser check only).
import { test } from "node:test";
import assert from "node:assert/strict";
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

// Turns "M{x} {y}h{n}v1h-{n}z" segments back into "x,y" cells.
const cells = (d) => {
  const out = [];
  for (const [, x, y, n] of d.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g)) {
    for (let i = 0; i < Number(n); i += 1) out.push(`${Number(x) + i},${y}`);
  }
  return out;
};

test("every pose is SIZE x SIZE and uses only palette keys", () => {
  const allowed = new Set([".", ...Object.keys(PALETTE)]);
  for (const [name, map] of Object.entries(POSES)) {
    assert.equal(map.length, SIZE, `${name}: rows`);
    for (const row of map) {
      assert.equal(row.length, SIZE, `${name}: row width`);
      for (const ch of row) assert.ok(allowed.has(ch), `${name}: unknown pixel "${ch}"`);
    }
  }
});

test("patch writes text, clears with '.', and keeps pixels under ' '", () => {
  assert.deepEqual(patch(["....", "...."], [[0, 1, "AB"], [1, 0, "C D"]]), [".AB.", "C.D."]);
  assert.deepEqual(patch(["XXXX"], [[0, 1, "."]]), ["X.XX"]);
});

test("the front eyes show where the eye layers expect them, and nowhere else", () => {
  for (const name of ["idle", "waveA", "waveB", "typingA", "typingB", "envelope", "held"]) {
    assert.ok(hasEyes(POSES[name]), `${name} should show eyes`);
  }
  for (const name of ["sunglasses", "walkA", "walkB", "seatedA", "seatedB"]) {
    assert.equal(hasEyes(POSES[name]), false, `${name} should not show the front eyes`);
  }
});

test("the outline sits only on empty pixels next to filled ones", () => {
  assert.deepEqual(withOutline(["S"]), [".O.", "OSO", ".O."]);
  assert.deepEqual(withOutline(["S."]), [".O..", "OSO.", ".O.."]);
});

test("the layers draw every filled and outline pixel exactly once", () => {
  for (const [name, map] of Object.entries(POSES)) {
    const expected = new Set();
    withOutline(map).forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch !== ".") expected.add(`${x},${y}`);
      }),
    );
    const { width, height, paths, whites, pupils } = spriteLayers(map);
    assert.equal(width, SIZE + 2);
    assert.equal(height, SIZE + 2);
    const drawn = paths.flatMap(({ d }) => cells(d));
    assert.equal(drawn.length, new Set(drawn).size, `${name}: a pixel is drawn twice`);
    assert.deepEqual(new Set(drawn), expected, `${name}: body covers exactly the outlined sprite`);
    if (hasEyes(map)) {
      // White sits under the pupils too, so a pupil that looks aside leaves white behind.
      const grid = (cols) => new Set(EYE_ROWS.flatMap((r) => cols.map((c) => `${c + 1},${r + 1}`)));
      assert.deepEqual(new Set(cells(whites)), grid([...EYE_WHITES, ...PUPILS]), `${name}: whites`);
      assert.deepEqual(new Set(cells(pupils)), grid(PUPILS), `${name}: pupils`);
    } else {
      assert.equal(whites, "", `${name}: no whites layer`);
      assert.equal(pupils, "", `${name}: no pupils layer`);
    }
  }
});

test("under the eye layers the face is skin, so a blink shows skin", () => {
  const skin = new Set(cells(spriteLayers(BASE).paths.find((p) => p.key === "S").d));
  for (const r of EYE_ROWS) {
    for (const c of [...EYE_WHITES, ...PUPILS]) {
      assert.ok(skin.has(`${c + 1},${r + 1}`), `skin under eye pixel ${c},${r}`);
    }
  }
});

test("POSE_LAYERS holds the layers of every pose", () => {
  assert.deepEqual(Object.keys(POSE_LAYERS).sort(), Object.keys(POSES).sort());
});

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
