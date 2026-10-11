"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { projects, upcomingProjects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import ProjectCard from "@/component/ProjectCard";

const featured = projects.slice(0, 2);
const container = staggerContainer(0.15);
const cardVariant = fadeInUp(14, 0.5);

const ProjectSection = () => {
  return (
    <section className="mb-16">
      <Reveal as="div">
        <SectionHeading
          title="Selected work"
          lede="Full products, each with a case study on how it was scoped, built, and shipped."
          action={
            // Only worth a link when /projects has more than the cards below.
            projects.length > featured.length ? (
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group/link whitespace-nowrap"
              >
                View all
                <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            ) : null
          }
        />
      </Reveal>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="divide-y divide-line"
      >
        {[...featured, ...upcomingProjects].map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            variants={cardVariant}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectSection;
