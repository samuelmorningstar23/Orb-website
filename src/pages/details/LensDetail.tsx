import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import LensShowcase from '../../components/showcases/LensShowcase'
import './ModuleDetails.css'

export default function LensDetail() {
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
          <span className="module-detail__badge">Bedside Image Review</span>
          <h1 className="module-detail__title">Lens</h1>
          <p className="module-detail__tagline">
            Bedside image analysis. Review chest X-rays, ECG traces, and scans on-device to surface draft observations for clinician review — in seconds, at the bedside.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <LensShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="22" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="12" x2="2" y2="12"/>
                <line x1="12" y1="6" x2="12" y2="2"/>
                <line x1="12" y1="22" x2="12" y2="18"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Device Image Intelligence</h3>
            <p className="module-detail__card-desc">
              On-device image intelligence reviews clinical images — chest X-rays, ECG traces, and scans — on hardware inside your hospital, in real time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Anatomical Isolation</h3>
            <p className="module-detail__card-desc">
              Highlights regions of interest directly on X-rays and ECG traces, so clinicians can verify each flagged area at a glance.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Structured Draft Notes</h3>
            <p className="module-detail__card-desc">
              Organizes draft observations into familiar Observations, Impression, and next-step sections — ready for a radiologist or physician to confirm, edit, or sign off.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Site by Default</h3>
            <p className="module-detail__card-desc">
              Medical images and the observations drawn from them never leave the building. Everything stays on hardware inside your hospital — nothing is sent to the cloud.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Lens</h2>
          <p className="module-detail__cta-desc">
            On-device image analysis. Surfacing draft observations for clinician review — offline, on-site, and secure.
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
