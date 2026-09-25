"use client"

import { useEffect, useState } from "react"

import { ServiceRow } from "@/components/service-card"
import { serviceCategories, services, type ServiceCategory } from "@/lib/services"

type Filter = ServiceCategory | "all"

const isCategory = (value: string): value is ServiceCategory =>
  serviceCategories.some((category) => category.id === value)

export function ServicesExplorer() {
  const [filter, setFilter] = useState<Filter>("all")

  // Honour deep links like /services#beard coming from the footer.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (isCategory(hash)) setFilter(hash)
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  const visibleCategories =
    filter === "all" ? serviceCategories : serviceCategories.filter((c) => c.id === filter)

  const shown = services.filter((s) => filter === "all" || s.category === filter)

  return (
    <>
      {/* Offsets match the header: 72px bar, plus the 36px utility strip from md up. */}
      <div className="sticky top-[72px] z-30 border-b border-cream-300 bg-cream/95 py-4 backdrop-blur md:top-[108px]">
        <div
          role="tablist"
          aria-label="Filter services by category"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterPill>
          {serviceCategories.map((category) => (
            <FilterPill
              key={category.id}
              active={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </FilterPill>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-dark" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "service" : "services"}
        {filter !== "all" && ` in ${serviceCategories.find((c) => c.id === filter)?.label}`}.
      </p>

      <div className="mt-8 space-y-14">
        {visibleCategories.map((category) => {
          const inCategory = services.filter((s) => s.category === category.id)
          if (!inCategory.length) return null

          return (
            <section key={category.id} id={category.id} className="scroll-mt-40">
              <h2 className="display-3 flex items-center gap-4">
                {category.label}
                <span className="h-px flex-1 bg-cream-300" />
                <span className="font-sans text-sm font-normal text-muted-dark">
                  {inCategory.length} {inCategory.length === 1 ? "option" : "options"}
                </span>
              </h2>

              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {inCategory.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-cream"
          : "border-cream-300 bg-white text-muted-dark hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  )
}
