import { Figtree, Inter, JetBrains_Mono, Newsreader } from "next/font/google";

// Figtree is the site face. Newsreader italic is only for the accent word in
// the hero headline. JetBrains Mono is for the logo, dates, tags, the ASCII
// calendar and the code card. Each sets a CSS variable on <html>; globals.css
// maps Tailwind's font-sans, font-serif and font-mono onto them.
export const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: "italic",
  weight: "400",
  variable: "--font-newsreader",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
});

// Still imported by components until Task 8 of the redesign plan moves them
// to font-sans; deleted there.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
