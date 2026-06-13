import { pageMetadata } from "@/lib/seo";
import ContactView from "./ContactView";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Justine Jude Cuevas, a full stack developer from the Philippines available for freelance work and collaboration.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactView />;
}
