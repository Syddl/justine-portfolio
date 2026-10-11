"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Inertial wheel and trackpad scrolling; touch keeps the phone's own
// momentum. Lenis moves the real window scroll position, so framer-motion's
// whileInView and useScroll and the header's CSS scroll timeline keep
// working. Reduced motion is read inside the effect, never in markup (this
// renders none).
const SmoothScroll = () => {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
