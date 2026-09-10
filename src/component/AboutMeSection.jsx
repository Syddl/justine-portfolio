import { inter } from "@/app/fonts";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import DeveloperCard from "@/component/DeveloperCard";

// One paragraph about the person, nothing about employers or past jobs:
// those live in Experience. The full name sits in the first sentence so it
// is in the server HTML for search.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading eyebrow="about" title="About me" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <p
          className={`${inter.className} md:col-span-3 text-[#A8ADB2] leading-relaxed`}
        >
          I&apos;m Justine Jude Cuevas, a full-stack developer from General
          Santos City, Philippines. I like taking an idea from a blank repo to
          something people actually open. Right now that&apos;s QuizyLite, a
          study tool that turns PDF highlights into flashcards.
        </p>

        <div className="md:col-span-2">
          <DeveloperCard />
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
