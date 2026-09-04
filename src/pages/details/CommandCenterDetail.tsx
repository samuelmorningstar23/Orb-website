import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import CommandCenterShowcase from '../../components/showcases/CommandCenterShowcase'
import './ModuleDetails.css'

export default function CommandCenterDetail() {
  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">House-Wide Command Center</span>
          <h1 className="module-detail__title">Command Center</h1>
          <p className="module-detail__tagline">
            The whole hospital on one screen — every ward, every bed, every patient tipping the wrong way — so the people running the house see pressure before it becomes a crisis.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <CommandCenterShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">House-Wide Census</h3>
            <p className="module-detail__card-desc">
              Live occupancy and flow across every ward, held together in a single view — so you always know where the beds are and where they aren't.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <rect x="6" y="12" width="3" height="6" rx="1" />
                <rect x="11" y="8" width="3" height="10" rx="1" />
                <rect x="16" y="4" width="3" height="14" rx="1" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Acuity Heatmap</h3>
            <p className="module-detail__card-desc">
              See where clinical pressure is concentrating at a glance, as wards shift from steady to stretched — the whole house color-coded in real time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13h4l2-6 3 12 2-8 2 4h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Deterioration Watchlist</h3>
            <p className="module-detail__card-desc">
              The patients most likely to need you next, surfaced early and kept in front of the team — so the right people move before the situation turns.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M2 9h20" />
                <path d="M8 21h8M12 18v3" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">One Pane of Glass</h3>
            <p className="module-detail__card-desc">
              Beds, flow, theatre status and risk brought into a single, on-site view — everything running the house needs, and nothing leaving your walls.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Command Center</h2>
          <p className="module-detail__cta-desc">
            See the whole house before the house calls you.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

    </div>
  )
}
