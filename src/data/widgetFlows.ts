// ─── Workflow widgets: one animated walkthrough per module ───
//
// These are drawings of the product, not the product. Each flow is a short
// sequence of steps; a step is a caption and the state of a small screen built
// from the blocks below. The player (components/widget/Widget.tsx) animates
// between consecutive states, so a score that rises, a row that reorders or a
// banner that appears is a movement rather than a cut.
//
// Rules for the content: every caption is a claim the product can stand behind,
// and the figures are the seeded demo patients the captures were taken on. The
// widget labels itself as an animation, and the real screens sit under it.

export type Tone = 'critical' | 'warn' | 'ok' | 'info' | 'muted' | 'accent'

export interface RowItem {
  id: string
  /** A NEWS2 score, a time, a count: shown in the mono badge on the left. */
  score?: string
  tone?: Tone
  title: string
  sub?: string
  tag?: string
  tagTone?: Tone
  /** Drawn as the row the workflow is on. */
  active?: boolean
}

export type Block =
  | { id: string; k: 'rows'; label?: string; rows: RowItem[] }
  | { id: string; k: 'tiles'; tiles: { label: string; value: string; tone?: Tone }[] }
  | { id: string; k: 'banner'; tone: Tone; tag?: string; title: string; body?: string }
  | { id: string; k: 'chat'; msgs: { from: 'you' | 'orb'; text: string; meta?: string; badge?: string; typing?: boolean }[] }
  | { id: string; k: 'fields'; label?: string; fields: { label: string; value: string; tone?: Tone }[] }
  | { id: string; k: 'checks'; label?: string; note?: string; items: { text: string; state: 'done' | 'now' | 'todo' | 'blocked' }[] }
  | { id: string; k: 'meter'; label: string; value: string; pct: number; tone?: Tone; note?: string }
  | { id: string; k: 'lines'; label?: string; lines: { text: string; tone?: Tone; strong?: boolean }[] }
  | { id: string; k: 'chips'; chips: { text: string; tone?: Tone }[] }

export interface Scene {
  /** The screen's own title, as the product writes it. */
  head?: string
  sub?: string
  blocks: Block[]
}

export interface WidgetStep { caption: string; scene: Scene }

export interface WidgetFlow {
  id: string
  /** Tab label when a module has more than one workflow. */
  label: string
  /** The module screen this runs on, e.g. "Orb Vigil". */
  app: string
  /** Who is signed in. */
  who?: string
  steps: WidgetStep[]
}

// ─── The ward: four seeded patients, as the captures show them ───

const WARD = {
  suresh: { id: 'suresh', score: '14', tone: 'critical' as Tone, title: 'Suresh Reddy', sub: 'GM-104 · CAP with early sepsis' },
  rajesh9: { id: 'rajesh', score: '9', tone: 'warn' as Tone, title: 'Rajesh Iyer', sub: 'GM-102 · COPD exacerbation' },
  rajesh13: { id: 'rajesh', score: '13', tone: 'critical' as Tone, title: 'Rajesh Iyer', sub: 'GM-102 · COPD exacerbation' },
  ananya: { id: 'ananya', score: '8', tone: 'warn' as Tone, title: 'Ananya Kapoor', sub: 'GM-101 · Diabetic ketoacidosis' },
  priya: { id: 'priya', score: '5', tone: 'warn' as Tone, title: 'Priya Nair', sub: 'GM-103 · Dengue with thrombocytopenia' },
}

export const WIDGET_FLOWS: Record<string, WidgetFlow[]> = {
  '/vigil': [
    {
      id: 'ward', label: 'The ward', app: 'Orb Vigil', who: 'General Medicine',
      steps: [
        {
          caption: 'Orb opens on what needs you first, not on a search box.',
          scene: {
            head: 'Today', sub: 'General Medicine · 5 admitted',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Admitted', value: '5' },
                { label: 'Elevated', value: '2', tone: 'warn' },
                { label: 'Critical', value: '2', tone: 'critical' },
              ] },
              { id: 'rows', k: 'rows', label: 'Deteriorating', rows: [WARD.suresh, WARD.rajesh9, WARD.ananya, WARD.priya] },
            ],
          },
        },
        {
          caption: 'Every patient carries a NEWS2 score, computed from the Royal College of Physicians table on every set of observations.',
          scene: {
            head: 'Today', sub: 'General Medicine · 5 admitted',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Admitted', value: '5' },
                { label: 'Elevated', value: '2', tone: 'warn' },
                { label: 'Critical', value: '2', tone: 'critical' },
              ] },
              { id: 'rows', k: 'rows', label: 'Deteriorating · by NEWS2', rows: [
                { ...WARD.suresh, tag: 'RR 37 · SpO2 84%', tagTone: 'critical' },
                { ...WARD.rajesh9, tag: 'RR 33 · SpO2 85%', tagTone: 'warn' },
                { ...WARD.ananya, tag: 'RR 31 · SpO2 94%', tagTone: 'warn' },
                { ...WARD.priya, tag: 'SpO2 96% · SBP 97', tagTone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'New observations arrive for Rajesh. The score moves, and the board reorders itself around it.',
          scene: {
            head: 'Today', sub: 'General Medicine · 5 admitted',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Admitted', value: '5' },
                { label: 'Elevated', value: '1', tone: 'warn' },
                { label: 'Critical', value: '3', tone: 'critical' },
              ] },
              { id: 'rows', k: 'rows', label: 'Deteriorating · by NEWS2', rows: [
                { ...WARD.suresh, tag: 'RR 37 · SpO2 84%', tagTone: 'critical' },
                { ...WARD.rajesh13, tag: 'RR 32 · SpO2 80%', tagTone: 'critical', active: true },
                { ...WARD.ananya, tag: 'RR 31 · SpO2 94%', tagTone: 'warn' },
                { ...WARD.priya, tag: 'SpO2 96% · SBP 97', tagTone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'Open the chart. Every point of the score is listed against the observation that produced it, so a nurse can check it by hand.',
          scene: {
            head: 'Rajesh Iyer', sub: 'GM-102 · 67Y · COPD exacerbation',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'NEWS2 13', title: 'Critical', body: 'Continuous monitoring. Emergency assessment by a critical-care-competent team.' },
              { id: 'fields', k: 'fields', label: 'Observations', fields: [
                { label: 'HR', value: '112', tone: 'warn' },
                { label: 'BP', value: '74/38', tone: 'critical' },
                { label: 'SpO2', value: '80%', tone: 'critical' },
                { label: 'Temp', value: '39.6', tone: 'warn' },
                { label: 'RR', value: '32', tone: 'critical' },
              ] },
            ],
          },
        },
        {
          caption: 'Crossing the threshold starts the Sepsis Six clock. Six actions, a sixty minute target, each one going overdue on its own.',
          scene: {
            head: 'Rajesh Iyer', sub: 'GM-102 · 67Y · COPD exacerbation',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'NEWS2 13', title: 'Critical', body: 'Trigger: NEWS2 7 or more.' },
              { id: 'meter', k: 'meter', label: 'Sepsis Six', value: '02:38', pct: 4, tone: 'ok', note: '0 of 6 done · 60m target · on track' },
              { id: 'checks', k: 'checks', items: [
                { text: 'High-flow oxygen', state: 'now' },
                { text: 'Blood cultures', state: 'todo' },
                { text: 'IV antibiotics', state: 'todo' },
                { text: 'IV fluids', state: 'todo' },
                { text: 'Serum lactate', state: 'todo' },
                { text: 'Urine output', state: 'todo' },
              ] },
            ],
          },
        },
      ],
    },
    {
      id: 'nurse', label: 'The nurse’s shift', app: 'Orb · My Shift', who: 'Ward nurse',
      steps: [
        {
          caption: 'A nurse lands on the shift, not on a chart: what is due now, and how late it is.',
          scene: {
            head: 'My Shift', sub: 'Due now · 6 items',
            blocks: [
              { id: 'rows', k: 'rows', label: 'Due', rows: [
                { id: 'a', score: '12m', tone: 'critical', title: 'Ceftriaxone 1 g IV', sub: 'Suresh Reddy · GM-104', tag: 'Overdue', tagTone: 'critical' },
                { id: 'b', score: 'now', tone: 'warn', title: 'Observations', sub: 'Rajesh Iyer · GM-102' },
                { id: 'c', score: '20m', tone: 'muted', title: 'Insulin infusion check', sub: 'Ananya Kapoor · GM-101' },
              ] },
            ],
          },
        },
        {
          caption: 'Recording observations: big numeric targets, built for a tablet on a trolley.',
          scene: {
            head: 'Record observations', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'RR', value: '24' },
                { label: 'SpO2', value: '91' },
                { label: 'BP', value: '98/60' },
                { label: 'HR', value: '112' },
                { label: 'Temp', value: '38.4' },
              ] },
            ],
          },
        },
        {
          caption: 'NEWS2 computes as the values go in, before anything is saved.',
          scene: {
            head: 'Record observations', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'RR', value: '24', tone: 'warn' },
                { label: 'SpO2', value: '91', tone: 'critical' },
                { label: 'BP', value: '98/60', tone: 'warn' },
                { label: 'HR', value: '112', tone: 'warn' },
                { label: 'Temp', value: '38.4', tone: 'warn' },
              ] },
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'NEWS2 9', title: 'Elevated to critical', body: 'Urgent review by a clinician competent in acute illness. Escalate now.' },
            ],
          },
        },
        {
          caption: 'She sees the escalation she is about to trigger, in the words of the RCP table, before she presses save.',
          scene: {
            head: 'Record observations', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'RR', value: '24', tone: 'warn' },
                { label: 'SpO2', value: '91', tone: 'critical' },
                { label: 'BP', value: '98/60', tone: 'warn' },
                { label: 'HR', value: '112', tone: 'warn' },
                { label: 'Temp', value: '38.4', tone: 'warn' },
              ] },
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'NEWS2 9', title: 'Escalate now', body: 'Monitoring interval 60 minutes. The nurse in charge is informed on save.' },
              { id: 'chips', k: 'chips', chips: [{ text: 'Save observations', tone: 'accent' }, { text: 'Every point is checkable by hand', tone: 'muted' }] },
            ],
          },
        },
      ],
    },
  ],

  '/sage': [
    {
      id: 'ask', label: 'Ask Sage', app: 'Orb Sage', who: 'General Medicine',
      steps: [
        {
          caption: 'Sage runs on the appliance. No question, and no chart, leaves the building.',
          scene: {
            head: 'Sage', sub: 'Clinical AI · on this appliance',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: '27B careful', tone: 'ok' }, { text: '4B fast', tone: 'ok' }, { text: 'No egress', tone: 'muted' }] },
              { id: 'cards', k: 'rows', label: 'Start with', rows: [
                { id: 'q1', title: 'Patient summary', sub: 'Overview of the current unit census' },
                { id: 'q2', title: 'Lab insights', sub: 'Flag recent critical values' },
                { id: 'q3', title: 'Drug interactions', sub: 'Safety check across medications' },
              ] },
            ],
          },
        },
        {
          caption: 'Fast mode answers general questions with the small model. Patient, medication and dose questions always go to the careful one. That floor is not a toggle.',
          scene: {
            head: 'Sage', sub: 'Clinical AI · on this appliance',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: '4B fast · on', tone: 'accent' }, { text: 'Patient and dose questions still route to 27B', tone: 'muted' }] },
              { id: 'cards', k: 'rows', label: 'Start with', rows: [
                { id: 'q1', title: 'Patient summary', sub: 'Overview of the current unit census', tag: '27B', tagTone: 'muted' },
                { id: 'q2', title: 'Lab insights', sub: 'Flag recent critical values', tag: '27B', tagTone: 'muted' },
                { id: 'q3', title: 'Drug interactions', sub: 'Safety check across medications', tag: '27B', tagTone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'A question a registrar actually asks at two in the morning.',
          scene: {
            head: 'Sage', sub: 'Clinical AI · on this appliance',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: '4B fast · on', tone: 'accent' }] },
              { id: 'chat', k: 'chat', msgs: [
                { from: 'you', text: 'What are the classic ECG findings in hyperkalaemia?' },
                { from: 'orb', text: '', typing: true },
              ] },
            ],
          },
        },
        {
          caption: 'The answer arrives with its safety line before the first sentence, not buried after it.',
          scene: {
            head: 'Sage', sub: 'Clinical AI · on this appliance',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: '4B fast · on', tone: 'accent' }] },
              { id: 'chat', k: 'chat', msgs: [
                { from: 'you', text: 'What are the classic ECG findings in hyperkalaemia?' },
                { from: 'orb', badge: 'Confirm against your local protocol', text: 'Peaked T waves are the earliest change, followed by a flattened P wave, a widened QRS, and finally a sine-wave pattern.', meta: 'Answered on the appliance' },
              ] },
            ],
          },
        },
        {
          caption: 'Show details lists the guidance the model actually read. An answer you cannot check is not an answer.',
          scene: {
            head: 'Sage', sub: 'Clinical AI · on this appliance',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'orb', badge: 'Confirm against your local protocol', text: 'Peaked T waves are the earliest change, followed by a flattened P wave, a widened QRS, and finally a sine-wave pattern.' },
              ] },
              { id: 'lines', k: 'lines', label: 'Show details', lines: [
                { text: 'Retrieved from the hospital’s own guideline set', strong: true },
                { text: 'Passages listed with the answer, each one openable' },
                { text: 'Model, mode and timing recorded in the audit log' },
              ] },
            ],
          },
        },
      ],
    },
    {
      id: 'scope', label: 'Out of scope', app: 'Orb Sage', who: 'General Medicine',
      steps: [
        {
          caption: 'New chat. This login is General Medicine. Cardiology is not its ward.',
          scene: {
            head: 'Sage', sub: 'Signed in: General Medicine',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: 'General Medicine', tone: 'accent' }, { text: '5 patients in scope', tone: 'muted' }] },
              { id: 'chat', k: 'chat', msgs: [{ from: 'orb', text: 'New chat. I can see the charts your department is responsible for.' }] },
            ],
          },
        },
        {
          caption: 'Ask for a result belonging to a patient in a cardiology bed.',
          scene: {
            head: 'Sage', sub: 'Signed in: General Medicine',
            blocks: [{ id: 'chat', k: 'chat', msgs: [
              { from: 'you', text: 'What is the potassium result for the patient in cardiology bed C-201?' },
              { from: 'orb', text: '', typing: true },
            ] }],
          },
        },
        {
          caption: 'Nothing comes back, because the server never handed that chart to the model. Scope is enforced below Sage, not by asking it nicely.',
          scene: {
            head: 'Sage', sub: 'Signed in: General Medicine',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'you', text: 'What is the potassium result for the patient in cardiology bed C-201?' },
                { from: 'orb', text: 'That patient is outside your department, so I have not been given their chart.' },
              ] },
              { id: 'lines', k: 'lines', label: 'Underneath', lines: [
                { text: 'A direct API call for that chart returns 404', strong: true },
                { text: 'The refusal is written to the audit log like any other question' },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/scribe': [
    {
      id: 'note', label: 'A note, signed', app: 'Orb Scribe', who: 'General Medicine',
      steps: [
        {
          caption: 'Dictate or type the consultation. Speech is transcribed on the appliance, not by a cloud service.',
          scene: {
            head: 'Scribe', sub: 'New consultation',
            blocks: [
              { id: 'lines', k: 'lines', label: 'Transcript', lines: [
                { text: '67 year old man, known COPD, three days of increasing breathlessness and green sputum.' },
                { text: 'On examination: widespread wheeze, saturations 88 percent on air, temperature 38.4.' },
              ] },
              { id: 'chips', k: 'chips', chips: [{ text: 'Patient: Rajesh Iyer', tone: 'accent' }, { text: 'Transcribed locally', tone: 'muted' }] },
            ],
          },
        },
        {
          caption: 'The local model drafts a structured note: a SOAP note, a discharge summary or an I-PASS handover.',
          scene: {
            head: 'Structured note', sub: 'SOAP · draft',
            blocks: [
              { id: 'lines', k: 'lines', label: 'Draft', lines: [
                { text: 'S · Three days of increasing breathlessness, green sputum, known COPD.', strong: true },
                { text: 'O · Widespread wheeze. SpO2 88% on air. Temp 38.4.' },
                { text: 'A · Infective exacerbation of COPD.' },
                { text: 'P · Nebulisers, oral steroids, antibiotics, review in the morning.' },
              ] },
            ],
          },
        },
        {
          caption: 'A second pass compares the draft with the transcript and lists what the transcript does not support.',
          scene: {
            head: 'Structured note', sub: 'SOAP · verification',
            blocks: [
              { id: 'lines', k: 'lines', label: 'Draft', lines: [
                { text: 'A · Infective exacerbation of COPD.' },
                { text: 'P · Nebulisers, oral steroids, antibiotics, review in the morning.' },
              ] },
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'Verification', title: '1 unsupported claim, 1 omission', body: '“Antibiotics” has no dose or agent in the transcript. The recorded temperature is missing from the assessment.' },
            ],
          },
        },
        {
          caption: 'A note that was never verified against audio makes the clinician type SIGN. Accepting an unverified draft is recorded in their own name.',
          scene: {
            head: 'Sign and finalize', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'Unverified', title: 'This note was typed, not verified against audio', body: 'Type SIGN to accept it.' },
              { id: 'fields', k: 'fields', fields: [{ label: 'Confirm', value: 'SIGN' }] },
            ],
          },
        },
        {
          caption: 'Signing is the trigger. The medications the note names are extracted, screened and queued for a pharmacist. They are not orders yet.',
          scene: {
            head: 'Signed', sub: 'Dr Meera Sharma · General Medicine',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'ok', tag: 'Signed', title: 'Note filed on the chart', body: 'Signature, time and verification state stored with the note.' },
              { id: 'rows', k: 'rows', label: 'Sent to the pharmacist’s queue', rows: [
                { id: 'p1', title: 'Prednisolone 40 mg oral, once daily', sub: 'From the signed note', tag: 'AI extracted', tagTone: 'warn' },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/helix': [
    {
      id: 'interlock', label: 'The allergy interlock', app: 'Orb Helix', who: 'General Medicine',
      steps: [
        {
          caption: 'An order set is always chosen for a named patient. There is nothing honest to show until Orb knows whose chart this is.',
          scene: {
            head: 'Order sets', sub: 'Apply to: Rajesh Iyer · GM-102',
            blocks: [
              { id: 'rows', k: 'rows', label: 'Protocols v1', rows: [
                { id: 's6', title: 'Sepsis Six (1-hour bundle)', sub: '9 items · Surviving Sepsis Campaign 2021', active: true },
                { id: 'dka', title: 'DKA protocol', sub: '11 items' },
              ] },
            ],
          },
        },
        {
          caption: 'Every item is screened against this patient’s allergies before anything is applied.',
          scene: {
            head: 'Sepsis Six', sub: 'Rajesh Iyer · screening 9 items',
            blocks: [
              { id: 'checks', k: 'checks', note: 'and four more in the set', items: [
                { text: 'High-flow oxygen', state: 'done' },
                { text: 'Blood cultures', state: 'done' },
                { text: 'Ceftriaxone 2 g IV', state: 'now' },
                { text: 'IV fluids', state: 'todo' },
                { text: 'Serum lactate', state: 'todo' },
              ] },
            ],
          },
        },
        {
          caption: 'It stops at the one item that would harm him, with the reaction spelled out.',
          scene: {
            head: 'Sepsis Six', sub: 'Rajesh Iyer · 8 cleared, 1 stopped',
            blocks: [
              { id: 'checks', k: 'checks', note: 'and four more, all cleared', items: [
                { text: 'High-flow oxygen', state: 'done' },
                { text: 'Blood cultures', state: 'done' },
                { text: 'Ceftriaxone 2 g IV', state: 'blocked' },
                { text: 'IV fluids', state: 'done' },
                { text: 'Serum lactate', state: 'done' },
              ] },
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'Stopped', title: 'Ceftriaxone: documented anaphylaxis', body: 'Recorded at admission. Apply is disabled while this item is in the set.' },
            ],
          },
        },
        {
          caption: 'The bundle applies whole or not at all. A half-applied sepsis bundle is its own emergency.',
          scene: {
            head: 'Sepsis Six', sub: 'Rajesh Iyer · 8 cleared, 1 stopped',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'critical', tag: 'Stopped', title: 'Ceftriaxone: documented anaphylaxis' },
              { id: 'chips', k: 'chips', chips: [
                { text: 'Apply set · disabled', tone: 'muted' },
                { text: 'Substitute the antibiotic', tone: 'accent' },
              ] },
            ],
          },
        },
        {
          caption: 'Only a prescriber can override, and the override is recorded in their name. A nurse cannot clear it at the bedside.',
          scene: {
            head: 'Override', sub: 'Prescriber only',
            blocks: [
              { id: 'lines', k: 'lines', label: 'What is written down', lines: [
                { text: 'Who overrode the block, and when', strong: true },
                { text: 'The reaction that was on the chart at the time' },
                { text: 'The allergy also prints on the administration sheet at the bedside' },
              ] },
            ],
          },
        },
      ],
    },
    {
      id: 'verify', label: 'Pharmacist verification', app: 'Orb Helix', who: 'Pharmacist',
      steps: [
        {
          caption: 'Medications a model pulled out of a signed note land here first, marked as extracted.',
          scene: {
            head: 'Verification queue', sub: '3 waiting',
            blocks: [
              { id: 'rows', k: 'rows', label: 'Waiting', rows: [
                { id: 'p1', title: 'Prednisolone 40 mg oral', sub: 'Rajesh Iyer · from a signed note', tag: 'AI extracted', tagTone: 'warn', active: true },
                { id: 'p2', title: 'Salbutamol nebuliser', sub: 'Rajesh Iyer · from a signed note', tag: 'AI extracted', tagTone: 'warn' },
                { id: 'p3', title: 'Amoxicillin 500 mg', sub: 'Ananya Kapoor · typed by a prescriber', tag: 'Prescribed', tagTone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'Dose, route and frequency are editable before anything becomes an order.',
          scene: {
            head: 'Prednisolone 40 mg', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'Dose', value: '40 mg' },
                { label: 'Route', value: 'Oral' },
                { label: 'Frequency', value: 'Once daily' },
                { label: 'Days', value: '5' },
              ] },
              { id: 'banner', k: 'banner', tone: 'info', tag: 'Source', title: 'Extracted from a note signed by Dr Meera Sharma', body: 'The sentence it came from is one click away.' },
            ],
          },
        },
        {
          caption: 'A drug outside the interaction knowledge base says so, instead of showing a green tick it has not earned.',
          scene: {
            head: 'Interaction screen', sub: 'Rajesh Iyer · 6 active medications',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'i1', title: 'Prednisolone', sub: 'Screened against 6 active medications', tag: 'No interaction', tagTone: 'ok' },
                { id: 'i2', title: 'Herbal preparation, unnamed', sub: 'Outside the knowledge base', tag: 'Not screened', tagTone: 'warn' },
              ] },
            ],
          },
        },
        {
          caption: 'A named pharmacist verifies it. That, and nothing earlier, is what makes it an order.',
          scene: {
            head: 'Verified', sub: 'Prednisolone 40 mg · Rajesh Iyer',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'ok', tag: 'Verified', title: 'Now an active order', body: 'Verified by the pharmacist on duty, recorded by name and time.' },
            ],
          },
        },
      ],
    },
  ],

  '/relay': [
    {
      id: 'room', label: 'The wrong-room warning', app: 'Orb Relay', who: 'General Medicine',
      steps: [
        {
          caption: 'One room per patient, with the team already in it.',
          scene: {
            head: 'Case rooms', sub: 'General Medicine',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'r1', score: '14', tone: 'critical', title: 'Suresh Reddy', sub: 'GM-104 · 4 people', active: true },
                { id: 'r2', score: '9', tone: 'warn', title: 'Rajesh Iyer', sub: 'GM-102 · 3 people' },
                { id: 'r3', score: '5', tone: 'warn', title: 'Priya Nair', sub: 'GM-103 · 3 people' },
              ] },
            ],
          },
        },
        {
          caption: 'Vigil posts its alerts into the room, with the vitals that caused them, so the numbers and the conversation sit together.',
          scene: {
            head: 'Suresh Reddy', sub: 'GM-104 · case room',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'orb', badge: 'Vigil alert', text: 'NEWS2 14, critical. RR 37, SpO2 84% on air, SBP 85.', meta: 'Posted automatically' },
                { from: 'you', text: 'Starting high-flow oxygen now, cultures going off.' },
              ] },
            ],
          },
        },
        {
          caption: 'Now a message about Rajesh gets typed into Suresh’s room, at three in the morning.',
          scene: {
            head: 'Suresh Reddy', sub: 'GM-104 · case room',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'orb', badge: 'Vigil alert', text: 'NEWS2 14, critical. RR 37, SpO2 84% on air, SBP 85.' },
                { from: 'you', text: 'Rajesh needs his prednisolone brought forward to tonight.' },
              ] },
            ],
          },
        },
        {
          caption: 'Orb delivers it, then says so. A nurse mid-emergency does not need a modal in the way, and the message is not silently lost either.',
          scene: {
            head: 'Suresh Reddy', sub: 'GM-104 · case room',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'you', text: 'Rajesh needs his prednisolone brought forward to tonight.' },
              ] },
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'Check the room', title: 'This looks like it belongs to Rajesh Iyer', body: 'Move it to his room, or keep it here.' },
            ],
          },
        },
      ],
    },
  ],

  '/lens': [
    {
      id: 'lens', label: 'A first read', app: 'Orb Lens', who: 'General Medicine',
      steps: [
        {
          caption: 'Drag in a chest film, an ECG strip or a photo of a wound, from a phone or a workstation. There is no integration to wait for.',
          scene: {
            head: 'Lens', sub: 'New image',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'img', title: 'chest-ap-rajesh.jpg', sub: 'Uploaded from the ward tablet', tag: 'On the appliance', tagTone: 'ok', active: true },
              ] },
            ],
          },
        },
        {
          caption: 'The model that reads it runs on the appliance. The image does not leave the building, and neither does the text about it.',
          scene: {
            head: 'Lens', sub: 'Reading · on this appliance',
            blocks: [
              { id: 'rows', k: 'rows', rows: [{ id: 'img', title: 'chest-ap-rajesh.jpg', sub: 'Reading', tag: 'No egress', tagTone: 'muted', active: true }] },
              { id: 'chat', k: 'chat', msgs: [{ from: 'orb', text: '', typing: true }] },
            ],
          },
        },
        {
          caption: 'The read comes back marked as a model draft, in the clinician’s own report, for them to correct, keep or throw away.',
          scene: {
            head: 'First read', sub: 'Draft · not a finding',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [
                { from: 'orb', badge: 'Model draft', text: 'Patchy consolidation in the right lower zone. No pneumothorax. Heart size within normal limits for an AP film.' },
              ] },
              { id: 'chips', k: 'chips', chips: [{ text: 'Keep', tone: 'accent' }, { text: 'Edit', tone: 'muted' }, { text: 'Discard', tone: 'muted' }] },
            ],
          },
        },
        {
          caption: 'Nothing is stored as a finding until a person signs it. Lens is not a certified diagnostic device, and the product says so on the screen.',
          scene: {
            head: 'First read', sub: 'Draft · not a finding',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'On screen', title: 'Not a certified diagnostic device', body: 'It exists to save a clinician the blank page, not to replace the radiologist.' },
            ],
          },
        },
      ],
    },
  ],

  '/surgical-suite': [
    {
      id: 'suite', label: 'Theatre', app: 'Orb Surgical Suite', who: 'Surgeon',
      steps: [
        {
          caption: 'The week’s list: every procedure with its theatre, surgeon, duration and readiness.',
          scene: {
            head: 'Theatre list', sub: 'Monday · Theatre 2',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 't1', score: '09:00', tone: 'muted', title: 'Laparoscopic cholecystectomy', sub: 'Theatre 2 · 90 min', tag: 'Ready', tagTone: 'ok', active: true },
                { id: 't2', score: '11:00', tone: 'muted', title: 'Hernia repair', sub: 'Theatre 2 · 60 min', tag: 'Consent pending', tagTone: 'warn' },
              ] },
            ],
          },
        },
        {
          caption: 'Each patient carries their risk band onto the list, so the surgeon sees the number the ward sees.',
          scene: {
            head: 'Theatre list', sub: 'Monday · Theatre 2',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 't1', score: '09:00', tone: 'muted', title: 'Laparoscopic cholecystectomy', sub: 'Priya Nair · GM-103', tag: 'NEWS2 5 · elevated', tagTone: 'warn', active: true },
                { id: 't2', score: '11:00', tone: 'muted', title: 'Hernia repair', sub: 'Stable · NEWS2 1', tag: 'Ready', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'The WHO surgical safety checklist is recorded as it happens, per case.',
          scene: {
            head: 'WHO checklist', sub: 'Priya Nair · sign-in',
            blocks: [
              { id: 'checks', k: 'checks', label: 'Sign-in', items: [
                { text: 'Patient identity and site confirmed', state: 'done' },
                { text: 'Allergies checked', state: 'done' },
                { text: 'Anaesthetic machine check', state: 'now' },
                { text: 'Difficult airway risk', state: 'todo' },
              ] },
            ],
          },
        },
        {
          caption: 'Sign-in, time-out and sign-out, in the name of the person who did them, on the same record as the ward. The allergy recorded at admission is the one the anaesthetist sees.',
          scene: {
            head: 'WHO checklist', sub: 'Priya Nair · complete',
            blocks: [
              { id: 'checks', k: 'checks', items: [
                { text: 'Sign-in · recorded', state: 'done' },
                { text: 'Time-out · recorded', state: 'done' },
                { text: 'Sign-out · recorded', state: 'done' },
              ] },
              { id: 'banner', k: 'banner', tone: 'ok', tag: 'One record', title: 'Theatre, ward and pharmacy read the same database' },
            ],
          },
        },
      ],
    },
  ],

  '/pulse': [
    {
      id: 'pulse', label: 'Outside signals', app: 'Orb Pulse', who: 'General Medicine',
      steps: [
        {
          caption: 'Four public feeds, each named on the screen with the time it was read.',
          scene: {
            head: 'Pulse', sub: 'Outside signals',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'w', title: 'Weather and air quality', sub: 'Open-Meteo', tag: 'Read 09:05', tagTone: 'muted' },
                { id: 'f', title: 'Flu activity', sub: 'CDC FluView', tag: 'Read 08:00', tagTone: 'muted' },
                { id: 'r', title: 'Drug recalls', sub: 'openFDA', tag: 'Read 08:00', tagTone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'This is the only place Orb calls out. The request carries a map coordinate and no patient, every call is logged, and the firewall can block it with no loss of clinical function.',
          scene: {
            head: 'Pulse', sub: 'The only outbound call',
            blocks: [
              { id: 'lines', k: 'lines', label: 'What leaves the building', lines: [
                { text: 'A latitude and a longitude', strong: true },
                { text: 'No patient, no chart, no identifier' },
                { text: 'Blockable at the firewall. Everything clinical keeps working.' },
              ] },
            ],
          },
        },
        {
          caption: 'A heat wave or a bad air day becomes a note on the ward’s day. It does not change anybody’s score.',
          scene: {
            head: 'Today’s signals', sub: 'Read against the ward',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'Air quality', title: 'AQI 168 · unhealthy', body: 'Noted for respiratory admissions. No score is changed by this.' },
              { id: 'chips', k: 'chips', chips: [{ text: 'Flu activity rising', tone: 'warn' }, { text: 'Heat advisory', tone: 'warn' }] },
            ],
          },
        },
        {
          caption: 'A recall arrives with its class and reason, so the pharmacy can check the formulary the same morning.',
          scene: {
            head: 'Recalls', sub: 'openFDA',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'rc', title: 'Class II recall', sub: 'Reason and affected lots listed in full', tag: 'Check formulary', tagTone: 'warn', active: true },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/forecast': [
    {
      id: 'forecast', label: 'The week ahead', app: 'Orb Forecast', who: 'General Medicine',
      steps: [
        {
          caption: 'Census against capacity for the next seven days.',
          scene: {
            head: 'Forecast', sub: 'Seven-day census',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Census now', value: '48' },
                { label: 'Free in 48h', value: '6', tone: 'warn' },
                { label: 'Peak day', value: 'Thu' },
              ] },
              { id: 'meter', k: 'meter', label: 'Projected occupancy at peak', value: '94%', pct: 94, tone: 'warn' },
            ],
          },
        },
        {
          caption: 'The model behind that projection has not been trained on your data yet.',
          scene: {
            head: 'Forecast', sub: 'Seven-day census',
            blocks: [
              { id: 'meter', k: 'meter', label: 'Projected occupancy at peak', value: '94%', pct: 94, tone: 'warn' },
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'AI untrained', title: 'model_trained = false', body: 'The badge sits on the page header, and every figure the model produced carries it.' },
            ],
          },
        },
        {
          caption: 'So the page says so, in the header, until the numbers earn the badge coming off.',
          scene: {
            head: 'Forecast', sub: 'AI untrained',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'AI untrained', title: 'Registered in Model Governance', body: 'Listed with its version and validation state, next to the deterministic NEWS2 engine that drives escalation.' },
            ],
          },
        },
        {
          caption: 'The discharge board and the bed arithmetic are computed from the record, not from the model. Those are live today.',
          scene: {
            head: 'Discharge board', sub: 'Computed from the record',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'd1', title: 'Likely ready today', sub: '4 patients', tag: 'From the record', tagTone: 'ok' },
                { id: 'd2', title: 'Blocked', sub: '2 waiting on a pharmacy discharge, 1 on transport', tag: 'From the record', tagTone: 'ok' },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/command-center': [
    {
      id: 'command', label: 'The whole house', app: 'Orb Command Center', who: 'General Medicine',
      steps: [
        {
          caption: 'Four numbers the house runs on, each printed with its denominator.',
          scene: {
            head: 'Command Center', sub: 'Live',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Occupancy', value: '48 / 60' },
                { label: 'Critical', value: '3', tone: 'critical' },
                { label: 'Sepsis bundles on track', value: '5 / 6', tone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'The acuity map: every ward as a tile, so pressure is visible before it becomes a phone call.',
          scene: {
            head: 'Acuity map', sub: 'By ward',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'gm', title: 'General Medicine', sub: '2 critical · 1 elevated · 2 stable', tag: 'Under pressure', tagTone: 'critical', active: true },
                { id: 'su', title: 'Surgical', sub: '0 critical · 2 elevated · 8 stable', tag: 'Steady', tagTone: 'ok' },
                { id: 'ic', title: 'Intensive care', sub: '1 critical · 0 elevated · 3 stable', tag: 'Steady', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'Active deteriorations by name, in the order the ward already uses.',
          scene: {
            head: 'Deteriorating now', sub: 'By NEWS2',
            blocks: [
              { id: 'rows', k: 'rows', rows: [WARD.suresh, WARD.rajesh13, WARD.ananya] },
            ],
          },
        },
        {
          caption: 'Downtime readiness is a number, not a promise: how many printable snapshots are current if the screens go dark.',
          scene: {
            head: 'Downtime readiness', sub: 'Printable snapshots',
            blocks: [
              { id: 'meter', k: 'meter', label: 'Snapshots current', value: '46 / 48', pct: 96, tone: 'ok', note: 'Capture the rest now' },
            ],
          },
        },
      ],
    },
  ],

  '/surge-simulator': [
    {
      id: 'sim', label: 'What if', app: 'Orb Surge Simulator', who: 'General Medicine',
      steps: [
        {
          caption: 'The baseline is today’s census, bed count and admission rate, read from the record. Not a spreadsheet typed up for the meeting.',
          scene: {
            head: 'Surge Simulator', sub: 'Baseline from the record',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Census', value: '48' },
                { label: 'Beds', value: '60' },
                { label: 'Admissions / day', value: '11' },
              ] },
            ],
          },
        },
        {
          caption: 'Pick a scenario, or move the sliders: admissions, beds, admission rate, length of stay.',
          scene: {
            head: 'Surge Simulator', sub: 'Scenario',
            blocks: [
              { id: 'chips', k: 'chips', chips: [
                { text: '20 admissions tonight', tone: 'accent' },
                { text: 'Close 8 beds', tone: 'muted' },
                { text: 'Flu at 1.5x', tone: 'muted' },
                { text: 'Mass casualty, 30', tone: 'muted' },
              ] },
            ],
          },
        },
        {
          caption: 'The answer is the four things you would actually have to decide tonight.',
          scene: {
            head: '20 admissions tonight', sub: 'Horizon: 24 hours',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Peak occupancy', value: '113%', tone: 'critical' },
                { label: 'Hours to overflow', value: '7', tone: 'critical' },
                { label: 'Beds short', value: '8', tone: 'warn' },
              ] },
              { id: 'rows', k: 'rows', rows: [
                { id: 'n', score: '4', tone: 'warn', title: 'Extra nurses needed', sub: 'At the projected peak' },
                { id: 'dc', score: '9', tone: 'warn', title: 'Discharges needed to avoid overflow', sub: 'Before 22:00' },
              ] },
            ],
          },
        },
        {
          caption: 'The assumptions sit under the answer with their citations, so the number can be argued with instead of believed.',
          scene: {
            head: 'Assumptions', sub: 'Under every figure',
            blocks: [
              { id: 'lines', k: 'lines', lines: [
                { text: 'Length of stay distribution, and where it comes from', strong: true },
                { text: 'Admission arrival pattern by hour' },
                { text: 'Nurse-to-patient ratio used for the staffing figure' },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/bridge': [
    {
      id: 'bridge', label: 'The patient’s view', app: 'Orb Bridge', who: 'Patient',
      steps: [
        {
          caption: 'A patient signs in with the code issued at admission. No app store, no account to create.',
          scene: {
            head: 'Bridge', sub: 'Sign in',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'Registration', value: 'P001' },
                { label: 'Date of birth', value: '••/••/••••' },
              ] },
              { id: 'lines', k: 'lines', label: 'What the patient gets', lines: [
                { text: 'A code on the admission slip, and a browser', strong: true },
                { text: 'No app to install, and no account to create' },
                { text: 'The same record the ward is looking at' },
              ] },
            ],
          },
        },
        {
          caption: 'Their care team, their diagnosis and what happens next, written for them and not for a coder.',
          scene: {
            head: 'Your care', sub: 'General Medicine',
            blocks: [
              { id: 'rows', k: 'rows', label: 'Looking after you', rows: [
                { id: 'dr', title: 'Dr Meera Sharma', sub: 'Consultant, General Medicine' },
                { id: 'ns', title: 'Ward nurse', sub: 'On this shift' },
              ] },
              { id: 'banner', k: 'banner', tone: 'info', tag: 'What happens next', title: 'A chest X-ray this morning, and a review on the ward round' },
            ],
          },
        },
        {
          caption: 'Vitals in plain words, with a trend and a sentence about what the team is watching.',
          scene: {
            head: 'Your observations', sub: 'Updated this morning',
            blocks: [
              { id: 'fields', k: 'fields', fields: [
                { label: 'Oxygen', value: '91%', tone: 'warn' },
                { label: 'Breathing', value: '24', tone: 'warn' },
                { label: 'Temperature', value: '38.4', tone: 'warn' },
              ] },
              { id: 'banner', k: 'banner', tone: 'info', tag: 'In plain words', title: 'Your oxygen is a little below the normal range', body: 'The team is watching it, and you are on oxygen to help.' },
            ],
          },
        },
        {
          caption: 'Medications, results and documents to read, and the whole record to download as FHIR. It is their record.',
          scene: {
            head: 'Your record', sub: 'Yours to take',
            blocks: [
              { id: 'chips', k: 'chips', chips: [
                { text: 'Medications', tone: 'muted' },
                { text: 'Results', tone: 'muted' },
                { text: 'Documents', tone: 'muted' },
                { text: 'Download as FHIR', tone: 'accent' },
              ] },
              { id: 'lines', k: 'lines', label: 'Asking a question', lines: [
                { text: 'A plain answer that points you to your nurse or doctor', strong: true },
                { text: 'It does not give medical advice, and the text says so' },
              ] },
            ],
          },
        },
      ],
    },
  ],

  '/appointments': [
    {
      id: 'appointments', label: 'The week', app: 'Orb Appointments', who: 'General Medicine',
      steps: [
        {
          caption: 'Follow-ups, medication reviews and post-discharge checks, in day columns.',
          scene: {
            head: 'This week', sub: '18 appointments',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Today', value: '5' },
                { label: 'This week', value: '18' },
                { label: 'Post-discharge', value: '4' },
              ] },
            ],
          },
        },
        {
          caption: 'Every slot carries the patient’s risk band.',
          scene: {
            head: 'Tuesday', sub: '5 appointments',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'a1', score: '09:30', tone: 'muted', title: 'Rajesh Iyer', sub: 'Post-discharge review', tag: 'Critical', tagTone: 'critical', active: true },
                { id: 'a2', score: '10:00', tone: 'muted', title: 'Priya Nair', sub: 'Medication review', tag: 'Elevated', tagTone: 'warn' },
                { id: 'a3', score: '10:30', tone: 'muted', title: 'Wound check', sub: 'Routine follow-up', tag: 'Stable', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'A follow-up for a critical patient is not the same task as a routine wound check, and the list stops pretending it is.',
          scene: {
            head: 'Tuesday', sub: 'Sorted by risk',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'a1', score: '09:30', tone: 'critical', title: 'Rajesh Iyer', sub: 'Post-discharge review · seen within 7 days', tag: 'Critical', tagTone: 'critical', active: true },
                { id: 'a2', score: '10:00', tone: 'warn', title: 'Priya Nair', sub: 'Medication review', tag: 'Elevated', tagTone: 'warn' },
                { id: 'a3', score: '10:30', tone: 'muted', title: 'Wound check', sub: 'Routine follow-up', tag: 'Stable', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'Booked from the chart itself, and the same appointment shows in the patient’s own view. There is no second system to keep in step.',
          scene: {
            head: 'Booked', sub: 'From the discharge summary',
            blocks: [
              { id: 'banner', k: 'banner', tone: 'ok', tag: 'One record', title: 'Created by the discharge summary, visible in Bridge', body: 'With the date and the reason, in the patient’s words.' },
            ],
          },
        },
      ],
    },
  ],

  '/revenue-integrity': [
    {
      id: 'revenue', label: 'Coding', app: 'Orb Revenue Integrity', who: 'General Medicine',
      steps: [
        {
          caption: 'Pick a patient and press Analyze. Nothing runs until you ask it to.',
          scene: {
            head: 'Revenue Integrity', sub: 'Rajesh Iyer · GM-102',
            blocks: [
              { id: 'chips', k: 'chips', chips: [{ text: 'Analyze this chart', tone: 'accent' }, { text: '4 signed notes on file', tone: 'muted' }] },
            ],
          },
        },
        {
          caption: 'It reads the notes already on the chart. The model runs inside the hospital; no chart is sent to a coding vendor.',
          scene: {
            head: 'Reading the chart', sub: 'On this appliance',
            blocks: [
              { id: 'chat', k: 'chat', msgs: [{ from: 'orb', text: '', typing: true }] },
              { id: 'lines', k: 'lines', lines: [{ text: '4 signed notes, 2 discharge summaries, results on file' }] },
            ],
          },
        },
        {
          caption: 'Every code it suggests carries the sentence that supports it, so a coder can accept or reject it in seconds.',
          scene: {
            head: 'Supported codes', sub: '3 found',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'c1', title: 'Infective exacerbation of COPD', sub: '“Three days of increasing breathlessness, green sputum, known COPD.”', tag: 'Supported', tagTone: 'ok', active: true },
                { id: 'c2', title: 'Acute respiratory failure', sub: '“SpO2 88% on air.”', tag: 'Supported', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'Where a condition is treated but not documented well enough to code, it is listed as a gap for the clinician. Nothing is invented to fit a code.',
          scene: {
            head: 'Documentation gaps', sub: 'Queries, not codes',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'g1', title: 'Sepsis treated, not documented as sepsis', sub: 'Antibiotics and fluids given. No diagnosis recorded in the notes.', tag: 'Query', tagTone: 'warn', active: true },
              ] },
              { id: 'banner', k: 'banner', tone: 'muted', tag: 'The rule', title: 'A claim without a sentence behind it is not made' },
            ],
          },
        },
      ],
    },
  ],

  '/security': [
    {
      id: 'trust', label: 'Show your work', app: 'Orb Admin', who: 'Administrator',
      steps: [
        {
          caption: 'The Trust Center is aggregated from the running system, not written into a PDF once a year.',
          scene: {
            head: 'Trust Center', sub: 'Compliance posture',
            blocks: [
              { id: 'tiles', k: 'tiles', tiles: [
                { label: 'Encryption at rest', value: 'On', tone: 'ok' },
                { label: 'Backups verified', value: 'Amber', tone: 'warn' },
                { label: 'Audit chain', value: 'Intact', tone: 'ok' },
              ] },
              { id: 'banner', k: 'banner', tone: 'warn', tag: 'The point', title: 'Amber is amber', body: 'An all-green compliance screen should be trusted less, not more.' },
            ],
          },
        },
        {
          caption: 'The Flight Recorder is a SHA-256 hash chain over every audit row.',
          scene: {
            head: 'Flight Recorder', sub: 'Audit log',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'l1', score: '12:55', tone: 'muted', title: 'Sage asked about hyperkalaemia', sub: 'DOC001 · answered on 4B', tag: 'Linked', tagTone: 'ok' },
                { id: 'l2', score: '12:57', tone: 'muted', title: 'Sage refused a cardiology chart', sub: 'DOC001 · out of scope', tag: 'Linked', tagTone: 'ok' },
                { id: 'l3', score: '12:58', tone: 'muted', title: 'Allergy block overridden', sub: 'Prescriber, by name', tag: 'Linked', tagTone: 'ok' },
              ] },
            ],
          },
        },
        {
          caption: 'Alter or delete a single row and the chain breaks, visibly. Every question Sage was asked is in here, and every refusal.',
          scene: {
            head: 'Flight Recorder', sub: 'Verification',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'l1', score: '12:55', tone: 'muted', title: 'Sage asked about hyperkalaemia', sub: 'DOC001', tag: 'Linked', tagTone: 'ok' },
                { id: 'l2', score: '12:57', tone: 'critical', title: 'Row altered', sub: 'Hash does not match the previous row', tag: 'Broken', tagTone: 'critical', active: true },
                { id: 'l3', score: '12:58', tone: 'muted', title: 'Allergy block overridden', sub: 'Prescriber, by name', tag: 'Orphaned', tagTone: 'warn' },
              ] },
            ],
          },
        },
        {
          caption: 'Model Governance lists each model, its version and whether it has been validated. The forecast model says untrained, on the day you look.',
          scene: {
            head: 'Model Governance', sub: 'Registered models',
            blocks: [
              { id: 'rows', k: 'rows', rows: [
                { id: 'm1', title: 'NEWS2 engine', sub: 'Deterministic · RCP 2017 table', tag: 'Validated', tagTone: 'ok' },
                { id: 'm2', title: 'Clinical model, 27B', sub: 'Runs on the appliance', tag: 'In use', tagTone: 'muted' },
                { id: 'm3', title: 'Forecast', sub: 'Not trained on real data', tag: 'Untrained', tagTone: 'warn', active: true },
              ] },
            ],
          },
        },
      ],
    },
  ],
}

export const widgetFlows = (route: string): WidgetFlow[] | undefined => WIDGET_FLOWS[route]

// ─── The story: one patient, three modules, in the order it happens ───
// Rajesh Iyer deteriorates on the ward (Vigil), the team talks about it and the
// order is written where the talk is (Relay), and the order is verified and
// carried to the bedside (Helix). The hero plays these three in sequence.

export const STORY_ACTS: { id: string; name: string; hint: string }[] = [
  { id: 'story-vigil', name: 'Vigil', hint: 'The ward sees it first' },
  { id: 'story-relay', name: 'Relay', hint: 'The team decides, in one thread' },
  { id: 'story-helix', name: 'Helix', hint: 'The order reaches the bedside' },
]

export const STORY_FLOWS: WidgetFlow[] = [
  {
    id: 'story-vigil', label: 'Vigil', app: 'Orb Vigil', who: 'General Medicine',
    steps: [
      {
        caption: 'The ward, ordered by NEWS2. Rajesh Iyer is second, and comfortable enough to wait.',
        scene: {
          head: 'Today', sub: 'General Medicine · 5 admitted',
          blocks: [
            { id: 'tiles', k: 'tiles', tiles: [
              { label: 'Admitted', value: '5' },
              { label: 'Elevated', value: '2', tone: 'warn' },
              { label: 'Critical', value: '2', tone: 'critical' },
            ] },
            { id: 'rows', k: 'rows', label: 'Deteriorating · by NEWS2', rows: [
              { ...WARD.suresh, tag: 'RR 37 · SpO2 84%', tagTone: 'critical' },
              { ...WARD.rajesh9, tag: 'RR 33 · SpO2 85%', tagTone: 'warn' },
              { ...WARD.ananya, tag: 'RR 31 · SpO2 94%', tagTone: 'warn' },
            ] },
          ],
        },
      },
      {
        caption: 'Observations come in from his bay. The score moves, and the board reorders itself around him.',
        scene: {
          head: 'Today', sub: 'General Medicine · 5 admitted',
          blocks: [
            { id: 'tiles', k: 'tiles', tiles: [
              { label: 'Admitted', value: '5' },
              { label: 'Elevated', value: '1', tone: 'warn' },
              { label: 'Critical', value: '3', tone: 'critical' },
            ] },
            { id: 'rows', k: 'rows', label: 'Deteriorating · by NEWS2', rows: [
              { ...WARD.rajesh13, tag: 'RR 32 · SpO2 80%', tagTone: 'critical', active: true },
              { ...WARD.suresh, tag: 'RR 37 · SpO2 84%', tagTone: 'critical' },
              { ...WARD.ananya, tag: 'RR 31 · SpO2 94%', tagTone: 'warn' },
            ] },
          ],
        },
      },
      {
        caption: 'Open his chart. The vitals that moved the score, and the escalation the table asks for.',
        scene: {
          head: 'Rajesh Iyer', sub: 'GM-102 · 67Y · COPD exacerbation',
          blocks: [
            { id: 'banner', k: 'banner', tone: 'critical', tag: 'NEWS2 13', title: 'Critical', body: 'Continuous monitoring. Emergency assessment by a critical-care-competent team.' },
            { id: 'fields', k: 'fields', label: 'Observations · 12:55', fields: [
              { label: 'HR', value: '112', tone: 'warn' },
              { label: 'BP', value: '74/38', tone: 'critical' },
              { label: 'SpO2', value: '80%', tone: 'critical' },
              { label: 'Temp', value: '39.6', tone: 'warn' },
              { label: 'RR', value: '32', tone: 'critical' },
            ] },
          ],
        },
      },
      {
        caption: 'Every point of the score is listed against the observation that produced it. A nurse can check it by hand.',
        scene: {
          head: 'Why this score', sub: 'NEWS2 13 · RCP 2017 table',
          blocks: [
            { id: 'lines', k: 'lines', label: 'Points', lines: [
              { text: '+3  Severe tachypnea (RR 32)', strong: true },
              { text: '+3  Severe hypoxia (SpO2 80%)', strong: true },
              { text: '+3  Hypotension (SBP 74)', strong: true },
              { text: '+2  On supplemental oxygen' },
              { text: '+2  Tachycardia (HR 112)' },
            ] },
          ],
        },
      },
      {
        caption: 'Under the score, the notes on his chart, and an assessment marked as written by a model. The score itself never is.',
        scene: {
          head: 'Rajesh Iyer', sub: 'Notes and assessment',
          blocks: [
            { id: 'note', k: 'lines', label: 'Last note · ward round 08:00', lines: [
              { text: 'Infective exacerbation of COPD. Nebulisers and oxygen started.', strong: true },
              { text: 'Steroids to be reviewed with the registrar this morning.' },
            ] },
            { id: 'banner', k: 'banner', tone: 'warn', tag: 'Sage · model draft', title: 'For review, not for filing', body: 'Deterioration consistent with the documented exacerbation. Consider senior review and steroid cover.' },
          ],
        },
      },
    ],
  },

  {
    id: 'story-relay', label: 'Relay', app: 'Orb Relay', who: 'General Medicine',
    steps: [
      {
        caption: 'Relay is the hospital’s own messaging. Every department has its rooms, and every admitted patient has one.',
        scene: {
          head: 'Rooms', sub: 'Your departments',
          blocks: [
            { id: 'rows', k: 'rows', rows: [
              { id: 'gm', title: 'General Medicine', sub: '5 case rooms · 12 people', tag: '3 new', tagTone: 'accent', active: true },
              { id: 'icu', title: 'Intensive Care', sub: '3 case rooms · 9 people' },
              { id: 'sur', title: 'Surgical', sub: '8 case rooms · 14 people' },
              { id: 'pha', title: 'Pharmacy', sub: 'Department room · 4 people' },
            ] },
            { id: 'note', k: 'lines', lines: [
              { text: 'An alert about a patient is posted into that patient’s room, never into a general channel.', strong: true },
            ] },
          ],
        },
      },
      {
        caption: 'His case room. The team is already in it, and Vigil has posted the alert with the vitals that caused it.',
        scene: {
          head: 'Rajesh Iyer', sub: 'GM-102 · case room · 4 people',
          blocks: [
            { id: 'chat', k: 'chat', msgs: [
              { from: 'orb', badge: 'Vigil alert', text: 'NEWS2 13, critical. RR 32, SpO2 80% on air, SBP 74.', meta: 'Posted automatically · 12:55' },
              { from: 'orb', text: 'Standing guidance: ensure continuous monitoring and prepare for possible intervention.', meta: 'A fixed line on every alert, not an assessment of this patient' },
            ] },
            { id: 'who', k: 'chips', chips: [
              { text: 'Dr Meera Sharma', tone: 'muted' },
              { text: 'Ward nurse', tone: 'muted' },
              { text: 'Registrar', tone: 'muted' },
              { text: 'Pharmacist', tone: 'muted' },
            ] },
          ],
        },
      },
      {
        caption: 'The nurse posts what she has just done, in the room where the alert already is.',
        scene: {
          head: 'Rajesh Iyer', sub: 'GM-102 · case room · 4 people',
          blocks: [
            { id: 'chat', k: 'chat', msgs: [
              { from: 'orb', badge: 'Vigil alert', text: 'NEWS2 13, critical. RR 32, SpO2 80% on air, SBP 74.' },
              { from: 'you', text: 'On 4 L via nasal cannula, sats up to 88. He is working hard. Steroids not given yet.', meta: 'Nurse · 12:58' },
            ] },
          ],
        },
      },
      {
        caption: 'The doctor answers with the order itself, typed as a message. No second system, no form to find.',
        scene: {
          head: 'Rajesh Iyer', sub: 'GM-102 · case room · 4 people',
          blocks: [
            { id: 'chat', k: 'chat', msgs: [
              { from: 'you', text: 'On 4 L via nasal cannula, sats up to 88. Steroids not given yet.', meta: 'Nurse · 12:58' },
              { from: 'orb', text: 'Start prednisolone 40 mg oral, once daily for five days.', meta: 'Dr Meera Sharma · 13:01' },
            ] },
          ],
        },
      },
      {
        caption: 'A model on the appliance reads the sentence and turns it into a drug card, checked against his chart. Saying it is not prescribing it: someone has to approve.',
        scene: {
          head: 'Order from a message', sub: 'Read by the local model',
          blocks: [
            { id: 'card', k: 'fields', label: 'Prednisolone', fields: [
              { label: 'Dose', value: '40 mg' },
              { label: 'Route', value: 'Oral' },
              { label: 'Freq', value: 'Once daily' },
              { label: 'Days', value: '5' },
            ] },
            { id: 'banner', k: 'banner', tone: 'info', tag: 'Checked', title: 'No allergy match, no dose flag', body: 'Screened against his chart before the card was offered.' },
            { id: 'chips', k: 'chips', chips: [{ text: 'Approve', tone: 'accent' }, { text: 'Edit', tone: 'muted' }, { text: 'Discard', tone: 'muted' }] },
          ],
        },
      },
    ],
  },

  {
    id: 'story-helix', label: 'Helix', app: 'Orb Helix', who: 'Pharmacist',
    steps: [
      {
        caption: 'Approved, it arrives in the pharmacist’s queue, marked as something a model pulled out of a sentence.',
        scene: {
          head: 'Verification queue', sub: 'Pharmacy · 3 waiting',
          blocks: [
            { id: 'rows', k: 'rows', rows: [
              { id: 'p1', title: 'Prednisolone 40 mg oral', sub: 'Rajesh Iyer · GM-102 · from a Relay message', tag: 'AI extracted', tagTone: 'warn', active: true },
              { id: 'p2', title: 'Salbutamol nebuliser', sub: 'Rajesh Iyer · from a signed note', tag: 'AI extracted', tagTone: 'warn' },
              { id: 'p3', title: 'Amoxicillin 500 mg', sub: 'Ananya Kapoor · typed by a prescriber', tag: 'Prescribed', tagTone: 'muted' },
            ] },
            { id: 'note', k: 'lines', lines: [
              { text: 'Nothing in this queue is an order yet. The ward cannot give any of it.', strong: true },
            ] },
          ],
        },
      },
      {
        caption: 'The pharmacist checks the dose, the route and the frequency against the chart, and can change any of them.',
        scene: {
          head: 'Prednisolone 40 mg', sub: 'Rajesh Iyer · GM-102',
          blocks: [
            { id: 'fields', k: 'fields', fields: [
              { label: 'Dose', value: '40 mg' },
              { label: 'Route', value: 'Oral' },
              { label: 'Freq', value: 'Once daily' },
              { label: 'Days', value: '5' },
            ] },
            { id: 'banner', k: 'banner', tone: 'info', tag: 'Source', title: 'From a message by Dr Meera Sharma, 13:01', body: 'The sentence it came from is one click away.' },
          ],
        },
      },
      {
        caption: 'Screened against his active medications and his allergies. What the knowledge base does not cover is marked, not waved through.',
        scene: {
          head: 'Safety screen', sub: '6 active medications',
          blocks: [
            { id: 'rows', k: 'rows', rows: [
              { id: 'i1', title: 'Prednisolone', sub: 'Screened against 6 active medications', tag: 'No interaction', tagTone: 'ok' },
              { id: 'i2', title: 'Ceftriaxone allergy on file', sub: 'Anaphylaxis, recorded at admission. Not implicated here.', tag: 'Noted', tagTone: 'muted' },
              { id: 'i3', title: 'Herbal preparation, unnamed', sub: 'Outside the interaction knowledge base', tag: 'Not screened', tagTone: 'warn' },
            ] },
          ],
        },
      },
      {
        caption: 'A named pharmacist verifies it. That, and nothing earlier, is the moment it becomes an order on the ward.',
        scene: {
          head: 'Verified', sub: 'Prednisolone 40 mg · Rajesh Iyer',
          blocks: [
            { id: 'banner', k: 'banner', tone: 'ok', tag: 'Verified', title: 'Now an active order', body: 'Verified by the pharmacist on duty, recorded by name and time.' },
            { id: 'chips', k: 'chips', chips: [{ text: 'Sent to GM-102', tone: 'ok' }, { text: 'On the eMAR', tone: 'muted' }, { text: 'In the audit log', tone: 'muted' }] },
          ],
        },
      },
      {
        caption: 'It lands on the nurse’s shift as due, with the allergy printed on the sheet she gives it from. The ward closes the loop it opened.',
        scene: {
          head: 'My Shift', sub: 'Due now · GM-102',
          blocks: [
            { id: 'rows', k: 'rows', rows: [
              { id: 'd1', score: 'now', tone: 'warn', title: 'Prednisolone 40 mg oral', sub: 'Rajesh Iyer · first dose', tag: 'Due', tagTone: 'warn', active: true },
            ] },
            { id: 'banner', k: 'banner', tone: 'critical', tag: 'On the sheet', title: 'Allergy: ceftriaxone, anaphylaxis', body: 'Printed on the administration sheet at the bedside, every time.' },
          ],
        },
      },
    ],
  },
]
