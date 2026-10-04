// ─── Single source of truth for nav, plans, and search content ───
// The header's hover cards, the Plans page, the explorer and the search index
// all read from here, so a renamed module only has to change in one place.
//
// Voice: one claim per line, specific, the caveat in the same sentence as the
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
    to: '/vigil', label: 'Vigil', badge: 'The ward, by NEWS2 score',
    blurb: 'Orb calculates NEWS2 from the observations the nurse records, orders the ward by that score and shows which readings drive each point. The clinician opens Sepsis Six from the chart, with its 60-minute target.',
    keywords: ['vitals', 'monitoring', 'observations', 'news2', 'alerts', 'nurses', 'score', 'sepsis'],
    area: 'ward',
    line: 'The ward by NEWS2 score, every point explained, Sepsis Six one click from the chart.',
  },
  {
    to: '/sage', label: 'Sage', badge: 'Clinical answers, inside the hospital',
    blurb: 'Ask about a guideline or a patient. The answer comes from a model running inside the hospital, with the guidance it read listed underneath. It refuses charts outside your department and never places an order itself.',
    keywords: ['copilot', 'assistant', 'questions', 'guideline', 'ai', 'ward', 'clinical questions', 'medgemma', 'local model'],
    area: 'ward',
    line: 'A clinical question, answered by a model inside the hospital, sources shown.',
  },
  {
    to: '/scribe', label: 'Scribe', badge: 'From dictation to a signed note',
    blurb: 'Type or dictate the consultation. The local model drafts a SOAP note, an optional second pass checks it against what was said, and the clinician signs by name. Signing queues the medications for a pharmacist.',
    keywords: ['documentation', 'notes', 'dictation', 'transcription', 'discharge summary', 'voice', 'soap', 'sign'],
    area: 'ward',
    line: 'Speak the consultation. Sign the note. All of it on the appliance.',
  },
  {
    to: '/lens', label: 'Lens', badge: 'A first read of an image, switched off today',
    blurb: 'Drop in an X-ray, an ECG or a photo of a wound. The local model drafts a first read for the clinician to correct, keep or discard, and the image never leaves the building. Lens is switched off in every deployment.',
    keywords: ['imaging', 'x-ray', 'xray', 'ecg', 'scans', 'radiology', 'image review', 'photo', 'wound'],
    area: 'ward',
    line: 'A first read, drafted on site for a clinician to correct. Switched off in every deployment.',
  },
  {
    to: '/relay', label: 'Relay', badge: 'One room per patient',
    blurb: 'One room per patient, with the team in it. Vigil posts its alerts into the room beside the conversation, and a message that looks like it belongs to another patient is delivered, then flagged.',
    keywords: ['messaging', 'chat', 'communication', 'teams', 'secure', 'rooms', 'channels', 'coordination', 'wrong patient'],
    area: 'ward',
    line: 'One room per patient. Alerts posted inline. A wrong-patient message delivered, then flagged.',
  },
  {
    to: '/helix', label: 'Helix', badge: 'Medication safety, order to bedside',
    blurb: 'The allergy interlock stops an order set at the one item that would harm the patient. Anything a model extracted from a note waits in the pharmacist’s queue until a named pharmacist verifies it.',
    keywords: ['medication', 'pharmacy', 'drugs', 'prescriptions', 'allergy', 'interactions', 'administration', 'emar', 'pharmacist'],
    area: 'ward',
    line: 'An allergy interlock on every order set. A pharmacist’s queue for anything a model extracted.',
  },
  {
    to: '/surgical-suite', label: 'Surgical Suite', badge: 'The theatre, on the ward’s record',
    blurb: 'The week’s list, the day’s theatre and the active cases moving through the WHO surgical checklist, with each patient’s NEWS2 band beside them.',
    keywords: ['surgery', 'operating room', 'theatre', 'or', 'checklists', 'schedules', 'perioperative', 'who checklist'],
    area: 'theatre',
    line: 'The week’s list, today’s theatre, and the WHO checklist step by step.',
  },
  {
    to: '/pulse', label: 'Pulse', badge: 'Outside signals, read against the ward',
    blurb: 'Weather, air quality, flu surveillance and drug recalls from public feeds, read against the ward. The only outbound call Orb makes carries a map coordinate and no patient.',
    keywords: ['environment', 'air quality', 'weather', 'population', 'community illness', 'signals', 'recalls', 'flu'],
    area: 'house',
    line: 'Weather, air quality, flu and recalls from public feeds. The one outbound call carries no patient.',
  },
  {
    to: '/forecast', label: 'Forecast', badge: 'The week ahead, in beds',
    blurb: 'Seven days of census against capacity, the discharge board and admission patterns. The forecasting model ships untrained and the screen says so. The bed arithmetic and the discharge board are live today.',
    keywords: ['capacity', 'beds', 'length of stay', 'discharge', 'planning', 'projection', 'availability', 'census'],
    area: 'house',
    line: 'Census against capacity for the week ahead, with the model’s status printed on the screen.',
  },
  {
    to: '/command-center', label: 'Command Center', badge: 'The whole house. One screen.',
    blurb: 'Occupancy, the critical count, sepsis bundles on track and downtime readiness, each with its denominator. The ward acuity map, and the highest NEWS2 scores by name.',
    keywords: ['command center', 'census', 'acuity', 'overview', 'operations', 'house-wide', 'dashboard', 'heatmap'],
    area: 'house',
    line: 'Census, acuity, bundles and downtime readiness. One screen, with denominators.',
  },
  {
    to: '/surge-simulator', label: 'Surge Simulator', badge: 'What if, on tonight’s census',
    blurb: 'Twenty admissions tonight, eight beds closed, flu at 1.5x. The simulator answers with peak occupancy, hours to overflow, beds short and the nurses you would need, with its assumptions listed.',
    keywords: ['surge', 'simulation', 'capacity', 'overflow', 'staffing', 'scenario', 'what-if', 'planning'],
    area: 'house',
    line: 'A surge or a closure, modelled on the live census: hours to overflow and nurses needed.',
  },
  {
    to: '/bridge', label: 'Bridge', badge: 'For the patient. In plain words.',
    blurb: 'A patient signs in with the code issued at admission and sees their care team, their vitals in plain words, their medications and their documents. Their record downloads as FHIR.',
    keywords: ['patients', 'families', 'plain language', 'portal', 'explanations', 'next steps', 'fhir', 'record'],
    area: 'patients',
    line: 'The patient’s own portal: vitals in plain words, medications, documents, and a FHIR download.',
  },
  {
    to: '/appointments', label: 'Appointments', badge: 'Follow-ups, with the score in view',
    blurb: 'Follow-ups, medication reviews and post-discharge checks in day columns, each with the patient’s NEWS2 band, so a review for a patient with a high score is never scheduled like the rest.',
    keywords: ['scheduling', 'follow-up', 'clinic', 'slots', 'booking', 'visits', 'calendar', 'appointments', 'review'],
    area: 'patients',
    line: 'The week’s follow-ups by day, each with the patient’s NEWS2 band beside the name.',
  },
  {
    to: '/revenue-integrity', label: 'Revenue Integrity', badge: 'Codes the chart already supports',
    blurb: 'Pick a patient. Press Analyze. Orb reads the signed notes on the chart and lists the codes they support and the gaps that block them, each with the sentence behind it.',
    keywords: ['revenue', 'coding', 'billing', 'reimbursement', 'claims', 'finance', 'back office', 'documentation'],
    area: 'office',
    line: 'The codes the chart supports and the gaps that block them, each with its sentence.',
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
  { ...byPath('/vigil'), navLabel: 'Vigil', summary: 'Every patient scored. Every point shown.' },
  { ...byPath('/sage'), navLabel: 'Sage', summary: 'Clinical answers, inside the building.' },
  { ...byPath('/helix'), navLabel: 'Helix', summary: 'Allergy interlock. Pharmacist’s queue.' },
  { ...byPath('/scribe'), navLabel: 'Scribe', summary: 'Speak it. Sign it. On site.' },
  { ...byPath('/bridge'), navLabel: 'Bridge', summary: 'Their care, in plain words.' },
  { ...byPath('/command-center'), navLabel: 'Command', summary: 'The whole house. One screen.' },
]

// ─── Plans ───
// No price is published on this site. The Plans page describes the founding
// hospital programme, and its copy lives in data/plans.ts. No figure goes up
// here until the founder decides to.

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
export const WEB3FORMS_ACCESS_KEY = 'f2327387-ec11-4f52-99f4-d496dc28e10f'

export const CONTACT_EMAIL = 'Mags@orbsuite.com'

export const openDemoModal = () =>
  window.dispatchEvent(new CustomEvent('open-demo-modal'))
