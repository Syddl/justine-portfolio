// Work experience entries - most recent first.
// `type` renders as a small mono tag, e.g. "Full-time" | "Internship" | "Freelance".
// A green "current" pulse shows automatically when `dates` ends in "Present".
// `location`, `description`, and `tech` are all optional per entry.
//
// `usageLabel` is how the stack section names this job when a tool is hovered
// ("used in: AI video platform"); entries without one are left out of that
// lookup. `tech` must use the exact names from src/data/stackdata.js.
//
// `metrics` (current role only) feed the proof block in the About section.
// Each entry: `before`/`after` are the displayed strings; `count` animates the
// `after` figure from `from` to `to` and formats it (omit `count` for a figure
// that is not a number, like "<1 frame"); `sentence` is what screen readers
// get. Only verifiable numbers belong here.
export const experience = [
  {
    type: "Full-time",
    title: "Full Stack Developer",
    company: "Interactive Content Digital s.r.o.",
    usageLabel: "AI video platform",
    dates: "June 2026 - Present",
    location: "Remote",
    description:
      "I build and maintain an AI video platform that turns a script into a 1080p narrated video with a lip-synced avatar. I own the pipeline's quality guards (LLM vision checks, checkpoint resume, pre-spend cost guards, a zero-cost CI suite) and the SaaS layer around it: a Next.js console, Supabase Auth with RLS, role-based team seats, a Stripe-backed credit ledger, an admin dashboard, and a Dockerized deploy.",
    metrics: [
      {
        before: "93%",
        after: "3%",
        count: { from: 93, to: 3, format: (v) => `${Math.round(v)}%` },
        label: "false quality flags on generated clips",
        sentence:
          "False quality flags on generated clips cut from 93% to 3%",
      },
      {
        before: "~430 ms",
        after: "<1 frame",
        label: "audio/video drift",
        sentence:
          "Audio and video drift cut from about 430 milliseconds to under one frame",
      },
      {
        after: "70+",
        count: { from: 0, to: 70, format: (v) => `${Math.round(v)}+` },
        label: "zero-cost CI gates",
        sentence: "More than 70 zero-cost CI gates",
      },
      {
        after: "$0.70",
        count: { from: 0, to: 0.7, format: (v) => `$${v.toFixed(2)}` },
        label: "per output minute, end to end",
        sentence: "About 70 cents per output minute, end to end",
      },
    ],
    tech: [
      "Node.js",
      "TypeScript",
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
  {
    type: "Full-time",
    title: "Graphic Designer",
    company: "MicroPets",
    dates: "June 2024 - Jan 2025",
    location: "General Santos City",
    description:
      "Promotional graphics for MicroPets' marketing campaigns: social posts, banners, and launch visuals. It's also why projects with me don't need a second hire for mockups and launch assets.",
    tech: ["Photoshop", "Canva"],
  },
];
