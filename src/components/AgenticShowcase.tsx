import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import './AgenticShowcase.css'

const STEPS = [
  {
    key: 'understand',
    label: 'Understand',
    caption: 'Reads the chart, the vitals and the note as they change',
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
    caption: 'Drafts the order, the alert or the note, with the guideline it used',
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
    caption: 'A named clinician approves, or the draft goes nowhere',
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
    caption: 'The order is placed, the pharmacist is queued, the audit row is sealed',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
]

const CHIPS = ['Orders', 'Pharmacy', 'Notes']

export default function AgenticShowcase() {
  const [active, setActive] = useState(0)

  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // The flow is driven by scroll: as the section travels up from the bottom of
  // the viewport into place, Understand → Propose → Confirm → Act light up in
  // turn and the fan opens once it is seated. Reduced motion shows the end state.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 28%'] })
  const stepFor = (v: number) => Math.min(STEPS.length - 1, Math.floor(v * (STEPS.length + 0.6)))
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!reduce) setActive(stepFor(v)) })
  useEffect(() => {
    if (reduce) { setActive(STEPS.length - 1); return }
    setActive(stepFor(scrollYProgress.get()))
  }, [reduce, scrollYProgress])

  const actReached = active === STEPS.length - 1

  return (
    <section className="agentic" ref={ref}>
      <div className="agentic__header">
        <span className="agentic__eyebrow">How it acts</span>
        <h2 className="agentic__title">Orb drafts. A clinician confirms. Then it acts.</h2>
        <p className="agentic__lead">
          Orb reads the chart and drafts the next step: an order set, an alert, a note. Nothing happens until
          a named person confirms it, and what they confirm goes through the same allergy interlock, dose guard
          and pharmacist queue as anything typed by hand.
        </p>
      </div>

      <div className="agentic__flow" role="img" aria-label="Orb workflow: Understand, Propose, Confirm, then Act, which fans out into Orders, Pharmacy and Notes.">
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

      <div className="agentic__cta">
        <Link to="/helix" className="agentic__cta-primary">See the allergy interlock &nbsp;&rarr;</Link>
      </div>
    </section>
  )
}
