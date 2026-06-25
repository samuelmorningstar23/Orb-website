import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

interface SampleQuery {
  question: string
  steps: string[]
  citations: string[]
  answer: string
}

const SAMPLE_QUERIES: Record<string, SampleQuery> = {
  renal: {
    question: "Review renal adjustment dosing for Piperacillin-Tazobactam.",
    steps: [
      "Vectorizing query with local embedding model...",
      "Searching local database index for clinical guidelines...",
      "Found 3 relevant sections from Stanford Antimicrobial Guide 2025.",
      "Assembling context and preparing clinical recommendation..."
    ],
    citations: ["Stanford Antimicrobial Guide 2025 (Sec 12.4)", "Sanford Guide (Renal Dosing)"],
    answer: "For adult patients with renal impairment, adjust Piperacillin-Tazobactam dosing as follows:\n\n1. CrCl 20-40 mL/min: Reduce to 3.375g IV every 6 hours (Total: 13.5g/day).\n2. CrCl < 20 mL/min: Reduce to 2.25g IV every 6 hours (Total: 9.0g/day).\n3. Hemodialysis: 2.25g IV every 8 hours, with an additional 0.75g post-dialysis dose on dialysis days.\n\nMonitor renal function daily. Avoid concurrent use of other nephrotoxic agents unless essential."
  },
  sepsis: {
    question: "Draft fluid resuscitation guidelines for pediatric sepsis.",
    steps: [
      "Vectorizing query with local embedding model...",
      "Searching local guideline database...",
      "Found 2 relevant sections from Surviving Sepsis Campaign 2024.",
      "Generating clinical response on-premises..."
    ],
    citations: ["Surviving Sepsis Campaign Guidelines 2024", "PALS Sepsis Algorithm"],
    answer: "For pediatric patients in septic shock:\n\n1. Administer fluid boluses of 10-20 mL/kg of isotonic crystalloid (normal saline or lactated Ringer's) over 5-10 minutes.\n2. Re-assess patient frequently (heart rate, perfusion, blood pressure) for signs of fluid overload (hepatomegaly, rales).\n3. Up to 40-60 mL/kg total may be given in the first hour if shock persists and no fluid overload signs are present.\n4. Initiate vasoactive therapy (epinephrine or norepinephrine) early if shock is fluid-refractory."
  },
  interactions: {
    question: "Check potential drug interactions: Warfarin + Amiodarone.",
    steps: [
      "Vectorizing query...",
      "Searching local vector database...",
      "Found 4 relevant drug profiles in FDA Labeling & Lexicomp databases.",
      "Generating report..."
    ],
    citations: ["Lexicomp Drug Interactions Index", "FDA Warfarin Monograph"],
    answer: "WARNING: High clinical significance interaction detected. Amiodarone inhibits CYP2C9, the primary metabolic pathway for S-warfarin. This leads to increased warfarin serum concentrations and increased risk of bleeding.\n\nManagement Plan:\n1. Anticipate a 30% to 50% decrease in Warfarin dose requirements when initiating Amiodarone.\n2. Monitor INR 2-3 times weekly during the first 2-3 weeks of co-administration.\n3. Educate the patient to report any unusual bruising or bleeding immediately."
  }
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

  const [activeKey, setActiveKey] = useState<keyof typeof SAMPLE_QUERIES>('renal')
  const [loadingStep, setLoadingStep] = useState(0)
  const [currentSteps, setCurrentSteps] = useState<string[]>([])
  const [outputText, setOutputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const activeQuery = SAMPLE_QUERIES[activeKey]

  useEffect(() => {
    // Reset simulation
    setLoadingStep(0)
    setCurrentSteps([])
    setOutputText('')
    setIsTyping(true)

    // Simulate RAG steps
    let stepIdx = 0
    const stepInterval = setInterval(() => {
      if (stepIdx < activeQuery.steps.length) {
        setCurrentSteps(prev => [...prev, activeQuery.steps[stepIdx]])
        setLoadingStep(stepIdx + 1)
        stepIdx++
      } else {
        clearInterval(stepInterval)
        
        // Start streaming the answer
        let textIdx = 0
        const textStream = setInterval(() => {
          if (textIdx < activeQuery.answer.length) {
            setOutputText(prev => prev + activeQuery.answer.charAt(textIdx))
            textIdx++
          } else {
            clearInterval(textStream)
            setIsTyping(false)
          }
        }, 12)
        
        return () => clearInterval(textStream)
      }
    }, 800)

    return () => clearInterval(stepInterval)
  }, [activeKey])

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
          <span className="module-detail__badge">Ambient Clinical Intelligence & Reference</span>
          <h1 className="module-detail__title">Sage</h1>
          <p className="module-detail__tagline">
            Intelligent ambient listening that captures details from patient encounters, paired with zero-latency offline references for drug profiles, dosing guidelines, and hospital protocols.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ minHeight: '480px', padding: '0', display: 'flex' }}>
            
            {/* Left sidebar: Question Selector */}
            <div style={{ 
              width: '32%', 
              background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.01)', 
              borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                Select Sample Query
              </span>
              <button 
                onClick={() => setActiveKey('renal')} 
                style={{ 
                  textAlign: 'left', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  border: '1px solid',
                  borderColor: activeKey === 'renal' ? 'var(--accent-gold)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                  background: activeKey === 'renal' ? (isLight ? 'rgba(122, 165, 199, 0.08)' : 'rgba(255,215,0,0.04)') : 'transparent',
                  color: activeKey === 'renal' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: isLight && activeKey !== 'renal' ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
                }}
              >
                1. Piperacillin Dosing
              </button>
              <button 
                onClick={() => setActiveKey('sepsis')} 
                style={{ 
                  textAlign: 'left', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  border: '1px solid',
                  borderColor: activeKey === 'sepsis' ? 'var(--accent-gold)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                  background: activeKey === 'sepsis' ? (isLight ? 'rgba(122, 165, 199, 0.08)' : 'rgba(255,215,0,0.04)') : 'transparent',
                  color: activeKey === 'sepsis' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: isLight && activeKey !== 'sepsis' ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
                }}
              >
                2. Pediatric Sepsis
              </button>
              <button 
                onClick={() => setActiveKey('interactions')} 
                style={{ 
                  textAlign: 'left', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  border: '1px solid',
                  borderColor: activeKey === 'interactions' ? 'var(--accent-gold)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                  background: activeKey === 'interactions' ? (isLight ? 'rgba(122, 165, 199, 0.08)' : 'rgba(255,215,0,0.04)') : 'transparent',
                  color: activeKey === 'interactions' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: isLight && activeKey !== 'interactions' ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
                }}
              >
                3. Drug Interactions
              </button>
            </div>

            {/* Right side: RAG Pipeline Visualization */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: isLight ? '#ffffff' : '#07080b' }}>
              
              {/* Question */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Q:</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeQuery.question}</span>
              </div>

              {/* Pipeline Step Loggers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px' }}>
                {currentSteps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--status-ok)' }}>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
                {loadingStep < activeQuery.steps.length && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
                    <span className="spinner" style={{ border: '2px solid rgba(255,215,0,0.2)', borderTop: '2px solid var(--accent-gold)', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block' }} />
                    <span>Processing pipeline...</span>
                  </div>
                )}
              </div>

              {/* RAG Answer Output */}
              <div style={{ flex: 1, position: 'relative' }}>
                {outputText ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: '1.5', fontFamily: 'var(--font-mono)' }}>
                      {outputText}
                      {isTyping && <span className="cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>}
                    </div>

                    {/* Citations badges */}
                    {!isTyping && (
                      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Citations:</span>
                        {activeQuery.citations.map((c, i) => (
                          <span key={i} style={{ 
                            fontSize: '0.65rem', 
                            background: isLight ? '#f3f4f6' : 'rgba(255,255,255,0.04)', 
                            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--accent-gold)',
                            borderRadius: '4px',
                            padding: '2px 8px'
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  loadingStep === activeQuery.steps.length && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Initializing local model stream...</span>
                  )
                )}
              </div>

            </div>

          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Local RAG Indexing</h3>
            <p className="module-detail__card-desc">
              Leverages high-speed vector lookup databases to run local vector queries across hospital operating protocols and clinical guidelines, finding matching medical entries in sub-millisecond lookups.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinical Model Inference</h3>
            <p className="module-detail__card-desc">
              Powered by advanced clinical language models running directly on local hospital hardware. Optimized for medical questions, drug profiles, and safety guidelines.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Grounded Advice</h3>
            <p className="module-detail__card-desc">
              Enforces strict guidelines. Sage extracts relevant clinical document texts first and grounds its outputs in verified, accessible manuals, avoiding AI fabrication.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Offline Execution</h3>
            <p className="module-detail__card-desc">
              Requires no internet connection. Sage processes all tokens internally on hospital hardware, ensuring complete clinical capability even in the event of external network outages.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Sage</h2>
          <p className="module-detail__cta-desc">
            Local clinical intelligence. Providing verified medical guidance, offline and securely.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes rotate-spinner {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: rotate-spinner 0.8s linear infinite;
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
