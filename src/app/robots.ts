import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://barbra-barber.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Generated per booking; there is nothing useful to index.
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
