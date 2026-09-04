import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import VigilShowcase from '../../components/showcases/VigilShowcase'
import './ModuleDetails.css'

export default function VigilDetail() {
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
          <span className="module-detail__badge">Live Vitals &amp; Early Warning</span>
          <h1 className="module-detail__title">Vigil</h1>
          <p className="module-detail__tagline">
            Tracks vital signs in real time and highlights early changes in patient risk, helping clinicians prevent critical events.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <VigilShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Real-Time Awareness</h3>
            <p className="module-detail__card-desc">
              Maintains a live, on-device connection to bedside monitors, reflecting every change in a patient's vital signs the instant it happens — with nothing leaving your walls.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 14 4-4"/>
                <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Risk Scoring</h3>
            <p className="module-detail__card-desc">
              Continuously reads each patient's physiological trend and translates it into a clear early-warning score, surfacing the shift from stable to high-risk the moment it begins.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinical Triage Synthesis</h3>
            <p className="module-detail__card-desc">
              Draws on on-device clinical intelligence to weigh physiological data against a patient's own trend, producing clear, human-readable assessments and next-step recommendations.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Premises Privacy</h3>
            <p className="module-detail__card-desc">
              Since all assessment calculations occur entirely inside the local server rack, patient monitoring stays inside your walls, away from the cloud.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Vigil</h2>
          <p className="module-detail__cta-desc">
            Continuous vigilance. Protecting patient care, locally and securely.
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
