import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './Checks.css'

const CHECKS = [
  { label: 'Clinician-confirmed', line: 'Nothing is ordered, charted or filed without a named person’s yes, and the audit row records who and when.' },
  { label: 'On your hardware', line: 'The appliance and the models live in the hospital. The one outbound call is Pulse, and it carries a map coordinate, not a patient.' },
  { label: 'A hash chain over the audit log', line: 'SHA-256 over every audit row. Alter or delete one and the chain breaks; the Trust Center shows the check.' },
  { label: 'Rules where a rule exists', line: 'NEWS2 (RCP 2017), Sepsis Six, I-PASS and the WHO surgical checklist are deterministic. A model is used only where no rule can reach.' },
]

/** What a visitor can check on a screen, not what they are asked to believe. */
export default function Checks() {
  return (
    <section className="checks" aria-labelledby="checks-title">
      <Reveal className="checks__intro">
        <span className="checks__eyebrow">What you can check</span>
        <h2 className="checks__title" id="checks-title">None of this is a promise.</h2>
        <p className="checks__lede">Each line is a screen in the product, and every screenshot on this site was taken from one running.</p>
        <Link to="/security" className="checks__link">Read the security brief <span aria-hidden="true">&rarr;</span></Link>
      </Reveal>
      <Stagger className="checks__list" as="ul" amount={0.25}>
        {CHECKS.map(c => (
          <StaggerItem key={c.label} as="li" className="checks__item">
            <span className="checks__label">{c.label}</span>
            <span className="checks__line">{c.line}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
