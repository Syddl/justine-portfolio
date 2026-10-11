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
      <SectionHeading title="What clients say" />

      <figure className="rounded-card border border-line-strong bg-surface p-6">
        <blockquote
          className="text-ink text-lg leading-relaxed"
        >
          &ldquo;{featured.quote}&rdquo;
        </blockquote>
        <figcaption
          className="text-sm text-muted mt-4"
        >
          <span className="text-ink-2 font-medium">{featured.name}</span>
          {featured.role && <>, {featured.role}</>}
          {featured.href && featured.source && (
            <>
              {" · "}
              <a
                href={featured.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-line-strong hover:text-ink transition-colors"
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
