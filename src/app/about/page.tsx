import type { Metadata } from "next"
import Image from "next/image"

import { BarberCard } from "@/components/barber-card"
import { CtaBand } from "@/components/cta-band"
import { DiamondIcon, ScissorsIcon, StarIcon, UsersIcon } from "@/components/icons"
import { PageHero } from "@/components/page-hero"
import { barbers } from "@/lib/barbers"
import { shop } from "@/lib/shop"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Barbra Barber opened on Main Street in 2019 with one rule: every head of hair gets someone who knows what to do with it. Meet the shop and the team.",
  alternates: { canonical: "/about" },
}

const values = [
  {
    Icon: UsersIcon,
    title: "Everyone gets a seat",
    body: "Coils, curls, locs, straight, thinning, greying — whatever is growing out of your head, someone here has trained on it. Nobody gets turned away or handed off.",
  },
  {
    Icon: ScissorsIcon,
    title: "The craft comes first",
    body: "The whole team trains every month, on our time and our money. A fade that was good enough in 2019 is not good enough now.",
  },
  {
    Icon: DiamondIcon,
    title: "Products we'd use ourselves",
    body: "We stock what actually works on the hair that sits in our chairs, including local South African brands, and we'll tell you honestly if you don't need it.",
  },
  {
    Icon: StarIcon,
    title: "You leave standing taller",
    body: "A haircut is thirty minutes that changes how you carry yourself for three weeks. We take that seriously, even when the room is loud and the music is louder.",
  },
]

const timeline = [
  {
    year: "2019",
    title: "One chair on Main Street",
    body: "Barbra signs a lease on a narrow shopfront with peeling paint and good light, and cuts her first client on a Tuesday morning.",
  },
  {
    year: "2021",
    title: "The second chair",
    body: "Neo joins from a traditional shave parlour and brings the straight razor work that half our regulars now book by name.",
  },
  {
    year: "2023",
    title: "The apprenticeship",
    body: "We start training barbers from the neighbourhood rather than hiring in. Zuri is the first to come through it.",
  },
  {
    year: "Today",
    title: "Three chairs, one standard",
    body: "Open six days a week, booked out most Saturdays, and still the only shop on the street where the playlist is a group decision.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Barbra Barber"
        title="More than a barbershop."
        lead="Barbra Barber was created to be more than a place to get a haircut — a space where style, culture and community meet."
        image="/images/interior.webp"
        imagePosition="center 60%"
      />

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="display-2 mt-4">
              It started with being told
              <br className="hidden sm:block" /> to sit somewhere else.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-dark">
              <p>
                Barbra Mokoena spent twelve years working in other people&apos;s shops. She was good
                — good enough that clients followed her between three of them. But she kept watching
                the same thing happen: someone would walk in with textured or natural hair, and the
                room would go quiet while everyone hoped it wasn&apos;t their turn.
              </p>
              <p>
                She opened her own shop in {shop.address.suburb} in 2019 with a rule she has never
                bent. Every head of hair that comes through the door gets a barber who actually knows
                what to do with it. Not a guess. Not a rush. Not a polite suggestion to try somewhere
                else.
              </p>
              <p>
                What she didn&apos;t plan for was the rest of it — that the shop would turn into the
                kind of room where people arrive early just to sit. Where the conversation runs from
                league football to load-shedding to somebody&apos;s new business idea, and a
                first-time client leaves having been introduced to four people.
              </p>
              <p className="font-semibold text-ink">
                Good hair, brighter days. It started as something Barbra said to nervous clients. It
                ended up on the wall.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-16/10 overflow-hidden rounded-card">
              <Image
                src="/images/interior.webp"
                alt="The shop floor at Barbra Barber — three leather chairs, gold-lit mirrors and plants"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-3/4 overflow-hidden rounded-card">
                <Image
                  src="/images/service-styling.webp"
                  alt="Cornrows braided and finished at Barbra Barber"
                  fill
                  sizes="(max-width: 1024px) 45vw, 23vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-3/4 overflow-hidden rounded-card">
                <Image
                  src="/images/service-shave.webp"
                  alt="A beard shaped and lined after a hot towel shave"
                  fill
                  sizes="(max-width: 1024px) 45vw, 23vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="section bg-cream-200">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="display-2 mt-4">Four things we don&apos;t compromise on.</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map(({ Icon, title, body }) => (
              <div key={title} className="card-light p-7">
                <Icon className="h-9 w-9 text-gold-700" />
                <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-dark">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="on-ink section bg-ink">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow-light">Meet Our Barbers</p>
            <h2 className="display-2 mt-4 text-cream">Three chairs. Three specialists.</h2>
            <p className="mt-5 text-muted">
              Book by name if you know who you want, or let us put you with whoever is free — the
              standard is the same in every chair.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">How We Got Here</p>
            <h2 className="display-2 mt-4">Six years, one street.</h2>
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {timeline.map((entry) => (
              <li key={entry.year} className="border-t-2 border-gold pt-6">
                <p className="font-display text-3xl font-bold text-gold-700">{entry.year}</p>
                <h3 className="mt-3 font-display text-lg font-bold">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-dark">{entry.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Come see what the fuss is about."
        body="Book a chair with Barbra, Neo or Zuri — or let us match you with whoever is free at the time that suits you."
      />
    </>
  )
}
