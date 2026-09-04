import type { ComponentType } from 'react'
import { createElement } from 'react'
import FlowCapture from '../captures/FlowCapture'
import ScreensCapture from '../captures/ScreensCapture'

/**
 * The live demo for each module, keyed by its route. Every one is a capture of
 * the real product (see src/data/orbCaptures.ts): a workflow stepped through
 * frame by frame, or the module's screens in the visitor's theme. Used by the
 * module pages and the homepage explorer alike.
 */
const flow = (flows: string[], labels?: string[], label?: string): ComponentType =>
  () => createElement(FlowCapture, { flows, labels, label })

const screens = (label: string, list: string[], captions?: Record<string, string>, tall?: string[]): ComponentType =>
  () => createElement(ScreensCapture, { label, screens: list, captions, tall })

export const SHOWCASES: Record<string, ComponentType> = {
  '/sage': flow(['sage-ask', 'sage-refusal'], ['Ask Sage', 'Out of scope'], 'Sage, captured from the product'),
  '/vigil': flow(['ward-is-alive', 'nurse-shift'], ['The ward', 'The nurse’s shift'], 'Vigil, captured from the product'),
  '/scribe': flow(['scribe-note'], undefined, 'Scribe, captured from the product'),
  '/relay': flow(['wrong-room-warning'], undefined, 'Relay, captured from the product'),
  '/helix': flow(['pharmacy-verify', 'allergy-interlock'], ['Pharmacist verification', 'The allergy interlock'], 'Helix, captured from the product'),
  '/bridge': flow(['patient-portal'], undefined, 'Bridge, captured from the product'),
  '/lens': screens('Lens', ['lens'], { lens: 'Lens takes an X-ray, an ECG or a photo and drafts a first read on the appliance. Nothing is uploaded anywhere else.' }),
  '/surgical-suite': screens('Surgical Suite', ['surgical-suite-schedule', 'surgical-suite-day', 'surgical-suite-active-cases'], {
    'surgical-suite-schedule': 'The week: every listed procedure with its theatre, surgeon and readiness.',
    'surgical-suite-day': 'One day, one theatre list, with the risk flag beside each patient.',
    'surgical-suite-active-cases': 'Active cases as they move through the checklist.',
  }),
  '/pulse': screens('Pulse', ['pulse-environmental'], { 'pulse-environmental': 'Weather, air quality, flu surveillance and drug recalls, read from public feeds. Inbound only: the one call out carries a map coordinate and no patient.' }),
  '/forecast': screens('Forecast', ['forecast-census', 'forecast-capacity', 'forecast-discharge-board'], {
    'forecast-census': 'Seven-day census projection against capacity. The badge says it plainly: the model is untrained until real data exists.',
    'forecast-capacity': 'Ward capacity, bed by bed.',
    'forecast-discharge-board': 'The discharge board: who is likely ready, and what is blocking the rest.',
  }),
  '/appointments': screens('Appointments', ['appointments'], { appointments: 'Follow-ups, medication reviews and post-discharge checks, in day columns with the risk band of each patient.' }),
  '/revenue-integrity': screens('Revenue Integrity', ['revenue-integrity'], { 'revenue-integrity': 'Pick a patient and press Analyze: Orb reads the notes already on the chart and lists the codes they support and the documentation gaps that block them.' }),
  '/command-center': screens('Command Center', ['command-center'], { 'command-center': 'Census, critical patients, sepsis bundle compliance and downtime readiness on one screen, with the ward acuity map and the active deteriorations.' }),
  '/surge-simulator': screens('Surge Simulator', ['capacity-simulator'], { 'capacity-simulator': 'Twenty admissions tonight, eight beds closed, a flu surge at 1.5x: the simulator answers with peak occupancy, hours to overflow and the nurses you would need.' }),
}
