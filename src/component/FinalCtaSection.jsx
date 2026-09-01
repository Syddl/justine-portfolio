"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { inter } from "@/app/fonts";
import { availability } from "@/data/availability";
import { email } from "@/lib/site";

const FinalCtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 pointer-events-none" />
        <div className="relative z-10">
          <h2
            className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}
          >
            Have a project in mind?
          </h2>
          <p
            className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-6`}
          >
            Free intro chat. You&apos;ll get an honest read on scope and cost,
            whether or not we end up working together.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href={availability.ctaHref}
              className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}
            >
              {availability.ctaLabel}
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`mailto:${email}`}
              className={`${inter.className} text-sm text-neutral-400 hover:text-neutral-100 underline underline-offset-4 decoration-neutral-700 transition-colors`}
            >
              or email me
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FinalCtaSection;
