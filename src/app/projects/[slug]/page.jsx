import { projectData } from "@/data/projectdata"
import Content from "./content";

export default async function SpecificProject({params}){
  const { slug } = await params
  let result = projectData.find(projectData => projectData.name === slug)
  

  return(
    <main className="text-[#A8ADB2] flex-grow mx-auto max-w-3xl w-full p-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 mb-10">
      <Content result={result} slug={slug}/>
    </main>
  )
}