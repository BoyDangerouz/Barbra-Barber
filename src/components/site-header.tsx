"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import {
  CalendarIcon,
  CloseIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
} from "@/components/icons"
import { Logo } from "@/components/logo"
import { shop } from "@/lib/shop"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Drop a subtle shadow once the page moves, so the bar separates from the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // While the panel is open: lock the page, trap Escape, and keep focus inside.
  useEffect(() => {
    if (!menuOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== "Tab") return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip — business basics, without crowding the main bar. */}
      <div className="hidden bg-ink text-[13px] text-muted md:block">
        <div className="shell flex h-9 items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gold" />
            {shop.address.line1}, {shop.address.suburb}, {shop.address.city}
          </span>
          <span className="inline-flex items-center gap-5">
            <span>Mon–Fri 08:00–19:00 · Sat 08:00–17:00</span>
            <a
              href={`tel:${shop.phoneHref}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-gold"
            >
              <PhoneIcon className="h-4 w-4 text-gold" />
              {shop.phone}
            </a>
          </span>
        </div>
      </div>

      <div
        className={`border-b border-ink-600 bg-ink/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]" : ""
        }`}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          {/* The wordmark gives way to the badge on narrow phones so the
              header can keep both the nav toggle and the booking CTA. */}
          <Logo compactOnMobile />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-gold"
                        : "text-cream/85 hover:text-gold"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Visible at every width — the brief asks for an obvious booking
                action in the header, so it must survive the mobile layout. */}
            <Link href="/book" className="btn btn-primary btn-sm">
              <CalendarIcon className="h-4 w-4" />
              Book Now
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet navigation */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!menuOpen}
        className="border-b border-ink-600 bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="shell py-4">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-ink-700 py-4 text-lg font-medium transition-colors ${
                    isActive(link.href) ? "text-gold" : "text-cream hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/book" className="btn btn-primary mt-5 w-full">
            <CalendarIcon className="h-4 w-4" />
            Book Your Appointment
          </Link>

          <div className="mt-5 flex flex-col gap-3 text-sm text-muted">
            <a href={`tel:${shop.phoneHref}`} className="inline-flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 text-gold" />
              {shop.phone}
            </a>
            <span className="inline-flex items-center gap-2.5">
              <MapPinIcon className="h-4 w-4 text-gold" />
              {shop.address.line1}, {shop.address.city}
            </span>
          </div>
        </nav>
      </div>
    </header>
  )
}
