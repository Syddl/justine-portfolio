import { FaReact, FaNodeJs, FaPython, FaGitAlt } from "react-icons/fa";
import {
  RiNextjsFill,
  RiJavascriptFill,
  RiTailwindCssFill,
  RiSupabaseFill,
} from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { IoLogoFirebase } from "react-icons/io5";
import { FiLayers, FiCheckCircle } from "react-icons/fi";
import { TbBrandReactNative } from "react-icons/tb";
import {
  SiExpress,
  SiFastapi,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiStripe,
  SiShadcnui,
  SiFramer,
  SiReactquery,
  SiZod,
  SiDocker,
  SiGithubactions,
  SiLinux,
  SiVercel,
  SiDigitalocean,
  SiFfmpeg,
  SiOpenai,
  SiAnthropic,
  SiClaude,
  SiElevenlabs,
  SiRaspberrypi,
} from "react-icons/si";

// Only things used in shipped work belong here. BullMQ and Playwright have no
// brand icon in react-icons, so they borrow a neutral Feather one.
export const stackGroups = [
  {
    label: "AI & agents",
    items: [
      { icon: SiClaude, name: "Claude Code" },
      { icon: SiAnthropic, name: "Claude API" },
      { icon: SiOpenai, name: "OpenAI API" },
      { icon: SiElevenlabs, name: "ElevenLabs" },
      { icon: SiFfmpeg, name: "FFmpeg" },
      { icon: FiCheckCircle, name: "Playwright" },
    ],
  },
  {
    label: "Frontend & mobile",
    items: [
      { icon: FaReact, name: "React" },
      { icon: RiNextjsFill, name: "Next.js" },
      { icon: TbBrandReactNative, name: "React Native" },
      { icon: BiLogoTypescript, name: "TypeScript" },
      { icon: RiJavascriptFill, name: "JavaScript" },
      { icon: RiTailwindCssFill, name: "Tailwind" },
      { icon: SiShadcnui, name: "shadcn/ui" },
      { icon: SiFramer, name: "Framer Motion" },
      { icon: SiReactquery, name: "TanStack Query" },
      { icon: SiZod, name: "Zod" },
    ],
  },
  {
    label: "Backend",
    items: [
      { icon: FaNodeJs, name: "Node.js" },
      { icon: SiExpress, name: "Express" },
      { icon: FaPython, name: "Python" },
      { icon: SiFastapi, name: "FastAPI" },
      { icon: FiLayers, name: "BullMQ" },
      { icon: SiStripe, name: "Stripe" },
    ],
  },
  {
    label: "Data & storage",
    items: [
      { icon: SiPostgresql, name: "PostgreSQL" },
      { icon: RiSupabaseFill, name: "Supabase" },
      { icon: SiMongodb, name: "MongoDB" },
      { icon: IoLogoFirebase, name: "Firebase" },
      { icon: SiRedis, name: "Redis" },
    ],
  },
  {
    label: "Infrastructure & tooling",
    items: [
      { icon: SiRaspberrypi, name: "Raspberry Pi" },
      { icon: SiDocker, name: "Docker" },
      { icon: SiGithubactions, name: "GitHub Actions" },
      { icon: FaGitAlt, name: "Git" },
      { icon: SiVercel, name: "Vercel" },
      { icon: SiDigitalocean, name: "DigitalOcean" },
      { icon: SiLinux, name: "Linux" },
    ],
  },
];
