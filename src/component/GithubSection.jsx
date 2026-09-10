import { FiArrowUpRight } from "react-icons/fi";
import { jetbrainsMono } from "@/app/fonts";
import { github, githubHandle } from "@/lib/site";
import {
  CELL,
  calendarCells,
  calendarSize,
  describeDay,
  fetchContributions,
} from "@/lib/github";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Amber at four strengths for the four GitHub levels; level 0 is a plain
// neutral cell. Index 0 is unused.
const LEVEL_OPACITY = [1, 0.3, 0.55, 0.8, 1];

// Async server component: the calendar is fetched at build time and
// revalidated every six hours, so the section is static HTML with no client
// JavaScript. Renders nothing when there is no data (see fetchContributions).
export default async function GithubSection() {
  const data = await fetchContributions(githubHandle);
  if (!data) return null;

  const cells = calendarCells(data.weeks);
  const { width, height } = calendarSize(data.weeks);
  const total = data.total.toLocaleString("en-US");

  return (
    <Reveal className="mb-16">
      <SectionHeading
        eyebrow="github"
        title="GitHub"
        action={
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${jetbrainsMono.className} inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-gray-100 transition-colors whitespace-nowrap`}
          >
            @{githubHandle}
            <FiArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        }
      />

      <p className={`${jetbrainsMono.className} text-sm text-neutral-400 mb-4`}>
        <span className="text-gray-100">{total}</span> contributions in the
        last year
      </p>

      {/* 53 columns need at least ~560px to stay legible; on a phone the
          grid scrolls sideways inside this box instead of shrinking. */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[560px]"
          role="img"
          aria-label={`GitHub contribution calendar: ${total} contributions in the last year`}
        >
          {cells.map((cell) => (
            <rect
              key={cell.date}
              x={cell.x}
              y={cell.y}
              width={CELL}
              height={CELL}
              rx="2"
              className={cell.level ? "fill-amber-300" : "fill-neutral-800"}
              opacity={LEVEL_OPACITY[cell.level]}
            >
              <title>{describeDay(cell)}</title>
            </rect>
          ))}
        </svg>
      </div>
    </Reveal>
  );
}
