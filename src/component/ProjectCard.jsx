"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { inter } from "@/app/fonts";

// The one project card, used by the home page and /projects. Case study is
// the primary action; live demo and code are secondary.
// headingLevel: "h3" under a section h2 (home), "h2" directly under a page h1.
const ProjectCard = ({ project, variants, headingLevel = "h3" }) => {
  const Heading = headingLevel;

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-white/[0.12] bg-[#111113] overflow-hidden transition-colors duration-300"
    >
      {project.image ? (
        <div className="relative h-44 overflow-hidden border-b border-white/[0.04]">
          <Image
            src={project.image}
            alt={`${project.name} landing page`}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
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
        </div>
      )}

      <div className="p-5">
        <Heading
          className={`${inter.className} text-lg font-semibold text-neutral-100 mb-2`}
        >
          {project.name}
        </Heading>

        <p
          className={`${inter.className} text-sm text-neutral-400 leading-relaxed mb-4`}
        >
          {project.summary}
        </p>

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
  );
};

export default ProjectCard;
