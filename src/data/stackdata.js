import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { RiJavascriptFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaGitAlt } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { RiSupabaseFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import { IoLogoFirebase } from "react-icons/io5";
import { FaHtml5 } from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io";
import { FaNodeJs } from "react-icons/fa";
import { SiExpress, SiFastapi, SiMongodb, SiPostgresql } from "react-icons/si";

export const stackGroups = [
  {
    label: "Frontend",
    items: [
      { icon: FaReact, name: "React" },
      { icon: RiNextjsFill, name: "Next.js" },
      { icon: BiLogoTypescript, name: "TypeScript" },
      { icon: RiJavascriptFill, name: "JavaScript" },
      { icon: RiTailwindCssFill, name: "Tailwind" },
      { icon: FaHtml5, name: "HTML" },
      { icon: IoLogoCss3, name: "CSS" },
    ],
  },
  {
    label: "Backend",
    items: [
      { icon: SiFastapi, name: "FastAPI" },
      { icon: SiExpress, name: "Express.js" },
      { icon: FaNodeJs, name: "Node.js" },
    ],
  },
  {
    label: "Database",
    items: [
      { icon: SiPostgresql, name: "PostgreSQL" },
      { icon: SiMongodb, name: "MongoDB" },
      { icon: RiSupabaseFill, name: "Supabase" },
      { icon: IoLogoFirebase, name: "Firebase" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: FaGitAlt, name: "Git" },
      { icon: FaPython, name: "Python" },
      { icon: FaJava, name: "Java" },
      { icon: TbBrandCSharp, name: "C#" },
    ],
  },
];

// Flat list for backward compatibility
export const stack = stackGroups.flatMap((group) => group.items);
