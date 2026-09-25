/**
 * Single source of truth for the business details.
 *
 * Everything user-facing that mentions an address, a phone number or an
 * opening time reads from here, so the footer, contact page, calendar events
 * and structured data can never drift apart.
 */

export const shop = {
  name: "Barbra Barber",
  tagline: "Cuts · Care · Confidence",
  strapline: "More than a haircut. It's a whole vibe.",
  description:
    "Premium grooming, confidence and community for every style, every story. " +
    "A Cape Town barbershop built around great cuts and the people in the chair.",

  address: {
    line1: "121 Main Street",
    suburb: "Gardens",
    city: "Cape Town",
    postalCode: "8001",
    country: "South Africa",
  },

  phone: "+27 74 471 1961",
  /** E.164, for tel: links */
  phoneHref: "+27744711961",
  /** Digits only, for wa.me links */
  whatsapp: "27744711961",
  email: "hello@barbrabarber.co.za",

  /** IANA zone. SAST is a fixed UTC+2 with no daylight saving. */
  timeZone: "Africa/Johannesburg",
  utcOffsetMinutes: 120,

  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    x: "https://x.com/",
  },

  /** Approximate; used for the map embed and directions link. */
  geo: { lat: -33.9296, lng: 18.4174 },
} as const

export const fullAddress = [
  shop.address.line1,
  shop.address.suburb,
  `${shop.address.city}, ${shop.address.postalCode}`,
  shop.address.country,
].join(", ")

/** Compact form used in calendar events, where a single line reads better. */
export const shortAddress = `${shop.address.line1}, ${shop.address.suburb}, ${shop.address.city} ${shop.address.postalCode}`

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${shop.name}, ${fullAddress}`,
)}`

export const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
  shop.geo.lng - 0.008
}%2C${shop.geo.lat - 0.005}%2C${shop.geo.lng + 0.008}%2C${
  shop.geo.lat + 0.005
}&layer=mapnik&marker=${shop.geo.lat}%2C${shop.geo.lng}`

/**
 * Opening hours, indexed by JavaScript's `Date.getDay()` (0 = Sunday).
 * `null` means closed. Times are 24h local (SAST).
 */
export type DayHours = { open: string; close: string } | null

export const openingHours: readonly DayHours[] = [
  null, // Sunday
  { open: "08:00", close: "19:00" }, // Monday
  { open: "08:00", close: "19:00" }, // Tuesday
  { open: "08:00", close: "19:00" }, // Wednesday
  { open: "08:00", close: "19:00" }, // Thursday
  { open: "08:00", close: "19:00" }, // Friday
  { open: "08:00", close: "17:00" }, // Saturday
]

/** Grouped for display, so the footer doesn't list seven near-identical rows. */
export const openingHoursDisplay = [
  { days: "Monday – Friday", hours: "08:00 – 19:00" },
  { days: "Saturday", hours: "08:00 – 17:00" },
  { days: "Sunday", hours: "Closed" },
] as const

/** Last appointment must finish by closing time. */
export const LAST_BOOKING_BUFFER_MINUTES = 0

/** How far ahead the booking calendar lets customers reach. */
export const BOOKING_WINDOW_DAYS = 60

export function isOpenOn(date: Date): boolean {
  return openingHours[date.getDay()] !== null
}
