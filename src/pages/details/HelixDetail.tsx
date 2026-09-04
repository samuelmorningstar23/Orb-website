import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import HelixShowcase from '../../components/showcases/HelixShowcase'
import './ModuleDetails.css'

export default function HelixDetail() {
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
          <span className="module-detail__badge">Medication Operations</span>
          <h1 className="module-detail__title">Helix</h1>
          <p className="module-detail__tagline">
            Local pharmacy operations. Tracks pharmacy requests, verifies guidelines, and updates bedside administration records completely offline.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <HelixShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Allergy Detection</h3>
            <p className="module-detail__card-desc">
              Cross-references incoming pharmacy requests against active patient clinical records completely on-device, flagging potential allergy conflicts the instant an order is written.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Direct Validation</h3>
            <p className="module-detail__card-desc">
              Validates dosage values against built-in clinical catalogs and guidelines first, suggesting renal adjustments based on on-site lab telemetry figures.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Inventory Controls</h3>
            <p className="module-detail__card-desc">
              Keeps a live view of pharmacy stock levels, alerting dispensers when critical medications fall below designated buffer counts.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Within Your Walls</h3>
            <p className="module-detail__card-desc">
              Every interaction and dosing check runs on hardware inside your hospital. Patient data stays on-site, nothing leaves the building, and verification stays available even when the network is down.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Helix</h2>
          <p className="module-detail__cta-desc">
            Local medication tracking. Ensuring bedside drug administration safety, completely offline.
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
