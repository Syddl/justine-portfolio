import Link from "next/link";
import { FiGithub, FiLinkedin, FiArrowRight } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import { heroPhrases } from "@/data/hero";
import { email, github, linkedin } from "@/lib/site";
import RequirementCycler from "@/component/RequirementCycler";

// Server component on purpose: the name and the canonical headline land in the
// initial HTML. The cycling quote is the only client island. Four rows, each
// with one job: headline, who/what, status, action.
const HeroSection = () => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-24">
      <h1
        className={`${inter.className} text-4xl font-extrabold md:text-5xl flex flex-col gap-1 leading-tight text-gray-100 mb-6`}
        aria-label={`I turn "${heroPhrases[0]}" into working software.`}
      >
        <span>I turn</span>
        {/* text-3xl at every width: the cycler reserves the height of its
            longest phrase, and at text-4xl that phrase wraps inside the 720px
            column, leaving a blank second line under the quote. */}
        <RequirementCycler
          phrases={heroPhrases}
          className={`${jetbrainsMono.className} font-semibold text-amber-300 text-3xl`}
        />
        <span>into working software.</span>
      </h1>

      <p className={`${inter.className} mb-6 max-w-xl leading-relaxed`}>
        I&apos;m <span className="text-gray-100">Justine Jude Cuevas</span>, a
        full-stack developer in the Philippines. I build the software small
        teams run on: payroll that checks itself before payday, a study tool
        that turns PDF highlights into recall cards, video pipelines that catch
        their own mistakes.
      </p>

      <div className="mb-6">
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
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href={availability.ctaHref}
          className={`${inter.className} group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200`}
        >
          {availability.ctaLabel}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href={`mailto:${email}`}
          className={`${inter.className} text-sm text-neutral-400 hover:text-neutral-100 underline underline-offset-4 decoration-neutral-700 transition-colors`}
        >
          or email me
        </a>
        <span className="hidden sm:block h-4 w-px bg-neutral-800" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <FiGithub className="text-xl text-neutral-500 hover:text-gray-100 transition-colors" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <FiLinkedin className="text-xl text-neutral-500 hover:text-gray-100 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
