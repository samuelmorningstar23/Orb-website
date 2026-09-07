import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import Landing from './pages/Landing'
import Plans from './pages/Plans'
import Support from './pages/Support'
import Security from './pages/Security'
import ModulePage from './pages/details/ModulePage'
import RequestDemoModal from './components/RequestDemoModal'
import ScrollToTop from './components/ScrollToTop'
import { MODULE_PAGES } from './data/modulePages'
import './App.css'

// Theme init: light unless the visitor chose dark with the header toggle.
try {
  const saved = localStorage.getItem('orb-theme')
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const chosen = saved === 'light' || saved === 'dark' ? saved : null
  // The site is light first: the blue and white aurora is the look. A visitor
  // who picks dark in the header keeps it; the OS preference is not consulted.
  void darkQuery
  document.documentElement.setAttribute('data-theme', chosen ?? 'light')
} catch (e) {
  console.error('Failed to initialize theme:', e)
}

// Every route fades in and out. Opacity only - a transform on this wrapper
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
        {/* Every module page is the same layout over its own data and its own captures. */}
        {MODULE_PAGES.map(p => (
          <Route key={p.route} path={p.route} element={<Page><ModulePage route={p.route} /></Page>} />
        ))}
        {/* The module was briefly called Slate; keep those links working */}
        <Route path="/slate" element={<Navigate to="/appointments" replace />} />
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
