// Shared Framer Motion variants used across sections and pages.

export const staggerContainer = (staggerChildren = 0.15, delayChildren = 0) => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

export const fadeInUp = (y = 30, duration = 0.5) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
});
