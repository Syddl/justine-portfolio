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
import SharedReveal from "@/component/motion/Reveal";

// Case-study sections are <div>s inside the <main>; the shared wrapper
// defaults to <section>.
const Reveal = ({ children, className = "" }) => (
  <SharedReveal as="div" className={className}>
    {children}
  </SharedReveal>
);

export default function CaseStudyView({ project }) {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12 text-body text-[17px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/projects"
          className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          All projects
        </Link>

        <p className="font-mono text-muted text-sm mb-3">
          {`// case study`}
        </p>
        <h1
          className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3"
        >
          {project.name}
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-8">
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
              className="rounded-card border border-line-strong bg-surface px-4 py-3"
            >
              <p
                className="font-mono text-[11px] uppercase tracking-wider text-muted mb-1"
              >
                {label}
              </p>
              <p className="text-sm text-ink-2">
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
              className="rounded-card border border-line-strong bg-surface px-4 py-4 text-center"
            >
              <p
                className="font-mono text-2xl font-semibold text-ink mb-1"
              >
                {result.metric}
              </p>
              <p className="text-xs text-muted">
                {result.label}
              </p>
            </div>
          ))}
        </Reveal>
      )}

      {/* The problem */}
      <Reveal className="mb-12">
        <h2
          className="text-ink text-xl font-semibold mb-4"
        >
          The problem
        </h2>
        <p className="leading-relaxed">{project.problem}</p>
      </Reveal>

      {/* What I built */}
      <Reveal className="mb-12">
        <h2
          className="text-ink text-xl font-semibold mb-4"
        >
          What I built
        </h2>
        <div className="space-y-4 leading-relaxed">
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
              <div className="relative aspect-[16/9] rounded-card border border-line overflow-hidden">
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
                  className="text-xs text-muted mt-2"
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
          className="text-ink text-xl font-semibold mb-4"
        >
          How it went
        </h2>
        <ul className="space-y-3">
          {project.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-3">
              <FiCheck
                className="w-4 h-4 text-accent mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Tech notes - for the occasional technical evaluator */}
      <Reveal className="mb-12">
        <div className="rounded-card border border-line-strong bg-surface p-5">
          <p
            className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2"
          >
            Tech notes
          </p>
          <p
            className="text-sm text-body leading-relaxed"
          >
            {project.techNotes}
          </p>
          <div className="flex items-center gap-4 mt-4">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
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
        <div className="rounded-card border border-line-strong bg-surface p-8 text-center">
          <h2
            className="text-ink text-xl font-semibold mb-2"
          >
            Have a similar project in mind?
          </h2>
          <p
            className="text-body text-sm leading-relaxed max-w-md mx-auto mb-6"
          >
            Tell me what you&apos;re replacing or building, and I&apos;ll tell
            you what it would take.
          </p>
          <Link
            href="/contact"
            className="pill group"
          >
            Let&apos;s talk
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
