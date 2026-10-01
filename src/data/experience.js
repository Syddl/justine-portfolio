// Work experience entries - most recent first.
// `type` renders as a small mono tag, e.g. "Full-time" | "Contract" | "Freelance".
// A green "current" pulse shows automatically when `dates` ends in "Present".
// `location`, `description`, and `tech` are all optional per entry.
//
// `usageLabel` is how the stack section names this job when a tool is hovered
// ("used in: AI video platform"); entries without one are left out of that
// lookup. `tech` must use the exact names from src/data/stackdata.js.
//
// `metrics` (optional) render as one mono line under the description:
// "57 → 5 flagged clips · 90+ zero-cost CI gates". `before`/`after` are the
// displayed strings (omit `before` for a plain figure); `sentence` is what
// screen readers get. Only verifiable numbers belong here: each one below is
// traced in the job-hunt facts file.
export const experience = [
  {
    type: "Contract",
    title: "AI Full-Stack Engineer",
    company: "Interactive Content Digital s.r.o.",
    usageLabel: "AI video platform",
    dates: "June 2026 - Sep 2026",
    location: "Remote",
    description:
      "I took an AI video platform from an early prototype to a pipeline that turns a script into a 1080p narrated video with a lip-synced avatar. I wrote the Claude prompts for script and scene direction, built Claude vision guards that re-roll bad images, an A/B eval tool with blind scoring, checkpoint resume and pre-spend cost guards, and, with a second developer, the SaaS layer: a Next.js console, Supabase Auth with RLS, team seats and a Stripe credit ledger.",
    metrics: [
      {
        after: "<$0.90",
        label: "per output minute across 47 real jobs",
        sentence: "Under 90 cents per output minute across 47 real jobs",
      },
      {
        before: "57",
        after: "5",
        label: "flagged clips on a 60-clip render, all real defects",
        sentence:
          "Flagged clips on a 60-clip render cut from 57 to 5, all real defects",
      },
      {
        before: "430 ms",
        after: "<½ frame",
        label: "scene-cut drift on 20-minute videos",
        sentence:
          "Scene-cut drift on 20-minute videos cut from 430 milliseconds to under half a frame",
      },
      {
        after: "90+",
        label: "zero-cost CI gates",
        sentence: "More than 90 zero-cost CI gates",
      },
    ],
    tech: [
      "Claude API",
      "OpenAI API",
      "Node.js",
      "Next.js",
      "Python",
      "FastAPI",
      "FFmpeg",
      "BullMQ",
      "Redis",
      "Supabase",
      "Stripe",
      "Docker",
    ],
  },
];
