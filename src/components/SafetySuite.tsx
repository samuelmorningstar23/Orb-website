import './SafetySuite.css'

type SafetyItem = {
  title: string
  desc: string
  icon: React.ReactNode
}

const items: SafetyItem[] = [
  {
    title: 'Medication safety',
    desc: 'The allergy block and the dose check run on order sets and at the bedside, on items typed or pulled from a note. A blocked item shows the documented reaction, and only a prescriber can override it.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.5 20.5 20 11a4.95 4.95 0 1 0-7-7l-9.5 9.5a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </svg>
    ),
  },
  {
    title: 'Sepsis Six',
    desc: 'Orb opens it at NEWS2 7 or above, and a clinician can open it from the chart at any score: six items, a 60-minute target, each showing when it is overdue. A hospital can switch the automatic start off.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="10" y1="2" x2="14" y2="2" />
        <line x1="12" y1="14" x2="15" y2="11" />
        <circle cx="12" cy="14" r="8" />
      </svg>
    ),
  },
  {
    title: 'Safe handovers',
    desc: 'An I-PASS handover drafted from recorded data, to be read against the patient before the handover.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
      </svg>
    ),
  },
  {
    title: 'Downtime on paper',
    desc: 'A printable downtime pack per patient, refreshed on the computer. Print it on the ward’s schedule and the hour the computer is down is covered on paper.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="m4.93 4.93 4.24 4.24" />
        <path d="m14.83 9.17 4.24-4.24" />
        <path d="m14.83 14.83 4.24 4.24" />
        <path d="m9.17 14.83-4.24 4.24" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: 'A standard file out',
    desc: 'Records export as a standard file (FHIR) today. Orb is not yet ABDM-certified and sends nothing to ABDM; your hospital system stays your ABDM system.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: 'Oversight and governance',
    desc: 'Model Governance lists every model on the computer with its version and whether it has been validated, next to the NEWS2 table. Every model answer and every confirmed action lands in the audit log.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

export default function SafetySuite() {
  return (
    <section className="safety-suite">
      <div className="safety-suite__header">
        <span className="safety-suite__badge">Clinical safety</span>
        <h2 className="safety-suite__title">Six safeguards.<br />Each one has a screen.</h2>
        <p className="safety-suite__desc">Each one runs as a rule, and each one is a screen I can open on a call.</p>
      </div>

      <div className="safety-suite__grid">
        {items.map((item) => (
          <div className="safety-suite__card" key={item.title}>
            <div className="safety-suite__card-icon">{item.icon}</div>
            <h3 className="safety-suite__card-title">{item.title}</h3>
            <p className="safety-suite__card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
