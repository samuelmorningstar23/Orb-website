// ─── The plans page ───
//
// Every figure here comes from Orb's own pricing work and hardware
// specification, not from a guess:
//   · ₹2,000 platform + ₹375 per workflow per bed per month, eight workflows,
//     which is the ₹5,000 list price in docs/fundraising/ORB_PRICING_PLANS.
//   · Implementation ₹23,30,000 platform integration + ₹4,35,000 per workflow,
//     which is ₹58,10,000 at eight workflows for a mid-size hospital.
//   · Appliance ₹11,20,900 to ₹12,64,900, from docs/HARDWARE_SPEC.md section 10,
//     bought by the hospital from an Apple reseller at cost.
//   · Thirteen weeks from signature to shadow go-live, from docs/PILOT_ROADMAP.md.
// Dollar figures are indicative at ₹94.5 to the dollar, September 2026.

export const FX_NOTE = 'Dollar figures are indicative, converted at ₹94.5 to the dollar in September 2026. Contracts are in rupees. GST is charged as applicable.'

export interface Stage {
  id: string
  step: string
  name: string
  when: string
  price: string
  priceUsd: string
  unit: string
  desc: string
  points: string[]
}

export const STAGES: Stage[] = [
  {
    id: 'pilot',
    step: '01',
    name: 'The pilot',
    when: 'Thirteen weeks, one ward',
    price: '₹18,00,000',
    priceUsd: 'about $19,000',
    unit: 'fixed, for the whole pilot',
    desc: 'Thirteen weeks from signature to shadow go-live on one ward of up to sixty beds. The appliance is included in the fee and it stays with the hospital, whatever you decide at the end.',
    points: [
      'Every module from day one, not a cut-down trial',
      'The appliance, installed inside the hospital and yours to keep',
      'Shadow mode first: Orb scores, drafts and flags while nobody acts on it',
      'A weekly review with your clinical champion, and a scorecard the board can read',
    ],
  },
  {
    id: 'hospital',
    step: '02',
    name: 'The hospital',
    when: 'After the pilot, ward by ward',
    price: '₹5,000',
    priceUsd: 'about $53',
    unit: 'per bed per month',
    desc: 'Charged on the beds of the wards Orb is live on, so a staged rollout costs what it covers. Built as ₹2,000 for the platform plus ₹375 for each of the eight workflows, which means a hospital that runs four of them pays for four.',
    points: [
      'Every clinical module on every ward you deploy',
      'Front desk, billing, insurance, procurement, housekeeping and workforce',
      'Updates and support for the life of the contract',
      'No tier withholds a safety feature: the allergy interlock, NEWS2 and the audit chain are in every deployment',
    ],
  },
  {
    id: 'group',
    step: '03',
    name: 'The group',
    when: 'More than one hospital',
    price: '₹5,000',
    priceUsd: 'about $53, one appliance per site',
    unit: 'per bed per month, at each site',
    desc: 'Each hospital keeps its own appliance and its own data, so each site is its own deployment and its own implementation. A view across sites is on the roadmap and is not in the product today, and I would rather say that here than in the room.',
    points: [
      'Everything in the hospital plan, at every site',
      'One contract and one support line across the group',
      'A named engineer for the rollout',
    ],
  },
]

export interface PriceRow {
  what: string
  how: string
  inr: string
  usd: string
  note?: string
}

export const PRICE_ROWS: PriceRow[] = [
  { what: 'Platform', how: 'Per bed, per month', inr: '₹2,000', usd: '$21', note: 'Every deployment, whichever workflows you run' },
  { what: 'Each workflow', how: 'Per bed, per month', inr: '₹375', usd: '$4', note: 'Eight workflows exist. Eight of them is ₹5,000 a bed' },
  { what: 'The pilot', how: 'Fixed, thirteen weeks', inr: '₹18,00,000', usd: '$19,000', note: 'One ward up to sixty beds. Appliance included and kept' },
  { what: 'Implementation, platform', how: 'Once, per site', inr: '₹23,30,000', usd: '$24,700', note: 'Integration, migration, training, go-live' },
  { what: 'Implementation, each workflow', how: 'Once, per site', inr: '₹4,35,000', usd: '$4,600', note: 'Eight workflows is ₹58,10,000, about $61,500' },
  { what: 'The appliance', how: 'At cost, bought by you', inr: '₹11,20,900 to ₹12,64,900', usd: '$11,900 to $13,400', note: 'Primary, warm standby, backup drives, UPS, switch and cabinet. Raised against your own reseller quote' },
]

export const PRICE_NOTES: string[] = [
  'Per bed means the beds on the wards Orb is live on, not every bed the hospital owns. A staged rollout is charged as it goes.',
  'The appliance is not a margin line. The specification names the exact configuration and your finance team raises the purchase order against an Apple reseller quote, so the hardware costs you what it costs.',
  'A busy two-hundred-bed hospital needs more storage and, on the busiest wards, a third machine. That is in the capacity document and is scoped before anything is signed.',
]

export interface Week { weeks: string; title: string; body: string }

export const WEEKS: Week[] = [
  { weeks: 'Weeks 1 to 2', title: 'Site truth', body: 'What is actually on the ward: which monitors, whose vendor, what the current process does at three in the morning. The hardware specification goes to your IT lead in week one.' },
  { weeks: 'By week 3', title: 'The order, and it is a hard gate', body: 'The appliance is built to order and takes two to four weeks to arrive. If the purchase order has not been raised by the end of week three the schedule cannot absorb it, so I buy the machines and invoice them instead.' },
  { weeks: 'Weeks 2 to 5', title: 'The appliance', body: 'Installed, hardened and drilled: encryption at rest, backups taken and restored, the load soak re-run weekly and before every phase exit.' },
  { weeks: 'Weeks 3 to 7', title: 'The trust work', body: 'The safety machinery that has to be right before a clinician sees anything: the allergy interlock, the dose guard, the audit chain, and the instrumentation the scorecard is later computed from.' },
  { weeks: 'Weeks 4 to 9', title: 'Integration', body: 'Monitors are read only: Orb reads vital signs and can never write to a monitor or change a setting on one. First run against your real devices with your biomedical team present, by week eight. Manual entry stays as the redundancy layer, never the plan.' },
  { weeks: 'Weeks 9 to 10', title: 'Dress rehearsal', body: 'The whole ward workflow run end to end on seeded patients, with your staff, before a single real patient is on the screen.' },
  { weeks: 'Weeks 11 to 13', title: 'Shadow go-live', body: 'Orb runs on the real ward and scores, drafts and flags while nobody acts on it. Every call it makes is checked against what the ward actually did. The ward goes live after a clean shadow period, not on a date in a contract.' },
]

export interface Provision { side: 'hospital' | 'orb'; title: string; body: string }

export const PROVISIONS: Provision[] = [
  { side: 'hospital', title: 'A generator-backed circuit', body: 'The UPS runs from the same class of essential-services supply as ward equipment, with two spare outlets at the appliance location.' },
  { side: 'hospital', title: 'Wired gigabit ethernet, not Wi-Fi', body: 'To the appliance and to the standby, on a fixed IP address. A dropped ingestion packet becomes a gap in the vital-sign record, and that gap cannot be filled afterwards.' },
  { side: 'hospital', title: 'A locked place to put it', body: 'A lockable cabinet or rack shelf in a room the ward can reach but the public cannot.' },
  { side: 'hospital', title: 'Devices you already have', body: 'Nurse-station desktops, bedside tablets and clinicians’ phones, each with a current browser. Orb is a web application and there is nothing to install on any of them.' },
  { side: 'hospital', title: 'A clinical champion', body: 'One clinician who meets me weekly and whose judgement decides what is working. The pilot does not survive without this.' },
  { side: 'orb', title: 'The appliance, specified exactly', body: 'A primary machine, a warm standby, three encrypted backup drives, the UPS, the switch and the cabinet, with the configuration named down to the memory and the storage.' },
  { side: 'orb', title: 'The models, running on it', body: 'The clinical model, the ambient model, dictation, search and reranking, all resident on the appliance. No inference leaves the building.' },
  { side: 'orb', title: 'Installation and migration', body: 'Install, configure, migrate what you want migrated, and train the ward on the screens they will actually use.' },
  { side: 'orb', title: 'No inbound access, ever', body: 'There is no remote support path into the appliance and I am not asking for one. Outbound is optional, carries no patient data, and can be switched off at your firewall.' },
  { side: 'orb', title: 'The weekly review, and the scorecard', body: 'Every week with the champion, and at the end the measurement the board reads.' },
]

export const SCORECARD: { title: string; body: string }[] = [
  { title: 'Shadow episodes, with the denominator', body: 'How many times Orb flagged a deterioration, out of how many it could have flagged. A rate without its denominator is a slide, not a measurement.' },
  { title: 'Adjudicated against what the ward did', body: 'Each call compared with the record of what actually happened, so the pilot reports agreement and disagreement rather than a confidence score.' },
  { title: 'What it caught, and what it missed', body: 'Both are in the report. A pilot that only lists the catches has not been measured.' },
  { title: 'Medication safety events', body: 'Allergy blocks that fired, dose flags raised, and everything the pharmacist queue held back before it reached a patient.' },
  { title: 'Time, where it can be measured honestly', body: 'Where a before and after exists on the same ward, it is reported. Where it does not, the scorecard says so instead of estimating.' },
  { title: 'What the models were, on the day', body: 'Model versions, their validation state, and the audit chain covering every question asked of them during the pilot.' },
]

export const FAQ: { q: string; a: string }[] = [
  { q: 'Where does patient data live?', a: 'On the appliance, in your building, encrypted at rest. There is no cloud component, no data processing agreement with a third party, and nothing about a patient leaves the hospital. The one outbound call the product makes is the Pulse panel reading public weather, air quality, influenza and drug-recall feeds, and it carries a map coordinate and nothing else.' },
  { q: 'What happens when the machine fails?', a: 'A warm standby sits beside it, the UPS covers the power, and a printable snapshot per patient is kept current on the appliance for the case where the screens are dark. The Command Center shows how many of those snapshots are fresh, because downtime readiness should be a number rather than a promise.' },
  { q: 'What happens when we want to leave?', a: 'The record is yours and it is on your machine. Bridge already exports a patient record as FHIR, and the contract does not hold your data hostage to make leaving expensive.' },
  { q: 'Is it certified?', a: 'ABDM and NABH support ships as each is certified, and the product says which state each one is in on the Trust Center rather than implying more. Lens is not a certified diagnostic device and says so on its own screen. Where something is not yet certified, the answer here is that it is not yet certified.' },
  { q: 'Who can override a safety block?', a: 'A prescriber, and the override is recorded in their name in a hash-chained audit log. A nurse cannot clear an allergy block at the bedside. Every question asked of a model, and every refusal, is in the same log.' },
  { q: 'What does the contract cover?', a: 'Updates and support for its life, the named engineer for a group rollout, and the weekly review during a pilot. The hardware is bought by you at cost and belongs to you, including the appliance from the pilot.' },
  { q: 'How long until we are live?', a: 'Thirteen weeks from signature to shadow go-live on one ward, and the ward goes live after a clean shadow period rather than on a date somebody wrote in a contract. The single hard gate is the hardware order by the end of week three.' },
  { q: 'Who is behind this today?', a: 'One founder, and the product you have seen on this site. That is the honest answer to the question a CIO should ask before signing anything, and it is why the pilot is structured to be measurable and to leave you with the appliance.' },
]
