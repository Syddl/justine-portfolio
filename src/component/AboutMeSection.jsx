import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import DeveloperCard from "@/component/DeveloperCard";

// About the person, not the work: where the interest came from, what fills
// the days now, where it is heading. Projects and experience have their own
// sections. The full name is in the first sentence so it is in the server
// HTML for search. The code card sits beside the text on md and up, in a
// fixed 18rem track so its code never clips, and sticks beside the longer
// text column; on phones it sits under the text.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading title="About me" />

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-10">
        <div className="text-[17px] text-body leading-relaxed space-y-4">
          <p>
            I&apos;m Justine Jude Cuevas. Before I started coding, I was into
            video games and technology. I also explored graphic design, video
            editing, photography, and other creative fields.
          </p>
          <p>
            Gaming sparked my curiosity about how software works, and coding
            became a way to turn my ideas into reality. With AI, I can build
            those ideas faster than ever.
          </p>
          <p>
            These days, most of my time goes to school and learning, and lately
            that means a deep dive into AI. I can be lazy about things that
            don&apos;t grab me, but when one does, I lock in until it&apos;s
            done.
          </p>
          <p>
            Looking ahead, I want to work as an AI engineer, building products
            people actually use. Want to talk shop, or just say hi? The inbox is
            open.
          </p>
        </div>

        <div className="md:sticky md:top-24">
          <DeveloperCard />
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
