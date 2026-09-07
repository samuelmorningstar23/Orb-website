import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SafetySuite from '../components/SafetySuite'
import TrustPosture from '../components/TrustPosture'
import FlowCapture from '../components/captures/FlowCapture'
import Widget from '../components/widget/Widget'
import { WIDGET_FLOWS } from '../data/widgetFlows'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { openDemoModal } from '../data/siteContent'
import './details/ModuleDetails.css'
import './Security.css'

/**
 * The security brief - written for the CISO and procurement reader. Everything
 * here is ported from claims the homepage used to make; nothing is new.
 */
const FACTS = [
  {
    title: 'Where it runs',
    body: 'On an appliance inside the hospital, on hardware you control. The database, the models and the audit log are all on it.',
  },
  {
    title: 'What leaves the building',
    body: 'Nothing clinical. Audio, images and text are processed on the appliance by models that live there; there is no cloud model and no AI vendor in the loop. The one outbound call is Pulse, which sends a map coordinate to public weather, air-quality, flu and drug-recall feeds. It carries no patient data, every call is logged, and the firewall can block it with no loss of clinical function.',
  },
  {
    title: 'When the network drops',
    body: 'Care continues. Orb needs no internet connection to run. A printable downtime pack per patient is kept fresh on the appliance and covers the hour the appliance itself is down; the Command Center shows how many packs are current.',
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
          <h1 className="module-detail__title">What leaves the building: nothing.</h1>
          <p className="module-detail__tagline">
            Everything Orb does happens on an appliance inside the hospital. This page is the version of that claim your security and procurement teams can check, with the admin screens it is checked on.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <Widget flows={WIDGET_FLOWS['/security']} label="Showing your work" />
          <p className="module-detail__capture-note">Trust Center, Flight Recorder and Model Governance, as an animation of the admin screens.</p>
        </section>

        <section className="module-detail__showcase">
          <FlowCapture flows={['show-your-work']} label="The admin screens, captured from the product" />
          <p className="module-detail__capture-note">The screens themselves, captured from a running appliance, including the Pilot Scorecard.</p>
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
            Every model answer, every refusal and every confirmed action is written to an audit log sealed by a SHA-256 hash chain, so a reviewer can see what was proposed, who confirmed it and when, and whether any row was altered since. The Flight Recorder in the admin screens is that log. Role-based access is part of the same record, and an administrator sign-in requires a second factor.
          </p>
        </Reveal>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Talk to us about your environment.</h2>
          <p className="module-detail__cta-desc">
            We walk your security team through the appliance, the data flow and the access controls on a call, with the admin screens open.
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
