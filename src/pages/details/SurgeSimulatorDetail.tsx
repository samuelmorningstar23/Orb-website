import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import SurgeSimulatorShowcase from '../../components/showcases/SurgeSimulatorShowcase'
import './ModuleDetails.css'

export default function SurgeSimulatorDetail() {
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
          <span className="module-detail__badge">Capacity &amp; Surge Planning</span>
          <h1 className="module-detail__title">Surge Simulator</h1>
          <p className="module-detail__tagline">
            Ask &lsquo;what if&rsquo; before it happens. Model a surge, a ward closure, or a staffing gap and see
            hours-to-overflow and the beds you&rsquo;ll need, while there&rsquo;s still time to act.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <SurgeSimulatorShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 1 0 9 9" />
                <path d="M12 3v9l6 3" />
                <path d="M16 3l5 2-2 5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">What-If Modeling</h3>
            <p className="module-detail__card-desc">
              Test surges, closures and staffing changes on a model of your hospital, never on the ward. Try the bad day
              as many times as you like, without ever touching the live floor.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2.5 1.5" />
                <path d="M9 2h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Hours to Overflow</h3>
            <p className="module-detail__card-desc">
              Know how long until capacity breaks under each scenario: a countdown you can watch, so you act while there
              are still hours on the clock, not minutes.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Staffing Gaps, Early</h3>
            <p className="module-detail__card-desc">
              See the nurse and bed shortfall before the shift, not during it, with enough lead time to move people,
              open capacity, or call in cover calmly.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 14l2.5 2.5L16 11" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Plan on Your Terms</h3>
            <p className="module-detail__card-desc">
              Runs on-site, in seconds, whenever you need to think ahead. Every scenario stays inside your walls, ready
              the moment a question comes up in the huddle.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Surge Simulator</h2>
          <p className="module-detail__cta-desc">
            Rehearse the bad day before it arrives.
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
