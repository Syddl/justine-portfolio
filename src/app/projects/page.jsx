import { pageMetadata } from "@/lib/seo";
import ProjectsView from "./ProjectsView";

export const metadata = pageMetadata({
  title: "Projects & Case Studies",
  description:
    "Case studies of web apps built by Justine Jude Cuevas: QuizyLite, a Next.js and MongoDB study tool, and StaffTrackr, a Supabase workforce and payroll platform.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsView />;
}
