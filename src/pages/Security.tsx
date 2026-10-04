import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SafetySuite from '../components/SafetySuite'
import TrustPosture from '../components/TrustPosture'
import ScreenGallery from '../components/captures/ScreenGallery'
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
    body: 'On one appliance inside your hospital, on hardware you control. The database, the models and the audit log are all on it.',
  },
  {
    title: 'What leaves the building',
    body: 'Nothing clinical. Audio, images and text are processed on the appliance by models that live there. There is no cloud model and no AI vendor in the loop. The one outbound call is Pulse, which sends a map coordinate to public weather, air-quality, flu and drug-recall feeds. It carries no patient, every call is logged, and the firewall can block it with no loss of clinical function.',
  },
  {
    title: 'When the network drops',
    body: 'Care continues. Orb needs no internet connection to run. A printable downtime pack per patient is kept fresh on the appliance for the hour the appliance itself is down, and the Command Center shows how many packs are current.',
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
          Back to the overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Security brief</span>
          <h1 className="module-detail__title">Nothing leaves the building.</h1>
          <p className="module-detail__tagline">
            Everything Orb does happens on one appliance inside your hospital. Here is that claim as your security and procurement teams can check it, screen by screen.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <Widget flows={WIDGET_FLOWS['/security']} label="Showing your work" />
          <p className="module-detail__capture-note">Trust Center, Flight Recorder and Model Governance, animated from the admin screens.</p>
        </section>

        <section className="module-detail__showcase">
          {/* The evaluation scorecard capture is held back until it is retaken:
              the picture on file is titled over a six-ward run Orb has not had. */}
          <ScreenGallery
            label="The admin screens"
            shots={[
              { name: 'admin-trust', label: 'Trust Center', caption: 'Compliance posture, aggregated from the running system. Amber is amber, and an all-green screen deserves a harder look.' },
              { name: 'admin-flight', label: 'Flight Recorder', caption: 'A SHA-256 hash chain over every audit row, with its verification state on the page.' },
              { name: 'admin-models', label: 'Model Governance', caption: 'Every model with its version and validation state, including the one that says untrained.' },
            ]}
          />
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
          <h2 className="security-page__audit-title">What Orb writes down</h2>
          <p className="security-page__audit-body">
            Every model answer, every refusal and every confirmed action is written to an audit log sealed by a SHA-256 hash chain. A reviewer can see what was proposed, who confirmed it and when, and whether any row has been altered since. The Flight Recorder in the admin screens is that log. Role-based access is part of the same record, and a second factor is available for administrator sign-in.
          </p>
        </Reveal>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Bring your security team.</h2>
          <p className="module-detail__cta-desc">
            We walk them through the appliance, the data flow and the access controls on a call, with the admin screens open.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/support" className="module-detail__btn-secondary">Ask a question &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
