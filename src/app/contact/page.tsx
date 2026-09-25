import type { Metadata } from "next"
import Link from "next/link"

import { ContactForm } from "@/components/contact-form"
import { CtaBand } from "@/components/cta-band"
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons"
import { PageHero } from "@/components/page-hero"
import {
  directionsUrl,
  fullAddress,
  mapEmbedUrl,
  openingHoursDisplay,
  shop,
} from "@/lib/shop"

export const metadata: Metadata = {
  title: "Contact & Find Us",
  description: `Visit Barbra Barber at ${fullAddress}. Call ${shop.phone}, email ${shop.email}, or send us a message. Open Monday to Saturday.`,
  alternates: { canonical: "/contact" },
}

const faqs = [
  {
    question: "Do you take walk-ins?",
    answer:
      "When a chair is free, yes — but Thursdays to Saturdays we're usually fully booked. Booking online takes under a minute and guarantees your slot.",
  },
  {
    question: "What if I need to cancel or move my appointment?",
    answer:
      "Call or WhatsApp us and we'll move it, free of charge, up to 12 hours before. Inside 12 hours we ask for 50% of the service price, because that chair stays empty.",
  },
  {
    question: "Do you cut all hair types?",
    answer:
      "Every type. The shop was built specifically so that nobody with textured, coily or natural hair gets turned away or handed to whoever happens to be free.",
  },
  {
    question: "How do I pay?",
    answer:
      "At the shop after your cut — card, cash, SnapScan or EFT. Nothing is charged when you book online.",
  },
  {
    question: "Is there parking?",
    answer:
      "Street parking runs along Main Street and there's a secure lot two doors down. Both are a short walk from the door.",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Come and say hello."
        lead="We'd love to hear from you. Visit the shop, call, email — or book online and we'll have the chair ready."
      />

      {/* ── Details + form ───────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="display-3">Shop details</h2>

            <ul className="mt-8 space-y-7">
              <ContactItem Icon={MapPinIcon} label="Location">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-gold-700"
                >
                  {shop.address.line1}
                  <br />
                  {shop.address.suburb}, {shop.address.city}, {shop.address.postalCode}
                  <br />
                  {shop.address.country}
                </a>
                <span className="mt-2 block text-sm text-muted-dark">Get directions →</span>
              </ContactItem>

              <ContactItem Icon={PhoneIcon} label="Phone & WhatsApp">
                <a href={`tel:${shop.phoneHref}`} className="underline underline-offset-4 hover:text-gold-700">
                  {shop.phone}
                </a>
                <span className="mt-2 block text-sm">
                  <a
                    href={`https://wa.me/${shop.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-dark underline underline-offset-4 hover:text-gold-700"
                  >
                    Message us on WhatsApp
                  </a>
                </span>
              </ContactItem>

              <ContactItem Icon={MailIcon} label="Email">
                <a
                  href={`mailto:${shop.email}`}
                  className="break-all underline underline-offset-4 hover:text-gold-700"
                >
                  {shop.email}
                </a>
                <span className="mt-2 block text-sm text-muted-dark">
                  We reply within one working day.
                </span>
              </ContactItem>

              <ContactItem Icon={ClockIcon} label="Opening hours">
                <dl className="space-y-1.5">
                  {openingHoursDisplay.map((row) => (
                    <div key={row.days} className="flex justify-between gap-6">
                      <dt className="text-muted-dark">{row.days}</dt>
                      <dd className="font-semibold">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
                <span className="mt-3 block text-sm text-muted-dark">
                  Last appointment starts in time to finish before we close.
                </span>
              </ContactItem>
            </ul>

            <Link href="/book" className="btn btn-primary mt-10">
              <CalendarIcon className="h-4 w-4" />
              Book an Appointment
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h2 className="display-3">Send us a message</h2>
            <p className="mt-3 text-muted-dark">
              Question about a service, a group booking or your hair specifically? Ask away.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <section className="bg-cream-200 pb-16">
        <div className="shell">
          <div className="overflow-hidden rounded-card border border-cream-300">
            <iframe
              src={mapEmbedUrl}
              title={`Map showing ${shop.name} at ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 md:h-[440px]"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-dark">
            {fullAddress} ·{" "}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline underline-offset-4"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Common Questions</p>
          <h2 className="display-2 mt-4">Before you ask.</h2>

          <div className="mt-10 divide-y divide-cream-300 border-y border-cream-300">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream-300 text-muted-dark transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-12 leading-relaxed text-muted-dark">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Rather just book it?"
        body="Pick your service, barber and time online — the chair is yours in under a minute."
      />
    </>
  )
}

function ContactItem({
  Icon,
  label,
  children,
}: {
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-700">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">
          {label}
        </h3>
        <div className="mt-2 leading-relaxed">{children}</div>
      </div>
    </li>
  )
}
