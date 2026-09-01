"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const featured = projects.slice(0, 2);

const container = staggerContainer(0.15);
const cardVariant = fadeInUp(30, 0.5);

const ProjectSection = () => {
  return (
    <section className="mb-16">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className={`${inter.className} text-gray-100 text-xl font-bold`}>
            Selected work
          </h2>
          <Link
            href="/projects"
            className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors group/link`}
          >
            View all
            <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
        <p
          className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl`}
        >
          Real products with live demos, plus a case study on how each one was
          scoped, built, and shipped.
        </p>
      </motion.div>

      {/* Cards grid - featured projects only */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {featured.map((project) => (
          <motion.div
            key={project.name}
            variants={cardVariant}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl border border-white/[0.06] bg-[#111113] overflow-hidden"
          >
            {/* Gradient border glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-blue-500/20" />

            {/* Header - image or gradient fallback */}
            {project.image ? (
              <div className="relative h-44 overflow-hidden border-b border-white/[0.04]">
                <Image
                  src={project.image}
                  alt={`${project.name} landing page`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-40" />
              </div>
            ) : (
              <div
                className="h-44 relative overflow-hidden border-b border-white/[0.04]"
                style={{ background: project.gradientStyle }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.04,
                  }}
                />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/[0.02] blur-xl" />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <h3
                className={`${inter.className} text-lg font-semibold text-neutral-100 mb-2`}
              >
                {project.name}
              </h3>

              <p
                className={`${inter.className} text-sm text-neutral-400 leading-relaxed mb-4`}
              >
                {project.summary}
              </p>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className={`${inter.className} text-xs px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-neutral-400`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action links - case study first */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href={`/projects/${project.slug}`}
                  className={`${inter.className} group/case inline-flex items-center gap-1.5 text-sm text-neutral-200 hover:text-white transition-colors`}
                >
                  Read case study
                  <FiArrowRight className="w-3.5 h-3.5 group-hover/case:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </Link>
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
                  >
                    <FiGithub className="w-3.5 h-3.5" />
                    Code
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectSection;
