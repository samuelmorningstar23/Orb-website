import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

const QUESTIONS = [
  {
    label: 'Why am I taking this medication?',
    answer:
      "This medication gently helps your heart do its work, keeping things steady and comfortable as you recover. Your care team chose it especially for you, and they'll keep checking in to make sure it's a good fit. If anything ever feels off, they're always here to talk it through with you.",
  },
  {
    label: 'What happens after I go home?',
    answer:
      "You're almost ready to head home. You'll rest, take your medication just as your team explained, and slowly return to the things you love. A nurse will call within a few days to see how you're feeling, and your next check-up is already on the calendar. You won't be doing any of this alone.",
  },
  {
    label: 'What were my test results?',
    answer:
      "Good news — your recent results were reassuring. The numbers your team has been watching have settled back toward where they'd like to see them. There's nothing here to worry about today, and your care team has gone through every result with your recovery in mind.",
  },
]

const TIMELINE = ['Admitted', 'Treatment', 'Recovering', 'Going home']
const CURRENT_STEP = 2

export default function BridgeDetail() {
  const [selected, setSelected] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  // Gently reveal the plain-language answer, one word at a time
  useEffect(() => {
    const full = QUESTIONS[selected].answer
    const words = full.split(' ')
    let idx = 0
    setAnswerText('')
    setIsTyping(true)

    if (streamRef.current) clearInterval(streamRef.current)
    streamRef.current = setInterval(() => {
      if (idx < words.length) {
        setAnswerText(prev => (prev ? prev + ' ' : '') + words[idx])
        idx++
      } else {
        setIsTyping(false)
        if (streamRef.current) clearInterval(streamRef.current)
      }
    }, 55)

    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [selected])

  const surfaceBg = isLight ? '#ffffff' : '#0b0d12'
  const innerBg = isLight ? '#f7f8fa' : 'rgba(255,255,255,0.03)'
  const hairline = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const softLine = isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.12)'

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
          <span className="module-detail__badge">Patient Understanding</span>
          <h1 className="module-detail__title">Bridge</h1>
          <p className="module-detail__tagline">
            Turns the chart into a conversation — explaining care, medications, and next steps in language every patient and family can hold onto.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div
            className="module-detail__visual-frame"
            style={{ flexDirection: 'column', padding: 'clamp(20px, 4vw, 34px)', alignItems: 'stretch', background: surfaceBg, justifyContent: 'flex-start' }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--btn-primary-text)',
                  background: 'var(--accent-gold)',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Bridge · For you</span>
                <h3 style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Your care, in plain language.
                </h3>
              </div>
            </div>

            {/* Question chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {QUESTIONS.map((q, i) => {
                const active = i === selected
                return (
                  <button
                    key={q.label}
                    onClick={() => setSelected(i)}
                    style={{
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      padding: '9px 15px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: active ? 'var(--accent-gold)' : hairline,
                      color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      background: active
                        ? (isLight ? 'rgba(122,165,199,0.12)' : 'rgba(255,215,0,0.10)')
                        : innerBg,
                      boxShadow: active ? '0 0 0 3px var(--accent-glow)' : 'none',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    {q.label}
                  </button>
                )
              })}
            </div>

            {/* Streaming plain-language answer */}
            <div
              style={{
                flex: 1,
                minHeight: '96px',
                background: innerBg,
                border: `1px solid ${hairline}`,
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                marginBottom: '22px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span
                  className={isTyping ? 'bridge-listen' : undefined}
                  style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isTyping ? 'Explaining, gently…' : 'In your words'}
                </span>
              </div>
              <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', color: 'var(--text-primary)', lineHeight: 1.6, fontFamily: 'var(--font-serif)' }}>
                {answerText}
                {isTyping && <span className="bridge-cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>}
              </p>
            </div>

            {/* Discharge timeline */}
            <div style={{ borderTop: `1px solid ${hairline}`, paddingTop: '20px' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '16px' }}>
                Your journey home
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '280px' }}>
                {TIMELINE.map((step, i) => {
                  const done = i < CURRENT_STEP
                  const active = i === CURRENT_STEP
                  const dotColor = active ? 'var(--accent-gold)' : done ? 'var(--accent-gold)' : (isLight ? '#c7ccd4' : 'rgba(255,255,255,0.22)')
                  return (
                    <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minWidth: '62px' }}>
                      {/* Connector to next step */}
                      {i < TIMELINE.length - 1 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '9px',
                            left: '50%',
                            width: '100%',
                            height: '2px',
                            background: i < CURRENT_STEP ? 'var(--accent-gold)' : softLine,
                            zIndex: 0,
                          }}
                        />
                      )}
                      {/* Dot */}
                      <span
                        className={active ? 'bridge-pulse' : undefined}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: active ? '18px' : '14px',
                          height: active ? '18px' : '14px',
                          borderRadius: '50%',
                          background: dotColor,
                          boxShadow: active ? '0 0 0 4px var(--accent-glow)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: active ? '0' : '2px',
                          transition: 'all var(--transition-base)',
                        }}
                      >
                        {done && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--btn-primary-text)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </span>
                      {/* Label */}
                      <span
                        style={{
                          marginTop: '10px',
                          fontSize: '0.74rem',
                          textAlign: 'center',
                          lineHeight: 1.25,
                          fontWeight: active ? 700 : 500,
                          color: active ? 'var(--accent-gold)' : done ? 'var(--text-secondary)' : 'var(--text-muted)',
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Plain-Language Explanations</h3>
            <p className="module-detail__card-desc">
              Translates complex clinical language into clear, reassuring words, without giving direct medical advice.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Answers, Any Time</h3>
            <p className="module-detail__card-desc">
              Lets patients ask about their care and get calm, understandable responses at their own pace.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
                <path d="M9.5 21v-6h5v6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Discharge, Made Clear</h3>
            <p className="module-detail__card-desc">
              Generates friendly summaries and timelines so patients leave knowing exactly what comes next.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Private by Design</h3>
            <p className="module-detail__card-desc">
              Every explanation is prepared inside the hospital — personal details never leave the building.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Bridge</h2>
          <p className="module-detail__cta-desc">
            Confident patients, calmer wards.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes bridge-listen {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.35); }
        }
        .bridge-listen { animation: bridge-listen 1.4s ease-in-out infinite; }

        @keyframes bridge-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .bridge-cursor {
          display: inline-block;
          width: 7px;
          height: 15px;
          margin-left: 2px;
          border-radius: 2px;
          vertical-align: text-bottom;
          animation: bridge-blink 1s steps(1) infinite;
        }

        @keyframes bridge-pulse {
          0%, 100% { box-shadow: 0 0 0 4px var(--accent-glow); }
          50% { box-shadow: 0 0 0 8px var(--accent-glow); }
        }
        .bridge-pulse { animation: bridge-pulse 2.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bridge-listen, .bridge-cursor, .bridge-pulse { animation: none; }
        }
      `}</style>
    </div>
  )
}
