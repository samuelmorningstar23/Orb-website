import { useState, useEffect, useRef } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

type Mode = 'ask' | 'act'

// ─── Ask mode (conversational copilot) ───
interface QA { q: string; a: string; sources: string[] }
const GREETING = 'Ask me anything clinical. I answer from your hospital’s approved references — always for your review, never as the final word.'
const QUESTIONS: QA[] = [
  {
    q: 'First-line antibiotic for suspected neutropenic sepsis?',
    a: 'Your neutropenic sepsis pathway advises empirical IV piperacillin–tazobactam within one hour of recognition, after blood cultures are drawn. Add gentamicin if the patient is unstable or a Gram-negative source is suspected. Check for penicillin allergy first.',
    sources: ['Neutropenic Sepsis Pathway', 'Antimicrobial Guideline'],
  },
  {
    q: 'Max paracetamol dose if the patient is under 50 kg?',
    a: 'Under 50 kg, cap paracetamol at 15 mg/kg per dose and 60 mg/kg (or 3 g) in 24 hours — whichever is lower. Reduce further with hepatic impairment, malnutrition, or chronic alcohol use.',
    sources: ['Trust Formulary', 'BNF reference set'],
  },
  {
    q: 'Is treatment-dose enoxaparin safe in stage 4 CKD?',
    a: 'In severe renal impairment (eGFR < 30) treatment-dose enoxaparin accumulates and raises bleeding risk. Your anticoagulation guidance advises a reduced dose with anti-Xa monitoring, or switching to unfractionated heparin. Confirm the current eGFR before prescribing.',
    sources: ['Anticoagulation Guideline'],
  },
]

// ─── Act mode (agentic execution) ───
type ScenarioKey = 'sepsis' | 'hold'
interface Scenario { label: string; exchange: { who: string; text: string }[]; action: string; rationale: string; downstream: string[] }
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

interface ChatMsg { id: number; role: 'user' | 'sage'; text: string; sources?: string[]; done: boolean }

/**
 * Sage — ambient clinical copilot with two modes behind a toggle: "Ask Sage"
 * streams referenced answers to suggested clinical questions, and "Sage in
 * action" follows a ward conversation, proposes an action and carries it out
 * only once a clinician confirms. Self-contained: owns its mode toggle,
 * streaming timers and keyframes, so it can render on the Sage page and
 * inside the homepage module explorer alike.
 */
export default function SageShowcase() {
  const isLight = useIsLightTheme()

  const [mode, setMode] = useState<Mode>('ask')

  // ── Ask state ──
  const [messages, setMessages] = useState<ChatMsg[]>([{ id: 0, role: 'sage', text: GREETING, done: true }])
  const [busy, setBusy] = useState(false)
  const [usedQ, setUsedQ] = useState<number[]>([])
  const idRef = useRef(1)
  const streamRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const clearStream = () => { if (streamRef.current !== null) { window.clearInterval(streamRef.current); streamRef.current = null } }

  const ask = (qi: number) => {
    if (busy || usedQ.includes(qi)) return
    const item = QUESTIONS[qi]
    setUsedQ(prev => [...prev, qi])
    setBusy(true)
    const userId = idRef.current++
    setMessages(prev => [...prev, { id: userId, role: 'user', text: item.q, done: true }])
    const sageId = idRef.current++
    // brief "typing" beat, then stream the answer
    window.setTimeout(() => {
      setMessages(prev => [...prev, { id: sageId, role: 'sage', text: '', done: false }])
      let i = 0
      streamRef.current = window.setInterval(() => {
        i += 2
        if (i >= item.a.length) {
          clearStream()
          setMessages(prev => prev.map(m => m.id === sageId ? { ...m, text: item.a, sources: item.sources, done: true } : m))
          setBusy(false)
        } else {
          const shown = item.a.slice(0, i)
          setMessages(prev => prev.map(m => m.id === sageId ? { ...m, text: shown } : m))
        }
      }, 16)
    }, 480)
  }

  // Auto-ask the first question once so the copilot is alive on load
  useEffect(() => {
    if (mode !== 'ask') return
    const t = window.setTimeout(() => { if (usedQ.length === 0) ask(0) }, 700)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => () => clearStream(), [])
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  // ── Act state ──
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('sepsis')
  const [line1, setLine1] = useState(false)
  const [line2, setLine2] = useState(false)
  const [phase, setPhase] = useState<'observing' | 'proposing' | 'confirmed'>('observing')
  const [litChips, setLitChips] = useState(0)
  const scenario = SCENARIOS[scenarioKey]

  useEffect(() => {
    if (mode !== 'act') return
    setLine1(false); setLine2(false); setPhase('observing'); setLitChips(0)
    const timers: number[] = []
    timers.push(window.setTimeout(() => setLine1(true), 450))
    timers.push(window.setTimeout(() => setLine2(true), 1500))
    timers.push(window.setTimeout(() => setPhase('proposing'), 2600))
    return () => timers.forEach(clearTimeout)
  }, [scenarioKey, mode])

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
  const resetAct = () => {
    setLine1(false); setLine2(false); setPhase('observing'); setLitChips(0)
    window.setTimeout(() => setLine1(true), 300)
    window.setTimeout(() => setLine2(true), 1300)
    window.setTimeout(() => setPhase('proposing'), 2400)
  }

  // Demo-surface raw colours (only these branch on isLight)
  const surfaceBg = isLight ? '#fbfbfd' : '#0a0b10'
  const borderSubtle = isLight ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.08)'
  const bubbleBg = isLight ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.04)'
  const userBubbleBg = isLight ? 'rgba(122,165,199,0.14)' : 'rgba(167, 193, 217, 0.10)'
  const cardBg = isLight ? '#ffffff' : 'rgba(255,255,255,0.03)'
  const chipRestBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'

  const segBtn = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
    border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--btn-primary-text)' : 'var(--text-muted)',
  })

  return (
    <>
      <div className="module-detail__visual-frame" style={{ padding: 0, alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <div style={{ flex: 1, background: surfaceBg, display: 'flex', flexDirection: 'column', minWidth: 0, padding: 'clamp(18px, 2.6vw, 26px)', gap: '16px' }}>

          {/* Header: live indicator + mode toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span className="sage-live" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Sage Copilot
              </span>
            </div>
            <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', borderRadius: 'var(--radius-full)', background: chipRestBg, border: `1px solid ${borderSubtle}` }}>
              <button style={segBtn(mode === 'ask')} onClick={() => setMode('ask')}>Ask Sage</button>
              <button style={segBtn(mode === 'act')} onClick={() => setMode('act')}>Sage in action</button>
            </div>
          </div>

          {/* ───────── ASK MODE (chatbot) ───────── */}
          {mode === 'ask' && (
            <>
              <div ref={scrollRef} style={{ flex: 1, minHeight: '210px', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                {messages.map(m => (
                  <div key={m.id} className="sage-rise" style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 4px' }}>
                      {m.role === 'user' ? 'Clinician' : 'Sage'}
                    </span>
                    <div style={{
                      maxWidth: '86%', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-primary)',
                      background: m.role === 'user' ? userBubbleBg : bubbleBg,
                      border: `1px solid ${m.role === 'user' ? 'transparent' : borderSubtle}`,
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                      padding: '10px 14px', fontFamily: m.role === 'sage' ? 'var(--font-mono)' : 'inherit',
                    }}>
                      {m.text}
                      {m.role === 'sage' && !m.done && m.text === '' && (
                        <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                          <span className="sage-typing-dot" style={{ animationDelay: '0s' }} />
                          <span className="sage-typing-dot" style={{ animationDelay: '0.15s' }} />
                          <span className="sage-typing-dot" style={{ animationDelay: '0.3s' }} />
                        </span>
                      )}
                      {m.role === 'sage' && !m.done && m.text !== '' && <span className="sage-caret">▋</span>}
                    </div>
                    {m.role === 'sage' && m.done && m.sources && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '2px 4px' }}>
                        {m.sources.map(s => (
                          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-secondary)', background: chipRestBg, border: `1px solid ${borderSubtle}`, borderRadius: 'var(--radius-full)', padding: '3px 9px' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggested questions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: `1px solid ${borderSubtle}`, paddingTop: '14px' }}>
                {QUESTIONS.map((qa, i) => {
                  const used = usedQ.includes(i)
                  return (
                    <button key={i} onClick={() => ask(i)} disabled={busy || used}
                      style={{
                        fontSize: '0.76rem', fontWeight: 600, padding: '8px 13px', borderRadius: 'var(--radius-full)',
                        border: `1px solid ${borderSubtle}`, cursor: busy || used ? 'default' : 'pointer',
                        background: chipRestBg, color: used ? 'var(--text-muted)' : 'var(--text-primary)',
                        opacity: used ? 0.45 : 1, transition: 'all var(--transition-fast)',
                      }}>
                      {qa.q}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* ───────── ACT MODE (agentic) ───────── */}
          {mode === 'act' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Ambient · listening on the ward
                </span>
                <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', borderRadius: 'var(--radius-full)', background: chipRestBg, border: `1px solid ${borderSubtle}` }}>
                  {(Object.keys(SCENARIOS) as ScenarioKey[]).map(key => (
                    <button key={key} onClick={() => setScenarioKey(key)} style={{ ...segBtn(scenarioKey === key), fontSize: '0.7rem', padding: '5px 12px' }}>
                      {SCENARIOS[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, minHeight: '210px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {line1 && (
                  <div className="sage-rise" style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '92%' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-muted)' }}>{scenario.exchange[0].who}</span>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.45, color: 'var(--text-primary)', background: bubbleBg, border: `1px solid ${borderSubtle}`, borderRadius: '4px 14px 14px 14px', padding: '9px 13px' }}>{scenario.exchange[0].text}</p>
                  </div>
                )}
                {line2 && (
                  <div className="sage-rise" style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '92%' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-muted)' }}>{scenario.exchange[1].who}</span>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.45, color: 'var(--text-secondary)', background: bubbleBg, border: `1px solid ${borderSubtle}`, borderRadius: '4px 14px 14px 14px', padding: '9px 13px' }}>{scenario.exchange[1].text}</p>
                  </div>
                )}
                {!line2 && line1 && (
                  <div style={{ display: 'flex', gap: '5px', padding: '2px 4px' }}>
                    <span className="sage-typing-dot" style={{ animationDelay: '0s' }} />
                    <span className="sage-typing-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="sage-typing-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}

                {phase !== 'observing' && (
                  <div className="sage-rise" style={{ marginTop: 'auto', background: cardBg, border: '1px solid', borderColor: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: isLight ? '0 6px 24px rgba(31,38,135,0.06)' : '0 8px 30px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '9px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        Sage · proposed action
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.66rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', color: phase === 'confirmed' ? 'var(--status-ok)' : 'var(--accent)', background: phase === 'confirmed' ? (isLight ? 'rgba(5,150,105,0.1)' : 'rgba(0,230,118,0.12)') : (isLight ? 'rgba(122,165,199,0.12)' : 'rgba(167, 193, 217, 0.1)') }}>
                        {phase === 'confirmed' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                        {phase === 'confirmed' ? 'Confirmed' : 'Awaiting your confirmation'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px' }}>{scenario.action}</h4>
                    <p style={{ fontSize: '0.84rem', lineHeight: 1.45, color: 'var(--text-secondary)', marginBottom: '11px' }}>{scenario.rationale}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: chipRestBg, border: `1px solid ${borderSubtle}` }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      Grounded in your approved references
                    </div>

                    {phase === 'proposing' && (
                      <div style={{ marginTop: '15px' }}>
                        <button onClick={confirmNow} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'var(--accent)', color: 'var(--btn-primary-text)', boxShadow: 'var(--shadow-glow)' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                          Confirm
                        </button>
                        <span style={{ marginLeft: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tap to carry it out — it won’t proceed on its own.</span>
                      </div>
                    )}

                    {phase === 'confirmed' && (
                      <>
                        <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {scenario.downstream.map((label, i) => {
                            const lit = i < litChips
                            return (
                              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', fontWeight: 600, padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: lit ? 'var(--status-ok)' : borderSubtle, color: lit ? 'var(--status-ok)' : 'var(--text-muted)', background: lit ? (isLight ? 'rgba(5,150,105,0.08)' : 'rgba(0,230,118,0.08)') : chipRestBg, opacity: lit ? 1 : 0.55, transform: lit ? 'translateY(0)' : 'translateY(3px)', transition: 'all 0.35s ease' }}>
                                {lit
                                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                                  : <span className="sage-mini-spin" style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px solid rgba(150,150,150,0.25)', borderTopColor: 'var(--text-muted)', display: 'inline-block' }} />}
                                {label}
                              </span>
                            )
                          })}
                        </div>
                        {litChips >= 3 && (
                          <button onClick={resetAct} className="sage-rise" style={{ marginTop: '14px', fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ↻ Replay
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mode-aware safety note — it reads `mode`, so it lives with the showcase */}
      <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--status-ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        {mode === 'ask' ? 'Answers are decision support for a clinician to review — never the final word.' : 'Nothing happens without a clinician’s confirmation.'}
      </p>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes sage-pulse-live { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        .sage-live { animation: sage-pulse-live 1.6s ease-in-out infinite; }
        @keyframes sage-rise-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
        .sage-rise { animation: sage-rise-in 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes sage-typing { 0%,60%,100% { opacity: 0.25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        .sage-typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); display: inline-block; animation: sage-typing 1.1s ease-in-out infinite; }
        @keyframes sage-blink { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
        .sage-caret { color: var(--accent); animation: sage-blink 1s steps(1) infinite; margin-left: 1px; }
        @keyframes sage-spin { to { transform: rotate(360deg); } }
        .sage-mini-spin { animation: sage-spin 0.8s linear infinite; }
      `}</style>
    </>
  )
}
