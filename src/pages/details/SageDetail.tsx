import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import SageShowcase from '../../components/showcases/SageShowcase'
import './ModuleDetails.css'

export default function SageDetail() {
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
          <span className="module-detail__badge">Ambient Clinical Copilot</span>
          <h1 className="module-detail__title">Sage</h1>
          <p className="module-detail__tagline">
            Ask it anything clinical — or let it follow the conversation on the ward and turn intent into action, with a clinician’s confirmation on every step.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <SageShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h3 className="module-detail__card-title">Ask Anything, Clinically</h3>
            <p className="module-detail__card-desc">Put a clinical question to Sage and get a clear, referenced answer in seconds — grounded in your hospital’s approved guidance, for your review.</p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.5" /><path d="M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
            </div>
            <h3 className="module-detail__card-title">Understands the Moment</h3>
            <p className="module-detail__card-desc">Follows the clinical conversation on the ward and recognises what needs to happen next — without anyone stopping to type.</p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <h3 className="module-detail__card-title">Acts Only on Confirmation</h3>
            <p className="module-detail__card-desc">Prepares the order, the alert, or the note — and carries it out the instant a clinician confirms. Never before, never on its own.</p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M6 21V7l6-4 6 4v14" /><path d="M10 21v-6h4v6" /></svg>
            </div>
            <h3 className="module-detail__card-title">Grounded &amp; On-Site</h3>
            <p className="module-detail__card-desc">Draws only on your hospital’s approved references, and runs entirely within your walls.</p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Sage</h2>
          <p className="module-detail__cta-desc">From a question, or a conversation, to confirmed care.</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

    </div>
  )
}
