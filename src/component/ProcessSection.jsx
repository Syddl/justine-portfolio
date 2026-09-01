"use client";

import { motion } from "framer-motion";
import { inter, jetbrainsMono } from "@/app/fonts";
import { processSteps } from "@/data/process";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const container = staggerContainer(0.12);
const itemVariant = fadeInUp(24, 0.5);

const ProcessSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h2 className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}>
        How we&apos;ll work together
      </h2>
      <p
        className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mb-8`}
      >
        No mystery phases. This is the whole thing, start to finish.
      </p>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-8"
      >
        {processSteps.map((step) => (
          <motion.li
            key={step.step}
            variants={itemVariant}
            className="flex items-start gap-5"
          >
            <span
              className={`${jetbrainsMono.className} shrink-0 text-sm font-semibold text-neutral-500 pt-0.5 w-7`}
              aria-hidden="true"
            >
              {step.step}
            </span>
            <div>
              <h3 className={`${inter.className} text-gray-100 font-semibold`}>
                {step.title}
              </h3>
              <p
                className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-1.5`}
              >
                {step.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </motion.section>
  );
};

export default ProcessSection;
