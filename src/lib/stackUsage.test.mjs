import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStackUsage, sharesContext } from "./stackUsage.js";

const projects = [
  { name: "StaffTrackr", stack: ["Next.js", "Supabase"] },
  { name: "QuizyLite", stack: ["Next.js", "MongoDB"] },
];
const experience = [
  { usageLabel: "AI video platform", tech: ["Supabase", "FFmpeg"] },
  { tech: ["Photoshop"] },
];

test("maps each tool to the projects and jobs that use it, in data order", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.deepEqual(usage.get("Next.js"), ["StaffTrackr", "QuizyLite"]);
  assert.deepEqual(usage.get("Supabase"), ["StaffTrackr", "AI video platform"]);
  assert.deepEqual(usage.get("FFmpeg"), ["AI video platform"]);
});

test("skips jobs without a usageLabel and tools nobody uses", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.equal(usage.has("Photoshop"), false);
  assert.equal(usage.has("Firebase"), false);
});

test("does not repeat a context when a tool appears twice in it", () => {
  const usage = buildStackUsage({
    projects: [{ name: "Twice", stack: ["Zod", "Zod"] }],
    experience: [],
  });
  assert.deepEqual(usage.get("Zod"), ["Twice"]);
});

test("sharesContext is true only when two tools overlap somewhere", () => {
  const usage = buildStackUsage({ projects, experience });
  assert.equal(sharesContext(usage, "Next.js", "MongoDB"), true);
  assert.equal(sharesContext(usage, "MongoDB", "FFmpeg"), false);
  assert.equal(sharesContext(usage, "Next.js", "Firebase"), false);
});
