import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Plans from './pages/Plans'
import Support from './pages/Support'
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

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/support" element={<Support />} />
        <Route path="/vigil" element={<VigilDetail />} />
        <Route path="/sage" element={<SageDetail />} />
        <Route path="/scribe" element={<ScribeDetail />} />
        <Route path="/lens" element={<LensDetail />} />
        <Route path="/relay" element={<RelayDetail />} />
        <Route path="/helix" element={<HelixDetail />} />
        <Route path="/surgical-suite" element={<SurgicalSuiteDetail />} />
        <Route path="/pulse" element={<PulseDetail />} />
        <Route path="/bridge" element={<BridgeDetail />} />
        <Route path="/forecast" element={<ForecastDetail />} />
        <Route path="/slate" element={<SlateDetail />} />
        {/* Appointments was renamed to Slate — keep old links working */}
        <Route path="/appointments" element={<Navigate to="/slate" replace />} />
        <Route path="/command-center" element={<CommandCenterDetail />} />
        <Route path="/revenue-integrity" element={<RevenueIntegrityDetail />} />
        <Route path="/surge-simulator" element={<SurgeSimulatorDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <RequestDemoModal />
    </BrowserRouter>
  )
}

export default App
