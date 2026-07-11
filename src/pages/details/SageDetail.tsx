import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

type ScenarioKey = 'sepsis' | 'hold'

interface Scenario {
  label: string
  exchange: { who: string; text: string }[]
  action: string
  rationale: string
  downstream: string[]
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  sepsis: {
    label: 'Sepsis escalation',
    exchange: [
      { who: 'Dr. Amin', text: '“BP is dropping and she’s spiking a temperature — let’s start IV antibiotics and prep her for theatre.”' },
      { who: 'Nurse Okafor', text: '“She’s tachycardic too, 118. I’ll get access in now.”' },
    ],
    action: 'Start IV antibiotic · confirm dose',
    rationale: 'Aligns with your sepsis care bundle for a suspected intra-abdominal source.',
    downstream: ['Order sent to Helix', 'Theatre team alerted', 'Note filed to Scribe'],
  },
  hold: {
    label: 'Medication hold',
    exchange: [
      { who: 'Dr. Reyes', text: '“Her potassium’s come back at 5.9 and she’s on ramipril — let’s hold it for now.”' },
      { who: 'Nurse Bello', text: '“Renal function’s been drifting too. I’ll keep a close eye on her.”' },
    ],
    action: 'Hold ramipril · flag for review',
    rationale: 'Raised potassium with declining renal function matches your prescribing guidance.',
    downstream: ['Hold placed in Helix', 'Pharmacy notified', 'Note filed to Scribe'],
  },
}

export default function SageDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('sepsis')
  const [line1, setLine1] = useState(false)
  const [line2, setLine2] = useState(false)
  const [phase, setPhase] = useState<'observing' | 'proposing' | 'confirmed'>('observing')
  const [litChips, setLitChips] = useState(0)
  const [autoConfirm, setAutoConfirm] = useState(false)

  const scenario = SCENARIOS[scenarioKey]

  // Orchestrate the flow whenever the scenario changes
  useEffect(() => {
    setLine1(false)
    setLine2(false)
    setPhase('observing')
    setLitChips(0)
    setAutoConfirm(false)

    const timers: number[] = []
    timers.push(window.setTimeout(() => setLine1(true), 450))
    timers.push(window.setTimeout(() => setLine2(true), 1500))
    timers.push(window.setTimeout(() => { setPhase('proposing'); setAutoConfirm(true) }, 2600))
    // Auto-confirms after ~2.5s if the clinician has not already tapped Confirm
    timers.push(window.setTimeout(() => setPhase(prev => (prev === 'proposing' ? 'confirmed' : prev)), 2600 + 2600))

    return () => timers.forEach(clearTimeout)
  }, [scenarioKey])

  // Light the downstream chips one by one once the step is confirmed
  useEffect(() => {
    if (phase !== 'confirmed') return
    setLitChips(0)
    const timers: number[] = []
    timers.push(window.setTimeout(() => setLitChips(1), 450))
    timers.push(window.setTimeout(() => setLitChips(2), 1150))
    timers.push(window.setTimeout(() => setLitChips(3), 1850))
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const confirmNow = () => setPhase(prev => (prev === 'proposing' ? 'confirmed' : prev))

  // Demo-surface raw colours (only these branch on isLight)
  const surfaceBg = isLight ? '#fbfbfd' : '#0a0b10'
  const borderSubtle = isLight ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.08)'
  const bubbleBg = isLight ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.035)'
  const cardBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.025)'
  const chipRestBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'

  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Ambient Clinical Copilot</span>
          <h1 className="module-detail__title">Sage</h1>
          <p className="module-detail__tagline">
            Understands the clinical moment as it unfolds — then turns intent into action, with a clinician’s confirmation on every step.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ padding: 0, alignItems: 'stretch', justifyContent: 'flex-start' }}>
            <div style={{
              flex: 1,
              background: surfaceBg,
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              padding: 'clamp(20px, 3vw, 30px)',
              overflowY: 'auto',
              minWidth: 0,
            }}>

              {/* Surface header: ambient indicator + scenario selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span className="sage-live" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Ambient · listening on the ward
                  </span>
                </div>
                <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', borderRadius: 'var(--radius-full)', background: chipRestBg, border: `1px solid ${borderSubtle}` }}>
                  {(Object.keys(SCENARIOS) as ScenarioKey[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setScenarioKey(key)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        background: scenarioKey === key ? 'var(--accent-gold)' : 'transparent',
                        color: scenarioKey === key ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                      }}
                    >
                      {SCENARIOS[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observed ward exchange */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {line1 && (
                  <div className="sage-rise" style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '92%' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{scenario.exchange[0].who}</span>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.45, color: 'var(--text-primary)', background: bubbleBg, border: `1px solid ${borderSubtle}`, borderRadius: '4px 14px 14px 14px', padding: '10px 14px' }}>
                      {scenario.exchange[0].text}
                    </p>
                  </div>
                )}
                {line2 && (
                  <div className="sage-rise" style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '92%' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{scenario.exchange[1].who}</span>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.45, color: 'var(--text-secondary)', background: bubbleBg, border: `1px solid ${borderSubtle}`, borderRadius: '4px 14px 14px 14px', padding: '10px 14px' }}>
                      {scenario.exchange[1].text}
                    </p>
                  </div>
                )}
                {!line2 && line1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 4px' }}>
                    <span className="sage-typing-dot" style={{ animationDelay: '0s' }} />
                    <span className="sage-typing-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="sage-typing-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}
              </div>

              {/* Sage action card */}
              {phase !== 'observing' && (
                <div
                  className="sage-rise"
                  style={{
                    marginTop: 'auto',
                    background: cardBg,
                    border: '1px solid',
                    borderColor: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent-gold)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    boxShadow: isLight ? '0 6px 24px rgba(31,38,135,0.06)' : '0 8px 30px rgba(0,0,0,0.4)',
                    transition: 'border-color var(--transition-base)',
                  }}
                >
                  {/* Card header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent-gold)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent-gold)' }}>
                        Sage · proposed action
                      </span>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.68rem', fontWeight: 700,
                      padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      color: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent-gold)',
                      background: phase === 'confirmed'
                        ? (isLight ? 'rgba(5,150,105,0.1)' : 'rgba(0,230,118,0.12)')
                        : (isLight ? 'rgba(122,165,199,0.12)' : 'rgba(255,215,0,0.1)'),
                    }}>
                      {phase === 'confirmed' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                      {phase === 'confirmed' ? 'Confirmed' : 'Awaiting confirmation'}
                    </span>
                  </div>

                  {/* Action title + rationale */}
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '5px' }}>
                    {scenario.action}
                  </h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {scenario.rationale}
                  </p>

                  {/* Grounded chip */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)',
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    background: chipRestBg, border: `1px solid ${borderSubtle}`,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Grounded in your approved references
                  </div>

                  {/* Confirm control (proposing) or downstream chips (confirmed) */}
                  {phase === 'proposing' && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={confirmNow}
                        style={{
                          alignSelf: 'flex-start',
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '9px 20px', borderRadius: 'var(--radius-full)',
                          fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                          border: 'none', background: 'var(--accent-gold)', color: 'var(--btn-primary-text)',
                          boxShadow: 'var(--shadow-glow)', transition: 'transform var(--transition-fast)',
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Confirm
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '180px', height: '3px', borderRadius: 'var(--radius-full)', background: borderSubtle, overflow: 'hidden' }}>
                          {autoConfirm && <div className="sage-autobar" style={{ position: 'absolute', inset: 0, background: 'var(--accent-gold)', transformOrigin: 'left' }} />}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Auto-confirms in a moment</span>
                      </div>
                    </div>
                  )}

                  {phase === 'confirmed' && (
                    <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {scenario.downstream.map((label, i) => {
                        const lit = i < litChips
                        return (
                          <span
                            key={label}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              fontSize: '0.74rem', fontWeight: 600,
                              padding: '6px 12px', borderRadius: 'var(--radius-full)',
                              border: '1px solid',
                              borderColor: lit ? 'var(--status-ok)' : borderSubtle,
                              color: lit ? 'var(--status-ok)' : 'var(--text-muted)',
                              background: lit ? (isLight ? 'rgba(5,150,105,0.08)' : 'rgba(0,230,118,0.08)') : chipRestBg,
                              opacity: lit ? 1 : 0.55,
                              transform: lit ? 'translateY(0)' : 'translateY(3px)',
                              transition: 'all 0.35s ease',
                            }}
                          >
                            {lit ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            ) : (
                              <span className="sage-mini-spin" style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px solid rgba(150,150,150,0.25)', borderTopColor: 'var(--text-muted)', display: 'inline-block' }} />
                            )}
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Persistent reassurance line under the demo */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--status-ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Nothing happens without a clinician’s confirmation.
          </p>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1.5"/>
                <path d="M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48"/>
                <path d="M4.93 19.07a10 10 0 0 1 0-14.14M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Ambient Understanding</h3>
            <p className="module-detail__card-desc">
              Follows the clinical conversation on the ward and recognises what needs to happen next.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-6z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Action, Not Just Advice</h3>
            <p className="module-detail__card-desc">
              Prepares the order, the alert, or the note — and routes it to the right place the moment it is confirmed.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinician in Command</h3>
            <p className="module-detail__card-desc">
              Every proposed step waits for a clinician’s confirmation. Nothing is automated behind your back.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M6 21V7l6-4 6 4v14"/>
                <path d="M10 21v-6h4v6"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Grounded &amp; Local</h3>
            <p className="module-detail__card-desc">
              Draws only on your hospital’s approved references, and runs entirely on-site.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Sage</h2>
          <p className="module-detail__cta-desc">
            From conversation to care, in one confirmed step.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes sage-pulse-live {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .sage-live { animation: sage-pulse-live 1.6s ease-in-out infinite; }

        @keyframes sage-rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sage-rise { animation: sage-rise-in 0.45s cubic-bezier(0.22, 1, 0.36, 1); }

        @keyframes sage-typing {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        .sage-typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-muted); display: inline-block;
          animation: sage-typing 1.1s ease-in-out infinite;
        }

        @keyframes sage-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .sage-autobar { animation: sage-fill 2.5s linear forwards; }

        @keyframes sage-spin { to { transform: rotate(360deg); } }
        .sage-mini-spin { animation: sage-spin 0.8s linear infinite; }
      `}</style>
    </div>
  )
}
