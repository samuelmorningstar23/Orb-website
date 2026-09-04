import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import ForecastShowcase from '../../components/showcases/ForecastShowcase'
import './ModuleDetails.css'

export default function ForecastDetail() {
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
          <span className="module-detail__badge">Predictive Capacity Planning</span>
          <h1 className="module-detail__title">Forecast</h1>
          <p className="module-detail__tagline">
            Anticipates length of stay, discharge readiness, and bed pressure, so the whole hospital can plan a day ahead, not a day behind.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <ForecastShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Length-of-Stay Estimates</h3>
            <p className="module-detail__card-desc">
              Projects how long each patient is likely to stay, updated as their picture changes.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Discharge Readiness</h3>
            <p className="module-detail__card-desc">
              Highlights who is trending toward discharge, helping teams free capacity safely and on time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 3 3 5-6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Ward-Level Outlook</h3>
            <p className="module-detail__card-desc">
              Rolls individual predictions into a clear bed-availability picture for the days ahead.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Grounded in Your Data</h3>
            <p className="module-detail__card-desc">
              Designed to learn from your hospital's own patient journeys, with every calculation kept on-site.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Forecast</h2>
          <p className="module-detail__cta-desc">
            Capacity you can see coming.
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
