import { siteUrl } from "@/lib/site";
import { projects } from "@/data/projects";

// Real content dates, not build time — stamping every deploy as "modified
// now" teaches crawlers to distrust the lastmod signal entirely. Bump these
// when a page's content meaningfully changes.
const contentUpdated = "2026-09-01";

export default function sitemap() {
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(contentUpdated),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(contentUpdated),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(contentUpdated),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const caseStudies = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudies];
}
