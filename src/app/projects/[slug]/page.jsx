import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";
import { siteUrl, personId } from "@/lib/site";
import CaseStudyView from "@/component/CaseStudyView";
import ScrollProgress from "@/component/ScrollProgress";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return pageMetadata({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/projects/${project.slug}`,
    absolute: true,
  });
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  // CreativeWork (not SoftwareApplication): no offers/ratings exist, so no
  // rich result is possible — the value is the entity association
  // "Justine Jude Cuevas built <project>" for search and AI answers.
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.tagline,
    url: project.live,
    image: `${siteUrl}${project.image}`,
    author: { "@id": personId },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkJsonLd),
        }}
      />
      <ScrollProgress />
      <CaseStudyView project={project} />
    </>
  );
}
