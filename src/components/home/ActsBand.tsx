import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './ActsBand.css'

const STEPS = [
  { n: '01', label: 'Understand', line: 'Reads the chart, the vitals and the note as they change.' },
  { n: '02', label: 'Propose', line: 'Drafts the order, the alert or the note, with the guideline it used.' },
  { n: '03', label: 'Confirm', line: 'A named clinician approves, or the draft goes nowhere.' },
  { n: '04', label: 'Act', line: 'The order is placed, the pharmacist is queued, the audit row is sealed.' },
]

/** How Orb acts, in four numbered beats. */
export default function ActsBand() {
  return (
    <section className="acts" aria-labelledby="acts-title">
      <Reveal className="acts__header">
        <span className="acts__eyebrow">How it acts</span>
        <h2 className="acts__title" id="acts-title">Orb drafts. A clinician confirms. Then it acts.</h2>
        <p className="acts__lead">
          Nothing happens until a named person confirms it, and what they confirm goes through the same allergy interlock, dose guard and pharmacist queue as anything typed by hand.
        </p>
      </Reveal>
      <Stagger className="acts__steps" as="ul">
        {STEPS.map(s => (
          <StaggerItem key={s.n} as="li" className="acts__step">
            <span className="acts__num">{s.n}</span>
            <span className="acts__label">{s.label}</span>
            <span className="acts__line">{s.line}</span>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal className="acts__cta">
        <Link to="/helix" className="acts__link">See the allergy interlock <span aria-hidden="true">&rarr;</span></Link>
      </Reveal>
    </section>
  )
}
