import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";
import DeveloperCard from "@/component/DeveloperCard";

// About the person, not the work: where the interest came from, what fills
// the days now, where it is heading. Projects and experience have their own
// sections. The full name is in the first sentence so it is in the server
// HTML for search. The code card sits under the text at full column width:
// side by side, the 640px column squeezed both.
const AboutMeSection = () => {
  return (
    <Reveal className="mb-20">
      <SectionHeading title="About me" />

      <div className="text-[17px] text-body leading-relaxed space-y-4">
        <p>
          I&apos;m Justine Jude Cuevas. Before I ever wrote code, I was into
          video games and anything tech. My first job was graphic design, and
          on the side I edited videos and made YouTube content.
        </p>
        <p>
          Games are what pulled me in. I got curious about how they, and the
          systems behind everyday apps, actually work, and I fell for it. Code
          meant I could build anything I wanted, and with AI in the loop I can
          build it a lot faster.
        </p>
        <p>
          These days most of my time goes to school and to learning, lately a
          deep dive into AI. I can be lazy about things that don&apos;t grab
          me, but when one does, I lock in until it&apos;s done.
        </p>
        <p>
          Looking ahead, I want to work as an AI engineer, building products
          people actually use. Want to talk shop, or just say hi? The inbox is
          open.
        </p>
      </div>

      <div className="mt-10">
        <DeveloperCard />
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
