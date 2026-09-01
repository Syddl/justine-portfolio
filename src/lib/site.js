// Single source of truth for site identity. Every file that needs the
// canonical URL, name, or social links imports from here — never hard-code
// these elsewhere (they were previously duplicated across four files, which
// made changing the domain error-prone).
export const siteUrl = "https://justinecuevas.me";
export const siteName = "Justine Jude Cuevas";
export const email = "justinecuevas19@gmail.com";
export const github = "https://github.com/Syddl";
export const linkedin = "https://www.linkedin.com/in/justinejudecuevas";
export const personId = `${siteUrl}/#person`;
