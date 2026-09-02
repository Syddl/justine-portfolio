import { inter, jetbrainsMono } from "@/app/fonts";

// One heading treatment for every home section: a mono "// eyebrow" (the same
// idiom the case-study pages already use), a 2xl title, and an optional lede.
// `action` is a right-aligned slot for a link such as "View all". Server-safe:
// no hooks, no motion.
const SectionHeading = ({
  eyebrow,
  title,
  lede,
  action,
  className = "mb-8",
}) => {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className={`${jetbrainsMono.className} text-xs text-neutral-400 mb-2`}
          >
            {`// ${eyebrow}`}
          </p>
          <h2
            className={`${inter.className} text-gray-100 text-2xl font-bold leading-tight`}
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {lede && (
        <p
          className={`${inter.className} text-neutral-400 text-sm leading-relaxed max-w-xl mt-3`}
        >
          {lede}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
