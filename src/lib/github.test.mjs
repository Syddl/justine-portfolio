import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CELL,
  GAP,
  STEP,
  calendarCells,
  calendarSize,
  describeDay,
  normalizeCalendar,
} from "./github.js";

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

test("calendarCells places columns by week and rows by weekday from the date", () => {
  const cells = calendarCells(normalizeCalendar(graphql).weeks);
  // 2026-09-04 is a Friday, 2026-09-06 a Sunday, 2026-09-07 a Monday.
  assert.deepEqual(
    cells.map(({ date, x, y }) => ({ date, x, y })),
    [
      { date: "2026-09-04", x: 0, y: 5 * STEP },
      { date: "2026-09-05", x: 0, y: 6 * STEP },
      { date: "2026-09-06", x: STEP, y: 0 },
      { date: "2026-09-07", x: STEP, y: STEP },
    ],
  );
});

test("calendarSize fits 53 weeks by 7 days with no trailing gap", () => {
  const weeks = Array.from({ length: 53 }, () => []);
  assert.deepEqual(calendarSize(weeks), {
    width: 53 * STEP - GAP,
    height: 7 * STEP - GAP,
  });
  assert.equal(STEP, CELL + GAP);
});

test("describeDay reads as a tooltip sentence", () => {
  assert.equal(describeDay({ date: "2026-09-04", count: 1 }), "1 contribution on 4 Sept");
  assert.equal(describeDay({ date: "2026-09-06", count: 5 }), "5 contributions on 6 Sept");
});
