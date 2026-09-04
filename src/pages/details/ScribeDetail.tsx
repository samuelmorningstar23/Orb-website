import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import ScribeShowcase from '../../components/showcases/ScribeShowcase'
import './ModuleDetails.css'

export default function ScribeDetail() {
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
          <span className="module-detail__badge">Hands-Free Documentation</span>
          <h1 className="module-detail__title">Scribe</h1>
          <p className="module-detail__tagline">
            Fast clinical dictation. Turn spoken doctor-patient conversations into structured clinical notes and discharge summaries in seconds.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <ScribeShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Real-Time, On Device</h3>
            <p className="module-detail__card-desc">
              Captured on-device the moment it is spoken and turned into a structured clinical note in seconds. No waiting, no uploads.
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
            <h3 className="module-detail__card-title">Clinical Formatting</h3>
            <p className="module-detail__card-desc">
              Every dictation is organized into the structured formats your teams already use: clinical notes, handovers, and discharge summaries, ready to drop straight into the record.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clean, Confident Text</h3>
            <p className="module-detail__card-desc">
              Names, numbers, and dosages come out clean and correctly formatted, with the hesitations and false starts of natural speech quietly removed.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Private by design, on-site.</h3>
            <p className="module-detail__card-desc">
              Patient conversations stay inside your hospital's walls: no cloud egress. Scribe works on-site, so what's spoken in the room stays in the room.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Scribe</h2>
          <p className="module-detail__cta-desc">
            Hands-free dictation. Documenting patient interactions, locally and securely.
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
