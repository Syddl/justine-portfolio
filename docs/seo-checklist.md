# SEO & Visibility Checklist (owner actions)

The code side is done. These are the actions only you can take, roughly in
order of impact. Most are one-time; the last section is a recurring habit.

## 1. Domain (do this first — everything compounds on it)

The site's code now uses `https://justinecuevas.me` everywhere. To go live:

1. **Vercel → Project → Settings → Domains**: add `justinecuevas.me` (and
   `www.justinecuevas.me`, redirecting www → apex).
2. At your registrar, point the domain at Vercel (it shows you the exact
   A/CNAME records when you add the domain).
3. Keep `devjustine.me` in the same Domains list and set it to
   **Redirect to justinecuevas.me (308 permanent)** — old links and any
   Google equity transfer instead of dying. Keep renewing devjustine.me.
4. Update the resume PDF, email signature, and every social bio to use
   `justinecuevas.me` only.

## 2. Search consoles (without these you're flying blind)

- **Google Search Console** (search.google.com/search-console): verify BOTH
  domains via DNS. Submit `https://justinecuevas.me/sitemap.xml`. On the old
  devjustine.me property, run **Settings → Change of Address** →
  justinecuevas.me.
- **Bing Webmaster Tools** (bing.com/webmasters): one-click import from
  Google Search Console. Bing's index feeds ChatGPT search — this is
  disproportionately valuable and almost nobody does it.
- Check GSC's Page Indexing + Performance reports monthly.

## 3. Cross-linking (consistency is what AI engines cross-check)

- **GitHub**: set the profile website field to justinecuevas.me; pin
  StaffTrackr and Expensync; in each pinned repo's About, link its case
  study (`justinecuevas.me/projects/stafftrackr`, `.../expensync`) —
  not just the home page.
- **LinkedIn**: put justinecuevas.me in Contact Info AND the Featured
  section; make your headline contain "Full Stack Developer" +
  "Philippines"; keep name/role/location wording consistent with the site.
- The site now links to `linkedin.com/in/justinejudecuevas` (the vanity URL
  from your resume) — confirm that vanity URL is actually claimed on your
  LinkedIn profile; if not, claim it (LinkedIn → Edit public profile & URL).

## 4. Presence that doubles as backlinks

- **OnlineJobs.ph** and **Upwork** profiles linking the portfolio (the PH
  market + the global one).
- **Peerlist** and **Wellfound** profiles. Skip mass "high-DA directory"
  lists — spam risk exceeds value.
- Later, the real long-tail engine: 2–4 short technical posts a year
  ("Role-based access with Supabase RLS", "Building a PDF highlight
  extractor in Next.js"), published on the site or cross-posted to dev.to
  with the canonical URL set to your site.

## 5. Testimonials (when ready)

Ask past collaborators/clients for a **LinkedIn recommendation** (publicly
verifiable), then copy it into `src/data/testimonials.js` with
`source: "LinkedIn"` and the link. The section appears on the home page
automatically. Never invent one — fabricated testimonials are an FTC
violation, not just bad taste.

## 6. Keep content honest and current

- `src/data/availability.js` — keep the note concrete ("Booking projects
  for November" beats "Open for new projects").
- FAQ answers and service timelines are commitments — update them when your
  terms change.
- When a case study's content changes, bump its `date` in
  `src/data/projects.js` (feeds the sitemap's lastModified).

## 7. Quarterly AI-visibility check (5 minutes)

Ask ChatGPT, Perplexity, and Gemini:
- "Who is Justine Jude Cuevas?"
- "freelance Next.js developer in the Philippines"

Note whether the site is cited. That's the ground-truth metric for the
entity/structured-data work now baked into the site.
