import { pageMetadata } from "@/lib/seo";
import { faqs } from "@/data/faq";
import ContactView from "./ContactView";

export const metadata = pageMetadata({
  title: "Hire a Freelance Full Stack Developer — Contact Justine",
  description:
    "Hire Justine Jude Cuevas, a freelance full-stack developer from the Philippines, for web apps, dashboards, and AI tools. Remote worldwide — replies within 24 hours.",
  path: "/contact",
  absolute: true,
});

// FAQPage markup no longer earns a visual rich result for most sites, but
// Google still parses it, and Q&A-formatted content is what AI answer
// engines quote — the data comes from the same file the accordion renders.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ContactView />
    </>
  );
}
