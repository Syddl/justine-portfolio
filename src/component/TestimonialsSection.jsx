import { inter } from "@/app/fonts";
import { testimonials } from "@/data/testimonials";
import Reveal from "@/component/motion/Reveal";
import SectionHeading from "@/component/SectionHeading";

// Renders nothing until src/data/testimonials.js has at least one real
// quote - then a single featured quote appears here. No grids of empty
// slots, no carousel of one.
const TestimonialsSection = () => {
  if (!testimonials.length) return null;

  const featured = testimonials[0];

  return (
    <Reveal className="mb-16">
      <SectionHeading eyebrow="testimonials" title="What clients say" />

      <figure className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 p-6">
        <blockquote
          className={`${inter.className} text-gray-100 text-lg leading-relaxed`}
        >
          &ldquo;{featured.quote}&rdquo;
        </blockquote>
        <figcaption
          className={`${inter.className} text-sm text-neutral-400 mt-4`}
        >
          <span className="text-neutral-200 font-medium">{featured.name}</span>
          {featured.role && <>, {featured.role}</>}
          {featured.href && featured.source && (
            <>
              {" · "}
              <a
                href={featured.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-neutral-700 hover:text-neutral-100 transition-colors"
              >
                via {featured.source}
              </a>
            </>
          )}
        </figcaption>
      </figure>
    </Reveal>
  );
};

export default TestimonialsSection;
