import { FiArrowUpRight } from "react-icons/fi";
import { jetbrainsMono } from "@/app/fonts";
import { github, githubHandle } from "@/lib/site";
import { calendarRows, describeDay, fetchContributions } from "@/lib/github";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// The contribution calendar as an ASCII ramp: one glyph per day, denser and
// brighter with each GitHub level. Plain ASCII plus the middle dot so every
// glyph comes from the loaded latin subset of JetBrains Mono and the grid
// stays aligned.
const GLYPHS = ["·", ":", "=", "*", "#"];
const LEVEL_CLASS = [
  "text-neutral-700",
  "text-amber-300/40",
  "text-amber-300/60",
  "text-amber-300/80",
  "text-amber-300",
];

// Async server component: the calendar is fetched at build time and
// revalidated every six hours, so the section is static HTML with no client
// JavaScript. Renders nothing when there is no data (see fetchContributions).
export default async function GithubSection() {
  const data = await fetchContributions(githubHandle);
  if (!data) return null;

  const rows = calendarRows(data.weeks);
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

      {/* Letter-spacing widens each column to roughly the line height, so
          the cells read as squares. 53 columns need ~700px; on a phone the
          grid scrolls sideways inside this box instead of wrapping. The box
          is dir="rtl" so it starts scrolled to the right, on the most recent
          weeks; the grid itself is dir="ltr" so the glyphs stay in order. */}
      <div dir="rtl" className="overflow-x-auto overflow-y-hidden pb-1">
        <pre
          dir="ltr"
          role="img"
          aria-label={`GitHub contribution calendar: ${total} contributions in the last year`}
          className={`${jetbrainsMono.className} w-max text-sm leading-none tracking-[0.35em]`}
        >
          {rows.map((row, weekday) => (
            <span key={weekday} className="block">
              {row.map((day, week) =>
                day ? (
                  <span
                    key={day.date}
                    title={describeDay(day)}
                    className={LEVEL_CLASS[day.level]}
                  >
                    {GLYPHS[day.level]}
                  </span>
                ) : (
                  <span key={`blank-${week}`}> </span>
                ),
              )}
            </span>
          ))}
        </pre>
      </div>
    </Reveal>
  );
}
