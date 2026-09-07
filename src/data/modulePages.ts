// ─── Module pages: one record per route ───
// Each page is the same layout (see pages/details/ModulePage.tsx) over this
// data and the capture registered for the route in components/showcases.
// Every card describes something visible in the captures or documented in the
// product; the caveat sits in the same sentence as the claim.

export type IconName =
  | 'chat' | 'pulse' | 'check' | 'building' | 'shield' | 'clock' | 'users' | 'file' | 'alert' | 'list'
  | 'pill' | 'mic' | 'image' | 'calendar' | 'chart' | 'lock' | 'offline' | 'search' | 'link' | 'bed' | 'scale'

export interface ModuleCard { icon: IconName; title: string; desc: string }

/** One real capture: the key into SCREENS, a short tab label, and what it shows. */
export interface ModuleShot { name: string; label: string; caption: string }

export interface ModulePageData {
  route: string
  title: string
  badge: string
  tagline: string
  cards: ModuleCard[]
  ctaLine: string
  /** Under the main capture; defaults to the standard "captured from a running appliance" line. */
  captureNote?: string
  /** Render the live NEWS2 widget under the cards. */
  tryNews2?: boolean
  /** The real captures for this module, shown one at a time under the facts. */
  shots?: ModuleShot[]
}

export const MODULE_PAGES: ModulePageData[] = [
  {
    route: '/vigil',
    title: 'Vigil',
    badge: 'Vitals and early warning',
    tagline: 'Every patient scored on NEWS2 as the vitals arrive, the ward ordered by that score, and the Sepsis Six clock started for you.',
    cards: [
      { icon: 'pulse', title: 'A deterministic score, not a model', desc: 'NEWS2 straight from the Royal College of Physicians table. Any nurse can check any point by hand.' },
      { icon: 'list', title: 'The ward, ordered by risk', desc: 'Highest score first, with the vitals that put each patient there.' },
      { icon: 'clock', title: 'Sepsis Six with a clock on it', desc: 'Cross the threshold and six actions appear with a 60-minute target, each going overdue on its own.' },
      { icon: 'chat', title: 'Sage’s assessment, labelled', desc: 'A short assessment from the local model, marked as a model’s. The score itself never comes from a model.' },
    ],
    ctaLine: 'The score the ward already trusts, computed on every observation and explained on the chart.',
    shots: [
      { name: 'vigil-patient-board', label: 'The board', caption: 'The ward ordered by NEWS2, with the vitals that drive each score and the alerts already raised.' },
      { name: 'vigil-patient-chart', label: 'A chart', caption: 'One patient: live vitals, the Sepsis Six clock, the clinical course and the labs.' },
      { name: 'vigil-news2-explained', label: 'Why this score', caption: 'Every parameter and the points it contributes, so the number can be checked by hand.' },
      { name: 'vigil-patient-story', label: 'Patient story', caption: 'Alerts, notes, doses, handovers and bundles in one timeline.' },
      { name: 'nurse-my-shift', label: 'The nurse’s shift', caption: 'What is due now, with how late each item is.' },
      { name: 'nurse-observations-news2-live', label: 'Recording obs', caption: 'The score and its escalation sentence appear before the nurse saves.' },
    ],
    tryNews2: true,
  },
  {
    route: '/sage',
    title: 'Sage',
    badge: 'Clinical questions, answered on the appliance',
    tagline: 'Ask about a guideline or a patient. The answer comes from a model inside the hospital, with the guidance it read listed underneath.',
    cards: [
      { icon: 'building', title: 'Two models, both in the building', desc: 'A 27-billion-parameter medical model for patient, medication and dose questions, a smaller one for the rest. That floor is not a toggle.' },
      { icon: 'search', title: 'It shows what it read', desc: 'Show details lists the guidance retrieved, with a limited-evidence or high-risk badge before the first sentence.' },
      { icon: 'lock', title: 'Scope is enforced by the server', desc: 'A General Medicine login gets nothing for a cardiology bed. A direct API call for that chart returns 404.' },
      { icon: 'check', title: 'It drafts. A person signs.', desc: 'Sage never places an order or files a note itself. What it drafts meets the same gates as anything typed by hand.' },
    ],
    ctaLine: 'A clinical answer with its sources, from a model that never leaves the hospital.',
    shots: [
      { name: 'sage-panel', label: 'Sage', caption: 'Sage on open: recent conversations, the quick starts, and the modes an answer can come back in.' },
    ],
  },
  {
    route: '/scribe',
    title: 'Scribe',
    badge: 'Dictation to a signed note',
    tagline: 'Type or dictate the consultation. The local model drafts the note, a second pass checks it, and the clinician signs by name.',
    cards: [
      { icon: 'mic', title: 'Transcribed on the appliance', desc: 'Speech is transcribed on site, not by a cloud service.' },
      { icon: 'file', title: 'Structured, then checked', desc: 'A SOAP note, discharge summary or I-PASS handover, with unsupported claims and omissions listed against the transcript.' },
      { icon: 'check', title: 'Signing is a decision on the record', desc: 'A note never verified against audio makes the clinician type SIGN. The signature and verification state are stored with it.' },
      { icon: 'pill', title: 'A signed note feeds the pharmacy', desc: 'Medications it names are extracted and queued. They are not orders until a pharmacist verifies them.' },
    ],
    ctaLine: 'From a dictated consultation to a signed, verified note without the note leaving the building.',
    shots: [
      { name: 'handoff-ipass', label: 'An I-PASS handover', caption: 'A handover drafted from what is already on the chart, for a clinician to check and sign.' },
    ],
  },
  {
    route: '/lens',
    title: 'Lens',
    badge: 'A first read of an image',
    tagline: 'Upload an X-ray, an ECG or a photo of a wound, and the local model drafts a first read for the clinician to correct.',
    cards: [
      { icon: 'image', title: 'Any image the ward has', desc: 'A chest film, an ECG strip or a clinical photo, dragged in from a phone or a workstation.' },
      { icon: 'search', title: 'A draft, labelled as one', desc: 'Marked as a model draft, and not stored as a finding until someone signs it.' },
      { icon: 'building', title: 'Nothing is uploaded elsewhere', desc: 'The model runs on the appliance. No image, and no text about it, leaves the hospital.' },
      { icon: 'alert', title: 'What it is not', desc: 'Not a certified diagnostic device, and the product says so on the screen.' },
    ],
    ctaLine: 'A first read on site, for a clinician to correct.',
  },
  {
    route: '/relay',
    title: 'Relay',
    badge: 'Case rooms for the team',
    tagline: 'One room per patient. Vigil posts its alerts beside the conversation, and a message about the wrong patient is flagged rather than blocked.',
    cards: [
      { icon: 'users', title: 'One room per patient', desc: 'Every admitted patient has a case room with the team in it, listed with their NEWS2 band.' },
      { icon: 'alert', title: 'Alerts land where the talk is', desc: 'Vigil posts each alert into the room with the vitals that caused it.' },
      { icon: 'check', title: 'Wrong patient, right ward', desc: 'Orb delivers the message, then asks whether it belongs to the other patient. Nobody mid-emergency gets a modal.' },
      { icon: 'pill', title: 'Orders typed in chat are gated', desc: 'A medication order typed as a message meets the same safety gate as an order form.' },
    ],
    ctaLine: 'The team’s conversation, with the ward’s alerts and safeguards inside it.',
    shots: [
      { name: 'relay-case-rooms', label: 'Case rooms', caption: 'The department’s rooms, by recency or urgency, with each patient’s NEWS2 band.' },
      { name: 'relay-case-room', label: 'A room', caption: 'One room: Vigil’s alerts posted inline with the vitals that caused them.' },
    ],
  },
  {
    route: '/helix',
    title: 'Helix',
    badge: 'Pharmacy and medication safety',
    tagline: 'The allergy interlock stops an order set at the item that would harm the patient, and extracted medications wait for a named pharmacist.',
    cards: [
      { icon: 'shield', title: 'Applied whole or not at all', desc: 'A Sepsis Six bundle stops at the ceftriaxone for a patient with documented anaphylaxis, and Apply stays disabled.' },
      { icon: 'pill', title: 'Extracted is not prescribed', desc: 'Medications pulled from a signed note wait in the queue marked AI EXTRACTED until a pharmacist decides.' },
      { icon: 'alert', title: 'Unscreened says unscreened', desc: 'A drug outside the interaction knowledge base is marked NOT SCREENED, not given a green tick it has not earned.' },
      { icon: 'lock', title: 'Overrides belong to prescribers', desc: 'A nurse cannot clear an allergy block at the bedside, and the override is recorded in the prescriber’s name.' },
    ],
    ctaLine: 'Medication safety that holds at the order, at the pharmacy and at the bedside.',
    shots: [
      { name: 'orders-sepsis-six', label: 'Order sets', caption: 'Order sets are applied to a named patient. The gates are patient-specific, so nothing is shown until Orb knows whose chart this is.' },
      { name: 'pharmacy-verify-queue', label: 'Verification queue', caption: 'Dose, route, frequency, source and safety line, with AI EXTRACTED and NOT SCREENED said out loud.' },
      { name: 'nurse-administer-medication', label: 'At the bedside', caption: 'Administering a dose: the charted allergy is on the sheet, and the drug name has to be typed to confirm.' },
      { name: 'pharmacy-formulary', label: 'Formulary', caption: 'The formulary with stock levels, so low and out-of-stock items are visible where they are prescribed.' },
    ],
  },
  {
    route: '/surgical-suite',
    title: 'Surgical Suite',
    badge: 'Theatre lists and checklists',
    tagline: 'The week’s list, the day’s theatre and the active cases, moving through the WHO checklist with each patient’s risk beside them.',
    cards: [
      { icon: 'calendar', title: 'The week and the day', desc: 'Every listed procedure with its theatre, surgeon, duration and readiness.' },
      { icon: 'check', title: 'The WHO checklist, step by step', desc: 'Sign-in, time-out and sign-out recorded as they happen, in the name of the person who did them.' },
      { icon: 'alert', title: 'Risk on the list, not in a drawer', desc: 'Each patient carries their NEWS2 band onto the theatre list.' },
      { icon: 'users', title: 'Built on the same record', desc: 'An allergy recorded at admission is the allergy the anaesthetist sees.' },
    ],
    ctaLine: 'The theatre list on the same record as the ward.',
  },
  {
    route: '/pulse',
    title: 'Pulse',
    badge: 'Outside signals',
    tagline: 'Weather, air quality, flu surveillance and drug recalls, read against the ward. This is the only place Orb calls out.',
    cards: [
      { icon: 'chart', title: 'Four public feeds', desc: 'Open-Meteo, CDC FluView and openFDA, each named on the screen with the time it was read.' },
      { icon: 'lock', title: 'Inbound only', desc: 'The request carries a map coordinate and no patient. The firewall can block it with no loss of clinical function.' },
      { icon: 'alert', title: 'Signals, not diagnoses', desc: 'A heat wave or a bad air day becomes a note on the ward’s day. It changes nobody’s score.' },
      { icon: 'pill', title: 'Recalls against the formulary', desc: 'Each recall arrives with its class and reason, so the pharmacy can check the formulary that morning.' },
    ],
    ctaLine: 'What is happening outside, read against the ward inside.',
  },
  {
    route: '/forecast',
    title: 'Forecast',
    badge: 'Census and capacity ahead',
    tagline: 'Seven-day census against capacity, the discharge board and admission patterns. The forecasting model ships untrained, and the screen says so.',
    cards: [
      { icon: 'chart', title: 'Census against capacity', desc: 'Current census, beds free in 48 hours, discharges this week and the peak day.' },
      { icon: 'alert', title: 'Untrained, and labelled', desc: 'Every model figure is marked model_trained=false, and the badge comes off when the numbers earn it.' },
      { icon: 'bed', title: 'The discharge board is live', desc: 'Who is ready, what is blocking the rest and the ward capacity view, computed from the record.' },
      { icon: 'shield', title: 'Registered in Model Governance', desc: 'Listed with its version and validation state, next to the deterministic engine that drives escalation.' },
    ],
    ctaLine: 'The week ahead, with the model’s status printed on the page.',
  },
  {
    route: '/command-center',
    title: 'Command Center',
    badge: 'The whole house on one screen',
    tagline: 'Census, critical patients, sepsis bundle compliance and downtime readiness, with the ward acuity map and the deteriorations by name.',
    cards: [
      { icon: 'building', title: 'Four numbers the house runs on', desc: 'Occupancy, the critical count, bundles on track and fresh downtime snapshots, each with its denominator.' },
      { icon: 'chart', title: 'The acuity map', desc: 'Every ward as a tile, so pressure is visible before it becomes a phone call.' },
      { icon: 'alert', title: 'Deteriorations by name', desc: 'The patient, the bed and the NEWS2, in the order Vigil uses on the ward.' },
      { icon: 'offline', title: 'Downtime readiness is a number', desc: 'How many printable snapshots are current, and an offer to capture the rest.' },
    ],
    ctaLine: 'The whole house on one screen, with denominators.',
  },
  {
    route: '/surge-simulator',
    title: 'Surge Simulator',
    badge: 'What-if on the live census',
    tagline: 'Twenty admissions tonight, eight beds closed, flu at 1.5x. The simulator answers on your own census, with its assumptions listed.',
    cards: [
      { icon: 'chart', title: 'Starts from the real census', desc: 'Today’s census, beds and admission rate from the record, not a spreadsheet typed up for the meeting.' },
      { icon: 'list', title: 'Presets and sliders', desc: 'Six scenarios, or move admissions, beds, admission rate and length of stay yourself.' },
      { icon: 'clock', title: 'Answers you can act on', desc: 'Peak occupancy, hours to overflow, beds short, discharges needed and extra nurses.' },
      { icon: 'file', title: 'Assumptions on the page', desc: 'The assumptions and their citations sit under the chart, so the number can be argued with.' },
    ],
    ctaLine: 'Rehearse the surge on your own numbers.',
  },
  {
    route: '/bridge',
    title: 'Bridge',
    badge: 'The patient’s own view',
    tagline: 'A patient signs in with the code issued at admission and sees their team, their vitals in plain words, and their whole record.',
    cards: [
      { icon: 'users', title: 'The care team by name', desc: 'Who is looking after them and what happens next, written for a patient and not for a coder.' },
      { icon: 'pulse', title: 'Vitals in plain words', desc: 'Each observation with a trend and a sentence about what the team is watching.' },
      { icon: 'file', title: 'Their record, in their hands', desc: 'Medications, results and documents to read, and the whole record to download as FHIR.' },
      { icon: 'chat', title: 'Questions get a plain answer', desc: 'It points them to their nurse or doctor, does not give medical advice, and says so.' },
    ],
    ctaLine: 'The patient sees their own care, in plain language.',
    shots: [
      { name: 'bridge-patient-portal', label: 'The portal', caption: 'What the patient sees: their team, their status, their vitals and their follow-up.' },
      { name: 'bridge-medications', label: 'Medications', caption: 'Their medications, with dose, route, frequency and status.' },
      { name: 'bridge-documents', label: 'Documents', caption: 'Their notes and reports, to read and to take away.' },
    ],
  },
  {
    route: '/appointments',
    title: 'Appointments',
    badge: 'Follow-ups and reviews',
    tagline: 'Follow-ups, medication reviews and post-discharge checks in day columns, each carrying the patient’s risk band.',
    cards: [
      { icon: 'calendar', title: 'A week in columns', desc: 'Today, the week, the critical patients among them and the post-discharge reviews.' },
      { icon: 'alert', title: 'Risk on the slot', desc: 'A follow-up for a critical patient is not the same task as a routine wound check.' },
      { icon: 'link', title: 'Booked from the chart', desc: 'A discharge summary or a review order creates the appointment. There is no second system to keep in step.' },
      { icon: 'users', title: 'Visible to the patient', desc: 'The same appointment shows in Bridge, with the date and the reason in the patient’s words.' },
    ],
    ctaLine: 'Follow-ups scheduled from the record, with the risk in view.',
  },
  {
    route: '/revenue-integrity',
    title: 'Revenue Integrity',
    badge: 'Coding from the notes on the chart',
    tagline: 'Pick a patient and press Analyze. Orb reads the notes on the chart and lists the codes they support and the gaps that block them.',
    cards: [
      { icon: 'search', title: 'It reads what is already written', desc: 'The analysis runs over signed notes and results. Nothing is invented to fit a code.' },
      { icon: 'file', title: 'The evidence sentence', desc: 'Every suggested code carries the note and the sentence behind it.' },
      { icon: 'alert', title: 'Gaps, named', desc: 'A condition treated but not documented is listed as a query for the clinician, not as a code.' },
      { icon: 'building', title: 'On the appliance', desc: 'The model reads the notes inside the hospital. No chart is sent to a coding vendor.' },
    ],
    ctaLine: 'The codes the chart already supports, and the gaps that block them.',
  },
]

export const modulePage = (route: string): ModulePageData => {
  const p = MODULE_PAGES.find(m => m.route === route)
  if (!p) throw new Error(`Unknown module page: ${route}`)
  return p
}
