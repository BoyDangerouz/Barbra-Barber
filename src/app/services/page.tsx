import type { Metadata } from "next"

import { CtaBand } from "@/components/cta-band"
import { CheckCircleIcon, ClockIcon, SparkleIcon } from "@/components/icons"
import { PageHero } from "@/components/page-hero"
import { ServicesExplorer } from "@/components/services-explorer"
import { services } from "@/lib/services"

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Haircuts, fades, beard trims, hot towel shaves, kids cuts, natural hair treatments and packages at Barbra Barber in Cape Town. Full price list and online booking.",
  alternates: { canonical: "/services" },
}

const goodToKnow = [
  {
    Icon: ClockIcon,
    title: "Times are honest",
    body: "Every price shows the full time the chair is held for you. We don't double-book, so your appointment starts when it says it does.",
  },
  {
    Icon: SparkleIcon,
    title: "Consultation included",
    body: "Every service starts with a proper conversation about what you want and what will actually work with your hair.",
  },
  {
    Icon: CheckCircleIcon,
    title: "No surprise charges",
    body: "The price you see is the price you pay. Card, cash, SnapScan and EFT all welcome.",
  },
]

export default function ServicesPage() {
  const cheapest = Math.min(...services.map((s) => s.price))
  const dearest = Math.max(...services.map((s) => s.price))

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Quality grooming for every style, every texture, every person."
        lead={`${services.length} services from R${cheapest} to R${dearest}. Pick what you need, choose your barber, and we'll hold the chair.`}
      />

      <section className="section bg-cream">
        <div className="shell">
          <ServicesExplorer />
        </div>
      </section>

      <section className="border-t border-cream-300 bg-cream-200 py-16">
        <div className="shell grid gap-8 md:grid-cols-3">
          {goodToKnow.map(({ Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-8 w-8 text-gold-700" />
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-relaxed text-muted-dark">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Found the one? Let's get it booked."
        body="Choose your service and barber, pick a time that works, and add the appointment straight to your calendar."
      />
    </>
  )
}
