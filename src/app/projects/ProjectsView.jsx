"use client";

import { motion } from "framer-motion";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ProjectCard from "@/component/ProjectCard";

const container = staggerContainer(0.2, 0.3);
const cardVariant = fadeInUp(30, 0.5);

export default function ProjectsView() {
  return (
    <main className="flex-grow mx-auto max-w-3xl w-full px-6 pt-8 pb-24 lg:pt-12">
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
          Every project here is live. Click the demo, poke around, then read
          the case study for what problem it solves and how it was built.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
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
