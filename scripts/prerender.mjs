// Post-build prerender. Runs after `vite build` (see package.json) and turns
// the single SPA index.html into one static HTML file per route:
//
//   dist/index.html, dist/sage/index.html, dist/security/index.html, …
//
// Each file carries that route's <title>, meta description, canonical URL and
// OpenGraph/Twitter tags (from src/routeMeta.ts — the same data the SPA uses
// at runtime), plus a small static content shell inside #root so crawlers,
// link-preview bots, and no-JS visitors see real content instead of a blank
// page. React replaces the shell on mount. Because every route becomes a real
// file, GitHub Pages serves deep links with HTTP 200 — 404.html remains only
// for genuinely unknown paths. Also emits dist/sitemap.xml.
//
// Requires Node >= 22.6 (run with --experimental-strip-types to import the
// .ts metadata directly).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { ROUTE_META, SITE_ORIGIN } from '../src/routeMeta.ts'

const DIST = 'dist'
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

const HEAD_RE = /<!--route-head-start-->[\s\S]*?<!--route-head-end-->/
const OUTLET = '<!--prerender-outlet-->'
if (!HEAD_RE.test(template)) throw new Error('route-head markers missing from index.html')
if (!template.includes(OUTLET)) throw new Error('prerender outlet missing from index.html')

const esc = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const navLinks = ROUTE_META.filter((m) => !['/privacy', '/terms'].includes(m.path))
  .map((m) => {
    const label = m.path === '/' ? 'Overview' : esc(m.h1.split('—')[0].trim())
    return `<a href="${m.path}">${label}</a>`
  })
  .join('\n      ')

for (const meta of ROUTE_META) {
  const url = SITE_ORIGIN + (meta.path === '/' ? '/' : meta.path)

  const head = `<!--route-head-start-->
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Orb" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <!--route-head-end-->`

  const shell = `<div class="prerender">
      <p class="prerender__brand">Orb</p>
      <h1>${esc(meta.h1)}</h1>
      <p>${esc(meta.summary)}</p>
      <nav aria-label="All pages">
      ${navLinks}
      </nav>
    </div>`

  const html = template.replace(HEAD_RE, head).replace(OUTLET, shell)

  if (meta.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html)
    // Unknown paths fall through to 404.html, which boots the SPA; give it
    // the home shell so even that page has content while React loads.
    writeFileSync(join(DIST, '404.html'), html)
  } else {
    const dir = join(DIST, meta.path.slice(1))
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTE_META.map((m) => `  <url><loc>${SITE_ORIGIN + (m.path === '/' ? '/' : m.path)}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

console.log(`prerendered ${ROUTE_META.length} routes + sitemap.xml`)
