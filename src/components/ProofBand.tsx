import './ProofBand.css'

type Principle = {
  label: string
  line: string
  icon: React.ReactNode
}

const principles: Principle[] = [
  {
    label: 'Clinician-confirmed',
    line: "Nothing acts without a human's yes.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    label: 'On your hardware',
    line: 'Data never leaves the building.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="12" rx="2" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
      </svg>
    ),
  },
  {
    label: 'Auditable by design',
    line: 'Actions recorded to a tamper-evident trail.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Built with clinicians',
    line: 'Shaped on real ward workflows.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function ProofBand() {
  return (
    <section className="proof-band" aria-label="How Orb earns trust">
      <div className="proof-band__header">
        <span className="proof-band__eyebrow">Trusted by design</span>
        <p className="proof-band__lede">
          Orb earns trust the way hospitals demand it — not with promises, but with architecture.
        </p>
      </div>

      <div className="proof-band__tiles">
        {principles.map((p) => (
          <div className="proof-band__tile" key={p.label}>
            <span className="proof-band__tile-icon">{p.icon}</span>
            <div className="proof-band__tile-text">
              <span className="proof-band__tile-label">{p.label}</span>
              <span className="proof-band__tile-line">{p.line}</span>
            </div>
          </div>
        ))}
      </div>

      {/*
        ── OWNER: drop REAL proof here once available ──
        When design partners, clinician quotes, or outcome metrics are
        confirmed and cleared to publish, add them below this comment:
          • Design-partner / pilot-site logos (real, with permission)
          • A named clinician quote (attributed, approved to share)
          • An outcome metric from a live deployment (verifiable)
        Until then, render nothing here — no placeholder logos, quotes,
        or numbers. Unearned social proof undermines the section above.
      */}
    </section>
  )
}
