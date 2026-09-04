// ─── Module pages: one record per route ───
// Each page is the same layout (see pages/details/ModulePage.tsx) over this
// data and the capture registered for the route in components/showcases.
// Every card describes something visible in the captures or documented in the
// product; the caveat sits in the same sentence as the claim.

export type IconName =
  | 'chat' | 'pulse' | 'check' | 'building' | 'shield' | 'clock' | 'users' | 'file' | 'alert' | 'list'
  | 'pill' | 'mic' | 'image' | 'calendar' | 'chart' | 'lock' | 'offline' | 'search' | 'link' | 'bed' | 'scale'

export interface ModuleCard { icon: IconName; title: string; desc: string }

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
  /** A second capture strip of real screens. */
  moreScreens?: string[]
  moreCaptions?: Record<string, string>
  tallScreens?: string[]
}

export const MODULE_PAGES: ModulePageData[] = [
  {
    route: '/vigil',
    title: 'Vigil',
    badge: 'Vitals and early warning',
    tagline: 'Every patient scored on NEWS2 as the vitals arrive. The ward is ordered by that score, every point on it is explained, and the Sepsis Six clock starts the moment the score crosses the line.',
    cards: [
      { icon: 'pulse', title: 'A deterministic score, not a model', desc: 'NEWS2 is the Royal College of Physicians table (2017), applied to every set of observations on the appliance. Any nurse can check any point by hand, and the ward’s escalation sentence comes from the same table.' },
      { icon: 'list', title: 'The ward, ordered by risk', desc: 'The board lists patients by NEWS2, highest first, with the vitals that put them there. In the demo a monitor feed moves the numbers; on a ward the feed is the monitor or the nurse’s hands.' },
      { icon: 'clock', title: 'Sepsis Six with a clock on it', desc: 'When the score crosses the threshold the six actions appear on the chart with a 60-minute target, and each one turns overdue on its own. Nobody has to remember to start the timer.' },
      { icon: 'chat', title: 'Sage’s assessment, labelled', desc: 'Under the score sits a short assessment from the local model, marked as written by a model and not by a clinician, drafted for review only. The score itself never comes from the model.' },
    ],
    ctaLine: 'The score the ward already trusts, computed on every observation and explained on the chart.',
    tryNews2: true,
    moreScreens: ['vigil-patient-board', 'vigil-patient-chart', 'vigil-news2-explained', 'vigil-patient-story', 'nurse-my-shift', 'nurse-observations-news2-live'],
    moreCaptions: {
      'vigil-patient-board': 'The board: NEWS2 first, the vitals that drive it, the alerts already raised.',
      'vigil-patient-chart': 'The chart: live vitals, the Sepsis Six clock, the clinical course and the labs.',
      'vigil-news2-explained': 'Why this score: every parameter and the points it contributes.',
      'vigil-patient-story': 'Patient Story: alerts, notes, doses, handovers and bundles in one timeline.',
      'nurse-my-shift': 'Nurse mode: what is due now, with how late each item is.',
      'nurse-observations-news2-live': 'Recording observations: the score and its escalation appear before the nurse saves.',
    },
  },
  {
    route: '/sage',
    title: 'Sage',
    badge: 'Clinical questions, answered on the appliance',
    tagline: 'Ask about a guideline or a patient. The answer comes from a model running inside the hospital, with the guidance it read listed underneath, and it refuses to see a chart outside your department.',
    cards: [
      { icon: 'building', title: 'Two models, both in the building', desc: 'A 27-billion-parameter medical model for patient, medication and dose questions, and a smaller one for general questions in fast mode. That floor is not a toggle: patient and dosing questions always go to the careful model.' },
      { icon: 'search', title: 'It shows what it read', desc: 'Under an answer, “Show details” lists the guidance the model retrieved and the timing of the answer. A limited-evidence or high-risk badge is added before the first sentence, not after.' },
      { icon: 'lock', title: 'Scope is enforced by the server', desc: 'A General Medicine login asking about a cardiology bed gets nothing, because the server never hands that chart to the model. A direct API call for it returns 404, as if the patient were not there.' },
      { icon: 'check', title: 'It drafts. A person signs.', desc: 'Sage never places an order, files a note or changes a chart on its own. What it drafts goes through the same allergy interlock, dose guard and pharmacist queue as anything typed by hand.' },
    ],
    ctaLine: 'A clinical answer with its sources, from a model that never leaves the hospital.',
    moreScreens: ['sage-panel'],
    moreCaptions: { 'sage-panel': 'Sage: the conversation view, with fast and careful modes.' },
  },
  {
    route: '/scribe',
    title: 'Scribe',
    badge: 'Dictation to a signed note',
    tagline: 'Type or dictate the consultation. The local model drafts a SOAP note, a second pass checks it against what was said, and the clinician signs by name. Signing is the trigger for everything downstream.',
    cards: [
      { icon: 'mic', title: 'Transcribed on the appliance', desc: 'Speech is transcribed by a model on the appliance, not by a cloud service. Typed text works the same way, and the demo captures use typed text.' },
      { icon: 'file', title: 'Structured, then checked', desc: 'The draft is a SOAP note, a discharge summary or an I-PASS handover. A second pass compares it with the transcript and lists unsupported claims and omissions as verification findings.' },
      { icon: 'check', title: 'Signing is a decision on the record', desc: 'A note that was never verified against audio makes the clinician type SIGN before it is accepted. The signature, the time and the verification state are stored with the note.' },
      { icon: 'pill', title: 'A signed note feeds the pharmacy', desc: 'Medications named in a signed note are extracted, screened and queued for a pharmacist. They do not become active orders until a named pharmacist verifies them.' },
    ],
    ctaLine: 'From a dictated consultation to a signed, verified note without the note leaving the building.',
    moreScreens: ['scribe'],
    moreCaptions: { scribe: 'Scribe before a transcript: dictate, or type.' },
  },
  {
    route: '/lens',
    title: 'Lens',
    badge: 'A first read of an image',
    tagline: 'Upload an X-ray, an ECG or a photo of a wound and the local model drafts a first read for the clinician to correct, keep or discard. The image stays on the appliance.',
    cards: [
      { icon: 'image', title: 'Any image the ward has', desc: 'A chest film, an ECG strip, a clinical photo. Drag it in from a phone or a workstation; there is no integration to wait for.' },
      { icon: 'search', title: 'A draft, labelled as one', desc: 'The read is marked as a model draft. It is a starting point for the clinician’s own report, and it is not stored as a finding until someone signs it.' },
      { icon: 'building', title: 'Nothing is uploaded elsewhere', desc: 'The model that reads the image runs on the appliance. No image, and no text about it, leaves the hospital.' },
      { icon: 'alert', title: 'What it is not', desc: 'Lens is not a certified diagnostic device and the product says so on screen. It exists to save a clinician the blank page, not to replace the radiologist.' },
    ],
    ctaLine: 'A first read on site, for a clinician to correct.',
  },
  {
    route: '/relay',
    title: 'Relay',
    badge: 'Case rooms for the team',
    tagline: 'One room per patient. Vigil posts its alerts into the room beside the conversation, and a message about the wrong patient is delivered with a warning rather than blocked.',
    cards: [
      { icon: 'users', title: 'One room per patient', desc: 'Every admitted patient has a case room with the team in it. The department’s rooms are listed by recency or urgency, with the NEWS2 band next to each name.' },
      { icon: 'alert', title: 'Alerts land where the talk is', desc: 'When Vigil raises an alert it is posted into the room with the vitals that caused it, so the conversation and the numbers sit together.' },
      { icon: 'check', title: 'Wrong patient, right ward', desc: 'Type an order for Rajesh into Suresh’s room and Orb sends it, then says so: this looks like it belongs to Rajesh, move it? A nurse mid-emergency does not need a modal.' },
      { icon: 'pill', title: 'Orders typed in chat are gated', desc: 'A medication order typed as a message is read by a local model and checked against the same medication safety gate as an order form. It does not become an order by being said.' },
    ],
    ctaLine: 'The team’s conversation, with the ward’s alerts and safeguards inside it.',
    moreScreens: ['relay-case-rooms', 'relay-case-room'],
    moreCaptions: {
      'relay-case-rooms': 'Case rooms for the department, by recency or urgency.',
      'relay-case-room': 'A room: Vigil’s alerts inline, and the Sage panel on the right.',
    },
  },
  {
    route: '/helix',
    title: 'Helix',
    badge: 'Pharmacy and medication safety',
    tagline: 'The allergy interlock stops an order set at the item that would harm the patient. Anything a model extracted from a note waits in a queue until a named pharmacist verifies it.',
    cards: [
      { icon: 'shield', title: 'Applied whole or not at all', desc: 'A Sepsis Six bundle for a patient with a documented ceftriaxone anaphylaxis stops at the ceftriaxone with the reaction spelled out, and the Apply button stays disabled. A half-applied bundle is its own emergency.' },
      { icon: 'pill', title: 'Extracted is not prescribed', desc: 'Prednisolone named in a signed Scribe note appears in the pharmacist’s queue marked AI EXTRACTED, with dose, route and frequency editable. It becomes an order when a pharmacist says so.' },
      { icon: 'alert', title: 'Unscreened says unscreened', desc: 'When a drug is outside the interaction knowledge base the queue says NOT SCREENED and asks for a manual check, instead of showing a green tick it has not earned.' },
      { icon: 'lock', title: 'Overrides belong to prescribers', desc: 'A nurse cannot override an allergy block at the bedside; only a prescriber can, and the override is recorded in their name. The eMAR shows the allergy on the administration sheet itself.' },
    ],
    ctaLine: 'Medication safety that holds at the order, at the pharmacy and at the bedside.',
    moreScreens: ['orders-sepsis-six', 'pharmacy-verify-queue', 'nurse-administer-medication', 'pharmacy-helix-overview', 'pharmacy-formulary'],
    moreCaptions: {
      'orders-sepsis-six': 'Sepsis Six for a patient allergic to ceftriaxone: eight items cleared, one STOPPED.',
      'pharmacy-verify-queue': 'The verification queue: dose, route, frequency, source and safety line.',
      'nurse-administer-medication': 'Administering a dose, with the allergy on the sheet.',
      'pharmacy-helix-overview': 'The pharmacy overview.',
      'pharmacy-formulary': 'The formulary.',
    },
  },
  {
    route: '/surgical-suite',
    title: 'Surgical Suite',
    badge: 'Theatre lists and checklists',
    tagline: 'The week’s list, the day’s theatre and the active cases, moving through the WHO surgical safety checklist with the risk flag beside each patient.',
    cards: [
      { icon: 'calendar', title: 'The week and the day', desc: 'Every listed procedure with its theatre, surgeon, duration and readiness, in a week view and a day view. The demo lists one procedure; a real list is as long as yours.' },
      { icon: 'check', title: 'The WHO checklist, step by step', desc: 'Sign-in, time-out and sign-out are recorded as they happen, per case, in the name of the person who did them.' },
      { icon: 'alert', title: 'Risk on the list, not in a drawer', desc: 'Each patient carries their risk band and their NEWS2 onto the theatre list, so the surgeon sees the same number the ward does.' },
      { icon: 'users', title: 'Built on the same record', desc: 'The theatre list, the ward chart and the pharmacy read one database, so an allergy recorded at admission is the allergy the anaesthetist sees.' },
    ],
    ctaLine: 'The theatre list on the same record as the ward.',
  },
  {
    route: '/pulse',
    title: 'Pulse',
    badge: 'Outside signals',
    tagline: 'Weather, air quality, flu surveillance and drug recalls from public feeds, read against the ward. This is the only place Orb calls out, and the call carries a map coordinate and no patient.',
    cards: [
      { icon: 'chart', title: 'Four public feeds', desc: 'Weather and air quality from Open-Meteo, flu activity from CDC FluView, drug recalls from openFDA. Each is named on the screen with the time it was read.' },
      { icon: 'lock', title: 'Inbound only', desc: 'The request sends a map coordinate. It carries no patient data, every call is logged, and the firewall can block it with no loss of clinical function.' },
      { icon: 'alert', title: 'Signals, not diagnoses', desc: 'A heat wave, a bad air day or a flu rise becomes a note on the ward’s day. It does not change anyone’s score.' },
      { icon: 'pill', title: 'Recalls against the formulary', desc: 'A drug recall is listed with its class and reason so the pharmacy can check the formulary the same morning.' },
    ],
    ctaLine: 'What is happening outside, read against the ward inside.',
  },
  {
    route: '/forecast',
    title: 'Forecast',
    badge: 'Census and capacity ahead',
    tagline: 'Seven-day census against capacity, the discharge board and admission patterns. The forecasting model ships untrained and the screen says so; the bed arithmetic and the discharge board are live today.',
    cards: [
      { icon: 'chart', title: 'Census against capacity', desc: 'Current census, beds free in 48 hours, discharges this week and the peak day, with a seven-day occupancy projection drawn against capacity.' },
      { icon: 'alert', title: 'Untrained, and labelled', desc: 'The neural model behind the projection has not been trained on real data yet, so every figure is marked model_trained=false and the page header carries an “AI Untrained” badge. That badge comes off when the numbers earn it.' },
      { icon: 'bed', title: 'The discharge board is live', desc: 'Who is likely ready, what is blocking the rest, and the ward-by-ward capacity view are computed from the record, not from the model.' },
      { icon: 'shield', title: 'Registered in Model Governance', desc: 'Forecast appears in the admin Model Governance register with its version and validation state, next to the deterministic NEWS2 engine that drives escalation.' },
    ],
    ctaLine: 'The week ahead, with the model’s status printed on the page.',
  },
  {
    route: '/command-center',
    title: 'Command Center',
    badge: 'The whole house on one screen',
    tagline: 'Census, critical patients, sepsis bundle compliance and downtime readiness, with the ward acuity map and the active deteriorations by name.',
    cards: [
      { icon: 'building', title: 'Four numbers the house runs on', desc: 'Occupancy against beds, the critical count, the share of sepsis bundles on track, and how many downtime snapshots are fresh, each with its denominator.' },
      { icon: 'chart', title: 'The acuity map', desc: 'Every ward as a tile with its critical, elevated and stable counts, so pressure is visible before it becomes a phone call.' },
      { icon: 'alert', title: 'Deteriorations by name', desc: 'The active deteriorations list the patient, the bed and the NEWS2, in the same order Vigil uses on the ward.' },
      { icon: 'offline', title: 'Downtime readiness is a number', desc: 'A printable snapshot per patient is kept fresh on the appliance. The screen shows how many are current and offers to capture them all.' },
    ],
    ctaLine: 'The whole house on one screen, with denominators.',
  },
  {
    route: '/surge-simulator',
    title: 'Surge Simulator',
    badge: 'What-if on the live census',
    tagline: 'Twenty admissions tonight, eight beds closed, a flu surge at 1.5x. The simulator answers with peak occupancy, hours to overflow, beds short and the nurses you would need, with its assumptions listed.',
    cards: [
      { icon: 'chart', title: 'Starts from the real census', desc: 'The baseline is today’s census, bed count and admissions per day from the record, not a spreadsheet typed in for the meeting.' },
      { icon: 'list', title: 'Presets and sliders', desc: 'Twenty admissions tonight, close eight beds, flu at 1.5x, a mass casualty of thirty, aggressive discharge, open six beds. Or move the sliders for admissions, beds, admission rate and length of stay.' },
      { icon: 'clock', title: 'Answers you can act on', desc: 'Peak occupancy, hours to overflow, beds short at peak, discharges needed and extra nurses, over a horizon from twelve hours to seven days.' },
      { icon: 'file', title: 'Assumptions on the page', desc: 'The model assumptions and their citations sit under the chart, so the number can be argued with.' },
    ],
    ctaLine: 'Rehearse the surge on your own numbers.',
  },
  {
    route: '/bridge',
    title: 'Bridge',
    badge: 'The patient’s own view',
    tagline: 'A patient signs in with the code issued at admission and sees their care team, their vitals in plain words, their medications, results and documents, and can download their record as FHIR.',
    cards: [
      { icon: 'users', title: 'The care team by name', desc: 'Who is looking after them, what the diagnosis is, and what happens next, written for a patient and not for a coder.' },
      { icon: 'pulse', title: 'Vitals in plain words', desc: 'Heart rate, blood pressure, oxygen, temperature and breathing with a trend line and a plain sentence: in the normal range, or above it, and what the team is watching.' },
      { icon: 'file', title: 'Their record, in their hands', desc: 'Medications, results and documents to read, and the whole record to download as FHIR. It is their record.' },
      { icon: 'chat', title: 'Questions get a plain answer', desc: 'Ask when you can go home and the answer explains what the team is watching and points you to your nurse or doctor. It does not give medical advice, and the text says so.' },
    ],
    ctaLine: 'The patient sees their own care, in plain language.',
    moreScreens: ['bridge-patient-portal', 'bridge-medications', 'bridge-labs', 'bridge-documents'],
    tallScreens: ['bridge-patient-portal'],
    moreCaptions: {
      'bridge-patient-portal': 'The portal, top to bottom.',
      'bridge-medications': 'My medications.',
      'bridge-labs': 'My results.',
      'bridge-documents': 'My documents.',
    },
  },
  {
    route: '/appointments',
    title: 'Appointments',
    badge: 'Follow-ups and reviews',
    tagline: 'Follow-ups, medication reviews and post-discharge checks in day columns, each with the patient’s risk band, so the critical ones are not scheduled like the rest.',
    cards: [
      { icon: 'calendar', title: 'A week in columns', desc: 'Today’s appointments, the week’s total, the critical patients among them and the post-discharge reviews, then the days side by side.' },
      { icon: 'alert', title: 'Risk on the slot', desc: 'Each slot carries the patient’s band: critical, elevated or stable. A follow-up for a critical patient is not the same task as a routine wound check.' },
      { icon: 'link', title: 'Booked from the chart', desc: 'A discharge summary or a review order creates the appointment; there is no second system to keep in step.' },
      { icon: 'users', title: 'Visible to the patient', desc: 'The same appointment shows in Bridge, with the date and the reason, in the patient’s words.' },
    ],
    ctaLine: 'Follow-ups scheduled from the record, with the risk in view.',
  },
  {
    route: '/revenue-integrity',
    title: 'Revenue Integrity',
    badge: 'Coding from the notes on the chart',
    tagline: 'Pick a patient and press Analyze. Orb reads the notes already on the chart and lists the codes they support and the documentation gaps that block them, each with the sentence it came from.',
    cards: [
      { icon: 'search', title: 'It reads what is already written', desc: 'The analysis runs over the signed notes and results on the chart. Nothing is invented to fit a code; a claim without a sentence behind it is not made.' },
      { icon: 'file', title: 'The evidence sentence', desc: 'Every suggested code carries the note and the sentence that supports it, so a coder can accept or reject it in seconds.' },
      { icon: 'alert', title: 'Gaps, named', desc: 'Where a condition is treated but not documented well enough to code, the gap is listed as a query for the clinician, not as a code.' },
      { icon: 'building', title: 'On the appliance', desc: 'The model that reads the notes runs inside the hospital, on the same record. No chart is sent to a coding vendor.' },
    ],
    ctaLine: 'The codes the chart already supports, and the gaps that block them.',
  },
]

export const modulePage = (route: string): ModulePageData => {
  const p = MODULE_PAGES.find(m => m.route === route)
  if (!p) throw new Error(`Unknown module page: ${route}`)
  return p
}
