"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const container = staggerContainer(0.2, 0.3);
const cardVariant = fadeInUp(30, 0.5);

export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-4xl w-full px-6 pt-8 pb-24 lg:pt-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1
          className={`${inter.className} font-bold text-4xl text-gray-100 mb-3`}
        >
          Projects
        </h1>
        <p
          className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-2xl`}
        >
          A curated selection of projects that highlight my expertise in full
          stack development, responsive design, and creative problem-solving.
        </p>
      </motion.div>

      {/* Project cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {projects.map((project) => (
          <motion.div
            key={project.name}
            variants={cardVariant}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl border border-white/[0.06] bg-[#111113] overflow-hidden
              hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/[0.03] transition-all duration-300"
          >
            {/* Header area — image with gradient overlay */}
            {project.image ? (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.name} landing page`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                {/* Gradient overlay for smooth blend into card content */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />
                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.03,
                  }}
                />
              </div>
            ) : (
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: project.gradientStyle }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.04,
                  }}
                />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />
              </div>
            )}

            {/* Content area */}
            <div className="p-6">
              <h2
                className={`${inter.className} text-xl font-bold text-neutral-100 mb-2`}
              >
                {project.name}
              </h2>

              <p
                className={`${inter.className} text-sm text-neutral-400 leading-relaxed mb-4`}
              >
                {project.description}
              </p>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className={`${inter.className} text-xs px-2.5 py-1 rounded-full
                      border border-white/[0.1] bg-white/[0.06] text-neutral-400`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action links */}
              <div className="flex items-center gap-3">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${inter.className} inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                    border border-white/[0.08] text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06]
                    transition-all duration-200`}
                >
                  <FiGithub className="w-3.5 h-3.5" />
                  Code
                </Link>
                <Link
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${inter.className} inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                    border border-white/[0.08] text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06]
                    transition-all duration-200`}
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
