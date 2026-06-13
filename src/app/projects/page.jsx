import { pageMetadata } from "@/lib/seo";
import ProjectsView from "./ProjectsView";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "A selection of full stack projects by Justine Jude Cuevas, including QuizyLite, StaffTrackr, and ExpenSync, built with Next.js, React, TypeScript, and Tailwind CSS.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsView />;
}
