import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import RequestDemoModal from './components/RequestDemoModal'
import ScrollToTop from './components/ScrollToTop'
import RouteHead from './components/RouteHead'
import PointerGlow from './components/PointerGlow'
import OrbLogo from './components/OrbLogo'
import './App.css'

// Detail and company pages are code-split so the landing page ships without
// the weight of fourteen demo widgets. Each chunk loads on first visit.
const VigilDetail = lazy(() => import('./pages/details/VigilDetail'))
const SageDetail = lazy(() => import('./pages/details/SageDetail'))
const ScribeDetail = lazy(() => import('./pages/details/ScribeDetail'))
const LensDetail = lazy(() => import('./pages/details/LensDetail'))
const RelayDetail = lazy(() => import('./pages/details/RelayDetail'))
const HelixDetail = lazy(() => import('./pages/details/HelixDetail'))
const SurgicalSuiteDetail = lazy(() => import('./pages/details/SurgicalSuiteDetail'))
const PulseDetail = lazy(() => import('./pages/details/PulseDetail'))
const BridgeDetail = lazy(() => import('./pages/details/BridgeDetail'))
const ForecastDetail = lazy(() => import('./pages/details/ForecastDetail'))
const AppointmentsDetail = lazy(() => import('./pages/details/AppointmentsDetail'))
const CommandCenterDetail = lazy(() => import('./pages/details/CommandCenterDetail'))
const RevenueIntegrityDetail = lazy(() => import('./pages/details/RevenueIntegrityDetail'))
const SurgeSimulatorDetail = lazy(() => import('./pages/details/SurgeSimulatorDetail'))
const AboutPage = lazy(() => import('./pages/company/AboutPage'))
const SecurityPage = lazy(() => import('./pages/company/SecurityPage'))
const PrivacyPage = lazy(() => import('./pages/company/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/company/TermsPage'))

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

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <OrbLogo size={40} />
      <span>Loading…</span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteHead />
      <PointerGlow />
      <ScrollToTop />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
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
          <Route path="/appointments" element={<AppointmentsDetail />} />
          <Route path="/command-center" element={<CommandCenterDetail />} />
          <Route path="/revenue-integrity" element={<RevenueIntegrityDetail />} />
          <Route path="/surge-simulator" element={<SurgeSimulatorDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <RequestDemoModal />
    </BrowserRouter>
  )
}

export default App
