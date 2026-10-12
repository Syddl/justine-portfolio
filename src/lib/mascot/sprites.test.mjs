// Does NOT exercise: rendering, the CSS motion, or HeroMascot/Cameo behaviour (browser check only).
import { test } from "node:test";
import assert from "node:assert/strict";
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

test("the eyes are where the eye layers expect them, except under sunglasses", () => {
  for (const name of ["idle", "waveA", "waveB", "typingA", "typingB", "envelope"]) {
    assert.ok(hasEyes(POSES[name]), `${name} should show eyes`);
  }
  assert.equal(hasEyes(POSES.sunglasses), false);
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
    const { size, paths, whites, pupils } = spriteLayers(map);
    assert.equal(size, SIZE + 2);
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
