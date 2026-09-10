# Justine Jude Cuevas Portfolio

Personal portfolio site for a full stack developer, built with the Next.js App
Router. Live at [justinecuevas.me](https://www.justinecuevas.me).

All content is data-driven and lives in `src/data/`: availability status
(plus optional online hours for the contact page's timezone line),
testimonials, work experience, tech stack, hero phrases, and project case
studies. Edit those files, not the components, to change what the site says.
The current role's verifiable `metrics` feed the About proof block, and each
job's `usageLabel` names it in the stack section's cross-highlight. Tool
names must match across `stackdata.js`, `projects.js`, and `experience.js`;
the cross-highlight looks them up by exact name.
`src/lib/site.js` is the single source for the canonical URL, email, and
social links. `docs/seo-checklist.md` tracks the off-site SEO actions.

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
- `npm test` — run the Node test suite

## Project structure

```
src/
  app/         routes (incl. /projects/[slug] case studies), layout, metadata,
               sitemap/robots, OG image generator, 404
  component/   UI sections (Hero, About, Experience, Projects, Case Study, etc.)
  data/        all site content: projects/case studies, availability,
               testimonials, experience, tech stack, hero phrases
  lib/         site constants, SEO helper, shared Framer Motion variants,
               the count-up hook, and the pure stack-usage and timezone
               helpers (unit-tested with `npm test`)
public/        images and favicon
```

## Deployment

Optimized for [Vercel](https://vercel.com). Set the environment variables above
in the project settings, then deploy.
