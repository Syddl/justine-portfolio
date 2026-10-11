import Image from "next/image";
import { FiFileText, FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";
import { availability } from "@/data/availability";
import { github, linkedin, resumeUrl } from "@/lib/site";

// Server component on purpose: the name lands in the initial HTML. Who,
// what, where: photo, name and role with the resume beside them, then the
// tagline as the headline. The three blocks rise in 60ms apart (.rise-in in
// globals.css) while the first-load dissolve clears.
const HeroSection = () => {
  return (
    <section className="mb-20">
      {/* Phones: photo on the left of name and role, resume pill under
          them. sm and up: one row, pill on the right. */}
      <div
        className="rise-in grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 sm:grid-cols-[auto_1fr_auto]"
        style={{ "--i": 0 }}
      >
        <Image
          src="/justine.jpg"
          alt=""
          width={80}
          height={80}
          loading="eager"
          className="row-span-2 size-16 rounded-full object-cover sm:row-span-1 sm:size-20"
        />
        <div>
          <h1 className="text-[22px] font-semibold leading-tight text-ink">
            Justine Jude Cuevas
          </h1>
          <p className="text-[17px] text-muted">AI Full-Stack Engineer</p>
        </div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill col-start-2 justify-self-start sm:col-start-3"
        >
          <FiFileText className="size-4" aria-hidden="true" />
          Resume
        </a>
      </div>

      <p
        className="rise-in mt-8 text-[1.75rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-[2.125rem]"
        style={{ "--i": 1 }}
      >
        I build LLM-powered products end to end, and the{" "}
        <em className="font-serif font-normal italic">agent tooling</em> I
        build them with.
      </p>

      <div
        className="rise-in mt-8 flex flex-wrap items-center gap-x-4 gap-y-3"
        style={{ "--i": 2 }}
      >
        {availability.open ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {availability.note}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-hover px-3 py-1 text-sm font-medium text-muted">
            Currently booked
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <FiMapPin className="size-3.5" aria-hidden="true" />
          Philippines
        </span>
        <span className="flex items-center gap-3 text-muted">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="transition-colors hover:text-ink"
          >
            <FiGithub className="size-5" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="transition-colors hover:text-ink"
          >
            <FiLinkedin className="size-5" />
          </a>
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
