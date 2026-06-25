import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

export default function ScribeDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [showSoap, setShowSoap] = useState(false)
  const [step, setStep] = useState<'idle' | 'recording' | 'parsing' | 'done'>('idle')

  const dictationText = "Patient is a 54-year-old male presenting with acute chest pain radiating to the left arm for the past two hours. Pain is rated 8 out of 10. Vitals show blood pressure 142 over 90, heart rate 88. EKG shows minor ST elevations. Plan is to administer aspirin 325 mg orally, obtain cardiac enzymes, and schedule immediate cardiology consult."

  const startDictation = () => {
    if (isRecording) return
    setIsRecording(true)
    setTranscription('')
    setShowSoap(false)
    setStep('recording')

    let wordIndex = 0
    const words = dictationText.split(' ')
    
    const streamWords = setInterval(() => {
      if (wordIndex < words.length) {
        setTranscription(prev => prev + (prev ? ' ' : '') + words[wordIndex])
        wordIndex++
      } else {
        clearInterval(streamWords)
        setIsRecording(false)
        setStep('parsing')
        
        // Simulate LLM structuring the note
        setTimeout(() => {
          setStep('done')
          setShowSoap(true)
        }, 1500)
      }
    }, 120) // dictation typing speed
  }

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
          <span className="module-detail__badge">Hands-Free Transcription</span>
          <h1 className="module-detail__title">Scribe</h1>
          <p className="module-detail__tagline">
            Fast clinical dictation. Turn spoken doctor-patient conversations into structured SOAP summaries and discharge notes in seconds.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ minHeight: '420px', padding: '24px', flexDirection: 'column', alignItems: 'stretch' }}>
            
            {/* Header / Trigger */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Transcription Engine</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>On-Premises Audio Engine</h3>
              </div>

              {/* Dictate Trigger Button */}
              <button 
                onClick={startDictation} 
                disabled={step === 'recording' || step === 'parsing'}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: step === 'recording' ? 'rgba(220, 38, 38, 0.15)' : (isLight ? 'rgba(122, 165, 199, 0.1)' : 'rgba(255, 215, 0, 0.1)'),
                  border: '1px solid',
                  borderColor: step === 'recording' ? (isLight ? '#DC2626' : '#FF5252') : 'var(--accent-gold)',
                  color: step === 'recording' ? (isLight ? '#DC2626' : '#FF5252') : 'var(--accent-gold)',
                  padding: '8px 16px',
                  borderRadius: '99px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: (step === 'recording' || step === 'parsing') ? 'not-allowed' : 'pointer',
                  opacity: (step === 'recording' || step === 'parsing') ? 0.7 : 1
                }}
              >
                {step === 'recording' && <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLight ? '#DC2626' : '#FF5252' }} />}
                {step === 'idle' && 'Start Dictation Demo'}
                {step === 'recording' && 'Listening...'}
                {step === 'parsing' && 'Structuring SOAP Note...'}
                {step === 'done' && 'Run Demo Again'}
              </button>
            </div>

            {/* Soundwave container */}
            {step === 'recording' && (
              <div className="wave-container" style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', height: '40px', marginBottom: '20px' }}>
                <div className="bar" style={{ animationDelay: '0.1s' }} />
                <div className="bar" style={{ animationDelay: '0.3s' }} />
                <div className="bar" style={{ animationDelay: '0.5s' }} />
                <div className="bar" style={{ animationDelay: '0.2s' }} />
                <div className="bar" style={{ animationDelay: '0.4s' }} />
                <div className="bar" style={{ animationDelay: '0.6s' }} />
                <div className="bar" style={{ animationDelay: '0.1s' }} />
                <div className="bar" style={{ animationDelay: '0.3s' }} />
              </div>
            )}

            {/* Transcription Feed & SOAP note output */}
            <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: '220px' }}>
              
              {/* Raw speech text box */}
              <div style={{ 
                flex: 1, 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)', 
                border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Raw Voice Input (Speech-To-Text)
                </span>
                <p style={{ fontSize: '0.85rem', color: transcription ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: '1.5', fontStyle: transcription ? 'normal' : 'italic' }}>
                  {transcription || "Click 'Start Dictation Demo' above to begin speaking clinical findings..."}
                  {isRecording && <span className="cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>}
                </p>
              </div>

              {/* Parsed SOAP notes box */}
              <div style={{ 
                flex: 1.2, 
                background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)', 
                border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block', position: 'absolute', top: '16px', left: '16px' }}>
                  Structured SOAP Output (MLX Clinical Parser)
                </span>

                {step === 'parsing' && (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <div className="spinner" style={{ border: '2px solid rgba(255,215,0,0.2)', borderTop: '2px solid var(--accent-gold)', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-block', marginBottom: '8px' }} />
                    <div>Structuring clinical categories...</div>
                  </div>
                )}

                {showSoap && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    <div>
                      <span style={{ color: isLight ? '#b27a04' : '#C8960C', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Subjective:</span>
                      <span style={{ color: 'var(--text-primary)' }}>54-year-old male with acute chest pain radiating to left arm (2 hours duration, severity 8/10).</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--status-ok)', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Objective:</span>
                      <span style={{ color: 'var(--text-primary)' }}>Vitals: BP 142/90, HR 88 bpm. EKG: Minor ST segment elevations detected.</span>
                    </div>
                    <div>
                      <span style={{ color: isLight ? '#0c62b8' : '#FFD700', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Assessment:</span>
                      <span style={{ color: 'var(--text-primary)' }}>Acute substernal chest pain. Rule out acute myocardial infarction.</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--status-danger)', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Plan:</span>
                      <span style={{ color: 'var(--text-primary)' }}>Administer 325 mg aspirin PO immediately. Draw cardiac biomarkers. Urgent cardiology consultation.</span>
                    </div>
                  </div>
                )}

                {!showSoap && step !== 'parsing' && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    SOAP formatting will render here once dictation is complete.
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Hardware Acceleration</h3>
            <p className="module-detail__card-desc">
              Runs natively on the Unified Memory of local hardware server nodes, delivering instant processing speeds.
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
            <h3 className="module-detail__card-title">Clinical Formatting</h3>
            <p className="module-detail__card-desc">
              Scribe separates raw speech blocks into structured formats (SOAP, Handoff, Discharge) matching healthcare documentation standards, preparing fields directly for EHR insertion.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">AI Transcription Correction</h3>
            <p className="module-detail__card-desc">
              Processes the raw text transcript through a secondary correction stage, correcting spelling, formatting numbers, and removing hesitation noises.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">100% Secure & Private</h3>
            <p className="module-detail__card-desc">
              Traditional speech-to-text systems stream raw patient audio to cloud APIs. Scribe works completely offline inside the hospital walls, preserving confidentiality.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Scribe</h2>
          <p className="module-detail__cta-desc">
            Hands-free dictation. Documenting patient interactions, locally and securely.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        .live-dot {
          animation: pulse-live 1.5s infinite;
        }
        @keyframes pulse-live {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .bar {
          background: var(--accent-gold);
          height: 100%;
          width: 3px;
          border-radius: 3px;
          animation: wave 1.2s ease-in-out infinite alternate;
        }
        @keyframes wave {
          0% { height: 10%; }
          100% { height: 100%; }
        }
        .spinner {
          animation: rotate-spinner 0.8s linear infinite;
        }
        @keyframes rotate-spinner {
          to { transform: rotate(360deg); }
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
