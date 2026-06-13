"use client";
import { motion } from "framer-motion";
import HeroSection from "@/component/HeroSection";
import AboutMeSection from "@/component/AboutMeSection";
import ExperienceSection from "@/component/ExperienceSection";
import TechStackSection from "@/component/TechStackSection";
import ProjectSection from "@/component/ProjectSection";

export default function Home() {
  return (
    <motion.main
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10 "
    >
      <HeroSection />
      <AboutMeSection />
      <ExperienceSection />
      <TechStackSection />
      <ProjectSection />
    </motion.main>
  );
}
