"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { inter } from "@/app/fonts";
import { projects } from "@/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import ProjectCard from "@/component/ProjectCard";

const featured = projects.slice(0, 2);
const container = staggerContainer(0.15);
const cardVariant = fadeInUp(30, 0.5);

const ProjectSection = () => {
  return (
    <section className="mb-16">
      <Reveal as="div" y={20}>
        <SectionHeading
          eyebrow="selected work"
          title="Selected work"
          lede="Real products with live demos, plus a case study on how each one was scoped, built, and shipped."
          action={
            // Only worth a link when /projects has more than the cards below.
            projects.length > featured.length ? (
              <Link
                href="/projects"
                className={`${inter.className} inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors group/link whitespace-nowrap`}
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
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {featured.map((project) => (
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
