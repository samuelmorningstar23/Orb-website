import { useState } from 'react'
import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import { ANSWER_ENTRIES } from '../data/search'
import { CONTACT_EMAIL, openDemoModal, WEB3FORMS_ENDPOINT, WEB3FORMS_ACCESS_KEY } from '../data/siteContent'
import './Support.css'

const openSearch = () => window.dispatchEvent(new CustomEvent('open-orb-search'))

// The search engine's curated answers double as the FAQ, so both stay in sync.
const FAQ = ANSWER_ENTRIES.filter(a => a.id !== 'qa-contact' && a.id !== 'qa-demo')

export default function Support() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans leave this empty
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Same delivery path as the demo modal: Web3Forms emails the message to the
  // team inbox, so the static site needs no server of its own.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      setError('Please fill in all fields.')
      return
    }
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Support message — ${name}`,
          from_name: 'Orb Website',
          replyto: email, // hitting Reply answers the sender
          name,
          email,
          message,
          botcheck: website,
        }),
      })
      const detail = await res.json().catch(() => null)

      if (res.ok && detail?.success) {
        setIsSuccess(true)
        setName(''); setEmail(''); setMessage(''); setWebsite('')
      } else {
        // Never fail silently — the visitor still gets a way to reach us.
        setError(`We couldn’t send that just now. Please try again, or email us at ${CONTACT_EMAIL}.`)
      }
    } catch {
      setError(`We couldn’t reach the server. Please check your connection, or email us at ${CONTACT_EMAIL}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <section className="support-page__form-section animate-slide-up stagger-3" id="write-to-us">
          <h2 className="support-page__form-title">Still stuck? Write to us</h2>
          <p className="support-page__form-desc">
            Send a message right here — a real person will get back to you, usually within one business day.
          </p>

          {isSuccess ? (
            <div className="support-page__form support-page__form-success animate-fade-in">
              <div className="support-page__form-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--status-ok)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Message sent</h3>
              <p>Thanks — it’s on its way to the team. We’ll reply to your email, usually within one business day.</p>
              <button className="support-page__form-again" onClick={() => setIsSuccess(false)}>Send another message</button>
            </div>
          ) : (
            <form className="support-page__form" onSubmit={handleSubmit}>
              {error && <div className="support-page__form-error">{error}</div>}

              <div className="support-page__form-row">
                <div className="support-page__form-field">
                  <label htmlFor="sp-name">Name</label>
                  <input id="sp-name" type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="support-page__form-field">
                  <label htmlFor="sp-email">Email</label>
                  <input id="sp-email" type="email" placeholder="jane@hospital.org" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="support-page__form-field">
                <label htmlFor="sp-message">How can we help?</label>
                <textarea id="sp-message" rows={5} placeholder="Tell us what’s happening — the more detail, the faster we can help." value={message} onChange={e => setMessage(e.target.value)} required />
              </div>

              {/* Honeypot — offscreen rather than display:none, which some bots skip */}
              <input
                className="support-page__hp"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />

              <button type="submit" className="support-page__form-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}

          <p className="support-page__form-alt">
            Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <span aria-hidden="true"> &nbsp;·&nbsp; </span>
            <Link to="/plans">Compare plans &rarr;</Link>
          </p>
        </section>
      </main>
    </div>
  )
}
