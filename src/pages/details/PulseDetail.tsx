import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

// A single environmental signal tile: label, value, level pill and a trend arrow.
function SignalTile({
  isLight,
  label,
  value,
  level,
  status,
  direction,
}: {
  isLight: boolean
  label: string
  value: string
  level: string
  status: 'ok' | 'warn' | 'danger'
  direction: 'up' | 'down' | 'steady'
}) {
  const statusColor =
    status === 'ok' ? 'var(--status-ok)' : status === 'warn' ? 'var(--status-warn)' : 'var(--status-danger)'
  const pillBg =
    status === 'ok'
      ? isLight
        ? 'rgba(5,150,105,0.1)'
        : 'rgba(0,230,118,0.1)'
      : status === 'warn'
        ? isLight
          ? 'rgba(180,120,10,0.12)'
          : 'rgba(255,196,0,0.1)'
        : isLight
          ? 'rgba(220,38,38,0.1)'
          : 'rgba(255,82,82,0.1)'

  return (
    <div
      style={{
        flex: '1',
        minWidth: '150px',
        background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)',
        border: '1px solid',
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
        transition: 'border-color 0.6s ease',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          display: 'block',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={statusColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.6s ease', transform: direction === 'down' ? 'rotate(0deg)' : 'none' }}
        >
          {direction === 'up' ? (
            <>
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </>
          ) : direction === 'down' ? (
            <>
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </>
          ) : (
            <path d="M5 12h14" />
          )}
        </svg>
      </div>
      <span
        style={{
          display: 'inline-block',
          marginTop: '12px',
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: '99px',
          background: pillBg,
          color: statusColor,
          transition: 'color 0.6s ease, background 0.6s ease',
        }}
      >
        {level}
      </span>
    </div>
  )
}

export default function PulseDetail() {
  const [elevated, setElevated] = useState(false)
  const [aqi, setAqi] = useState(38)
  const [advisory, setAdvisory] = useState('')
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')

  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  // After a calm beat, the outside conditions shift and the advisory streams in.
  useEffect(() => {
    // Hoisted so the effect's own cleanup can clear these even if the component
    // unmounts after the delay fires while the intervals are still running.
    let countTimer: ReturnType<typeof setInterval> | undefined
    let streamTimer: ReturnType<typeof setInterval> | undefined

    const timer = setTimeout(() => {
      setElevated(true)

      // Ease the air-quality index upward as conditions worsen.
      let current = 38
      const target = 142
      countTimer = setInterval(() => {
        current += Math.ceil((target - current) / 8)
        if (current >= target) {
          current = target
          clearInterval(countTimer)
        }
        setAqi(current)
      }, 60)

      // Stream the clinical impact advisory, one character at a time.
      const fullText =
        'Elevated particulate levels forecast for the next 48h. 3 admitted respiratory patients flagged for proactive review. Consider pre-emptive bronchodilator availability on Ward B.'
      let idx = 0
      setAdvisory('')
      streamTimer = setInterval(() => {
        if (idx < fullText.length) {
          setAdvisory((prev) => prev + fullText.charAt(idx))
          idx++
        } else {
          clearInterval(streamTimer)
        }
      }, 22)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(countTimer)
      clearInterval(streamTimer)
    }
  }, [])

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
          <span className="module-detail__badge">Environmental &amp; Population Signals</span>
          <h1 className="module-detail__title">Pulse</h1>
          <p className="module-detail__tagline">
            Sees the pressures building outside your walls — and tells you which patients will feel them first.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

            {/* Board header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Regional Signals
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Greater Metro Catchment</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="live-dot"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: elevated ? 'var(--status-warn)' : 'var(--status-ok)',
                    display: 'inline-block',
                    transition: 'background 0.6s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: elevated ? 'var(--status-warn)' : 'var(--status-ok)',
                    transition: 'color 0.6s ease',
                  }}
                >
                  {elevated ? 'Elevated Outlook' : 'Stable Outlook'}
                </span>
              </div>
            </div>

            {/* Signal tiles */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <SignalTile
                isLight={isLight}
                label="Air Quality"
                value={`AQI ${aqi}`}
                level={elevated ? 'Poor' : 'Good'}
                status={elevated ? 'danger' : 'ok'}
                direction={elevated ? 'up' : 'down'}
              />
              <SignalTile
                isLight={isLight}
                label="Respiratory Weather Risk"
                value={elevated ? '6.8' : '2.1'}
                level={elevated ? 'Elevated' : 'Low'}
                status={elevated ? 'warn' : 'ok'}
                direction={elevated ? 'up' : 'steady'}
              />
              <SignalTile
                isLight={isLight}
                label="Seasonal Illness Activity"
                value={elevated ? 'High' : 'Moderate'}
                level={elevated ? 'Rising' : 'Regional'}
                status={elevated ? 'danger' : 'warn'}
                direction={elevated ? 'up' : 'steady'}
              />
            </div>

            {/* Clinical Impact advisory */}
            <div
              style={{
                marginTop: '20px',
                flex: 1,
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: elevated ? 'var(--accent-gold)' : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
                transition: 'border-color 0.6s ease',
                minHeight: '96px',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '8px',
                  letterSpacing: '0.05em',
                }}
              >
                Pulse · Clinical Impact
              </span>
              {advisory ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontFamily: 'var(--font-mono)' }}>
                  {advisory}
                  <span className="cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>
                </p>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', fontFamily: 'var(--font-mono)' }}>
                  Watching regional conditions… no ward-level impact expected.
                </p>
              )}
            </div>

          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h4l3 8 4-16 3 8h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Regional Signal Tracking</h3>
            <p className="module-detail__card-desc">
              Continuously watches local air quality, weather, and community illness activity that drive admissions and respiratory flare-ups.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 0 0 18M3 12h18" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinical Cross-Referencing</h3>
            <p className="module-detail__card-desc">
              Connects outside conditions to the patients on your wards, surfacing who is most exposed before symptoms escalate.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Proactive Advisories</h3>
            <p className="module-detail__card-desc">
              Turns environmental shifts into clear, ward-level guidance your team can act on ahead of time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Always On-Site</h3>
            <p className="module-detail__card-desc">
              Runs entirely within the hospital, keeping population insight available even when outside networks are down.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Pulse</h2>
          <p className="module-detail__cta-desc">Population awareness, translated into bedside action.</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .live-dot {
          animation: pulse-live 1.5s infinite;
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .cursor {
          animation: blink-cursor 1s infinite;
          display: inline-block;
          width: 8px;
          height: 15px;
        }
      `}</style>
    </div>
  )
}
