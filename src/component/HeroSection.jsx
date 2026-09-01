import Link from "next/link";
import { FiGithub, FiLinkedin, FiArrowRight } from "react-icons/fi";
import { inter, jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import { email, github, linkedin } from "@/lib/site";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-20">
      <p className={`${jetbrainsMono.className} mb-3 text-neutral-500`}>
        {`// full-stack developer · philippines`}
      </p>

      <div className="mb-5">
        <h1 className="text-4xl font-extrabold md:text-5xl flex flex-col gap-1 leading-tight">
          <span className={inter.className}>I turn</span>
          <span
            className={`${jetbrainsMono.className} font-semibold text-amber-300 text-3xl md:text-4xl`}
          >
            &quot;we need a system for this&quot;
          </span>
          <span className={`${inter.className} text-gray-100`}>
            into working software.
          </span>
        </h1>
      </div>

      <p className={`${inter.className} mb-6 max-w-xl leading-relaxed`}>
        I&apos;m <span className="text-gray-100">Justine Jude Cuevas</span>, a
        full-stack developer in the Philippines. I build web apps for startups
        and small businesses: payroll platforms, client dashboards, AI-powered
        tools. Scoped clearly, demoed weekly, shipped in weeks.
      </p>

      {/* The one fact the copy above doesn't carry: this is my full-time job,
          not a side pursuit. Sits with the availability badge because both
          describe current state. */}
      <p
        className={`${jetbrainsMono.className} text-xs mb-4 text-neutral-400`}
      >
        <span className="text-neutral-600">now</span> full-stack engineer on an
        AI video platform
      </p>

      <div className="flex gap-2 items-center mb-6 flex-wrap">
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
        <span className={`${jetbrainsMono.className}`}>🏠Philippines.</span>
      </div>

      <div className="flex items-center gap-4 mb-10 flex-wrap">
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
        <div className="flex items-center gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <FiGithub className="text-2xl hover:text-gray-100" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <FiLinkedin className="text-2xl hover:text-gray-100" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
