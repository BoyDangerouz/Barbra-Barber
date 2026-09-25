"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { ArrowRightIcon, CloseIcon, SparkleIcon } from "@/components/icons"

const STORAGE_KEY = "bb:first-visit-offer"
/** Don't ask again for a week after it's been seen or dismissed. */
const SNOOZE_DAYS = 7
const OPEN_DELAY_MS = 6000
const PROMO_CODE = "FIRSTCUT10"

/** Routes where the offer would interrupt rather than invite. */
const SUPPRESSED_PATHS = ["/book", "/terms", "/privacy"]

function recentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const seenAt = Number(raw)
    if (!Number.isFinite(seenAt)) return false
    return Date.now() - seenAt < SNOOZE_DAYS * 86_400_000
  } catch {
    // Private browsing with storage blocked — just show the offer.
    return false
  }
}

export function PromoModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const dismiss = useCallback(() => {
    setOpen(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      /* storage unavailable — the modal simply reappears next visit */
    }
    previouslyFocused.current?.focus()
  }, [])

  // Arm the timer once per page load, on pages where the offer makes sense.
  useEffect(() => {
    if (SUPPRESSED_PATHS.some((path) => pathname.startsWith(path))) return
    if (recentlyDismissed()) return

    const timer = window.setTimeout(() => {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      setOpen(true)
    }, OPEN_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [pathname])

  // Lock scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        dismiss()
        return
      }
      if (event.key !== "Tab") return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input',
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
  }, [open, dismiss])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard blocked; the code is on screen to read anyway.
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/75 p-4 backdrop-blur-sm sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        aria-describedby="promo-body"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ink-600 bg-ink-800 text-cream shadow-lift motion-safe:animate-[promo-in_320ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-ink-700 hover:text-gold"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="px-7 pb-7 pt-9 text-center sm:px-9">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
            <SparkleIcon className="h-6 w-6" />
          </span>

          <p className="eyebrow-light mt-5">First visit?</p>
          <h2 id="promo-title" className="display-3 mt-2 text-cream">
            Get 10% off your first cut
          </h2>
          <p id="promo-body" className="mt-3 text-sm leading-relaxed text-muted">
            New to the chair? Book any service online and use the code below to take 10% off.
            Valid on your first appointment with us.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <code className="rounded-lg border border-dashed border-gold/60 bg-ink px-5 py-3 font-sans text-lg font-bold tracking-[0.18em] text-gold">
              {PROMO_CODE}
            </code>
            <button
              type="button"
              onClick={copyCode}
              className="btn btn-outline-light btn-sm"
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <Link href="/book" onClick={dismiss} className="btn btn-primary mt-6 w-full">
            Book Your First Cut
            <ArrowRightIcon className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full py-2 text-sm text-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
          >
            No thanks, I&apos;ll browse first
          </button>
        </div>
      </div>
    </div>
  )
}
