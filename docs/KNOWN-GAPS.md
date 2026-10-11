# Known gaps

Gaps accepted for now. A row leaves this table when its fix merges (link the PR or the decision) or when a decision rejects it.

| Gap | Impact | Owner | Trigger to fix |
|---|---|---|---|
| `text-neutral-500` greys (case-study meta, dates, hackathon tags) fall below WCAG AA contrast on neutral-900 | Low-vision visitors; accessibility audits flag the pages | UI | A client or audit raises accessibility |
| No browser or end-to-end check: `npm test` covers only the pure helpers in `src/lib/` and the data in `src/data/` | A broken section, hydration mismatch or form ships with a green suite | Checks | A layout or interaction regression reaches production |

Rules for this table:

- One row per gap. Facts, not narrative. No dates in a row; the git log has them.
- A gap with a fix in flight points at `docs/sdd/<feature>/STATUS.md`, not at a branch name.
- A security gap names the surface and the precondition under which it is exploitable.
- A gap that costs money when hit says how much per occurrence.
