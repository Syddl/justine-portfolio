"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTERVAL_MS = 3500;

// The quoted line inside the hero h1. phrases[0] is rendered on the server so
// the canonical headline is in the initial HTML; the rest cycle after mount.
//
// Layout: every phrase is drawn invisibly in the same grid cell as the live
// one, so the block is always as tall as the longest phrase and a wrapping
// phrase on a phone never shifts the lines around it.
//
// The cursor is always in the markup; globals.css hides it under
// prefers-reduced-motion. Branching on useReducedMotion() here would render
// different HTML on the server and on the first client render.
const Cursor = () => (
  <span
    aria-hidden="true"
    className="cursor-blink inline-block w-[0.5ch] h-[0.85em] bg-amber-300 ml-1 align-[-0.1em]"
  />
);

const RequirementCycler = ({ phrases, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || phrases.length < 2) return undefined;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion, phrases.length]);

  const phrase = phrases[index];

  return (
    <span className={`grid ${className}`}>
      {phrases.map((p) => (
        <span
          key={p}
          aria-hidden="true"
          className="[grid-area:1/1] invisible"
        >
          {`"${p}"`}
          <Cursor />
        </span>
      ))}
      <span className="[grid-area:1/1]" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phrase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="block"
          >
            {`"${phrase}"`}
            <Cursor />
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

export default RequirementCycler;
