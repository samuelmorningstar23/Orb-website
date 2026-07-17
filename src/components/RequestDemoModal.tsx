import { useState, useEffect, useRef } from 'react'
import './RequestDemoModal.css'

// ─── LEAD DELIVERY ───
// This is a static site (GitHub Pages) and cannot send mail itself, so demo
// requests go through Web3Forms, which emails them to the inbox the access key
// is registered to.
//
// The access key is PUBLIC by design — Web3Forms expects it in client-side
// markup and enforces the allowed domain instead. It is not a secret.
// Note: Web3Forms rejects server-side calls on the free plan; submissions must
// come from the browser (which is what happens here).
const DEMO_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = '20e7bb09-6c16-4692-bee8-343422d7ff94'
//
// FALLBACK: if Web3Forms is unreachable or rejects the request, hand the
// filled-in details to the visitor's own mail client, so a lead is never
// silently dropped.
const CONTACT_EMAIL = 'support@orbintelligence.co'

export default function RequestDemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans leave this empty
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [sentVia, setSentVia] = useState<'server' | 'email'>('server')
  const [error, setError] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handleOpen = () => { setIsOpen(true); setIsSuccess(false); setError('') }
    window.addEventListener('open-demo-modal', handleOpen)
    return () => window.removeEventListener('open-demo-modal', handleOpen)
  }, [])

  // Scroll-lock, ESC-to-close, and focus the first field while open
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [isOpen])

  if (!isOpen) return null

  const succeed = (via: 'server' | 'email') => {
    setSentVia(via)
    setIsSuccess(true)
    setName(''); setEmail(''); setCompany(''); setPurpose(''); setWebsite('')
    setIsSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !company || !purpose) {
      setError('Please fill in all fields.')
      return
    }
    setIsSubmitting(true)
    setError('')

    // 1) Preferred: Web3Forms — lands in the inbox with no action from the visitor.
    try {
      const res = await fetch(DEMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Demo request — ${company}`,
          from_name: 'Orb Website',
          replyto: email, // hitting Reply answers the requester
          name,
          email,
          company,
          message: purpose,
          botcheck: website, // Web3Forms' own honeypot convention
        }),
      })
      const detail = await res.json().catch(() => null)
      if (res.ok && detail?.success) { succeed('server'); return }
      // Rejected (bad key, domain not allowed, validation) → fall through to
      // mailto rather than dead-ending the visitor, but leave a breadcrumb.
      console.warn('Web3Forms rejected the submission:', res.status, detail?.message)
    } catch {
      // Network / CORS → fall through
    }

    // 2) Fallback: hand it to the visitor's mail client, pre-addressed.
    const subject = encodeURIComponent(`Orb demo request — ${company}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany / Hospital group: ${company}\n\nInterest:\n${purpose}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    succeed('email')
  }

  return (
    <div className="demo-modal-overlay animate-fade-in" onClick={close}>
      <div className="demo-modal-card" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" onClick={e => e.stopPropagation()}>
        <button className="demo-modal-close" onClick={close} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSuccess ? (
          <>
            <h3 className="demo-modal-title" id="demo-modal-title">Request a Demo</h3>
            <p className="demo-modal-subtitle">See Orb run on real clinical workflows — book a walkthrough with the team.</p>

            {error && <div className="demo-modal-error">{error}</div>}

            <form className="demo-modal-form" onSubmit={handleSubmit}>
              <div className="demo-modal-field">
                <label htmlFor="dm-name">Full Name</label>
                <input ref={firstFieldRef} id="dm-name" type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-email">Email Address</label>
                <input id="dm-email" type="email" placeholder="jane@hospital.org" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-company">Company / Hospital Group</label>
                <input id="dm-company" type="text" placeholder="Mercy Health" value={company} onChange={e => setCompany(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-purpose">What are you exploring?</label>
                <textarea id="dm-purpose" placeholder="A few words on your hospital, team, or interest in Orb." value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} required />
              </div>

              {/* Honeypot — offscreen rather than display:none, which some bots skip */}
              <input
                className="demo-modal-hp"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />

              <button type="submit" className="demo-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Request a Demo'}
              </button>
            </form>
          </>
        ) : (
          <div className="demo-modal-success animate-fade-in">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--status-ok)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="demo-modal-title">Thank you</h3>
            <p className="demo-modal-subtitle">
              {sentVia === 'server'
                ? <>Your request has been sent to our team — we’ll be in touch shortly. You can also reach us any time at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>
                : <>We’ve opened your email client with the details — press send and the team will reply shortly. Prefer to write directly? Reach us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}
            </p>
            <button className="demo-modal-close-btn" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
