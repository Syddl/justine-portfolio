import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Parses the light-dark() colour tokens out of globals.css and checks WCAG
// AA contrast (4.5:1) for every text token on every background, in both
// themes. \r is stripped so a CRLF checkout parses the same as LF.
const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8").replace(/\r/g, "");

const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
    ),
  ].map(([, name, light, dark]) => [name, { light, dark }]),
);

const luminance = (hex) => {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((h) => {
      const c = parseInt(h, 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TEXT = ["ink", "ink-2", "body", "muted", "accent"];
const BACKGROUNDS = ["bg", "surface", "hover"];

test("the contrast maths matches known WCAG values", () => {
  assert.equal(contrast("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(contrast("#777777", "#ffffff").toFixed(2), "4.48");
});

test("every token the check reads is a light-dark(#rrggbb, #rrggbb) pair", () => {
  for (const name of [...TEXT, ...BACKGROUNDS]) {
    assert.ok(tokens[name], `--${name} is missing or not a light-dark() hex pair`);
  }
});

test("text tokens reach 4.5:1 on every background in both themes", () => {
  for (const theme of ["light", "dark"]) {
    for (const text of TEXT) {
      for (const bg of BACKGROUNDS) {
        const ratio = contrast(tokens[text][theme], tokens[bg][theme]);
        assert.ok(ratio >= 4.5, `${theme}: --${text} on --${bg} is ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
