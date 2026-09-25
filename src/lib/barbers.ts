import type { ServiceCategory } from "./services"

export type Barber = {
  id: string
  name: string
  role: string
  bio: string
  /** Drives the "recommended barber" hint in the booking wizard. */
  specialties: ServiceCategory[]
  specialtyLabel: string
  yearsExperience: number
  /**
   * Path under /public, or null while artwork is outstanding. The profile
   * card falls back to a branded monogram so a missing file can never render
   * as a broken image.
   */
  image: string | null
}

export const barbers: Barber[] = [
  {
    id: "barbra",
    name: "Barbra Mokoena",
    role: "Founder & Lead Barber",
    bio:
      "Barbra opened the shop in 2019 after twelve years behind other people's chairs, tired of watching " +
      "clients with textured hair get turned away. She cuts everything, but fades and natural hair are where " +
      "she is happiest — and she will talk you out of a style that won't suit you.",
    specialties: ["fades", "styling"],
    specialtyLabel: "Fades, natural hair & transformations",
    yearsExperience: 12,
    image: "/images/barber-barbra.webp",
  },
  {
    id: "neo",
    name: "Neo Dlamini",
    role: "Senior Barber",
    bio:
      "Neo is the one to book if you want your beard taken seriously. Trained in traditional wet shaving and " +
      "obsessive about a clean line, he has the steadiest hand in the shop and the driest sense of humour.",
    specialties: ["beard", "haircuts"],
    specialtyLabel: "Clean cuts, beard work & hot towel shaves",
    yearsExperience: 8,
    image: "/images/barber-neo.webp",
  },
  {
    id: "zuri",
    name: "Zuri Khumalo",
    role: "Barber",
    bio:
      "Zuri came up through our apprenticeship programme and now runs the third chair. Precise, fast, and the " +
      "only person on the team who can keep a nervous six-year-old still for a full cut.",
    specialties: ["kids", "haircuts", "packages"],
    specialtyLabel: "Precision cuts, kids' styles & creative designs",
    yearsExperience: 4,
    image: "/images/barber-zuri.webp",
  },
]

export const barberById = (id: string): Barber | undefined =>
  barbers.find((b) => b.id === id)

/** Sentinel used by the booking wizard when the customer has no preference. */
export const ANY_BARBER = "any" as const

export const barberLabel = (id: string): string =>
  id === ANY_BARBER ? "First available barber" : (barberById(id)?.name ?? "Our team")

export const initialsOf = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
