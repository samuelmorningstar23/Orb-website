// ─── Single source of truth for nav, plans, and search content ───
// The header's hover cards, the Plans page, the explorer and the search index
// all read from here, so a renamed module only has to change in one place.
//
// Voice: plain declaratives, specific, the caveat in the same sentence as the
// claim. Every line describes something a visitor can see in the captures.

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
    to: '/vigil', label: 'Vigil', badge: 'Vitals and early warning',
    blurb: 'Every patient scored on NEWS2 as the vitals arrive, the ward ordered by that score, and each point on the score explained. The Sepsis Six clock starts when the score crosses the line.',
    keywords: ['vitals', 'monitoring', 'early warning', 'deterioration', 'news2', 'alerts', 'nurses', 'risk', 'sepsis'],
    area: 'ward',
    line: 'The ward ordered by NEWS2, each point explained, the Sepsis Six clock already running.',
  },
  {
    to: '/sage', label: 'Sage', badge: 'Clinical questions, answered on the appliance',
    blurb: 'Ask about a guideline or a patient and get an answer from a model that runs inside the hospital, with the guidance it read listed underneath. It refuses charts outside your department and never places an order itself.',
    keywords: ['copilot', 'assistant', 'questions', 'guideline', 'ai', 'ward', 'clinical questions', 'medgemma', 'local model'],
    area: 'ward',
    line: 'A clinical question answered by a model inside the hospital, with its sources shown.',
  },
  {
    to: '/scribe', label: 'Scribe', badge: 'Dictation to a signed note',
    blurb: 'Type or dictate the consultation. The local model drafts a SOAP note, a second pass checks it against what was said, and the clinician signs by name. Signing is what queues the medications for a pharmacist.',
    keywords: ['documentation', 'notes', 'dictation', 'transcription', 'discharge summary', 'voice', 'soap', 'sign'],
    area: 'ward',
    line: 'Dictation to a verified, signed SOAP note, on the appliance.',
  },
  {
    to: '/lens', label: 'Lens', badge: 'A first read of an image',
    blurb: 'Upload an X-ray, an ECG or a photo of a wound. The local model drafts a first read for the clinician to correct, keep or discard. The image never leaves the building.',
    keywords: ['imaging', 'x-ray', 'xray', 'ecg', 'scans', 'radiology', 'image review', 'photo', 'wound'],
    area: 'ward',
    line: 'A first read of an X-ray, ECG or photo, drafted on site for a clinician to correct.',
  },
  {
    to: '/relay', label: 'Relay', badge: 'Case rooms for the team',
    blurb: 'One room per patient. Vigil posts its alerts into the room beside the conversation, and a message about the wrong patient is delivered with a warning rather than blocked.',
    keywords: ['messaging', 'chat', 'communication', 'teams', 'secure', 'rooms', 'channels', 'coordination', 'wrong patient'],
    area: 'ward',
    line: 'One room per patient, alerts posted inline, a wrong-patient message flagged rather than blocked.',
  },
  {
    to: '/helix', label: 'Helix', badge: 'Pharmacy and medication safety',
    blurb: 'The allergy interlock stops an order set at the item that would harm the patient. Medications a model extracted from a note wait in a pharmacist’s queue until a named pharmacist verifies them.',
    keywords: ['medication', 'pharmacy', 'drugs', 'prescriptions', 'allergy', 'interactions', 'administration', 'emar', 'pharmacist'],
    area: 'ward',
    line: 'The allergy interlock, and a pharmacist’s queue for anything a model extracted.',
  },
  {
    to: '/surgical-suite', label: 'Surgical Suite', badge: 'Theatre lists and checklists',
    blurb: 'The week’s list, the day’s theatre, and active cases moving through the WHO surgical checklist, with the risk flag beside each patient.',
    keywords: ['surgery', 'operating room', 'theatre', 'or', 'checklists', 'schedules', 'perioperative', 'who checklist'],
    area: 'theatre',
    line: 'The week, the day and the active cases, checklist step by step.',
  },
  {
    to: '/pulse', label: 'Pulse', badge: 'Outside signals',
    blurb: 'Weather, air quality, flu surveillance and drug recalls from public feeds, read against the ward. The only outbound call Orb makes carries a map coordinate and no patient.',
    keywords: ['environment', 'air quality', 'weather', 'population', 'community illness', 'signals', 'recalls', 'flu'],
    area: 'house',
    line: 'Weather, air quality, flu and recalls from public feeds; the one outbound call carries no patient.',
  },
  {
    to: '/forecast', label: 'Forecast', badge: 'Census and capacity ahead',
    blurb: 'Seven-day census against capacity, the discharge board and admission patterns. The forecasting model ships untrained and the screen says so; the bed arithmetic and the discharge board are live today.',
    keywords: ['capacity', 'beds', 'length of stay', 'discharge', 'planning', 'prediction', 'availability', 'census'],
    area: 'house',
    line: 'Census against capacity for the week ahead, with the model’s status stated on screen.',
  },
  {
    to: '/command-center', label: 'Command Center', badge: 'The whole house on one screen',
    blurb: 'Census, critical patients, sepsis bundle compliance and downtime readiness, with the ward acuity map and the active deteriorations by name.',
    keywords: ['command center', 'census', 'acuity', 'overview', 'operations', 'house-wide', 'dashboard', 'heatmap'],
    area: 'house',
    line: 'Census, acuity, bundle compliance and downtime readiness, one screen.',
  },
  {
    to: '/surge-simulator', label: 'Surge Simulator', badge: 'What-if on the live census',
    blurb: 'Twenty admissions tonight, eight beds closed, a flu surge at 1.5x. The simulator answers with peak occupancy, hours to overflow, beds short and the nurses you would need, with its assumptions listed.',
    keywords: ['surge', 'simulation', 'capacity', 'overflow', 'staffing', 'scenario', 'what-if', 'planning'],
    area: 'house',
    line: 'A surge or a closure modelled on the live census: hours to overflow and nurses needed.',
  },
  {
    to: '/bridge', label: 'Bridge', badge: 'The patient’s own view',
    blurb: 'A patient signs in with the code issued at admission and sees their care team, vitals in plain words, medications, results and documents, and can download their record as FHIR. Questions get a plain answer that points back to the nurse or doctor.',
    keywords: ['patients', 'families', 'plain language', 'portal', 'explanations', 'next steps', 'fhir', 'record'],
    area: 'patients',
    line: 'The patient’s own portal: vitals in plain words, results, documents, a FHIR download.',
  },
  {
    to: '/appointments', label: 'Appointments', badge: 'Follow-ups and reviews',
    blurb: 'Follow-ups, medication reviews and post-discharge checks in day columns, each with the patient’s risk band, so the critical ones are not scheduled like the rest.',
    keywords: ['scheduling', 'follow-up', 'clinic', 'slots', 'booking', 'visits', 'calendar', 'appointments', 'review'],
    area: 'patients',
    line: 'Follow-ups and reviews by day, with the risk band beside each name.',
  },
  {
    to: '/revenue-integrity', label: 'Revenue Integrity', badge: 'Coding from the notes on the chart',
    blurb: 'Pick a patient and press Analyze. Orb reads the notes already on the chart and lists the codes they support and the documentation gaps that block them, each with the sentence it came from.',
    keywords: ['revenue', 'coding', 'billing', 'reimbursement', 'claims', 'finance', 'back office', 'documentation'],
    area: 'office',
    line: 'The codes the chart already supports, and the gaps that block them, sentence by sentence.',
  },
]

// ─── Featured nav items - the six modules that get their own top-bar entry ───
// `summary` is the short line shown in the hover card.
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
  { ...byPath('/vigil'), navLabel: 'Vigil', summary: 'NEWS2 on every patient, explained.' },
  { ...byPath('/sage'), navLabel: 'Sage', summary: 'Clinical questions answered on site.' },
  { ...byPath('/helix'), navLabel: 'Helix', summary: 'Allergy interlock and pharmacist queue.' },
  { ...byPath('/scribe'), navLabel: 'Scribe', summary: 'Dictation to a signed note.' },
  { ...byPath('/bridge'), navLabel: 'Bridge', summary: 'The patient’s own view of their care.' },
  { ...byPath('/command-center'), navLabel: 'Command', summary: 'The whole house on one screen.' },
]

// ─── Plans ───
// There are no tiers that withhold safety features. Orb is bought as a pilot
// first, then per bed for the whole hospital. Numbers are agreed in the demo;
// none are published here until the founder decides to.
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
