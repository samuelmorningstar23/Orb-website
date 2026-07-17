import { useState, useEffect, useRef } from 'react'
import './RequestDemoModal.css'

// ─── LEAD DELIVERY CONFIGURATION ───
// This is a static site with no backend, so it cannot send mail itself.
//
// PREFERRED — server-side delivery: paste a form-backend endpoint (Formspree,
// Web3Forms, Getform, Zapier/Slack webhook). Submissions are POSTed as JSON and
// the service emails them to CONTACT_EMAIL without the visitor doing anything.
// This is the only way a request lands in the inbox on its own.
const NOTIFICATION_WEBHOOK_URL = ''
//
// FALLBACK (active while the endpoint above is blank): hand the filled-in
// details to the visitor's own mail client, pre-addressed here. Requires the
// visitor to press send, but it never silently drops a lead.
const CONTACT_EMAIL = 'support@orbintelligence.co'

export default function RequestDemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [sentVia, setSentVia] = useState<'webhook' | 'email' | 'none'>('none')
  const [error, setError] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setIsSuccess(false)
      setError('')
    }
    window.addEventListener('open-demo-modal', handleOpen)
    return () => window.removeEventListener('open-demo-modal', handleOpen)
  }, [])

  // Scroll-lock, ESC-to-close, and focus the first field while the dialog is open
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !company || !purpose) {
      setError('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (NOTIFICATION_WEBHOOK_URL) {
        const response = await fetch(NOTIFICATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, company, purpose, submittedAt: new Date().toISOString() }),
        })
        if (!response.ok) throw new Error('We couldn’t send that just now. Please try again, or email us directly.')
        setSentVia('webhook')
      } else if (CONTACT_EMAIL) {
        // No webhook configured — hand the request to the visitor's mail client so it reaches a real inbox.
        const subject = encodeURIComponent(`Orb demo request — ${company}`)
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nCompany / Hospital group: ${company}\n\nInterest:\n${purpose}`
        )
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
        setSentVia('email')
      } else {
        setSentVia('none')
      }

      setIsSuccess(true)
      setName(''); setEmail(''); setCompany(''); setPurpose('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="demo-modal-overlay animate-fade-in" onClick={close}>
      <div
        className="demo-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <button className="demo-modal-close" onClick={close} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
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
              {sentVia === 'webhook'
                ? 'Your request is on its way. The team will be in touch shortly.'
                : sentVia === 'email'
                  ? <>We’ve opened your email client with the details — press send and the team will reply shortly. Prefer to write directly? Reach us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>
                  : <>Thanks for your interest. Please reach the team directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}
            </p>
            <button className="demo-modal-close-btn" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
