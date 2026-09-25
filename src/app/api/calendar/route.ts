import { endTimeOf } from "@/lib/booking"
import { buildIcs, type CalendarEvent, type IcsPayload } from "@/lib/calendar"
import { serviceById } from "@/lib/services"

/**
 * Streams the customer's appointment as an .ics file.
 *
 * Served from the server rather than built as a Blob in the browser so the
 * response carries a real `text/calendar` content type — that's what makes
 * iOS hand the file straight to Apple Calendar instead of dropping it into
 * Downloads. Outlook and Thunderbird behave the same way.
 *
 * The booking travels in the `b` query parameter, base64url-encoded by
 * `icsDownloadUrl`.
 */
export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("b")
  if (!param) {
    return new Response("Missing booking details.", { status: 400 })
  }

  const payload = decode(param)
  if (!payload) {
    return new Response("That calendar link is not valid.", { status: 400 })
  }

  const service = serviceById(payload.s)
  if (!service) {
    return new Response("Unknown service.", { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.d) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(payload.t)) {
    return new Response("Invalid appointment date or time.", { status: 400 })
  }

  const event: CalendarEvent = {
    reference: payload.r,
    service,
    barberName: payload.b,
    date: payload.d,
    time: payload.t,
    endTime: endTimeOf(payload.t, service.duration),
    name: payload.n,
    notes: payload.no || undefined,
  }

  const fileName = `barbra-barber-${event.date}-${event.time.replace(":", "")}.ics`

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      // Appointment-specific and short-lived; never let a CDN hold onto it.
      "Cache-Control": "no-store",
    },
  })
}

function decode(param: string): IcsPayload | null {
  try {
    const base64 = param.replace(/-/g, "+").replace(/_/g, "/")
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const parsed = JSON.parse(new TextDecoder().decode(bytes))

    if (
      typeof parsed?.s !== "string" ||
      typeof parsed?.d !== "string" ||
      typeof parsed?.t !== "string"
    ) {
      return null
    }
    return parsed as IcsPayload
  } catch {
    return null
  }
}
