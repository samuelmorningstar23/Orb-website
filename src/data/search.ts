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
  /** Long-form answer text - only present on `answer` entries. */
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
    body: 'The hospital operating system that runs inside the hospital: the record, the ward monitor, the pharmacy and the front desk on one appliance.',
  },
  {
    id: 'page-modules', kind: 'page', title: 'All modules', subtitle: 'Every module as a real screen', to: '/modules',
    keywords: ['modules', 'products', 'features', 'catalog', 'list'],
    body: ALL_MODULES.map(m => m.label).join(' '),
  },
  {
    id: 'page-plans', kind: 'page', title: 'Plans', subtitle: 'A pilot first, then per bed', to: '/plans',
    keywords: ['plans', 'pricing', 'price', 'cost', 'tiers', 'editions', 'compare', 'buy', 'subscription'],
    body: 'A thirteen-week pilot on one ward, then per-bed pricing for the hospital. No tier withholds a safety feature.',
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
    body: 'A walkthrough of the running product on demo patients.',
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
    answer: 'Orb is a hospital operating system that runs on an appliance inside the hospital: the patient record, the ward monitor (NEWS2 on every patient), the pharmacy, orders, notes, the front desk, billing and the admin screens, on one database. The models that answer questions and draft notes run on the same appliance, so nothing about a patient leaves the building.',
    keywords: ['what', 'orb', 'about', 'hospital', 'operating', 'system', 'platform', 'company', 'product', 'os', 'appliance'],
  },
  {
    id: 'qa-privacy', kind: 'answer', title: 'Does patient data leave the hospital?', to: '/security',
    answer: 'No. The database, the models and the audit log are on the appliance, and there is no cloud model in the loop. The one outbound call is Pulse, which sends a map coordinate to public weather, air-quality, flu and drug-recall feeds: it carries no patient data, every call is logged, and the firewall can block it.',
    keywords: ['data', 'privacy', 'leave', 'cloud', 'egress', 'private', 'phi', 'patient', 'stored', 'store', 'send', 'external', 'sovereignty', 'local'],
  },
  {
    id: 'qa-compliance', kind: 'answer', title: 'Is Orb compliant with DPDP, ABDM, NABH, HIPAA or GDPR?', to: '/security',
    answer: 'Orb is built for India first: the technical safeguards the DPDP Act asks for, ABDM support (in progress and not yet certified), and the evidence NABH inspects. The same architecture, on-site processing, role-based access and a hash-chained audit log, covers what HIPAA and GDPR require. None of it substitutes for your own certification.',
    keywords: ['hipaa', 'gdpr', 'dpdp', 'abdm', 'nabh', 'compliance', 'compliant', 'regulation', 'certified', 'legal', 'audit', 'safeguards', 'security'],
  },
  {
    id: 'qa-offline', kind: 'answer', title: 'Does Orb work during internet outages?', to: '/security',
    answer: 'Yes. Orb needs no internet connection to run, because everything it uses is on the appliance. For the hour the appliance itself is down, a printable downtime pack per patient is kept fresh, and the Command Center shows how many packs are current.',
    keywords: ['offline', 'outage', 'internet', 'network', 'connection', 'isp', 'down', 'downtime', 'continuity', 'work'],
  },
  {
    id: 'qa-integration', kind: 'answer', title: 'Does Orb replace our EHR?', to: '/security',
    answer: 'Yes. Orb is the system of record: admissions, orders, notes, pharmacy, billing and the front desk run on one database. Where a hospital already has an HIS, Orb imports from it and exports records as FHIR, so there is no second record to keep in step.',
    keywords: ['ehr', 'emr', 'his', 'integrate', 'integration', 'replace', 'stack', 'systems', 'interoperability', 'hl7', 'fhir', 'record'],
  },
  {
    id: 'qa-safety', kind: 'answer', title: 'Can Orb act without a clinician?', to: '/helix',
    answer: 'No. Orb drafts the order set, the alert or the note, and a named person confirms it. What they confirm goes through the same allergy interlock, dose guard and pharmacist queue as anything typed by hand, and every confirmed action lands in the hash-chained audit log.',
    keywords: ['safety', 'autonomous', 'clinician', 'confirm', 'confirmation', 'human', 'loop', 'act', 'safe', 'oversight', 'approve', 'agentic'],
  },
  {
    id: 'qa-pricing', kind: 'answer', title: 'How much does Orb cost?', to: '/plans',
    answer: 'Orb is bought as a thirteen-week pilot on one ward, then per bed per month for the whole hospital. The figure is agreed on the demo call with your wards, beds and hardware in front of us, and no tier withholds a safety feature.',
    keywords: ['cost', 'price', 'pricing', 'much', 'pay', 'plans', 'subscription', 'license', 'expensive', 'budget', 'bed'],
  },
  {
    id: 'qa-modules-count', kind: 'answer', title: 'Which modules does Orb have?', to: '/#modules',
    answer: `On this site: ${ALL_MODULES.map(m => m.label).join(', ')}. The same appliance also runs the front desk, billing, payments, insurance and TPA, procurement, housekeeping, workforce, equipment, diet and kitchen, NABH evidence and the admin screens (Trust Center, Flight Recorder, Model Governance, Pilot Scorecard).`,
    keywords: ['many', 'modules', 'count', 'number', 'which', 'list', 'included', 'features', 'apps', 'billing', 'front desk'],
  },
  {
    id: 'qa-demo', kind: 'answer', title: 'How do I see Orb in action?', to: '/support',
    answer: 'Every screen on this site is a capture of the running product on demo patients. For the live version, request a demo: a walkthrough on a call, sized to your wards, with the product open rather than slides.',
    keywords: ['demo', 'see', 'try', 'trial', 'walkthrough', 'test', 'evaluate', 'poc', 'pilot', 'action'],
  },
  {
    id: 'qa-deployment', kind: 'answer', title: 'How is Orb deployed?', to: '/plans',
    answer: 'On an appliance installed inside the hospital, on your network, with your IT team. The pilot runs on one ward for thirteen weeks, in shadow mode first, and produces a scorecard before the rest of the house is committed.',
    keywords: ['deploy', 'deployment', 'install', 'installation', 'premise', 'premises', 'hardware', 'setup', 'hosted', 'server', 'infrastructure', 'appliance'],
  },
  {
    id: 'qa-who-for', kind: 'answer', title: 'Who is Orb for?', to: '/',
    answer: 'Hospitals, starting with one ward. Nurses get the score and what is due now, doctors get the chart and a model that answers on site, pharmacists get a verification queue, administrators get the Trust Center and the audit log, and patients get Bridge.',
    keywords: ['who', 'for', 'audience', 'customers', 'hospitals', 'clinics', 'users', 'buyer', 'nurses', 'doctors', 'pharmacists', 'patients'],
  },
  {
    id: 'qa-contact', kind: 'answer', title: 'How do I contact the Orb team?', to: '/support',
    answer: `Email ${CONTACT_EMAIL} any time, or request a demo from any page. A person reads every message.`,
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
