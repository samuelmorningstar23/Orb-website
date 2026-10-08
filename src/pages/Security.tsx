import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SafetySuite from '../components/SafetySuite'
import TrustPosture from '../components/TrustPosture'
import ScreenGallery from '../components/captures/ScreenGallery'
import SiteFooter from '../components/SiteFooter'
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
const CONTROLS = [
  { title: 'Who can sign in', body: 'Staff sign in with an ID and a password, each role sees only its own screens, and doctors, nurses and ward clerks see only their own department’s patients. Any role can be set to need a code from an authenticator app too, and a ward tablet can be bound so a nurse unlocks it with a PIN mid-shift.' },
  { title: 'Accounts on one screen', body: 'An administrator creates accounts, changes roles, resets passwords and switches accounts off, each change written to the audit log.' },
  { title: 'Encrypted on disk', body: 'The database is encrypted on the computer’s disk with the key set at installation, and the Trust Center shows whether it is.' },
  { title: 'Backups you can see', body: 'An administrator takes a backup from the Data screen and sees every one listed, with its size and time. A restore is done with Orb stopped, never from a button.' },
  { title: 'Erasure requests', body: 'A patient’s request to erase their data is recorded, each kind of record is checked against what the hospital must keep by law, and nothing is erased until someone confirms it as a separate step.' },
  { title: 'The log is a screen', body: 'Filter the audit log by patient, kind, action or outcome, follow one request from start to end, and see every refused or failed action in one place.' },
]

const FACTS = [
  {
    title: 'Where it runs',
    body: 'On one computer inside your hospital, on hardware you control. The database, the models and the audit log are all on it.',
  },
  {
    title: 'What leaves the building',
    body: 'Nothing. Audio, images and text are processed on the computer by models that live there. There is no cloud model, no AI vendor and no outbound call of any kind. Pulse reads a seasonal calendar built into Orb, not a weather service.',
  },
  {
    title: 'When the network drops',
    body: 'Care continues. Orb needs no internet connection to run. A printable downtime pack per patient is refreshed on the computer for the ward to print on its schedule, and the Command Center shows how many packs are current.',
  },
  {
    title: 'Beside your hospital system',
    body: 'The ward’s record lives on Orb’s own database inside your hospital and exports as a standard file (FHIR). Observations and results can be sent in over HL7 or FHIR on your own network, with a key your IT holds. Orb has no connector to your hospital system and sends nothing to ABDM.',
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
            Everything Orb does happens on one computer inside your hospital. Below is how the person who looks after your IT can check that, screen by screen.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <Widget flows={WIDGET_FLOWS['/security']} label="Showing your work" />
          <p className="module-detail__capture-note">Trust Center, Flight Recorder and Model Governance, animated from the admin screens.</p>
        </section>

        <section className="module-detail__showcase">
          {/* Two captures are held back until they are retaken. The evaluation
              scorecard is titled over a six-ward run Orb has not had, and the
              Model Governance table describes two models in words the site does
              not use. The admin captures that remain are cropped below the tab
              strip, which names a scorecard the site does not claim; the Trust
              Center also loses the product's intro paragraph above its card, and
              both end above the floating control at the foot of the page. */}
          <ScreenGallery
            label="The admin screens"
            shots={[
              { name: 'admin-trust', label: 'Trust Center', caption: 'Compliance posture, built from the running system each time the page opens. Nine controls passing, five warnings, none failing on this build.' },
              { name: 'admin-flight', label: 'Flight Recorder', caption: 'A SHA-256 hash chain over every audit entry, with its verification state on the page.' },
              { name: 'admin-audit', label: 'Audit log', caption: 'The audit log as a screen: every event with its category, outcome and actor, filtered by patient or by request.' },
              { name: 'admin-data', label: 'Data and backups', caption: 'Backups listed with their size and time, and a patient’s erasure request, which erases nothing until it is confirmed separately.' },
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

        <section className="security-page__controls" aria-labelledby="controls-title">
          <Reveal className="security-page__controls-head">
            <span className="module-detail__badge">For your IT person</span>
            <h2 className="security-page__audit-title" id="controls-title">Six controls to check.</h2>
          </Reveal>
          <Stagger className="security-page__facts" as="div" amount={0.2}>
            {CONTROLS.map(c => (
              <StaggerItem className="security-page__fact" key={c.title}>
                <h3 className="security-page__fact-title">{c.title}</h3>
                <p className="security-page__fact-body">{c.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <SafetySuite />
        <TrustPosture />

        <Reveal as="section" className="security-page__audit" amount={0.4}>
          <h2 className="security-page__audit-title">What Orb writes down.</h2>
          <p className="security-page__audit-body">
            Model answers, refusals and confirmed actions all go into the audit log, which is hash-chained with SHA-256.
          </p>
          <p className="security-page__audit-detail">
            A reviewer can see what was proposed, who confirmed it and when, and whether any row has been altered since. The Flight Recorder in the admin screens is that log.
          </p>
        </Reveal>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Bring whoever runs your IT.</h2>
          <p className="module-detail__cta-desc">
            I walk them through the computer, the data flow and the access controls on a call, with the admin screens open.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/support" className="module-detail__btn-secondary">Ask a question &nbsp;&rarr;</Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
