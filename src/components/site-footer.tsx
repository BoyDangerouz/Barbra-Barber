import Link from "next/link"

import {
  CalendarIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TikTokIcon,
  XIcon,
} from "@/components/icons"
import { Logo } from "@/components/logo"
import { serviceCategories } from "@/lib/services"
import { directionsUrl, fullAddress, openingHoursDisplay, shop } from "@/lib/shop"

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/book", label: "Book Now" },
  { href: "/contact", label: "Contact" },
]

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
]

const socials = [
  { href: shop.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: shop.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: shop.social.tiktok, label: "TikTok", Icon: TikTokIcon },
  { href: shop.social.x, label: "X", Icon: XIcon },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-ink bg-ink text-cream">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand */}
        <div className="lg:max-w-xs">
          <Logo size="lg" />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {shop.description}
          </p>
          <Link href="/book" className="btn btn-primary btn-sm mt-6">
            <CalendarIcon className="h-4 w-4" />
            Book an Appointment
          </Link>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Legal
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Services
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {serviceCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/services#${category.id}`}
                  className="text-muted transition-colors hover:text-gold"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Visit */}
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Visit Us
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{fullAddress}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${shop.phoneHref}`}
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{shop.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${shop.email}`}
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="break-all">{shop.email}</span>
              </a>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <dl className="space-y-1">
                {openingHoursDisplay.map((row) => (
                  <div key={row.days} className="flex flex-wrap gap-x-2">
                    <dt className="text-cream/90">{row.days}</dt>
                    <dd>{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>

          <div className="mt-6 flex gap-2.5">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${shop.name} on ${label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="hairline">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {shop.name}. All rights reserved.
          </p>
          <p className="tracking-[0.18em] uppercase text-gold">{shop.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
