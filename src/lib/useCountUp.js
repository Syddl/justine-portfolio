"use client";

import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

// Counts from `from` to `to` the first time `inView` becomes true and returns
// the live value. Format it at the call site (round, add units). Under reduced
// motion the final value is returned immediately.
export function useCountUp({ from, to, duration = 1.2, inView }) {
  const prefersReducedMotion = useReducedMotion();
  const value = useMotionValue(from);
  const [current, setCurrent] = useState(from);

  useMotionValueEvent(value, "change", (v) => setCurrent(v));

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion) {
      value.set(to);
      return undefined;
    }
    const controls = animate(value, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, prefersReducedMotion, value, to, duration]);

  return prefersReducedMotion ? to : current;
}
