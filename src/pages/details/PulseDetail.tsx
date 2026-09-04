import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import PulseShowcase from '../../components/showcases/PulseShowcase'
import './ModuleDetails.css'

export default function PulseDetail() {
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
          <span className="module-detail__badge">Environmental &amp; Population Signals</span>
          <h1 className="module-detail__title">Pulse</h1>
          <p className="module-detail__tagline">
            Sees the pressures building outside your walls — and tells you which patients will feel them first.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <PulseShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h4l3 8 4-16 3 8h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Regional Signal Tracking</h3>
            <p className="module-detail__card-desc">
              Continuously watches local air quality, weather, and community illness activity that drive admissions and respiratory flare-ups.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 0 0 18M3 12h18" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinical Cross-Referencing</h3>
            <p className="module-detail__card-desc">
              Connects outside conditions to the patients on your wards, surfacing who is most exposed before symptoms escalate.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Proactive Advisories</h3>
            <p className="module-detail__card-desc">
              Turns environmental shifts into clear, ward-level guidance your team can act on ahead of time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Always On-Site</h3>
            <p className="module-detail__card-desc">
              Runs entirely within the hospital, keeping population insight available even when outside networks are down.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Pulse</h2>
          <p className="module-detail__cta-desc">Population awareness, translated into bedside action.</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

    </div>
  )
}
