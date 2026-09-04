import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import SurgicalSuiteShowcase from '../../components/showcases/SurgicalSuiteShowcase'
import './ModuleDetails.css'

export default function SurgicalSuiteDetail() {
  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Operating-Room Coordination</span>
          <h1 className="module-detail__title">Surgical Suite</h1>
          <p className="module-detail__tagline">
            Keep every operating room moving as one. Tracks live theatre schedules, safety checklists, and anesthesia handoffs to keep surgical teams securely in sync.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <SurgicalSuiteShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Checklist Enforcement</h3>
            <p className="module-detail__card-desc">
              Mandates and locks phase transitions until identity checks, site markings, and equipment safety checks are confirmed.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Real-Time Schedules</h3>
            <p className="module-detail__card-desc">
              Synchronizes surgical schedules and OR staff responsibilities in real time, projecting ongoing surgical times on overhead dashboards.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Emergency Alert Broadcasts</h3>
            <p className="module-detail__card-desc">
              Broadcasts emergency alerts (e.g. cardiac arrest, anesthesiology backup required) to nearby clinicians in Relay channel rooms in one click.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinician Rosters</h3>
            <p className="module-detail__card-desc">
              Coordinates on-call surgical shifts and nursing team allocations locally, so personnel details stay on-site, private by design.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Surgical Suite</h2>
          <p className="module-detail__cta-desc">
            Keep every operating room moving as one. Surgeries stay coordinated, recorded, and secure.
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
