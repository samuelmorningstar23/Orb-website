import { useEffect, useState } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

// Static ward roster shown in the Capacity Outlook demo. Readiness values are
// held in state so one patient can trend upward while the showcase is mounted.
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

/**
 * Forecast — capacity outlook panel pairing per-patient discharge readiness
 * bars with a projected bed-availability chart that draws itself in.
 * Self-contained: owns its timers and keyframes, so it can render on the
 * Forecast page and inside the homepage module explorer alike.
 */
export default function ForecastShowcase() {
  const isLight = useIsLightTheme()
  const [filled, setFilled] = useState(false)
  const [readiness, setReadiness] = useState(ROSTER.map(p => p.start))

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
    <>
      <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

        {/* Panel header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Capacity Outlook</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>Medical Ward · West</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="forecast-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)' }}>Updating live</span>
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
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* horizontal guide lines */}
                  {[0, 1, 2, 3].map(g => {
                    const gy = TOP_Y + (g * (BASE_Y - TOP_Y)) / 3
                    return <line key={g} x1={PAD_L} y1={gy} x2={CHART_W - PAD_R} y2={gy} stroke={gridColor} strokeWidth="1" />
                  })}

                  {/* area fill */}
                  <path className="forecast-area" d={areaPath} fill="url(#fcArea)" />

                  {/* animated draw-in line */}
                  <path
                    className="forecast-line"
                    d={linePath}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                  />

                  {/* tomorrow marker */}
                  <circle className="forecast-mark" cx={tomorrowX} cy={tomorrowY} r="4.5" fill="var(--accent)" stroke={isLight ? '#ffffff' : '#0a0b0f'} strokeWidth="2" />
                  <text className="forecast-mark" x={tomorrowX} y={tomorrowY - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text-primary)">8</text>

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
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>8</span>
            </div>
          </div>

        </div>
      </div>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes forecast-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .forecast-dot { animation: forecast-pulse 1.8s infinite; }

        @keyframes forecast-draw { to { stroke-dashoffset: 0; } }
        .forecast-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: forecast-draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          animation-delay: 0.3s;
        }

        @keyframes forecast-fade { to { opacity: 1; } }
        .forecast-area { opacity: 0; animation: forecast-fade 1.4s ease forwards; animation-delay: 1s; }
        .forecast-mark { opacity: 0; animation: forecast-fade 0.6s ease forwards; animation-delay: 1.9s; }

        @media (prefers-reduced-motion: reduce) {
          .forecast-line { animation: none; stroke-dashoffset: 0; }
          .forecast-area, .forecast-mark { animation: none; opacity: 1; }
          .forecast-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </>
  )
}
