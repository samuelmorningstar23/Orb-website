import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import ScreenGallery from '../components/captures/ScreenGallery'
import SiteFooter from '../components/SiteFooter'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { BACK_OFFICE, BACK_OFFICE_BUILDING, BACK_OFFICE_LEDE } from '../data/backOffice'
import { openDemoModal } from '../data/siteContent'
import './details/ModuleDetails.css'

/**
 * The rest of the hospital: the administrative modules, one line each, then
 * their real screens one at a time. Same layout family as a module page.
 */
export default function BackOffice() {
  return (
    <div className="module-detail mp">
      <Aurora />
      <MarketingHeader />

      <main className="mp__content">
        <Link to="/modules" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All modules
        </Link>

        <section className="mp__hero mp__hero--single">
          <div className="mp__hero-copy">
            <span className="mp__eyebrow">Back office</span>
            <h1 className="mp__title">The rest of the hospital.</h1>
            <p className="mp__claim">{BACK_OFFICE_LEDE}</p>
            <div className="mp__actions">
              <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Book a walkthrough</button>
            </div>
          </div>
        </section>

        <section className="mp__facts" aria-label="The back-office modules">
          <Stagger className="mp__facts-list" as="ul" amount={0.15}>
            {BACK_OFFICE.map((m, i) => (
              <StaggerItem key={m.name} as="li" className="mp__fact">
                <span className="mp__fact-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="mp__fact-title">{m.name}</span>
                <span className="mp__fact-desc">{m.line}</span>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mp__strip-note mp__building">{BACK_OFFICE_BUILDING}</p>
        </section>

        <section className="mp__strip" aria-label="Screens of the back office">
          <Reveal className="mp__facts-head">
            <span className="mp__eyebrow">The real screens</span>
            <p className="mp__strip-note">The real screens, on demo patients.</p>
          </Reveal>
          <ScreenGallery shots={BACK_OFFICE.map(m => ({ name: m.shot, label: m.name, caption: m.line }))} label="Back office screens" />
        </section>

        <Reveal as="section" className="mp__cta" amount={0.4}>
          <h2 className="mp__cta-title">One record, from the front desk to the kitchen.</h2>
          <div className="mp__actions mp__actions--center">
            <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/modules" className="hero__btn hero__btn--ghost">All modules <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </Reveal>

        <SiteFooter />
      </main>
    </div>
  )
}
