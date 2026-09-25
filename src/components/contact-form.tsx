"use client"

import { useState } from "react"

import { ArrowRightIcon, CheckCircleIcon } from "@/components/icons"
import { shop } from "@/lib/shop"

const TOPICS = [
  "General enquiry",
  "Change or cancel a booking",
  "Group or event booking",
  "Products & stockists",
  "Work with us",
  "Feedback",
] as const

type Status = "idle" | "sending" | "sent"

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0] as string,
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [formError, setFormError] = useState<string | null>(null)

  const update = (patch: Partial<typeof form>) => {
    setForm((current) => ({ ...current, ...patch }))
    setErrors((current) => {
      const next = { ...current }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    const next: Record<string, string> = {}
    if (form.name.trim().length < 2) next.name = "Please tell us your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address."
    if (form.message.trim().length < 10) next.message = "A little more detail would help us answer properly."

    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setStatus("sending")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setFormError(data?.error ?? "We couldn't send that just now. Please try again.")
        setStatus("idle")
        return
      }
      setStatus("sent")
    } catch {
      setFormError(
        `We couldn't reach the server. Please email us directly at ${shop.email} or call ${shop.phone}.`,
      )
      setStatus("idle")
    }
  }

  if (status === "sent") {
    return (
      <div className="card-light p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-700">
          <CheckCircleIcon className="h-8 w-8" />
        </span>
        <h3 className="display-3 mt-5">Message sent</h3>
        <p className="mt-3 text-muted-dark">
          Thanks {form.name.split(" ")[0]} — we&apos;ve got it. Someone from the shop will come back
          to you at {form.email}, usually within one working day.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", email: "", topic: TOPICS[0], message: "" })
            setStatus("idle")
          }}
          className="btn btn-outline-dark mt-7"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-light space-y-5 p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="contact-name"
          value={form.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => update({ name: value })}
        />
        <Field
          label="Email address"
          name="contact-email"
          type="email"
          value={form.email}
          error={errors.email}
          autoComplete="email"
          onChange={(value) => update({ email: value })}
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="block text-sm font-semibold">
          What&apos;s it about?
        </label>
        <select
          id="contact-topic"
          value={form.topic}
          onChange={(event) => update({ topic: event.target.value })}
          className="mt-2 w-full rounded-lg border border-cream-300 bg-white px-4 py-3 text-sm"
        >
          {TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          maxLength={1500}
          value={form.message}
          onChange={(event) => update({ message: event.target.value })}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm ${
            errors.message ? "border-red-500" : "border-cream-300"
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {formError}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full">
        {status === "sending" ? "Sending…" : "Send Message"}
        {status !== "sending" && <ArrowRightIcon className="h-4 w-4" />}
      </button>

      <p className="text-xs leading-relaxed text-muted-dark">
        Looking to book? The{" "}
        <a href="/book" className="font-semibold text-ink underline underline-offset-4">
          booking form
        </a>{" "}
        is faster — you&apos;ll get a confirmed slot straight away.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: {
  label: string
  name: string
  value: string
  error?: string
  type?: string
  autoComplete?: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm ${
          error ? "border-red-500" : "border-cream-300"
        }`}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
