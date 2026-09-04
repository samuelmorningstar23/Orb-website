import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import Landing from './pages/Landing'
import Plans from './pages/Plans'
import Support from './pages/Support'
import Security from './pages/Security'
import VigilDetail from './pages/details/VigilDetail'
import SageDetail from './pages/details/SageDetail'
import ScribeDetail from './pages/details/ScribeDetail'
import LensDetail from './pages/details/LensDetail'
import RelayDetail from './pages/details/RelayDetail'
import HelixDetail from './pages/details/HelixDetail'
import SurgicalSuiteDetail from './pages/details/SurgicalSuiteDetail'
import PulseDetail from './pages/details/PulseDetail'
import BridgeDetail from './pages/details/BridgeDetail'
import ForecastDetail from './pages/details/ForecastDetail'
import SlateDetail from './pages/details/SlateDetail'
import CommandCenterDetail from './pages/details/CommandCenterDetail'
import RevenueIntegrityDetail from './pages/details/RevenueIntegrityDetail'
import SurgeSimulatorDetail from './pages/details/SurgeSimulatorDetail'
import RequestDemoModal from './components/RequestDemoModal'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

// Theme init — follow the operating system by default. A theme the visitor
// picked themselves (via the header toggle) is remembered and wins over the OS.
// Note: this deliberately tests `prefers-color-scheme: dark`, not `light` — the
// "no-preference" case must fall back to light rather than silently forcing dark.
try {
  const saved = localStorage.getItem('orb-theme')
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const chosen = saved === 'light' || saved === 'dark' ? saved : null
  document.documentElement.setAttribute('data-theme', chosen ?? (darkQuery.matches ? 'dark' : 'light'))

  // Keep tracking the OS live, but only while the visitor hasn't chosen for themselves.
  darkQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('orb-theme')) return
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    window.dispatchEvent(new CustomEvent('theme-changed'))
  })
} catch (e) {
  console.error('Failed to initialize theme:', e)
}

// Every route fades in and out. Opacity only — a transform on this wrapper
// would break position: fixed for the aurora canvas and overlays beneath it.
function Page({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Landing /></Page>} />
        <Route path="/plans" element={<Page><Plans /></Page>} />
        <Route path="/support" element={<Page><Support /></Page>} />
        <Route path="/security" element={<Page><Security /></Page>} />
        <Route path="/vigil" element={<Page><VigilDetail /></Page>} />
        <Route path="/sage" element={<Page><SageDetail /></Page>} />
        <Route path="/scribe" element={<Page><ScribeDetail /></Page>} />
        <Route path="/lens" element={<Page><LensDetail /></Page>} />
        <Route path="/relay" element={<Page><RelayDetail /></Page>} />
        <Route path="/helix" element={<Page><HelixDetail /></Page>} />
        <Route path="/surgical-suite" element={<Page><SurgicalSuiteDetail /></Page>} />
        <Route path="/pulse" element={<Page><PulseDetail /></Page>} />
        <Route path="/bridge" element={<Page><BridgeDetail /></Page>} />
        <Route path="/forecast" element={<Page><ForecastDetail /></Page>} />
        <Route path="/slate" element={<Page><SlateDetail /></Page>} />
        {/* Appointments was renamed to Slate — keep old links working */}
        <Route path="/appointments" element={<Navigate to="/slate" replace />} />
        <Route path="/command-center" element={<Page><CommandCenterDetail /></Page>} />
        <Route path="/revenue-integrity" element={<Page><RevenueIntegrityDetail /></Page>} />
        <Route path="/surge-simulator" element={<Page><SurgeSimulatorDetail /></Page>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <AnimatedRoutes />
      <RequestDemoModal />
    </BrowserRouter>
  )
}

export default App
