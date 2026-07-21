import { useState, useEffect, useRef } from 'react'
import './RequestDemoModal.css'

// ─── LEAD DELIVERY ───
// This is a static site (GitHub Pages) and cannot send mail itself, so demo
// requests go through Web3Forms, which emails them to the inbox the access key
// is registered to. Change the recipient in the Web3Forms dashboard, not here —
// there is deliberately no "send to" field in the payload, so a public key
// can't be used to redirect your mail.
//
// The access key is PUBLIC by design — Web3Forms expects it in client-side
// markup and enforces the allowed domain instead. It is not a secret.
// Note: Web3Forms rejects server-side calls on the free plan; submissions must
// come from the browser (which is what happens here).
const DEMO_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = '20e7bb09-6c16-4692-bee8-343422d7ff94'
// Shown on the success screen and if a submission fails, so a visitor always
// has a way to reach the team.
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
  const [error, setError] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handleOpen = () => { setIsOpen(true); setIsSuccess(false); setError('') }
    window.addEventListener('open-demo-modal', handleOpen)
    return () => window.removeEventListener('open-demo-modal', handleOpen)
  }, [])

  // Scroll-lock, ESC-to-close, focus the first field, trap Tab inside the
  // dialog while open, and hand focus back to the opener on close.
  useEffect(() => {
    if (!isOpen) return
    const openerEl = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); return }
      if (e.key !== 'Tab') return
      const card = cardRef.current
      if (!card) return
      const focusables = Array.from(
        card.querySelectorAll<HTMLElement>('button, [href], input, textarea, select')
      ).filter((el) => el.tabIndex !== -1 && el.getAttribute('aria-hidden') !== 'true')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      const inside = active !== null && card.contains(active)
      if (e.shiftKey) {
        if (!inside || active === first) { e.preventDefault(); last.focus() }
      } else {
        if (!inside || active === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      openerEl?.focus?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !company || !purpose) {
      setError('Please fill in all fields.')
      return
    }
    setIsSubmitting(true)
    setError('')

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
          botcheck: website,
        }),
      })
      const detail = await res.json().catch(() => null)

      if (res.ok && detail?.success) {
        setIsSuccess(true)
        setName(''); setEmail(''); setCompany(''); setPurpose(''); setWebsite('')
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
    <div className="demo-modal-overlay animate-fade-in" onClick={close}>
      <div className="demo-modal-card" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" ref={cardRef} onClick={e => e.stopPropagation()}>
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
                <input id="dm-company" type="text" placeholder="Your hospital or health system" value={company} onChange={e => setCompany(e.target.value)} required />
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
              Your request has been sent to our team — we’ll be in touch shortly. You can also reach us any time at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <button className="demo-modal-close-btn" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
