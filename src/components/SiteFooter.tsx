import { Link } from 'react-router-dom'
import { ALL_MODULES, CONTACT_EMAIL } from '../data/siteContent'
import './SiteFooter.css'

/**
 * The footer every page lands on: the module list, the company links and the
 * line that says no real patient appears on the site. It renders at the end of
 * each page's main, so it takes that page's column.
 */
export default function SiteFooter() {
  const half = Math.ceil(ALL_MODULES.length / 2)

  return (
    <footer className="landing-overview__footer">
      <div className="landing-overview__footer-top">
        <div className="landing-overview__footer-brand">
          <span className="landing-overview__footer-wordmark">Orb</span>
          <p className="landing-overview__footer-tagline">Hospital software that never leaves the building.</p>
        </div>

        <nav className="landing-overview__footer-cols">
          <div className="landing-overview__footer-col">
            <span className="landing-overview__footer-col-title">Modules</span>
            {ALL_MODULES.slice(0, half).map(m => (
              <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
            ))}
          </div>
          <div className="landing-overview__footer-col">
            <span className="landing-overview__footer-col-title">&nbsp;</span>
            {ALL_MODULES.slice(half).map(m => (
              <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
            ))}
          </div>
          <div className="landing-overview__footer-col">
            <span className="landing-overview__footer-col-title">Company</span>
            <Link to="/modules" className="landing-overview__footer-link">Modules</Link>
            <Link to="/back-office" className="landing-overview__footer-link">Back office</Link>
            <Link to="/plans" className="landing-overview__footer-link">Plans</Link>
            <Link to="/security" className="landing-overview__footer-link">Security</Link>
            <Link to="/support" className="landing-overview__footer-link">Support</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="landing-overview__footer-link">Contact</a>
          </div>
        </nav>
      </div>

      <div className="landing-overview__footer-bottom">
        <p>© 2026 Orb. All rights reserved.</p>
        <p className="landing-overview__footer-fineprint">The animations on this site are drawn from the product, and the screenshots are the product running on a test computer with made-up patients. No real patient appears here, and Orb has not yet run in a hospital.</p>
      </div>
    </footer>
  )
}
