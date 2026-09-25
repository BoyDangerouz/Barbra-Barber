import Image from "next/image"
import Link from "next/link"

import { ArrowRightIcon, CheckIcon, ClockIcon } from "@/components/icons"
import {
  categoryImage,
  formatDuration,
  formatPrice,
  imageForService,
  priceFrom,
  type Service,
  type ServiceCategory,
} from "@/lib/services"

/**
 * Compact category tile used on the home page — photograph with the label
 * and entry price sitting over a gradient.
 */
export function CategoryTile({
  category,
  label,
  blurb,
}: {
  category: ServiceCategory
  label: string
  blurb: string
}) {
  return (
    <Link
      href={`/services#${category}`}
      className="group relative block overflow-hidden rounded-card border border-ink-600 bg-ink-800"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={categoryImage[category]}
          alt={`${label} at Barbra Barber`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-transparent" />
      </div>

      <div className="relative -mt-16 p-5">
        <h3 className="font-display text-xl font-bold text-cream">{label}</h3>
        <p className="mt-1 text-sm text-muted">{blurb}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-gold">
            From {formatPrice(priceFrom(category))}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/**
 * Full service listing used on the services page. Links straight into the
 * booking wizard with the service pre-selected.
 */
export function ServiceRow({ service }: { service: Service }) {
  return (
    <article className="card-light flex flex-col overflow-hidden transition-shadow hover:shadow-lift sm:flex-row">
      <div className="relative h-48 shrink-0 sm:h-auto sm:w-44 lg:w-52">
        <Image
          src={imageForService(service)}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, 13rem"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <h3 className="font-display text-xl font-bold">{service.name}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-dark">
              <ClockIcon className="h-4 w-4" />
              {formatDuration(service.duration)}
              {service.popular && (
                <span className="ml-2 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                  Popular
                </span>
              )}
            </p>
          </div>
          <p className="font-display text-2xl font-bold">{formatPrice(service.price)}</p>
        </div>

        <p className="text-sm leading-relaxed text-muted-dark">{service.description}</p>

        {service.includes && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {service.includes.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 text-sm text-muted-dark">
                <CheckIcon className="h-3.5 w-3.5 text-gold-700" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <Link
            href={`/book?service=${service.id}`}
            className="btn btn-outline-dark btn-sm"
            aria-label={`Book ${service.name}`}
          >
            Book this service
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
