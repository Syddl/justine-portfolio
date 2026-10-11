import { test } from "node:test";
import assert from "node:assert/strict";
import { nextTheme, savedTheme, themeScript } from "./theme.js";

test("savedTheme accepts only light or dark", () => {
  assert.equal(savedTheme("light"), "light");
  assert.equal(savedTheme("dark"), "dark");
  assert.equal(savedTheme(null), null);
  assert.equal(savedTheme(undefined), null);
  assert.equal(savedTheme("system"), null);
});

test("nextTheme flips a saved choice, whatever the OS says", () => {
  assert.equal(nextTheme("dark", false), "light");
  assert.equal(nextTheme("dark", true), "light");
  assert.equal(nextTheme("light", true), "dark");
  assert.equal(nextTheme("light", false), "dark");
});

test("with no saved choice, nextTheme flips the OS theme", () => {
  assert.equal(nextTheme(undefined, true), "light");
  assert.equal(nextTheme(null, false), "dark");
  assert.equal(nextTheme("bogus", true), "light");
});

// Runs the real inline script against a fake document and localStorage.
const runHeadScript = (storage) => {
  const root = { dataset: {} };
  new Function("document", "localStorage", themeScript)(
    { documentElement: root },
    storage,
  );
  return root.dataset.theme;
};

test("the head script pins a saved theme and ignores anything else", () => {
  assert.equal(runHeadScript({ getItem: () => "dark" }), "dark");
  assert.equal(runHeadScript({ getItem: () => "light" }), "light");
  assert.equal(runHeadScript({ getItem: () => null }), undefined);
  assert.equal(runHeadScript({ getItem: () => "purple" }), undefined);
});

test("the head script survives blocked storage", () => {
  const blocked = {
    getItem: () => {
      throw new Error("SecurityError");
    },
  };
  assert.equal(runHeadScript(blocked), undefined);
});
