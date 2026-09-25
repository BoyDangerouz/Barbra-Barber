import Image from "next/image"
import Link from "next/link"

import { ArrowRightIcon, InstagramIcon, ScissorsIcon } from "@/components/icons"
import { initialsOf, type Barber } from "@/lib/barbers"
import { shop } from "@/lib/shop"

/**
 * Profile card for a barber.
 *
 * Falls back to a branded monogram when `barber.image` is null, so an
 * outstanding photograph degrades into something deliberate rather than a
 * broken image.
 */
export function BarberCard({ barber, showBio = true }: { barber: Barber; showBio?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-card border border-ink-600 bg-ink-800">
      <div className="relative aspect-3/4 overflow-hidden bg-ink-700">
        {barber.image ? (
          <Image
            src={barber.image}
            alt={`${barber.name}, ${barber.role} at Barbra Barber`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-ink-700 to-ink"
            role="img"
            aria-label={`${barber.name}, ${barber.role} at Barbra Barber`}
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/50 font-display text-3xl font-bold text-gold">
              {initialsOf(barber.name)}
            </span>
            <ScissorsIcon className="h-6 w-6 text-gold/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-cream">{barber.name}</h3>
        <p className="mt-1 text-sm font-semibold text-gold">{barber.role}</p>
        <p className="mt-3 text-sm text-muted">{barber.specialtyLabel}</p>

        {showBio && <p className="mt-4 text-sm leading-relaxed text-muted">{barber.bio}</p>}

        <div className="mt-5 flex items-center justify-between border-t border-ink-600 pt-5">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">
            {barber.yearsExperience} years in the chair
          </span>
          <div className="flex items-center gap-2">
            <a
              href={shop.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${barber.name} on Instagram`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-600 text-muted transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <Link
              href={`/book?barber=${barber.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-300"
            >
              Book
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
