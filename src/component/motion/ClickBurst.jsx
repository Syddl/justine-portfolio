"use client";

import { useEffect } from "react";

// Directions of the five lines, as rotations of a line pointing down:
// left, up-left, up, up-right, right.
const ANGLES = [90, 135, 180, 225, 270];

// Five short lines spray from every left mouse click and fade (.click-burst
// in globals.css, hidden there under reduced motion). Mouse only: on touch a
// tap is usually a scroll or a link, and the burst would sit under a finger.
// Renders nothing.
const ClickBurst = () => {
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      for (const angle of ANGLES) {
        const line = document.createElement("span");
        line.style.setProperty("--a", `${angle}deg`);
        burst.append(line);
      }
      document.body.append(burst);
      setTimeout(() => burst.remove(), 500);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
};

export default ClickBurst;
