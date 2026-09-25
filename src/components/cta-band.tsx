import Link from "next/link"

import { ArrowRightIcon, CalendarIcon, PhoneIcon } from "@/components/icons"
import { shop } from "@/lib/shop"

/** Closing call to action, repeated at the foot of the content pages. */
export function CtaBand({
  title = "Ready for your best cut yet?",
  body = "Book online in under a minute. Choose your service, your barber and a time that suits you — then add it straight to your calendar.",
}: {
  title?: string
  body?: string
}) {
  return (
    <section className="on-ink bg-ink text-cream">
      <div className="shell section text-center">
        <p className="eyebrow-light">Book your chair</p>
        <h2 className="display-2 mx-auto mt-4 max-w-2xl text-cream">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-muted">{body}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary w-full sm:w-auto">
            <CalendarIcon className="h-4 w-4" />
            Book Your Appointment
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <a href={`tel:${shop.phoneHref}`} className="btn btn-outline-light w-full sm:w-auto">
            <PhoneIcon className="h-4 w-4" />
            {shop.phone}
          </a>
        </div>
      </div>
    </section>
  )
}
