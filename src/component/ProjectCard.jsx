"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// One project as a row, used by the home page and /projects: a small cover,
// then name, summary, stack and links, with a soft fill on hover. Case study
// is the primary action; live demo and code are secondary.
// headingLevel: "h3" under a section h2 (home), "h2" directly under a page h1.
const ProjectCard = ({ project, variants, headingLevel = "h3" }) => {
  const Heading = headingLevel;

  return (
    <motion.div
      variants={variants}
      className="group -mx-3 flex flex-col gap-4 rounded-card px-3 py-5 transition-colors duration-150 hover:bg-hover sm:flex-row sm:gap-5"
    >
      <div
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-card border border-line sm:w-40"
        style={project.image ? undefined : { background: project.gradientStyle }}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.name} landing page`}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover object-top"
          />
        )}
      </div>

      <div className="min-w-0">
        <Heading className="font-semibold text-ink">{project.name}</Heading>
        <p className="mt-1 text-sm leading-relaxed text-body">
          {project.summary}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {project.stack.join(" · ")}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="group/case inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
          >
            Read case study
            <FiArrowRight className="size-3.5 transition-transform group-hover/case:translate-x-1" />
          </Link>
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <FiExternalLink className="size-3.5" />
              Live Demo
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <FiGithub className="size-3.5" />
              Code
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
