"use client";

import { useSyncExternalStore } from "react";
import { jetbrainsMono } from "@/app/fonts";
import { availability } from "@/data/availability";
import {
  describeOffset,
  manilaMinusVisitor,
  onlineWindow,
} from "@/lib/timezone";

const TICK_MS = 60_000;

const clock = (date, timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);

// The wall clock is an external data source, not React state, so it is
// synced with useSyncExternalStore: the server (and the first client render,
// via getServerClockSnapshot) render the placeholder, then React swaps in
// the live clock right after hydration. Subscribers wake on the next minute
// boundary and every minute after, so the display never lags the real
// minute; the snapshot is the minute number, so React re-renders only when
// it changes.
const subscribeToClock = (onTick) => {
  let interval;
  const timeout = setTimeout(
    () => {
      onTick();
      interval = setInterval(onTick, TICK_MS);
    },
    TICK_MS - (Date.now() % TICK_MS),
  );
  return () => {
    clearTimeout(timeout);
    if (interval) clearInterval(interval);
  };
};
const getClockSnapshot = () => Math.floor(Date.now() / TICK_MS);
const getServerClockSnapshot = () => null;

// "Manila 22:14 · your time 16:14 · 6 h ahead", computed for whoever is
// looking. Renders placeholders until mounted so the server HTML and the
// first client render match.
const TimezoneLine = () => {
  const tick = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot,
  );
  // Derived from the committed snapshot rather than a fresh Date.now(), so
  // the render is pure and shows exactly the minute React committed.
  const now = tick === null ? null : new Date(tick * TICK_MS);

  const manila = now ? clock(now, "Asia/Manila") : "--:--";
  const local = now ? clock(now) : "--:--";
  const diff = now ? manilaMinusVisitor(now.getTimezoneOffset()) : null;

  return (
    <p className={`${jetbrainsMono.className} text-xs text-neutral-400`}>
      Manila <span className="text-neutral-200">{manila}</span>
      {" · "}your time <span className="text-neutral-200">{local}</span>
      {diff !== null && <>{" · "}{describeOffset(diff)}</>}
      {diff !== null && availability.hours && (
        <>{" · "}{onlineWindow(availability.hours, diff)}</>
      )}
    </p>
  );
};

export default TimezoneLine;
