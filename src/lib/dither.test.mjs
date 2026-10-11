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
