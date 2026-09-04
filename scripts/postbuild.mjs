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

const DIST = 'dist'
const SITE = 'https://orbsuite.com'
const shell = readFileSync(join(DIST, 'index.html'), 'utf8')

// Route → title, description. Module pages read their copy from the data file.
const src = readFileSync('src/data/modulePages.ts', 'utf8')
const modules = [...src.matchAll(/route: '([^']+)',\s*title: '([^']+)',\s*badge: '([^']+)',\s*tagline: '((?:[^'\\]|\\.)+)'/g)]
  .map(m => ({ route: m[1], title: `${m[2]}: ${m[3]} | Orb`, description: m[4].replace(/\\'/g, "'") }))

const pages = [
  { route: '/', title: 'Orb Hospital OS', description: 'The record, the ward monitor, the pharmacy and the front desk on one appliance inside the hospital. The models run there too, so nothing about a patient leaves the building.' },
  { route: '/plans', title: 'Plans | Orb', description: 'A thirteen-week pilot on one ward, then per-bed pricing for the whole hospital. No tier withholds a safety feature.' },
  { route: '/security', title: 'Security brief | Orb', description: 'What leaves the building: nothing. The appliance, the models and the hash-chained audit log, with the admin screens they are checked on.' },
  { route: '/support', title: 'Support | Orb', description: 'Write to the team, book a walkthrough of the running product, or find the answer below.' },
  ...modules,
]

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
