import type { Metadata } from "next"
import { Suspense } from "react"

import { BookingWizard } from "@/components/booking/booking-wizard"
import { PageHero } from "@/components/page-hero"
import { openingHoursDisplay, shop } from "@/lib/shop"

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your cut, fade, beard trim or grooming package at Barbra Barber in Cape Town. Choose your service, barber, date and time — then add it straight to your calendar.",
  alternates: { canonical: "/book" },
}

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book Your Appointment"
        title="Four steps and the chair is yours."
        lead="Choose a service, pick your barber, find a time that works — and add the appointment to your calendar the moment it's confirmed."
      >
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          {openingHoursDisplay.map((row) => (
            <div key={row.days}>
              <dt className="text-muted">{row.days}</dt>
              <dd className="mt-1 font-semibold text-cream">{row.hours}</dd>
            </div>
          ))}
          <div>
            <dt className="text-muted">Prefer to call?</dt>
            <dd className="mt-1">
              <a href={`tel:${shop.phoneHref}`} className="font-semibold text-gold">
                {shop.phone}
              </a>
            </dd>
          </div>
        </dl>
      </PageHero>

      <section className="section bg-cream">
        <div className="shell">
          <Suspense fallback={<p className="text-muted-dark">Loading the booking form…</p>}>
            <BookingWizard />
          </Suspense>
        </div>
      </section>
    </>
  )
}
