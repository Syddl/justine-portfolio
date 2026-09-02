// Single source of truth for availability + the primary CTA.
// Edit this file only - the hero badge and every CTA button read from here.
//
// `note`: keep it concrete when you can ("Booking projects for October")
// - a dated note reads more professional than a bare "open to work".
// `ctaHref`: point this at a Cal.com/Calendly link later to turn every
// primary CTA into a booking button in one edit.
// `hours`: optional { start, end } in Manila 24h time. When set, the contact
// page's timezone line adds "online 09:00-21:00 Manila (…your time)". Leave
// it out rather than guess.
export const availability = {
  open: true,
  note: "Open for new projects",
  ctaLabel: "Start a project",
  ctaHref: "/contact",
};
