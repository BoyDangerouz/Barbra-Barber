import type { Metadata } from "next"
import Link from "next/link"

import { LegalLayout, type LegalSection } from "@/components/legal-layout"
import { fullAddress, shop } from "@/lib/shop"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you book an appointment, visit the shop or use the Barbra Barber website — including cancellations, late arrivals, pricing and your rights.",
  alternates: { canonical: "/terms" },
}

const sections: LegalSection[] = [
  {
    heading: "Who we are and what these terms cover",
    paragraphs: [
      `${shop.name} ("we", "us", "our") is a barbershop trading at ${fullAddress}. These terms apply whenever you book an appointment with us, visit the shop, or use this website.`,
      "By making a booking through this website you accept these terms. If you don't agree with them, please don't book online — call us instead and we'll talk it through.",
      "Nothing in these terms limits your rights under the Consumer Protection Act 68 of 2008 or any other South African law that cannot be excluded by agreement.",
    ],
  },
  {
    heading: "Making a booking",
    paragraphs: [
      "A booking is confirmed once you complete the online booking form and receive a booking reference on screen. That reference is your proof of the appointment — keep it handy.",
      "We hold the chair for the full duration shown against your chosen service. We don't double-book, which is why the time you pick is genuinely yours.",
    ],
    list: [
      "You must be 18 or older to make a booking. Appointments for under-18s must be made and attended by a parent or guardian.",
      "Please give us accurate contact details. If we can't reach you, we can't warn you about a delay or confirm a change.",
      "Requesting a specific barber is a request, not a guarantee. If illness or an emergency means they aren't in, we'll contact you to rebook or offer another barber.",
    ],
  },
  {
    heading: "Prices and payment",
    paragraphs: [
      "All prices shown on this website are in South African Rand and include VAT where applicable. No payment is taken when you book online — you settle at the shop after your appointment.",
      "We accept card, cash, SnapScan and EFT.",
      "The price shown for a service is the price for that service as described. If, during your consultation, it becomes clear you need something different — more time, a different treatment, a colour correction — your barber will tell you what it costs before starting. We will never add a charge you haven't agreed to.",
    ],
  },
  {
    heading: "Changing or cancelling your appointment",
    paragraphs: [
      "Plans change and we understand that. We only ask for enough notice to offer the slot to someone else.",
    ],
    list: [
      "More than 12 hours before your appointment: change or cancel free of charge, by phone, WhatsApp or email.",
      "Less than 12 hours before, or a no-show: we may ask for 50% of the service price before your next booking, because that chair stayed empty.",
      "If you're genuinely ill or something serious has happened, tell us. We'd rather you stayed home and we'll waive the fee.",
      "If we have to cancel or move your appointment, we'll contact you as soon as we know and offer you the next slot that suits you.",
    ],
  },
  {
    heading: "Arriving late",
    paragraphs: [
      "Please arrive about five minutes before your appointment so we can start on time.",
      "If you're running more than 10 minutes late, we may need to shorten your service to protect the appointment after yours, at the full price. If you're more than 15 minutes late we may have to treat it as a missed appointment and rebook you.",
      "Call us if you're stuck in traffic — where the day allows it, we'll do our best to make it work.",
    ],
  },
  {
    heading: "Consultations, results and your hair",
    paragraphs: [
      "Every service starts with a consultation. We'll tell you honestly what will and won't work with your hair type, length, density and condition, and we'd rather talk you out of a style than deliver one that disappoints you.",
      "Hair is not identical from person to person. A cut, colour or treatment may not produce exactly the result shown in a reference photograph, and we can't guarantee an outcome that your hair's condition or growth pattern doesn't allow.",
      "If you're unhappy with your cut, tell us within seven days and come back in. Where the result doesn't match what we agreed in your consultation, we'll put it right at no charge. This does not affect your rights under the Consumer Protection Act.",
    ],
  },
  {
    heading: "Health, allergies and patch tests",
    paragraphs: [
      "Please tell your barber about allergies, skin conditions, recent treatments, medication affecting your skin or scalp, or anything else relevant before we start.",
      "Colour services require a patch test at least 48 hours beforehand. We cannot carry out a colour service without one, and we may need to turn away a colour booking made at short notice for this reason.",
      "We reserve the right to decline a service where we believe it would damage your hair or scalp, or where an active infection or infestation is present. We'll always explain why, discreetly.",
    ],
  },
  {
    heading: "Children in the shop",
    paragraphs: [
      "Children are genuinely welcome — we cut a lot of children's hair and we're good at it.",
      "Children must be supervised by an accompanying adult at all times. Barbering involves sharp tools and hot towels, and the shop floor isn't a safe place to play.",
    ],
  },
  {
    heading: "Behaviour in the shop",
    paragraphs: [
      "This shop was built to be a space where everyone is comfortable. We do not tolerate racist, sexist, homophobic, transphobic or otherwise abusive behaviour towards our team or other clients, and we will ask anyone behaving that way to leave.",
      "We may refuse service to anyone who is intoxicated, threatening or abusive.",
    ],
  },
  {
    heading: "Personal belongings",
    paragraphs: [
      "Please keep your belongings with you. We can't accept responsibility for loss of or damage to personal property brought into the shop, except where the loss results from our own negligence.",
    ],
  },
  {
    heading: "Gift vouchers and promotions",
    list: [
      "Gift vouchers are valid for 36 months from the date of issue, in line with the Consumer Protection Act.",
      "Vouchers can be used against any service but are not exchangeable for cash.",
      "Promotional discounts, including the first-visit discount, apply to one appointment per person, cannot be combined with another offer, and may be withdrawn at any time.",
      "The first-visit discount applies only to a client's first appointment with us.",
    ],
  },
  {
    heading: "This website",
    paragraphs: [
      "We work to keep everything on this site accurate and available, but we don't guarantee that it will be uninterrupted or error-free. Prices, services, opening hours and barber availability may change.",
      "The content of this site — including our name, logo, photography and written copy — belongs to us and may not be reproduced without permission.",
      "The booking system shows live availability at the time you load the page. In the rare event that two people select the same slot at the same moment, we'll contact the second booking to rearrange.",
    ],
  },
  {
    heading: "Your personal information",
    paragraphs: [
      "We handle your personal information in line with the Protection of Personal Information Act 4 of 2013 (POPIA). How we collect, use and store it is set out in our Privacy Policy.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The version published on this page at the moment you make a booking is the version that applies to that booking.",
    ],
  },
  {
    heading: "Governing law and getting in touch",
    paragraphs: [
      "These terms are governed by the laws of the Republic of South Africa.",
      `If something has gone wrong, please talk to us first — most things are sorted out in a five-minute conversation. Call ${shop.phone}, email ${shop.email}, or come into the shop and ask for the manager on duty.`,
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      lead="The agreement between you and Barbra Barber when you book with us, visit the shop, or use this website. Written to be read, not skipped."
      updated="25 September 2026"
      sections={sections}
      footnote={
        <p>
          These terms sit alongside our{" "}
          <Link href="/privacy" className="font-semibold text-ink underline underline-offset-4">
            Privacy Policy
          </Link>
          , which explains what we do with your personal information. Questions about either?{" "}
          <Link href="/contact" className="font-semibold text-ink underline underline-offset-4">
            Get in touch
          </Link>{" "}
          and a real person will answer.
        </p>
      }
    />
  )
}
