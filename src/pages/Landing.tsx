import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import ProofBand from '../components/ProofBand'
import AgenticShowcase from '../components/AgenticShowcase'
import WhyNow from '../components/WhyNow'
import SafetySuite from '../components/SafetySuite'
import TrustPosture from '../components/TrustPosture'
import './Landing.css'

const openDemo = () => window.dispatchEvent(new CustomEvent('open-demo-modal'))

const MODULE_LINKS: { to: string; label: string }[] = [
  { to: '/sage', label: 'Sage' }, { to: '/vigil', label: 'Vigil' }, { to: '/command-center', label: 'Command Center' },
  { to: '/scribe', label: 'Scribe' }, { to: '/lens', label: 'Lens' }, { to: '/relay', label: 'Relay' },
  { to: '/helix', label: 'Helix' }, { to: '/revenue-integrity', label: 'Revenue Integrity' }, { to: '/surgical-suite', label: 'Surgical Suite' },
  { to: '/pulse', label: 'Pulse' }, { to: '/forecast', label: 'Forecast' }, { to: '/surge-simulator', label: 'Surge Simulator' },
  { to: '/bridge', label: 'Bridge' }, { to: '/slate', label: 'Slate' },
]

export default function Landing() {
  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">

        {/* Hero — leads with the agentic breakthrough */}
        <section className="landing-overview__hero animate-slide-up">
          <div className="landing-overview__hero-headers">
            <span className="landing-overview__badge">Hospital OS</span>
            <h1 className="landing-overview__title">
              The Hospital<br />Operating System.
            </h1>
            <p className="landing-overview__subtitle">
              Intelligence that stays within your walls — and acts on what it sees, the moment a clinician confirms.
            </p>
            <div className="landing-overview__hero-actions">
              <button className="landing-overview__btn-primary" onClick={openDemo}>
                Request a Demo
              </button>
              <Link to="/sage" className="landing-overview__btn-secondary-action">
                See how Sage acts &nbsp;&rarr;
              </Link>
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
                <circle cx="28" cy="28" r="2.5" fill="#00E676" />
                <circle cx="72" cy="28" r="2.5" fill="#FF5252" />
                <circle cx="50" cy="88" r="2" fill="#2997ff" />
              </svg>
            </div>
          </div>
        </section>

        {/* Trust principles */}
        <ProofBand />

        {/* Agentic execution — the v2 headline */}
        <AgenticShowcase />

        {/* Why now + platform moat */}
        <WhyNow />

        {/* Modules Section */}
        <section id="modules" className="landing-overview__bento-section animate-slide-up stagger-2">
          <div className="landing-overview__section-header">
            <h2 className="landing-overview__section-title">Fourteen modules. One operating system.</h2>
            <p className="landing-overview__section-desc">
              Everything a ward, an operating room, and the back office need — one local-first platform, so the more of the hospital Orb runs, the more every confirmed action is worth.
            </p>
          </div>

          <div className="landing-overview__bento-grid">

            {/* Sage (Large — the agentic hero) */}
            <div className="landing-overview__bento-card bento-card--large">
              <svg className="bento-card__watermark" width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div className="bento-card__content">
                <span className="bento-card__badge">Ambient Clinical Copilot</span>
                <h3 className="bento-card__title">Sage</h3>
                <p className="bento-card__desc">
                  Ask it anything clinical, or let it follow the conversation on the ward. Sage understands the moment and carries out the next step — the order, the alert, the note — the instant a clinician confirms.
                </p>
                <Link to="/sage" className="bento-card__link">Explore Sage &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Vigil */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Live Vitals &amp; Early Warning</span>
                <h3 className="bento-card__title">Vigil</h3>
                <p className="bento-card__desc">Monitors physiological changes and flags early signs of patient risk, so nurses can react before a patient deteriorates.</p>
                <Link to="/vigil" className="bento-card__link">Explore Vigil &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Command Center */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">House-Wide Command Center</span>
                <h3 className="bento-card__title">Command Center</h3>
                <p className="bento-card__desc">The whole hospital on one screen — census, acuity, and the patients most likely to need you next — so you see pressure before it becomes a crisis.</p>
                <Link to="/command-center" className="bento-card__link">Explore Command Center &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Scribe */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Hands-Free Documentation</span>
                <h3 className="bento-card__title">Scribe</h3>
                <p className="bento-card__desc">Turns spoken bedside conversations into structured clinical notes and discharge summaries, hands-free.</p>
                <Link to="/scribe" className="bento-card__link">Explore Scribe &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Lens */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Bedside Image Review</span>
                <h3 className="bento-card__title">Lens</h3>
                <p className="bento-card__desc">Reviews X-rays, ECGs, and scans at the bedside and surfaces draft observations for a clinician to confirm.</p>
                <Link to="/lens" className="bento-card__link">Explore Lens &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Relay */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Secure Clinical Messaging</span>
                <h3 className="bento-card__title">Relay</h3>
                <p className="bento-card__desc">Secure, case-focused rooms that connect clinical teams and automatically flag deteriorating patients.</p>
                <Link to="/relay" className="bento-card__link">Explore Relay &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Helix */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Medication Operations</span>
                <h3 className="bento-card__title">Helix</h3>
                <p className="bento-card__desc">Tracks pharmacy operations, drug histories, and bedside administration — with allergy and interaction checks at the point of order.</p>
                <Link to="/helix" className="bento-card__link">Explore Helix &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Revenue Integrity (Large — the ROI hero) */}
            <div className="landing-overview__bento-card bento-card--large">
              <svg className="bento-card__watermark" width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1" aria-hidden="true">
                <path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" />
              </svg>
              <div className="bento-card__content">
                <span className="bento-card__badge">Revenue Integrity</span>
                <h3 className="bento-card__title">Revenue Integrity</h3>
                <p className="bento-card__desc">
                  Catches the coding and documentation gaps that quietly cost hospitals millions — turning the care you already deliver into the reimbursement you’re owed. Every suggestion is left to your coders to review.
                </p>
                <Link to="/revenue-integrity" className="bento-card__link">Explore Revenue Integrity &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Surgical Suite */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Operating-Room Coordination</span>
                <h3 className="bento-card__title">Surgical Suite</h3>
                <p className="bento-card__desc">Live theatre schedules, safety checklists, and emergency alerts that keep operating rooms coordinated.</p>
                <Link to="/surgical-suite" className="bento-card__link">Explore Surgical Suite &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Pulse */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Environmental &amp; Population Signals</span>
                <h3 className="bento-card__title">Pulse</h3>
                <p className="bento-card__desc">Watches local air quality, weather, and community illness — and flags which patients on your wards will feel it first.</p>
                <Link to="/pulse" className="bento-card__link">Explore Pulse &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Forecast */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Predictive Capacity Planning</span>
                <h3 className="bento-card__title">Forecast</h3>
                <p className="bento-card__desc">Anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.</p>
                <Link to="/forecast" className="bento-card__link">Explore Forecast &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Surge Simulator */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Capacity &amp; Surge Planning</span>
                <h3 className="bento-card__title">Surge Simulator</h3>
                <p className="bento-card__desc">Model a surge, a closure, or a staffing gap before it happens — and see hours-to-overflow while there’s still time to act.</p>
                <Link to="/surge-simulator" className="bento-card__link">Explore Surge Simulator &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Bridge */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Patient Understanding</span>
                <h3 className="bento-card__title">Bridge</h3>
                <p className="bento-card__desc">Explains care, medications, and next steps in plain, reassuring language for patients and families.</p>
                <Link to="/bridge" className="bento-card__link">Explore Bridge &nbsp;&gt;</Link>
              </div>
            </div>

            {/* Slate */}
            <div className="landing-overview__bento-card">
              <div className="bento-card__content">
                <span className="bento-card__badge">Scheduling &amp; Follow-up</span>
                <h3 className="bento-card__title">Slate</h3>
                <p className="bento-card__desc">Keeps every follow-up, review, and clinic slot in order, so no patient falls through the gap between visits.</p>
                <Link to="/slate" className="bento-card__link">Explore Slate &nbsp;&gt;</Link>
              </div>
            </div>

          </div>
        </section>

        {/* Clinical safety */}
        <SafetySuite />

        {/* Hospital-buyer answers */}
        <TrustPosture />

        {/* Privacy */}
        <section className="landing-overview__privacy-section">
          <div className="landing-overview__privacy-container">
            <span className="landing-overview__privacy-badge">Built for Patient Privacy</span>
            <h2 className="landing-overview__privacy-title">
              Private by<br />architecture.
            </h2>
            <p className="landing-overview__privacy-desc">
              Unlike cloud tools that send clinical records to outside services, Orb processes all audio, images, and text on hardware inside your hospital. Patient data never leaves your walls — no external egress, no third-party cloud vendor in the loop.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-overview__footer">
          <div className="landing-overview__footer-top">
            <div className="landing-overview__footer-brand">
              <span className="landing-overview__footer-wordmark">Orb</span>
              <p className="landing-overview__footer-tagline">The local-first, AI-native operating system for the modern hospital.</p>
              <button className="landing-overview__footer-cta" onClick={openDemo}>Request a Demo</button>
            </div>

            <nav className="landing-overview__footer-cols">
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Modules</span>
                {MODULE_LINKS.slice(0, 7).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">&nbsp;</span>
                {MODULE_LINKS.slice(7).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Company</span>
                <a href="#modules" className="landing-overview__footer-link">Overview</a>
                <Link to="/plans" className="landing-overview__footer-link">Plans</Link>
                <Link to="/support" className="landing-overview__footer-link">Support</Link>
                <button className="landing-overview__footer-linkbtn" onClick={openDemo}>Request a demo</button>
                <a href="mailto:support@orbintelligence.co" className="landing-overview__footer-link">Contact</a>
              </div>
            </nav>
          </div>

          <div className="landing-overview__footer-bottom">
            <p>© 2026 Orb. All rights reserved.</p>
            <p className="landing-overview__footer-fineprint">Interactive figures shown are illustrative.</p>
          </div>
        </footer>

      </main>
    </div>
  )
}
