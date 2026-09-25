/**
 * Calendar export for a confirmed booking.
 *
 * Produces an RFC 5545 VEVENT (Apple Calendar, Outlook, Thunderbird, and
 * anything else that eats .ics) and a Google Calendar template URL. Both are
 * built from the customer's actual selections — service, barber, date and
 * time — so the event that lands in their calendar matches the appointment
 * they booked.
 *
 * All timestamps are emitted in UTC. The shop's wall clock is SAST, a fixed
 * UTC+2 with no daylight saving, so a 15:00 booking becomes 13:00Z and every
 * client renders it back as 15:00 in Cape Town.
 */

import { formatDuration, formatPrice } from "./services"
import { formatLongDate, formatTime12h, localToUtc, type ResolvedBooking } from "./booking"
import { shop, shortAddress } from "./shop"

/**
 * The subset of a booking a calendar event actually needs. A
 * `ResolvedBooking` satisfies it, and so does the payload decoded from the
 * .ics download link — which carries no contact details.
 */
export type CalendarEvent = Pick<
  ResolvedBooking,
  "reference" | "service" | "barberName" | "date" | "time" | "endTime" | "name" | "notes"
>

/** `20260925T130000Z` */
function icsStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** RFC 5545 §3.3.11 — escape the TEXT value type. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

/**
 * RFC 5545 §3.1 — fold content lines at 75 octets. Folding is measured in
 * bytes, not characters, so a multi-byte character is never split in half.
 */
function foldLine(line: string): string {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 75) return line

  const parts: string[] = []
  let current = ""
  let currentBytes = 0
  // First line allows 75 octets; continuations are prefixed with a space.
  let limit = 75

  for (const char of line) {
    const size = new TextEncoder().encode(char).length
    if (currentBytes + size > limit) {
      parts.push(current)
      current = ""
      currentBytes = 0
      limit = 74
    }
    current += char
    currentBytes += size
  }
  if (current) parts.push(current)

  return parts.join("\r\n ")
}

function eventTimes(booking: CalendarEvent): { start: Date; end: Date } {
  const start = localToUtc(booking.date, booking.time)
  return { start, end: new Date(start.getTime() + booking.service.duration * 60_000) }
}

/** The human-readable body shared by every calendar target. */
function describe(booking: CalendarEvent): string {
  const lines = [
    `Appointment at ${shop.name}`,
    "",
    `Service:   ${booking.service.name}`,
    `Barber:    ${booking.barberName}`,
    `When:      ${formatLongDate(booking.date)} at ${formatTime12h(booking.time)} (SAST)`,
    `Duration:  ${formatDuration(booking.service.duration)} (until ${formatTime12h(booking.endTime)})`,
    `Price:     ${formatPrice(booking.service.price)}`,
    `Booked by: ${booking.name}`,
    `Reference: ${booking.reference}`,
  ]

  if (booking.notes) lines.push("", `Your notes: ${booking.notes}`)

  lines.push(
    "",
    `Where: ${shortAddress}`,
    `Questions or need to reschedule? Call ${shop.phone} or email ${shop.email}.`,
    "Please arrive five minutes early. Rescheduling is free up to 12 hours before your appointment.",
  )

  return lines.join("\n")
}

export function buildIcs(booking: CalendarEvent, now: Date = new Date()): string {
  const { start, end } = eventTimes(booking)

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${shop.name}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.reference}@barbrabarber.co.za`,
    `DTSTAMP:${icsStamp(now)}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${escapeText(`${booking.service.name} at ${shop.name}`)}`,
    `DESCRIPTION:${escapeText(describe(booking))}`,
    `LOCATION:${escapeText(`${shop.name}, ${shortAddress}`)}`,
    `ORGANIZER;CN=${escapeText(shop.name)}:mailto:${shop.email}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "SEQUENCE:0",
    // A nudge an hour ahead, so the appointment isn't a surprise.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`${booking.service.name} at ${shop.name} in 1 hour`)}`,
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return lines.map(foldLine).join("\r\n") + "\r\n"
}

export function googleCalendarUrl(booking: CalendarEvent): string {
  const { start, end } = eventTimes(booking)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${booking.service.name} at ${shop.name}`,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    details: describe(booking),
    location: `${shop.name}, ${shortAddress}`,
    // Deliberately no `ctz`: `dates` is already UTC (Z-suffixed). Sending
    // both makes Google read the UTC stamps as local and shift the event.
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function outlookCalendarUrl(booking: CalendarEvent): string {
  const { start, end } = eventTimes(booking)
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `${booking.service.name} at ${shop.name}`,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: describe(booking),
    location: `${shop.name}, ${shortAddress}`,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Link to the server route that streams the .ics with the right headers.
 *
 * Serving the file from the server rather than a client-side Blob matters on
 * iOS: Safari hands a `text/calendar` response straight to Apple Calendar,
 * where a blob: URL would just sit in Downloads.
 */
export function icsDownloadUrl(booking: CalendarEvent): string {
  const payload = {
    r: booking.reference,
    s: booking.service.id,
    b: booking.barberName,
    d: booking.date,
    t: booking.time,
    n: booking.name,
    no: booking.notes ?? "",
  }
  const json = JSON.stringify(payload)
  // base64url, so the value survives a query string untouched. `btoa` rather
  // than `Buffer` because this module is imported by client components too.
  const base64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)))
  const urlSafe = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  return `/api/calendar?b=${urlSafe}`
}

/** Shape carried in the `b` parameter of an .ics download link. */
export type IcsPayload = {
  r: string
  s: string
  b: string
  d: string
  t: string
  n: string
  no?: string
}

export const icsFileName = (booking: CalendarEvent): string =>
  `barbra-barber-${booking.date}-${booking.time.replace(":", "")}.ics`
