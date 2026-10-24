import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SiteFooter from '../components/SiteFooter'
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from '../data/privacyContent'
import { PRIVACY_EMAIL } from '../data/siteContent'
import './details/ModuleDetails.css'
import './Privacy.css'

export default function Privacy() {
  const { hash } = useLocation()

  // The outgoing page fades away before this page mounts. Resolve the anchor
  // here as well, after its target exists, including a direct /complaints visit.
  useEffect(() => {
    const section = PRIVACY_SECTIONS.find(item => `#${item.id}` === hash)
    if (!section) return
    const target = document.getElementById(section.id)
    target?.scrollIntoView({ block: 'start', behavior: 'instant' })
    target?.focus({ preventScroll: true })
  }, [hash])

  return (
    <div className="module-detail privacy-page">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <div className="privacy-page__reading">
          <Link to="/" className="module-detail__back">Back to the overview</Link>

          <header className="privacy-page__header">
            <h1 className="privacy-page__title">Privacy and complaints</h1>
            <p className="privacy-page__updated">Updated {PRIVACY_UPDATED}</p>
            <p className="privacy-page__intro">
              How we handle website visits, enquiries and professional outreach.
            </p>
            <p className="privacy-page__contact">
              Privacy questions, requests or complaints:{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
            </p>
          </header>

          <nav className="privacy-page__contents" aria-label="Privacy notice sections">
            <h2>On this page</h2>
            <ol>
              {PRIVACY_SECTIONS.map(section => (
                <li key={section.id}><Link to={`#${section.id}`}>{section.title}</Link></li>
              ))}
            </ol>
          </nav>

          <article aria-label="Privacy notice">
            {PRIVACY_SECTIONS.map(section => (
              <section
                key={section.id}
                id={section.id}
                className="privacy-page__section"
                aria-labelledby={`${section.id}-title`}
                tabIndex={-1}
              >
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {section.links && section.links.length > 0 ? (
                  <ul className="privacy-page__sources">
                    {section.links.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>

        <SiteFooter />
      </main>
    </div>
  )
}
