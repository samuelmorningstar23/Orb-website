import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import LiveDemo from '../../components/captures/LiveDemo'
import News2Live from '../../components/captures/News2Live'
import StoryScroll, { type StoryStep } from '../../components/home/StoryScroll'
import { Reveal, Stagger, StaggerItem } from '../../components/motion/Reveal'
import { useIsLightTheme } from '../../components/showcases/useIsLightTheme'
import { LIVE_VIEWS, WALKTHROUGHS } from '../../data/liveViews'
import { flowById, SCREENS } from '../../data/orbCaptures'
import { modulePage } from '../../data/modulePages'
import { ALL_MODULES, openDemoModal } from '../../data/siteContent'
import './ModuleDetails.css'

/**
 * One layout for every module page: the claim and the module itself running
 * side by side, the walkthrough told with its own screens as you scroll, the
 * facts as an editorial list, more screens as a filmstrip, one call to action.
 */
export default function ModulePage({ route }: { route: string }) {
  const page = modulePage(route)
  const info = ALL_MODULES.find(m => m.to === route)
  const views = LIVE_VIEWS[route]
  const walk = WALKTHROUGHS[route]
  const isLight = useIsLightTheme()

  const steps: StoryStep[] = walk
    ? walk.flows.flatMap((id, fi) => flowById(id).steps.map(s => ({
        kicker: walk.labels?.[fi] ?? flowById(id).title,
        body: s.caption,
        src: s.src,
      })))
    : []

  const more = (page.moreScreens ?? []).filter(n => SCREENS[n])

  return (
    <div className="module-detail mp">
      <Aurora />
      <MarketingHeader />

      <main className="mp__content">
        <Link to="/#modules" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All modules
        </Link>

        <section className="mp__hero">
          <div className="mp__hero-copy">
            <span className="mp__eyebrow">{page.badge}</span>
            <h1 className="mp__title">{page.title}</h1>
            <p className="mp__tagline">{page.tagline}</p>
            <div className="mp__actions">
              <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Request a demo</button>
              {info && <span className="mp__area">{info.line}</span>}
            </div>
          </div>
          {views && (
            <div className="mp__hero-demo">
              <LiveDemo views={views} label={`${page.title}, live in your browser`} lazy={false} />
              <p className="mp__demo-note">{page.captureNote ?? 'The Orb front end itself, in your browser, on a recording of the appliance and seeded demo patients. Click anything.'}</p>
            </div>
          )}
        </section>

        <section className="mp__facts" aria-label={`What ${page.title} does`}>
          <Reveal className="mp__facts-head">
            <span className="mp__eyebrow">What you can check</span>
            <h2 className="mp__h2">On the screen, not in the brochure.</h2>
          </Reveal>
          <Stagger className="mp__facts-list" as="ul" amount={0.2}>
            {page.cards.map((c, i) => (
              <StaggerItem key={c.title} as="li" className="mp__fact">
                <span className="mp__fact-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="mp__fact-title">{c.title}</span>
                <span className="mp__fact-desc">{c.desc}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {steps.length > 0 && (
          <section className="mp__walk" aria-labelledby="walk-title">
            <Reveal className="mp__facts-head">
              <span className="mp__eyebrow">The walkthrough</span>
              <h2 className="mp__h2" id="walk-title">Step by step, on the product’s own screens.</h2>
            </Reveal>
            <StoryScroll steps={steps} label={`${page.title} walkthrough`} numbered={false} />
          </section>
        )}

        {page.tryNews2 && <News2Live />}

        {more.length > 0 && (
          <section className="mp__strip" aria-label={`More screens of ${page.title}`}>
            <Reveal className="mp__facts-head">
              <span className="mp__eyebrow">More of {page.title}</span>
            </Reveal>
            <div className="mp__film">
              {more.map(n => (
                <figure key={n} className={'mp__still' + (page.tallScreens?.includes(n) ? ' mp__still--tall' : '')}>
                  <img src={isLight ? SCREENS[n].light : SCREENS[n].dark} alt={page.moreCaptions?.[n] ?? SCREENS[n].title} loading="lazy" draggable={false} />
                  <figcaption>{page.moreCaptions?.[n] ?? SCREENS[n].title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <Reveal as="section" className="mp__cta" amount={0.4}>
          <h2 className="mp__cta-title">{page.ctaLine}</h2>
          <div className="mp__actions mp__actions--center">
            <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/#modules" className="hero__btn hero__btn--ghost">All modules <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
