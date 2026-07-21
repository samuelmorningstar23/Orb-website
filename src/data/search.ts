import { ALL_MODULES, PLANS, CONTACT_EMAIL } from './siteContent'

// ─── Site search: keyword lookup + lightweight question answering ───
// Everything is indexed client-side (the site is static), so search works
// offline and never sends a query anywhere.

export type SearchAction = 'demo' | 'mail'

export interface SearchEntry {
  id: string
  kind: 'module' | 'page' | 'plan' | 'action' | 'answer'
  title: string
  subtitle?: string
  /** Route to navigate to on selection (mutually exclusive with `action`). */
  to?: string
  action?: SearchAction
  /** Long-form answer text — only present on `answer` entries. */
  answer?: string
  keywords: string[]
  body?: string
}

export interface SearchResults {
  /** Best-matching Q&A entry, when the query reads like a question it can answer. */
  answer: SearchEntry | null
  /** Ranked pages, modules, plans, and actions. */
  results: SearchEntry[]
}

const MODULE_ENTRIES: SearchEntry[] = ALL_MODULES.map(m => ({
  id: `module${m.to.replace(/\//g, '-')}`,
  kind: 'module',
  title: m.label,
  subtitle: m.badge,
  to: m.to,
  keywords: [...m.keywords, 'module', m.label.toLowerCase()],
  body: m.blurb,
}))

const PLAN_ENTRIES: SearchEntry[] = PLANS.map(p => ({
  id: `plan-${p.id}`,
  kind: 'plan',
  title: p.name,
  subtitle: `${p.tagline} ${p.audience}.`,
  to: `/plans#${p.id}`,
  keywords: ['plan', 'pricing', 'tier', 'edition', p.id, p.name.toLowerCase()],
  body: `${p.desc} ${p.includes.join(' ')}`,
}))

const PAGE_ENTRIES: SearchEntry[] = [
  {
    id: 'page-home', kind: 'page', title: 'Overview', subtitle: 'The Hospital Operating System', to: '/',
    keywords: ['home', 'overview', 'orb', 'start', 'landing'],
    body: 'The local-first, AI-native operating system for the modern hospital. Intelligence that stays within your walls.',
  },
  {
    id: 'page-modules', kind: 'page', title: 'All Modules', subtitle: 'Fourteen modules. One operating system.', to: '/#modules',
    keywords: ['modules', 'products', 'features', 'catalog', 'list'],
    body: ALL_MODULES.map(m => m.label).join(' '),
  },
  {
    id: 'page-plans', kind: 'page', title: 'Plans', subtitle: 'Lite, Plus, Max, and Ultra', to: '/plans',
    keywords: ['plans', 'pricing', 'price', 'cost', 'tiers', 'editions', 'compare', 'buy', 'subscription'],
    body: 'Compare Orb Lite, Orb Plus, Orb Max, and Orb Ultra.',
  },
  {
    id: 'page-support', kind: 'page', title: 'Support', subtitle: 'Help, contact, and common questions', to: '/support',
    keywords: ['support', 'help', 'contact', 'faq', 'questions', 'email', 'assistance', 'troubleshooting'],
    body: `Reach the Orb team, browse frequently asked questions, or request a walkthrough. ${CONTACT_EMAIL}`,
  },
]

const ACTION_ENTRIES: SearchEntry[] = [
  {
    id: 'action-demo', kind: 'action', title: 'Request a Demo', subtitle: 'Book a walkthrough with the team', action: 'demo',
    keywords: ['demo', 'request', 'walkthrough', 'trial', 'book', 'meeting', 'sales', 'see it'],
    body: 'See Orb run on real clinical workflows.',
  },
  {
    id: 'action-mail', kind: 'action', title: `Email ${CONTACT_EMAIL}`, subtitle: 'Write to the Orb team directly', action: 'mail',
    keywords: ['email', 'mail', 'contact', 'write', 'reach', 'message'],
    body: 'Contact the team by email.',
  },
]

// Curated answers for the questions visitors actually ask. Each `keywords`
// list is what the scorer matches a question against; `to` is the "read more"
// destination shown under the answer. Also rendered as the Support-page FAQ.
export const ANSWER_ENTRIES: SearchEntry[] = [
  {
    id: 'qa-what-is-orb', kind: 'answer', title: 'What is Orb?', to: '/',
    answer: 'Orb is the local-first, AI-native operating system for the modern hospital — fourteen modules covering the ward, the operating room, and the back office. It watches, understands, and acts the moment a clinician confirms, and all of it runs on hardware inside your hospital.',
    keywords: ['what', 'orb', 'about', 'hospital', 'operating', 'system', 'platform', 'company', 'product', 'os'],
  },
  {
    id: 'qa-privacy', kind: 'answer', title: 'Does patient data leave the hospital?', to: '/support',
    answer: 'No. Orb processes all audio, images, and text on hardware inside your hospital. Patient data never leaves your walls — no external egress, and no third-party cloud vendor in the loop.',
    keywords: ['data', 'privacy', 'leave', 'cloud', 'egress', 'private', 'phi', 'patient', 'stored', 'store', 'send', 'external', 'sovereignty', 'local'],
  },
  {
    id: 'qa-compliance', kind: 'answer', title: 'Is Orb HIPAA and GDPR compliant?', to: '/support',
    answer: 'Orb is designed to support the technical safeguards HIPAA and GDPR require: on-premise processing, role-based access, and a tamper-evident audit trail. It strengthens your compliance posture — it is not a substitute for your own certification.',
    keywords: ['hipaa', 'gdpr', 'compliance', 'compliant', 'regulation', 'certified', 'legal', 'audit', 'safeguards', 'security'],
  },
  {
    id: 'qa-offline', kind: 'answer', title: 'Does Orb work during internet outages?', to: '/support',
    answer: 'Yes. Orb is installed on-premise and operates on-site without a network connection, so wards keep monitoring, messaging, and documenting straight through upstream or ISP outages.',
    keywords: ['offline', 'outage', 'internet', 'network', 'connection', 'isp', 'down', 'downtime', 'continuity', 'work'],
  },
  {
    id: 'qa-integration', kind: 'answer', title: 'Does Orb replace our EHR?', to: '/support',
    answer: 'No — Orb runs alongside the systems you already have, exchanging information through the standards they already speak. It complements your record of truth; it is not a rip-and-replace.',
    keywords: ['ehr', 'emr', 'integrate', 'integration', 'replace', 'stack', 'systems', 'epic', 'cerner', 'interoperability', 'hl7', 'fhir'],
  },
  {
    id: 'qa-safety', kind: 'answer', title: 'Can Orb act without a clinician?', to: '/sage',
    answer: 'No. Orb drafts the next step — the order, the alert, the note — but nothing is carried out until a clinician confirms it. Every confirmed action lands in a tamper-evident audit trail.',
    keywords: ['safety', 'autonomous', 'clinician', 'confirm', 'confirmation', 'human', 'loop', 'act', 'safe', 'oversight', 'approve'],
  },
  {
    id: 'qa-pricing', kind: 'answer', title: 'How much does Orb cost?', to: '/plans',
    answer: 'Orb comes in four plans — Lite, Plus, Max, and Ultra — sized from a single clinic to a hospital group. Pricing is tailored to your deployment; request a demo and the team will scope it with you.',
    keywords: ['cost', 'price', 'pricing', 'much', 'pay', 'plans', 'subscription', 'license', 'expensive', 'budget'],
  },
  {
    id: 'qa-modules-count', kind: 'answer', title: 'How many modules does Orb have?', to: '/#modules',
    answer: `Fourteen — ${ALL_MODULES.map(m => m.label).join(', ')}. They share one local-first platform, so every module makes the others more useful.`,
    keywords: ['many', 'modules', 'count', 'number', 'which', 'list', 'included', 'features', 'apps'],
  },
  {
    id: 'qa-demo', kind: 'answer', title: 'How do I see Orb in action?', to: '/support',
    answer: 'Request a demo — the team will walk you through Orb running on real clinical workflows, sized to your wards and your stack.',
    keywords: ['demo', 'see', 'try', 'trial', 'walkthrough', 'test', 'evaluate', 'poc', 'pilot', 'action'],
  },
  {
    id: 'qa-deployment', kind: 'answer', title: 'How is Orb deployed?', to: '/support',
    answer: 'Orb is installed on-premise, on hardware you control, inside your network. Deployment is handled with your IT team, and the system runs entirely on-site from day one.',
    keywords: ['deploy', 'deployment', 'install', 'installation', 'premise', 'premises', 'hardware', 'setup', 'hosted', 'server', 'infrastructure'],
  },
  {
    id: 'qa-who-for', kind: 'answer', title: 'Who is Orb for?', to: '/',
    answer: 'Hospitals and clinics — from a single ward to a whole group. Nurses get early warning, clinicians get an ambient copilot, operations get capacity foresight, and the back office gets revenue integrity.',
    keywords: ['who', 'for', 'audience', 'customers', 'hospitals', 'clinics', 'users', 'buyer', 'nurses', 'doctors'],
  },
  {
    id: 'qa-contact', kind: 'answer', title: 'How do I contact the Orb team?', to: '/support',
    answer: `Email ${CONTACT_EMAIL} any time, or request a demo from any page — every request reaches a human on the team.`,
    keywords: ['contact', 'reach', 'email', 'talk', 'human', 'team', 'phone', 'sales', 'touch'],
  },
]

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...MODULE_ENTRIES,
  ...PAGE_ENTRIES,
  ...PLAN_ENTRIES,
  ...ACTION_ENTRIES,
  ...ANSWER_ENTRIES,
]

// ─── Scoring ───

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'do', 'does', 'did', 'can', 'could',
  'will', 'would', 'i', 'we', 'you', 'it', 'my', 'our', 'your', 'of', 'to',
  'in', 'on', 'at', 'and', 'or', 'with', 'if', 'be', 'has', 'have', 'there',
])

const QUESTION_WORDS = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'does', 'do', 'can', 'is', 'are', 'will', 'should']

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t))

/** Score one query token against one indexed token. */
const tokenScore = (query: string, indexed: string, weight: number): number => {
  if (indexed === query) return weight
  if (query.length >= 3 && indexed.startsWith(query)) return weight * 0.6
  return 0
}

const scoreEntry = (entry: SearchEntry, qTokens: string[], rawQuery: string): number => {
  const titleTokens = tokenize(entry.title)
  const keywordTokens = entry.keywords.flatMap(tokenize)
  const bodyTokens = tokenize(`${entry.subtitle ?? ''} ${entry.body ?? ''} ${entry.answer ?? ''}`)

  let score = 0
  for (const q of qTokens) {
    let best = 0
    for (const t of titleTokens) best = Math.max(best, tokenScore(q, t, 10))
    for (const t of keywordTokens) best = Math.max(best, tokenScore(q, t, 7))
    for (const t of bodyTokens) best = Math.max(best, tokenScore(q, t, 2))
    score += best
  }

  // Whole-query phrase bonus: "surge sim" should pin Surge Simulator on top.
  if (rawQuery.length >= 3 && entry.title.toLowerCase().includes(rawQuery)) score += 8

  return score
}

const looksLikeQuestion = (rawQuery: string, tokenCount: number): boolean => {
  const trimmed = rawQuery.trim().toLowerCase()
  if (trimmed.endsWith('?')) return true
  if (QUESTION_WORDS.some(w => trimmed.startsWith(`${w} `))) return true
  return tokenCount >= 3
}

/**
 * Run a search over the whole site. Returns a featured answer when the query
 * reads like a question we can answer, plus ranked navigable results.
 */
export function runSearch(rawQuery: string): SearchResults {
  const query = rawQuery.trim().toLowerCase()
  const qTokens = tokenize(query)
  if (!query || qTokens.length === 0) return { answer: null, results: [] }

  const scored = SEARCH_ENTRIES
    .map(entry => ({ entry, score: scoreEntry(entry, qTokens, query) }))
    .filter(s => s.score > 0)

  const navigable = scored
    .filter(s => s.entry.kind !== 'answer')
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map(s => s.entry)

  let answer: SearchEntry | null = null
  if (looksLikeQuestion(rawQuery, qTokens.length)) {
    const bestAnswer = scored
      .filter(s => s.entry.kind === 'answer')
      .sort((a, b) => b.score - a.score)[0]
    // Demand more than a single glancing keyword hit before we claim an answer.
    if (bestAnswer && bestAnswer.score >= 12) answer = bestAnswer.entry
  }

  return { answer, results: navigable }
}
