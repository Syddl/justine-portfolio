# Justine Jude Cuevas — Portfolio

Personal portfolio site for a full stack developer, built with the Next.js App
Router. Live at [devjustine.me](https://devjustine.me).

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **react-icons** — iconography
- **Sonner** — toast notifications
- **Web3Forms** — contact form delivery

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable                     | Required             | Purpose                                                            |
| ---------------------------- | -------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_WEB3FORMS_KEY`  | Yes (contact form)   | Web3Forms access key used by the contact form.                     |
| `NEXT_PUBLIC_GA_ID`          | No                   | Google Analytics measurement ID. Analytics is skipped when unset. |

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Project structure

```
src/
  app/         routes, layout, metadata, sitemap/robots, OG image generator
  component/   UI sections (Hero, About, Tech Stack, Projects, etc.)
  data/        project + tech-stack content
  lib/         shared Framer Motion variants
public/        images and favicon
```

## Deployment

Optimized for [Vercel](https://vercel.com). Set the environment variables above
in the project settings, then deploy.
