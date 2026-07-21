import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

// What-if scenarios modelled on a copy of the ward — never on the live floor.
// Each carries the three headline outputs and a projected-occupancy curve that
// redraws when the scenario changes.
type Scenario = {
  key: string
  label: string
  hours: number // hours to overflow
  beds: number // beds short at peak
  nurse: number // nurse-staffing gap
  occ: number[] // projected occupancy (% of capacity) across the window
  tone: 'ok' | 'warn' | 'danger'
  note: string
}

const SCENARIOS: Scenario[] = [
  {
    key: 'baseline',
    label: 'Baseline',
    hours: 14,
    beds: 0,
    nurse: 0,
    occ: [76, 78, 80, 82, 84, 86, 88, 90],
    tone: 'ok',
    note: 'Capacity holds through the window.',
  },
  {
    key: 'admissions',
    label: '+20% admissions',
    hours: 9,
    beds: 3,
    nurse: 1,
    occ: [80, 85, 90, 95, 100, 105, 109, 113],
    tone: 'warn',
    note: 'Pressure builds by mid-shift.',
  },
  {
    key: 'closure',
    label: 'Ward closure',
    hours: 6,
    beds: 6,
    nurse: 3,
    occ: [84, 90, 96, 101, 106, 111, 116, 120],
    tone: 'danger',
    note: 'Capacity breaks within six hours.',
  },
  {
    key: 'flu',
    label: 'Flu surge',
    hours: 5,
    beds: 8,
    nurse: 4,
    occ: [86, 93, 100, 106, 112, 118, 123, 127],
    tone: 'danger',
    note: 'Fastest path to overflow.',
  },
]

// Chart geometry (matches the inline SVG viewBox below).
const CHART_W = 340
const CHART_H = 168
const PAD_L = 20
const PAD_R = 16
const TOP_Y = 22 // occupancy = OCC_MAX
const BASE_Y = 132 // occupancy = OCC_MIN
const OCC_MIN = 60
const OCC_MAX = 130
const CAPACITY = 100
const N = SCENARIOS[0].occ.length
const HOUR_LABELS: Record<number, string> = { 0: 'Now', 2: '+4h', 4: '+8h', 6: '+12h' }

function xAt(i: number) {
  return PAD_L + (i * (CHART_W - PAD_L - PAD_R)) / (N - 1)
}
function yAt(pct: number) {
  return BASE_Y - ((pct - OCC_MIN) / (OCC_MAX - OCC_MIN)) * (BASE_Y - TOP_Y)
}
function toneVar(t: Scenario['tone']) {
  return t === 'ok' ? 'var(--status-ok)' : t === 'warn' ? 'var(--status-warn)' : 'var(--status-danger)'
}
function hoursTone(h: number): Scenario['tone'] {
  return h >= 12 ? 'ok' : h >= 8 ? 'warn' : 'danger'
}
function bedsTone(b: number): Scenario['tone'] {
  return b === 0 ? 'ok' : b <= 4 ? 'warn' : 'danger'
}
function nurseTone(n: number): Scenario['tone'] {
  return n === 0 ? 'ok' : n <= 2 ? 'warn' : 'danger'
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

// First point where projected occupancy crosses the capacity line, interpolated
// for a smooth marker position. Returns null when the scenario never overflows.
function crossingX(occ: number[]) {
  for (let i = 1; i < occ.length; i++) {
    if (occ[i] >= CAPACITY && occ[i - 1] < CAPACITY) {
      const frac = (CAPACITY - occ[i - 1]) / (occ[i] - occ[i - 1])
      return xAt(i - 1 + frac)
    }
  }
  return null
}

export default function SurgeSimulatorDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  const [active, setActive] = useState(0)
  const [userEngaged, setUserEngaged] = useState(false)
  const [disp, setDisp] = useState({ h: SCENARIOS[0].hours, b: SCENARIOS[0].beds, n: SCENARIOS[0].nurse })
  const dispRef = useRef(disp)
  dispRef.current = disp
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const h = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    window.addEventListener('theme-changed', h)
    return () => window.removeEventListener('theme-changed', h)
  }, [])

  // Auto-cycle through scenarios until the visitor takes over with a click.
  useEffect(() => {
    if (userEngaged) return
    const id = setInterval(() => setActive(a => (a + 1) % SCENARIOS.length), 3400)
    return () => clearInterval(id)
  }, [userEngaged])

  // Roll the three headline numbers toward the active scenario's outputs.
  useEffect(() => {
    const s = SCENARIOS[active]
    const from = { ...dispRef.current }
    const to = { h: s.hours, b: s.beds, n: s.nurse }
    const start = performance.now()
    const dur = 620
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const e = easeOutCubic(t)
      setDisp({
        h: Math.round(from.h + (to.h - from.h) * e),
        b: Math.round(from.b + (to.b - from.b) * e),
        n: Math.round(from.n + (to.n - from.n) * e),
      })
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  const s = SCENARIOS[active]
  const line = toneVar(s.tone)
  const linePath = s.occ.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${xAt(N - 1).toFixed(1)} ${BASE_Y} L ${xAt(0).toFixed(1)} ${BASE_Y} Z`
  const capY = yAt(CAPACITY)
  const crossX = crossingX(s.occ)

  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'
  const panelBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'
  const panelBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'
  const panelShadow = isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'

  const stats = [
    { label: 'Hours to overflow', value: disp.h, unit: 'h', tone: hoursTone(s.hours), sub: 'until beds run out' },
    { label: 'Beds short', value: disp.b, unit: '', tone: bedsTone(s.beds), sub: 'at peak occupancy' },
    { label: 'Nurse-staffing gap', value: disp.n, unit: '', tone: nurseTone(s.nurse), sub: 'nurses needed' },
  ]

  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main id="main" className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Capacity &amp; Surge Planning</span>
          <h1 className="module-detail__title">Surge Simulator</h1>
          <p className="module-detail__tagline">
            Ask &lsquo;what if&rsquo; before it happens — model a surge, a ward closure, or a staffing gap and see
            hours-to-overflow and the beds you&rsquo;ll need, while there&rsquo;s still time to act.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

            {/* Panel header + scenario picker */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>What-If Console</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>Acute Floor · Capacity 42 beds</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SCENARIOS.map((sc, i) => (
                  <button
                    key={sc.key}
                    type="button"
                    className={`ss-btn${i === active ? ' ss-btn--active' : ''}`}
                    aria-pressed={i === active}
                    onClick={() => {
                      setActive(i)
                      setUserEngaged(true)
                    }}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body: stats + projected occupancy curve */}
            <div style={{ display: 'flex', gap: '18px', flex: 1, flexWrap: 'wrap' }}>

              {/* LEFT — three headline outputs */}
              <div style={{ flex: '1', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.map(st => {
                  const tone = toneVar(st.tone)
                  return (
                    <div key={st.label} style={{ flex: 1, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '12px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: panelShadow }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>{st.label}</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1, color: tone, transition: 'color 0.55s ease', fontVariantNumeric: 'tabular-nums' }}>
                          {st.value}
                        </span>
                        {st.unit && <span style={{ fontSize: '1.1rem', fontWeight: 700, color: tone, transition: 'color 0.55s ease' }}>{st.unit}</span>}
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{st.sub}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* RIGHT — projected occupancy chart */}
              <div style={{ flex: '1.35', minWidth: '260px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', boxShadow: panelShadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '10px' }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Projected Occupancy</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.66rem', fontWeight: 600, color: line, transition: 'color 0.55s ease' }}>
                      <span className="ss-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: line, display: 'inline-block' }} />
                      {s.note}
                    </span>
                  </div>
                  <div style={{ flex: 1, minHeight: '128px' }}>
                    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="ssArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={line} stopOpacity="0.26" />
                          <stop offset="100%" stopColor={line} stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* horizontal guide lines */}
                      {[0, 1, 2, 3].map(g => {
                        const gy = TOP_Y + (g * (BASE_Y - TOP_Y)) / 3
                        return <line key={g} x1={PAD_L} y1={gy} x2={CHART_W - PAD_R} y2={gy} stroke={gridColor} strokeWidth="1" />
                      })}

                      {/* capacity threshold */}
                      <line x1={PAD_L} y1={capY} x2={CHART_W - PAD_R} y2={capY} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
                      <text x={CHART_W - PAD_R} y={capY - 5} textAnchor="end" fontSize="8" fontWeight="700" fill="var(--text-muted)">Capacity</text>

                      {/* redraw per scenario — key replays the draw-in animation */}
                      <path key={`a-${s.key}`} className="ss-area" d={areaPath} fill="url(#ssArea)" />
                      <path
                        key={`l-${s.key}`}
                        className="ss-line"
                        d={linePath}
                        fill="none"
                        stroke={line}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        style={{ transition: 'stroke 0.55s ease' }}
                      />

                      {/* overflow marker where the curve crosses capacity */}
                      {crossX !== null && (
                        <g key={`m-${s.key}`} className="ss-mark">
                          <line x1={crossX} y1={capY} x2={crossX} y2={BASE_Y} stroke={line} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                          <circle cx={crossX} cy={capY} r="4.5" fill={line} stroke={isLight ? '#ffffff' : '#0a0b0f'} strokeWidth="2" />
                          <text x={crossX} y={capY - 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={line}>Overflow</text>
                        </g>
                      )}

                      {/* hour labels */}
                      {Array.from({ length: N }).map((_, i) =>
                        HOUR_LABELS[i] ? (
                          <text key={i} x={xAt(i)} y={CHART_H - 5} textAnchor="middle" fontSize="8" fill="var(--text-muted)">{HOUR_LABELS[i]}</text>
                        ) : null
                      )}
                    </svg>
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
                <path d="M12 3a9 9 0 1 0 9 9" />
                <path d="M12 3v9l6 3" />
                <path d="M16 3l5 2-2 5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">What-If Modeling</h3>
            <p className="module-detail__card-desc">
              Test surges, closures and staffing changes on a model of your hospital — never on the ward. Try the bad day
              as many times as you like, without ever touching the live floor.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2.5 1.5" />
                <path d="M9 2h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Hours to Overflow</h3>
            <p className="module-detail__card-desc">
              Know how long until capacity breaks under each scenario — a countdown you can watch, so you act while there
              are still hours on the clock, not minutes.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Staffing Gaps, Early</h3>
            <p className="module-detail__card-desc">
              See the nurse and bed shortfall before the shift, not during it — with enough lead time to move people,
              open capacity, or call in cover calmly.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 14l2.5 2.5L16 11" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Plan on Your Terms</h3>
            <p className="module-detail__card-desc">
              Runs on-site, in seconds, whenever you need to think ahead — every scenario stays inside your walls, ready
              the moment a question comes up in the huddle.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Surge Simulator</h2>
          <p className="module-detail__cta-desc">
            Rehearse the bad day before it arrives.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

      <style>{`
        .ss-btn {
          font-family: var(--font-family);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 7px 13px;
          border-radius: 999px;
          border: 1px solid var(--border-glass, rgba(255,255,255,0.12));
          background: var(--bg-glass, rgba(255,255,255,0.04));
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
        }
        .ss-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent-ink);
          transform: translateY(-1px);
        }
        .ss-btn--active {
          background: var(--accent-gold);
          color: var(--btn-primary-text);
          border-color: var(--accent-ink);
          box-shadow: 0 4px 14px var(--accent-glow);
        }
        [data-theme="light"] .ss-btn {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.10);
        }

        @keyframes ss-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        .ss-dot { animation: ss-pulse 1.8s infinite; }

        @keyframes ss-draw { to { stroke-dashoffset: 0; } }
        .ss-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: ss-draw 1.3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        @keyframes ss-fade { to { opacity: 1; } }
        .ss-area { opacity: 0; animation: ss-fade 1s ease forwards; animation-delay: 0.5s; }
        .ss-mark { opacity: 0; animation: ss-fade 0.5s ease forwards; animation-delay: 1.1s; }

        @media (max-width: 640px) {
          .ss-btn { font-size: 0.68rem; padding: 6px 11px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ss-line { animation: none; stroke-dashoffset: 0; }
          .ss-area, .ss-mark { animation: none; opacity: 1; }
          .ss-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
