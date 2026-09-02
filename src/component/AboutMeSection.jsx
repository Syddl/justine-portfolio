import { inter } from "@/app/fonts";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import ProofBlock from "@/component/ProofBlock";

// Copy here shares no phrase with the hero (who/what) or Experience (the job
// itself): this is about how the work gets done.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading eyebrow="about" title="About me" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div
          className={`${inter.className} md:col-span-3 text-[#A8ADB2] space-y-4 leading-relaxed`}
        >
          <p>
            Most of my week goes into production software where &quot;works on
            my machine&quot; isn&apos;t good enough: payments, media pipelines,
            and the failures that only show up once real users arrive.
          </p>
          <p>
            That habit carries into client work. We agree on scope before I
            write code, you see a working demo every week, and what ships is
            built to survive real data. If something important in your
            business still runs on a spreadsheet, or an idea needs to become a
            product, tell me about it.
          </p>
        </div>

        <div className="md:col-span-2">
          <ProofBlock />
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
