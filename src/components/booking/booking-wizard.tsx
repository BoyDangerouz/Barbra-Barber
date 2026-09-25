"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ScissorsIcon,
  UsersIcon,
} from "@/components/icons"
import { ANY_BARBER, barberLabel, barbers, initialsOf } from "@/lib/barbers"
import {
  addDaysISO,
  bookingSchema,
  dayOfWeekInShopZone,
  endTimeOf,
  formatLongDate,
  formatShortDate,
  formatTime12h,
  slotsFor,
  todayInShopZone,
  type Booking,
} from "@/lib/booking"
import {
  formatDuration,
  formatPrice,
  serviceById,
  serviceCategories,
  services,
} from "@/lib/services"
import { openingHours, shop } from "@/lib/shop"

const STEPS = ["Service", "Barber", "Date & Time", "Your Details", "Confirm"] as const
/** How many trading days to offer as quick-pick chips. */
const QUICK_DAYS = 14

/** Shown when Continue is pressed before the step is complete. */
const BLOCKED_MESSAGE: Record<number, string> = {
  0: "Please choose a service to continue.",
  2: "Please choose both a date and a time to continue.",
}

type Details = { name: string; email: string; phone: string; notes: string }

export function BookingWizard() {
  const searchParams = useSearchParams()

  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState("")
  const [barberId, setBarberId] = useState<string>(ANY_BARBER)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "", notes: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  /**
   * "Today" is resolved after mount. Reading the clock during render would
   * make the server and client markup disagree.
   */
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => setToday(todayInShopZone()), [])

  const headingRef = useRef<HTMLDivElement>(null)
  const service = serviceById(serviceId)

  // Preselect from /book?service=...&barber=... links.
  useEffect(() => {
    const requestedService = searchParams.get("service")
    if (requestedService && serviceById(requestedService)) {
      setServiceId(requestedService)
      setStep((current) => (current === 0 ? 1 : current))
    }

    const requestedBarber = searchParams.get("barber")
    if (requestedBarber && barbers.some((b) => b.id === requestedBarber)) {
      setBarberId(requestedBarber)
    }
  }, [searchParams])

  // A time only means something alongside a service and a barber — if either
  // changes, the chosen slot may no longer exist.
  useEffect(() => {
    setTime("")
  }, [serviceId, barberId, date])

  const goTo = useCallback((next: number) => {
    setStep(next)
    setFormError(null)
    // Move the viewport (and screen-reader focus) to the new step.
    requestAnimationFrame(() => {
      headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      headingRef.current?.focus({ preventScroll: true })
    })
  }, [])

  const quickDates = useMemo(() => {
    if (!today) return []
    const out: string[] = []
    for (let offset = 0; out.length < QUICK_DAYS && offset < 60; offset++) {
      const candidate = addDaysISO(today, offset)
      if (openingHours[dayOfWeekInShopZone(candidate)]) out.push(candidate)
    }
    return out
  }, [today])

  const slots = useMemo(
    () => (date && service ? slotsFor(date, service, barberId) : []),
    [date, service, barberId],
  )

  const grouped = useMemo(() => {
    const buckets: { label: string; slots: typeof slots }[] = [
      { label: "Morning", slots: [] },
      { label: "Afternoon", slots: [] },
      { label: "Evening", slots: [] },
    ]
    for (const slot of slots) {
      const hour = Number(slot.time.slice(0, 2))
      const index = hour < 12 ? 0 : hour < 17 ? 1 : 2
      buckets[index].slots.push(slot)
    }
    return buckets.filter((bucket) => bucket.slots.length > 0)
  }, [slots])

  const canAdvance = (from: number): boolean => {
    if (from === 0) return Boolean(service)
    if (from === 1) return true
    if (from === 2) return Boolean(date && time)
    if (from === 3) return validateDetails(false)
    return true
  }

  function validateDetails(showErrors = true): boolean {
    const candidate = { serviceId, barberId, date, time, ...details }
    const parsed = bookingSchema.safeParse(candidate)
    if (parsed.success) {
      if (showErrors) setErrors({})
      return true
    }

    const next: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form")
      next[field] ??= issue.message
    }
    // Only surface problems with the fields on this step.
    const own = ["name", "email", "phone", "notes"].filter((field) => next[field])
    if (showErrors) {
      setErrors(Object.fromEntries(own.map((field) => [field, next[field]])))
    }
    return own.length === 0
  }

  async function submit() {
    if (!validateDetails()) {
      goTo(3)
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, barberId, date, time, ...details }),
      })
      const data = await response.json()

      if (!response.ok) {
        setFormError(data?.error ?? "We couldn't confirm that booking. Please try again.")
        if (data?.fieldErrors?.time) {
          setTime("")
          goTo(2)
        } else if (data?.fieldErrors) {
          setErrors(data.fieldErrors)
          goTo(3)
        }
        return
      }

      setBooking(data.booking as Booking)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setFormError(
        "We couldn't reach the booking system. Check your connection and try again, or call us on " +
          shop.phone +
          ".",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (booking) return <BookingConfirmation booking={booking} />

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7 xl:col-span-8">
        <Stepper step={step} onSelect={goTo} />

        <div
          ref={headingRef}
          tabIndex={-1}
          className="mt-8 scroll-mt-32 outline-none"
          aria-live="polite"
        >
          <h2 className="display-3">
            {step + 1}. {STEPS[step]}
          </h2>
        </div>

        <div className="mt-6">
          {step === 0 && <ServiceStep selected={serviceId} onSelect={setServiceId} />}

          {step === 1 && <BarberStep selected={barberId} onSelect={setBarberId} />}

          {step === 2 && (
            <DateTimeStep
              today={today}
              quickDates={quickDates}
              date={date}
              time={time}
              grouped={grouped}
              hasService={Boolean(service)}
              onDate={setDate}
              onTime={setTime}
            />
          )}

          {step === 3 && (
            <DetailsStep
              details={details}
              errors={errors}
              onChange={(patch) => {
                setDetails((current) => ({ ...current, ...patch }))
                setErrors((current) => {
                  const next = { ...current }
                  for (const key of Object.keys(patch)) delete next[key]
                  return next
                })
              }}
            />
          )}

          {step === 4 && service && (
            <ReviewStep
              service={service}
              barberName={barberLabel(barberId)}
              date={date}
              time={time}
              details={details}
              onEdit={goTo}
            />
          )}
        </div>

        {formError && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {formError}
          </p>
        )}

        {/* Step controls */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-cream-300 pt-6">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, step - 1))}
            disabled={step === 0}
            className="btn btn-ghost-dark btn-sm disabled:invisible"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 3 && !validateDetails()) return
                if (canAdvance(step)) {
                  goTo(step + 1)
                } else {
                  // Say why rather than silently ignoring the click.
                  setFormError(BLOCKED_MESSAGE[step] ?? null)
                }
              }}
              aria-disabled={!canAdvance(step)}
              className="btn btn-primary"
            >
              Continue
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn btn-primary">
              {submitting ? "Confirming…" : "Confirm Booking"}
              {!submitting && <CheckIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Running summary */}
      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="card-light sticky top-32 p-6">
          <h2 className="font-display text-lg font-bold">Your Booking</h2>

          <dl className="mt-5 space-y-4 text-sm">
            <SummaryRow label="Service" value={service?.name} placeholder="Select a service" />
            <SummaryRow
              label="Barber"
              value={barberId ? barberLabel(barberId) : undefined}
              placeholder="Select a barber"
            />
            <SummaryRow
              label="Date & Time"
              value={
                date && time
                  ? `${formatLongDate(date)}\n${formatTime12h(time)} – ${formatTime12h(
                      endTimeOf(time, service?.duration ?? 0),
                    )}`
                  : date
                    ? formatLongDate(date)
                    : undefined
              }
              placeholder="Select date and time"
            />
            {service && (
              <SummaryRow label="Duration" value={formatDuration(service.duration)} placeholder="" />
            )}
          </dl>

          <div className="mt-6 flex items-center justify-between border-t border-cream-300 pt-5">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold">
              {service ? formatPrice(service.price) : "—"}
            </span>
          </div>

          <p className="mt-5 flex gap-2.5 rounded-lg bg-cream-200 p-4 text-xs leading-relaxed text-muted-dark">
            <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
            <span>
              After booking, you&apos;ll be able to add this appointment straight to Google
              Calendar, Apple Calendar or Outlook — with your exact time and service.
            </span>
          </p>

          <p className="mt-4 text-xs leading-relaxed text-muted-dark">
            No payment is taken online. You settle at the shop after your cut.
          </p>
        </div>
      </aside>
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────

function Stepper({ step, onSelect }: { step: number; onSelect: (index: number) => void }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((label, index) => {
        const state = index < step ? "done" : index === step ? "current" : "todo"
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => index < step && onSelect(index)}
              disabled={index > step}
              aria-current={state === "current" ? "step" : undefined}
              className={`inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-semibold transition-colors ${
                state === "current"
                  ? "bg-ink text-cream"
                  : state === "done"
                    ? "text-ink hover:bg-cream-200"
                    : "text-muted-dark/60"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  state === "current"
                    ? "bg-gold text-ink"
                    : state === "done"
                      ? "bg-gold/20 text-gold-700"
                      : "bg-cream-300 text-muted-dark"
                }`}
              >
                {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="h-px w-3 bg-cream-300 sm:w-5" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function ServiceStep({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-8">
      {serviceCategories.map((category) => {
        const inCategory = services.filter((s) => s.category === category.id)
        if (!inCategory.length) return null

        return (
          <fieldset key={category.id}>
            <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
              {category.label}
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {inCategory.map((service) => (
                <label
                  key={service.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    selected === service.id
                      ? "border-ink bg-ink text-cream"
                      : "border-cream-300 bg-white hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={selected === service.id}
                    onChange={() => onSelect(service.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected === service.id ? "border-gold bg-gold" : "border-muted-dark/40"
                    }`}
                  >
                    {selected === service.id && <CheckIcon className="h-3 w-3 text-ink" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">{service.name}</span>
                      <span className="font-semibold">{formatPrice(service.price)}</span>
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        selected === service.id ? "text-cream/70" : "text-muted-dark"
                      }`}
                    >
                      {formatDuration(service.duration)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}

function BarberStep({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  const options = [
    {
      id: ANY_BARBER,
      name: "First available",
      role: "No preference",
      blurb: "We'll put you with whoever is free at your chosen time. Same standard in every chair.",
    },
    ...barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      role: barber.role,
      blurb: barber.specialtyLabel,
    })),
  ]

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
            selected === option.id
              ? "border-ink bg-ink text-cream"
              : "border-cream-300 bg-white hover:border-ink"
          }`}
        >
          <input
            type="radio"
            name="barber"
            value={option.id}
            checked={selected === option.id}
            onChange={() => onSelect(option.id)}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display font-bold ${
              selected === option.id ? "bg-gold text-ink" : "bg-cream-200 text-muted-dark"
            }`}
          >
            {option.id === ANY_BARBER ? (
              <UsersIcon className="h-5 w-5" />
            ) : (
              initialsOf(option.name)
            )}
          </span>
          <span className="flex-1">
            <span className="block font-semibold">{option.name}</span>
            <span
              className={`mt-0.5 block text-xs font-semibold ${
                selected === option.id ? "text-gold" : "text-gold-700"
              }`}
            >
              {option.role}
            </span>
            <span
              className={`mt-1.5 block text-xs leading-relaxed ${
                selected === option.id ? "text-cream/70" : "text-muted-dark"
              }`}
            >
              {option.blurb}
            </span>
          </span>
        </label>
      ))}
    </div>
  )
}

function DateTimeStep({
  today,
  quickDates,
  date,
  time,
  grouped,
  hasService,
  onDate,
  onTime,
}: {
  today: string | null
  quickDates: string[]
  date: string
  time: string
  grouped: { label: string; slots: { time: string; available: boolean }[] }[]
  hasService: boolean
  onDate: (value: string) => void
  onTime: (value: string) => void
}) {
  if (!today) {
    return <p className="text-muted-dark">Loading available times…</p>
  }

  if (!hasService) {
    return <p className="text-muted-dark">Choose a service first so we know how long to hold the chair.</p>
  }

  const closedOnChosenDate = Boolean(date) && !openingHours[dayOfWeekInShopZone(date)]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="flex items-center gap-2 font-sans text-sm font-semibold">
          <CalendarIcon className="h-4 w-4 text-gold-700" />
          Choose a date
        </h3>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {quickDates.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => onDate(candidate)}
              aria-pressed={date === candidate}
              className={`shrink-0 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                date === candidate
                  ? "border-ink bg-ink text-cream"
                  : "border-cream-300 bg-white hover:border-ink"
              }`}
            >
              <span className="block">{formatShortDate(candidate)}</span>
              {candidate === today && (
                <span
                  className={`mt-0.5 block text-[11px] font-normal ${
                    date === candidate ? "text-gold" : "text-gold-700"
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          ))}
        </div>

        <label className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-dark">Or pick another date:</span>
          <input
            type="date"
            value={date}
            min={today}
            max={addDaysISO(today, 60)}
            onChange={(event) => onDate(event.target.value)}
            className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm"
          />
        </label>

        {closedOnChosenDate && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
            We&apos;re closed on {formatLongDate(date)}. Please choose another day.
          </p>
        )}
      </div>

      {date && !closedOnChosenDate && (
        <div>
          <h3 className="flex items-center gap-2 font-sans text-sm font-semibold">
            <ClockIcon className="h-4 w-4 text-gold-700" />
            Choose a time on {formatLongDate(date)}
          </h3>

          {grouped.length === 0 ? (
            <p className="mt-3 rounded-lg bg-cream-200 p-4 text-sm text-muted-dark">
              No slots left on this date. Try the next available day.
            </p>
          ) : (
            <div className="mt-4 space-y-5">
              {grouped.map((bucket) => (
                <div key={bucket.label}>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">
                    {bucket.label}
                  </p>
                  <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {bucket.slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => onTime(slot.time)}
                        aria-pressed={time === slot.time}
                        title={slot.available ? undefined : "Already booked"}
                        className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition-colors ${
                          time === slot.time
                            ? "border-ink bg-ink text-cream"
                            : slot.available
                              ? "border-cream-300 bg-white hover:border-ink"
                              : "cursor-not-allowed border-cream-200 bg-cream-200 text-muted-dark/45 line-through"
                        }`}
                      >
                        {formatTime12h(slot.time)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DetailsStep({
  details,
  errors,
  onChange,
}: {
  details: Details
  errors: Record<string, string>
  onChange: (patch: Partial<Details>) => void
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label="Full name"
        name="name"
        value={details.name}
        error={errors.name}
        autoComplete="name"
        placeholder="Thandi Nkosi"
        onChange={(value) => onChange({ name: value })}
      />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        value={details.phone}
        error={errors.phone}
        autoComplete="tel"
        placeholder="072 123 4567"
        onChange={(value) => onChange({ phone: value })}
      />
      <div className="sm:col-span-2">
        <Field
          label="Email address"
          name="email"
          type="email"
          value={details.email}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.co.za"
          hint="Your confirmation and calendar invite go here."
          onChange={(value) => onChange({ email: value })}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-sm font-semibold">
          Anything we should know?{" "}
          <span className="font-normal text-muted-dark">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={500}
          value={details.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
          placeholder="Allergies, a reference photo you'll bring, first time with textured hair, running slightly late…"
          className="mt-2 w-full rounded-lg border border-cream-300 bg-white px-4 py-3 text-sm"
        />
        <p className="mt-1.5 text-xs text-muted-dark">{details.notes.length}/500</p>
      </div>
    </div>
  )
}

function ReviewStep({
  service,
  barberName,
  date,
  time,
  details,
  onEdit,
}: {
  service: NonNullable<ReturnType<typeof serviceById>>
  barberName: string
  date: string
  time: string
  details: Details
  onEdit: (step: number) => void
}) {
  const rows = [
    { label: "Service", value: service.name, step: 0, Icon: ScissorsIcon },
    { label: "Barber", value: barberName, step: 1, Icon: UsersIcon },
    {
      label: "Date & time",
      value: `${formatLongDate(date)}, ${formatTime12h(time)} – ${formatTime12h(
        endTimeOf(time, service.duration),
      )}`,
      step: 2,
      Icon: CalendarIcon,
    },
    {
      label: "Your details",
      value: `${details.name}\n${details.email}\n${details.phone}`,
      step: 3,
      Icon: CheckIcon,
    },
  ]

  return (
    <div>
      <p className="text-muted-dark">
        Almost there — check everything below, then confirm. You&apos;ll get your calendar links
        straight after.
      </p>

      <ul className="mt-6 divide-y divide-cream-300 rounded-card border border-cream-300 bg-white">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-4 p-5">
            <row.Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">
                {row.label}
              </p>
              <p className="mt-1 whitespace-pre-line font-semibold">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="text-sm font-semibold text-gold-700 underline-offset-4 hover:underline"
            >
              Edit<span className="sr-only"> {row.label}</span>
            </button>
          </li>
        ))}

        {details.notes && (
          <li className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Your notes
            </p>
            <p className="mt-1 whitespace-pre-line text-sm">{details.notes}</p>
          </li>
        )}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-card bg-ink p-5 text-cream">
        <div>
          <p className="text-sm text-muted">Total payable at the shop</p>
          <p className="text-xs text-muted">{formatDuration(service.duration)} in the chair</p>
        </div>
        <p className="font-display text-3xl font-bold text-gold">{formatPrice(service.price)}</p>
      </div>
    </div>
  )
}

// ── Small pieces ──────────────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  error,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string
  name: string
  value: string
  error?: string
  hint?: string
  type?: string
  placeholder?: string
  autoComplete?: string
  onChange: (value: string) => void
}) {
  const describedBy = [error ? `${name}-error` : null, hint ? `${name}-hint` : null]
    .filter(Boolean)
    .join(" ")

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm ${
          error ? "border-red-500" : "border-cream-300"
        }`}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-muted-dark">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function SummaryRow({
  label,
  value,
  placeholder,
}: {
  label: string
  value?: string
  placeholder: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-cream-200 pb-4 last:border-0 last:pb-0">
      <dt className="shrink-0 text-muted-dark">{label}</dt>
      <dd
        className={`whitespace-pre-line text-right font-semibold ${
          value ? "" : "font-normal text-muted-dark/60"
        }`}
      >
        {value || placeholder}
      </dd>
    </div>
  )
}
