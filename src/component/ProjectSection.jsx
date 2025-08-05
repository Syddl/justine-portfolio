import ProjectCard from "./ProjectCard";
import { projectData } from "@/data/projectdata";
import { motion } from "framer-motion";

const ProjectSection = ({ inter }) => {
  return (
    <section id="project mb-">
      <h1
        className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
      >
        Projects
      </h1>
      <div className="flex flex-col gap-10">
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
  );
};

export default ProjectSection;
