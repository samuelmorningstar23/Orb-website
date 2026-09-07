import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import ModuleBento from '../components/home/ModuleBento'
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
          <h2 className="mp__cta-title">Every module runs on one record, on one appliance inside the hospital.</h2>
          <div className="mp__actions mp__actions--center">
            <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/plans" className="hero__btn hero__btn--ghost">Plans <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
