"use client";

import { motion, useReducedMotion } from "framer-motion";

// The reveal-on-scroll wrapper that every home section used to copy-paste.
// `as` picks the element so sections keep their semantics (<section>, <div>).
//
// useReducedMotion() is null on the server and resolved on the first client
// render, so it must never change the markup (hydration mismatch). It only
// zeroes the transition: reduced-motion visitors get an instant reveal.
const Reveal = ({
  as = "section",
  className = "",
  y = 30,
  delay = 0,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: "easeOut", delay }
      }
      className={className}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
