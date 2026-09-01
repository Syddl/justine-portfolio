import Link from "next/link";
import { jetbrainsMono } from "@/app/fonts";

// Wordmark: the "i" in ".justine" is replaced by a backslash carrying its own
// tittle, so the letter still reads as an i while the stem slants. The
// backslash is the escape character, and it leaves "\n" sitting inside the
// name: a quiet joke for the developers who notice, invisible to everyone
// else. Amber matches the string-literal accent in the hero.
//
// Drawn as SVG rather than the "\" character so the stem and tittle stay
// locked together at any size. The viewBox is 100 units per em, matching
// JetBrains Mono's metrics: 0.6em advance, baseline at 1.02em, cap height
// 0.73em. vertical-align pulls it down by the font's descent so it sits on
// the same baseline as the letters beside it.
const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Justine Jude Cuevas, home"
      className={`${jetbrainsMono.className} group font-semibold text-lg tracking-tight text-[#A8ADB2] hover:text-gray-100 transition-colors duration-200`}
    >
      <span aria-hidden="true">.just</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 60 132"
        className="inline-block h-[1.32em] w-[0.6em] text-amber-300 group-hover:text-amber-200 transition-colors duration-200"
        style={{ verticalAlign: "-0.3em" }}
        fill="none"
      >
        {/* tittle */}
        <rect x="13.5" y="11" width="11" height="11" rx="1.5" fill="currentColor" />
        {/* slanted stem, cap height down to baseline */}
        <path
          d="M19 29 L41 102"
          stroke="currentColor"
          strokeWidth="10.5"
          strokeLinecap="butt"
        />
      </svg>
      <span aria-hidden="true">ne</span>
    </Link>
  );
};

export default Logo;
