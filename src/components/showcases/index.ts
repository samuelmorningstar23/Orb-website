import type { ComponentType } from 'react'
import SageShowcase from './SageShowcase'
import VigilShowcase from './VigilShowcase'
import ScribeShowcase from './ScribeShowcase'
import LensShowcase from './LensShowcase'
import RelayShowcase from './RelayShowcase'
import HelixShowcase from './HelixShowcase'
import SurgicalSuiteShowcase from './SurgicalSuiteShowcase'
import PulseShowcase from './PulseShowcase'
import ForecastShowcase from './ForecastShowcase'
import BridgeShowcase from './BridgeShowcase'
import SlateShowcase from './SlateShowcase'
import RevenueIntegrityShowcase from './RevenueIntegrityShowcase'
import CommandCenterShowcase from './CommandCenterShowcase'
import SurgeSimulatorShowcase from './SurgeSimulatorShowcase'

/** Live demo for each module, keyed by its route. Used by the module pages and the homepage explorer. */
export const SHOWCASES: Record<string, ComponentType> = {
  '/sage': SageShowcase,
  '/vigil': VigilShowcase,
  '/scribe': ScribeShowcase,
  '/lens': LensShowcase,
  '/relay': RelayShowcase,
  '/helix': HelixShowcase,
  '/surgical-suite': SurgicalSuiteShowcase,
  '/pulse': PulseShowcase,
  '/forecast': ForecastShowcase,
  '/bridge': BridgeShowcase,
  '/slate': SlateShowcase,
  '/revenue-integrity': RevenueIntegrityShowcase,
  '/command-center': CommandCenterShowcase,
  '/surge-simulator': SurgeSimulatorShowcase,
}
