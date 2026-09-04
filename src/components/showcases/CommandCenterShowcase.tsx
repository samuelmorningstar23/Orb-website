import { useEffect, useState } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

// Pressure levels used across the ward tiles and watchlist. Each maps to a
// status token; tints are resolved per-theme in toneStyles() below.
type Pressure = 'ok' | 'warn' | 'danger'

// Per-theme status palette (matches the --status-* tokens in index.css) so we
// can build soft translucent tints for tile backgrounds and borders.
function toneStyles(p: Pressure, isLight: boolean) {
  const hex = isLight
    ? { ok: '5, 150, 105', warn: '217, 119, 6', danger: '220, 38, 38' }
    : { ok: '0, 230, 118', warn: '255, 179, 0', danger: '255, 82, 82' }
  const rgb = hex[p]
  const varName = p === 'ok' ? 'var(--status-ok)' : p === 'warn' ? 'var(--status-warn)' : 'var(--status-danger)'
  return {
    text: varName,
    bg: `rgba(${rgb}, ${isLight ? 0.08 : 0.1})`,
    border: `rgba(${rgb}, ${isLight ? 0.35 : 0.4})`,
    dot: varName,
  }
}

/**
 * Command Center - house-wide view with live census counters, an acuity
 * heatmap of ward tiles and a deterioration watchlist that gains an entry the
 * moment Ward A escalates. Self-contained: owns its timers and keyframes, so
 * it can render on the Command Center page and inside the homepage module
 * explorer alike.
 */
export default function CommandCenterShowcase() {
  const isLight = useIsLightTheme()
  // When true, Ward A tips from amber to red and a new watchlist entry appears.
  const [escalated, setEscalated] = useState(false)
  // Live top-strip counters - nudged over time so the header feels alive.
  const [census, setCensus] = useState(284)
  const [admissions, setAdmissions] = useState(37)
  const [dischargesPending, setDischargesPending] = useState(12)

  // Escalation beat: a couple of seconds after mount, a ward tips over and a
  // fresh patient surfaces on the watchlist.
  useEffect(() => {
    const t = setTimeout(() => setEscalated(true), 2600)
    return () => clearTimeout(t)
  }, [])

  // Gentle live movement on the census strip.
  useEffect(() => {
    const iv = setInterval(() => {
      setCensus(c => {
        const next = c + (Math.random() > 0.5 ? 1 : -1)
        return Math.min(288, Math.max(281, next))
      })
    }, 2100)
    return () => clearInterval(iv)
  }, [])

  // Admissions tick up, discharges pending drain down, on their own cadence.
  useEffect(() => {
    const iv = setInterval(() => {
      setAdmissions(a => (a >= 44 ? 37 : a + 1))
      setDischargesPending(d => (d <= 8 ? 12 : d - 1))
    }, 3400)
    return () => clearInterval(iv)
  }, [])

  const panelBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'
  const panelBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'
  const cardShadow = isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'

  // Ward tiles. Ward A starts under pressure and tips to critical on escalation.
  const wards: { name: string; detail: string; pressure: Pressure }[] = [
    { name: 'Ward A', detail: '92% · 3 high-acuity', pressure: escalated ? 'danger' : 'warn' },
    { name: 'ICU', detail: '100% · full', pressure: 'danger' },
    { name: 'ED', detail: '18 waiting', pressure: 'warn' },
    { name: 'Ward C', detail: '74% occupancy', pressure: 'ok' },
  ]

  // Deterioration watchlist. The third entry slides in once Ward A escalates.
  const watchlist = [
    { bed: 'Bed 27', name: 'R. Kaur', ward: 'ICU', level: 'High', pressure: 'danger' as Pressure, isNew: false },
    { bed: 'Bed 12', name: 'M. Osei', ward: 'Ward A', level: 'Rising', pressure: 'warn' as Pressure, isNew: false },
  ]

  // Small rising sparkline used as the "risk climbing" indicator.
  const RiskSpark = ({ color }: { color: string }) => (
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none" style={{ display: 'block' }}>
      <path d="M2 17 L12 15 L22 16 L32 10 L42 7 L50 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="3" r="2.5" fill={color} />
    </svg>
  )

  const counters = [
    { label: 'Census', value: census },
    { label: 'Admissions', value: admissions },
    { label: 'Discharges pending', value: dischargesPending },
  ]

  return (
    <>
      <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '20px', alignItems: 'stretch' }}>

        {/* Panel header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Command Center</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>House View · General Hospital</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="command-center-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)' }}>Live</span>
          </div>
        </div>

        {/* Top strip - live counters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {counters.map(c => (
            <div key={c.label} style={{ flex: '1', minWidth: '96px', background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '10px 14px', boxShadow: cardShadow }}>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>{c.label}</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Body - ward grid + watchlist */}
        <div style={{ display: 'flex', gap: '16px', flex: 1, flexWrap: 'wrap' }}>

          {/* LEFT - acuity heatmap of ward tiles */}
          <div style={{ flex: '1.4', minWidth: '240px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Acuity Heatmap</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', flex: 1 }}>
              {wards.map(w => {
                const tone = toneStyles(w.pressure, isLight)
                return (
                  <div
                    key={w.name}
                    style={{
                      background: tone.bg,
                      border: `1px solid ${tone.border}`,
                      borderRadius: '14px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '82px',
                      transition: 'background 0.7s ease, border-color 0.7s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tone.dot, display: 'inline-block', transition: 'background 0.7s ease' }} />
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{w.name}</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: tone.text, transition: 'color 0.7s ease' }}>{w.detail}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT - deterioration watchlist */}
          <div style={{ flex: '1', minWidth: '240px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Deterioration Watchlist</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {watchlist.map(p => {
                const tone = toneStyles(p.pressure, isLight)
                return (
                  <div key={p.bed} style={{ background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '11px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', boxShadow: cardShadow }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{p.bed}</span>{'  ·  '}{p.name}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.ward}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <RiskSpark color={tone.text} />
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: tone.text, padding: '3px 9px', borderRadius: '999px', background: tone.bg, whiteSpace: 'nowrap' }}>
                        {p.level}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* New entry slides in on escalation, tied to Ward A tipping over */}
              {escalated && (() => {
                const tone = toneStyles('danger', isLight)
                return (
                  <div className="command-center-slide-in" style={{ background: panelBg, border: `1px solid ${tone.border}`, borderRadius: '12px', padding: '11px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', boxShadow: cardShadow }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Bed 09</span>{'  ·  '}T. Adeyemi
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ward A</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <RiskSpark color={tone.text} />
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: tone.text, padding: '3px 9px', borderRadius: '999px', background: tone.bg, whiteSpace: 'nowrap' }}>
                        Climbing
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

        </div>
      </div>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes command-center-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .command-center-dot { animation: command-center-pulse 1.8s infinite; }

        @keyframes command-center-slide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .command-center-slide-in { animation: command-center-slide 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        @media (prefers-reduced-motion: reduce) {
          .command-center-dot { animation: none; opacity: 1; }
          .command-center-slide-in { animation: none; opacity: 1; }
        }
      `}</style>
    </>
  )
}
