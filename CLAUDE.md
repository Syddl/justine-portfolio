<!--
  Maintainer header. HTML comments are stripped before injection and cost no tokens.
  Owner: Justine Jude Cuevas
  Lint: node ~/.claude/skills/harness/scripts/lint-harness.mjs   (run from the project root)
  Keep this file near 50 lines and undated. Facts belong in .claude/harness.json, not here.
-->

# justine-portfolio: read first

Personal portfolio site at www.justinecuevas.me: Next.js 16 App Router, React 19, Tailwind v4 on Node 22, deployed by Vercel from main.

## Standing architecture rules (link a decision for each)

- Site content is data: copy, projects, experience, stack and availability live in `src/data/`; components
  only render it. Tool names match exactly across `stackdata.js`, `projects.js` and `experience.js`. See README.md.
- `src/lib/site.js` is the one owner of the canonical URL, email and social links. See docs/seo-checklist.md.
- Colours come from the light/dark tokens in `src/app/globals.css`; green is the only chromatic accent;
  fonts are Figtree, Newsreader italic and JetBrains Mono. See docs/decisions/0002-redesign-visual-language.md.
- No fabricated proof: no invented testimonials, logos or metrics. See the client-first-portfolio spec in docs/superpowers/specs/.
- `useReducedMotion` may change transitions only, never markup (it hydrates differently); hide decorative
  motion with CSS. Mount-only state uses `useSyncExternalStore`, as in `src/component/TimezoneLine.jsx`.

## Spend and proof

- Commands that can bill a provider are listed under `spend` in `.claude/harness.json`.
  The guard hook asks before running one. That ask prompt is the approval; nothing else is.
- Cheap preflight first: the dry-run or smoke path before any paid run.
- "Green" is claimed only by claim-green on the pushed tip. A partial run is not proof.

## Checks

- Run `npm run lint && npm test` before claiming anything works. The suite and quick commands are
  the `checks` section of `.claude/harness.json`.
- The guard's fixture checks (`node scripts/check-hooks.mjs`) run in the suite and in CI.
- A green check proves only what it exercises. Every check file states what it does NOT exercise.
- A new check is wired into the scripts list and CI, at the end of both unless the project's wiring
  check enforces another order; the `checks` section decides.

## Git

- Stage explicit paths. `git add -A`, `git add .` and `git add --all` are denied by
  `.claude/settings.json`; the rule exists because parts of a tree can be deliberately untracked.
- Read `git diff --cached --name-only` before every commit.
- When work belongs on a feature branch, run `git branch --show-current` in the same command as the
  commit: a merge, a pull or another session can switch the checkout between turns.
- Never force-push or hard-reset shared history.

## Language

The glossary (say it this way, avoid that) is the `glossary` section of `.claude/harness.json`.

## Where things live

| Kind | Place |
|---|---|
| Facts the harness reads | `.claude/harness.json` |
| Decisions and rulings | `docs/decisions/`, plus earlier specs in `docs/superpowers/specs/` |
| Known gaps | `docs/KNOWN-GAPS.md` |
| Work in flight | `docs/sdd/<feature>/STATUS.md` |
| How much process a change needs | the Sizing table in the harness library's `docs/LIFECYCLE.md` |
