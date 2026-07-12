import './TrustPosture.css'

type TrustColumn = {
  title: string
  desc: string
  icon: React.ReactNode
}

const columns: TrustColumn[] = [
  {
    title: 'Security & sovereignty',
    desc: 'All processing runs on hardware you control. No cloud egress of patient data. Role-based access and a tamper-evident audit trail are built in, not bolted on.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Fits your stack',
    desc: 'Orb runs alongside the systems you already have, exchanging information through the standards they already speak. It complements your record of truth — it is not a rip-and-replace.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: 'Deployment & continuity',
    desc: 'Installed on-premise, it operates on-site without a network connection and keeps caring through upstream outages — so care continues even when the network drops.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="8" rx="2" />
        <rect x="2" y="13" width="20" height="8" rx="2" />
        <path d="M6 7h.01" />
        <path d="M6 17h.01" />
      </svg>
    ),
  },
]

export default function TrustPosture() {
  return (
    <section className="trust-posture">
      <div className="trust-posture__header">
        <span className="trust-posture__badge">For hospitals</span>
        <h2 className="trust-posture__title">Answers your security team will actually accept.</h2>
      </div>

      <div className="trust-posture__grid">
        {columns.map((column) => (
          <div className="trust-posture__card" key={column.title}>
            <div className="trust-posture__card-icon">{column.icon}</div>
            <h3 className="trust-posture__card-title">{column.title}</h3>
            <p className="trust-posture__card-desc">{column.desc}</p>
          </div>
        ))}
      </div>

      <p className="trust-posture__note">
        Designed to support the technical safeguards HIPAA and GDPR require. Orb strengthens your
        compliance posture — it is not a substitute for your own certification.
      </p>
    </section>
  )
}
