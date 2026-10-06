import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import './Checks.css'

const CHECKS = [
  { label: 'Approved by name', line: 'The log shows who approved each order and when, by name.' },
  { label: 'On your own computer', line: 'The computer and the models sit in your hospital, and Orb makes no call to the internet at all, not even for the weather.' },
  { label: 'A log that shows tampering', line: 'Each entry is locked to the one before it. Change or delete any entry and the admin screens show the break. How it works is on the security page.' },
  { label: 'Rules before models', line: 'The NEWS2 score, the Sepsis Six checklist, the handover draft and the WHO surgical checklist are fixed rules a nurse can check by hand. A model is used only where there is no rule.' },
]

/** What a visitor can check on a screen, not what they are asked to believe. */
export default function Checks() {
  return (
    <section className="checks" aria-labelledby="checks-title">
      <Reveal className="checks__intro">
        <span className="checks__eyebrow">What you can check</span>
        <h2 className="checks__title" id="checks-title">Ask me to show you.</h2>
        <p className="checks__lede">Four things I put on the screen in every walkthrough.</p>
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
