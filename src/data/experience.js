// Work experience entries — most recent first.
// `type` renders as a small tag, e.g. "Full-time" | "Internship" | "Freelance".
// A green "current" pulse shows automatically when `dates` ends in "Present".
// `location`, `description`, and `tech` are all optional per entry.
export const experience = [
  {
    type: "Full-time",
    title: "Full Stack Developer",
    company: "Interactive Content Digital s.r.o.",
    dates: "June 2026 - Present",
    location: "Remote",
    description:
      "I build and maintain an AI video platform that turns a script into a 1080p narrated video with a lip-synced avatar, at roughly $0.70 per output minute. My work cut false quality flags on generated clips from 93% to 3% and audio/video drift from ~430 ms to under one frame — via LLM vision guards, checkpoint resume, pre-spend cost guards, and a 70+ gate zero-cost CI suite. I also shipped the SaaS layer around it: a Next.js console, Supabase Auth with RLS across 42 migrations, role-based team seats, a Stripe-backed credit ledger, an admin dashboard, and a Dockerized deploy.",
    tech: [
      "Node.js",
      "TypeScript",
      "Python / FastAPI",
      "FFmpeg",
      "BullMQ / Redis",
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
      "Created promotional graphic content for marketing campaigns, including social media posts, banners, and announcement visuals. Produced on-brand designs that supported community engagement and helped communicate launches and updates across the project's channels.",
    tech: ["Photoshop", "Canva"],
  },
];
