"use client";
import { inter } from "@/app/font";
import { CiGlobe } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import Image from "next/image";
import { motion } from "framer-motion";
import MouseHoverEffect from "@/component/MouseHoverEffect";

export default function Content({ result, slug }) {
  return (
    <>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-5 md:flex-row md:justify-between mb-10"
      >
        <MouseHoverEffect />
        <h1
          className={`${inter.className} gap-1 text-gray-100 text-xl font-bold flex items-center justify-center `}
        >
          <span>{result.name} </span> <span> - </span>
          <span> {result.subName}</span>
        </h1>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <a
            href={result.projectURL}
            target="_blank"
            className={`${inter.className} cursor-pointer max-md:w-full flex justify-center text-gray-100 items-center gap-2 bg-gray-400/20 rounded-full w-1/2 py-2 px-15 hover:bg-gray-200/20`}
          >
            <CiGlobe className="text-xl" />
            <p className="font-bold text-xs">Demo</p>
          </a>
          <a
            href={result.github}
            target="_blank"
            className={`${inter.className} cursor-pointer  max-md:w-full flex text-gray-100 justify-center items-center gap-2 bg-gray-400/20 rounded-full w-1/2 py-2 px-15 hover:bg-gray-200/20`}
          >
            <FiGithub className="text-xl" />
            <p className="font-bold text-xs">Github</p>
          </a>
        </div>
      </motion.div>
      <motion.p
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`${inter.className}  text-justify mb-10`}
      >
        {result.description}
      </motion.p>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <h1
          className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
        >
          Tech Stack
        </h1>
        <div className="flex flex-wrap gap-5 mb-5">
          {result.stack.map((tech, index) => (
            <div
              key={index}
              className={` flex items-center gap-2 py-1 rounded-full text-white text-sm font-medium`}
            >
              <Image
                style={{ width: "auto", height: "auto" }}
                src={result.stackLogo[index]}
                alt={tech}
                width={15}
                height={15}
                className="h-auto w-auto"
              />
              <p className={`${inter.className}`}>{tech}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`${inter.className} mb-10`}
      >
        <h1 className={` font-bold text-gray-100 mb-10 text-xl`}>
          Key Features
        </h1>
        {result.key.map((data, index) => (
          <h1 key={index} className="mb-2">
            <span className="text-white font-bold">{data}</span>-
            <span> {result.subKey[index]}</span>
          </h1>
        ))}
      </motion.div>
      <div>
        <h1 className="text-xl text-gray-100 font-bold mb-10">
          Project Overview
        </h1>
        {result.images.map((data, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Image
              src={data}
              alt={index}
              priority
              style={{ width: "auto", height: "auto" }}
              className="mb-5 rounded-lg"
              width={1919}
              height={940}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
