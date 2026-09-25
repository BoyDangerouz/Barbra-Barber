import Image from "next/image"

/** Dark banner that opens every page other than the home page. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image = "/images/hero.webp",
  imagePosition = "60% 35%",
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lead?: string
  /** Background photograph, dimmed behind the copy. */
  image?: string
  imagePosition?: string
  children?: React.ReactNode
}) {
  return (
    <section className="on-ink relative isolate overflow-hidden bg-ink">
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        style={{ objectPosition: imagePosition }}
        className="-z-10 object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-ink/85 via-ink/90 to-ink" />

      <div className="shell py-16 md:py-24">
        <p className="eyebrow-light rule-gold">{eyebrow}</p>
        <h1 className="display-1 mt-7 max-w-3xl text-cream">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
