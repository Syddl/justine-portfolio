"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { experience } from "@/data/experience";
import { useCountUp } from "@/lib/useCountUp";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const role = experience[0];
const since = role.dates.split(" - ")[0];
const container = staggerContainer(0.12);
const row = fadeInUp(10, 0.4);

// One metric's figure. Metrics with `count` animate their final number once
// the block scrolls into view; the rest are static text.
const Figure = ({ metric, inView }) => {
  const value = useCountUp({
    from: metric.count?.from ?? 0,
    to: metric.count?.to ?? 0,
    inView,
  });
  const after = metric.count ? metric.count.format(value) : metric.after;

  return (
    <span
      aria-hidden="true"
      className={`${jetbrainsMono.className} text-gray-100 text-lg font-semibold whitespace-nowrap`}
    >
      {metric.before && (
        <>
          <span>{metric.before}</span>
          <span className="text-amber-300 mx-1.5">→</span>
        </>
      )}
      {after}
    </span>
  );
};

// Replaces the old code card, which repeated the hero. Same card chrome, but
// the content is the four numbers that make the day job credible, pulled from
// experience[0].metrics so they appear exactly once on the page.
const ProofBlock = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-5"
    >
      <p className={`${jetbrainsMono.className} text-xs text-neutral-500`}>
        {`// day job, in numbers`}
      </p>
      <p className={`${inter.className} text-xs text-neutral-500 mt-1 mb-4`}>
        {role.usageLabel} · since {since}
      </p>

      <ul className="divide-y divide-neutral-800">
        {role.metrics.map((metric) => (
          <motion.li
            key={metric.label}
            variants={row}
            className="py-3 first:pt-0 last:pb-0 flex flex-col gap-0.5"
          >
            <span className="sr-only">{metric.sentence}</span>
            <Figure metric={metric} inView={inView} />
            <span
              aria-hidden="true"
              className={`${inter.className} text-sm text-neutral-400`}
            >
              {metric.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProofBlock;
