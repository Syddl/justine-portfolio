"use client";
import { Inter } from "next/font/google";
import { FiGithub } from "react-icons/fi";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function ProjectCard(props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="group cursor-pointer p-4 -m-4 rounded-lg hover:bg-neutral-800/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h1
          className={`${inter.className}  text-xl font-medium text-neutral-100 group-hover:text-blue-400 transition-colors`}
        >
          {props.data.name}
        </h1>
        <div className="flex items-center gap-4 ml-4 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            target="_blank"
            href={props.data.github}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <FiGithub className="h-4 w-4" />
          </Link>
          <Link
            target="_blank"
            href={props.data.projectURL}
            className="text-neutral-500 hover:text-blue-400 transition-colors"
          >
            <FiExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href={`/projects/${props.data.name}`}
            className="text-neutral-500 hover:text-blue-400 transition-colors"
          >
            <FiAlertCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <p
        className={`${inter.className} text-neutral-400 leading-relaxed mb-4 group-hover:text-neutral-300 transition-colors`}
      >
        {props.data.description}
      </p>
      <div className="flex flex-wrap gap-5">
        {props.data.stack.map((tech, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <p
              className={`${inter.className} text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors`}
            >
              {tech}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
