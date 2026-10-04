// ─── Every route's title and description, in one place ───
// App.tsx sets document.title from TITLES on every navigation, and
// scripts/postbuild.mjs writes the same title and description into each
// route's static HTML, so the browser tab, a bookmark and a shared link all
// say the same thing. postbuild imports this file as TypeScript, which needs
// Node 22.18 or later (type stripping); the deploy workflow pins Node 22.
import { MODULE_PAGES } from './modulePages.ts'
import { PLANS_LEDE } from './plans.ts'

export interface PageMeta { route: string; title: string; description: string }

export const PAGES: PageMeta[] = [
  { route: '/', title: 'Orb: Hospital software that never leaves the building', description: 'One computer in your building runs the ward record, the NEWS2 score, the drug chart, the case rooms and the models. Nothing about a patient leaves it.' },
  { route: '/modules', title: 'The modules | Orb', description: 'Fourteen modules, each shown as a real screen of the product on demo patients, each with a page that walks its workflow.' },
  // The Plans page description is the page's own lede, so the two cannot drift.
  { route: '/plans', title: 'Plans | Orb', description: PLANS_LEDE },
  { route: '/security', title: 'Security brief | Orb', description: 'Nothing leaves the building. The appliance, the models and the hash-chained audit log, with the admin screens they are checked on.' },
  { route: '/support', title: 'Support | Orb', description: 'Write to me, book a walkthrough of the product on demo patients, or find the answer below.' },
  // Module pages read their copy from the data file.
  ...MODULE_PAGES.map(p => ({ route: p.route, title: `${p.title}: ${p.badge} | Orb`, description: p.tagline })),
]

/** Route → browser tab title. */
export const TITLES: Record<string, string> = Object.fromEntries(PAGES.map(p => [p.route, p.title]))
