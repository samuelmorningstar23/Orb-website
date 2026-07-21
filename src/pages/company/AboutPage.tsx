import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import '../details/ModuleDetails.css'
import './CompanyPages.css'

// ── OWNER: bios below are deliberately minimal — only what has been stated
// publicly. Replace with fuller bios, photos (drop into src/assets/team/ and
// swap the initial-avatars), and LinkedIn links when ready. Do not let this
// page drift into claims that can't be verified.
const FOUNDERS = [
  {
    initials: 'SC',
    name: 'Samuel Christ',
    role: 'Founder',
    bio: 'IIT Madras. Leads product and engineering — the local-first architecture that keeps Orb inside the hospital’s walls.',
  },
  {
    initials: 'AV',
    name: 'Dr. Ashritha Vedagiri',
    role: 'Co-founder · Clinical',
    bio: 'The clinician in the room. Every workflow Orb ships is shaped and challenged against the reality of the ward before it reaches one.',
  },
  {
    initials: 'HA',
    name: 'Hemkumar Amasa',
    role: 'Co-founder',
    bio: 'Building Orb from day one.',
  },
]

export default function AboutPage() {
  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main id="main" className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">About</span>
          <h1 className="module-detail__title">Built where care<br />actually happens.</h1>
          <p className="module-detail__tagline">
            Orb is a small founding team pairing engineering with clinical judgement from day one —
            because hospital software fails when it is imagined far from the ward.
          </p>
        </section>

        <section className="company-founders animate-slide-up stagger-1" aria-label="Founding team">
          {FOUNDERS.map((f) => (
            <div className="company-founder" key={f.name}>
              <div className="company-founder__avatar" aria-hidden="true">{f.initials}</div>
              <h2 className="company-founder__name">{f.name}</h2>
              <p className="company-founder__role">{f.role}</p>
              <p className="company-founder__bio">{f.bio}</p>
            </div>
          ))}
        </section>

        <section className="company-section company-prose animate-slide-up stagger-2">
          <h2>Why we&rsquo;re building this</h2>
          <p>
            The people delivering care are drowning in clicks, screens, and documentation — while the
            tools meant to help them ship patient data to clouds on the other side of the world. We
            think both of those are solvable, and that they are the same problem: intelligence should
            live where care happens.
          </p>
          <p>
            So Orb runs on hardware inside the hospital. It reads the moment, drafts the next step,
            and acts only when a clinician confirms. Same data the hospital already has — better
            decisions from it.
          </p>

          <h2>Where we are</h2>
          <p>
            Orb is early, and this site says so honestly: the product demos are simulated, the
            certifications are <Link to="/security">in progress</Link>, and the proof section of our
            landing page stays empty until there is real proof to put in it. If you run a hospital
            and want to shape what Orb becomes, we would genuinely love to talk —{' '}
            <a href="mailto:support@orbintelligence.co">support@orbintelligence.co</a>.
          </p>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Talk to the founders.</h2>
          <p className="module-detail__cta-desc">
            No sales team, no qualification call — a walkthrough with the people building it.
          </p>
          <div className="module-detail__buttons">
            <button
              className="module-detail__btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}
            >
              Request a Demo
            </button>
            <a href="mailto:support@orbintelligence.co" className="module-detail__btn-secondary">
              Email us &rarr;
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
