// Pure helpers behind the stack section's cross-highlight. Data comes in as
// arguments (not imported) so this is testable with `node --test` and fixture
// data. Tool names must match exactly across src/data/*.js.

// tool name -> ordered, de-duplicated list of contexts: project names first,
// then jobs that declare a `usageLabel`.
export function buildStackUsage({ projects = [], experience = [] }) {
  const usage = new Map();

  const add = (tool, context) => {
    const contexts = usage.get(tool) ?? [];
    if (!contexts.includes(context)) contexts.push(context);
    usage.set(tool, contexts);
  };

  for (const project of projects) {
    for (const tool of project.stack ?? []) add(tool, project.name);
  }
  for (const job of experience) {
    if (!job.usageLabel) continue;
    for (const tool of job.tech ?? []) add(tool, job.usageLabel);
  }

  return usage;
}

export function sharesContext(usage, a, b) {
  const contextsA = usage.get(a) ?? [];
  const contextsB = usage.get(b) ?? [];
  return contextsA.some((context) => contextsB.includes(context));
}
