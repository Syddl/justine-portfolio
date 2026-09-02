"use client";

import { motion, useScroll } from "framer-motion";

// Thin reading-progress bar for long case-study pages only - the home page
// is short enough that it would just be noise there. Hidden with a CSS
// motion-reduce variant rather than a useReducedMotion() branch, which would
// render different markup on the server and the first client render.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-amber-300/70 z-50 motion-reduce:hidden"
    />
  );
};

export default ScrollProgress;
