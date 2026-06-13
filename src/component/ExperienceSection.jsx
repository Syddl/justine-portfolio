"use client";

import { motion } from "framer-motion";
import { inter } from "@/app/fonts";
import { experience } from "@/data/experience";

const ExperienceSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h2 className={`${inter.className} text-gray-100 text-xl font-bold mb-8`}>
        Work Experience
      </h2>

      <div className="relative">
        {/* Vertical timeline rail */}
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px bg-neutral-800"
          aria-hidden="true"
        />

        <div className="space-y-10">
          {experience.map((job) => {
            const isCurrent = /present/i.test(job.dates);

            return (
              <div
                key={`${job.company}-${job.title}-${job.dates}`}
                className="relative pl-8"
              >
                {/* Timeline dot (pulses green for the current role) */}
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
                    className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full bg-neutral-600 ring-4 ring-neutral-900"
                    aria-hidden="true"
                  />
                )}

                {/* Title · company + dates */}
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3
                    className={`${inter.className} text-gray-100 font-semibold`}
                  >
                    {job.title}
                    <span className="text-neutral-400 font-normal">
                      {" "}
                      · {job.company}
                    </span>
                  </h3>
                  <span
                    className={`${inter.className} text-xs text-neutral-500 whitespace-nowrap`}
                  >
                    {job.dates}
                  </span>
                </div>

                {job.location && (
                  <p
                    className={`${inter.className} text-xs text-neutral-500 mt-1`}
                  >
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
                  <p
                    className={`${inter.className} text-xs text-neutral-500 mt-3`}
                  >
                    {job.tech.join("  ·  ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
