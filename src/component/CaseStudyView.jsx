"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
  FiGithub,
  FiCheck,
} from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import SharedReveal from "@/component/motion/Reveal";

// Case-study sections are <div>s inside the <main>; the shared wrapper
// defaults to <section>.
const Reveal = ({ children, className = "" }) => (
  <SharedReveal as="div" y={24} className={className}>
    {children}
  </SharedReveal>
);

export default function CaseStudyView({ project }) {
  return (
    <main className="flex-grow mx-auto max-w-3xl w-full px-6 pt-8 pb-24 lg:pt-12 text-[#A8ADB2]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/projects"
          className={`${inter.className} group inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors mb-8`}
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          All projects
        </Link>

        <p className={`${jetbrainsMono.className} text-neutral-500 text-sm mb-3`}>
          {`// case study`}
        </p>
        <h1
          className={`${inter.className} font-bold text-4xl text-gray-100 mb-3`}
        >
          {project.name}
        </h1>
        <p className={`${inter.className} text-lg leading-relaxed max-w-2xl mb-8`}>
          {project.tagline}
        </p>

        {/* Meta block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            ["Role", project.role],
            ["Timeline", project.timeline],
            ["Stack", project.stack.join(" · ")],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 px-4 py-3"
            >
              <p
                className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 mb-1`}
              >
                {label}
              </p>
              <p className={`${inter.className} text-sm text-neutral-300`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Metric callouts - only when real, verifiable numbers exist */}
      {project.results?.length > 0 && (
        <Reveal className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {project.results.map((result) => (
            <div
              key={result.label}
              className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 px-4 py-4 text-center"
            >
              <p
                className={`${jetbrainsMono.className} text-2xl font-semibold text-gray-100 mb-1`}
              >
                {result.metric}
              </p>
              <p className={`${inter.className} text-xs text-neutral-500`}>
                {result.label}
              </p>
            </div>
          ))}
        </Reveal>
      )}

      {/* The problem */}
      <Reveal className="mb-12">
        <h2
          className={`${inter.className} text-gray-100 text-xl font-bold mb-4`}
        >
          The problem
        </h2>
        <p className={`${inter.className} leading-relaxed`}>{project.problem}</p>
      </Reveal>

      {/* What I built */}
      <Reveal className="mb-12">
        <h2
          className={`${inter.className} text-gray-100 text-xl font-bold mb-4`}
        >
          What I built
        </h2>
        <div className={`${inter.className} space-y-4 leading-relaxed`}>
          {project.solution.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {/* Screenshots */}
      {project.screenshots?.length > 0 && (
        <Reveal className="mb-12 space-y-6">
          {project.screenshots.map((shot) => (
            <figure key={shot.src}>
              <div className="relative aspect-[16/9] rounded-2xl border border-white/[0.06] overflow-hidden">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover object-top"
                />
              </div>
              {shot.caption && (
                <figcaption
                  className={`${inter.className} text-xs text-neutral-500 mt-2`}
                >
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </Reveal>
      )}

      {/* How it went */}
      <Reveal className="mb-12">
        <h2
          className={`${inter.className} text-gray-100 text-xl font-bold mb-4`}
        >
          How it went
        </h2>
        <ul className={`${inter.className} space-y-3`}>
          {project.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-3">
              <FiCheck
                className="w-4 h-4 text-green-500/80 mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Tech notes - for the occasional technical evaluator */}
      <Reveal className="mb-12">
        <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-5">
          <p
            className={`${jetbrainsMono.className} text-[11px] uppercase tracking-wider text-neutral-500 mb-2`}
          >
            Tech notes
          </p>
          <p
            className={`${inter.className} text-sm text-neutral-400 leading-relaxed`}
          >
            {project.techNotes}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors`}
              >
                <FiGithub className="w-3.5 h-3.5" />
                Code
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {/* CTA - its own wording, not the contact page intro repeated */}
      <Reveal>
        <div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-8 text-center">
          <h2
            className={`${inter.className} text-gray-100 text-xl font-bold mb-2`}
          >
            Have a similar project in mind?
          </h2>
          <p
            className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-6`}
          >
            Tell me what you&apos;re replacing or building, and I&apos;ll tell
            you what it would take.
          </p>
          <Link
            href="/contact"
            className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}
          >
            Let&apos;s talk
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
