import { z } from "zod"

import { ANY_BARBER, barberById, barberLabel } from "./barbers"
import { serviceById, type Service } from "./services"
import { BOOKING_WINDOW_DAYS, openingHours, shop } from "./shop"

/** Granularity of the time-slot grid, in minutes. */
export const SLOT_INTERVAL_MINUTES = 15

// ── Validation ────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  serviceId: z.string().refine((id) => Boolean(serviceById(id)), {
    message: "Please choose a service.",
  }),
  barberId: z.string().refine((id) => id === ANY_BARBER || Boolean(barberById(id)), {
    message: "Please choose a barber.",
  }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date."),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please choose a time."),
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  email: z.email("Please enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Please enter a contact number.")
    .max(20)
    .regex(/^[+\d][\d\s()-]*$/, "Please enter a valid contact number."),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

export type BookingInput = z.infer<typeof bookingSchema>

/** A validated booking plus the server-issued reference. */
export type Booking = BookingInput & { reference: string }

/**
 * Cross-field checks that the shape-level schema can't express: the slot has
 * to be inside the booking window, on a trading day, and long enough for the
 * chosen service to finish before closing time.
 */
export function validateSlot(input: BookingInput): string | null {
  const service = serviceById(input.serviceId)
  if (!service) return "Please choose a service."

  const start = localToUtc(input.date, input.time)
  if (Number.isNaN(start.getTime())) return "Please choose a valid date and time."

  const now = new Date()
  if (start.getTime() < now.getTime()) {
    return "That appointment time has already passed. Please choose another slot."
  }

  const horizon = new Date(now.getTime() + BOOKING_WINDOW_DAYS * 86_400_000)
  if (start.getTime() > horizon.getTime()) {
    return `We only take bookings up to ${BOOKING_WINDOW_DAYS} days ahead.`
  }

  const hours = openingHours[dayOfWeekInShopZone(input.date)]
  if (!hours) return "We're closed that day. Please pick another date."

  const startMinutes = toMinutes(input.time)
  if (startMinutes < toMinutes(hours.open)) {
    return `We open at ${hours.open} on that day.`
  }
  if (startMinutes + service.duration > toMinutes(hours.close)) {
    return `That appointment wouldn't finish before we close at ${hours.close}. Please choose an earlier slot.`
  }

  return null
}

// ── Time helpers ──────────────────────────────────────────────────────────
//
// Every timestamp the site produces is anchored to the shop's wall clock
// (SAST, a fixed UTC+2), never to the visitor's device clock. A customer
// browsing from London still books 15:00 Cape Town time.

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export const toHHMM = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/** Convert a shop-local date + time into the true UTC instant. */
export function localToUtc(dateISO: string, timeHHMM: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number)
  const [hh, mm] = timeHHMM.split(":").map(Number)
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - shop.utcOffsetMinutes * 60_000)
}

/**
 * Day index (0 = Sunday) for a calendar date, read as a plain date rather
 * than an instant so it can't drift across a timezone boundary.
 */
export function dayOfWeekInShopZone(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** Today's date in the shop's timezone, as YYYY-MM-DD. */
export function todayInShopZone(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() + shop.utcOffsetMinutes * 60_000)
  return shifted.toISOString().slice(0, 10)
}

/** Current wall-clock minutes-since-midnight in the shop's timezone. */
export function nowMinutesInShopZone(now: Date = new Date()): number {
  const shifted = new Date(now.getTime() + shop.utcOffsetMinutes * 60_000)
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes()
}

export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/** "Friday, 25 September 2026" — formatted without relying on device locale. */
export function formatLongDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number)
  const weekday = WEEKDAYS[dayOfWeekInShopZone(dateISO)]
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`
}

/** "Fri 25 Sep" — the compact form used on the date picker chips. */
export function formatShortDate(dateISO: string): string {
  const [, m, d] = dateISO.split("-").map(Number)
  const weekday = WEEKDAYS[dayOfWeekInShopZone(dateISO)].slice(0, 3)
  return `${weekday} ${d} ${MONTHS[m - 1].slice(0, 3)}`
}

/** "3:00 PM" — the brief's own example format. */
export function formatTime12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  const period = h < 12 ? "AM" : "PM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

export function endTimeOf(timeHHMM: string, durationMinutes: number): string {
  return toHHMM(toMinutes(timeHHMM) + durationMinutes)
}

// ── Slot availability ─────────────────────────────────────────────────────

/**
 * Deterministic pseudo-random in [0, 1) from a string.
 *
 * Used to mark a realistic scattering of slots as already taken. It must be
 * deterministic so the server and the client agree — a `Math.random()` here
 * would cause a hydration mismatch and a different answer on every render.
 */
function hashUnit(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10_000) / 10_000
}

export function isSlotTaken(dateISO: string, time: string, barberId: string): boolean {
  return hashUnit(`${dateISO}|${time}|${barberId}`) < 0.28
}

export type Slot = { time: string; available: boolean }

/**
 * Every slot the shop could seat this service in on this date, flagged with
 * whether it's still open. Slots in the past, or too late for the service to
 * finish before closing, are excluded entirely rather than shown as taken.
 */
export function slotsFor(dateISO: string, service: Service, barberId: string, now = new Date()): Slot[] {
  const hours = openingHours[dayOfWeekInShopZone(dateISO)]
  if (!hours) return []

  const open = toMinutes(hours.open)
  const close = toMinutes(hours.close)
  const isToday = dateISO === todayInShopZone(now)
  // Don't offer a slot that starts within the next half hour.
  const earliest = isToday ? nowMinutesInShopZone(now) + 30 : 0

  const slots: Slot[] = []
  for (let m = open; m + service.duration <= close; m += SLOT_INTERVAL_MINUTES) {
    if (m < earliest) continue
    const time = toHHMM(m)
    slots.push({ time, available: !isSlotTaken(dateISO, time, barberId) })
  }
  return slots
}

// ── Reference codes ───────────────────────────────────────────────────────

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no I/O/0/1

/** e.g. "BB-7K2M9Q" — short enough to read out over the phone. */
export function createBookingReference(): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  const code = Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join("")
  return `BB-${code}`
}

// ── Display ───────────────────────────────────────────────────────────────

export type ResolvedBooking = {
  reference: string
  service: Service
  barberName: string
  date: string
  time: string
  endTime: string
  name: string
  email: string
  phone: string
  notes?: string
}

/** Turn the raw ids on a booking into the labels every surface renders. */
export function resolveBooking(booking: Booking): ResolvedBooking | null {
  const service = serviceById(booking.serviceId)
  if (!service) return null

  return {
    reference: booking.reference,
    service,
    barberName: barberLabel(booking.barberId),
    date: booking.date,
    time: booking.time,
    endTime: endTimeOf(booking.time, service.duration),
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    notes: booking.notes || undefined,
  }
}
