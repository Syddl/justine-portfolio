import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import ProjectCard from '@/component/ProjectCard';
import { projectData } from '@/data/projectdata';

const inter = Inter({
  display: 'swap',
  subsets: ['latin']
})

const jetbrains = JetBrains_Mono({
  subsets:['latin'],
  display: 'swap',
  weight: ['400'],
})

export default function ProjectPage(){
  return(
    <main className="flex-grow mx-auto max-w-3xl w-full p-4 pb-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 mb-10">
      <div className={`${inter.className} text-[#A8ADB2] mb-10`}>
        <h1 className='font-bold text-4xl mb-5 text-gray-100'>Projects</h1>
        <p className={`${jetbrains.className} text-justify`}>
          A curated selection of projects that highlight my expertise in frontend development, 
          responsive design, and creative problem-solving.
        </p>
      </div>
      <section id='project mb-'>
        <div className='flex flex-col'>
          {projectData.map((data) => (
            <ProjectCard key={data.name} data={data}/>
          ))}
        </div>
      </section>
    </main>
  )
}