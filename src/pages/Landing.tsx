import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import AgenticShowcase from '../components/AgenticShowcase'
import SafetySuite from '../components/SafetySuite'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">

        {/* Apple-Style Hero Section */}
        <section className="landing-overview__hero animate-slide-up">
          <div className="landing-overview__hero-headers">
            <span className="landing-overview__badge">Hospital OS</span>
            <h1 className="landing-overview__title">
              The Hospital<br />Operating System.
            </h1>
            <p className="landing-overview__subtitle">
              Intelligence that stays within your walls. Local-first, AI-native, hardware-accelerated.
            </p>
            <div className="landing-overview__hero-actions">
              <a href="#modules" className="landing-overview__btn-primary">
                Explore Modules
              </a>
              <button
                className="landing-overview__btn-secondary-action"
                onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}
              >
                Request Demo &nbsp;&rarr;
              </button>
            </div>
          </div>

          {/* Large Breathing Animated Orb Graphic */}
          <div className="landing-overview__orb-showcase">
            <div className="landing-overview__orb-sphere">
              <div className="landing-overview__orb-glow" />
              <svg width="240" height="240" viewBox="0 0 100 100" className="landing-overview__orb-svg">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--orb-ring-1)" strokeWidth="1" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="var(--orb-ring-2)" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="22" fill="none" stroke="var(--orb-ring-3)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="6" fill="var(--accent-gold)" className="orb-pulse-center" />
                {/* Floating Orbiting Nodes */}
                <circle cx="28" cy="28" r="2.5" fill="#00E676" />
                <circle cx="72" cy="28" r="2.5" fill="#FF5252" />
                <circle cx="50" cy="88" r="2" fill="#2997ff" />
              </svg>
            </div>
          </div>
        </section>

        {/* Agentic Execution — the v2 headline */}
        <AgenticShowcase />

        {/* Bento Grid Modules Section */}
        <section id="modules" className="landing-overview__bento-section animate-slide-up stagger-2">
          <div className="landing-overview__section-header">
            <h2 className="landing-overview__section-title">Built for busy clinical teams.</h2>
            <p className="landing-overview__section-desc">
              Orb runs entirely on-premise. It is fast, works offline, and keeps patient records secure.
            </p>
          </div>

          <div className="landing-overview__bento-grid">

            {/* Vigil Card (Large) */}
            <div className="landing-overview__bento-card bento-card--large">
              <div className="bento-card__content">
                <span className="bento-card__badge">Live Vitals Tracking</span>
                <h3 className="bento-card__title">Vigil</h3>
                <p className="bento-card__desc">
                  Monitors physiological changes and flags early signs of patient risk to help nurses react faster.
                </p>
                <Link to="/vigil" className="bento-card__link">
                  Explore Vigil &nbsp;&gt;
                </Link>
              </div>
              <div className="bento-card__visual bento-card__visual--ecg">
                <div className="mini-ecg-line" />
              </div>
            </div>

            {/* Sage Card — Ambient Clinical Copilot */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Ambient Clinical Copilot</span>
                <h3 className="bento-card__title">Sage</h3>
                <p className="bento-card__desc">
                  Understands the clinical conversation on the ward and turns it into action — drafting orders, alerting teams, and filing notes, always confirmed by a clinician.
                </p>
                <Link to="/sage" className="bento-card__link">
                  Explore Sage &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Scribe Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Voice Notes</span>
                <h3 className="bento-card__title">Scribe</h3>
                <p className="bento-card__desc">
                  Transcribe notes hands-free and instantly turn patient conversations into structured clinical summaries.
                </p>
                <Link to="/scribe" className="bento-card__link">
                  Explore Scribe &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Lens Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">On-site Diagnostics</span>
                <h3 className="bento-card__title">Lens</h3>
                <p className="bento-card__desc">
                  Review X-rays, ECGs, and scans locally to get instant diagnostic support at the bedside.
                </p>
                <Link to="/lens" className="bento-card__link">
                  Explore Lens &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Relay Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Clinician Chat Rooms</span>
                <h3 className="bento-card__title">Relay</h3>
                <p className="bento-card__desc">
                  Secure staff communication. Connects clinical teams in case-focused rooms that automatically alert staff and log decisions when patient risks change.
                </p>
                <Link to="/relay" className="bento-card__link">
                  Explore Relay &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Helix Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Medication Operations</span>
                <h3 className="bento-card__title">Helix</h3>
                <p className="bento-card__desc">
                  Local medication tracking. Manages clinical pharmacy logs, drug histories, and bedside administration records securely on-site.
                </p>
                <Link to="/helix" className="bento-card__link">
                  Explore Helix &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Surgical Suite Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Operating Room Coordinator</span>
                <h3 className="bento-card__title">Surgical Suite</h3>
                <p className="bento-card__desc">
                  Live OR schedules. Coordinates team task logs, surgical phases, and emergency alerts in real time to keep operating rooms synchronized.
                </p>
                <Link to="/surgical-suite" className="bento-card__link">
                  Explore Surgical Suite &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Pulse Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Environmental & Population Signals</span>
                <h3 className="bento-card__title">Pulse</h3>
                <p className="bento-card__desc">
                  Watches local air quality, weather, and community illness activity — and flags which patients on your wards will feel it first.
                </p>
                <Link to="/pulse" className="bento-card__link">
                  Explore Pulse &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Forecast Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Discharge & Bed Planning</span>
                <h3 className="bento-card__title">Forecast</h3>
                <p className="bento-card__desc">
                  Anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.
                </p>
                <Link to="/forecast" className="bento-card__link">
                  Explore Forecast &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Bridge Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Patient Summary Portal</span>
                <h3 className="bento-card__title">Bridge</h3>
                <p className="bento-card__desc">
                  Clear translation tools that explain complex clinical charts, timelines, and discharge plans in clear, comforting language for patients.
                </p>
                <Link to="/bridge" className="bento-card__link">
                  Explore Bridge &nbsp;&gt;
                </Link>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Scheduling & Follow-up</span>
                <h3 className="bento-card__title">Appointments</h3>
                <p className="bento-card__desc">
                  Keeps every follow-up, review, and clinic slot in order, so no patient falls through the gap between visits.
                </p>
                <Link to="/appointments" className="bento-card__link">
                  Explore Appointments &nbsp;&gt;
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Clinical Safety & Interoperability */}
        <SafetySuite />

        {/* Privacy Apple-Style Section */}
        <section className="landing-overview__privacy-section">
          <div className="landing-overview__privacy-container">
            <span className="landing-overview__privacy-badge">Built for Patient Privacy</span>
            <h2 className="landing-overview__privacy-title">
              Privacy.<br />That’s Orb.
            </h2>
            <p className="landing-overview__privacy-desc">
              Patient trust depends on data privacy. Unlike cloud-based tools that send clinical records to external APIs, Orb processes all audio, images, and text locally. Your data never leaves hospital servers, keeping you fully compliant and independent of third-party cloud vendors.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-overview__footer">
          <p>© 2026 Orb Hospital OS. All rights reserved.</p>
          <div className="landing-overview__footer-links">
            <button
              className="landing-overview__footer-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}
            >
              Request Demo
            </button>
          </div>
        </footer>

      </main>
    </div>
  )
}
