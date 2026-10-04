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
  /** The one claim, rendered under the module name at deck size. */
  badge: string
  /** The detail under the claim, at body size. Left out where it would only repeat the claim. */
  tagline?: string
  cards: ModuleCard[]
  ctaLine: string
  /** Under the main capture; defaults to the standard "captured from the product" line. */
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
    badge: 'The ward, by NEWS2 score',
    tagline: 'A nurse records a set of observations. Orb calculates NEWS2 from it, orders the ward by that score and shows which readings drive it.',
    cards: [
      { icon: 'pulse', title: 'Rule, not model', desc: 'NEWS2 straight from the Royal College of Physicians 2017 table. Any nurse can check any point by hand.' },
      { icon: 'list', title: 'Highest score first', desc: 'The ward ordered by NEWS2 score, each patient with the readings that put them there.' },
      { icon: 'clock', title: 'Sepsis Six, with a clock on it', desc: 'The clinician opens it from the chart. Six items, a 60-minute target, and each one shows when it is overdue.' },
      { icon: 'chat', title: 'A model’s note, labelled as one', desc: 'A short assessment from the local model, marked as the model’s. The score itself never comes from a model.' },
    ],
    ctaLine: 'Every observation scored. Every point explained.',
    shots: [
      // vigil-patient-board, vigil-patient-chart, vigil-news2-explained and vigil-patient-story: held back until recapture, 4 Oct 2026.
      { name: 'nurse-my-shift', label: 'The nurse’s shift', caption: 'What is due now, and how late each item is.' },
      { name: 'nurse-observations-news2-live', label: 'Recording obs', caption: 'The score and the RCP response sentence appear before the nurse saves.' },
    ],
    tryNews2: true,
  },
  {
    route: '/sage',
    title: 'Sage',
    badge: 'Clinical answers, inside the hospital',
    tagline: 'Ask about a guideline. Ask about a patient. The answer comes from a model in the building, and it lists the guidance it read.',
    cards: [
      { icon: 'building', title: 'Two models. Both in the building.', desc: 'A 27-billion-parameter medical model takes patient, medication and dose questions. A smaller one takes the rest. That floor is not a toggle.' },
      { icon: 'search', title: 'It shows what it read', desc: 'Show details lists the guidance retrieved, with a limited-evidence or high-risk badge before the first sentence.' },
      { icon: 'lock', title: 'Scope is enforced by the server', desc: 'A General Medicine login gets nothing for a cardiology bed. A direct API call for that chart returns 404.' },
      { icon: 'check', title: 'It drafts. You sign.', desc: 'Sage never places an order or files a note. A medication it drafts meets the allergy interlock and the dose guard, then waits for a pharmacist.' },
    ],
    ctaLine: 'Clinical answers with their sources, from a model that never leaves the building.',
    shots: [
      { name: 'sage-panel', label: 'Sage', caption: 'Sage on open: recent conversations, the quick starts and the modes an answer can come back in.' },
    ],
  },
  {
    route: '/scribe',
    title: 'Scribe',
    badge: 'From dictation to a signed note',
    tagline: 'Speak or type the consultation. The local model drafts the note, a second pass checks it if you ask, and you sign it by name.',
    cards: [
      { icon: 'mic', title: 'Transcribed in the building', desc: 'Speech is transcribed on the appliance. No cloud service hears it.' },
      { icon: 'file', title: 'Structured. Checked, if you ask.', desc: 'A SOAP note or an I-PASS handover. Turn on the optional second pass and unsupported claims and omissions are listed against the transcript.' },
      { icon: 'check', title: 'Signing is on the record', desc: 'A note never verified against audio makes you type SIGN. The signature and the verification state are stored with it.' },
      { icon: 'pill', title: 'A signed note feeds the pharmacy', desc: 'The medications it names are extracted and queued. They become orders only when a pharmacist verifies them.' },
    ],
    ctaLine: 'From a dictated consultation to a signed note, without the note leaving the building.',
    // The I-PASS capture is held back until it is recaptured: the one on file
    // prints NKDA for a patient whose chart carries an anaphylaxis.
  },
  {
    route: '/lens',
    title: 'Lens',
    badge: 'A first read of an image, switched off today',
    tagline: 'Switched off in every deployment, and not part of the founding programme. Upload an X-ray, an ECG or a wound photo and a model on the appliance drafts a first read for a clinician to correct.',
    cards: [
      { icon: 'image', title: 'Any image the ward has', desc: 'A chest film, an ECG strip or a clinical photo, dragged in from a phone or a workstation.' },
      { icon: 'search', title: 'A draft, labelled as one', desc: 'Marked as a model draft on the screen, for a clinician to correct, keep or discard.' },
      { icon: 'building', title: 'Nothing is uploaded anywhere', desc: 'The model runs on the appliance. No image, and no text about it, leaves the hospital.' },
      { icon: 'alert', title: 'Switched off today', desc: 'Lens is not a certified diagnostic device, and the screen says so. It is switched off in every deployment.' },
    ],
    ctaLine: 'A first read on site, for a clinician to correct. Switched off in every deployment today.',
  },
  {
    route: '/relay',
    title: 'Relay',
    badge: 'One room per patient',
    // No tagline: it opened by repeating the claim, and cards 01 to 03 carry the rest.
    cards: [
      { icon: 'users', title: 'One room per patient', desc: 'Every admitted patient has a case room with the team in it, listed with their NEWS2 band.' },
      { icon: 'alert', title: 'Alerts land where the talk is', desc: 'Vigil posts each alert into the room with the vitals that caused it.' },
      { icon: 'check', title: 'Wrong patient, right ward', desc: 'Orb delivers the message, then asks whether it belongs to the other patient. Nobody mid-emergency gets a modal.' },
      { icon: 'pill', title: 'Orders typed in chat are gated', desc: 'A medication order typed as a message is screened against the chart and waits for a pharmacist before it is an order.' },
    ],
    ctaLine: 'The team’s conversation, with the ward’s alerts and safeguards inside it.',
    shots: [
      { name: 'relay-case-rooms', label: 'Case rooms', caption: 'The department’s rooms, by recency or urgency, each with the patient’s NEWS2 band.' },
      // relay-case-room: held back until recapture, 4 Oct 2026.
    ],
  },
  {
    route: '/helix',
    title: 'Helix',
    badge: 'Medication safety, order to bedside',
    tagline: 'The allergy interlock stops an order set at the item that would harm the patient. Extracted medications wait for a named pharmacist.',
    cards: [
      { icon: 'shield', title: 'Whole, or not at all', desc: 'A Sepsis Six bundle stops at the ceftriaxone for a patient with documented anaphylaxis. Apply stays disabled.' },
      { icon: 'pill', title: 'Extracted is not prescribed', desc: 'Medications pulled from a signed note wait in the queue marked AI EXTRACTED until a pharmacist decides.' },
      { icon: 'alert', title: 'Unscreened says unscreened', desc: 'A drug outside the interaction knowledge base is marked NOT SCREENED. The knowledge base is a short curated list, and a clear line is not a clearance.' },
      { icon: 'lock', title: 'Overrides belong to prescribers', desc: 'A nurse cannot clear an allergy block at the bedside. The override is recorded in the prescriber’s name.' },
    ],
    ctaLine: 'Three gates between the order and the bed.',
    shots: [
      { name: 'orders-sepsis-six', label: 'Order sets', caption: 'Order sets, on the Orders screen Helix runs through. They apply to a named patient. The gates are patient-specific, so nothing shows until Orb knows whose chart this is.' },
      // pharmacy-verify-queue, nurse-administer-medication and pharmacy-formulary: held back until recapture, 4 Oct 2026.
    ],
  },
  {
    route: '/surgical-suite',
    title: 'Surgical Suite',
    badge: 'The theatre, on the ward’s record',
    tagline: 'The week’s list and the day’s theatre, with the WHO checklist recorded step by step. Not part of the founding programme.',
    cards: [
      { icon: 'calendar', title: 'The week and the day', desc: 'Every listed procedure with its theatre, surgeon and duration.' },
      { icon: 'check', title: 'The WHO checklist, step by step', desc: 'Sign-in, time-out and sign-out recorded as they happen, in the name of the person who did them.' },
      { icon: 'alert', title: 'The NEWS2 band on the list', desc: 'Each patient carries their NEWS2 band onto the theatre list, so the surgeon sees the number the ward sees.' },
      { icon: 'users', title: 'One record', desc: 'The allergy on the ward’s chart is the allergy the anaesthetist sees.' },
    ],
    ctaLine: 'The theatre list on the same record as the ward.',
  },
  {
    route: '/pulse',
    title: 'Pulse',
    badge: 'Outside signals, read against the ward',
    tagline: 'Weather, air quality, flu and drug recalls from public feeds, read against your ward. The one place Orb calls out, and no patient goes with it.',
    cards: [
      { icon: 'chart', title: 'Four feeds, each named', desc: 'Weather and air quality from Open-Meteo, flu from CDC FluView, recalls from openFDA, each with the time it was read.' },
      { icon: 'lock', title: 'One call, one coordinate', desc: 'The request carries a latitude and a longitude. Block it at the firewall and nothing clinical changes.' },
      { icon: 'alert', title: 'A note on the day', desc: 'A heat wave or a bad air day becomes a note on the ward’s day. It changes nobody’s score.' },
      { icon: 'pill', title: 'Recalls against the formulary', desc: 'Each US FDA recall arrives with its class and reason, so the pharmacy can check the formulary that morning. An Indian recall feed is not wired yet.' },
    ],
    ctaLine: 'What is happening outside, read against the ward inside.',
  },
  {
    route: '/forecast',
    title: 'Forecast',
    badge: 'The week ahead, in beds',
    tagline: 'Seven days of census against capacity, the discharge board and admission patterns. The forecasting model ships untrained, and the screen says so.',
    cards: [
      { icon: 'chart', title: 'Census against capacity', desc: 'Current census, beds free in 48 hours, discharges this week and the peak day.' },
      { icon: 'alert', title: 'Untrained, and labelled', desc: 'Every model figure is marked model_trained=false. The badge comes off when the numbers earn it.' },
      { icon: 'bed', title: 'The bed arithmetic is live', desc: 'Beds free, discharges this week and the ward capacity view, computed from the record. The discharge order is the untrained model’s guess, and the screen labels it as one.' },
      { icon: 'shield', title: 'Registered in Model Governance', desc: 'Listed with its version and validation state, next to the NEWS2 table.' },
    ],
    ctaLine: 'The week ahead, with the model’s status printed on the page.',
  },
  {
    route: '/command-center',
    title: 'Command Center',
    badge: 'The whole house. One screen.',
    tagline: 'Occupancy, critical count, bundles on track and downtime readiness, each with its denominator. The acuity map, and the highest NEWS2 scores by name.',
    cards: [
      { icon: 'building', title: 'Four numbers the house runs on', desc: 'Occupancy, the critical count, bundles on track and fresh downtime snapshots, each with its denominator.' },
      { icon: 'chart', title: 'The acuity map', desc: 'Every ward as a tile, with its critical, elevated and stable counts.' },
      { icon: 'alert', title: 'Highest scores by name', desc: 'The patient, the bed and the NEWS2 score, in the order Vigil uses on the ward.' },
      { icon: 'offline', title: 'Downtime readiness is a number', desc: 'How many printable snapshots are current, and a button to capture the rest.' },
    ],
    ctaLine: 'The whole house on one screen, with denominators.',
  },
  {
    route: '/surge-simulator',
    title: 'Surge Simulator',
    badge: 'What if, on tonight’s census',
    tagline: 'Twenty admissions tonight. Eight beds closed. Flu at 1.5x. The simulator answers on your own census, with its assumptions listed under the chart.',
    cards: [
      { icon: 'chart', title: 'Starts from the real census', desc: 'Today’s census, beds and admission rate come from the record. No spreadsheet typed up for the meeting.' },
      { icon: 'list', title: 'Six presets, four sliders', desc: 'Six scenarios, or move admissions, beds, admission rate and length of stay yourself.' },
      { icon: 'clock', title: 'Answers you can act on tonight', desc: 'Peak occupancy, hours to overflow, beds short, discharges needed and extra nurses.' },
      { icon: 'file', title: 'Assumptions on the page', desc: 'The assumptions and their citations sit under the chart, so the number can be argued with.' },
    ],
    ctaLine: 'Rehearse the surge on your own numbers.',
  },
  {
    route: '/bridge',
    title: 'Bridge',
    badge: 'For the patient. In plain words.',
    tagline: 'A patient signs in with the code issued at admission and sees their team, their vitals in plain words and their record, theirs to download as FHIR.',
    cards: [
      { icon: 'users', title: 'The care team, by name', desc: 'Who is looking after them and how they are doing, written for the person in the bed.' },
      { icon: 'pulse', title: 'Vitals in plain words', desc: 'Each observation with a trend and a sentence about what the team is watching.' },
      { icon: 'file', title: 'Their record, in their hands', desc: 'Medications and documents to read, and their record to download as FHIR.' },
      { icon: 'chat', title: 'Questions get a plain answer', desc: 'It points them to their nurse or doctor, gives no medical advice, and says so.' },
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
    badge: 'Follow-ups, with the score in view',
    tagline: 'Follow-ups, medication reviews and post-discharge checks, in day columns. Every slot carries the patient’s NEWS2 band. Not part of the founding programme.',
    cards: [
      { icon: 'calendar', title: 'A week in columns', desc: 'Today, the week, the patients with high scores among them and the post-discharge reviews.' },
      { icon: 'alert', title: 'The band on the slot', desc: 'A follow-up for a patient with a high score is a different task from a routine wound check.' },
      { icon: 'link', title: 'On the same record', desc: 'The appointment is a row on the record the ward uses.' },
      { icon: 'users', title: 'Visible to the patient', desc: 'The same appointment shows in Bridge, with the date and the reason in the patient’s words.' },
    ],
    ctaLine: 'Follow-ups on the same record as the ward, with the NEWS2 band in view.',
  },
  {
    route: '/revenue-integrity',
    title: 'Revenue Integrity',
    badge: 'Codes the chart already supports',
    tagline: 'Pick a patient and press Analyze. Orb reads the notes on the chart and lists the codes they support and the gaps that block them, each with the sentence behind it.',
    cards: [
      { icon: 'search', title: 'It reads what is already written', desc: 'The analysis runs over signed notes and results, against a starter set of 22 ICD-10 codes today. Nothing is invented to fit a code.' },
      { icon: 'file', title: 'The evidence sentence', desc: 'Every suggested code carries the note and the sentence behind it.' },
      { icon: 'alert', title: 'Gaps, named', desc: 'A condition treated and not documented is listed as a query for the clinician, never as a code.' },
      { icon: 'building', title: 'On the appliance', desc: 'The model reads the notes inside the hospital. No chart goes to a coding vendor.' },
    ],
    ctaLine: 'The codes the chart already supports, and the gaps that block them.',
  },
]

export const modulePage = (route: string): ModulePageData => {
  const p = MODULE_PAGES.find(m => m.route === route)
  if (!p) throw new Error(`Unknown module page: ${route}`)
  return p
}
