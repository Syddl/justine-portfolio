"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ProjectCard from "@/component/ProjectCard";

const container = staggerContainer(0.2, 0.3);
const cardVariant = fadeInUp(14, 0.5);

export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1
          className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3"
        >
          Projects
        </h1>
        <p
          className="text-body text-[15px] leading-relaxed max-w-xl"
        >
          Each case study covers the problem, what I built and how it went.
          Where a project is live, the demo link is on its card.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="divide-y divide-line"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            variants={cardVariant}
            headingLevel="h2"
          />
        ))}
      </motion.div>
    </main>
  );
}
