// Does NOT exercise: how lines are shown, timing, or HeroMascot/Cameo behaviour (browser check only).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CAMEO_LINES,
  CLICK_LINES,
  FALLBACK_GREETING,
  HELD_LINE,
  THEME_LINES,
  greeting,
  nextLineIndex,
} from "./lines.js";

test("the greeting follows the visitor's hour at every boundary", () => {
  assert.equal(greeting(0), "Up late too? I'm Justine.");
  assert.equal(greeting(4), "Up late too? I'm Justine.");
  assert.equal(greeting(5), "Good morning! I'm Justine.");
  assert.equal(greeting(11), "Good morning! I'm Justine.");
  assert.equal(greeting(12), "Good afternoon! I'm Justine.");
  assert.equal(greeting(17), "Good afternoon! I'm Justine.");
  assert.equal(greeting(18), "Good evening! I'm Justine.");
  assert.equal(greeting(23), "Good evening! I'm Justine.");
});

test("click lines start at the first line and loop", () => {
  assert.equal(CLICK_LINES.length, 7);
  assert.equal(nextLineIndex(-1), 0);
  assert.equal(nextLineIndex(0), 1);
  assert.equal(nextLineIndex(CLICK_LINES.length - 1), 0);
});

test("no line uses an em-dash (house style)", () => {
  const all = [
    FALLBACK_GREETING,
    HELD_LINE,
    ...[0, 6, 13, 20].map(greeting),
    ...CLICK_LINES,
    ...Object.values(THEME_LINES),
    ...Object.values(CAMEO_LINES),
  ];
  for (const line of all) assert.ok(!line.includes("—"), line);
});
