import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

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

export default function RevenueIntegrityDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  const [revealed, setRevealed] = useState(0)
  const [captured, setCaptured] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const h = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    window.addEventListener('theme-changed', h)
    return () => window.removeEventListener('theme-changed', h)
  }, [])

  // Reveal the review rows one-by-one shortly after mount, then loop softly so
  // the panel is always alive for anyone landing on the page.
  useEffect(() => {
    let step = 0
    const start = setTimeout(() => {
      const timer = setInterval(() => {
        step += 1
        setRevealed(step)
        if (step >= ITEMS.length) clearInterval(timer)
      }, 780)
    }, 500)
    return () => clearTimeout(start)
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
  const goldTint = isLight ? 'rgba(122,165,199,0.14)' : 'rgba(255,215,0,0.12)'
  const softShadow = isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'

  // A short, plain-English note snippet. Highlighted phrases are the evidence
  // the captures trace back to — the through-line of the "auditable" story.
  const Hi = ({ children }: { children: React.ReactNode }) => (
    <span style={{ background: goldTint, borderRadius: '4px', padding: '0 3px', color: 'var(--text-primary)', fontWeight: 600 }}>
      {children}
    </span>
  )

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
          <span className="module-detail__badge">Coding &amp; Reimbursement</span>
          <h1 className="module-detail__title">Revenue Integrity</h1>
          <p className="module-detail__tagline">
            Turns the care you already deliver into the reimbursement you're owed — catching the coding and documentation gaps that quietly cost hospitals millions.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Coding &amp; Documentation Review</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>Encounter #4821 · Medical Ward</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ri-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-ink)' }}>Suggested for coder review</span>
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
                          borderColor: isPrompt ? 'var(--accent-gold)' : panelBorder,
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
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
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
                          color: isPrompt ? 'var(--accent-gold)' : 'var(--status-ok)',
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
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Automated Coding Support</h3>
            <p className="module-detail__card-desc">
              Reads the care already documented and suggests accurate, well-supported codes — every one presented for your coders to review and confirm.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6M9 15h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Documentation Integrity</h3>
            <p className="module-detail__card-desc">
              Flags the gaps that quietly cause under-coding — an unspecified acuity, a missing detail — before the claim goes out, while the record can still be clarified.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Revenue Leakage, Caught</h3>
            <p className="module-detail__card-desc">
              Surfaces missed charges and unbilled services across encounters — the small, repeated losses that add up to real money over a year.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Auditable &amp; On-Site</h3>
            <p className="module-detail__card-desc">
              Every suggestion traces back to the note that supports it, and the whole review stays inside your walls — patient data never leaves the building.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Revenue Integrity</h2>
          <p className="module-detail__cta-desc">
            The care is already happening. Orb makes sure it's captured.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes ri-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .ri-dot { animation: ri-pulse 1.8s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ri-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
