"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user" makes every framer-motion transform animation on the
// site instant for visitors who prefer reduced motion (opacity still fades),
// including the variant-driven staggers that the Reveal wrapper cannot
// reach. It changes no markup, so it is hydration-safe.
const MotionProvider = ({ children }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
