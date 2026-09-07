import type { LiveDemoView } from '../components/captures/LiveDemo'
import { SCREENS } from './orbCaptures'

// Scripted workflow demos per module (scripts live in src/demo/scripts.ts in the
// Orb repo). Each locks the real app to one workflow and steps through it with
// captions; nothing outside the workflow is reachable, and only that workflow's
// recording is loaded.
const poster = (name: string) => SCREENS[name]?.dark

export const LIVE_VIEWS: Record<string, LiveDemoView[]> = {
  '/vigil': [
    { id: 'ward', label: 'The ward', persona: 'doctor', script: 'ward-is-alive', poster: poster('vigil-patient-board') },
    { id: 'nurse', label: 'The nurse’s shift', persona: 'nurse', script: 'nurse-shift', poster: poster('nurse-my-patients') },
  ],
  '/sage': [
    { id: 'ask', label: 'Ask Sage', persona: 'doctor', script: 'sage-ask', poster: poster('sage-panel') },
    { id: 'refusal', label: 'Out of scope', persona: 'doctor', script: 'sage-refusal', poster: poster('sage-panel') },
  ],
  '/scribe': [{ id: 'note', label: 'A note, signed', persona: 'doctor', script: 'scribe-note', poster: poster('scribe') }],
  '/lens': [{ id: 'lens', label: 'Lens', persona: 'doctor', script: 'lens', poster: poster('lens') }],
  '/relay': [{ id: 'room', label: 'The wrong-room warning', persona: 'doctor', script: 'wrong-room-warning', poster: poster('relay-case-room') }],
  '/helix': [
    { id: 'interlock', label: 'The allergy interlock', persona: 'doctor', script: 'allergy-interlock', poster: poster('orders-sepsis-six') },
    { id: 'verify', label: 'Pharmacist verification', persona: 'pharmacist', script: 'pharmacy-verify', poster: poster('pharmacy-verify-queue') },
  ],
  '/surgical-suite': [{ id: 'suite', label: 'Surgical Suite', persona: 'surgeon', script: 'surgical-suite', poster: poster('surgical-suite-schedule') }],
  '/pulse': [{ id: 'pulse', label: 'Pulse', persona: 'doctor', script: 'pulse', poster: poster('pulse-environmental') }],
  '/forecast': [{ id: 'forecast', label: 'Forecast', persona: 'doctor', script: 'forecast', poster: poster('forecast-census') }],
  '/command-center': [{ id: 'command', label: 'Command Center', persona: 'doctor', script: 'command-center', poster: poster('command-center') }],
  '/surge-simulator': [{ id: 'simulator', label: 'Surge Simulator', persona: 'doctor', script: 'surge-simulator', poster: poster('capacity-simulator') }],
  '/bridge': [{ id: 'bridge', label: 'Bridge', persona: 'patient', script: 'patient-portal', poster: poster('bridge-patient-portal') }],
  '/appointments': [{ id: 'appointments', label: 'Appointments', persona: 'doctor', script: 'appointments', poster: poster('appointments') }],
  '/revenue-integrity': [{ id: 'revenue', label: 'Revenue Integrity', persona: 'doctor', script: 'revenue-integrity', poster: poster('revenue-integrity') }],
  '/security': [{ id: 'trust', label: 'Show your work', persona: 'admin', script: 'show-your-work', poster: poster('admin-trust') }],
}

/** The captured walkthrough(s) shown under the live demo on a module page. */
export const WALKTHROUGHS: Record<string, { flows: string[]; labels?: string[] }> = {
  '/vigil': { flows: ['ward-is-alive', 'nurse-shift'], labels: ['The ward', 'The nurse’s shift'] },
  '/sage': { flows: ['sage-ask', 'sage-refusal'], labels: ['Ask Sage', 'Out of scope'] },
  '/scribe': { flows: ['scribe-note'] },
  '/relay': { flows: ['wrong-room-warning'] },
  '/helix': { flows: ['pharmacy-verify', 'allergy-interlock'], labels: ['Pharmacist verification', 'The allergy interlock'] },
  '/bridge': { flows: ['patient-portal'] },
  '/security': { flows: ['show-your-work'] },
}
