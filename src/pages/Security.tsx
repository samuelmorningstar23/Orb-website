import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SafetySuite from '../components/SafetySuite'
import TrustPosture from '../components/TrustPosture'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { openDemoModal } from '../data/siteContent'
import './details/ModuleDetails.css'
import './Security.css'

/**
 * The security brief — written for the CISO and procurement reader. Everything
 * here is ported from claims the homepage used to make; nothing is new.
 */
const FACTS = [
  {
    title: 'Where it runs',
    body: 'On-premise, on hardware you control. All processing happens inside the hospital.',
  },
  {
    title: 'What leaves the building',
    body: 'Nothing clinical. Audio, images, and text are processed on-site — no cloud egress of patient data, no third-party vendor in the loop.',
  },
  {
    title: 'When the network drops',
    body: 'Care continues. Orb operates without an upstream connection and keeps working through outages.',
  },
]

export default function Security() {
  return (
    <div className="module-detail security-page">
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
          <span className="module-detail__badge">Security brief</span>
          <h1 className="module-detail__title">Private by architecture.</h1>
          <p className="module-detail__tagline">
            Everything Orb does happens on hardware inside your hospital. This page is the version of that claim your security and procurement teams can check.
          </p>
        </section>

        <Stagger className="security-page__facts" as="section" amount={0.3}>
          {FACTS.map(f => (
            <StaggerItem className="security-page__fact" key={f.title}>
              <h3 className="security-page__fact-title">{f.title}</h3>
              <p className="security-page__fact-body">{f.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <SafetySuite />
        <TrustPosture />

        <Reveal as="section" className="security-page__audit" amount={0.4}>
          <h2 className="security-page__audit-title">What Orb records</h2>
          <p className="security-page__audit-body">
            Every recommendation and every confirmed action is written to a tamper-evident audit trail, so a reviewer can see what was proposed, who confirmed it, and when. Role-based access is built in, not bolted on. Nothing acts without a human&rsquo;s yes.
          </p>
        </Reveal>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Talk to us about your environment.</h2>
          <p className="module-detail__cta-desc">
            We will walk your security team through deployment, data flow, and access controls on a call.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/support" className="module-detail__btn-secondary">Ask a question &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
