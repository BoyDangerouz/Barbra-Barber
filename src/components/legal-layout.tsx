import Link from "next/link"

import { PageHero } from "@/components/page-hero"

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  list?: string[]
}

/** Shared shell and typography for the Terms and Privacy pages. */
export function LegalLayout({
  eyebrow,
  title,
  lead,
  updated,
  sections,
  footnote,
}: {
  eyebrow: string
  title: string
  lead: string
  updated: string
  sections: LegalSection[]
  footnote?: React.ReactNode
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead}>
        <p className="mt-8 text-sm text-muted">Last updated: {updated}</p>
      </PageHero>

      <section className="section bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-12">
          {/* Contents */}
          <nav aria-label="On this page" className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">
                On this page
              </h2>
              <ol className="mt-4 space-y-2.5 text-sm">
                {sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${index + 1}`}
                      className="text-muted-dark underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {index + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* Body */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-10">
              {sections.map((section, index) => (
                <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-32">
                  <h2 className="display-3">
                    {index + 1}. {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 leading-relaxed text-muted-dark">
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3 leading-relaxed text-muted-dark">
                          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {footnote && (
              <div className="mt-12 rounded-card bg-cream-200 p-7 text-sm leading-relaxed text-muted-dark">
                {footnote}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-outline-dark btn-sm">
                Contact us about this
              </Link>
              <Link href="/book" className="btn btn-ghost-dark btn-sm">
                Book an appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
