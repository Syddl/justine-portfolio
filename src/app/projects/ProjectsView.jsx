"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { projects, upcomingProjects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ProjectCard from "@/component/ProjectCard";
import SectionHeading from "@/component/SectionHeading";

const container = staggerContainer(0.08, 0.2);
const rowVariant = fadeInUp(14, 0.5);
// Shipped projects first, then the "Coming soon" rows; the count covers both.
const rows = [...projects, ...upcomingProjects];

// The same parts as every other page: a back link, the headline, one intro
// line, then a labelled list of project rows with the count on the right.
export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <FiArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Home
        </Link>
        <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
          Projects
        </h1>
        <p className="text-body text-[15px] leading-relaxed max-w-xl">
          Each case study covers the problem, what I built and how it went.
          Where a project is live, the demo link is in its case study.
        </p>
      </motion.div>

      <SectionHeading
        title="Selected work"
        className="mb-2"
        action={
          <span className="font-mono text-sm text-muted">
            {String(rows.length).padStart(2, "0")}
          </span>
        }
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="divide-y divide-line"
      >
        {rows.map((project) => (
          <ProjectCard key={project.name} project={project} variants={rowVariant} />
        ))}
      </motion.div>
    </main>
  );
}
