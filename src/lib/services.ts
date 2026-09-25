/** The service menu. Prices in ZAR, durations in minutes. */

export const serviceCategories = [
  { id: "haircuts", label: "Haircuts" },
  { id: "fades", label: "Fades" },
  { id: "beard", label: "Beard" },
  { id: "kids", label: "Kids" },
  { id: "styling", label: "Styling" },
  { id: "packages", label: "Packages" },
] as const

export type ServiceCategory = (typeof serviceCategories)[number]["id"]

export type Service = {
  id: string
  name: string
  category: ServiceCategory
  /** ZAR */
  price: number
  /** minutes */
  duration: number
  description: string
  /** Shown on the services page and in the booking summary. */
  includes?: string[]
  popular?: boolean
}

export const services: Service[] = [
  // ── Haircuts ────────────────────────────────────────────────────────────
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    category: "haircuts",
    price: 150,
    duration: 30,
    description:
      "A clean, considered cut shaped to your head and hair type, finished with a neck shave and styling.",
    includes: ["Consultation", "Wash & cut", "Neck shave", "Style finish"],
    popular: true,
  },
  {
    id: "signature-cut",
    name: "Signature Cut & Style",
    category: "haircuts",
    price: 220,
    duration: 45,
    description:
      "Our full-service cut. Extra time in the chair for detailed shaping, a hot towel and a proper blow-out or style.",
    includes: ["Extended consultation", "Wash & cut", "Hot towel", "Style & product"],
  },
  {
    id: "head-shave",
    name: "Bald Head Shave",
    category: "haircuts",
    price: 140,
    duration: 30,
    description:
      "A smooth razor shave with hot towel prep and a soothing balm to keep the scalp comfortable.",
    includes: ["Hot towel prep", "Razor shave", "Aftershave balm"],
  },

  // ── Fades ───────────────────────────────────────────────────────────────
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "fades",
    price: 180,
    duration: 40,
    description:
      "A crisp fade down to the skin, blended clean through the sides and back with a sharp line-up.",
    includes: ["Consultation", "Skin fade", "Line-up", "Style finish"],
    popular: true,
  },
  {
    id: "taper-fade",
    name: "Taper Fade",
    category: "fades",
    price: 170,
    duration: 35,
    description:
      "A softer gradient around the ears and neckline that keeps length on top. Grows out beautifully.",
    includes: ["Consultation", "Taper fade", "Neckline detail"],
  },
  {
    id: "line-up",
    name: "Line-Up & Edge-Up",
    category: "fades",
    price: 80,
    duration: 15,
    description:
      "A quick reset between cuts. Sharpens the hairline, temples and neckline so you look fresh again.",
    includes: ["Hairline detail", "Neckline clean-up"],
  },

  // ── Beard ───────────────────────────────────────────────────────────────
  {
    id: "beard-trim",
    name: "Beard Trim & Shape",
    category: "beard",
    price: 120,
    duration: 20,
    description:
      "Shaped, evened out and lined up, with the cheek and neck lines defined to suit your face.",
    includes: ["Beard shaping", "Line detail", "Beard oil"],
    popular: true,
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    category: "beard",
    price: 180,
    duration: 40,
    description:
      "The traditional wet shave. Hot towels, pre-shave oil, a straight razor and a cooling finish.",
    includes: ["Hot towel prep", "Pre-shave oil", "Straight razor shave", "Cooling balm"],
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt & Oil Treatment",
    category: "beard",
    price: 160,
    duration: 30,
    description:
      "A longer beard session with deep conditioning, sculpting and a treatment that softens coarse growth.",
    includes: ["Deep conditioning", "Sculpt & shape", "Oil treatment"],
  },

  // ── Kids ────────────────────────────────────────────────────────────────
  {
    id: "kids-cut",
    name: "Kids Cut (12 & under)",
    category: "kids",
    price: 100,
    duration: 30,
    description:
      "A patient, friendly cut for young legends. We take our time and the chair is never a battle.",
    includes: ["Consultation with parent", "Cut & style"],
    popular: true,
  },
  {
    id: "kids-fade",
    name: "Kids Fade",
    category: "kids",
    price: 130,
    duration: 35,
    description:
      "The same sharp fade the grown-ups get, sized down and done at a pace that works for them.",
    includes: ["Fade", "Line-up", "Style finish"],
  },

  // ── Styling & treatments ────────────────────────────────────────────────
  {
    id: "natural-treatment",
    name: "Natural Hair Treatment",
    category: "styling",
    price: 260,
    duration: 60,
    description:
      "A moisture-first treatment for natural and textured hair. Cleanse, deep condition, detangle and define.",
    includes: ["Cleanse", "Deep conditioning", "Detangle", "Definition & finish"],
  },
  {
    id: "twist-styling",
    name: "Twist & Sponge Curl Styling",
    category: "styling",
    price: 200,
    duration: 45,
    description:
      "Twists or sponge curls worked through your natural texture for definition that holds.",
    includes: ["Prep & product", "Twist or sponge styling", "Finish"],
  },
  {
    id: "scalp-treatment",
    name: "Scalp Treatment",
    category: "styling",
    price: 180,
    duration: 30,
    description:
      "For dryness, flaking or irritation. An exfoliating cleanse and a treatment massage that calms things down.",
    includes: ["Exfoliating cleanse", "Treatment massage", "Aftercare advice"],
  },
  {
    id: "grey-blending",
    name: "Colour & Grey Blending",
    category: "styling",
    price: 320,
    duration: 60,
    description:
      "Softens grey rather than erasing it, matched to your natural tone for a result nobody can pick out.",
    includes: ["Colour consultation", "Patch-test advice", "Application & rinse", "Style finish"],
  },

  // ── Packages ────────────────────────────────────────────────────────────
  {
    id: "full-works",
    name: "The Full Works",
    category: "packages",
    price: 420,
    duration: 90,
    description:
      "Our signature cut, a full beard sculpt and a hot towel shave finish. The whole chair, start to end.",
    includes: ["Signature cut & style", "Beard sculpt", "Hot towel finish", "Product & aftercare"],
    popular: true,
  },
  {
    id: "cut-and-beard",
    name: "Cut & Beard Trim",
    category: "packages",
    price: 250,
    duration: 60,
    description:
      "The pairing most of our regulars book. A classic cut and a shaped beard in one sitting.",
    includes: ["Classic haircut", "Beard trim & shape", "Beard oil"],
  },
  {
    id: "father-and-son",
    name: "Father & Son",
    category: "packages",
    price: 230,
    duration: 60,
    description:
      "One adult cut and one kids cut, booked back to back in neighbouring chairs. Bring the camera.",
    includes: ["Adult classic haircut", "Kids cut", "Side-by-side chairs"],
  },
]

/**
 * Photography per category. Kept in one place so dropping in new artwork is
 * a single edit rather than a hunt through the components.
 */
export const categoryImage: Record<ServiceCategory, string> = {
  haircuts: "/images/service-haircut.webp",
  fades: "/images/service-fade.webp",
  beard: "/images/service-beard.webp",
  kids: "/images/service-kids.webp",
  styling: "/images/service-styling.webp",
  packages: "/images/service-package.webp",
}

/**
 * Photography for individual services, where we have a shot that suits one
 * better than its category default. Anything not listed here falls back to
 * `categoryImage`, so adding artwork is a one-line change.
 */
const serviceImage: Record<string, string> = {
  "signature-cut": "/images/service-twists.webp",
  "head-shave": "/images/service-shave.webp",
  "taper-fade": "/images/service-lineup.webp",
  "line-up": "/images/service-lineup.webp",
  "hot-towel-shave": "/images/service-shave.webp",
  "twist-styling": "/images/service-twists.webp",
  "scalp-treatment": "/images/service-twists.webp",
  "grey-blending": "/images/service-lineup.webp",
  "cut-and-beard": "/images/service-fade.webp",
  "father-and-son": "/images/service-kids.webp",
}

export const imageForService = (service: Service): string =>
  serviceImage[service.id] ?? categoryImage[service.category]

export const serviceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id)

/** Cheapest price in a category, for the "from R___" labels. */
export const priceFrom = (category: ServiceCategory): number =>
  Math.min(...services.filter((s) => s.category === category).map((s) => s.price))

export const popularServices = services.filter((s) => s.popular)

/** ZAR formatting, used everywhere a price is rendered. */
export const formatPrice = (rands: number): string =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(rands)
    .replace(/\s/g, " ") // keep "R 150" from wrapping mid-price

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`
}
