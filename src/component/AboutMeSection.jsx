import { inter } from "@/app/fonts";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import DeveloperCard from "@/component/DeveloperCard";

// About the person, not the CV: no employers, no school. Three short
// paragraphs so the text column sits level with the card beside it. The
// full name is in the first sentence so it is in the server HTML for search.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading eyebrow="about" title="About me" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-start md:items-center">
        <div
          className={`${inter.className} md:col-span-3 text-[#A8ADB2] leading-relaxed space-y-4`}
        >
          <p>
            I&apos;m Justine Jude Cuevas, a full-stack developer from the
            Philippines. I like taking an idea from a blank repo to something
            people actually use, and I&apos;m happiest owning the whole thing,
            interface to database.
          </p>
          <p>
            Right now that&apos;s QuizyLite, a study tool that turns PDF
            highlights into flashcards, plus a lot of learning in generative
            AI: pipelines that turn a script into a finished video, and the
            checks that catch a bad frame before anyone pays for it.
          </p>
          <p>
            I sweat the details without letting them slow things down, and I
            care how things look, not only whether they work. Want to talk
            shop, or just say hi? The inbox is open.
          </p>
        </div>

        <div className="md:col-span-2">
          <DeveloperCard />
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
