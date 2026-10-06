import { ALL_MODULES, CONTACT_EMAIL } from './siteContent'
import { PLANS_LEDE } from './plans'
import { BACK_OFFICE, BACK_OFFICE_LEDE } from './backOffice'

// ─── Site search: keyword lookup + lightweight question answering ───
// Everything is indexed client-side (the site is static), so search works
// offline and never sends a query anywhere.

export type SearchAction = 'demo' | 'mail'

export interface SearchEntry {
  id: string
  kind: 'module' | 'page' | 'action' | 'answer'
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
  /** Ranked pages, modules, and actions. */
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

const PAGE_ENTRIES: SearchEntry[] = [
  {
    id: 'page-home', kind: 'page', title: 'Overview', subtitle: 'Hospital software that never leaves the building', to: '/',
    keywords: ['home', 'overview', 'orb', 'start', 'landing'],
    body: 'Hospital software that never leaves the building. One computer in your hospital holds the ward’s observations, the NEWS2 score, the drug chart and a room for each patient’s team. Nothing about a patient leaves it.',
  },
  {
    id: 'page-modules', kind: 'page', title: 'All modules', subtitle: 'Fourteen modules, each with its workflow', to: '/modules',
    keywords: ['modules', 'products', 'features', 'catalog', 'list'],
    body: ALL_MODULES.map(m => m.label).join(' '),
  },
  {
    id: 'page-back-office', kind: 'page', title: 'The rest of the hospital', subtitle: 'Front desk, billing, stores, rosters, NABH and more', to: '/back-office',
    keywords: ['back office', 'billing', 'payments', 'insurance', 'tpa', 'claims', 'procurement', 'stores', 'housekeeping', 'workforce', 'roster', 'payroll', 'equipment', 'biomedical', 'diet', 'kitchen', 'nabh', 'abdm', 'abha', 'front desk', 'opd', 'token'],
    body: `${BACK_OFFICE_LEDE} ${BACK_OFFICE.map(m => `${m.name}: ${m.line}`).join(' ')}`,
  },
  {
    id: 'page-plans', kind: 'page', title: 'Plans', subtitle: 'Founding programme: three places in Hyderabad', to: '/plans',
    keywords: ['plans', 'plan', 'founding', 'programme', 'program', 'hyderabad', 'pricing', 'price', 'cost', 'terms', 'buy', 'start'],
    body: PLANS_LEDE,
  },
  {
    id: 'page-support', kind: 'page', title: 'Support', subtitle: 'Write to me, book a walkthrough, or find the answer', to: '/support',
    keywords: ['support', 'help', 'contact', 'faq', 'questions', 'email', 'assistance', 'troubleshooting'],
    body: `Reach me, read the common questions, or book a walkthrough. ${CONTACT_EMAIL}`,
  },
]

const ACTION_ENTRIES: SearchEntry[] = [
  {
    id: 'action-demo', kind: 'action', title: 'Book a walkthrough', subtitle: 'On a call, with the product open. No slides.', action: 'demo',
    keywords: ['demo', 'request', 'walkthrough', 'trial', 'book', 'meeting', 'sales', 'see it'],
    body: 'A walkthrough of the product on demo patients.',
  },
  {
    id: 'action-mail', kind: 'action', title: `Email ${CONTACT_EMAIL}`, subtitle: 'Write to me directly', action: 'mail',
    keywords: ['email', 'mail', 'contact', 'write', 'reach', 'message'],
    body: 'Write to me by email.',
  },
]

// Curated answers for the questions visitors actually ask. Each `keywords`
// list is what the scorer matches a question against; `to` is the "read more"
// destination shown under the answer. Also rendered as the Support-page FAQ.
export const ANSWER_ENTRIES: SearchEntry[] = [
  {
    id: 'qa-what-is-orb', kind: 'answer', title: 'What is Orb?', to: '/',
    answer: 'Orb is hospital software that never leaves the building. One computer in your hospital runs the ward record, the NEWS2 score calculated from the nurse’s observations, the drug chart and a room for each patient’s team, with the models beside them, so nothing about a patient leaves it. It runs beside the hospital system you already have. It has not yet run in a hospital.',
    keywords: ['what', 'orb', 'about', 'hospital', 'software', 'ward', 'record', 'platform', 'company', 'product', 'appliance'],
  },
  {
    id: 'qa-privacy', kind: 'answer', title: 'Does patient data leave the hospital?', to: '/security',
    answer: 'No. The database, the models and the audit log sit on the computer, and no cloud model is in the loop. Orb makes no call to the internet at all: Pulse reads a seasonal calendar built into Orb, not a weather service.',
    keywords: ['data', 'privacy', 'leave', 'cloud', 'egress', 'private', 'phi', 'patient', 'stored', 'store', 'send', 'external', 'sovereignty', 'local'],
  },
  {
    id: 'qa-compliance', kind: 'answer', title: 'Where does Orb stand on DPDP, ABDM and NABH?', to: '/security',
    answer: 'Built for India first. The consent, retention and breach registers exist inside Orb but have no screens yet. The screens come before the DPDP duties start in May 2027. The NABH evidence pack exports the quality indicators and the incident register, and lists the indicators it cannot compute. On ABDM, Orb is not yet certified and sends nothing today. None of it stands in for your own certification.',
    keywords: ['dpdp', 'abdm', 'nabh', 'compliance', 'compliant', 'regulation', 'certified', 'legal', 'audit', 'safeguards', 'security'],
  },
  {
    id: 'qa-offline', kind: 'answer', title: 'Does Orb work during internet outages?', to: '/security',
    answer: 'Yes. Orb needs no internet connection, because everything it uses is on the computer. For the hour the computer itself is down, the ward prints a downtime pack per patient on its schedule, and the Command Center shows how many packs are current.',
    keywords: ['offline', 'outage', 'internet', 'network', 'connection', 'isp', 'down', 'downtime', 'continuity', 'work'],
  },
  {
    id: 'qa-integration', kind: 'answer', title: 'Does Orb replace our hospital system?', to: '/plans',
    answer: 'No. Orb runs beside your hospital system on one ward. Registration, billing, pharmacy and lab stay where they are. Orb exports its records as a standard file (FHIR). Observations and results can be sent to it over HL7 or FHIR on your network with a key your IT holds, and a ward’s patient list can be imported from a file, with a dry run first. It has no connector to your hospital system.',
    keywords: ['ehr', 'emr', 'his', 'integrate', 'integration', 'replace', 'stack', 'systems', 'interoperability', 'hl7', 'fhir', 'record'],
  },
  {
    id: 'qa-safety', kind: 'answer', title: 'Can Orb act without a clinician?', to: '/helix',
    answer: 'No. Orb drafts the order set or the note and a named person confirms it; an alert is posted to the patient’s room for review. A drafted medicine then goes through the allergy block and the dose check and waits in the pharmacist’s queue, and every confirmed action lands in the audit log.',
    keywords: ['safety', 'autonomous', 'clinician', 'confirm', 'confirmation', 'human', 'loop', 'act', 'safe', 'oversight', 'approve', 'agentic'],
  },
  {
    id: 'qa-pricing', kind: 'answer', title: 'How much does Orb cost?', to: '/plans',
    answer: 'Orb publishes no prices yet. It starts with a founding hospital programme: three places in Hyderabad, one ward each, beside the software you already run. Terms are agreed in person.',
    keywords: ['cost', 'price', 'pricing', 'much', 'pay', 'plans', 'subscription', 'license', 'expensive', 'budget', 'terms', 'founding'],
  },
  {
    id: 'qa-modules-count', kind: 'answer', title: 'Which modules does Orb have?', to: '/modules',
    answer: `On this site: ${ALL_MODULES.map(m => m.label).join(', ')}. Also on the computer, outside the founding programme: front desk, billing, payments, insurance and TPA, procurement and stores, housekeeping, workforce, biomedical equipment, diet and kitchen, NABH evidence and ABDM records, each on the back-office page, and the admin screens. In the founding programme Orb runs on one ward, beside your hospital system.`,
    keywords: ['many', 'modules', 'count', 'number', 'which', 'list', 'included', 'features', 'apps', 'billing', 'front desk'],
  },
  {
    id: 'qa-demo', kind: 'answer', title: 'How do I see Orb in action?', to: '/support',
    answer: 'The screens on this site are captures and animations of the product running on a test computer with demo patients. To see it live, book a walkthrough: a call about your wards, with the product open instead of slides.',
    keywords: ['demo', 'see', 'try', 'trial', 'walkthrough', 'test', 'evaluate', 'poc', 'founding', 'action'],
  },
  {
    id: 'qa-deployment', kind: 'answer', title: 'How is Orb deployed?', to: '/plans',
    answer: 'On one computer installed inside your hospital, on your network. It starts on one ward, beside the software you already run.',
    keywords: ['deploy', 'deployment', 'install', 'installation', 'premise', 'premises', 'hardware', 'setup', 'hosted', 'server', 'infrastructure', 'appliance'],
  },
  {
    id: 'qa-who-for', kind: 'answer', title: 'Who is Orb for?', to: '/',
    answer: 'Hospitals, starting with one ward beside the system they already run. The founding programme is the ward’s observation record and a monthly file for the quality team. This site shows what nurses see (observations, the NEWS2 score, what is due now), what doctors see (the chart, the case rooms, a model that answers on site), the pharmacist’s queue, the admin screens and Bridge for patients.',
    keywords: ['who', 'for', 'audience', 'customers', 'hospitals', 'clinics', 'users', 'buyer', 'nurses', 'doctors', 'pharmacists', 'patients'],
  },
  {
    id: 'qa-print', kind: 'answer', title: 'What can Orb print?', to: '/vigil',
    answer: 'The inpatient record, the medication list with the allergies at the top, the orders list, the I-PASS handover, the discharge summary, invoices, and a downtime pack per patient for the hour the computer is down.',
    keywords: ['print', 'printout', 'paper', 'printed', 'sheet', 'discharge', 'summary', 'handover', 'invoice', 'downtime', 'record'],
  },
  {
    id: 'qa-sign-in', kind: 'answer', title: 'Who can sign in, and how?', to: '/security',
    answer: 'Staff sign in with an ID and a password, and each role sees only its own screens and its own department’s patients. Any role can be set to need a code from an authenticator app as well, a ward tablet can be bound so a nurse unlocks it with a PIN mid-shift, and an administrator manages every account on one screen.',
    keywords: ['login', 'sign in', 'password', 'mfa', 'two-factor', '2fa', 'authenticator', 'pin', 'tablet', 'roles', 'access', 'accounts', 'users'],
  },
  {
    id: 'qa-language', kind: 'answer', title: 'Does Orb work in Hindi?', to: '/support',
    answer: 'Partly. The menus and the main labels switch between English and Hindi with one button. The clinical screens, notes and Sage’s answers are in English today.',
    keywords: ['hindi', 'telugu', 'language', 'languages', 'translation', 'english', 'local language'],
  },
  {
    id: 'qa-ward-list', kind: 'answer', title: 'How do our current patients get into Orb?', to: '/plans',
    answer: 'A ward’s patient list can be imported from a file. Orb shows a preview, then a dry run of what it would write, and writes nothing until an administrator confirms.',
    keywords: ['import', 'patients', 'go-live', 'go live', 'migration', 'ward list', 'existing', 'census', 'file', 'csv', 'start'],
  },
  {
    id: 'qa-contact', kind: 'answer', title: 'How do I contact Orb?', to: '/support',
    answer: `Email ${CONTACT_EMAIL} any time, or book a walkthrough from any page. One person reads every message.`,
    keywords: ['contact', 'reach', 'email', 'talk', 'human', 'team', 'phone', 'sales', 'touch'],
  },
]

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...MODULE_ENTRIES,
  ...PAGE_ENTRIES,
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
