"use client"

import Link from "next/link"

import {
  AppleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon,
  GoogleIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons"
import {
  formatLongDate,
  formatTime12h,
  resolveBooking,
  type Booking,
} from "@/lib/booking"
import {
  googleCalendarUrl,
  icsDownloadUrl,
  outlookCalendarUrl,
} from "@/lib/calendar"
import { formatDuration, formatPrice } from "@/lib/services"
import { directionsUrl, fullAddress, shop } from "@/lib/shop"

/**
 * Post-booking screen.
 *
 * The calendar links are generated from this specific booking — service,
 * barber, date, start and end time all come from what the customer chose, so
 * no two confirmations produce the same event.
 */
export function BookingConfirmation({ booking }: { booking: Booking }) {
  const resolved = resolveBooking(booking)

  if (!resolved) {
    return (
      <div className="card-light p-8 text-center">
        <p>
          Your booking was received, but we couldn&apos;t render the summary. Please call us on{" "}
          <a href={`tel:${shop.phoneHref}`} className="font-semibold underline">
            {shop.phone}
          </a>{" "}
          quoting <strong>{booking.reference}</strong>.
        </p>
      </div>
    )
  }

  const icsHref = icsDownloadUrl(resolved)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-700">
          <CheckCircleIcon className="h-9 w-9" />
        </span>
        <h2 className="display-2 mt-6">You&apos;re booked in.</h2>
        <p className="mt-4 text-muted-dark">
          Thanks {resolved.name.split(" ")[0]} — we&apos;ve got you down and sent a confirmation to{" "}
          <span className="font-semibold text-ink">{resolved.email}</span>.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-200 px-5 py-2 text-sm">
          <span className="text-muted-dark">Booking reference</span>
          <strong className="tracking-[0.12em]">{resolved.reference}</strong>
        </p>
      </div>

      {/* Appointment card */}
      <div className="card-light mt-10 overflow-hidden">
        <div className="bg-ink px-7 py-6 text-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Your appointment
          </p>
          <p className="mt-3 font-display text-2xl font-bold">{resolved.service.name}</p>
          <p className="mt-1 text-muted">with {resolved.barberName}</p>
        </div>

        <dl className="divide-y divide-cream-300">
          <Row Icon={CalendarIcon} label="Date">
            {formatLongDate(resolved.date)}
          </Row>
          <Row Icon={ClockIcon} label="Time">
            {formatTime12h(resolved.time)} – {formatTime12h(resolved.endTime)}{" "}
            <span className="font-normal text-muted-dark">
              ({formatDuration(resolved.service.duration)}, SAST)
            </span>
          </Row>
          <Row Icon={MapPinIcon} label="Where">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {fullAddress}
            </a>
          </Row>
          <Row Icon={PhoneIcon} label="Total">
            {formatPrice(resolved.service.price)}{" "}
            <span className="font-normal text-muted-dark">— payable at the shop</span>
          </Row>
        </dl>
      </div>

      {/* Calendar */}
      <section className="mt-8 rounded-card border-2 border-gold/40 bg-gold/5 p-7">
        <h3 className="font-display text-xl font-bold">Add it to your calendar</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-dark">
          So you don&apos;t forget. The event carries your service, barber, exact start and end
          time, our address and your reference.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={googleCalendarUrl(resolved)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark bg-white"
          >
            <GoogleIcon className="h-4 w-4" />
            Google Calendar
          </a>

          <a href={icsHref} download className="btn btn-outline-dark bg-white">
            <AppleIcon className="h-4 w-4" />
            Apple Calendar
          </a>

          <a
            href={outlookCalendarUrl(resolved)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark bg-white"
          >
            <CalendarIcon className="h-4 w-4" />
            Outlook
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-dark">
          Using something else?{" "}
          <a href={icsHref} download className="inline-flex items-center gap-1 font-semibold underline underline-offset-4">
            <DownloadIcon className="h-3.5 w-3.5" />
            Download the .ics file
          </a>{" "}
          — it works with any calendar app.
        </p>
      </section>

      {/* What happens next */}
      <section className="mt-8 rounded-card bg-cream-200 p-7">
        <h3 className="font-display text-xl font-bold">What happens next</h3>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-dark">
          <li className="flex gap-3">
            <span className="font-display font-bold text-gold-700">1.</span>
            A confirmation email is on its way to {resolved.email}, with everything above.
          </li>
          <li className="flex gap-3">
            <span className="font-display font-bold text-gold-700">2.</span>
            We&apos;ll send a reminder the day before by SMS to {resolved.phone}.
          </li>
          <li className="flex gap-3">
            <span className="font-display font-bold text-gold-700">3.</span>
            Arrive about five minutes early so we can start on time. Need to move it? Call{" "}
            <a href={`tel:${shop.phoneHref}`} className="font-semibold text-ink underline underline-offset-4">
              {shop.phone}
            </a>{" "}
            — free up to 12 hours before.
          </li>
        </ol>
      </section>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn btn-outline-dark">
          Back to Home
        </Link>
        {/* A full navigation, not a client-side one — it has to remount the
            wizard so the next booking starts from a clean slate. */}
        <a href="/book" className="btn btn-ghost-dark">
          Book another appointment
        </a>
      </div>
    </div>
  )
}

function Row({
  Icon,
  label,
  children,
}: {
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 px-7 py-5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
      <dt className="w-20 shrink-0 text-sm text-muted-dark">{label}</dt>
      <dd className="flex-1 text-sm font-semibold">{children}</dd>
    </div>
  )
}
