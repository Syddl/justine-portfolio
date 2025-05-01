"use client"
import { JetBrains_Mono } from 'next/font/google'
import { Inter } from 'next/font/google'
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import StackCard from '@/component/StackCard';
import { stack } from '@/data/stackdata'
import ProjectCard from '@/component/ProjectCard';
import { projectData } from '@/data/projectdata';
import { motion } from "framer-motion"

const inter = Inter({
    display: 'swap',
    subsets: ['latin']
})

const jetbrains = JetBrains_Mono({
  subsets:['latin'],
  display: 'swap',
  weight: ['400'],
})

export default function Home() {
  return (
    <motion.main 
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }} 
    transition={{ duration: 0.7 }} 
    className="flex-grow mx-auto max-w-3xl w-full p-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 mb-10 ">
      <section className='flex flex-col items-start text-[#A8ADB2] mb-20'>
        <p className={`${jetbrains.className} mb-3`}>Hello, my name is</p>
        <div className='mb-5'>
          <h1 className='text-5xl font-extrabold md:text-6xl flex flex-col'>
            <span className={`${inter.className} text-gray-100`}>Justine</span>
            <span className={`${inter.className} `}>Front end</span>
            <span className={`${inter.className}`}>Developer</span>
          </h1>
        </div>
        <p className={`${jetbrains.className} mb-3`}>Creating clean and fast web apps</p>
        <div className='flex gap-2 items-center mb-5'>
          <div className='flex items-center bg-green-600/20 rounded-2xl py-1 px-3 cursor-pointer hover:bg-green-600/30'>
            <span className="p-1 mb-px mr-1 inline-block bg-green-600 rounded-full"></span>
            <h1 className={`${inter.className} text-green-600  font-bold text-sm `}>Open to internship</h1>
          </div>
          <h1 className={`${jetbrains.className}`}>🏠 Philippines.</h1>
        </div>
        <div className='flex items-center gap-3'>
          <a href="https://github.com/Syddl" target='_blank'>
            <FaSquareGithub className='text-4xl hover:text-gray-100 '/>
          </a>
          <a href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/" target='_blank'>
            <FaLinkedin className='text-4xl hover:text-gray-100'/>
          </a>
        </div>
      </section>
      <section className='mb-10'>
        <h1 className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}>About me</h1>
        <p className={`${jetbrains.className} text-[#A8ADB2] text-justify`}>
          I'm Justine, a frontend developer based in the Philippines with a passion for building clean,
          fast, and user-friendly web applications. I enjoy turning ideas into functional and visually 
          appealing interfaces using tools like React, Next.js, and Tailwind CSS. Currently open to internship 
          opportunities, I’m eager to grow as a developer and collaborate on meaningful projects that make a 
          difference. Whether it’s crafting sleek UI or learning new tech, I’m always up for a challenge.
        </p>
      </section>
      <section className='mb-10'>
        <h1 className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}>Tech Stack</h1>
        <div className='flex flex-wrap gap-5 justify-center sm:justify-start'>
          {stack.map((data, index) => (
            <StackCard key={index} img={data.img} name={data.name}/>
          ))}
        </div>
      </section>
      <section id='project mb-'>
        <h1 className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}>Projects</h1>
        <div className='flex flex-col'>
          {projectData.map((data) => (
            <ProjectCard key={data.name} data={data}/>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
