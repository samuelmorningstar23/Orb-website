import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './AgenticShowcase.css'

const STEPS = [
  {
    key: 'understand',
    label: 'Understand',
    caption: 'Reads the moment across the ward',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    key: 'propose',
    label: 'Propose',
    caption: 'Drafts the next step, grounded in your references',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  {
    key: 'confirm',
    label: 'Confirm',
    caption: 'Waits for a clinician to approve',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    key: 'act',
    label: 'Act',
    caption: 'Carries it through, end to end',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
]

const CHIPS = ['Orders', 'Theatre', 'Notes']

export default function AgenticShowcase() {
  const [active, setActive] = useState(0)

  // Gently advance the active node through the flow on a calm loop.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setActive(STEPS.length - 1)
      return
    }
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length)
    }, 1900)
    return () => clearInterval(timer)
  }, [])

  const actReached = active === STEPS.length - 1

  return (
    <section className="agentic">
      <div className="agentic__header">
        <span className="agentic__eyebrow">Agentic by design</span>
        <h2 className="agentic__title">Orb doesn&rsquo;t just watch. It acts.</h2>
        <p className="agentic__lead">
          Most hospital software shows you information. Orb understands what is happening and carries the
          next step through &mdash; drafting the order, alerting the team, filing the note &mdash; always
          waiting for a clinician&rsquo;s confirmation.
        </p>
      </div>

      <div className="agentic__flow" role="img" aria-label="Orb workflow: Understand, Propose, Confirm, then Act — which fans out into Orders, Theatre and Notes.">
        {STEPS.map((step, i) => {
          const isActive = i === active
          const isPast = i < active
          const isLast = i === STEPS.length - 1
          return (
            <div className="agentic__unit" key={step.key}>
              <div
                className={
                  'agentic__node' +
                  (isActive ? ' is-active' : '') +
                  (isPast ? ' is-past' : '')
                }
              >
                <span className="agentic__node-icon">{step.icon}</span>
                <span className="agentic__node-label">{step.label}</span>
                <span className="agentic__node-caption">{step.caption}</span>
              </div>

              {!isLast && (
                <div className={'agentic__link' + (i < active ? ' is-flowing' : '')}>
                  <span className="agentic__link-track" />
                  <span className="agentic__link-dot" />
                </div>
              )}
            </div>
          )
        })}

        <div className={'agentic__fan' + (actReached ? ' is-open' : '')}>
          <span className="agentic__fan-stem" />
          <div className="agentic__chips">
            {CHIPS.map((chip, i) => (
              <span
                className="agentic__chip"
                key={chip}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="agentic__reassure">
        <span className="agentic__reassure-item">Clinician-confirmed</span>
        <span className="agentic__reassure-sep" aria-hidden="true" />
        <span className="agentic__reassure-item">On-device</span>
        <span className="agentic__reassure-sep" aria-hidden="true" />
        <span className="agentic__reassure-item">Fully auditable</span>
      </div>

      <div className="agentic__cta">
        <Link to="/sage" className="agentic__cta-primary">See Sage in action &nbsp;&rarr;</Link>
        <button className="agentic__cta-secondary" onClick={() => window.dispatchEvent(new CustomEvent('open-demo-modal'))}>
          Request a demo
        </button>
      </div>
    </section>
  )
}
