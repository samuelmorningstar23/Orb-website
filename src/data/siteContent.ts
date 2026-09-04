// ─── Single source of truth for nav, plans, and search content ───
// The header's hover cards, the Plans page, and the search index all read from
// here, so a renamed module or new tier only has to change in one place.

/** Where in the hospital a module lives - drives grouping in the module explorer. */
export type ModuleArea = 'ward' | 'theatre' | 'house' | 'patients' | 'office'

export const AREA_LABELS: Record<ModuleArea, string> = {
  ward: 'On the ward',
  theatre: 'In theatre',
  house: 'Across the house',
  patients: 'With patients',
  office: 'Back office',
}

export const AREA_ORDER: ModuleArea[] = ['ward', 'theatre', 'house', 'patients', 'office']

export interface ModuleInfo {
  to: string
  label: string
  badge: string
  blurb: string
  keywords: string[]
  area: ModuleArea
  /** One short line for the explorer panel - the blurb is the longer version. */
  line: string
}

export const ALL_MODULES: ModuleInfo[] = [
  {
    to: '/sage', label: 'Sage', badge: 'Ambient Clinical Copilot',
    blurb: 'Ask it about a patient or a guideline, or let it follow the conversation on the ward. Sage carries out the next step, the order, the alert, the note, only when a clinician confirms.',
    keywords: ['copilot', 'assistant', 'agentic', 'orders', 'ai', 'ward', 'clinical questions', 'act', 'confirm'],
    area: 'ward',
    line: 'Ask it about a patient or a guideline. It acts only when a clinician confirms.',
  },
  {
    to: '/vigil', label: 'Vigil', badge: 'Live Vitals & Early Warning',
    blurb: 'Scores every patient on NEWS2 continuously and pages the ward the moment a threshold is crossed.',
    keywords: ['vitals', 'monitoring', 'early warning', 'deterioration', 'telemetry', 'alerts', 'nurses', 'risk'],
    area: 'ward',
    line: 'Scores every patient on NEWS2 continuously and pages the ward the moment a threshold is crossed.',
  },
  {
    to: '/scribe', label: 'Scribe', badge: 'Hands-Free Documentation',
    blurb: 'Turns spoken bedside conversations into structured clinical notes and discharge summaries, hands-free.',
    keywords: ['documentation', 'notes', 'dictation', 'transcription', 'discharge summary', 'voice', 'slate', 'writing'],
    area: 'ward',
    line: 'Turns bedside conversation into structured notes, hands-free.',
  },
  {
    to: '/lens', label: 'Lens', badge: 'Bedside Image Review',
    blurb: 'Drafts a first read of X-rays, ECGs, and scans at the bedside for a clinician to correct and sign.',
    keywords: ['imaging', 'x-ray', 'xray', 'ecg', 'scans', 'radiology', 'image review', 'observations'],
    area: 'ward',
    line: 'Drafts a first read of X-rays, ECGs, and scans for a clinician to correct and sign.',
  },
  {
    to: '/relay', label: 'Relay', badge: 'Secure Clinical Messaging',
    blurb: 'Secure case rooms where deterioration alerts land beside the conversation and escalate on their own if nobody answers.',
    keywords: ['messaging', 'chat', 'communication', 'teams', 'secure', 'rooms', 'channels', 'coordination'],
    area: 'ward',
    line: 'Case rooms where deterioration alerts land beside the conversation and escalate on their own if nobody answers.',
  },
  {
    to: '/helix', label: 'Helix', badge: 'Medication Operations',
    blurb: 'Every medication order verified by a named pharmacist, with allergy and interaction checks at the moment it is written.',
    keywords: ['medication', 'pharmacy', 'drugs', 'prescriptions', 'allergy', 'interactions', 'administration'],
    area: 'ward',
    line: 'Every medication order verified by a named pharmacist, with allergy and interaction checks at the moment it is written.',
  },
  {
    to: '/surgical-suite', label: 'Surgical Suite', badge: 'Operating-Room Coordination',
    blurb: 'Live theatre schedules, safety checklists, and emergency alerts that keep operating rooms coordinated.',
    keywords: ['surgery', 'operating room', 'theatre', 'or', 'checklists', 'schedules', 'perioperative'],
    area: 'theatre',
    line: 'Live theatre schedules, checklists, and alerts in one view.',
  },
  {
    to: '/pulse', label: 'Pulse', badge: 'Environmental & Population Signals',
    blurb: 'Watches local air quality, weather, and community illness, and turns them into prep actions for the patient groups most at risk.',
    keywords: ['environment', 'air quality', 'weather', 'population', 'community illness', 'signals', 'epidemiology'],
    area: 'house',
    line: 'Air quality, weather, and community illness, turned into prep actions for your wards.',
  },
  {
    to: '/forecast', label: 'Forecast', badge: 'Predictive Capacity Planning',
    blurb: 'Anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.',
    keywords: ['capacity', 'beds', 'length of stay', 'discharge', 'planning', 'prediction', 'availability'],
    area: 'house',
    line: 'A clear bed-availability picture for the days ahead.',
  },
  {
    to: '/bridge', label: 'Bridge', badge: 'Patient Understanding',
    blurb: 'Explains care, medications, and next steps in plain, reassuring language for patients and families.',
    keywords: ['patients', 'families', 'plain language', 'education', 'explanations', 'next steps', 'understanding'],
    area: 'patients',
    line: 'Explains care and next steps in plain language for patients and their families.',
  },
  {
    to: '/appointments', label: 'Appointments', badge: 'Scheduling & Follow-up',
    blurb: 'Keeps every follow-up, review, and clinic slot in order, so no patient falls through the gap between visits.',
    keywords: ['scheduling', 'follow-up', 'clinic', 'slots', 'booking', 'visits', 'calendar', 'appointments'],
    area: 'patients',
    line: 'Every follow-up and clinic slot kept in order.',
  },
  {
    to: '/revenue-integrity', label: 'Revenue Integrity', badge: 'Revenue Integrity',
    blurb: 'Finds documented conditions that were never coded, with the evidence sentence behind each one.',
    keywords: ['revenue', 'coding', 'billing', 'reimbursement', 'claims', 'roi', 'finance', 'back office'],
    area: 'office',
    line: 'Finds documented conditions that were never coded, with the evidence sentence behind each one.',
  },
  {
    to: '/command-center', label: 'Command Center', badge: 'House-Wide Command Center',
    blurb: 'The whole hospital on one screen: census, acuity, and the patients most likely to need you next.',
    keywords: ['command center', 'census', 'acuity', 'overview', 'operations', 'house-wide', 'dashboard'],
    area: 'house',
    line: 'The whole hospital on one screen, pressure visible before it becomes a crisis.',
  },
  {
    to: '/surge-simulator', label: 'Surge Simulator', badge: 'Capacity & Surge Planning',
    blurb: 'Model a surge, a closure, or a staffing gap before it happens, and see hours-to-overflow while there’s still time to act.',
    keywords: ['surge', 'simulation', 'capacity', 'overflow', 'staffing', 'scenario', 'what-if', 'planning'],
    area: 'house',
    line: 'Model a surge or a closure and see hours-to-overflow while there is still time.',
  },
]

// ─── Featured nav items - the six modules that get their own top-bar entry ───
// `summary` is the 5–6 word line shown in the hover card.
export interface FeaturedModule extends ModuleInfo {
  navLabel: string
  summary: string
}

const byPath = (to: string): ModuleInfo => {
  const m = ALL_MODULES.find(mod => mod.to === to)
  if (!m) throw new Error(`Unknown module path: ${to}`)
  return m
}

export const FEATURED_MODULES: FeaturedModule[] = [
  { ...byPath('/relay'), navLabel: 'Relay', summary: 'Secure messaging for clinical teams.' },
  { ...byPath('/sage'), navLabel: 'Sage', summary: 'The ambient copilot that acts.' },
  { ...byPath('/forecast'), navLabel: 'Forecast', summary: 'Predicts beds, stays, and discharges.' },
  { ...byPath('/bridge'), navLabel: 'Bridge', summary: 'Care explained in plain language.' },
  { ...byPath('/appointments'), navLabel: 'Appointments', summary: 'Scheduling that never drops a patient.' },
  { ...byPath('/surge-simulator'), navLabel: 'Surge', summary: 'Rehearse the surge before it hits.' },
]

// ─── Plans ───
export interface Plan {
  id: string
  name: string
  tagline: string
  desc: string
  audience: string
  includes: string[]
  extras?: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'lite',
    name: 'Orb Lite',
    tagline: 'The clinical core.',
    audience: 'For clinics and small wards',
    desc: 'The essentials of the operating system: an ambient copilot, hands-free notes, secure team messaging, and scheduling that never drops a follow-up.',
    includes: ['Sage', 'Scribe', 'Relay', 'Appointments'],
  },
  {
    id: 'plus',
    name: 'Orb Plus',
    tagline: 'Eyes at every bedside.',
    audience: 'For growing hospitals',
    desc: 'Everything in Lite, plus live vitals with early warning, bedside image review, medication safety checks, and plain-language explanations for patients.',
    includes: ['Everything in Lite', 'Vigil', 'Lens', 'Helix', 'Bridge'],
  },
  {
    id: 'max',
    name: 'Orb Max',
    tagline: 'Run the whole house.',
    audience: 'For full-house operations',
    desc: 'Everything in Plus, plus the house-wide command center, predictive capacity planning, surge rehearsal, and environmental signals for the days ahead.',
    includes: ['Everything in Plus', 'Command Center', 'Forecast', 'Surge Simulator', 'Pulse'],
  },
  {
    id: 'ultra',
    name: 'Orb Ultra',
    tagline: 'The complete operating system.',
    audience: 'For hospital groups',
    desc: 'Every module Orb ships, including operating-room coordination and revenue integrity, with white-glove deployment and priority support.',
    includes: ['Everything in Max', 'Surgical Suite', 'Revenue Integrity'],
    extras: ['White-glove on-premise deployment', 'Priority support'],
  },
]

// ─── Contact & lead delivery ───
// The site is a static build (GitHub Pages) and cannot send mail itself, so
// every form on it (demo modal, support page) submits to Web3Forms, which
// emails the submission to the inbox the access key is registered to. Change
// the recipient in the Web3Forms dashboard, not here - there is deliberately
// no "send to" field in the payloads, so a public key can't be used to
// redirect our mail.
//
// The access key is PUBLIC by design - Web3Forms expects it in client-side
// markup and enforces the allowed domain (orbsuite.com) instead. It is not a
// secret. Web3Forms rejects server-side calls on the free plan; submissions
// must come from the browser (which is what happens here).
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
export const WEB3FORMS_ACCESS_KEY = '20e7bb09-6c16-4692-bee8-343422d7ff94'

export const CONTACT_EMAIL = 'support@orbsuite.com'

export const openDemoModal = () =>
  window.dispatchEvent(new CustomEvent('open-demo-modal'))
