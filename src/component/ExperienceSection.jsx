"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { experience } from "@/data/experience";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Where an entry's dot sits as a fraction of the rail. A ResizeObserver on
// the rail re-measures whenever its height changes (font swap, viewport
// resize, re-wrapped text), so the threshold never goes stale.
const useRailThreshold = (entryRef, railRef) => {
  const [threshold, setThreshold] = useState(1);

  useEffect(() => {
    const rail = railRef.current;
    const entry = entryRef.current;
    if (!rail || !entry) return undefined;

    const measure = () => {
      // The overlay is inset 8px top and bottom (top-2 bottom-2) and the dot
      // sits 6px below the entry's top edge, so measure against the drawn
      // line, not the container.
      setThreshold((entry.offsetTop + 6 - 8) / (rail.offsetHeight - 16));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [entryRef, railRef]);

  return threshold;
};

const Entry = ({ job, railRef, scaleY }) => {
  const ref = useRef(null);
  const threshold = useRailThreshold(ref, railRef);
  const isCurrent = /present/i.test(job.dates);

  // Each dot listens to the spring itself. setLit with an unchanged boolean
  // is a no-op for React, so nothing re-renders per animation frame; only
  // the entry being crossed re-renders, once.
  const [lit, setLit] = useState(false);
  useMotionValueEvent(scaleY, "change", (v) => setLit(v >= threshold));

  return (
    <div ref={ref} className="relative pl-8">
      {/* Timeline dot: pulses green for the current role, otherwise turns
          amber as the rail is drawn past it. */}
      {isCurrent ? (
        <span
          className="absolute left-0 top-1.5 flex h-[11px] w-[11px]"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-green-500" />
        </span>
      ) : (
        <span
          className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-neutral-900 transition-colors duration-300 motion-reduce:bg-neutral-600 ${
            lit ? "bg-amber-300" : "bg-neutral-600"
          }`}
          aria-hidden="true"
        />
      )}

      {job.type && (
        <p
          className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-400 mb-1`}
        >
          {job.type}
        </p>
      )}

      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className={`${inter.className} text-gray-100 font-semibold`}>
          {job.title}
          <span className="text-neutral-400 font-normal"> · {job.company}</span>
        </h3>
        <span
          className={`${inter.className} text-xs text-neutral-500 whitespace-nowrap`}
        >
          {job.dates}
        </span>
      </div>

      {job.location && (
        <p className={`${inter.className} text-xs text-neutral-500 mt-1`}>
          {job.location}
        </p>
      )}

      {job.description && (
        <p
          className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-2`}
        >
          {job.description}
        </p>
      )}

      {job.tech?.length > 0 && (
        <p className={`${inter.className} text-xs text-neutral-500 mt-3`}>
          {job.tech.join("  ·  ")}
        </p>
      )}
    </div>
  );
};

const ExperienceSection = () => {
  const railRef = useRef(null);

  // The amber rail draws from the top as the list scrolls through the
  // viewport; a spring keeps it from snapping between scroll events.
  // Reduced motion is handled in CSS (motion-reduce:*), never by branching
  // the markup: useReducedMotion() is null on the server and resolved on the
  // first client render, which would be a hydration mismatch.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <Reveal className="mb-16">
      <SectionHeading eyebrow="experience" title="Work experience" />

      <div ref={railRef} className="relative">
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px bg-neutral-800"
          aria-hidden="true"
        />
        <motion.div
          style={{ scaleY }}
          className="absolute left-[5px] top-2 bottom-2 w-px bg-amber-300/70 origin-top motion-reduce:hidden"
          aria-hidden="true"
        />

        <div className="space-y-10">
          {experience.map((job) => (
            <Entry
              key={`${job.company}-${job.title}-${job.dates}`}
              job={job}
              railRef={railRef}
              scaleY={scaleY}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default ExperienceSection;
