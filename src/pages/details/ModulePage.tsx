import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import Widget from '../../components/widget/Widget'
import News2Live from '../../components/captures/News2Live'
import { Reveal, Stagger, StaggerItem } from '../../components/motion/Reveal'
import { useIsLightTheme } from '../../components/showcases/useIsLightTheme'
import { WIDGET_FLOWS } from '../../data/widgetFlows'
import { SCREENS } from '../../data/orbCaptures'
import { modulePage } from '../../data/modulePages'
import { ALL_MODULES, openDemoModal } from '../../data/siteContent'
import './ModuleDetails.css'

/**
 * One layout for every module page, kept short on purpose: the claim beside the
 * workflow running as an animation, four things you can check, the real screens
 * as a strip, one call to action. No second walkthrough underneath: the widget
 * is the walkthrough.
 */
export default function ModulePage({ route }: { route: string }) {
  const page = modulePage(route)
  const info = ALL_MODULES.find(m => m.to === route)
  const flows = WIDGET_FLOWS[route]
  const isLight = useIsLightTheme()
  const more = (page.moreScreens ?? []).filter(n => SCREENS[n])

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
          {flows && (
            <div className="mp__hero-demo">
              <Widget flows={flows} label={`${page.title}, one workflow`} />
              <p className="mp__demo-note">{page.captureNote ?? (more.length ? 'An animation of the workflow. The screens themselves are below.' : 'An animation of the workflow, on seeded demo patients.')}</p>
            </div>
          )}
        </section>

        <section className="mp__facts" aria-label={`What ${page.title} does`}>
          <Reveal className="mp__facts-head">
            <span className="mp__eyebrow">What you can check</span>
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

        {page.tryNews2 && <News2Live />}

        {more.length > 0 && (
          <section className="mp__strip" aria-label={`Screens of ${page.title}`}>
            <Reveal className="mp__facts-head">
              <span className="mp__eyebrow">The real screens</span>
              <p className="mp__strip-note">Captured from a running appliance on seeded demo patients.</p>
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
            <Link to="/modules" className="hero__btn hero__btn--ghost">All modules <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
