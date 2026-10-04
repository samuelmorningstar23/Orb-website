import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './ActsBand.css'

const STEPS = [
  { n: '01', label: 'Read', line: 'The chart, the observations, the notes. As the ward recorded them.' },
  { n: '02', label: 'Draft', line: 'An order, a note, or the score with every reading behind it and the guideline it used.' },
  { n: '03', label: 'Confirm', line: 'A named clinician approves it. Or it goes nowhere.' },
  { n: '04', label: 'Record', line: 'Order placed. Pharmacist queued. Audit row sealed.' },
]

/** How Orb works, in four numbered beats. */
export default function ActsBand() {
  return (
    <section className="acts" aria-labelledby="acts-title">
      <Reveal className="acts__header">
        <span className="acts__eyebrow">How it works</span>
        <h2 className="acts__title" id="acts-title">Orb drafts.<br />A clinician signs.</h2>
        <p className="acts__lead">
          Nothing is ordered, charted or filed until a named person says yes. A drafted medication still meets the allergy interlock, the dose guard and the pharmacist’s queue.
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
        <Link to="/helix" className="acts__link">Watch the interlock stop an order <span aria-hidden="true">&rarr;</span></Link>
      </Reveal>
    </section>
  )
}
