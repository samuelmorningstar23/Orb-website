import type { ComponentType } from 'react'
import { createElement } from 'react'
import LiveDemo from '../captures/LiveDemo'
import ScreensCapture from '../captures/ScreensCapture'
import { LIVE_VIEWS } from '../../data/liveViews'

/**
 * The demo for each module, keyed by its route: the real Orb front end running
 * in the browser on recorded data (components/captures/LiveDemo), opened on
 * that module's persona and tab. Used by the module pages and the homepage
 * explorer alike. A module without a live view falls back to its captured
 * screens.
 */
const live = (route: string, label: string): ComponentType =>
  () => createElement(LiveDemo, { views: LIVE_VIEWS[route], label })

const screens = (label: string, list: string[], captions?: Record<string, string>): ComponentType =>
  () => createElement(ScreensCapture, { label, screens: list, captions })

export const SHOWCASES: Record<string, ComponentType> = Object.fromEntries(
  Object.keys(LIVE_VIEWS).filter(r => r !== '/security').map(route => [route, live(route, `${route.slice(1)} live demo`)]),
)

export const FALLBACK_SCREENS = screens
