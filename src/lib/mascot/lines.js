// Everything Mini Justine says, approved by Justine verbatim. Spec:
// docs/superpowers/specs/2026-10-12-mascot-design.md. Pure, so node --test
// covers it.

// Shown in the server HTML, before the browser knows the visitor's hour.
export const FALLBACK_GREETING = "Hi! I'm Justine.";

// `hour` is the visitor's local hour, 0-23.
export const greeting = (hour) => {
  if (hour < 5) return "Up late too? I'm Justine.";
  if (hour < 12) return "Good morning! I'm Justine.";
  if (hour < 18) return "Good afternoon! I'm Justine.";
  return "Good evening! I'm Justine.";
};

// One per click, in order, looping.
export const CLICK_LINES = [
  "I'm Justine. Well, the pixel version.",
  "I got into code because of games.",
  "Before coding, I did graphic design.",
  "Right now I'm building LoreOS.",
  "When something grabs me, I lock in.",
  "Try the theme switch up top.",
  "Okay, okay. You can stop clicking now.",
];

// -1 means no click yet, so the first click shows line 0.
export const nextLineIndex = (index) => (index + 1) % CLICK_LINES.length;

export const THEME_LINES = {
  light: "Too bright!",
  dark: "Ahh, much better.",
};

// While the visitor holds Mini Justine up in the air.
export const HELD_LINE = "Whoa! Put me down!";

export const CAMEO_LINES = {
  typing: "Shipping something.",
  envelope: "Send me a message!",
};
