import { NextResponse } from "next/server"

import {
  bookingSchema,
  createBookingReference,
  isSlotTaken,
  resolveBooking,
  validateSlot,
} from "@/lib/booking"

/**
 * Takes a booking.
 *
 * The client validates as you go, but nothing is trusted until it gets here:
 * the payload is re-parsed, the slot is re-checked against opening hours and
 * service duration, and the booking reference is issued server-side so it
 * can't be forged or replayed from the browser.
 *
 * There's no database behind this by design — the assessment brief asks for a
 * working booking experience, not a back office. Swapping the `console.info`
 * below for an insert and a confirmation email is the only change needed to
 * make it durable.
 */
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 })
  }

  const parsed = bookingSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form")
      fieldErrors[field] ??= issue.message
    }
    return NextResponse.json(
      { error: "Some details need another look.", fieldErrors },
      { status: 400 },
    )
  }

  const slotError = validateSlot(parsed.data)
  if (slotError) {
    return NextResponse.json({ error: slotError, fieldErrors: { time: slotError } }, { status: 409 })
  }

  if (isSlotTaken(parsed.data.date, parsed.data.time, parsed.data.barberId)) {
    const message = "That slot has just been taken. Please choose another time."
    return NextResponse.json({ error: message, fieldErrors: { time: message } }, { status: 409 })
  }

  const booking = { ...parsed.data, reference: createBookingReference() }
  const resolved = resolveBooking(booking)
  if (!resolved) {
    return NextResponse.json({ error: "That service is no longer available." }, { status: 409 })
  }

  console.info(
    `[booking] ${booking.reference} — ${resolved.service.name} with ${resolved.barberName} on ${booking.date} at ${booking.time}`,
  )

  return NextResponse.json({ booking }, { status: 201 })
}
