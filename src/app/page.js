import HeroSection from "@/component/HeroSection";
import TestimonialsSection from "@/component/TestimonialsSection";
import AboutMeSection from "@/component/AboutMeSection";
import ExperienceSection from "@/component/ExperienceSection";
import TechStackSection from "@/component/TechStackSection";
import ProjectSection from "@/component/ProjectSection";
import FinalCtaSection from "@/component/FinalCtaSection";
import { pageMetadata } from "@/lib/seo";
import { personId } from "@/lib/site";

// Server component on purpose: the hero (and the full name in it) must be in
// the initial HTML, not gated behind hydration. The entrance animation is the
// CSS `.page-enter` keyframe; framer-motion stays in below-fold sections.
// Selected work sits last, right before the closing call to action.
export const metadata = pageMetadata({
  title: "Justine Jude Cuevas | Freelance Full Stack Developer",
  description:
    "Justine Jude Cuevas is a freelance full-stack developer in the Philippines building web apps, dashboards, and AI tools for startups and small businesses.",
  path: "/",
  absolute: true,
});

// ProfilePage is Google-documented structured data for personal sites: it
// tells crawlers this page is about the Person entity defined in the layout.
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: { "@id": personId },
  dateModified: "2026-09-01",
};

export default function Home() {
  return (
    <main className="page-enter flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <HeroSection />
      <TestimonialsSection />
      <AboutMeSection />
      <ExperienceSection />
      <TechStackSection />
      <ProjectSection />
      <FinalCtaSection />
    </main>
  );
}
