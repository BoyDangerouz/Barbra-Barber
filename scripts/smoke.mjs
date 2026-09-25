/**
 * Smoke test against a running server.
 *
 * Walks every route, flags suspect rendered output, then follows every image
 * URL the pages reference to prove nothing 404s. Run with the site up:
 *   node scripts/smoke.mjs [baseUrl]
 */

const base = process.argv[2] ?? "http://localhost:3100"

const routes = [
  "/",
  "/services",
  "/about",
  "/book",
  "/contact",
  "/terms",
  "/privacy",
  "/definitely-not-a-page",
  "/sitemap.xml",
  "/robots.txt",
]

const SUSPECT = /Application error|Internal Server Error|undefined<|>NaN<|\[object Object\]/

const images = new Set()
let failures = 0

console.log(`Routes  (${base})`)
for (const route of routes) {
  const response = await fetch(base + route)
  const html = await response.text()

  for (const match of html.matchAll(/(?:src|href)="(\/(?:_next\/image|images)[^"]*)"/g)) {
    images.add(match[1].replaceAll("&amp;", "&"))
  }

  const expected = route === "/definitely-not-a-page" ? 404 : 200
  const statusOk = response.status === expected
  const suspect = SUSPECT.test(html)
  if (!statusOk || suspect) failures++

  console.log(
    `  ${String(response.status).padEnd(4)}${route.padEnd(26)}` +
      `${String(html.length).padStart(7)} bytes` +
      `${statusOk ? "" : `  <-- expected ${expected}`}` +
      `${suspect ? "  <-- SUSPECT CONTENT" : ""}`,
  )
}

console.log(`\nImages  (${images.size} unique)`)
for (const url of images) {
  const response = await fetch(base + url)
  const type = response.headers.get("content-type") ?? "?"
  const size = (await response.arrayBuffer()).byteLength
  const ok = response.ok && type.startsWith("image/")
  if (!ok) failures++
  console.log(
    `  ${String(response.status).padEnd(4)}${type.padEnd(12)}${String(size).padStart(7)} b  ` +
      `${url.slice(0, 80)}${ok ? "" : "  <-- BROKEN"}`,
  )
}

console.log(failures ? `\n${failures} problem(s) found.` : "\nAll routes and images OK.")
process.exit(failures ? 1 : 0)
