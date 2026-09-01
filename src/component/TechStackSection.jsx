"use client";

import { motion } from "framer-motion";
import { stackGroups } from "@/data/stackdata";
import { inter } from "@/app/fonts";

const TechStackSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h2
        className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}
      >
        Tech Stack
      </h2>
      <p
        className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mb-8`}
      >
        Everything here is in something I&apos;ve shipped, most of it in the AI
        video platform I work on daily.
      </p>

      <div className="space-y-6">
        {stackGroups.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            <p className={`${inter.className} text-neutral-400 text-xs uppercase tracking-wider font-medium mb-3`}>
              {group.label}
            </p>

            {/* Cards row */}
            <div className="flex flex-wrap gap-3">
              {group.items.map((data) => (
                <motion.div
                  key={data.name}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-neutral-800/80 border border-neutral-700/60 rounded-lg text-neutral-300 text-sm hover:bg-neutral-700/80 hover:border-neutral-600 transition-all duration-200 cursor-default"
                >
                  <data.icon className="w-5 h-5 text-neutral-200" />
                  <span className={`${inter.className}`}>{data.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default TechStackSection;
