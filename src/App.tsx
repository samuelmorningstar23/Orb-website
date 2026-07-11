import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import VigilDetail from './pages/details/VigilDetail'
import SageDetail from './pages/details/SageDetail'
import ScribeDetail from './pages/details/ScribeDetail'
import LensDetail from './pages/details/LensDetail'
import RelayDetail from './pages/details/RelayDetail'
import HelixDetail from './pages/details/HelixDetail'
import SurgicalSuiteDetail from './pages/details/SurgicalSuiteDetail'
import RequestDemoModal from './components/RequestDemoModal'
import './App.css'

// Theme init (dark default; respects saved/system preference). Standalone —
// the marketing site shares the visual design tokens but no app logic.
try {
  const savedTheme = localStorage.getItem('orb-theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme || systemTheme)
} catch (e) {
  console.error('Failed to initialize theme:', e)
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/vigil" element={<VigilDetail />} />
        <Route path="/sage" element={<SageDetail />} />
        <Route path="/scribe" element={<ScribeDetail />} />
        <Route path="/lens" element={<LensDetail />} />
        <Route path="/relay" element={<RelayDetail />} />
        <Route path="/helix" element={<HelixDetail />} />
        <Route path="/surgical-suite" element={<SurgicalSuiteDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <RequestDemoModal />
    </BrowserRouter>
  )
}

export default App
