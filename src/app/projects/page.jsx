"use client";
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import ProjectCard from "@/component/ProjectCard";
import { projectData } from "@/data/projectdata";
import { motion } from "framer-motion";
import MouseHoverEffect from "@/component/MouseHoverEffect";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function ProjectPage() {
  return (
    <main className="flex-grow mx-auto max-w-3xl w-full p-4 pb-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 mb-58">
      <MouseHoverEffect />
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${inter.className} text-[#A8ADB2] mb-10`}
      >
        <h1 className="font-bold text-4xl mb-5 text-gray-100">Projects</h1>
        <p className={`${inter.className} text-justify`}>
          A curated selection of projects that highlight my expertise in
          frontend development, responsive design, and creative problem-solving.
        </p>
      </motion.div>
      <section id="project">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-10"
        >
          {projectData.map((data) => (
            <ProjectCard key={data.name} data={data} />
          ))}
        </motion.div>
      </section>
    </main>
  );
}
