import type { Metadata } from "next"
import Link from "next/link"

import { LegalLayout, type LegalSection } from "@/components/legal-layout"
import { fullAddress, shop } from "@/lib/shop"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal information Barbra Barber collects when you book or contact us, why we collect it, how long we keep it, and the rights you have under POPIA.",
  alternates: { canonical: "/privacy" },
}

const sections: LegalSection[] = [
  {
    heading: "The short version",
    paragraphs: [
      "We collect the least we can get away with: enough to hold your appointment, remind you about it, and cut your hair well. We don't sell it, we don't share it for advertising, and you can ask us to delete it at any time.",
      "The rest of this page is the detail, written in plain language.",
    ],
  },
  {
    heading: "Who is responsible for your information",
    paragraphs: [
      `${shop.name}, of ${fullAddress}, is the responsible party for the personal information described here, as that term is used in the Protection of Personal Information Act 4 of 2013 (POPIA).`,
      `If you have a question about this policy or about your information, email ${shop.email} or call ${shop.phone} and ask for the manager on duty.`,
    ],
  },
  {
    heading: "What we collect",
    paragraphs: ["When you book an appointment through this website, we collect:"],
    list: [
      "Your name, so we know who's in the chair and can greet you properly.",
      "Your email address, so we can send your booking confirmation.",
      "Your mobile number, so we can reach you about that appointment — a delay, a barber off sick, a reminder the day before.",
      "The service, barber, date and time you selected.",
      "Anything you choose to write in the notes field, such as an allergy or a preference. Please only include what you're comfortable telling your barber.",
    ],
  },
  {
    heading: "What we don't collect",
    list: [
      "Payment card details. Nothing is charged online — you pay at the shop, and your card never touches this website.",
      "Advertising or tracking cookies. This site doesn't profile you or follow you around the internet.",
      "Any information about you from third parties.",
    ],
  },
  {
    heading: "Why we're allowed to use it",
    paragraphs: [
      "Under POPIA we need a lawful basis for processing your information. Ours are straightforward:",
    ],
    list: [
      "Performance of a contract: we can't hold an appointment for you without knowing who you are and how to reach you.",
      "Your consent: for anything optional, such as notes you choose to add, or marketing you've specifically opted into.",
      "Our legitimate interests: keeping basic records of bookings so we can run the shop, resolve disputes and understand how busy we are.",
      "Legal obligation: where tax or other law requires us to keep a record.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Booking records are kept for 24 months from your last appointment, so that a barber can see what worked last time and we can honour anything we've agreed with you.",
      "Messages sent through the contact form are kept for 12 months.",
      "After that, records are deleted or anonymised. Where tax law requires us to keep a financial record for longer, we keep only what the law requires and nothing else.",
    ],
  },
  {
    heading: "Who else sees it",
    paragraphs: [
      "Your information stays with us and the people who help us run the shop. Specifically:",
    ],
    list: [
      "Our barbers and front-of-house team, who need to know who is coming in and when.",
      "Our website hosting provider, which stores and serves this site.",
      "Our email and SMS providers, which deliver your confirmation and reminders.",
      "Professional advisers or authorities, but only where the law requires it.",
    ],
  },
  {
    heading: "Information sent outside South Africa",
    paragraphs: [
      "Some of the services we use to host this website and send email operate servers outside South Africa. Where that's the case, we only use providers that commit to a level of protection comparable to POPIA, and we send them no more than they need to do the job.",
    ],
  },
  {
    heading: "Your calendar links",
    paragraphs: [
      "After you book, we give you a link to add the appointment to your calendar. If you choose Google Calendar or Outlook, the appointment details are passed to that service as part of the link, by you, at the moment you click it — that's how those services work.",
      "The downloadable .ics option keeps everything on your own device. If you'd rather nothing went to a third party, use that one.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "This website uses no advertising or analytics cookies.",
      "We store one small item in your browser's local storage to remember that you've already seen the first-visit offer, so it doesn't pop up every single time you open the site. It contains a timestamp and nothing else. Clearing your browser data removes it.",
    ],
  },
  {
    heading: "Keeping it safe",
    paragraphs: [
      "This site is served over HTTPS, so what you type into the booking form is encrypted in transit. Access to booking records inside the shop is limited to staff who need it.",
      "No system is perfect. If something goes wrong in a way that puts your information at risk, we'll tell you and the Information Regulator as POPIA requires.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: ["Under POPIA you can, at any time and free of charge:"],
    list: [
      "Ask what personal information we hold about you.",
      "Ask us to correct anything that's wrong.",
      "Ask us to delete your information, where we're not required to keep it.",
      "Object to us using your information for a particular purpose.",
      "Withdraw consent you've previously given, including for marketing.",
      "Complain to the Information Regulator of South Africa if you think we've mishandled your information.",
    ],
  },
  {
    heading: "How to exercise those rights",
    paragraphs: [
      `Email ${shop.email} or call ${shop.phone}. We'll respond within 30 days, and usually a great deal sooner.`,
      "We may ask you to confirm your identity first — not to be difficult, but so we don't hand your details to someone else.",
      "If you'd rather take it further, the Information Regulator can be reached at inforeg@justice.gov.za.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Bookings must be made by someone 18 or over. Where an appointment is for a child, we collect only the child's first name and age where it affects the service, and we take those details from the responsible adult.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If we change how we handle your information, we'll update this page and change the date at the top. Material changes will be flagged on the site.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lead="What we collect when you book, why we need it, how long we keep it, and how to make us delete it. No jargon."
      updated="25 September 2026"
      sections={sections}
      footnote={
        <p>
          This policy works alongside our{" "}
          <Link href="/terms" className="font-semibold text-ink underline underline-offset-4">
            Terms &amp; Conditions
          </Link>
          . If anything here is unclear,{" "}
          <Link href="/contact" className="font-semibold text-ink underline underline-offset-4">
            ask us
          </Link>{" "}
          — we&apos;d rather explain it than have you guess.
        </p>
      }
    />
  )
}
