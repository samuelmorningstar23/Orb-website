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
  /** Where this module stands against the founding programme. Defaults to PROGRAMME_NOTE. */
  programmeNote?: string
  /** Other things in Orb that belong with this module, shown under the facts as "Also in Orb". */
  more?: { title: string; desc: string }[]
}

/** The founding programme is narrower than any module page, and every page says so in the same words. */
export const PROGRAMME_NOTE = 'Not part of the founding programme, which starts with one ward’s observation record and a monthly file for the quality team.'

export const MODULE_PAGES: ModulePageData[] = [
  {
    route: '/vigil',
    title: 'Vigil',
    badge: 'The ward, by NEWS2 score',
    tagline: 'A nurse records a set of observations. Orb calculates NEWS2 from it, orders the ward by that score and shows which readings drive it.',
    cards: [
      { icon: 'pulse', title: 'The score comes from a table', desc: 'NEWS2 is the National Early Warning Score 2, the UK Royal College of Physicians’ 2017 table, and Orb reads the score straight off it. Any nurse can check any point by hand.' },
      { icon: 'list', title: 'Highest score first', desc: 'The ward ordered by NEWS2 score, each patient with the readings that put them there.' },
      { icon: 'clock', title: 'Sepsis Six, with a clock on it', desc: 'Orb opens it when NEWS2 reaches 7, and a clinician can open it from the chart at any score. Six items, a 60-minute target, each one showing when it is overdue. A hospital can switch the automatic start off.' },
      { icon: 'chat', title: 'A model’s note, labelled as one', desc: 'A short assessment from the local model, marked as the model’s. The score itself never comes from a model.' },
    ],
    ctaLine: 'A score any nurse can check by hand.',
    programmeNote: 'The founding programme starts with the observation record on this page, with the score switched off.',
    more: [
      { title: 'Today', desc: 'A doctor’s home screen: the highest scores on the ward, new results since they last looked, and what is waiting on them.' },
      { title: 'Ward round', desc: 'A round queue bed by bed, one screen per patient, and the plan typed or dictated onto the chart before moving on.' },
      { title: 'Patient story', desc: 'Admission, alerts, medicines, notes and bundles on one timeline, filtered by kind, with what is new since the doctor last marked the chart reviewed.' },
      { title: 'Discharge summary', desc: 'Drafted from the record, reviewed by a clinician, and printed for the patient to take home.' },
      { title: 'Print on demand', desc: 'The inpatient record, the medication list with the allergies at the top, the orders and the handover.' },
      { title: 'Scale 2 where it applies', desc: 'A patient flagged with chronic type 2 respiratory failure is scored on the RCP’s second oxygen scale, and a set with a box left blank is labelled an incomplete score.' },
      { title: 'A downtime pack', desc: 'A read-only copy of each patient’s chart, refreshed on the computer, to print for the hour the computer is down.' },
    ],
    shots: [
      // vigil-patient-board and vigil-patient-story: held back, 6 Oct 2026. The board's alerts tell the doctor
      // what to do, and the story prints a medicine's label twice (a product bug, being fixed).
      { name: 'vigil-patient-chart', label: 'The chart', caption: 'The chart: the latest readings with their points, and the Sepsis Six that Orb opened at NEWS2 7, with its clock and the six items.' },
      { name: 'today-doctor-home', label: 'Today', caption: 'A doctor’s home screen: the highest NEWS2 scores, new results since they last looked, and what is waiting on them.' },
      { name: 'ward-round', label: 'Ward round', caption: 'The round, bed by bed: allergies, what happened overnight, what needs deciding, and the plan typed or dictated onto the chart.' },
      { name: 'vigil-news2-explained', label: 'The score, explained', caption: 'Why this patient scores 12: each observation with its points and how it moved across the last six sets. The note above it is the model’s, and the screen says so.' },
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
      { icon: 'building', title: 'Two models. Both in the building.', desc: 'In fast mode the smaller model takes general questions. It is never sent a question about a patient, a medicine or a dose, and if the larger model is not loaded, the answer says which model replied.' },
      { icon: 'search', title: 'It shows what it read', desc: 'Show details lists the guidance retrieved, with a limited-evidence or high-risk badge before the first sentence.' },
      { icon: 'lock', title: 'The computer enforces who sees what', desc: 'A General Medicine login gets nothing for a cardiology bed, however the chart is asked for. Even a direct request to the server comes back empty.' },
      { icon: 'check', title: 'It drafts. You sign.', desc: 'Sage never places an order or files a note. Nothing it drafts happens until a clinician confirms it, and a confirmed medicine cannot be given until a pharmacist verifies it.' },
    ],
    ctaLine: 'Ask it a guideline question on the walkthrough and read what it cites.',
    more: [
      { title: 'Every answer can be replayed', desc: 'For each answer, refused ones included, Orb keeps the question, the model, the mode, the sources, the timing and the chart the model was shown, for an administrator to replay. Kept for 400 days by default.' },
    ],
    shots: [
      { name: 'sage-panel', label: 'Sage', caption: 'Sage on open: recent conversations, the quick starts and the modes an answer can come back in.' },
    ],
  },
  {
    route: '/scribe',
    title: 'Scribe',
    badge: 'From dictation to a signed note',
    tagline: 'Speak or type the consultation. The local model drafts the note, a second pass checks it where the hospital has switched that on, and you sign it by name.',
    cards: [
      { icon: 'mic', title: 'Transcribed in the building', desc: 'Speech is transcribed on the computer. No cloud service hears it.' },
      { icon: 'file', title: 'Structured, and checked where switched on', desc: 'A SOAP note, an I-PASS handover or a discharge summary. Where the hospital switches on the second pass, unsupported claims and omissions are listed against the transcript.' },
      { icon: 'check', title: 'Signing is on the record', desc: 'A note the automatic check did not pass, or never ran on, makes you type SIGN. The signature and the check’s result are stored with it.' },
      { icon: 'pill', title: 'A signed note feeds the pharmacy', desc: 'After signing, a model reads the note and charts the medicines it finds as unverified. A nurse cannot give one until a pharmacist verifies it.' },
    ],
    ctaLine: 'From a dictated consultation to a signed note, without the note leaving the building.',
    more: [
      { title: 'Revise a signed note', desc: 'A signed note can be revised. The new version takes its place and the old one stays on the record.' },
      { title: 'Discharge summaries', desc: 'The same local model drafts a discharge summary from the record for a clinician to review and print.' },
    ],
    // The I-PASS capture is held back until it is recaptured: the one on file
    // prints NKDA for a patient whose chart carries an anaphylaxis.
  },
  {
    route: '/lens',
    title: 'Lens',
    badge: 'A model’s first read of an X-ray or an ECG. Switched off today.',
    tagline: 'Upload an X-ray, an ECG or a wound photo and a model on the computer drafts a first read for a clinician to correct.',
    cards: [
      { icon: 'image', title: 'Any image the ward has', desc: 'A chest film, an ECG strip or a clinical photo, dragged in from a phone or a workstation.' },
      { icon: 'search', title: 'A draft, labelled as one', desc: 'Marked as a model draft on the screen, for a clinician to correct, keep or discard.' },
      { icon: 'building', title: 'Nothing is uploaded anywhere', desc: 'The model runs on the computer. No image, and no text about it, leaves the hospital.' },
      { icon: 'alert', title: 'Switched off today', desc: 'Lens is not a certified diagnostic device, and the screen says so. It is off by default and in the founding programme, and only an operator setting turns it on.' },
    ],
    ctaLine: 'Switched off by default, and the screen says why.',
  },
  {
    route: '/relay',
    title: 'Relay',
    badge: 'One room per patient',
    // No tagline: it opened by repeating the claim, and cards 01 to 03 carry the rest.
    cards: [
      { icon: 'users', title: 'Open to the department', desc: 'Every admitted patient gets a case room that the staff of their department can read and write, listed with the patient’s NEWS2 band.' },
      { icon: 'alert', title: 'Alerts land where the talk is', desc: 'Vigil posts each alert into the room with the vitals that caused it.' },
      { icon: 'check', title: 'Wrong patient, right ward', desc: 'Orb delivers the message, then asks whether it belongs to the other patient. Nobody mid-emergency gets a pop-up.' },
      { icon: 'pill', title: 'A medicine in chat becomes a card', desc: 'A clinician confirms the card, Orb screens it against the chart, and the medicine is charted as unverified with its dose left for review, so it cannot be given until a pharmacist verifies it.' },
    ],
    ctaLine: 'The team’s conversation, with the ward’s alerts and safeguards inside it.',
    more: [
      { title: 'A room for each department', desc: 'Each department also has a staff room of its own, outside the patients’ rooms.' },
    ],
    shots: [
      { name: 'relay-case-rooms', label: 'Case rooms', caption: 'The department’s rooms, by recency or urgency, each with the patient’s NEWS2 band.' },
      // relay-case-room: held back until recapture, 4 Oct 2026.
    ],
  },
  {
    route: '/helix',
    title: 'Helix',
    badge: 'Three gates between the order and the bed',
    tagline: 'The allergy block stops an order set at the item that would harm the patient. Medicines a model pulled from a note wait for a named pharmacist.',
    cards: [
      { icon: 'shield', title: 'Whole, or not at all', desc: 'A Sepsis Six bundle stops at the ceftriaxone for a patient with documented anaphylaxis. Apply stays disabled.' },
      { icon: 'pill', title: 'The pharmacist’s queue', desc: 'Medicines a model pulled from a note or a message are charted as unverified and wait in the pharmacist’s queue with their source on the row. A nurse cannot give one until a pharmacist verifies it.' },
      { icon: 'alert', title: 'Drugs outside the list', desc: 'A drug outside the interaction list is marked NOT SCREENED. That list is short, so a clear result only covers the drugs on it.' },
      { icon: 'lock', title: 'Overrides belong to prescribers', desc: 'A nurse cannot clear an allergy block at the bedside. The override is recorded in the prescriber’s name.' },
    ],
    ctaLine: 'The allergy block, the dose check, then a pharmacist.',
    more: [
      { title: 'The drug round', desc: 'The nurse types the drug’s name as charted before Given unlocks, and a medicine a model drafted is refused at the bedside until a pharmacist verifies it.' },
      { title: 'Signed for on the ward', desc: 'A medicine sent from the pharmacy is received on the ward by a nurse in her own name. The account that dispensed it cannot also receive it.' },
      { title: 'Order sets with their sources', desc: 'Protocol sets such as Sepsis Six and diabetic ketoacidosis, each citing the guideline it follows, applied to one named patient at a time.' },
      { title: 'The note behind the medicine', desc: 'Beside a medicine a model drafted, the pharmacist can open the signed note it came from, with who signed it and when.' },
      { title: 'Formulary and stock', desc: 'The pharmacy’s catalogue, with stock by lot and expiry date.' },
    ],
    shots: [
      { name: 'orders-sepsis-six', label: 'Order sets', caption: 'Order sets, on the Orders screen Helix runs through. They apply to a named patient. The gates are patient-specific, so nothing shows until Orb knows whose chart this is.' },
      { name: 'pharmacy-verify-queue', label: 'The pharmacist’s queue', caption: 'Two medications a model read out of signed notes, waiting for a pharmacist. The source column says where each came from, and the safety column says what was not screened.' },
      // nurse-administer-medication (the type-to-confirm field still says barcode-style) and pharmacy-formulary
      // (a stock ledger the founding programme does not include): held back, 6 Oct 2026.
    ],
  },
  {
    route: '/surgical-suite',
    title: 'Surgical Suite',
    badge: 'The theatre, on the ward’s record',
    tagline: 'The week’s list and the day’s theatre, with the WHO checklist recorded step by step.',
    cards: [
      { icon: 'calendar', title: 'The week and the day', desc: 'Every listed procedure with its theatre, surgeon and duration.' },
      { icon: 'check', title: 'The WHO checklist, step by step', desc: 'Sign-in, time-out and sign-out recorded as they happen, in the name of the person who did them.' },
      { icon: 'alert', title: 'The NEWS2 band on the list', desc: 'Each patient carries their NEWS2 band onto the theatre list, so the surgeon sees the number the ward sees.' },
      { icon: 'users', title: 'One record', desc: 'The ward and the theatre read one chart, so nothing is copied across by hand.' },
    ],
    ctaLine: 'The allergies typed at admission show on the theatre case.',
    more: [
      { title: 'Emergency cases', desc: 'An emergency case is listed at once, and the people alerted from it confirm or decline in Relay. The case cannot start until everyone alerted has answered.' },
      { title: 'Start and finish', desc: 'Each case’s start and finish are recorded, and an empty allergy list reads Allergies not recorded, never none.' },
    ],
  },
  {
    route: '/pulse',
    title: 'Pulse',
    badge: 'The season, for your part of India',
    tagline: 'Which season your hospital’s part of India is in, and what usually rises in it, from a calendar built into Orb. Nothing is fetched from the internet.',
    cards: [
      { icon: 'chart', title: 'Built for each part of India', desc: 'Fifty-six seasons, weather conditions and disease seasons across nine regions of India, chosen by the state your hospital is in.' },
      { icon: 'file', title: 'Each card names its source', desc: 'National guidelines and published surveillance, named on the card. Named, not linked, because there is no internet to follow a link to.' },
      { icon: 'alert', title: 'Context, not a number', desc: 'It says dengue season has started. It never says how many patients that means, and no patient score reads it.' },
      { icon: 'lock', title: 'Marked as a draft', desc: 'Until a clinician has reviewed the calendar, the screen says it is a draft above the cards.' },
    ],
    ctaLine: 'The season on the ward’s screen. Nothing fetched from outside.',
  },
  {
    route: '/forecast',
    title: 'Forecast',
    badge: 'The week ahead, in beds',
    tagline: 'Seven days of census against capacity, and the discharge board. The forecasting model has not been trained, so projections come from simple rules, and the screen says so.',
    cards: [
      { icon: 'chart', title: 'Census against capacity', desc: 'Current census, beds free in 48 hours, discharges this week and the peak day.' },
      { icon: 'alert', title: 'The model has not been trained yet', desc: 'Each projected figure carries an Untrained model label on the screen, and the label stays until a trained, validated model replaces the rules.' },
      { icon: 'bed', title: 'What comes from the record', desc: 'Today’s census and each ward’s occupancy come from the record. Beds free in 48 hours and the week’s discharges are projected by simple rules while the model is untrained, and each carries the label.' },
      { icon: 'shield', title: 'Registered in Model Governance', desc: 'Listed with its version and validation state, next to the NEWS2 table.' },
    ],
    ctaLine: 'The week ahead, with the model’s status printed on the page.',
  },
  {
    route: '/command-center',
    title: 'Command Center',
    badge: 'The whole hospital on one screen',
    tagline: 'Occupancy, critical count, bundles on track and downtime packs that are current, each with its denominator. The acuity map, and the highest NEWS2 scores by name.',
    cards: [
      { icon: 'building', title: 'Four numbers the hospital runs on', desc: 'Occupancy, the critical count, sepsis bundles on track and downtime packs that are current.' },
      { icon: 'chart', title: 'The acuity map', desc: 'Every ward as a tile, with its critical, elevated and stable counts.' },
      { icon: 'alert', title: 'Highest scores by name', desc: 'The patient, the bed and the NEWS2 score, in the order Vigil uses on the ward.' },
      { icon: 'offline', title: 'How many downtime packs are current', desc: 'The count of printable packs made in the last 24 hours, and a button that makes a fresh pack for every patient.' },
    ],
    ctaLine: 'Each headline number shows the count it was made from.',
    more: [
      { title: 'Today’s theatre list', desc: 'The day’s operating list with time, procedure, patient, theatre and status, on the same screen.' },
    ],
  },
  {
    route: '/surge-simulator',
    title: 'Surge Simulator',
    badge: 'Rehearse the surge on tonight’s census',
    tagline: 'Twenty admissions tonight. Eight beds closed. Flu at 1.5x. The simulator answers on your own census, with its assumptions listed under the chart.',
    cards: [
      { icon: 'chart', title: 'Starts from the real census', desc: 'Today’s census comes from the record, the admission rate is a set default until Orb has its own history to fit, and beds per ward are a site setting. No spreadsheet typed up for the meeting.' },
      { icon: 'list', title: 'Six presets, or your own', desc: 'Six scenarios, or move admissions, beds, admission rate and length of stay yourself.' },
      { icon: 'clock', title: 'Answers you can act on tonight', desc: 'Peak occupancy, hours to overflow, beds short, discharges needed and extra nurses.' },
      { icon: 'file', title: 'Assumptions on the page', desc: 'The assumptions and their citations sit under the chart, so the number can be argued with.' },
    ],
    ctaLine: 'Hours to overflow and nurses needed, with the assumptions under the chart.',
    more: [
      { title: 'The same answer twice', desc: 'The projection has no randomness, so the same scenario always gives the same numbers, and the nurse-to-patient ratio can be changed for each one.' },
    ],
  },
  {
    route: '/bridge',
    title: 'Bridge',
    badge: 'Written for the person in the bed',
    tagline: 'A patient signs in with the login the ward hands over at admission and sees their team, their observations as charted and their record, theirs to download as a standard file (FHIR).',
    cards: [
      { icon: 'users', title: 'The care team', desc: 'Their doctor by name, the ward’s nursing team, and how they are doing, in sentences a patient can read.' },
      { icon: 'pulse', title: 'Their observations, as charted', desc: 'Each observation with when it was taken and its recent trend. No verdicts: what it means is a question for their nurse.' },
      { icon: 'file', title: 'Their record, in their hands', desc: 'Medications and documents to read on screen, and their record to download as a standard file (FHIR).' },
      { icon: 'chat', title: 'Questions get a plain answer', desc: 'A model on the hospital’s computer answers in plain words and is told to send clinical questions to their nurse or doctor. Emergency or self-harm words skip the model and go straight to the care team.' },
    ],
    ctaLine: 'The patient sees their own care, in plain language.',
    more: [
      { title: 'Ends on the day they go home', desc: 'The login works while the patient is admitted, and until the end of the day they are discharged.' },
      { title: 'Drafts stay with the team', desc: 'A discharge summary still in draft, and an image read nobody has reviewed, are not shown to the patient.' },
      { title: 'Emergency words reach the team', desc: 'If a patient writes about an emergency or self-harm, the message is posted to their care team’s room, and the reply only says the team was told once it has been stored.' },
      { title: 'Follow-up requests', desc: 'A patient can ask for a follow-up time or cancel one of their own, and a request is labelled as not yet agreed until staff confirm it.' },
    ],
    shots: [
      { name: 'bridge-patient-portal', label: 'The portal', caption: 'What the patient sees: their team, their status, their vitals and their follow-up.' },
      { name: 'bridge-medications', label: 'Medications', caption: 'Their medications, with dose, route, frequency and status.' },
      { name: 'bridge-documents', label: 'Documents', caption: 'Their notes and reports, to read on screen.' },
    ],
  },
  {
    route: '/appointments',
    title: 'Appointments',
    badge: 'Follow-ups with the NEWS2 band beside the name',
    tagline: 'Follow-ups, medication reviews and post-discharge checks, in day columns. Every slot carries the patient’s NEWS2 band.',
    cards: [
      { icon: 'calendar', title: 'A week in columns', desc: 'Today, the week, the patients with high scores among them and the post-discharge reviews.' },
      { icon: 'alert', title: 'The band on the slot', desc: 'The band sits on the slot, so whoever books the follow-up sees the score beside the name.' },
      { icon: 'link', title: 'On the same record', desc: 'The appointment is a row on the record the ward uses.' },
      { icon: 'users', title: 'Visible to the patient', desc: 'The same appointment shows in Bridge, with its date, time and the reason as the care team wrote it.' },
    ],
    ctaLine: 'Within each day, a follow-up for a high score is listed above a routine wound check.',
  },
  {
    route: '/revenue-integrity',
    title: 'Revenue Integrity',
    badge: 'Codes the chart already supports',
    tagline: 'Pick a patient and press Analyse. Orb reads the notes on the chart and lists the codes they support and the gaps that block them, each with the sentence behind it.',
    cards: [
      { icon: 'search', title: 'It reads what is already written', desc: 'The analysis runs over the notes and documents on the chart, against a starter set of 22 ICD-10 codes today.' },
      { icon: 'file', title: 'The evidence sentence', desc: 'Every suggested code carries the sentence behind it and where it was found: a note, the admission diagnosis or the comorbidity list.' },
      { icon: 'alert', title: 'Gaps, named', desc: 'A condition treated and not documented is listed as a query for the clinician, never as a code.' },
      { icon: 'building', title: 'Rules, on the computer', desc: 'A rules engine reads the notes inside the hospital. No model guesses a code, and no chart goes to a coding vendor.' },
    ],
    ctaLine: 'Nothing is invented to fit a code.',
  },
]

export const modulePage = (route: string): ModulePageData => {
  const p = MODULE_PAGES.find(m => m.route === route)
  if (!p) throw new Error(`Unknown module page: ${route}`)
  return p
}
