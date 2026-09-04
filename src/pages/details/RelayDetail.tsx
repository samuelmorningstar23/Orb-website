import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import RelayShowcase from '../../components/showcases/RelayShowcase'
import './ModuleDetails.css'

export default function RelayDetail() {
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
          <span className="module-detail__badge">Secure Clinical Messaging</span>
          <h1 className="module-detail__title">Relay</h1>
          <p className="module-detail__tagline">
            Secure clinical messaging built for clinical teams. Instantly channels hospital telemetry warnings, streamlines case reviews, and archives clinical agreements, where Orb notices what matters, and offers to act.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <RelayShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Local Data Sovereignty</h3>
            <p className="module-detail__card-desc">
              Every message stays within your walls, kept on hardware inside your hospital. Nothing is ever routed through the cloud or handed to an outside relay.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Vigil Smart Triggers</h3>
            <p className="module-detail__card-desc">
              Connects with patient telemetry logic directly. Receives warnings from patient monitors and routes them to active clinical teams automatically.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Audit Logging</h3>
            <p className="module-detail__card-desc">
              Clinical changes and instructions discussed inside rooms are captured, clinician-confirmed, and logged into a strict, tamper-evident audit trail of critical patient actions.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Zero ISP Dependency</h3>
            <p className="module-detail__card-desc">
              Since communication runs entirely on the hospital intranet network, Relay continues operating on your hospital network during commercial internet or ISP outages.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Relay</h2>
          <p className="module-detail__cta-desc">
            Secure clinical team coordination. Linking clinical judgment and alerts, locally and instantly.
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
