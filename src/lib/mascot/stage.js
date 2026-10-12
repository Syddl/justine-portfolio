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
