import type { LiveDemoView } from '../components/captures/LiveDemo'
import { SCREENS } from './orbCaptures'

// Which persona and tab of the real app each module opens on, and the poster
// shown while it boots. Tab ids are the app's nav ids (src/shellConfig.tsx in
// the Orb repo); the admin sub-tab and the Pulse button are element ids.
const poster = (name: string) => SCREENS[name]?.dark

export const LIVE_VIEWS: Record<string, LiveDemoView[]> = {
  '/vigil': [
    { id: 'ward', label: 'Doctor: the ward', persona: 'doctor', tab: 'vigil', poster: poster('vigil-patient-board'), hint: 'Try: open Rajesh Iyer, then Story, then the NEWS2 explanation.' },
    { id: 'nurse', label: 'Nurse mode', persona: 'nurse', tab: 'shift', subtab: 'patients', poster: poster('nurse-my-patients'), hint: 'Try: Record obs on any patient and change the numbers. The score is computed as you type.' },
  ],
  '/sage': [{ id: 'sage', label: 'Sage', persona: 'doctor', tab: 'sage', poster: poster('sage-panel'), hint: 'Try: one of the four cards, or ask about the classic ECG findings in hyperkalaemia.' }],
  '/scribe': [{ id: 'scribe', label: 'Scribe', persona: 'doctor', tab: 'scribe', poster: poster('scribe'), hint: 'Try: type a consultation, pick the patient, press Structure Note, then sign it.' }],
  '/lens': [{ id: 'lens', label: 'Lens', persona: 'doctor', tab: 'lens', poster: poster('lens') }],
  '/relay': [{ id: 'relay', label: 'Relay', persona: 'doctor', tab: 'relay', poster: poster('relay-case-rooms'), hint: 'Try: open Suresh Reddy’s room and send “Give Rajesh Iyer 40mg prednisolone now.”' }],
  '/helix': [
    { id: 'pharmacy', label: 'Pharmacist', persona: 'pharmacist', tab: 'pharmacy-verify', poster: poster('pharmacy-verify-queue'), hint: 'The prednisolone in the queue came from a note a doctor signed in Scribe.' },
    { id: 'orders', label: 'Doctor: orders', persona: 'doctor', tab: 'orders', poster: poster('orders-sepsis-six'), hint: 'Try: Order sets, Sepsis Six, then apply it to Suresh Reddy and to Ananya Kapoor.' },
  ],
  '/surgical-suite': [{ id: 'suite', label: 'Surgical Suite', persona: 'surgeon', tab: 'surgical-suite', poster: poster('surgical-suite-schedule') }],
  '/pulse': [{ id: 'pulse', label: 'Pulse', persona: 'doctor', tab: 'today', open: 'btn-pulse', poster: poster('pulse-environmental') }],
  '/forecast': [{ id: 'forecast', label: 'Forecast', persona: 'doctor', tab: 'forecast', poster: poster('forecast-census') }],
  '/command-center': [{ id: 'command', label: 'Command Center', persona: 'doctor', tab: 'command', poster: poster('command-center') }],
  '/surge-simulator': [{ id: 'simulator', label: 'Surge Simulator', persona: 'doctor', tab: 'capacity', poster: poster('capacity-simulator'), hint: 'Try: the scenario presets on the left.' }],
  '/bridge': [{ id: 'bridge', label: 'Bridge', persona: 'patient', poster: poster('bridge-patient-portal'), hint: 'Try: scroll down and ask “When can I go home?”' }],
  '/appointments': [{ id: 'appointments', label: 'Appointments', persona: 'doctor', tab: 'appointments', poster: poster('appointments') }],
  '/revenue-integrity': [{ id: 'revenue', label: 'Revenue Integrity', persona: 'doctor', tab: 'coding', poster: poster('revenue-integrity') }],
  '/security': [
    { id: 'trust', label: 'Trust Center', persona: 'admin', tab: 'admin', subtab: 'trust', poster: poster('admin-trust') },
    { id: 'flight', label: 'Flight Recorder', persona: 'admin', tab: 'admin', subtab: 'flight', poster: poster('admin-flight') },
    { id: 'models', label: 'Model Governance', persona: 'admin', tab: 'admin', subtab: 'models', poster: poster('admin-models') },
  ],
}

/** The captured walkthrough(s) shown under the live app on a module page. */
export const WALKTHROUGHS: Record<string, { flows: string[]; labels?: string[] }> = {
  '/vigil': { flows: ['ward-is-alive', 'nurse-shift'], labels: ['The ward', 'The nurse’s shift'] },
  '/sage': { flows: ['sage-ask', 'sage-refusal'], labels: ['Ask Sage', 'Out of scope'] },
  '/scribe': { flows: ['scribe-note'] },
  '/relay': { flows: ['wrong-room-warning'] },
  '/helix': { flows: ['pharmacy-verify', 'allergy-interlock'], labels: ['Pharmacist verification', 'The allergy interlock'] },
  '/bridge': { flows: ['patient-portal'] },
  '/security': { flows: ['show-your-work'] },
}
