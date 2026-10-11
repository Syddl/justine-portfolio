"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
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
          green as the rail is drawn past it. */}
      {isCurrent ? (
        <span
          className="absolute left-0 top-1.5 flex h-[11px] w-[11px]"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-accent" />
        </span>
      ) : (
        <span
          className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-bg transition-colors duration-300 motion-reduce:bg-faint ${
            lit ? "bg-accent" : "bg-faint"
          }`}
          aria-hidden="true"
        />
      )}

      {/* Hover fill on the text only, so the dot and rail stay put. The
          negative margins keep the layout identical to the unpadded box. */}
      <div className="-mx-3 -my-2 rounded-card px-3 py-2 transition-colors duration-150 hover:bg-hover">
        {job.type && (
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
            {job.type}
          </p>
        )}

        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-ink font-semibold">
            {job.title}
            <span className="text-muted font-normal"> · {job.company}</span>
          </h3>
          <span className="text-xs text-muted whitespace-nowrap">
            {job.dates}
          </span>
        </div>

        {job.location && (
          <p className="text-xs text-muted mt-1">{job.location}</p>
        )}

        {job.description && (
          <p className="text-sm text-body leading-relaxed mt-2">
            {job.description}
          </p>
        )}

        {job.metrics?.length > 0 && (
          <ul className="font-mono text-xs text-muted mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {job.metrics.map((metric, i) => (
              <li key={metric.label}>
                <span className="sr-only">{metric.sentence}</span>
                <span aria-hidden="true">
                  {i > 0 && <span className="text-faint mr-3">·</span>}
                  <span className="text-ink-2">
                    {metric.before ? `${metric.before} → ${metric.after}` : metric.after}
                  </span>{" "}
                  {metric.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {job.tech?.length > 0 && (
          <p className="text-xs text-muted mt-3">{job.tech.join("  ·  ")}</p>
        )}
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const railRef = useRef(null);

  // The green rail draws from the top as the list scrolls through the
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
      <SectionHeading title="Work experience" />

      <div ref={railRef} className="relative">
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px bg-line"
          aria-hidden="true"
        />
        <motion.div
          style={{ scaleY }}
          className="absolute left-[5px] top-2 bottom-2 w-px bg-accent/70 origin-top motion-reduce:hidden"
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
