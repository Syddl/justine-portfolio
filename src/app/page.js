"use client";
import { JetBrains_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import MouseHoverEffect from "@/component/MouseHoverEffect";
import HeroSection from "@/component/HeroSection";
import AboutMeSection from "@/component/AboutMeSection";
import TechStackSection from "@/component/TechStackSection";
import ProjectSection from "@/component/ProjectSection";
import { Geist } from "next/font/google";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <motion.main
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10 "
    >
      <MouseHoverEffect />
      <HeroSection jetbrains={jetbrains} inter={inter} />
      <AboutMeSection inter={inter} geist={geist} />
      <TechStackSection inter={inter} />
      <ProjectSection inter={inter} />
    </motion.main>
  );
}
