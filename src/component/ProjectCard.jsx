"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { CiGlobe } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function ProjectCard(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="border-1 border-gray-500 p-5 rounded-lg cursor-pointer">
      <Image
        src={props.data.landingPage}
        width={1000}
        height={900}
        alt="name"
        className="mb-5"
        style={{ width: "auto", height: "auto" }}
      />
      <h1
        className={`${inter.className}  text-gray-100 text-lg font-bold mb-5`}
      >
        {props.data.name}
      </h1>
      <p className={`${inter.className} text-[#A8ADB2] mb-5 text-justify`}>
        {props.data.description}
      </p>
      <div className="flex flex-wrap gap-5 mb-5">
        {props.data.stack.map((tech, index) => (
          <div
            key={index}
            className="flex items-center gap-2 py-1 rounded-full text-white text-sm font-medium"
          >
            <Image
              src={props.data.stackLogo[index]}
              alt={tech}
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
            <p className={`${inter.className}`}>{tech}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <a
          href={props.data.projectURL}
          target="_blank"
          className={`${inter.className} max-md:w-full flex justify-center text-gray-100 items-center gap-2 bg-gray-400/20 rounded-full w-1/3 py-2 hover:bg-gray-200/20`}
        >
          <CiGlobe className="text-xl" />
          <p className="font-bold text-xs">LIVE DEMO</p>
        </a>
        <a
          href={props.data.github}
          target="_blank"
          className={`${inter.className} max-md:w-full flex text-gray-100 justify-center items-center gap-2 bg-gray-400/20 rounded-full w-1/3 py-2 hover:bg-gray-200/20`}
        >
          <FiGithub className="text-xl" />
          <p className="font-bold text-xs">SOURCE CODE</p>
        </a>
        <Link
          href={`/projects/${props.data.name}`}
          className={`${inter.className} max-md:w-full flex text-gray-100 justify-center items-center gap-2 bg-gray-400/20 rounded-full w-1/3 py-2 hover:bg-gray-200/20`}
        >
          <FiAlertCircle className="text-xl" />
          <p className="font-bold text-xs">MORE DETAILS</p>
        </Link>
      </div>
    </div>
  );
}
