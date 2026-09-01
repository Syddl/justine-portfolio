import HeroSection from "@/component/HeroSection";
import ServicesSection from "@/component/ServicesSection";
import ProjectSection from "@/component/ProjectSection";
import ProcessSection from "@/component/ProcessSection";
import TestimonialsSection from "@/component/TestimonialsSection";
import AboutMeSection from "@/component/AboutMeSection";
import ExperienceSection from "@/component/ExperienceSection";
import TechStackSection from "@/component/TechStackSection";
import FinalCtaSection from "@/component/FinalCtaSection";
import { pageMetadata } from "@/lib/seo";

// Server component on purpose: the hero (and the full name in it) must be in
// the initial HTML, not gated behind hydration. The entrance animation is the
// CSS `.page-enter` keyframe; framer-motion stays in below-fold sections.
// Section order: outcome → offer → proof → process → human → ask.
export const metadata = pageMetadata({
  title: "Justine Jude Cuevas — Freelance Full Stack Developer",
  description:
    "Justine Jude Cuevas is a freelance full-stack developer in the Philippines building web apps, dashboards, and AI tools for startups and small businesses.",
  path: "/",
  absolute: true,
});

export default function Home() {
  return (
    <main className="page-enter flex-grow mx-auto max-w-3xl w-full p-6 pb-6 pt-5 sm:px-6 lg:pt-15 mb-10">
      <HeroSection />
      <ServicesSection />
      <ProjectSection />
      <ProcessSection />
      <TestimonialsSection />
      <AboutMeSection />
      <ExperienceSection />
      <TechStackSection />
      <FinalCtaSection />
    </main>
  );
}
