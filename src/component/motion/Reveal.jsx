"use client";

import { motion } from "framer-motion";

// The reveal-on-scroll wrapper that every home section used to copy-paste.
// `as` picks the element so sections keep their semantics (<section>, <div>).
const Reveal = ({
  as = "section",
  className = "",
  y = 30,
  delay = 0,
  children,
}) => {
  const Tag = motion[as];

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
