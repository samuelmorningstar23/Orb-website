import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import { ANSWER_ENTRIES } from '../data/search'
import { CONTACT_EMAIL, openDemoModal } from '../data/siteContent'
import './Support.css'

const openSearch = () => window.dispatchEvent(new CustomEvent('open-orb-search'))

// The search engine's curated answers double as the FAQ, so both stay in sync.
const FAQ = ANSWER_ENTRIES.filter(a => a.id !== 'qa-contact' && a.id !== 'qa-demo')

export default function Support() {
  return (
    <div className="module-detail support-page">
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
          <span className="module-detail__badge">Support</span>
          <h1 className="module-detail__title">How can we help?</h1>
          <p className="module-detail__tagline">
            A human on the Orb team reads every message. Reach out, book a walkthrough, or find your answer below.
          </p>
        </section>

        <section className="support-page__channels animate-slide-up stagger-1">
          <a href={`mailto:${CONTACT_EMAIL}`} className="support-page__channel">
            <div className="support-page__channel-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h3 className="support-page__channel-title">Email us</h3>
            <p className="support-page__channel-desc">Questions, issues, or feedback — straight to the team’s inbox.</p>
            <span className="support-page__channel-action">{CONTACT_EMAIL}</span>
          </a>

          <button className="support-page__channel" onClick={openDemoModal}>
            <div className="support-page__channel-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" />
              </svg>
            </div>
            <h3 className="support-page__channel-title">Request a demo</h3>
            <p className="support-page__channel-desc">See Orb run on real clinical workflows, sized to your wards.</p>
            <span className="support-page__channel-action">Book a walkthrough &rarr;</span>
          </button>

          <button className="support-page__channel" onClick={openSearch}>
            <div className="support-page__channel-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.4" y2="16.4" />
              </svg>
            </div>
            <h3 className="support-page__channel-title">Ask Orb</h3>
            <p className="support-page__channel-desc">Search the site or ask a question — answers come back instantly.</p>
            <span className="support-page__channel-action">Open search (⌘K) &rarr;</span>
          </button>
        </section>

        <section className="support-page__faq animate-slide-up stagger-2">
          <h2 className="support-page__faq-title">Common questions</h2>
          <div className="support-page__faq-list">
            {FAQ.map(item => (
              <details key={item.id} className="support-page__faq-item">
                <summary>
                  {item.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="support-page__faq-body">
                  <p>{item.answer}</p>
                  {item.to && item.to !== '/support' && (
                    <Link to={item.to} className="support-page__faq-link">Learn more &rarr;</Link>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Still stuck?</h2>
          <p className="module-detail__cta-desc">
            Write to us and a real person will get back to you — usually within one business day.
          </p>
          <div className="module-detail__buttons">
            <a href={`mailto:${CONTACT_EMAIL}`} className="module-detail__btn-primary support-page__mail-btn">Email {CONTACT_EMAIL}</a>
            <Link to="/plans" className="module-detail__btn-secondary">Compare plans &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
