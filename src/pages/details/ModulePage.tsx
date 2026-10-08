import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import Widget from '../../components/widget/Widget'
import News2Live from '../../components/captures/News2Live'
import ScreenGallery from '../../components/captures/ScreenGallery'
import SiteFooter from '../../components/SiteFooter'
import { Reveal, Stagger, StaggerItem } from '../../components/motion/Reveal'
import { WIDGET_FLOWS } from '../../data/widgetFlows'
import { modulePage, PROGRAMME_NOTE } from '../../data/modulePages'
import { openDemoModal } from '../../data/siteContent'
import './ModuleDetails.css'

/**
 * One layout for every module page, kept short on purpose: the module name with
 * its one claim under it, beside the workflow running as an animation, four
 * things you can check, the real screens as a strip, one call to action. No
 * second walkthrough underneath: the widget is the walkthrough.
 */

/** The claim as a sentence under the name: a full stop unless it already ends in one. */
const asSentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`)

/** The closing line breaks after its first sentence, so a phone never breaks it mid-sentence. */
const ctaLines = (s: string) => s.split('. ').map((part, i, all) => (i < all.length - 1 ? `${part}.` : part))

export default function ModulePage({ route }: { route: string }) {
  const page = modulePage(route)
  const flows = WIDGET_FLOWS[route]
  const shots = page.shots ?? []
  const cta = ctaLines(page.ctaLine)

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
            <h1 className="mp__title">{page.title}</h1>
            <p className="mp__claim">{asSentence(page.badge)}</p>
            {page.tagline && <p className="mp__tagline">{page.tagline}</p>}
            <div className="mp__actions">
              <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Book a walkthrough</button>
            </div>
            <p className="mp__programme">{page.programmeNote ?? PROGRAMME_NOTE} <Link to="/plans">The programme <span aria-hidden="true">&rarr;</span></Link></p>
          </div>
          {flows && (
            <div className="mp__hero-demo">
              <Widget flows={flows} label={`${page.title}, one workflow`} />
              <p className="mp__demo-note">{page.captureNote ?? (shots.length ? 'The workflow, animated. The real screens are below.' : 'The workflow, animated, on demo patients.')}</p>
            </div>
          )}
        </section>

        <section className="mp__facts" aria-label={`What ${page.title} does`}>
          <Reveal className="mp__facts-head">
            <span className="mp__eyebrow">What to look for</span>
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

        {page.more && page.more.length > 0 && (
          <section className="mp__facts mp__more" aria-label={`Also in Orb, with ${page.title}`}>
            <Reveal className="mp__facts-head">
              <span className="mp__eyebrow">Also in Orb</span>
            </Reveal>
            <Stagger className="mp__facts-list" as="ul" amount={0.2}>
              {page.more.map((c, i) => (
                <StaggerItem key={c.title} as="li" className="mp__fact">
                  <span className="mp__fact-num">{String(page.cards.length + i + 1).padStart(2, '0')}</span>
                  <span className="mp__fact-title">{c.title}</span>
                  <span className="mp__fact-desc">{c.desc}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        {page.tryNews2 && <News2Live />}

        {shots.length > 0 && (
          <section className="mp__strip" aria-label={`Screens of ${page.title}`}>
            <Reveal className="mp__facts-head">
              <span className="mp__eyebrow">The real screens</span>
              <p className="mp__strip-note">The real screens, on demo patients.</p>
            </Reveal>
            <ScreenGallery shots={shots} label={`${page.title} screens`} />
          </section>
        )}

        <Reveal as="section" className="mp__cta" amount={0.4}>
          <h2 className="mp__cta-title">
            {cta.map((line, i) => (
              <span key={line}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
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
