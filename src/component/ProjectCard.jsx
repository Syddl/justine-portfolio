"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const ROW = "group -mx-3 flex items-center gap-4 rounded-card px-3 py-4";
const LINK_ROW = `${ROW} transition-colors duration-150 hover:bg-hover`;
const THUMB = "relative h-10 w-14 shrink-0 overflow-hidden rounded-md border bg-hover";
const SHIPPED_THUMB = `${THUMB} border-line`;
const UPCOMING_THUMB = `${THUMB} grid place-items-center border-dashed border-line-strong`;

// One project as a row, used by the home page and /projects: a small cover,
// the name and summary, and the project's kind on the right (under the
// summary on phones). A shipped project's whole row opens its case study,
// where the live demo and code links live. An upcoming project (no slug, see
// upcomingProjects in src/data/projects.js) is the same row without a link
// or arrow: a dashed cover with its initial and a "Coming soon" pill.
// The name is an h3: every list of rows sits under a section h2.
const ProjectCard = ({ project, variants }) => {
  const upcoming = !project.slug;

  const content = (
    <>
      <div
        className={upcoming ? UPCOMING_THUMB : SHIPPED_THUMB}
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
        {upcoming && (
          <span className="font-mono text-xs text-muted" aria-hidden="true">
            {project.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-ink">{project.name}</h3>
        <p className="text-sm leading-snug text-muted">{project.summary}</p>
        <p className="mt-1 text-xs text-muted sm:hidden">{project.kind}</p>
      </div>

      {upcoming ? (
        <span className="hidden shrink-0 rounded-full border border-line-strong px-2.5 py-0.5 text-xs text-muted sm:block">
          {project.kind}
        </span>
      ) : (
        <>
          <span className="hidden shrink-0 text-sm text-muted sm:block">
            {project.kind}
          </span>
          <FiArrowRight
            className="size-4 shrink-0 text-faint transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
            aria-hidden="true"
          />
        </>
      )}
    </>
  );

  return (
    <motion.div variants={variants}>
      {upcoming ? (
        <div className={ROW}>{content}</div>
      ) : (
        <Link href={`/projects/${project.slug}`} className={LINK_ROW}>
          {content}
        </Link>
      )}
    </motion.div>
  );
};

export default ProjectCard;
