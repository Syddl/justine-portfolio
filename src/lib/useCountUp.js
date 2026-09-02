"use client";

import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

// Returns the live value of a figure that counts from `from` to `to` the
// first time `inView` becomes true. Format it at the call site (round, add
// units).
//
// The initial value is `to`, not `from`: it is the honest static figure for
// server HTML and for reduced-motion visitors, and it keeps the server and
// first client render identical (useReducedMotion() is null on the server).
// The jump back to `from` happens inside the effect, while the row is still
// fading in.
export function useCountUp({ from, to, duration = 1.2, inView }) {
  const prefersReducedMotion = useReducedMotion();
  const value = useMotionValue(to);
  const [current, setCurrent] = useState(to);

  useMotionValueEvent(value, "change", (v) => setCurrent(v));

  useEffect(() => {
    if (!inView || prefersReducedMotion) return undefined;
    value.set(from);
    const controls = animate(value, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, prefersReducedMotion, value, from, to, duration]);

  return current;
}
