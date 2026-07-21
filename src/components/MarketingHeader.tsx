import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import OrbLogo from './OrbLogo'
import './MarketingHeader.css'

const MODULES: { to: string; label: string }[] = [
  { to: '/sage', label: 'Sage' },
  { to: '/vigil', label: 'Vigil' },
  { to: '/scribe', label: 'Scribe' },
  { to: '/lens', label: 'Lens' },
  { to: '/relay', label: 'Relay' },
  { to: '/helix', label: 'Helix' },
  { to: '/surgical-suite', label: 'Surgical Suite' },
  { to: '/pulse', label: 'Pulse' },
  { to: '/forecast', label: 'Forecast' },
  { to: '/bridge', label: 'Bridge' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/revenue-integrity', label: 'Revenue Integrity' },
  { to: '/command-center', label: 'Command Center' },
  { to: '/surge-simulator', label: 'Surge Simulator' },
]

export default function MarketingHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark'
  )
  const [modulesOpen, setModulesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const modulesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = (document.documentElement.getAttribute('data-theme') || 'dark') as 'light' | 'dark'
      if (currentTheme !== theme) setTheme(currentTheme)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [theme])

  // Close the modules dropdown on outside-click / ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (modulesRef.current && !modulesRef.current.contains(e.target as Node)) setModulesOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setModulesOpen(false); setMobileOpen(false) } }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey) }
  }, [])

  // Lock scroll while the mobile drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow
    if (mobileOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [mobileOpen])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('orb-theme', nextTheme)
    setTheme(nextTheme)
    window.dispatchEvent(new CustomEvent('theme-changed'))
  }

  const openDemo = () => { setMobileOpen(false); window.dispatchEvent(new CustomEvent('open-demo-modal')) }

  const ThemeIcon = theme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  return (
    <header className="marketing-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="marketing-header__container">
        <Link to="/" className="marketing-header__brand" onClick={() => setMobileOpen(false)}>
          <OrbLogo size={24} />
          <span className="marketing-header__title">Orb</span>
        </Link>

        <nav className="marketing-header__nav">
          <NavLink to="/" end className={({ isActive }) => `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`}>
            Overview
          </NavLink>

          <div className="marketing-header__modules" ref={modulesRef}>
            <button
              className={`marketing-header__link marketing-header__modules-trigger ${modulesOpen ? 'is-open' : ''}`}
              onClick={() => setModulesOpen(o => !o)}
              aria-expanded={modulesOpen}
            >
              Modules
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {modulesOpen && (
              <div className="marketing-header__dropdown">
                <div className="marketing-header__dropdown-grid">
                  {MODULES.map(m => (
                    <NavLink
                      key={m.to}
                      to={m.to}
                      className={({ isActive }) => `marketing-header__dropdown-link ${isActive ? 'is-active' : ''}`}
                      onClick={() => setModulesOpen(false)}
                    >
                      {m.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({ isActive }) => `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/security" className={({ isActive }) => `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`}>
            Security
          </NavLink>
        </nav>

        <div className="marketing-header__actions">
          <button className="marketing-header__theme-toggle" onClick={toggleTheme} aria-label="Toggle visual theme" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {ThemeIcon}
          </button>

          <button className="marketing-header__request-btn" onClick={openDemo}>Request Demo</button>

          <button
            className="marketing-header__hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="marketing-header__drawer">
          <NavLink to="/" end className="marketing-header__drawer-link marketing-header__drawer-link--overview" onClick={() => setMobileOpen(false)}>Overview</NavLink>
          <NavLink to="/about" className="marketing-header__drawer-link marketing-header__drawer-link--overview" onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/security" className="marketing-header__drawer-link marketing-header__drawer-link--overview" onClick={() => setMobileOpen(false)}>Security</NavLink>
          <span className="marketing-header__drawer-label">Modules</span>
          <div className="marketing-header__drawer-grid">
            {MODULES.map(m => (
              <NavLink key={m.to} to={m.to} className="marketing-header__drawer-link" onClick={() => setMobileOpen(false)}>{m.label}</NavLink>
            ))}
          </div>
          <button className="marketing-header__drawer-cta" onClick={openDemo}>Request a Demo</button>
        </div>
      )}
    </header>
  )
}
