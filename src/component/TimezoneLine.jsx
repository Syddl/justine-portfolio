"use client";

import { useSyncExternalStore } from "react";
import { jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";

// Asia/Manila has no daylight saving, so a constant is safe.
const MANILA_OFFSET_HOURS = 8;
const TICK_MS = 60_000;

const clock = (date, timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);

// 9 -> "09:00", 9.5 -> "09:30"
const hhmm = (hours) =>
  `${String(Math.floor(hours)).padStart(2, "0")}:${hours % 1 ? "30" : "00"}`;

// `diff` is Manila minus the visitor, in hours.
const describeOffset = (diff) => {
  if (diff === 0) return "same time zone";
  const abs = Math.abs(diff);
  const n = Number.isInteger(abs) ? abs : abs.toFixed(1);
  return `${n} h ${diff > 0 ? "ahead" : "behind"}`;
};

const onlineWindow = (hours, diff) => {
  const toVisitor = (h) => (((h - diff) % 24) + 24) % 24;
  return `online ${hhmm(hours.start)}-${hhmm(hours.end)} Manila (${hhmm(
    toVisitor(hours.start),
  )}-${hhmm(toVisitor(hours.end))} your time)`;
};

// The wall clock is an external data source, not React state, so it is
// synced with useSyncExternalStore instead of a useEffect + setState pair:
// the server (and the first client render, via getServerClockSnapshot) both
// render the null placeholder, then React swaps in the live, ticking clock
// right after hydration - no manual mount-detection effect required.
const subscribeToClock = (onTick) => {
  const id = setInterval(onTick, TICK_MS);
  return () => clearInterval(id);
};
const getClockSnapshot = () => Math.floor(Date.now() / TICK_MS);
const getServerClockSnapshot = () => null;

// "Manila 22:14 · your time 16:14 · 6 h ahead", computed for whoever is
// looking. Renders placeholders until mounted so the server HTML and the
// first client render match, then ticks once a minute.
const TimezoneLine = () => {
  const tick = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot,
  );
  const now = tick === null ? null : new Date();

  const manila = now ? clock(now, "Asia/Manila") : "--:--";
  const local = now ? clock(now) : "--:--";
  const diff = now ? MANILA_OFFSET_HOURS + now.getTimezoneOffset() / 60 : null;

  return (
    <p className={`${jetbrainsMono.className} text-xs text-neutral-500`}>
      Manila <span className="text-neutral-300">{manila}</span>
      {" · "}your time <span className="text-neutral-300">{local}</span>
      {diff !== null && <>{" · "}{describeOffset(diff)}</>}
      {diff !== null && availability.hours && (
        <>{" · "}{onlineWindow(availability.hours, diff)}</>
      )}
    </p>
  );
};

export default TimezoneLine;
