"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { stackGroups } from "@/data/stackdata";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { buildStackUsage, sharesContext } from "@/lib/stackUsage";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

const usage = buildStackUsage({ projects, experience });

const DEFAULT_CAPTION =
  "Everything here is in something I've shipped. Hover a tool to see where.";

// The caption under the heading doubles as the section lede and as the
// answer to "where did you use this?". Swapped with a short fade so it never
// jumps.
const Caption = ({ active }) => {
  const contexts = active ? (usage.get(active) ?? []) : [];

  let text = DEFAULT_CAPTION;
  if (active && contexts.length) {
    text = (
      <>
        used in:{" "}
        <span className="text-amber-300">{contexts.join(" · ")}</span>
      </>
    );
  } else if (active) {
    text = "used in: work without a public write-up yet";
  }

  return (
    <span aria-live="polite" className="block min-h-[1.5em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ?? "default"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`${active ? jetbrainsMono.className : inter.className} block`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Thirty tools in plain rows instead of thirty bordered chips. Hover, focus,
// or tap a tool and everything that was never shipped alongside it dims,
// which turns the list into a claim the visitor can check.
const TechStackSection = () => {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  // Touch has no hover: a tap toggles a tool; a tap outside the section or
  // Escape clears it.
  useEffect(() => {
    if (!active) return undefined;
    const onPointerDown = (e) => {
      if (!sectionRef.current?.contains(e.target)) setActive(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const activeHasUsage = active ? (usage.get(active) ?? []).length > 0 : false;

  return (
    <Reveal className="mb-16">
      <div ref={sectionRef}>
        <SectionHeading
          eyebrow="stack"
          title="Tech stack"
          lede={<Caption active={active} />}
        />

        <div className="space-y-4">
          {stackGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-y-2 sm:grid-cols-[9rem_1fr] sm:gap-x-6"
            >
              <p
                className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 pt-1`}
              >
                {group.label}
              </p>

              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {group.items.map(({ icon: Icon, name }) => {
                  const isActive = active === name;
                  const dim =
                    active &&
                    activeHasUsage &&
                    !isActive &&
                    !sharesContext(usage, active, name);

                  return (
                    <li key={name}>
                      <button
                        type="button"
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") setActive(name);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") setActive(null);
                        }}
                        onPointerDown={(e) => {
                          if (e.pointerType !== "mouse") {
                            setActive((current) => (current === name ? null : name));
                          }
                        }}
                        onFocus={() => setActive(name)}
                        onBlur={() => setActive(null)}
                        className={`${inter.className} inline-flex items-center gap-1.5 text-sm cursor-default rounded-sm transition-[color,opacity] duration-200 focus-visible:outline-1 focus-visible:outline-neutral-500 ${
                          isActive
                            ? "text-amber-300"
                            : "text-neutral-300 hover:text-gray-100"
                        } ${dim ? "opacity-40" : "opacity-100"}`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default TechStackSection;
