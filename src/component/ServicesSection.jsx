"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import { services } from "@/data/services";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const container = staggerContainer(0.12);
const cardVariant = fadeInUp(24, 0.5);

const ServicesSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h2 className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}>
        What I can build for you
      </h2>
      <p
        className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mb-8`}
      >
        Plain-language offers, each backed by something real you can click.
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-4"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={cardVariant}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-5 hover:bg-neutral-800/60 transition-colors duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg border border-neutral-700/60 bg-neutral-800/80 p-2.5">
                <service.icon
                  className="w-5 h-5 text-neutral-200"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3
                    className={`${inter.className} text-gray-100 font-semibold`}
                  >
                    {service.title}
                  </h3>
                  <span
                    className={`${jetbrainsMono.className} text-xs text-neutral-500 whitespace-nowrap`}
                  >
                    {service.timeline}
                  </span>
                </div>
                <p
                  className={`${inter.className} text-sm text-neutral-400 leading-relaxed mt-2`}
                >
                  {service.description}
                </p>
                <Link
                  href={service.proof.href}
                  className={`${inter.className} group/proof inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-100 transition-colors mt-3`}
                >
                  {service.proof.label}
                  <FiArrowRight className="w-3 h-3 group-hover/proof:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <p className={`${inter.className} text-sm text-neutral-400 mt-6`}>
        Not sure which fits?{" "}
        <Link
          href="/contact"
          className="text-neutral-200 hover:text-white underline underline-offset-4 decoration-neutral-700 transition-colors"
        >
          Describe your project
        </Link>{" "}
        and I&apos;ll tell you honestly what it needs.
      </p>
    </motion.section>
  );
};

export default ServicesSection;
