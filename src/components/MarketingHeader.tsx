import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import OrbLogo from './OrbLogo'
import './MarketingHeader.css'

export default function MarketingHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark'
  })

  // Synchronize internal state if theme is updated outside (e.g. system preference changes)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = (document.documentElement.getAttribute('data-theme') || 'dark') as 'light' | 'dark'
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('orb-theme', nextTheme)
    setTheme(nextTheme)
    window.dispatchEvent(new CustomEvent('theme-changed'))
  }

  return (
    <header className="marketing-header">
      <div className="marketing-header__container">
        <Link to="/" className="marketing-header__brand">
          <OrbLogo size={24} />
          <span className="marketing-header__title">Orb <span className="marketing-header__tag">OS</span></span>
        </Link>

        <nav className="marketing-header__nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Overview
          </NavLink>
          <NavLink 
            to="/vigil" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Vigil
          </NavLink>
          <NavLink 
            to="/sage" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Sage
          </NavLink>
          <NavLink 
            to="/scribe" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Scribe
          </NavLink>
          <NavLink 
            to="/lens" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Lens
          </NavLink>
          <NavLink 
            to="/relay" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Relay
          </NavLink>
          <NavLink 
            to="/helix" 
            className={({ isActive }) => 
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Helix
          </NavLink>
          <NavLink
            to="/surgical-suite"
            className={({ isActive }) =>
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Surgical
          </NavLink>
          <NavLink
            to="/pulse"
            className={({ isActive }) =>
              `marketing-header__link ${isActive ? 'marketing-header__link--active' : ''}`
            }
          >
            Pulse
          </NavLink>
        </nav>

        <div className="marketing-header__actions">
          {/* Theme switcher */}
          <button 
            className="marketing-header__theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // Moon Icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button 
            className="marketing-header__request-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}
          >
            Request Demo
          </button>
        </div>
      </div>
    </header>
  )
}
