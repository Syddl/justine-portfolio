import { FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import { github, linkedin } from "@/lib/site";

// Server component on purpose: the name lands in the initial HTML. This is
// the personal version of the hero: who, what, where. The pitch lives in the
// projects and case studies, not here.
const HeroSection = () => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-20">
      <p className={`${jetbrainsMono.className} mb-3`}>Hello, my name is</p>

      <h1
        className={`${inter.className} text-5xl font-extrabold md:text-6xl flex flex-col mb-5`}
      >
        <span className="text-gray-100">Justine</span>
        <span>AI Full-Stack</span>
        <span>Engineer</span>
      </h1>

      <p className={`${jetbrainsMono.className} mb-5`}>
        I build LLM-powered products end to end, and the agent tooling I build them with.
      </p>

      <div className="flex gap-3 items-center mb-5 flex-wrap">
        {availability.open ? (
          <div className="flex items-center bg-green-600/20 rounded-2xl py-1 px-3 gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span
              className={`${inter.className} text-green-600 font-bold text-sm`}
            >
              {availability.note}
            </span>
          </div>
        ) : (
          <div className="flex items-center bg-neutral-700/30 rounded-2xl py-1 px-3">
            <span
              className={`${inter.className} text-neutral-400 font-bold text-sm`}
            >
              Currently booked
            </span>
          </div>
        )}
        <span
          className={`${jetbrainsMono.className} inline-flex items-center gap-1.5 text-sm text-neutral-400`}
        >
          <FiMapPin className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
          Philippines
        </span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <FiGithub className="text-2xl hover:text-gray-100 transition-colors" />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <FiLinkedin className="text-2xl hover:text-gray-100 transition-colors" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
