// The GitHub section's data. The pure helpers take data as arguments so they
// run under node --test without a token; fetchContributions is the only
// function that touches the network and it runs on the server.

export const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// GraphQL contributionCalendar -> { total, weeks: [[{ date, count, level }]] }
export function normalizeCalendar(calendar) {
  const weeks = (calendar?.weeks ?? []).map((week) =>
    (week.contributionDays ?? []).map((day) => ({
      date: day.date,
      count: day.contributionCount ?? 0,
      level: LEVELS[day.contributionLevel] ?? 0,
    })),
  );
  return { total: calendar?.totalContributions ?? 0, weeks };
}

// SVG geometry, in viewBox units.
export const CELL = 11;
export const GAP = 3;
export const STEP = CELL + GAP;

// One entry per day with its grid position. GitHub's first week starts on
// whatever weekday it was a year ago, so the row comes from the date, not
// from the day's index in the week.
export function calendarCells(weeks) {
  const cells = [];
  weeks.forEach((week, w) => {
    week.forEach((day) => {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      cells.push({ ...day, x: w * STEP, y: weekday * STEP });
    });
  });
  return cells;
}

export function calendarSize(weeks) {
  return { width: weeks.length * STEP - GAP, height: 7 * STEP - GAP };
}

// "5 contributions on 6 Sept": the native tooltip on each cell.
export function describeDay({ date, count }) {
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

// Needs GITHUB_TOKEN (a classic token with only read:user). Returns null,
// with a warning in the build log, whenever the calendar cannot be fetched,
// so the section hides itself instead of failing the build. Cached for six
// hours through Next's data cache (ISR on Vercel).
export async function fetchContributions(login) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN is not set; the GitHub section is hidden.");
    return null;
  }
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "justinecuevas.me",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 21600 },
    });
    if (!res.ok) {
      console.warn(`[github] GraphQL responded ${res.status}; the GitHub section is hidden.`);
      return null;
    }
    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      console.warn(
        "[github] no contribution calendar in the response; the GitHub section is hidden.",
        JSON.stringify(json?.errors ?? json).slice(0, 300),
      );
      return null;
    }
    return normalizeCalendar(calendar);
  } catch (err) {
    console.warn("[github] fetch failed; the GitHub section is hidden.", err?.message);
    return null;
  }
}
