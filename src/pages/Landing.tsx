import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import Hero from '../components/home/Hero'
import ActsBand from '../components/home/ActsBand'
import Checks from '../components/home/Checks'
import SiteFooter from '../components/SiteFooter'
import { Reveal } from '../components/motion/Reveal'
import { openDemoModal } from '../data/siteContent'
import './Landing.css'

/**
 * Homepage in four moves: the product running in the first screen, how it
 * acts, what you can check, and one call to action. The modules live on their
 * own page behind the Modules menu, and each runs its own workflows.
 */
export default function Landing() {
  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">
        <Hero />

        <ActsBand />
        <Checks />

        <Reveal as="section" className="landing-overview__cta" amount={0.4}>
          <h2 className="landing-overview__cta-title">See it running, on a call about your wards.</h2>
          <p className="landing-overview__cta-desc">
            On demo patients, with the product open the whole time. No slides. The founding programme starts smaller than this page: one ward’s observation record and a monthly file for your quality team.
          </p>
          <div className="landing-overview__cta-actions">
            <button className="landing-overview__btn-primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/plans" className="landing-overview__btn-secondary-action">The founding programme &nbsp;&rarr;</Link>
          </div>
        </Reveal>

        <SiteFooter />
      </main>
    </div>
  )
}
