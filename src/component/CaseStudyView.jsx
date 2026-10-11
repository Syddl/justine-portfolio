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
import SectionHeading from "@/component/SectionHeading";

// Case-study sections are <div>s inside the <main>; the shared wrapper
// defaults to <section>.
const Reveal = ({ children, className = "" }) => (
  <SharedReveal as="div" className={className}>
    {children}
  </SharedReveal>
);

// Built from the site's shared parts: a page header, sections under small
// labels with a hairline, label/value rows and plain numbers instead of
// boxed cards, and one pill for the call to action.
export default function CaseStudyView({ project }) {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12 text-body text-[17px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/projects"
          className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          All projects
        </Link>

        <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
          {project.name}
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-10">
          {project.tagline}
        </p>

        {/* Meta: label/value rows between hairlines */}
        <dl className="mb-12 border-t border-line">
          {[
            ["Role", project.role],
            ["Timeline", project.timeline],
            ["Stack", project.stack.join(" · ")],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-1 border-b border-line py-3 sm:grid-cols-[7rem_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted pt-0.5">
                {label}
              </dt>
              <dd className="text-sm text-ink-2">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* Results - only when real, verifiable numbers exist */}
      {project.results?.length > 0 && (
        <Reveal className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-14">
          {project.results.map((result) => (
            <div key={result.label}>
              <p className="text-[2rem] font-medium tracking-[-0.02em] leading-none text-ink">
                {result.metric}
              </p>
              <p className="text-sm text-muted mt-2">{result.label}</p>
            </div>
          ))}
        </Reveal>
      )}

      <Reveal className="mb-12">
        <SectionHeading title="The problem" />
        <p className="leading-relaxed">{project.problem}</p>
      </Reveal>

      <Reveal className="mb-12">
        <SectionHeading title="What I built" />
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
                  sizes="(max-width: 688px) 100vw, 640px"
                  className="object-cover object-top"
                />
              </div>
              {shot.caption && (
                <figcaption className="text-xs text-muted mt-2">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </Reveal>
      )}

      <Reveal className="mb-12">
        <SectionHeading title="How it went" />
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
      <Reveal className="mb-14">
        <SectionHeading title="Tech notes" />
        <p className="text-sm text-body leading-relaxed">{project.techNotes}</p>
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
      </Reveal>

      {/* CTA - its own wording, not the contact page intro repeated */}
      <Reveal>
        <div className="border-t border-line pt-10">
          <h2 className="text-ink text-xl font-semibold mb-2">
            Have a similar project in mind?
          </h2>
          <p className="text-body text-sm leading-relaxed max-w-md mb-6">
            Tell me what you&apos;re replacing or building, and I&apos;ll tell
            you what it would take.
          </p>
          <Link href="/contact" className="pill group">
            Let&apos;s talk
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
