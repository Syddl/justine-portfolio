"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// One project as a single link row, used by the home page and /projects: a
// small cover, the name and summary, and the project's kind on the right
// (under the summary on phones). The whole row opens the case study; the
// live demo and code links live there.
// The name is an h3: every list of rows sits under a section h2.
const ProjectCard = ({ project, variants }) => {
  return (
    <motion.div variants={variants}>
      <Link
        href={`/projects/${project.slug}`}
        className="group -mx-3 flex items-center gap-4 rounded-card px-3 py-4 transition-colors duration-150 hover:bg-hover"
      >
        <div
          className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-hover"
          style={project.image ? undefined : { background: project.gradientStyle }}
        >
          {project.image && (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-ink">{project.name}</h3>
          <p className="text-sm leading-snug text-muted">{project.summary}</p>
          <p className="mt-1 text-xs text-muted sm:hidden">{project.kind}</p>
        </div>

        <span className="hidden shrink-0 text-sm text-muted sm:block">
          {project.kind}
        </span>
        <FiArrowRight
          className="size-4 shrink-0 text-faint transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
