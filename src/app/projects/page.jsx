import { pageMetadata } from "@/lib/seo";
import ProjectsView from "./ProjectsView";

export const metadata = pageMetadata({
  title: "Projects & Case Studies",
  description:
    "Case studies by Justine Jude Cuevas: an agent harness for Claude Code, Codex and Gemini CLI; CooPilot, an IoT poultry monitoring system; and QuizyLite, a PDF study tool.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsView />;
}
