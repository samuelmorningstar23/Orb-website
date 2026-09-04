import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import SlateShowcase from '../../components/showcases/SlateShowcase'
import './ModuleDetails.css'

export default function SlateDetail() {
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
          <span className="module-detail__badge">Scheduling &amp; Follow-up</span>
          <h1 className="module-detail__title">Slate</h1>
          <p className="module-detail__tagline">
            Keeps every follow-up, review, and clinic slot in order — so follow-ups don't slip between visits.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <SlateShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Unified Schedule</h3>
            <p className="module-detail__card-desc">
              One clear view of clinics, follow-ups, and reviews across teams and wards.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Smart Slotting</h3>
            <p className="module-detail__card-desc">
              Suggests the right time and place for each follow-up, reducing gaps and missed visits.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Gentle Reminders</h3>
            <p className="module-detail__card-desc">
              Keeps patients and staff ahead of what is coming next.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.97-4.03 9-9 9a9 9 0 0 1-8-13" />
                <path d="M3.5 8A9 9 0 0 1 12 3c2.5 0 4.77 1.02 6.4 2.66" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Connected to Care</h3>
            <p className="module-detail__card-desc">
              Flows directly from discharge and treatment plans, so follow-up is never an afterthought.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Slate</h2>
          <p className="module-detail__cta-desc">
            Continuity, kept.
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
