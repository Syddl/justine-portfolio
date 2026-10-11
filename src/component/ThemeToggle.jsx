"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { DITHER_PX, THEME_MS, ditherCut, ditherThresholds } from "@/lib/dither";
import { THEME_KEY, nextTheme } from "@/lib/theme";

const FRAMES = 30;
let cached = null;

// The dither as mask keyframes: FRAMES snapshots of the dissolve, each a
// small canvas turned into a data URL and scaled up DITHER_PX times. Built
// on the first switch and reused until the viewport size changes.
const maskFrames = () => {
  const cols = Math.ceil(innerWidth / DITHER_PX);
  const rows = Math.ceil(innerHeight / DITHER_PX);
  const key = `${cols}x${rows}`;
  if (cached?.key === key) return cached.frames;

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(cols, rows);
  const thresholds = ditherThresholds(cols, rows);
  const frames = Array.from({ length: FRAMES }, (_, k) => {
    const line = ditherCut(k / (FRAMES - 1));
    for (let i = 0; i < thresholds.length; i++) {
      image.data[4 * i + 3] = thresholds[i] < line ? 255 : 0;
    }
    ctx.putImageData(image, 0, 0);
    return {
      maskImage: `url(${canvas.toDataURL()})`,
      maskSize: `${cols * DITHER_PX}px ${rows * DITHER_PX}px`,
      maskRepeat: "no-repeat",
      imageRendering: "pixelated",
    };
  });
  cached = { key, frames };
  return frames;
};

// Flips the theme and saves the choice. With View Transitions the new theme
// is revealed through the dither mask, top first; without them, or with
// reduced motion, it switches at once. Which icon shows is decided in CSS
// (the dark: variant), so the server and client markup are identical.
const ThemeToggle = () => {
  const toggle = () => {
    const root = document.documentElement;
    const next = nextTheme(
      root.dataset.theme,
      matchMedia("(prefers-color-scheme: dark)").matches,
    );
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Storage blocked (private mode): the switch still holds for this page.
      }
    };

    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    const frames = maskFrames();
    document.startViewTransition(apply).ready.then(
      () =>
        root.animate(frames, {
          duration: THEME_MS,
          pseudoElement: "::view-transition-new(root)",
        }),
      () => {},
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-ink active:scale-[0.97]"
    >
      <FiMoon className="size-4 dark:hidden" aria-hidden="true" />
      <FiSun className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
