import { FiBox, FiGrid, FiCpu } from "react-icons/fi";

// Productized services shown on the home page. Plain language on purpose —
// these cards are read by business owners, not developers, so framework
// names stay off the card face (they live in Tech Stack and case studies).
// `timeline` lines are commitments: adjust them to what you can promise.
export const services = [
  {
    icon: FiBox,
    title: "MVP & product development",
    description:
      "You bring the idea; I get it to launch. Sign-ups, payments, an admin panel, and the boring-but-critical details handled — a real product your first users can pay for, not a prototype you'll rebuild later.",
    timeline: "Typically 4–6 weeks",
    proof: { label: "See: QuizyLite", href: "/projects/quizylite" },
  },
  {
    icon: FiGrid,
    title: "Business tools & dashboards",
    description:
      "When the spreadsheet becomes the bottleneck — attendance, payroll, records, reports — I replace it with software that validates inputs, runs the calculations, and shows you numbers you can trust.",
    timeline: "Typically 3–5 weeks",
    proof: { label: "See: StaffTrackr", href: "/projects/stafftrackr" },
  },
  {
    icon: FiCpu,
    title: "AI & automation integration",
    description:
      "AI features that survive contact with production: document processing, media pipelines, assistants — built with cost guards and quality checks, because keeping an AI platform reliable is literally my day job.",
    timeline: "Scoped per project",
    proof: { label: "See: QuizyLite", href: "/projects/quizylite" },
  },
];
