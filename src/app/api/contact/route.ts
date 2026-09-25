import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  email: z.email("Please enter a valid email address.").max(120),
  topic: z.string().trim().min(2).max(60),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail would help us answer properly.")
    .max(1500),
})

/**
 * Receives a message from the contact page.
 *
 * Like the booking route, this validates server-side and logs rather than
 * sending mail — wiring in a transactional email provider is a drop-in
 * replacement for the `console.info` below.
 */
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form")
      fieldErrors[field] ??= issue.message
    }
    return NextResponse.json({ error: "Please check the form.", fieldErrors }, { status: 400 })
  }

  console.info(`[contact] ${parsed.data.topic} from ${parsed.data.name} <${parsed.data.email}>`)

  return NextResponse.json({ received: true }, { status: 202 })
}
