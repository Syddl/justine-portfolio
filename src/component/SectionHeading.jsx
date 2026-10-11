// One heading for every home section: a small muted label (still the
// section's h2) over a hairline, an optional right-aligned action such as
// "View all", and an optional lede. Server-safe: no hooks, no motion.
const SectionHeading = ({ title, lede, action, className = "mb-6" }) => {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-sm font-medium text-muted">{title}</h2>
        {action}
      </div>
      {lede && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-body">
          {lede}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
