import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import ScreensCapture from '../../components/captures/ScreensCapture'
import FlowCapture from '../../components/captures/FlowCapture'
import { WALKTHROUGHS } from '../../data/liveViews'
import News2Live from '../../components/captures/News2Live'
import { SHOWCASES } from '../../components/showcases'
import { modulePage, type IconName } from '../../data/modulePages'
import { openDemoModal } from '../../data/siteContent'
import './ModuleDetails.css'

const ICONS: Record<IconName, React.ReactNode> = {
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
  pulse: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
  check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  building: <><path d="M3 21h18" /><path d="M6 21V7l6-4 6 4v14" /><path d="M10 21v-6h4v6" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  alert: <><path d="m10.3 3.9-8.2 14A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-3.1l-8.2-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></>,
  pill: <><path d="M10.5 20.5 20 11a4.95 4.95 0 1 0-7-7l-9.5 9.5a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></>,
  mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  offline: <><path d="M1 1l22 22" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><path d="M12 20h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  bed: <><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></>,
  scale: <><path d="M12 3v18" /><path d="M3 7h18" /><path d="m5 7-2 6a3.5 3.5 0 0 0 7 0L8 7" /><path d="m19 7-2 6a3.5 3.5 0 0 0 7 0l-2-6" /></>,
}

const Icon = ({ name }: { name: IconName }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

/**
 * One layout for every module page (the design the site already had: hero,
 * the module running, four facts, one call to action). What changed is the
 * middle: the demo is a capture of the product, and the facts are things you
 * can see on it.
 */
export default function ModulePage({ route }: { route: string }) {
  const page = modulePage(route)
  const Showcase = SHOWCASES[route]
  const walkthrough = WALKTHROUGHS[route]

  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">{page.badge}</span>
          <h1 className="module-detail__title">{page.title}</h1>
          <p className="module-detail__tagline">{page.tagline}</p>
        </section>

        {Showcase && (
          <section className="module-detail__showcase animate-slide-up stagger-1">
            <Showcase />
            <p className="module-detail__capture-note">
              {page.captureNote ?? 'This is the Orb front end itself, running in your browser on a recording of the appliance and seeded demo patients. Click anything.'}
            </p>
          </section>
        )}

        {walkthrough && (
          <section className="module-detail__showcase module-detail__showcase--walk">
            <h2 className="module-detail__more-title">The walkthrough, step by step</h2>
            <FlowCapture flows={walkthrough.flows} labels={walkthrough.labels} label={`${page.title} walkthrough`} />
            <p className="module-detail__capture-note">Captured from a running appliance, with a caption per step.</p>
          </section>
        )}

        <section className="module-detail__grid">
          {page.cards.map(card => (
            <div className="module-detail__card" key={card.title}>
              <div className="module-detail__card-icon"><Icon name={card.icon} /></div>
              <h3 className="module-detail__card-title">{card.title}</h3>
              <p className="module-detail__card-desc">{card.desc}</p>
            </div>
          ))}
        </section>

        {page.tryNews2 && <div className="module-detail__extra"><News2Live /></div>}

        {page.moreScreens && page.moreScreens.length > 0 && (
          <section className="module-detail__showcase module-detail__showcase--more">
            <h2 className="module-detail__more-title">More of {page.title}</h2>
            <ScreensCapture label={`More screens of ${page.title}`} screens={page.moreScreens} captions={page.moreCaptions} tall={page.tallScreens} />
          </section>
        )}

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">{page.title}</h2>
          <p className="module-detail__cta-desc">{page.ctaLine}</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/#modules" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
