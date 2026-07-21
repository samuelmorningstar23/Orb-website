import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OrbLogo from './OrbLogo'
import SearchOverlay from './SearchOverlay'
import { ALL_MODULES, FEATURED_MODULES, PLANS, openDemoModal, type FeaturedModule } from '../data/siteContent'
import './MarketingHeader.css'

// ─── Top-bar model ───
// Each nav item may carry a flyout panel. Hovering (or focusing) a trigger
// opens one shared glass card under the bar; moving between triggers morphs
// the card's position and size instead of re-opening it.

type NavItem =
  | { id: string; label: string; to: string; panel: 'plans' }
  | { id: string; label: string; to: string; panel: 'modules' }
  | { id: string; label: string; to: string; panel: 'module'; module: FeaturedModule }
  | { id: string; label: string; to: string; panel: null }

const NAV_ITEMS: NavItem[] = [
  { id: 'plans', label: 'Plans', to: '/plans', panel: 'plans' },
  ...FEATURED_MODULES.map<NavItem>(m => ({ id: m.to, label: m.navLabel, to: m.to, panel: 'module', module: m })),
  { id: 'modules', label: 'Modules', to: '/#modules', panel: 'modules' },
  { id: 'support', label: 'Support', to: '/support', panel: null },
]

const HOVER_OPEN_DELAY = 70
const HOVER_CLOSE_DELAY = 180

export default function MarketingHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark'
  )
  const [openId, setOpenId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)
  const flyoutContentRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  // Mirror of openId for use inside event handlers without stale closures.
  const openIdRef = useRef<string | null>(null)
  useEffect(() => { openIdRef.current = openId }, [openId])

  const location = useLocation()

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = (document.documentElement.getAttribute('data-theme') || 'dark') as 'light' | 'dark'
      setTheme(t => (currentTheme !== t ? currentTheme : t))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // Any navigation closes everything.
  useEffect(() => {
    setOpenId(null)
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  const cancelTimers = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }

  const closeNow = useCallback(() => {
    cancelTimers()
    setOpenId(null)
  }, [])

  const scheduleClose = useCallback(() => {
    cancelTimers()
    closeTimer.current = window.setTimeout(() => setOpenId(null), HOVER_CLOSE_DELAY)
  }, [])

  const scheduleOpen = useCallback((id: string) => {
    cancelTimers()
    // First open waits for hover intent; switching between items is instant.
    if (openIdRef.current === null) {
      openTimer.current = window.setTimeout(() => setOpenId(id), HOVER_OPEN_DELAY)
    } else {
      setOpenId(id)
    }
  }, [])

  // ESC, outside-press, and resize all dismiss the flyout.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenId(null); setMobileOpen(false) }
    }
    const onPress = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenId(null)
    }
    const onResize = () => setOpenId(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPress)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPress)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Lock scroll while the mobile drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow
    if (mobileOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [mobileOpen])

  // Let any page summon the search overlay (mirrors the demo-modal pattern).
  useEffect(() => {
    const onOpenSearch = () => setSearchOpen(true)
    window.addEventListener('open-orb-search', onOpenSearch)
    return () => window.removeEventListener('open-orb-search', onOpenSearch)
  }, [])

  // Morph the shared card to sit centered under the active trigger, clamped to
  // the viewport. Runs before paint so the first open doesn't animate from 0.
  useLayoutEffect(() => {
    if (!openId) return
    const trigger = triggerRefs.current[openId]
    const flyout = flyoutRef.current
    const content = flyoutContentRef.current
    if (!trigger || !flyout || !content) return
    const t = trigger.getBoundingClientRect()
    const width = content.offsetWidth
    const height = content.offsetHeight
    const vw = document.documentElement.clientWidth
    const left = Math.round(Math.min(Math.max(t.left + t.width / 2 - width / 2, 14), Math.max(vw - width - 14, 14)))
    flyout.style.left = `${left}px`
    flyout.style.width = `${width}px`
    flyout.style.height = `${height}px`
  }, [openId])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('orb-theme', nextTheme)
    setTheme(nextTheme)
    window.dispatchEvent(new CustomEvent('theme-changed'))
  }

  const openDemo = () => { setMobileOpen(false); closeNow(); openDemoModal() }

  // On touch devices the first tap on a card-carrying trigger opens its card;
  // tapping it again (card already open) follows the link.
  const onTriggerClick = (e: React.MouseEvent, item: NavItem) => {
    if (!item.panel) return
    const noHover = window.matchMedia('(hover: none)').matches
    if (noHover && openId !== item.id) {
      e.preventDefault()
      cancelTimers()
      setOpenId(item.id)
    }
  }

  const onHeaderBlur = (e: React.FocusEvent) => {
    if (headerRef.current && !headerRef.current.contains(e.relatedTarget as Node)) setOpenId(null)
  }

  // ArrowDown from a trigger dives into the open card.
  const onTriggerKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (!item.panel) return
    if (e.key === 'ArrowDown' && openId === item.id) {
      e.preventDefault()
      flyoutRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    }
  }

  const activeItem = NAV_ITEMS.find(i => i.id === openId)

  const ThemeIcon = theme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  const arrow = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )

  const renderPanel = (item: NavItem) => {
    if (item.panel === 'plans') {
      return (
        <div className="nav-panel nav-panel--plans">
          <span className="nav-panel__eyebrow">One platform, four sizes</span>
          <div className="nav-panel__plan-list">
            {PLANS.map(p => (
              <Link key={p.id} to={`/plans#${p.id}`} className="nav-panel__plan" onClick={closeNow}>
                <span className="nav-panel__plan-name">{p.name}</span>
                <span className="nav-panel__plan-tag">{p.tagline}</span>
              </Link>
            ))}
          </div>
          <Link to="/plans" className="nav-panel__footer-link" onClick={closeNow}>
            Compare all plans {arrow}
          </Link>
        </div>
      )
    }
    if (item.panel === 'modules') {
      return (
        <div className="nav-panel nav-panel--modules">
          <span className="nav-panel__eyebrow">Fourteen modules. One operating system.</span>
          <div className="nav-panel__module-grid">
            {ALL_MODULES.map(m => (
              <Link key={m.to} to={m.to} className="nav-panel__module-link" onClick={closeNow}>
                {m.label}
              </Link>
            ))}
          </div>
          <Link to="/#modules" className="nav-panel__footer-link" onClick={closeNow}>
            See them on the overview {arrow}
          </Link>
        </div>
      )
    }
    if (item.panel === 'module') {
      const m = item.module
      return (
        <div className="nav-panel nav-panel--module">
          <span className="nav-panel__eyebrow">{m.badge}</span>
          <p className="nav-panel__summary">{m.summary}</p>
          <div className="nav-panel__actions">
            <Link to={m.to} className="nav-panel__know" onClick={closeNow}>
              Know more {arrow}
            </Link>
            <button className="nav-panel__demo" onClick={openDemo}>Demo</button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <header className="marketing-header" ref={headerRef} onPointerLeave={scheduleClose} onBlur={onHeaderBlur}>
      <div className="marketing-header__container">
        <Link to="/" className="marketing-header__brand" onClick={() => setMobileOpen(false)} onPointerEnter={scheduleClose}>
          <OrbLogo size={24} />
          <span className="marketing-header__title">Orb</span>
        </Link>

        <nav className="marketing-header__nav" aria-label="Primary">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.id}
              ref={el => { triggerRefs.current[item.id] = el }}
              to={item.to}
              className={`marketing-header__link ${openId === item.id ? 'is-open' : ''}`}
              aria-haspopup={item.panel ? 'true' : undefined}
              aria-expanded={item.panel ? openId === item.id : undefined}
              onPointerEnter={e => {
                if (e.pointerType !== 'mouse') return
                if (item.panel) scheduleOpen(item.id)
                else scheduleClose()
              }}
              onFocus={() => { if (item.panel) { cancelTimers(); setOpenId(item.id) } }}
              onClick={e => onTriggerClick(e, item)}
              onKeyDown={e => onTriggerKeyDown(e, item)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="marketing-header__actions" onPointerEnter={scheduleClose}>
          <button className="marketing-header__icon-btn" onClick={() => { closeNow(); setSearchOpen(true) }} aria-label="Search Orb" title="Search (⌘K)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.4" y2="16.4" />
            </svg>
          </button>

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

      {/* The one shared glass card — morphs between triggers */}
      {activeItem && activeItem.panel && (
        <div
          className="nav-flyout"
          ref={flyoutRef}
          onPointerEnter={cancelTimers}
          onPointerLeave={scheduleClose}
        >
          <div className="nav-flyout__inner" ref={flyoutContentRef} key={activeItem.id}>
            {renderPanel(activeItem)}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="marketing-header__drawer">
          <Link to="/" className="marketing-header__drawer-link marketing-header__drawer-link--overview" onClick={() => setMobileOpen(false)}>Overview</Link>

          <span className="marketing-header__drawer-label">Plans</span>
          <div className="marketing-header__drawer-grid">
            {PLANS.map(p => (
              <Link key={p.id} to={`/plans#${p.id}`} className="marketing-header__drawer-link" onClick={() => setMobileOpen(false)}>{p.name}</Link>
            ))}
          </div>

          <span className="marketing-header__drawer-label">Modules</span>
          <div className="marketing-header__drawer-grid">
            {ALL_MODULES.map(m => (
              <Link key={m.to} to={m.to} className="marketing-header__drawer-link" onClick={() => setMobileOpen(false)}>{m.label}</Link>
            ))}
          </div>

          <Link to="/support" className="marketing-header__drawer-link marketing-header__drawer-link--overview" onClick={() => setMobileOpen(false)}>Support</Link>

          <button className="marketing-header__drawer-cta" onClick={openDemo}>Request a Demo</button>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpen={() => setSearchOpen(true)} />
    </header>
  )
}
