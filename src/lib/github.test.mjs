import { test } from "node:test";
import assert from "node:assert/strict";
import { calendarRows, describeDay, normalizeCalendar } from "./github.js";

const graphql = {
  totalContributions: 7,
  weeks: [
    {
      contributionDays: [
        { date: "2026-09-04", contributionCount: 0, contributionLevel: "NONE" },
        { date: "2026-09-05", contributionCount: 2, contributionLevel: "FIRST_QUARTILE" },
      ],
    },
    {
      contributionDays: [
        { date: "2026-09-06", contributionCount: 5, contributionLevel: "FOURTH_QUARTILE" },
        { date: "2026-09-07", contributionCount: 0, contributionLevel: "NONE" },
      ],
    },
  ],
};

test("normalizeCalendar keeps week and day order and maps levels to 0-4", () => {
  const { total, weeks } = normalizeCalendar(graphql);
  assert.equal(total, 7);
  assert.deepEqual(weeks, [
    [
      { date: "2026-09-04", count: 0, level: 0 },
      { date: "2026-09-05", count: 2, level: 1 },
    ],
    [
      { date: "2026-09-06", count: 5, level: 4 },
      { date: "2026-09-07", count: 0, level: 0 },
    ],
  ]);
});

test("normalizeCalendar tolerates a missing calendar", () => {
  assert.deepEqual(normalizeCalendar(null), { total: 0, weeks: [] });
});

test("calendarRows gives seven weekday rows, one column per week, blanks where a week has no such day", () => {
  const rows = calendarRows(normalizeCalendar(graphql).weeks);
  assert.equal(rows.length, 7);
  // 2026-09-04 is a Friday, 09-05 Saturday, 09-06 Sunday, 09-07 Monday.
  assert.deepEqual(rows.map((row) => row.map((day) => day?.date ?? null)), [
    [null, "2026-09-06"],
    [null, "2026-09-07"],
    [null, null],
    [null, null],
    [null, null],
    ["2026-09-04", null],
    ["2026-09-05", null],
  ]);
});

test("describeDay reads as a tooltip sentence", () => {
  assert.equal(describeDay({ date: "2026-09-04", count: 1 }), "1 contribution on 4 Sept");
  assert.equal(describeDay({ date: "2026-09-06", count: 5 }), "5 contributions on 6 Sept");
});
