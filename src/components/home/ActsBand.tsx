import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './ActsBand.css'

const STEPS = [
  { n: '01', label: 'Read', line: 'The chart and the observations, as the ward recorded them.' },
  { n: '02', label: 'Draft', line: 'An order or a note. An order set names the guideline it follows, and Sage lists the sources behind its answer.' },
  { n: '03', label: 'Confirm', line: 'A named clinician approves it. Or it goes nowhere.' },
  { n: '04', label: 'Record', line: 'The order goes on the chart, the pharmacist sees it in the queue, and the log keeps who did it and when.' },
]

/** How Orb works, in four numbered beats. */
export default function ActsBand() {
  return (
    <section className="acts" aria-labelledby="acts-title">
      <Reveal className="acts__header">
        <span className="acts__eyebrow">How it works</span>
        <h2 className="acts__title" id="acts-title">Orb drafts.<br />A clinician signs.</h2>
        <p className="acts__lead">
          The models only draft. A doctor or nurse signs by name, and a drafted medicine still passes the allergy block and the dose check before a pharmacist sees it.
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
        <Link to="/helix" className="acts__link">Watch the allergy block stop an order <span aria-hidden="true">&rarr;</span></Link>
      </Reveal>
    </section>
  )
}
