"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Sprite from "@/component/mascot/Sprite";
import {
  CLICK_LINES,
  FALLBACK_GREETING,
  THEME_LINES,
  greeting,
  nextLineIndex,
} from "@/lib/mascot/lines";

// The hop on click: squash, jump, settle (about half a second).
const HOP = [
  { transform: "translateY(0) scale(1, 1)" },
  { transform: "translateY(0) scale(1.12, 0.86)", offset: 0.15 },
  { transform: "translateY(-14px) scale(0.94, 1.08)", offset: 0.45 },
  { transform: "translateY(0) scale(1.08, 0.92)", offset: 0.75 },
  { transform: "translateY(0) scale(1, 1)" },
];
const SUNGLASSES_MS = 4000;
// The pupils look left or right only once the pointer is this far from the
// mascot's centre, so they rest while the pointer is on it.
const LOOK_DEADZONE_PX = 24;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const hop = (el) => {
  if (!el || reducedMotion()) return;
  el.animate(HOP, { duration: 520, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" });
};

// The visitor's hour, read on the client only. The server snapshot is null,
// so the server HTML and the first client render show the fallback greeting
// and hydration always matches.
const noSubscribe = () => () => {};
const getHour = () => new Date().getHours();
const getServerHour = () => null;

// Mini Justine in the hero: waves on load (CSS), greets by the visitor's
// time, follows a fine pointer with its eyes, hops and says the next line
// when clicked, and reacts to the theme toggle. Spec:
// docs/superpowers/specs/2026-10-12-mascot-design.md.
const HeroMascot = () => {
  const hour = useSyncExternalStore(noSubscribe, getHour, getServerHour);
  const [lineIndex, setLineIndex] = useState(-1); // -1 until the first click
  const [themeLine, setThemeLine] = useState(null);
  const [pose, setPose] = useState("idle"); // "idle" or "sunglasses"
  const buttonRef = useRef(null);
  const hopRef = useRef(null);

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
  useEffect(() => {
    let timer;
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme;
      if (theme !== "light" && theme !== "dark") return;
      clearTimeout(timer);
      setThemeLine(THEME_LINES[theme]);
      if (theme === "light") {
        setPose("sunglasses");
        timer = setTimeout(() => setPose("idle"), SUNGLASSES_MS);
      } else {
        setPose("idle");
        hop(hopRef.current);
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

  const onClick = () => {
    setThemeLine(null);
    setLineIndex(nextLineIndex);
    hop(hopRef.current);
  };

  let line = FALLBACK_GREETING;
  if (themeLine) line = themeLine;
  else if (lineIndex >= 0) line = CLICK_LINES[lineIndex];
  else if (hour !== null) line = greeting(hour);

  return (
    <div className="rise-in mt-8 flex items-center gap-4" style={{ "--i": 3 }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label="Mini Justine, say something"
        data-pose={pose}
        className="mascot relative size-24 shrink-0"
      >
        <span ref={hopRef} className="block size-full origin-bottom">
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
          </span>
        </span>
      </button>
      <p
        aria-live="polite"
        className="mascot-bubble rounded-card border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink"
      >
        {line}
      </p>
    </div>
  );
};

export default HeroMascot;
