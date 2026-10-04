import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './Checks.css'

const CHECKS = [
  { label: 'Confirmed by name', line: 'The audit row holds who approved it and when. An order without a name goes nowhere.' },
  { label: 'On your hardware', line: 'The appliance and the models live in your hospital. The one outbound call is Pulse, and it carries a map coordinate, never a patient.' },
  { label: 'Hash-chained audit', line: 'SHA-256 over every audit row. Alter or delete one and the chain breaks, and the Trust Center shows it.' },
  { label: 'Rules first', line: 'NEWS2 (RCP 2017), Sepsis Six, I-PASS and the WHO checklist are deterministic. A model steps in only where no rule reaches.' },
]

/** What a visitor can check on a screen, not what they are asked to believe. */
export default function Checks() {
  return (
    <section className="checks" aria-labelledby="checks-title">
      <Reveal className="checks__intro">
        <span className="checks__eyebrow">What you can check</span>
        <h2 className="checks__title" id="checks-title">Every claim is a screen.</h2>
        <p className="checks__lede">Each line below is a screen in the product.</p>
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
