import { useState, useEffect, useRef } from 'react'
// Lead delivery and the contact address live in siteContent.ts, and the send
// itself in sendForm.ts, so every form on the site behaves the same way.
import { CONTACT_EMAIL } from '../data/siteContent'
import { isEmail, sendForm, trapFocus } from '../data/sendForm'
import './RequestDemoModal.css'

export default function RequestDemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('')
  const [website, setWebsite] = useState('') // honeypot - humans leave this empty
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  // Closing on a click that merely ended on the backdrop loses a typed form,
  // so the press has to have started there too.
  const pressedBackdrop = useRef(false)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handleOpen = () => { setIsOpen(true); setIsSuccess(false); setError('') }
    window.addEventListener('open-demo-modal', handleOpen)
    return () => window.removeEventListener('open-demo-modal', handleOpen)
  }, [])

  // Scroll-lock, ESC-to-close, focus the first field, and keep Tab inside.
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    const release = trapFocus(cardRef.current)
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      release()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Name the field that is missing, rather than asking them to hunt for it.
    const missing = ([['your name', name], ['your email', email], ['your hospital', company], ['what you are exploring', purpose]] as const)
      .filter(([, v]) => !v.trim()).map(([label]) => label)
    if (missing.length) {
      setError(missing.length === 1 ? `Please add ${missing[0]}.` : `Please add ${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}.`)
      return
    }
    if (!isEmail(email)) {
      setError('That email address does not look right. Please check it.')
      return
    }
    setIsSubmitting(true)
    setError('')

    const result = await sendForm({
      subject: `Demo request: ${company.trim()}`,
      replyto: email, // hitting Reply answers the requester
      name,
      email,
      company,
      message: purpose,
    }, website)

    if (result.ok) {
      setIsSuccess(true)
      setName(''); setEmail(''); setCompany(''); setPurpose(''); setWebsite('')
    } else {
      // Never fail silently: the visitor still gets a way to reach us.
      setError(result.error)
    }
    setIsSubmitting(false)
  }

  return (
    <div
      className="demo-modal-overlay animate-fade-in"
      onMouseDown={e => { pressedBackdrop.current = e.target === e.currentTarget }}
      onClick={e => { if (e.target === e.currentTarget && pressedBackdrop.current) close() }}
    >
      <div className="demo-modal-card" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <button className="demo-modal-close" onClick={close} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSuccess ? (
          <>
            <h3 className="demo-modal-title" id="demo-modal-title">Request a Demo</h3>
            <p className="demo-modal-subtitle">A walkthrough of the running product on demo patients, on a call. Tell us the wards and the beds and we size it.</p>

            {error && <div className="demo-modal-error" role="alert">{error}</div>}

            <form className="demo-modal-form" onSubmit={handleSubmit} noValidate>
              <div className="demo-modal-field">
                <label htmlFor="dm-name">Full Name</label>
                <input ref={firstFieldRef} id="dm-name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-email">Email Address</label>
                <input id="dm-email" name="email" type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder="jane@hospital.org" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-company">Company / Hospital Group</label>
                <input id="dm-company" name="company" type="text" autoComplete="organization" placeholder="Mercy Health" value={company} onChange={e => setCompany(e.target.value)} required />
              </div>

              <div className="demo-modal-field">
                <label htmlFor="dm-purpose">What are you exploring?</label>
                <textarea id="dm-purpose" name="message" placeholder="A few words on your hospital, team, or interest in Orb." value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} required />
              </div>

              {/* Honeypot - offscreen rather than display:none, which some bots skip */}
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
              Your request has been sent to our team. We’ll be in touch shortly. You can also reach us any time at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <button className="demo-modal-close-btn" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
