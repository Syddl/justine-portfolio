"use client";

import { useState } from "react";
import Sprite from "@/component/mascot/Sprite";
import { CAMEO_LINES } from "@/lib/mascot/lines";

// Pose frames per cameo: typing alternates two frames, the envelope bobs.
const FRAMES = {
  typing: ["typingA", "typingB"],
  envelope: ["envelope"],
};

// Mini Justine standing on a section heading's hairline (pass it as the
// heading's `action`): typing in Tech stack, holding an envelope in Contact.
// Its line shows on hover or keyboard focus (CSS) and on tap (data-open),
// since touch has no hover.
const Cameo = ({ kind }) => {
  const [open, setOpen] = useState(false);
  const [first, second] = FRAMES[kind];
  const line = CAMEO_LINES[kind];
  const motion = second ? "mascot-typing" : "mascot-bob";

  return (
    <span className="mascot-cameo relative -mb-3 inline-flex" data-open={open}>
      <span
        aria-hidden="true"
        className="mascot-cameo-line absolute bottom-full right-0 mb-1 whitespace-nowrap rounded-card border border-line-strong bg-surface px-2.5 py-1 text-xs text-ink"
      >
        {line}
      </span>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        aria-label={`Mini Justine: ${line}`}
        className={`${motion} relative size-12`}
      >
        <Sprite pose={first} />
        {second && <Sprite pose={second} className="mascot-frame-b" />}
      </button>
    </span>
  );
};

export default Cameo;
