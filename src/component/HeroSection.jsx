import { FiGithub, FiLinkedin } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-20">
      <p className={`${jetbrainsMono.className} mb-3`}>Hello, my name is</p>
      <div className="mb-5">
        <h1 className="text-5xl font-extrabold md:text-6xl flex flex-col">
          <span className={`${inter.className} text-gray-100`}>Justine</span>
          <span className={`${inter.className} `}>Full Stack</span>
          <span className={`${inter.className}`}>Developer</span>
        </h1>
      </div>
      <p className={`${jetbrainsMono.className} mb-5`}>
        Building complete web applications from front to back
      </p>
      <div className="flex gap-2 items-center mb-5">
        <div className="flex items-center bg-green-600/20 rounded-2xl py-1 px-3 gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span
            className={`${inter.className} text-green-600 font-bold text-sm`}
          >
            Open to work
          </span>
        </div>
        <span className={`${jetbrainsMono.className}`}>🏠Philippines.</span>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/Syddl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <FiGithub className="text-2xl hover:text-gray-100 " />
        </a>
        <a
          href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <FiLinkedin className="text-2xl hover:text-gray-100" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
