import { test } from "node:test";
import assert from "node:assert/strict";
import {
  describeOffset,
  hhmm,
  manilaMinusVisitor,
  onlineWindow,
} from "./timezone.js";

test("manilaMinusVisitor converts getTimezoneOffset() minutes into hours ahead of the visitor", () => {
  assert.equal(manilaMinusVisitor(-120), 6); // Prague, summer
  assert.equal(manilaMinusVisitor(240), 12); // New York, summer
  assert.equal(manilaMinusVisitor(-480), 0); // Manila itself
  assert.equal(manilaMinusVisitor(-345), 2.25); // Kathmandu
  assert.equal(manilaMinusVisitor(-600), -2); // Brisbane
});

test("hhmm pads hours and turns fractional hours into minutes", () => {
  assert.equal(hhmm(9), "09:00");
  assert.equal(hhmm(9.5), "09:30");
  assert.equal(hhmm(21.75), "21:45");
  assert.equal(hhmm(0), "00:00");
});

test("describeOffset reads as hours and minutes, or same time zone", () => {
  assert.equal(describeOffset(0), "same time zone");
  assert.equal(describeOffset(6), "6 h ahead");
  assert.equal(describeOffset(2.25), "2 h 15 min ahead");
  assert.equal(describeOffset(-2), "2 h behind");
  assert.equal(describeOffset(0.75), "45 min ahead");
});

test("onlineWindow shifts Manila hours onto the visitor's clock and wraps past midnight", () => {
  const hours = { start: 9, end: 21 };
  assert.equal(
    onlineWindow(hours, 6),
    "online 09:00-21:00 Manila (03:00-15:00 your time)",
  );
  assert.equal(
    onlineWindow(hours, 11.5),
    "online 09:00-21:00 Manila (21:30-09:30 your time)",
  );
  assert.equal(
    onlineWindow(hours, -2),
    "online 09:00-21:00 Manila (11:00-23:00 your time)",
  );
});
