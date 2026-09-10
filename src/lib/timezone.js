// Pure helpers behind the contact page's timezone line. Kept free of React
// and of Date.now() so they can be unit-tested with node --test.

// Asia/Manila has no daylight saving, so a constant is safe.
export const MANILA_OFFSET_HOURS = 8;

// Manila minus the visitor, in hours, from Date#getTimezoneOffset() (minutes
// behind UTC, positive west of Greenwich). Prague in summer (-120) -> 6,
// Kathmandu (-345) -> 2.25, Sydney in October (-660) -> -3.
export const manilaMinusVisitor = (timezoneOffsetMinutes) =>
  MANILA_OFFSET_HOURS + timezoneOffsetMinutes / 60;

// 9 -> "09:00", 9.5 -> "09:30", 21.75 -> "21:45"
export const hhmm = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// "6 h ahead", "2 h 15 min ahead", "45 min behind", "same time zone".
// `diff` is Manila minus the visitor, in hours.
export const describeOffset = (diff) => {
  if (diff === 0) return "same time zone";
  const abs = Math.abs(diff);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  const parts = [];
  if (h) parts.push(`${h} h`);
  if (m) parts.push(`${m} min`);
  return `${parts.join(" ")} ${diff > 0 ? "ahead" : "behind"}`;
};

// Shift Manila working hours onto the visitor's clock, wrapping past
// midnight.
export const onlineWindow = (hours, diff) => {
  const toVisitor = (h) => (((h - diff) % 24) + 24) % 24;
  return `online ${hhmm(hours.start)}-${hhmm(hours.end)} Manila (${hhmm(
    toVisitor(hours.start),
  )}-${hhmm(toVisitor(hours.end))} your time)`;
};
