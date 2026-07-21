// ─── Single source of truth for nav, plans, and search content ───
// The header's hover cards, the Plans page, and the search index all read from
// here, so a renamed module or new tier only has to change in one place.

export interface ModuleInfo {
  to: string
  label: string
  badge: string
  blurb: string
  keywords: string[]
}

export const ALL_MODULES: ModuleInfo[] = [
  {
    to: '/sage', label: 'Sage', badge: 'Ambient Clinical Copilot',
    blurb: 'Ask it anything clinical, or let it follow the conversation on the ward. Sage carries out the next step — the order, the alert, the note — the instant a clinician confirms.',
    keywords: ['copilot', 'assistant', 'agentic', 'orders', 'ai', 'ward', 'clinical questions', 'act', 'confirm'],
  },
  {
    to: '/vigil', label: 'Vigil', badge: 'Live Vitals & Early Warning',
    blurb: 'Monitors physiological changes and flags early signs of patient risk, so nurses can react before a patient deteriorates.',
    keywords: ['vitals', 'monitoring', 'early warning', 'deterioration', 'telemetry', 'alerts', 'nurses', 'risk'],
  },
  {
    to: '/scribe', label: 'Scribe', badge: 'Hands-Free Documentation',
    blurb: 'Turns spoken bedside conversations into structured clinical notes and discharge summaries, hands-free.',
    keywords: ['documentation', 'notes', 'dictation', 'transcription', 'discharge summary', 'voice', 'slate', 'writing'],
  },
  {
    to: '/lens', label: 'Lens', badge: 'Bedside Image Review',
    blurb: 'Reviews X-rays, ECGs, and scans at the bedside and surfaces draft observations for a clinician to confirm.',
    keywords: ['imaging', 'x-ray', 'xray', 'ecg', 'scans', 'radiology', 'image review', 'observations'],
  },
  {
    to: '/relay', label: 'Relay', badge: 'Secure Clinical Messaging',
    blurb: 'Secure, case-focused rooms that connect clinical teams and automatically flag deteriorating patients.',
    keywords: ['messaging', 'chat', 'communication', 'teams', 'secure', 'rooms', 'channels', 'coordination'],
  },
  {
    to: '/helix', label: 'Helix', badge: 'Medication Operations',
    blurb: 'Tracks pharmacy operations, drug histories, and bedside administration — with allergy and interaction checks at the point of order.',
    keywords: ['medication', 'pharmacy', 'drugs', 'prescriptions', 'allergy', 'interactions', 'administration'],
  },
  {
    to: '/surgical-suite', label: 'Surgical Suite', badge: 'Operating-Room Coordination',
    blurb: 'Live theatre schedules, safety checklists, and emergency alerts that keep operating rooms coordinated.',
    keywords: ['surgery', 'operating room', 'theatre', 'or', 'checklists', 'schedules', 'perioperative'],
  },
  {
    to: '/pulse', label: 'Pulse', badge: 'Environmental & Population Signals',
    blurb: 'Watches local air quality, weather, and community illness — and flags which patients on your wards will feel it first.',
    keywords: ['environment', 'air quality', 'weather', 'population', 'community illness', 'signals', 'epidemiology'],
  },
  {
    to: '/forecast', label: 'Forecast', badge: 'Predictive Capacity Planning',
    blurb: 'Anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.',
    keywords: ['capacity', 'beds', 'length of stay', 'discharge', 'planning', 'prediction', 'availability'],
  },
  {
    to: '/bridge', label: 'Bridge', badge: 'Patient Understanding',
    blurb: 'Explains care, medications, and next steps in plain, reassuring language for patients and families.',
    keywords: ['patients', 'families', 'plain language', 'education', 'explanations', 'next steps', 'understanding'],
  },
  {
    to: '/appointments', label: 'Appointments', badge: 'Scheduling & Follow-up',
    blurb: 'Keeps every follow-up, review, and clinic slot in order, so no patient falls through the gap between visits.',
    keywords: ['scheduling', 'follow-up', 'clinic', 'slots', 'booking', 'visits', 'calendar'],
  },
  {
    to: '/revenue-integrity', label: 'Revenue Integrity', badge: 'Revenue Integrity',
    blurb: 'Catches the coding and documentation gaps that quietly cost hospitals millions — turning care already delivered into the reimbursement you’re owed.',
    keywords: ['revenue', 'coding', 'billing', 'reimbursement', 'claims', 'roi', 'finance', 'back office'],
  },
  {
    to: '/command-center', label: 'Command Center', badge: 'House-Wide Command Center',
    blurb: 'The whole hospital on one screen — census, acuity, and the patients most likely to need you next.',
    keywords: ['command center', 'census', 'acuity', 'overview', 'operations', 'house-wide', 'dashboard'],
  },
  {
    to: '/surge-simulator', label: 'Surge Simulator', badge: 'Capacity & Surge Planning',
    blurb: 'Model a surge, a closure, or a staffing gap before it happens — and see hours-to-overflow while there’s still time to act.',
    keywords: ['surge', 'simulation', 'capacity', 'overflow', 'staffing', 'scenario', 'what-if', 'planning'],
  },
]

// ─── Featured nav items — the six modules that get their own top-bar entry ───
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
  { ...byPath('/scribe'), navLabel: 'Scribe', summary: 'Bedside conversation becomes clinical notes.' },
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
    desc: 'The essentials of the operating system — an ambient copilot, hands-free notes, secure team messaging, and scheduling that never drops a follow-up.',
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
    desc: 'Every module Orb ships — including operating-room coordination and revenue integrity — with white-glove deployment and priority support.',
    includes: ['Everything in Max', 'Surgical Suite', 'Revenue Integrity'],
    extras: ['White-glove on-premise deployment', 'Priority support'],
  },
]

export const CONTACT_EMAIL = 'support@orbintelligence.co'

export const openDemoModal = () =>
  window.dispatchEvent(new CustomEvent('open-demo-modal'))
