import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import { PromoModal } from "@/components/promo-modal"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { shop } from "@/lib/shop"

import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://barbra-barber.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${shop.name} — Barbershop in ${shop.address.city}`,
    template: `%s · ${shop.name}`,
  },
  description: shop.description,
  keywords: [
    "barber Cape Town",
    "barbershop Cape Town",
    "fade haircut Cape Town",
    "beard trim",
    "natural hair barber",
    shop.name,
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: shop.name,
    title: `${shop.name} — ${shop.strapline}`,
    description: shop.description,
    images: [{ url: "/images/hero.webp", width: 1920, height: 770, alt: `Inside ${shop.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${shop.name} — ${shop.strapline}`,
    description: shop.description,
    images: ["/images/hero.webp"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "light",
}

/** Schema.org HairSalon, so search engines get hours, prices and location. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: shop.name,
  description: shop.description,
  image: `${siteUrl}/images/hero.webp`,
  logo: `${siteUrl}/images/logo.png`,
  url: siteUrl,
  telephone: shop.phone,
  email: shop.email,
  priceRange: "R80 – R420",
  currenciesAccepted: "ZAR",
  address: {
    "@type": "PostalAddress",
    streetAddress: shop.address.line1,
    addressLocality: shop.address.city,
    addressRegion: "Western Cape",
    postalCode: shop.address.postalCode,
    addressCountry: "ZA",
  },
  geo: { "@type": "GeoCoordinates", latitude: shop.geo.lat, longitude: shop.geo.lng },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "17:00",
    },
  ],
  sameAs: Object.values(shop.social),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-ZA"
      className={`${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <PromoModal />

        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
