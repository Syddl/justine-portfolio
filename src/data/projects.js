// Each project doubles as a case study at /projects/[slug].
// Card fields: name, summary, stack, image, gradientStyle, live, github
//   (omit `github` to hide the Code link — e.g. private repos).
// Case-study fields: slug, tagline, problem, solution (paragraphs),
//   outcomes (truthful, qualitative), results ({metric,label} — verifiable
//   numbers only, [] until you have them), screenshots, role, timeline,
//   techNotes, date (feeds sitemap lastModified — bump when content changes).
export const projects = [
  {
    name: "QuizyLite",
    slug: "quizylite",
    seoTitle: "QuizyLite — PDF Study Tool Built with Next.js & MongoDB",
    seoDescription:
      "Case study: how I built QuizyLite, a PDF study tool that turns highlights into source-linked recall cards, using Next.js, TypeScript, Tailwind CSS, and MongoDB.",
    tagline:
      "A study tool that turns PDF highlights into recall cards linked back to the exact page.",
    summary:
      "Turns passive PDF reading into active recall — highlights become source-linked flashcards.",
    description:
      "A PDF study tool that turns your highlights into source-linked recall cards, so you can jump back to the exact page and context to review what you missed.",
    problem:
      "Studying from PDFs is passive: you read, you forget. Making flashcards by hand fixes that, but it's slow, and once a card exists it's disconnected from the material — when you get one wrong, there's no way back to the paragraph it came from.",
    solution: [
      "QuizyLite folds card-making into reading itself. You highlight a passage while you read, and it becomes a recall card — a flashcard, a fill-in-the-blank, or a custom question — with zero separate authoring step.",
      "Every card stays linked to its source. Get one wrong and you can jump straight back to the exact page and paragraph it came from, so a failed card turns into a focused review session instead of a shrug.",
      "Mistake review and progress tracking close the loop: the app resurfaces what you miss and shows how your recall improves over time, behind per-user accounts.",
    ],
    outcomes: [
      "Highlighting while reading replaces the manual flashcard step entirely",
      "Wrong answers jump back to the exact source page, turning mistakes into review",
      "Live in production at quizylite.app",
    ],
    results: [],
    screenshots: [
      {
        src: "/quizylite/quizylite.png",
        alt: "QuizyLite reading view with highlighted passages and generated recall cards",
        caption:
          "Highlight a passage while reading — it becomes a recall card that links back to this page.",
      },
    ],
    role: "Solo — design, frontend, backend, deployment",
    timeline: "Personal product, actively developed",
    techNotes:
      "Next.js + TypeScript frontend with Tailwind CSS; MongoDB for cards and progress data; deployed on Vercel with a DigitalOcean-hosted API.",
    date: "2026-09-01",
    stack: ["NextJS", "TypeScript", "Tailwind", "MongoDB"],
    live: "https://www.quizylite.app/",
    image: "/quizylite/quizylite.png",
    gradientStyle:
      "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(109,40,217,0.1), rgba(17,17,19,1))",
  },
  {
    name: "StaffTrackr",
    slug: "stafftrackr",
    seoTitle: "StaffTrackr — Workforce & Payroll App with Next.js & Supabase",
    seoDescription:
      "Case study: StaffTrackr, a workforce app with real-time attendance, employee records, and automated, validated payroll runs — built with Next.js, TypeScript, and Supabase.",
    tagline:
      "A payroll and attendance platform that replaces the spreadsheet stack.",
    summary:
      "Attendance, employee records, and automated payroll runs — validated before anyone gets paid wrong.",
    description:
      "A workforce management app for onboarding, attendance, roles, and automated payroll, with role-based access and real-time data handling.",
    problem:
      "Small teams usually run attendance and payroll across a stack of spreadsheets: hours copied by hand, tax and deduction math redone every cycle, and no safety net before payday. One typo and someone gets paid wrong — and nobody notices until they complain.",
    solution: [
      "StaffTrackr puts the whole flow in one place. Attendance is tracked in real time, employee records live behind role-based access, and payroll runs are computed automatically on weekly, semi-monthly, or monthly schedules with tax and deduction handling built in.",
      "The part spreadsheets can never give you: pre-run validation. Before a payroll run executes, the app checks the data behind it and surfaces anything missing or inconsistent — so problems are caught before money moves, not after.",
      "Workforce reports turn the same data into answers: who worked when, what a payroll cycle actually cost, and how it changes over time.",
    ],
    outcomes: [
      "Payroll computed automatically on weekly, semi-monthly, or monthly schedules",
      "Pre-run validation catches missing or inconsistent data before anyone is paid wrong",
      "Role-based access keeps records visible only to the people who should see them",
    ],
    results: [],
    screenshots: [
      {
        src: "/stafftrackr/st_landing.png",
        alt: "StaffTrackr dashboard showing attendance tracking and payroll overview",
        caption:
          "One dashboard for attendance, employee records, and upcoming payroll runs.",
      },
    ],
    role: "Solo — design, frontend, backend, deployment",
    timeline: "Personal product",
    techNotes:
      "Next.js + TypeScript on Supabase (auth, role-based access, real-time data); Tailwind CSS with shadcn/ui; Framer Motion.",
    date: "2026-09-01",
    stack: ["NextJS", "TypeScript", "Tailwind", "Supabase", "Shadcn", "Motion"],
    github: "https://github.com/Syddl/StaffTrackr",
    live: "https://stafftrackr.vercel.app/",
    image: "/stafftrackr/st_landing.png",
    gradientStyle:
      "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(79,70,229,0.1), rgba(17,17,19,1))",
  },
  {
    name: "ExpenSync",
    slug: "expensync",
    seoTitle: "ExpenSync — Expense Tracker Built with React & Firebase",
    seoDescription:
      "Case study: ExpenSync, a minimal expense tracker with instant category summaries, built with React, Firebase, Tailwind CSS, and Material UI.",
    tagline: "A minimal expense tracker built so the habit actually sticks.",
    summary:
      "Add, edit, categorize — instant summaries keep daily spending visible.",
    description:
      "A sleek, minimal expense tracker to add, edit, and categorize spending, with instant summaries that keep your daily finances in check.",
    problem:
      "Expense tracking fails for one reason: friction. If logging a purchase takes more than a few seconds, the habit dies within a week — and a tracker you've stopped using is just a reminder that you tried.",
    solution: [
      "ExpenSync strips the flow down to what keeps the habit alive: add an expense in seconds, file it under a category, and watch the summaries update instantly as entries change.",
      "Everything syncs through Firebase, so the running picture of your daily finances is always current — no exports, no recalculating, no end-of-month archaeology.",
    ],
    outcomes: [
      "Logging an expense takes seconds, so the habit survives past week one",
      "Category summaries update instantly as entries are added or edited",
      "Live demo available — click around without creating an account",
    ],
    results: [],
    screenshots: [
      {
        src: "/expensync/landing-page.png",
        alt: "ExpenSync landing page with expense categories and summary view",
        caption: "Instant summaries: spending by category, always current.",
      },
    ],
    role: "Solo — design, frontend, backend",
    timeline: "Personal project",
    techNotes:
      "React with JavaScript, Tailwind CSS and Material UI; Firebase for auth and data sync; deployed on Vercel.",
    date: "2026-09-01",
    stack: ["React", "JavaScript", "Tailwind", "Firebase", "MUI"],
    github: "https://github.com/Syddl/Expensync",
    live: "https://expensync-nine.vercel.app/",
    image: "/expensync/landing-page.png",
    gradientStyle:
      "linear-gradient(135deg, rgba(5,150,105,0.25), rgba(16,185,129,0.1), rgba(17,17,19,1))",
  },
];
