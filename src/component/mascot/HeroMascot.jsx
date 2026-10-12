"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Desk from "@/component/mascot/Desk";
import Sprite from "@/component/mascot/Sprite";
import useIdle from "@/component/mascot/useIdle";
import {
  CLICK_LINES,
  FALLBACK_GREETING,
  HELD_LINE,
  THEME_LINES,
  greeting,
  nextLineIndex,
} from "@/lib/mascot/lines";
import {
  BUBBLE_MS,
  DESK_H,
  DESK_MS,
  DRAG_PX,
  IDLE_MS,
  MASCOT_PX,
  STAND_MS,
  bubbleSide,
  clampX,
  fallMs,
  landing,
  nextWalk,
  seatX,
  tiltDeg,
  walkMs,
} from "@/lib/mascot/stage";

// The hop on click: squash, jump, settle (about half a second).
const HOP = [
  { transform: "translateY(0) scale(1, 1)" },
  { transform: "translateY(0) scale(1.12, 0.86)", offset: 0.15 },
  { transform: "translateY(-14px) scale(0.94, 1.08)", offset: 0.45 },
  { transform: "translateY(0) scale(1.08, 0.92)", offset: 0.75 },
  { transform: "translateY(0) scale(1, 1)" },
];
// The landing after a fall from above.
const SQUASH = [{ transform: "scale(1.14, 0.84)" }, { transform: "scale(1, 1)" }];
const SUNGLASSES_MS = 4000;
// The pupils look left or right only once the pointer is this far from the
// mascot's centre, so they rest while the pointer is on it.
const LOOK_DEADZONE_PX = 24;
// A click this soon after a drop is the drop's own click, not a new one.
const DROP_CLICK_MS = 300;
// The tilt eases back to upright once the pointer rests this long.
const TILT_REST_MS = 120;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const play = (el, keyframes, duration) => {
  if (!el || reducedMotion()) return;
  el.animate(keyframes, { duration, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" });
};

// The visitor's hour, read on the client only. The server snapshot is null,
// so the server HTML and the first client render show the fallback greeting
// and hydration always matches.
const noSubscribe = () => () => {};
const getHour = () => new Date().getHours();
const getServerHour = () => null;

// Mini Justine's stage in the hero, with the dual-monitor desk at the right.
// It waves on load (CSS) and greets by the visitor's time. Its eyes follow a
// fine pointer, and a click makes it hop and say the next line. It reacts to
// the theme toggle. It can be dragged anywhere and falls back to its row,
// and when the visitor is idle it walks to the desk and codes. Specs:
// docs/superpowers/specs/2026-10-12-mascot-design.md and
// docs/superpowers/specs/2026-10-12-mascot-stage-design.md.
const HeroMascot = () => {
  const hour = useSyncExternalStore(noSubscribe, getHour, getServerHour);
  const idle = useIdle(IDLE_MS);
  const [lineIndex, setLineIndex] = useState(-1); // -1 until the first click
  const [override, setOverride] = useState(null); // a theme or held line
  const [bubbleOn, setBubbleOn] = useState(true);
  const [pose, setPose] = useState("idle"); // "idle" or "sunglasses"
  const [mode, setMode] = useState("stand"); // stand, walk, held or desk
  const [width, setWidth] = useState(null); // the stage's width, client only
  const [x, setX] = useState(0);
  const [y, setY] = useState(0); // 0 on the row; negative is up
  const [dir, setDir] = useState(1);
  const [motion, setMotion] = useState(null); // { kind: walk | down | up, ms }
  const [landTo, setLandTo] = useState(null); // after a drop: { mode, squash }
  const [tilt, setTilt] = useState(0);
  const stageRef = useRef(null);
  const liftRef = useRef(null);
  const buttonRef = useRef(null);
  const bodyRef = useRef(null);
  const modeRef = useRef(mode);
  const dragRef = useRef(null);
  const dropAtRef = useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // The stage's width: where the desk is and how far Mini Justine can go.
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

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
  // Only a standing Mini Justine puts on sunglasses or hops.
  useEffect(() => {
    let timer;
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme;
      if (theme !== "light" && theme !== "dark") return;
      clearTimeout(timer);
      setOverride(THEME_LINES[theme]);
      setBubbleOn(true);
      if (modeRef.current !== "stand") return;
      if (theme === "light") {
        setPose("sunglasses");
        timer = setTimeout(() => setPose("idle"), SUNGLASSES_MS);
      } else {
        setPose("idle");
        play(bodyRef.current, HOP, 520);
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

  // The bubble fades a while after its line last changed.
  useEffect(() => {
    if (!bubbleOn) return undefined;
    const timer = setTimeout(() => setBubbleOn(false), BUBBLE_MS);
    return () => clearTimeout(timer);
  }, [bubbleOn, override, lineIndex]);

  // The idle routine: from standing, walk (to the seat, or away from it);
  // seated, code for a while, then stand up. Nothing new starts once the
  // visitor is back, and it never runs under reduced motion.
  useEffect(() => {
    if (!idle || width === null || reducedMotion()) return undefined;
    if (mode !== "stand" && mode !== "desk") return undefined;
    const timer = setTimeout(
      () => {
        if (mode === "desk") {
          setX(seatX(width));
          setMode("stand");
          return;
        }
        const from = clampX(x, width);
        const to = nextWalk(from, width, Math.random);
        setDir(to >= from ? 1 : -1);
        setMotion({ kind: "walk", ms: walkMs(from, to) });
        setX(to);
        setMode("walk");
      },
      mode === "desk" ? DESK_MS : STAND_MS,
    );
    return () => clearTimeout(timer);
  }, [idle, mode, x, width]);

  // A walk ends at its target: in the chair if that is the seat.
  useEffect(() => {
    if (mode !== "walk" || !motion) return undefined;
    const timer = setTimeout(() => {
      setMotion(null);
      setMode(width !== null && Math.abs(x - seatX(width)) < 1 ? "desk" : "stand");
    }, motion.ms);
    return () => clearTimeout(timer);
  }, [mode, motion, x, width]);

  // A drop ends on the row (or in the chair), with a squash after a fall.
  useEffect(() => {
    if (!landTo) return undefined;
    const timer = setTimeout(
      () => {
        setMotion(null);
        setMode(landTo.mode);
        setLandTo(null);
        if (landTo.squash) play(bodyRef.current, SQUASH, 280);
      },
      motion ? motion.ms : 0,
    );
    return () => clearTimeout(timer);
  }, [landTo, motion]);

  // Where Mini Justine is drawn right now (mid-walk included), from the stage.
  const drawnAt = () => {
    const stage = stageRef.current.getBoundingClientRect();
    const box = liftRef.current.getBoundingClientRect();
    return { box, x: box.left - stage.left };
  };

  const onClick = () => {
    if (Date.now() - dropAtRef.current < DROP_CLICK_MS || landTo) return;
    if (mode === "walk") {
      setMotion(null);
      setX(drawnAt().x);
    }
    if (mode === "desk" && width !== null) setX(seatX(width));
    setMode("stand");
    setOverride(null);
    setLineIndex(nextLineIndex);
    setBubbleOn(true);
    play(bodyRef.current, HOP, 520);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 || landTo) return;
    const { box } = drawnAt();
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      grabX: e.clientX - box.left,
      grabY: e.clientY - box.top,
      lastX: e.clientX,
      moved: false,
      rest: 0,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_PX) return;
      drag.moved = true;
      setMotion(null);
      setPose("idle");
      setMode("held");
      setOverride(HELD_LINE);
      setBubbleOn(true);
    }
    const stage = stageRef.current.getBoundingClientRect();
    setX(e.clientX - stage.left - drag.grabX);
    setY(e.clientY - (stage.bottom - MASCOT_PX) - drag.grabY);
    if (!reducedMotion()) setTilt(tiltDeg(e.clientX - drag.lastX));
    drag.lastX = e.clientX;
    clearTimeout(drag.rest);
    drag.rest = setTimeout(() => setTilt(0), TILT_REST_MS);
  };

  const onPointerUp = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    clearTimeout(drag.rest);
    if (!drag.moved) return; // a plain press: onClick takes it
    dropAtRef.current = Date.now();
    setTilt(0);
    const land = landing(x, width ?? MASCOT_PX);
    setMotion({ kind: y < 0 ? "down" : "up", ms: reducedMotion() ? 0 : fallMs(y) });
    setX(land.x);
    setY(0);
    setLandTo({ mode: land.mode, squash: land.mode === "stand" && y < -8 });
  };

  let line = FALLBACK_GREETING;
  if (override) line = override;
  else if (lineIndex >= 0) line = CLICK_LINES[lineIndex];
  else if (hour !== null) line = greeting(hour);

  let left = x;
  if (width !== null && mode === "desk") left = seatX(width);
  else if (width !== null && mode !== "held") left = clampX(x, width);
  const side = width === null ? "left" : bubbleSide(left, width);
  // The CSS reads the running move's duration and the desk's height.
  const stageVars = {
    "--i": 3,
    "--mascot-move": `${motion ? motion.ms : 0}ms`,
    "--mascot-desk-h": `${DESK_H}px`,
  };

  return (
    <div
      ref={stageRef}
      className="mascot-stage rise-in relative mt-4 h-36"
      data-mode={mode}
      data-pose={pose}
      data-dir={dir}
      data-motion={motion ? motion.kind : "none"}
      style={stageVars}
    >
      <Desk />
      <div
        className="mascot-x absolute bottom-0 left-0 size-24"
        style={{ transform: `translateX(${left}px)` }}
      >
        <div
          ref={liftRef}
          className="mascot-y relative size-full"
          style={{ transform: `translateY(${y}px)` }}
        >
          <p
            aria-live="polite"
            data-side={side}
            data-on={bubbleOn}
            className="mascot-bubble rounded-card border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink"
          >
            {line}
          </p>
          <button
            ref={buttonRef}
            type="button"
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="Mini Justine, say something"
            className="mascot relative block size-full touch-none select-none"
          >
            <span
              ref={bodyRef}
              className="mascot-body block size-full origin-bottom"
              style={{ rotate: `${tilt}deg` }}
            >
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
                <span className="mascot-layer mascot-walk">
                  <Sprite pose="walkA" />
                  <Sprite pose="walkB" className="mascot-frame-b" />
                </span>
                <span className="mascot-layer mascot-held">
                  <Sprite pose="held" />
                </span>
                <span className="mascot-layer mascot-seated">
                  <Sprite pose="seatedA" />
                  <Sprite pose="seatedB" className="mascot-frame-b" />
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroMascot;
