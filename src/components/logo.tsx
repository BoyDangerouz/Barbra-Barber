import Image from "next/image"
import Link from "next/link"

import { shop } from "@/lib/shop"

type LogoProps = {
  /** Hide the wordmark and show the badge alone. */
  markOnly?: boolean
  /** Drop the wordmark below 480px, where header space runs out. */
  compactOnMobile?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  /** Rendered as a link unless this is already inside one. */
  asLink?: boolean
}

const MARK_PX = { sm: 36, md: 44, lg: 60 } as const

export function Logo({
  markOnly = false,
  compactOnMobile = false,
  size = "md",
  className = "",
  asLink = true,
}: LogoProps) {
  const px = MARK_PX[size]

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/images/logo.webp"
        alt={markOnly ? `${shop.name} logo` : ""}
        width={px}
        height={px}
        className="shrink-0 rounded-full"
        // The badge is above the fold in the header on every page.
        priority
      />
      {!markOnly && (
        <span
          className={`flex-col leading-none ${compactOnMobile ? "hidden min-[480px]:flex" : "flex"}`}
        >
          <span
            className="font-display font-bold text-gold"
            style={{ fontSize: size === "lg" ? "1.55rem" : "1.2rem", lineHeight: 1.05 }}
          >
            Barbra
          </span>
          <span
            className="font-display font-bold text-cream"
            style={{ fontSize: size === "lg" ? "1.55rem" : "1.2rem", lineHeight: 1.05 }}
          >
            Barber
          </span>
        </span>
      )}
    </span>
  )

  if (!asLink) return content

  return (
    <Link href="/" aria-label={`${shop.name} — home`} className="inline-flex items-center">
      {content}
    </Link>
  )
}
