import { test } from "node:test";
import assert from "node:assert/strict";
import { stackGroups } from "./stackdata.js";
import { projects, upcomingProjects } from "./projects.js";
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

// The project row shows `kind` on the right ("Personal product"), so every
// project needs a short one.
test("every project has a short kind for its row", () => {
  for (const project of projects) {
    assert.equal(typeof project.kind, "string", `${project.slug} has no kind`);
    assert.ok(project.kind.length > 0 && project.kind.length <= 24, `${project.slug}: "${project.kind}"`);
  }
});

// An upcoming project is a row only. A slug would promise a case study that
// does not exist, and a stack would credit unshipped work in the stack
// section ("Everything here is in something I've shipped").
test("upcoming projects are rows only: name, short kind, summary, no slug or stack", () => {
  assert.ok(Array.isArray(upcomingProjects), "upcomingProjects is not exported from projects.js");
  const shipped = new Set(projects.map((project) => project.name));
  for (const project of upcomingProjects) {
    assert.ok(project.name && project.summary, `${project.name ?? "an entry"} needs a name and a summary`);
    assert.ok(project.kind?.length > 0 && project.kind.length <= 24, `${project.name}: "${project.kind}"`);
    assert.equal(project.slug, undefined, `${project.name} has a slug but no case study`);
    assert.equal(project.stack, undefined, `${project.name} would credit unshipped work in the stack section`);
    assert.ok(!shipped.has(project.name), `${project.name} is listed as both shipped and upcoming`);
  }
});
