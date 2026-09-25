import Image from "next/image"
import Link from "next/link"

import { BarberCard } from "@/components/barber-card"
import { CtaBand } from "@/components/cta-band"
import {
  ArrowRightIcon,
  CalendarIcon,
  DiamondIcon,
  QuoteIcon,
  ScissorsIcon,
  StarIcon,
  UsersIcon,
} from "@/components/icons"
import { CategoryTile } from "@/components/service-card"
import { barbers } from "@/lib/barbers"
import { shop } from "@/lib/shop"

const valueProps = [
  { Icon: ScissorsIcon, title: "Expert Barbers", body: "Skilled. Passionate. Real." },
  { Icon: DiamondIcon, title: "Premium Products", body: "Quality care for your hair and skin." },
  { Icon: UsersIcon, title: "Inclusive Space", body: "All styles. All people. Always." },
  { Icon: StarIcon, title: "Real Confidence", body: "Good hair. Brighter days." },
]

const categories = [
  { category: "haircuts" as const, label: "Haircuts", blurb: "From classic to creative." },
  { category: "fades" as const, label: "Fades", blurb: "Sharp. Clean. Defined." },
  { category: "beard" as const, label: "Beard Trims", blurb: "Keep it fresh." },
  { category: "kids" as const, label: "Kids Cuts", blurb: "Sharp looks for young legends." },
]

const testimonials = [
  {
    quote:
      "First place in Cape Town where nobody looked confused about my hair texture. Barbra knew exactly what to do and I have been going back every three weeks since.",
    name: "Lerato M.",
    detail: "Regular since 2021",
  },
  {
    quote:
      "Neo does the best hot towel shave in the city. It is twenty minutes where nothing else exists. I book it before every big meeting.",
    name: "Sipho N.",
    detail: "Hot Towel Shave",
  },
  {
    quote:
      "My son used to scream through haircuts. Zuri had him laughing by the second minute. That alone is worth the booking.",
    name: "Chantal D.",
    detail: "Father & Son package",
  },
]

const stats = [
  { value: "6", label: "Years on Main Street" },
  { value: "11k+", label: "Cuts and counting" },
  { value: "4.9★", label: "Average review score" },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[calc(100svh-72px)] items-center overflow-hidden bg-ink md:min-h-[calc(100svh-108px)]">
        <Image
          src="/images/hero.webp"
          alt="A client laughing in the chair at Barbra Barber, lit by warm gold light"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div className="hero-scrim absolute inset-0 -z-10" />

        <div className="shell w-full py-20 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow-light rule-gold">{shop.tagline}</p>

            <h1 className="display-1 mt-7 text-cream text-shadow-hero">
              More than
              <br />
              a haircut.
              <br />
              <span className="text-gold">It&apos;s a whole vibe.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/85">
              Premium grooming, confidence and community for every style, every story —
              in the heart of {shop.address.city}.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn btn-primary">
                <CalendarIcon className="h-4 w-4" />
                Book Your Appointment
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn btn-outline-light">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────────────────── */}
      <section className="border-y border-ink-600 bg-ink">
        <div className="shell grid grid-cols-1 divide-y divide-ink-600 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {valueProps.map(({ Icon, title, body }, index) => (
            <div
              key={title}
              className={`flex items-center gap-4 py-6 lg:py-7 ${
                index > 0 ? "sm:border-l sm:border-ink-600 sm:pl-6" : ""
              } ${index === 2 ? "lg:border-l" : ""}`}
            >
              <Icon className="h-8 w-8 shrink-0 text-gold" />
              <div>
                <h2 className="font-sans text-[15px] font-semibold text-cream">{title}</h2>
                <p className="mt-0.5 text-sm text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">Our Services</p>
              <h2 className="display-2 mt-4">
                Anything from a clean cut
                <br className="hidden sm:block" /> to a full transformation.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="leading-relaxed text-muted-dark">
                A full range of barbering and grooming for every style, age and occasion —
                from classic cuts and modern fades to beard work and natural hair care.
              </p>
            </div>
            <div className="lg:col-span-2 lg:text-right">
              <Link href="/services" className="btn btn-outline-dark btn-sm">
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((tile) => (
              <CategoryTile key={tile.category} {...tile} />
            ))}

            {/* First-visit offer, mirroring the popup so the two reinforce each other. */}
            <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-card bg-ink p-6 text-cream sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <Image
                src="/images/promo-card.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1280px) 60vw, 24vw"
                className="-z-10 object-cover object-right"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/90 to-ink/55" />
              <div className="relative">
                <p className="eyebrow-light">First visit?</p>
                <h3 className="display-3 mt-3 text-cream">
                  Get 10% off
                  <br />
                  your first cut
                </h3>
                <p className="mt-3 text-sm text-muted">
                  Experience the vibe. Meet the team. Find your style.
                </p>
              </div>
              <Link href="/book" className="btn btn-primary btn-sm relative mt-6 self-start">
                Book Now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <section className="section bg-cream-200">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-card">
              <Image
                src="/images/interior.webp"
                alt="The floor at Barbra Barber after hours — three leather chairs, gold mirror lighting and plants"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-40 overflow-hidden rounded-card border-4 border-cream-200 sm:block lg:-right-8 lg:w-48">
              <div className="relative aspect-3/4">
                <Image
                  src="/images/barber-barbra.webp"
                  alt="Barbra Mokoena, founder and lead barber"
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="display-2 mt-4">
              Built for everyone who
              <br className="hidden sm:block" /> was told to sit elsewhere.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-dark">
              <p>
                Barbra Mokoena spent twelve years behind other people&apos;s chairs watching clients
                with textured hair get turned away, rushed, or handed to whoever happened to be free.
                In 2019 she opened her own shop on Main Street with one rule: every head of hair that
                walks in gets someone who actually knows what to do with it.
              </p>
              <p>
                Six years later that rule still holds. Three chairs, a team who train constantly, and
                a room where the conversation is as good as the cut.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-cream-300 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold">{stat.value}</span>
                    <span className="mt-1 block text-sm text-muted-dark">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <Link href="/about" className="btn btn-outline-dark mt-9">
              Read Our Story
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="on-ink section bg-ink">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow-light">The Team</p>
            <h2 className="display-2 mt-4 text-cream">Meet the people in your corner.</h2>
            <p className="mt-5 text-muted">
              Three chairs, three specialists. Book whoever suits the look you&apos;re after — or
              let us match you with the first available.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} showBio={false} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Kind Words</p>
            <h2 className="display-2 mt-4">What the chair says about us.</h2>
          </div>

          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li key={testimonial.name} className="card-light flex flex-col gap-5 p-7">
                <QuoteIcon className="h-8 w-8 text-gold" />
                <blockquote className="flex-1 leading-relaxed text-muted-dark">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-1 text-gold" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <footer className="border-t border-cream-300 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-dark">{testimonial.detail}</p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
