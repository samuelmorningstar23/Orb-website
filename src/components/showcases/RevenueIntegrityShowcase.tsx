import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

// Review items surfaced as the encounter is read. Each is a SUGGESTION for a
// coder to review — captures are supported diagnoses, prompts are gentle nudges
// to tighten documentation before the claim goes out. Nothing bills on its own.
type ReviewItem =
  | { kind: 'capture'; label: string; evidence: string }
  | { kind: 'prompt'; label: string; evidence: string }

const ITEMS: ReviewItem[] = [
  { kind: 'capture', label: 'Severe sepsis', evidence: 'Infection with organ dysfunction documented' },
  { kind: 'capture', label: 'Acute kidney injury', evidence: 'Creatinine risen from baseline, low urine output' },
  { kind: 'prompt', label: 'Specify AKI stage to support acuity', evidence: 'Documentation prompt' },
  { kind: 'capture', label: 'Protein-calorie malnutrition', evidence: 'Nutrition consult, poor oral intake noted' },
]

// Illustrative figure the counter ticks up to for this sample encounter.
const TARGET = 3240

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Revenue Integrity — coding & documentation review of a sample encounter.
 * Suggested captures reveal one by one beside the note they trace back to,
 * while the reimbursement figure eases up to an illustrative total.
 * Self-contained: owns its timers and keyframes, so it can render on the
 * Revenue Integrity page and inside the homepage module explorer alike.
 */
export default function RevenueIntegrityShowcase() {
  const isLight = useIsLightTheme()
  const [revealed, setRevealed] = useState(0)
  const [captured, setCaptured] = useState(0)
  const rafRef = useRef<number | null>(null)

  // Reveal the review rows one-by-one shortly after mount, then loop softly so
  // the panel is always alive for anyone landing on the page.
  useEffect(() => {
    let step = 0
    let timer: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      timer = setInterval(() => {
        step += 1
        setRevealed(step)
        if (step >= ITEMS.length) clearInterval(timer)
      }, 780)
    }, 500)
    // Clear both: the explorer mounts and unmounts this showcase freely.
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [])

  // Tick the "reimbursement captured" figure up to the illustrative target with
  // an easing curve, so it settles rather than snapping.
  useEffect(() => {
    const begin = performance.now()
    const duration = 2600
    const delay = 700
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin - delay) / duration))
      setCaptured(Math.round(easeOutCubic(t) * TARGET))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const panelBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'
  const panelBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'
  const noteBg = isLight ? '#f9fafb' : 'rgba(255,255,255,0.015)'
  const okBg = isLight ? 'rgba(5,150,105,0.10)' : 'rgba(0,230,118,0.10)'
  const goldTint = isLight ? 'rgba(122,165,199,0.14)' : 'rgba(167,193,217,0.12)'
  const softShadow = isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'

  // A short, plain-English note snippet. Highlighted phrases are the evidence
  // the captures trace back to — the through-line of the "auditable" story.
  const Hi = ({ children }: { children: ReactNode }) => (
    <span style={{ background: goldTint, borderRadius: '4px', padding: '0 3px', color: 'var(--text-primary)', fontWeight: 600 }}>
      {children}
    </span>
  )

  return (
    <>
      <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

        {/* Panel header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Coding &amp; Documentation Review</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>Encounter #4821 · Medical Ward</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="revenue-integrity-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)' }}>Suggested for coder review</span>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'flex', gap: '20px', flex: 1, flexWrap: 'wrap' }}>

          {/* LEFT — clinical note snippet */}
          <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
              Clinical Note
            </span>
            <div style={{ flex: 1, background: noteBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '16px', boxShadow: softShadow }}>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                68-year-old admitted from ED with <Hi>fever and hypotension</Hi>. Blood cultures drawn; broad-spectrum antibiotics started for <Hi>suspected infection with organ dysfunction</Hi>. Lactate elevated. <Hi>Creatinine risen from baseline 0.9 to 2.1</Hi> with reduced urine output. IV fluid resuscitation ongoing. Nutrition consulted for <Hi>poor oral intake</Hi>.
              </p>
            </div>
          </div>

          {/* RIGHT — suggested capture rows */}
          <div style={{ flex: '1.05', minWidth: '260px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
              Suggested Capture
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
              {ITEMS.map((item, i) => {
                const shown = i < revealed
                const isPrompt = item.kind === 'prompt'
                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      background: panelBg,
                      border: '1px solid',
                      borderColor: isPrompt ? 'var(--accent)' : panelBorder,
                      borderRadius: '12px',
                      padding: '11px 14px',
                      boxShadow: softShadow,
                      opacity: shown ? 1 : 0,
                      transform: shown ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isPrompt ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M12 9v4M12 17h.01" />
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--status-ok)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px', paddingLeft: '23px' }}>
                        {item.evidence}
                      </div>
                    </div>
                    <span style={{
                      flexShrink: 0,
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: isPrompt ? goldTint : okBg,
                      color: isPrompt ? 'var(--accent)' : 'var(--status-ok)',
                      whiteSpace: 'nowrap',
                    }}>
                      {isPrompt ? 'Prompt' : '+captured'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom — reimbursement captured counter */}
        <div style={{ marginTop: '18px', background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', boxShadow: softShadow }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Reimbursement captured, this encounter</span>
            <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
              Illustrative — example figures, not a live claim. Coder confirms before submission.
            </div>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-ok)', lineHeight: 1, whiteSpace: 'nowrap' }}>
            +${captured.toLocaleString()}
          </span>
        </div>

      </div>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes revenue-integrity-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .revenue-integrity-dot { animation: revenue-integrity-pulse 1.8s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .revenue-integrity-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </>
  )
}
