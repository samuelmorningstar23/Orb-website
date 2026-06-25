import { useState, useEffect } from 'react'
import './RequestDemoModal.css'

// ─── WEBHOOK CONFIGURATION ───
// To receive email or chat notifications when an investor requests a demo,
// paste your Formspree, Slack, Discord, or Zapier webhook URL here:
const NOTIFICATION_WEBHOOK_URL = ""

export default function RequestDemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setIsSuccess(false)
      setError('')
    }
    window.addEventListener('open-demo-modal', handleOpen)
    return () => window.removeEventListener('open-demo-modal', handleOpen)
  }, [])

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
          body: JSON.stringify({
            name,
            email,
            company,
            purpose,
            submittedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to submit request. Please try again.')
        }
      } else {
        // Fallback mock simulation for demo purposes
        console.log('Demo Request Submitted:', { name, email, company, purpose })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setIsSuccess(true)
      setName('')
      setEmail('')
      setCompany('')
      setPurpose('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="demo-modal-overlay animate-fade-in" onClick={() => setIsOpen(false)}>
      <div 
        className="demo-modal-card glass" 
        onClick={e => e.stopPropagation()}
      >
        <button className="demo-modal-close" onClick={() => setIsOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {!isSuccess ? (
          <>
            <h3 className="demo-modal-title">Request a Demo</h3>
            <p className="demo-modal-subtitle">Submit details to explore Orb OS in detail.</p>

            {error && <div className="demo-modal-error">{error}</div>}

            <form className="demo-modal-form" onSubmit={handleSubmit}>
              <div className="demo-modal-field">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                />
              </div>

              <div className="demo-modal-field">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="jane@company.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                />
              </div>

              <div className="demo-modal-field">
                <label>Company / Hospital Group</label>
                <input 
                  type="text" 
                  placeholder="Mercy Health" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  required
                />
              </div>

              <div className="demo-modal-field">
                <label>Purpose of Interest</label>
                <textarea 
                  placeholder="Describe your goals (e.g. institutional deployment, seed round investment)" 
                  value={purpose} 
                  onChange={e => setPurpose(e.target.value)} 
                  rows={3}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="demo-modal-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Request...' : 'Submit Request'}
              </button>
            </form>
          </>
        ) : (
          <div className="demo-modal-success animate-fade-in">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="demo-modal-title">Thank You</h3>
            <p className="demo-modal-subtitle">
              Your request has been logged successfully. Our founding team will contact you shortly to coordinate details.
            </p>
            <button className="demo-modal-close-btn" onClick={() => setIsOpen(false)}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
