import { test } from "node:test";
import assert from "node:assert/strict";
import { stackGroups } from "./stackdata.js";
import { projects } from "./projects.js";
import { experience } from "./experience.js";

// The stack section's cross-highlight looks tools up by exact name, so a
// typo in a project's stack or a job's tech silently drops the link.
test("every project and job tool is listed in the stack section", () => {
  const known = new Set(stackGroups.flatMap((group) => group.items.map((item) => item.name)));
  const used = [
    ...projects.flatMap((project) => project.stack),
    ...experience.flatMap((job) => job.tech ?? []),
  ];
  assert.deepEqual(used.filter((name) => !known.has(name)), []);
});

test("project slugs are unique", () => {
  const slugs = projects.map((project) => project.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
