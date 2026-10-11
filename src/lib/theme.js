// Theme choice. Pure so node --test can cover it; ThemeToggle and the
// <head> script in layout.js both follow these rules.
//
// A saved choice ("light" or "dark" in localStorage) pins the theme. With
// none, the OS decides through `color-scheme: light dark` in globals.css.
export const THEME_KEY = "theme";

export const savedTheme = (value) =>
  value === "light" || value === "dark" ? value : null;

// The theme a click switches to: the opposite of the one showing now.
export const nextTheme = (saved, prefersDark) => {
  const current = savedTheme(saved) ?? (prefersDark ? "dark" : "light");
  return current === "dark" ? "light" : "dark";
};

// Inlined into <head> so a saved theme is applied before first paint and the
// other theme never flashes. Plain ES5 with no imports: it ships as a string.
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
