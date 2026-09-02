"use client";

import { motion, useReducedMotion } from "framer-motion";

// The reveal-on-scroll wrapper that every home section used to copy-paste.
// `as` picks the element so sections keep their semantics (<section>, <div>).
// Under reduced motion the content is simply there: no fade, no slide.
const Reveal = ({
  as = "section",
  className = "",
  y = 30,
  delay = 0,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Tag = motion[as];

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
