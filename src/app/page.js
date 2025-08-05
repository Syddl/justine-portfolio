"use client";
import { JetBrains_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import StackCard from "@/component/StackCard";
import { stack } from "@/data/stackdata";
import ProjectCard from "@/component/ProjectCard";
import { projectData } from "@/data/projectdata";
import { motion } from "framer-motion";
import MouseHoverEffect from "@/component/MouseHoverEffect";
import HeroSection from "@/component/HeroSection";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export default function Home() {
  const about =
    "I'm Justine, a frontend developer based in the Philippines with a passion for building clean, fast, and user-friendly web applications. I enjoy turning ideas into functional and visually appealing interfaces using tools like React, Next.js, and Tailwind CSS. Currently open to work opportunities, I'm eager to grow as a developer and collaborate on meaningful projects that make a difference. Whether it's crafting sleek UI or learning new tech, I'm always up for a challenge.";

  return (
    <motion.main
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10 "
    >
      <MouseHoverEffect />
      <HeroSection jetbrains={jetbrains} inter={inter} />
      <section className="mb-10 text-center">
        <h1
          className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
        >
          About me
        </h1>
        <p className={`${jetbrains.className} text-[#A8ADB2] text-justify`}>
          {about}
        </p>
      </section>
      <section className="mb-10">
        <h1
          className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
        >
          Tech Stack
        </h1>
        <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
          {stack.map((data, index) => (
            <StackCard key={index} img={data.img} name={data.name} />
          ))}
        </div>
      </section>
      <section id="project mb-">
        <h1
          className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
        >
          Projects
        </h1>
        <div className="flex flex-col">
          {projectData.map((data) => (
            <motion.div
              key={data.name}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ProjectCard data={data} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
