// Each project doubles as a case study at /projects/[slug].
// Card fields: name, summary, stack (exact names from src/data/stackdata.js),
//   image, gradientStyle, live, github
//   (omit `live` or `github` to hide that link - e.g. private repos).
// Case-study fields: slug, tagline, problem, solution (paragraphs),
//   outcomes (truthful, qualitative), results ({metric,label} - verifiable
//   numbers only, [] until you have them), screenshots, role, timeline,
//   techNotes, date (feeds sitemap lastModified - bump when content changes).
// The first two entries are the home page's "Selected work".
export const projects = [
  {
    name: "CooPilot",
    slug: "coopilot",
    seoTitle: "CooPilot: IoT Poultry Monitoring with FastAPI, React, Expo and Raspberry Pi",
    seoDescription:
      "Case study: CooPilot, a thesis system that monitors free-range poultry coops with Raspberry Pi sensors, alerts farmers on their phones and serves an LSTM egg forecast.",
    tagline:
      "Coop sensors, farmer alerts and an egg forecast, from a Raspberry Pi to a farmer's phone.",
    summary:
      "Monitors poultry coops with Raspberry Pi sensors and alerts farmers on their phones, with an LSTM egg forecast.",
    description:
      "An IoT system for free-range poultry farms: a Raspberry Pi reads coop conditions, a FastAPI backend raises alerts and serves an egg-production forecast, and farmers follow it on the web and on their phones.",
    problem:
      "Small free-range poultry farms run on what the farmer sees during the day. Heat, ammonia and poor ventilation build up unnoticed, especially at night, and egg production drops before anyone connects the cause. Our thesis set out to give a small cooperative's farmers live coop conditions, timely alerts and a forecast of their eggs.",
    solution: [
      "A Raspberry Pi in the coop reads temperature, humidity, CO2, ammonia and light, buffers readings while the internet is down, and uploads them over HTTPS to a FastAPI backend on Supabase Postgres.",
      "The backend turns readings into daily values on the farm's local day, raises warnings and critical alerts against limits each cooperative sets for itself, and pushes them to the farmer's phone. Cooperative admins and farmers use a role-based React web app; farmers log eggs in an Expo app that keeps working offline and syncs later.",
      "The team's LSTM egg-production forecast runs in the backend. I moved its inference from TensorFlow to a small NumPy runtime, which dropped a 590 MB dependency from the API image and matches the Keras output to within 7e-8.",
    ],
    outcomes: [
      "Coop conditions reach the farmer's phone, with alerts when a limit is crossed",
      "Egg logs survive no-signal days and sync when the phone is back online",
      "Built by two developers with up to five Claude Code agents working in parallel",
    ],
    results: [
      { metric: "590 MB", label: "TensorFlow removed from the API image" },
      { metric: "93", label: "merged pull requests" },
      { metric: "680+", label: "backend tests" },
    ],
    screenshots: [
      {
        src: "/coopilot/coopilot.jpg",
        alt: "CooPilot landing page beside the mobile app showing tomorrow's egg forecast and live coop conditions",
        caption:
          "The CooPilot landing page, with the farmer's mobile app: tomorrow's egg forecast, coop conditions and what to fix first.",
      },
    ],
    role: "One of two developers on a team of 4: the web app and mobile app, plus shared work on the backend and the edge device",
    timeline: "Jan 2026 - present, thesis defense November 2026",
    techNotes:
      "FastAPI and SQLAlchemy on Supabase Postgres with Alembic migrations; a FastAPI edge API on the Raspberry Pi with SCD41, MQ-137 and BH1750 sensors; a React + Vite web app; an Expo React Native app with push notifications. Built with Claude Code and the agent harness.",
    date: "2026-10-01",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "React Native",
      "Supabase",
      "PostgreSQL",
      "Raspberry Pi",
      "Claude Code",
    ],
    image: "/coopilot/coopilot.jpg",
    gradientStyle:
      "linear-gradient(135deg, rgba(22,163,74,0.25), rgba(21,128,61,0.1), rgba(17,17,19,1))",
  },
  {
    name: "QuizyLite",
    slug: "quizylite",
    seoTitle: "QuizyLite: PDF Study Tool Built with Next.js, Express & MongoDB",
    seoDescription:
      "Case study: how I built QuizyLite, a PDF study tool that turns highlights into source-linked recall cards, using Next.js, TypeScript, Express, MongoDB and Firebase Auth.",
    tagline:
      "A study tool that turns PDF highlights into recall cards linked back to the exact page.",
    summary:
      "Turns passive PDF reading into active recall: highlights become source-linked flashcards.",
    description:
      "A PDF study tool that turns your highlights into source-linked recall cards, so you can jump back to the exact page and context to review what you missed.",
    problem:
      "Studying from PDFs is passive: you read, you forget. Making flashcards by hand fixes that, but it's slow, and once a card exists it's disconnected from the material. When you get one wrong, there's no way back to the paragraph it came from.",
    solution: [
      "QuizyLite folds card-making into reading itself. You highlight a passage while you read, and it becomes a recall card: a flashcard, a fill-in-the-blank, or a custom question. There's no separate authoring step.",
      "Every card stays linked to its source. Get one wrong and you can jump straight back to the exact page and paragraph it came from, so a failed card turns into a focused review session instead of a shrug.",
      "Mistake review and progress tracking close the loop: the app resurfaces what you miss and shows how your recall improves over time, behind per-user accounts.",
    ],
    outcomes: [
      "Highlighting while reading replaces the manual flashcard step entirely",
      "Wrong answers jump back to the exact source page, turning mistakes into review",
      "Live at quizylite.app, in private beta",
    ],
    results: [],
    screenshots: [
      {
        src: "/quizylite/quizylite.png",
        alt: "QuizyLite reading view with highlighted passages and generated recall cards",
        caption:
          "Highlight a passage while reading and it becomes a recall card that links back to this page.",
      },
    ],
    role: "Solo: design, frontend, backend, deployment",
    timeline: "Nov 2025 - present, in private beta",
    techNotes:
      "Next.js + TypeScript frontend with Tailwind CSS and TanStack Query; an Express + MongoDB API with Zod validation and rate limiting; Firebase Auth; pdf.js for reading. Built with Claude Code and the agent harness.",
    date: "2026-10-01",
    stack: ["Next.js", "TypeScript", "Tailwind", "Express", "MongoDB", "Firebase"],
    live: "https://www.quizylite.app/",
    image: "/quizylite/quizylite.png",
    gradientStyle:
      "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(109,40,217,0.1), rgba(17,17,19,1))",
  },
];
