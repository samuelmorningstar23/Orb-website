import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import '../details/ModuleDetails.css'
import './CompanyPages.css'

// The data boundary, stated precisely. Every row must stay true of the
// shipped product — if a module changes what crosses the network, this
// table changes in the same release.
const BOUNDARY_ROWS = [
  {
    data: 'Patient records, notes, images, audio',
    where: 'Processed on hospital hardware, on-site',
    crosses: 'never-leaves',
  },
  {
    data: 'AI inference',
    where: 'Runs locally — no cloud AI APIs in the loop',
    crosses: 'never-leaves',
  },
  {
    data: 'Environmental & public-health feeds (weather, air quality, community illness)',
    where: 'Pulled inbound through an allowlist your IT team controls',
    crosses: 'Inbound only — no patient data attached',
  },
  {
    data: 'Appointment reminders',
    where: 'Composed on-site',
    crosses: 'Sent through the SMS/email gateway your hospital already operates',
  },
  {
    data: 'Software updates',
    where: 'Signed builds, applied on your schedule',
    crosses: 'Inbound only — no patient data attached',
  },
]

const BUILT_TODAY = [
  {
    title: 'On-premise processing',
    desc: 'All clinical AI runs on hardware inside your building. There is no cloud tier, no vendor VPC, and no third-party model API between Orb and your data.',
  },
  {
    title: 'Clinician-confirm gate',
    desc: 'Orb proposes; a clinician disposes. Every consequential action requires an explicit human confirmation before it executes.',
  },
  {
    title: 'Role-based access control',
    desc: 'Access follows clinical roles and responsibilities, so people see what their job requires and nothing more.',
  },
  {
    title: 'Tamper-evident audit trail',
    desc: 'Every proposal, confirmation, and action is recorded to an append-only, tamper-evident log your governance team can inspect.',
  },
  {
    title: 'Offline resilience',
    desc: 'Orb keeps working through network and upstream outages. External feeds degrade to their last-known state; clinical functions continue on-site.',
  },
  {
    title: 'A boundary you can verify',
    desc: 'Because Orb runs inside your network, your own monitoring sees exactly what crosses the perimeter — the egress story is auditable, not a promise.',
  },
]

const UNDER_THE_HOOD = [
  {
    title: 'On-site inference',
    desc: 'Orb’s models run on compact, energy-efficient AI hardware that lives in your building — not in a cloud region. Latency stays clinical-grade and data stays home.',
  },
  {
    title: 'Standards-based integration',
    desc: 'Orb speaks the standards your systems already use — HL7 and FHIR among them — running alongside your record of truth, not replacing it.',
  },
  {
    title: 'Deeper detail, under NDA',
    desc: 'Architecture, deployment topology, and model documentation are shared with your technical team during evaluation.',
  },
]

// ── OWNER: keep these statuses truthful and current. Move items to their
// real state as certification work progresses; never mark anything achieved
// before the certificate is in hand.
const CERTS = [
  { name: 'ISO/IEC 27001', detail: 'Information security management', status: 'In preparation' },
  { name: 'Cyber Essentials', detail: 'Baseline security controls (UK)', status: 'In preparation' },
  { name: 'DTAC alignment', detail: 'NHS Digital Technology Assessment Criteria', status: 'In preparation' },
  { name: 'DCB 0129', detail: 'Clinical risk management documentation', status: 'In preparation' },
  { name: 'Regional frameworks', detail: 'HIPAA, GDPR, DPDP — as deployments require', status: 'Ongoing' },
]

export default function SecurityPage() {
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
          <span className="module-detail__badge">Security &amp; Trust</span>
          <h1 className="module-detail__title">The data boundary,<br />precisely.</h1>
          <p className="module-detail__tagline">
            Security teams don&rsquo;t want adjectives — they want to know exactly what runs where and
            what crosses the network. Here it is.
          </p>
        </section>

        <section className="animate-slide-up stagger-1" aria-label="Data boundary">
          <div className="boundary-table-wrap">
            <table className="boundary-table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Where it lives</th>
                  <th scope="col">What crosses the network</th>
                </tr>
              </thead>
              <tbody>
                {BOUNDARY_ROWS.map((row) => (
                  <tr key={row.data}>
                    <td>{row.data}</td>
                    <td>{row.where}</td>
                    <td>
                      {row.crosses === 'never-leaves'
                        ? <span className="boundary-table__stays">Never leaves the building</span>
                        : row.crosses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="company-section animate-slide-up stagger-2">
          <h2 className="company-section__title">Built into the product today</h2>
          <p className="company-section__lede">
            These aren&rsquo;t roadmap items — they are how Orb is architected.
          </p>
          <div className="module-detail__grid">
            {BUILT_TODAY.map((item) => (
              <div className="module-detail__card" key={item.title}>
                <h3 className="module-detail__card-title">{item.title}</h3>
                <p className="module-detail__card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="company-section animate-slide-up stagger-3">
          <h2 className="company-section__title">Under the hood, briefly</h2>
          <p className="company-section__lede">
            We keep deep technical detail for evaluation conversations — but the shape of the system
            is simple to state.
          </p>
          <div className="module-detail__grid">
            {UNDER_THE_HOOD.map((item) => (
              <div className="module-detail__card" key={item.title}>
                <h3 className="module-detail__card-title">{item.title}</h3>
                <p className="module-detail__card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="company-section animate-slide-up stagger-4" aria-label="Certifications">
          <h2 className="company-section__title">Certifications &amp; assessments</h2>
          <p className="company-section__lede">
            Certification work is underway. We publish status here as it progresses — honestly, and
            never before it lands.
          </p>
          <div className="cert-list">
            {CERTS.map((c) => (
              <div className="cert-row" key={c.name}>
                <div>
                  <div className="cert-row__name">{c.name}</div>
                  <div className="cert-row__detail">{c.detail}</div>
                </div>
                <span className="cert-row__status">{c.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="company-section company-prose">
          <h2>A note on regulatory status</h2>
          <p>
            Orb&rsquo;s modules support clinical work under clinician confirmation. Regulatory
            classification differs by module and by market, and we treat that seriously: detailed
            intended-use statements and our regulatory roadmap are shared with your clinical safety
            and governance teams during evaluation. See also our{' '}
            <Link to="/privacy">website privacy policy</Link>.
          </p>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Put your security team in the room.</h2>
          <p className="module-detail__cta-desc">
            Bring your CISO, IG lead, or clinical safety officer — we&rsquo;d rather answer the hard
            questions early.
          </p>
          <div className="module-detail__buttons">
            <button
              className="module-detail__btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}
            >
              Request a Walkthrough
            </button>
            <a href="mailto:support@orbintelligence.co" className="module-detail__btn-secondary">
              support@orbintelligence.co &rarr;
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
