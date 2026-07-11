import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

type Slot = {
  time: string
  title: string
  patient: string
  color: string
}

export default function AppointmentsDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  // Slide a freshly booked follow-up into the board after a calm pause.
  useEffect(() => {
    const timer = setTimeout(() => setShowNew(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  const surface = isLight ? '#ffffff' : 'rgba(255,255,255,0.025)'
  const surfaceBorder = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'
  const railColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'

  const slots: Slot[] = [
    { time: '09:00', title: 'Follow-up', patient: 'R. Patel', color: 'var(--accent-gold)' },
    { time: '10:30', title: 'Post-op review', patient: 'A. Osei', color: 'var(--status-warn)' },
    { time: '13:00', title: 'Clinic', patient: 'M. Lund', color: 'var(--status-ok)' },
  ]

  const renderCard = (s: Slot, key?: string, extra: CSSProperties = {}, isFresh = false) => (
    <div
      key={key}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: surface,
        border: `1px solid ${isFresh ? 'var(--accent-gold)' : surfaceBorder}`,
        borderRadius: '14px',
        padding: '13px 15px',
        boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
        ...extra,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          minWidth: '44px',
        }}
      >
        {s.time}
      </span>
      <span style={{ width: '3px', alignSelf: 'stretch', borderRadius: '99px', background: s.color, opacity: 0.9 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25 }}>
          {s.title}
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.patient}</div>
      </div>
      {isFresh && (
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            background: isLight ? 'rgba(122,165,199,0.12)' : 'rgba(255,215,0,0.10)',
            padding: '3px 8px',
            borderRadius: '99px',
          }}
        >
          New
        </span>
      )}
    </div>
  )

  return (
    <div className="module-detail">
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
          <span className="module-detail__badge">Scheduling &amp; Follow-up</span>
          <h1 className="module-detail__title">Appointments</h1>
          <p className="module-detail__tagline">
            Keeps every follow-up, review, and clinic slot in order — so no patient falls through the gap between visits.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div
            className="module-detail__visual-frame"
            style={{
              flexDirection: 'column',
              padding: '24px',
              alignItems: 'stretch',
              background: isLight ? '#fbfbfd' : '#0a0b0f',
            }}
          >
            {/* Board header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${railColor}`,
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Schedule
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Thursday · 11 July
                </h3>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  background: surface,
                  border: `1px solid ${surfaceBorder}`,
                  borderRadius: '99px',
                  padding: '7px 14px',
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
                  <span className="reminder-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Reminders active
                </span>
              </div>
            </div>

            {/* Board body: day column + smart suggestion */}
            <div style={{ flex: 1, display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
              {/* Day column */}
              <div style={{ flex: '1.6', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {slots.map((s) => renderCard(s, s.time))}
                <div className={showNew ? 'appt-new appt-new--in' : 'appt-new'}>
                  {renderCard({ time: '15:45', title: 'Follow-up', patient: 'J. Okafor', color: 'var(--accent-gold)' }, '15:45', {}, true)}
                </div>
              </div>

              {/* Smart suggestion + reminders */}
              <div style={{ flex: '1', minWidth: '210px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  className="appt-suggest"
                  style={{
                    flex: 1,
                    background: isLight ? 'rgba(122,165,199,0.08)' : 'rgba(255,215,0,0.05)',
                    border: '1px solid var(--accent-gold)',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '10px' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                    </svg>
                    Smart suggestion
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Next open slot</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    Thu 11:15
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                    Fits R. Patel's review window and clinic capacity.
                  </div>
                </div>

                <div
                  style={{
                    background: surface,
                    border: `1px solid ${surfaceBorder}`,
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ color: 'var(--status-ok)', display: 'inline-flex' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </span>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>3 reminders sent</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Patients &amp; staff up to date</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Unified Schedule</h3>
            <p className="module-detail__card-desc">
              One clear view of clinics, follow-ups, and reviews across teams and wards.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Smart Slotting</h3>
            <p className="module-detail__card-desc">
              Suggests the right time and place for each follow-up, reducing gaps and missed visits.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Gentle Reminders</h3>
            <p className="module-detail__card-desc">
              Keeps patients and staff ahead of what is coming next.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.97-4.03 9-9 9a9 9 0 0 1-8-13" />
                <path d="M3.5 8A9 9 0 0 1 12 3c2.5 0 4.77 1.02 6.4 2.66" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Connected to Care</h3>
            <p className="module-detail__card-desc">
              Flows directly from discharge and treatment plans, so follow-up is never an afterthought.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Appointments</h2>
          <p className="module-detail__cta-desc">
            Continuity, kept.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        .appt-new {
          max-height: 0;
          opacity: 0;
          transform: translateY(10px);
          overflow: hidden;
          transition: max-height 0.55s ease, opacity 0.55s ease, transform 0.55s ease;
        }
        .appt-new--in {
          max-height: 90px;
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes reminder-ping {
          0% { transform: scale(1); opacity: 0.6; }
          70%, 100% { transform: scale(2.6); opacity: 0; }
        }
        .reminder-ring {
          animation: reminder-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes suggest-breathe {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 215, 0, 0); }
          50% { box-shadow: var(--shadow-glow); }
        }
        .appt-suggest {
          animation: suggest-breathe 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .reminder-ring, .appt-suggest { animation: none; }
          .appt-new { transition: none; }
        }
      `}</style>
    </div>
  )
}
