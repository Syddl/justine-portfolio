"use client";

import { motion } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { hackathons } from "@/data/hackathons";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const container = staggerContainer(0.1);
const rowVariant = fadeInUp(16, 0.45);

// Deliberately not the timeline used by Work Experience: these are not a
// career sequence and have no meaningful order, so they read as a ledger of
// results instead. The tag column carries the one fact worth scanning.
const HackathonSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h2 className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}>
        Hackathons & competitions
      </h2>
      <p
        className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mb-8`}
      >
        Where I find out how much of a working product I can get to under a
        deadline.
      </p>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="border-t border-neutral-800 divide-y divide-neutral-800"
      >
        {hackathons.map((item) => (
          <motion.li
            key={item.event}
            variants={rowVariant}
            className="py-5 grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <span
              className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider pt-0.5 ${
                item.highlight ? "text-amber-300" : "text-neutral-500"
              }`}
            >
              {item.tag}
            </span>

            <div>
              <h3 className={`${inter.className} text-gray-100 font-medium`}>
                {item.event}
                <span className="text-neutral-500 font-normal">
                  {" "}
                  · {item.org}
                </span>
              </h3>
              <p
                className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-1.5`}
              >
                {item.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
};

export default HackathonSection;
