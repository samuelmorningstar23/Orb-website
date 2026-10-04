// After `vite build`: make the static host serve every route with a 200 and a
// title of its own, and give the site the files a shared link needs.
//
// GitHub Pages has no SPA rewrite. Serving 404.html with the app shell keeps
// deep links working but still answers 404, so search engines and link previews
// see an error. Writing dist/<route>/index.html for every known route answers
// 200 instead. Each copy also carries that route's title and description, so a
// shared /vigil link previews as Vigil, not as the homepage.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
// Route → title, description: the same list the app uses for the tab title, so
// the two cannot drift. Importing the TypeScript data file needs Node 22.18 or
// later (type stripping); the deploy workflow pins Node 22.
import { PAGES as pages } from '../src/data/pageMeta.ts'

const DIST = 'dist'
const SITE = 'https://orbsuite.com'
const shell = readFileSync(join(DIST, 'index.html'), 'utf8')

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const withMeta = p => shell
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(p.description)}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(p.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(p.description)}" />`)
  .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE}${p.route}" />`)
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}${p.route}" />`)

for (const p of pages) {
  const html = withMeta(p)
  if (p.route === '/') { writeFileSync(join(DIST, 'index.html'), html); continue }
  const dir = join(DIST, p.route.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
// Unknown paths still boot the app (the router sends them home).
copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'))

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(p => `  <url><loc>${SITE}${p.route}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n')
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
if (!existsSync(join(DIST, 'CNAME'))) writeFileSync(join(DIST, 'CNAME'), 'orbsuite.com\n')
console.log(`postbuild: ${pages.length} routes, sitemap, robots, 404`)
