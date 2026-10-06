import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import ModuleBento from '../components/home/ModuleBento'
import SiteFooter from '../components/SiteFooter'
import { Reveal } from '../components/motion/Reveal'
import { openDemoModal } from '../data/siteContent'
import './Landing.css'
import './details/ModuleDetails.css'

/** Every module as a real screen, each opening a page that runs its workflows. */
export default function Modules() {
  return (
    <div className="landing-overview modules-page">
      <Aurora />
      <MarketingHeader />
      <main className="landing-overview__content">
        <ModuleBento />
        <Reveal as="section" className="mp__cta" amount={0.4}>
          <h2 className="mp__cta-title">All fourteen share one record and one computer.</h2>
          <p className="mp__cta-desc">The founding programme starts smaller than this page: one ward’s observation record and a monthly file for the quality team.</p>
          <div className="mp__actions mp__actions--center">
            <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/plans" className="hero__btn hero__btn--ghost">Plans <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </Reveal>
        <SiteFooter />
      </main>
    </div>
  )
}
