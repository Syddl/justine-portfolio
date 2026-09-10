import { pageMetadata } from "@/lib/seo";
import ContactView from "./ContactView";

export const metadata = pageMetadata({
  title: "Hire a Freelance Full Stack Developer | Justine Jude Cuevas",
  description:
    "Hire Justine Jude Cuevas, a freelance full-stack developer from the Philippines, for web apps, dashboards, and AI tools. Remote worldwide, replies within 24 hours.",
  path: "/contact",
  absolute: true,
});

export default function ContactPage() {
  return <ContactView />;
}
