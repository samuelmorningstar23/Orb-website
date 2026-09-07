import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import Hero from '../components/home/Hero'
import StoryScroll, { type StoryStep } from '../components/home/StoryScroll'
import ModuleBento from '../components/home/ModuleBento'
import ActsBand from '../components/home/ActsBand'
import Checks from '../components/home/Checks'
import { Reveal } from '../components/motion/Reveal'
import { ALL_MODULES, CONTACT_EMAIL, openDemoModal } from '../data/siteContent'
import { flowById } from '../data/orbCaptures'
import './Landing.css'

/**
 * Homepage in five moves: the product running in the first screen, five things
 * it does told with its own screens as you scroll, every module as a real
 * screen, how it acts, what you can check, and one call to action.
 */
const frame = (flow: string, step: number) => flowById(flow).steps[Math.min(step, flowById(flow).steps.length - 1)].src

const CHAPTERS: StoryStep[] = [
  {
    title: 'The ward orders itself by risk.',
    body: 'Every patient is scored on NEWS2 as the vitals arrive. The board is ordered by that score, every point on it is explained, and the Sepsis Six clock starts when the score crosses the line.',
    src: frame('ward-is-alive', 1), link: { to: '/vigil', label: 'Open Vigil' },
  },
  {
    title: 'A bundle is applied whole or not at all.',
    body: 'Sepsis Six for a patient with a documented ceftriaxone anaphylaxis stops at the ceftriaxone, with the reaction spelled out, and the Apply button stays disabled. A half-applied bundle is its own emergency.',
    src: frame('allergy-interlock', 3), link: { to: '/helix', label: 'Open Helix' },
  },
  {
    title: 'Sage answers inside the building.',
    body: 'A 27-billion-parameter medical model on the appliance answers with the guidance it read listed underneath. No question, and no chart, leaves the hospital. A chart outside your department is never shown to it.',
    src: frame('sage-ask', 3), link: { to: '/sage', label: 'Open Sage' },
  },
  {
    title: 'Extracted is not prescribed.',
    body: 'Medications a model pulled from a signed note wait in a pharmacist’s queue, marked AI EXTRACTED, with the safety line in plain words. They become orders when a named pharmacist says so.',
    src: frame('pharmacy-verify', 2), link: { to: '/helix', label: 'See the queue' },
  },
  {
    title: 'Every action lands in a hash chain.',
    body: 'SHA-256 over every audit row: every model answer, every refusal, every confirmed action. Alter or delete one and the chain breaks, and the Trust Center shows the check.',
    src: frame('show-your-work', 1), link: { to: '/security', label: 'Read the security brief' },
  },
]

export default function Landing() {
  const half = Math.ceil(ALL_MODULES.length / 2)

  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">
        <Hero />

        <section className="chapters" aria-labelledby="chapters-title">
          <Reveal className="chapters__header">
            <span className="chapters__eyebrow">Five things you can check</span>
            <h2 className="chapters__title" id="chapters-title">The product, one screen at a time.</h2>
            <p className="chapters__lead">Scroll. Each frame is a capture of the running appliance; each line is something you can do in the demo above.</p>
          </Reveal>
          <StoryScroll steps={CHAPTERS} label="Five things Orb does, shown on its own screens" />
        </section>

        <ModuleBento />
        <ActsBand />
        <Checks />

        <Reveal as="section" className="landing-overview__cta" amount={0.4}>
          <h2 className="landing-overview__cta-title">See Orb on your wards.</h2>
          <p className="landing-overview__cta-desc">
            A walkthrough of the running product on demo patients, on a call sized to your hospital. No slides.
          </p>
          <div className="landing-overview__cta-actions">
            <button className="landing-overview__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/plans" className="landing-overview__btn-secondary-action">Compare plans &nbsp;&rarr;</Link>
          </div>
        </Reveal>

        <footer className="landing-overview__footer">
          <div className="landing-overview__footer-top">
            <div className="landing-overview__footer-brand">
              <span className="landing-overview__footer-wordmark">Orb</span>
              <p className="landing-overview__footer-tagline">The hospital operating system that runs inside the hospital.</p>
            </div>

            <nav className="landing-overview__footer-cols">
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Modules</span>
                {ALL_MODULES.slice(0, half).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">&nbsp;</span>
                {ALL_MODULES.slice(half).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Company</span>
                <a href="#modules" className="landing-overview__footer-link">Overview</a>
                <Link to="/plans" className="landing-overview__footer-link">Plans</Link>
                <Link to="/security" className="landing-overview__footer-link">Security</Link>
                <Link to="/support" className="landing-overview__footer-link">Support</Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="landing-overview__footer-link">Contact</a>
              </div>
            </nav>
          </div>

          <div className="landing-overview__footer-bottom">
            <p>© 2026 Orb. All rights reserved.</p>
            <p className="landing-overview__footer-fineprint">Every screen on this site is the running Orb front end, or a capture of it, on seeded demo patients. No real patient appears here.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
