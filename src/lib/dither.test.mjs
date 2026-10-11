import { test } from "node:test";
import assert from "node:assert/strict";
import { INTRO_MS, ditherCut, ditherThresholds, introScript } from "./dither.js";

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

// Runs the real inline script against a stubbed canvas and window.
const runIntro = ({ reducedMotion = false } = {}) => {
  const canvas = { style: {} };
  let image;
  canvas.getContext = () => ({
    createImageData: (w, h) => (image = { data: new Uint8ClampedArray(w * h * 4) }),
    putImageData: () => {},
  });
  const frames = [];
  const env = {
    document: { currentScript: { previousElementSibling: canvas }, body: {} },
    matchMedia: () => ({ matches: reducedMotion }),
    innerWidth: 300,
    innerHeight: 150,
    getComputedStyle: () => ({ backgroundColor: "rgb(252, 252, 251)" }),
    requestAnimationFrame: (cb) => frames.push(cb),
  };
  new Function(...Object.keys(env), introScript)(...Object.values(env));
  return { canvas, frames, image: () => image };
};

test("the inline intro script sizes, paints, then clears the cover", () => {
  const { canvas, frames, image } = runIntro();
  assert.equal(canvas.width, 100);
  assert.equal(canvas.height, 50);
  assert.deepEqual([...image().data.slice(0, 4)], [252, 252, 251, 255]);

  frames.shift()(0); // first frame records the start time
  frames.shift()(INTRO_MS); // last frame
  assert.equal(frames.length, 0, "no frame after the end");
  assert.equal(canvas.style.display, "none");
  assert.ok(
    image().data.every((v, i) => i % 4 !== 3 || v === 0),
    "every pixel is clear",
  );
});

test("the inline intro script hides the cover at once under reduced motion", () => {
  const { canvas, frames } = runIntro({ reducedMotion: true });
  assert.equal(canvas.style.display, "none");
  assert.equal(frames.length, 0);
});
