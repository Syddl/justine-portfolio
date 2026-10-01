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
            I&apos;m Justine Jude Cuevas, an AI full-stack engineer. I build
            products with LLMs inside them, and I&apos;m happiest owning the
            whole thing: the AI pipeline, the API, the database and the
            interface people use.
          </p>
          <p>
            Most recently I took an AI video platform from prototype to a
            pipeline that turned scripts into narrated avatar videos for real
            client jobs, with Claude vision checks and evals keeping the output
            right. I work agentic-first: Claude Code with my own skills, hooks
            and reviewer agent, and several agents in parallel when the work
            splits cleanly.
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
