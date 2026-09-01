"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

// Thin reading-progress bar for long case-study pages only - the home page
// is short enough that it would just be noise there.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-blue-500 to-violet-500 opacity-70 z-50"
    />
  );
};

export default ScrollProgress;
