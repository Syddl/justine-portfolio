import { jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import TiltCard from "@/component/motion/TiltCard";

// The floating `const developer = {...}` card from the original About. It
// says who, not what: the fields are the ones you would put on a name tag.
// Server-safe: the float is a CSS keyframe (see .float-card in globals.css)
// on the outer div; the pointer tilt is TiltCard, a small client island on
// the inner one, so the two transforms never fight.
//
// Colours stay inside the site's palette: strings amber, everything else
// grey, so the card reads like the wordmark rather than an editor theme.
const fields = [
  { key: "name", value: "Justine" },
  { key: "role", value: "AI Full-Stack Engineer" },
  { key: "location", value: "Philippines" },
  { key: "openToWork", value: availability.open },
  { key: "currentlyBuilding", value: availability.currentlyBuilding },
  { key: "ai", value: ["Claude Code", "Claude API", "OpenAI API", "Evals"] },
  { key: "frontend", value: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { key: "backend", value: ["FastAPI", "Express.js"] },
];

const Punct = ({ children }) => (
  <span className="text-neutral-500">{children}</span>
);
const Str = ({ children }) => (
  <span className="text-amber-300">&quot;{children}&quot;</span>
);

// Arrays print two items per line, as the original card did, so the block
// never needs to scroll sideways inside the 2/5 column.
const rowsOf = (items, size) =>
  items.reduce((rows, item, i) => {
    if (i % size === 0) rows.push([]);
    rows[rows.length - 1].push(item);
    return rows;
  }, []);

const Value = ({ value }) => {
  if (Array.isArray(value)) {
    const last = value.length - 1;
    return (
      <>
        <Punct>[</Punct>
        {"\n"}
        {rowsOf(value, 2).map((row, r) => (
          <span key={row.join()}>
            {"    "}
            {row.map((item, i) => (
              <span key={item}>
                <Str>{item}</Str>
                {r * 2 + i < last && <Punct>, </Punct>}
              </span>
            ))}
            {"\n"}
          </span>
        ))}
        {"  "}
        <Punct>]</Punct>
      </>
    );
  }
  if (typeof value === "boolean") {
    return <span className="text-neutral-200">{String(value)}</span>;
  }
  return <Str>{value}</Str>;
};

const DeveloperCard = () => {
  return (
    <div className="float-card">
      <TiltCard className="rounded-xl border border-neutral-700/60 bg-neutral-900/80 backdrop-blur-sm p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>

      <pre
        className={`${jetbrainsMono.className} text-xs leading-relaxed overflow-x-auto`}
      >
        <code>
          <span className="text-neutral-400">const</span>{" "}
          <span className="text-gray-100">developer</span> <Punct>= {"{"}</Punct>
          {"\n"}
          {fields
            .filter(({ value }) => value !== undefined)
            .map(({ key, value }) => (
              <span key={key}>
                {"  "}
                <span className="text-neutral-300">{key}</span>
                <Punct>: </Punct>
                <Value value={value} />
                <Punct>,</Punct>
                {"\n"}
              </span>
            ))}
          <Punct>{"};"}</Punct>
        </code>
      </pre>
      </TiltCard>
    </div>
  );
};

export default DeveloperCard;
