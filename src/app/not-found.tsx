import Link from "next/link"

import { ArrowRightIcon, CalendarIcon, ScissorsIcon } from "@/components/icons"

export default function NotFound() {
  return (
    <section className="on-ink bg-ink">
      <div className="shell flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
        <ScissorsIcon className="h-12 w-12 text-gold" />
        <p className="eyebrow-light mt-8">Error 404</p>
        <h1 className="display-1 mt-4 text-cream">A bit too close a trim.</h1>
        <p className="mt-6 max-w-md text-muted">
          We can&apos;t find that page. It may have moved, or the link might have a typo in it.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Back to Home
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link href="/book" className="btn btn-outline-light">
            <CalendarIcon className="h-4 w-4" />
            Book an Appointment
          </Link>
        </div>

        <nav aria-label="Helpful links" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { href: "/services", label: "Services" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
