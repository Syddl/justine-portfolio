// Single source of truth for site identity. Every file that needs the
// canonical URL, name, or social links imports from here - never hard-code
// these elsewhere (they were previously duplicated across four files, which
// made changing the domain error-prone).
// The www host is the one Vercel actually serves: the apex 308-redirects to
// it. Canonicals, sitemap entries, and JSON-LD must name the served host, not
// the one that redirects.
export const siteUrl = "https://www.justinecuevas.me";
export const siteName = "Justine Jude Cuevas";
export const email = "justinecuevas19@gmail.com";
export const github = "https://github.com/Syddl";
export const linkedin = "https://www.linkedin.com/in/justinejudecuevas";
export const personId = `${siteUrl}/#person`;
