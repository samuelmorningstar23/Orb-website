import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

// Static ward roster shown in the Capacity Outlook demo. Readiness values are
// held in state so one patient can trend upward while the page is open.
const ROSTER = [
  { bed: 'Bed 04', name: 'R. Patel', stay: 3, start: 82, live: false },
  { bed: 'Bed 07', name: 'A. Osei', stay: 6, start: 41, live: true },
  { bed: 'Bed 12', name: 'M. Lund', stay: 1, start: 95, live: false },
  { bed: 'Bed 15', name: 'S. Okafor', stay: 2, start: 68, live: false },
]

// Projected free beds across the week ahead. Index 1 is "tomorrow" (headline).
const OUTLOOK = [5, 8, 7, 9, 10, 11, 12]
const DAY_LABELS = ['Today', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Chart geometry (matches the inline SVG viewBox below).
const CHART_W = 320
const CHART_H = 150
const PAD_L = 18
const PAD_R = 18
const BASE_Y = 120
const TOP_Y = 24
const MAX_V = 14

function xAt(i: number) {
  return PAD_L + (i * (CHART_W - PAD_L - PAD_R)) / (OUTLOOK.length - 1)
}
function yAt(v: number) {
  return BASE_Y - (v / MAX_V) * (BASE_Y - TOP_Y)
}

function readinessTone(r: number) {
  if (r >= 75) return 'var(--status-ok)'
  if (r >= 45) return 'var(--status-warn)'
  return 'var(--status-danger)'
}

export default function ForecastDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  const [filled, setFilled] = useState(false)
  const [readiness, setReadiness] = useState(ROSTER.map(p => p.start))

  useEffect(() => {
    const h = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    window.addEventListener('theme-changed', h)
    return () => window.removeEventListener('theme-changed', h)
  }, [])

  // Animate the readiness bars filling in shortly after mount.
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 120)
    return () => clearTimeout(t)
  }, [])

  // Nudge the "live" patient's discharge readiness upward over time so the
  // panel feels alive — a patient quietly trending toward going home.
  useEffect(() => {
    const liveIdx = ROSTER.findIndex(p => p.live)
    if (liveIdx < 0) return
    const timer = setInterval(() => {
      setReadiness(prev => {
        const next = [...prev]
        if (next[liveIdx] < 58) next[liveIdx] = next[liveIdx] + 1
        return next
      })
    }, 900)
    return () => clearInterval(timer)
  }, [])

  const linePath = OUTLOOK.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${xAt(OUTLOOK.length - 1).toFixed(1)} ${BASE_Y} L ${xAt(0).toFixed(1)} ${BASE_Y} Z`
  const tomorrowX = xAt(1)
  const tomorrowY = yAt(OUTLOOK[1])

  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'
  const panelBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'
  const panelBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'
  const trackBg = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)'

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
          <span className="module-detail__badge">Predictive Capacity Planning</span>
          <h1 className="module-detail__title">Forecast</h1>
          <p className="module-detail__tagline">
            Anticipates length of stay, discharge readiness, and bed pressure — so the whole hospital can plan a day ahead, not a day behind.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Capacity Outlook</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>Medical Ward · West</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="fc-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>Updating live</span>
              </div>
            </div>

            {/* Two-column body */}
            <div style={{ display: 'flex', gap: '20px', flex: 1, flexWrap: 'wrap' }}>

              {/* LEFT — patient readiness list */}
              <div style={{ flex: '1.15', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ROSTER.map((p, i) => {
                  const r = readiness[i]
                  const tone = readinessTone(r)
                  return (
                    <div key={p.bed} style={{ background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '12px 14px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '9px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{p.bed}</span>
                          {'  ·  '}{p.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          Est. stay {p.stay} {p.stay === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', borderRadius: '999px', background: trackBg, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: filled ? `${r}%` : '0%',
                            borderRadius: '999px',
                            background: tone,
                            transition: 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1), background 0.6s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: tone, width: '36px', textAlign: 'right', transition: 'color 0.6s ease' }}>
                          {r}%
                        </span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Discharge readiness
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* RIGHT — projected availability chart */}
              <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                    Projected Bed Availability
                  </span>
                  <div style={{ flex: 1, minHeight: '120px' }}>
                    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* horizontal guide lines */}
                      {[0, 1, 2, 3].map(g => {
                        const gy = TOP_Y + (g * (BASE_Y - TOP_Y)) / 3
                        return <line key={g} x1={PAD_L} y1={gy} x2={CHART_W - PAD_R} y2={gy} stroke={gridColor} strokeWidth="1" />
                      })}

                      {/* area fill */}
                      <path className="fc-area" d={areaPath} fill="url(#fcArea)" />

                      {/* animated draw-in line */}
                      <path
                        className="fc-line"
                        d={linePath}
                        fill="none"
                        stroke="var(--accent-gold)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                      />

                      {/* tomorrow marker */}
                      <circle className="fc-mark" cx={tomorrowX} cy={tomorrowY} r="4.5" fill="var(--accent-gold)" stroke={isLight ? '#ffffff' : '#0a0b0f'} strokeWidth="2" />
                      <text className="fc-mark" x={tomorrowX} y={tomorrowY - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text-primary)">8</text>

                      {/* day labels */}
                      {DAY_LABELS.map((d, i) => (
                        <text key={d} x={xAt(i)} y={CHART_H - 6} textAnchor="middle" fontSize="8" fill="var(--text-muted)">{d}</text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* headline stat */}
                <div style={{ marginTop: '12px', background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Projected free beds tomorrow</span>
                  <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-gold)', lineHeight: 1 }}>8</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Length-of-Stay Estimates</h3>
            <p className="module-detail__card-desc">
              Projects how long each patient is likely to stay, updated as their picture changes.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Discharge Readiness</h3>
            <p className="module-detail__card-desc">
              Highlights who is trending toward discharge, helping teams free capacity safely and on time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 3 3 5-6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Ward-Level Outlook</h3>
            <p className="module-detail__card-desc">
              Rolls individual predictions into a clear bed-availability picture for the days ahead.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Grounded in Your Data</h3>
            <p className="module-detail__card-desc">
              Designed to learn from your hospital's own patient journeys, with every calculation kept on-site.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Forecast</h2>
          <p className="module-detail__cta-desc">
            Capacity you can see coming.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fc-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .fc-dot { animation: fc-pulse 1.8s infinite; }

        @keyframes fc-draw { to { stroke-dashoffset: 0; } }
        .fc-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: fc-draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          animation-delay: 0.3s;
        }

        @keyframes fc-fade { to { opacity: 1; } }
        .fc-area { opacity: 0; animation: fc-fade 1.4s ease forwards; animation-delay: 1s; }
        .fc-mark { opacity: 0; animation: fc-fade 0.6s ease forwards; animation-delay: 1.9s; }

        @media (prefers-reduced-motion: reduce) {
          .fc-line { animation: none; stroke-dashoffset: 0; }
          .fc-area, .fc-mark { animation: none; opacity: 1; }
          .fc-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
