// Does NOT exercise: the timers, pointer events and CSS that use these
// numbers in HeroMascot (browser check only).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DESK_H,
  DESK_W,
  MASCOT_PX,
  bubbleRoom,
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

test("the bubble's room is the stage beyond Mini Justine on its side", () => {
  assert.equal(bubbleRoom(0, 640), 640);
  assert.equal(bubbleRoom(524, 640), 620);
  assert.equal(bubbleRoom(94, 342), 248);
  assert.equal(bubbleRoom(130, 342), 226);
});

test("the tilt leans against the drag and stops at 20 degrees", () => {
  assert.equal(tiltDeg(4), -6);
  assert.equal(tiltDeg(-4), 6);
  assert.equal(tiltDeg(100), -20);
});
