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
            people actually open, and I&apos;m happiest when I own the whole
            thing: the interface, the API, the database, and the unglamorous
            parts in between that decide whether it holds up.
          </p>
          <p>
            Right now that&apos;s QuizyLite, a study tool that turns PDF
            highlights into flashcards, and StaffTrackr, which replaced a
            payroll spreadsheet that kept breaking. Both are live, and both
            still get weekend commits.
          </p>
          <p>
            I also care about how things look, not only whether they work,
            which is why I lose hours to details most people never notice. If
            you want to talk shop, or just say hi, the inbox is open.
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
