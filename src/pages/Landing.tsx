import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import Hero from '../components/home/Hero'
import ActsBand from '../components/home/ActsBand'
import Checks from '../components/home/Checks'
import { Reveal } from '../components/motion/Reveal'
import { ALL_MODULES, CONTACT_EMAIL, openDemoModal } from '../data/siteContent'
import './Landing.css'

/**
 * Homepage in four moves: the product running in the first screen, how it
 * acts, what you can check, and one call to action. The modules live on their
 * own page behind the Modules menu, and each runs its own workflows.
 */
export default function Landing() {
  const half = Math.ceil(ALL_MODULES.length / 2)

  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">
        <Hero />

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
                <Link to="/modules" className="landing-overview__footer-link">Modules</Link>
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
