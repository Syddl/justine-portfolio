import { pageMetadata } from "@/lib/seo";
import ContactView from "./ContactView";

export const metadata = pageMetadata({
  title: "Hire an AI Full-Stack Engineer | Justine Jude Cuevas",
  description:
    "Hire Justine Jude Cuevas, an AI full-stack engineer from the Philippines, for LLM features, AI automation and the web apps around them. Remote worldwide, replies within 24 hours.",
  path: "/contact",
  absolute: true,
});

export default function ContactPage() {
  return <ContactView />;
}
