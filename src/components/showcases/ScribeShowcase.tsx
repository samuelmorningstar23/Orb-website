import { useState, useEffect, useRef } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

/**
 * Scribe - on-device dictation that streams a spoken clinical history word
 * by word, then turns it into a structured SOAP-style note. Self-contained:
 * owns its timers and keyframes, so it can render on the Scribe page and
 * inside the homepage module explorer alike.
 */
export default function ScribeShowcase() {
  const isLight = useIsLightTheme()

  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [showSoap, setShowSoap] = useState(false)
  const [step, setStep] = useState<'idle' | 'recording' | 'structuring' | 'done'>('idle')
  // Timers live in a ref so an unmount mid-dictation (the explorer swaps
  // showcases freely) can clear them instead of letting them tick on.
  const timers = useRef<{ words?: ReturnType<typeof setInterval>; structure?: ReturnType<typeof setTimeout> }>({})

  const dictationText = "Patient is a 54-year-old male presenting with acute chest pain radiating to the left arm for the past two hours. Pain is rated 8 out of 10. Vitals show blood pressure 142 over 90, heart rate 88. EKG shows minor ST elevations. Plan is to administer aspirin 325 mg orally, obtain cardiac enzymes, and schedule immediate cardiology consult."

  const startDictation = () => {
    if (isRecording) return
    setIsRecording(true)
    setTranscription('')
    setShowSoap(false)
    setStep('recording')

    let wordIndex = 0
    const words = dictationText.split(' ')

    timers.current.words = setInterval(() => {
      if (wordIndex < words.length) {
        setTranscription(prev => prev + (prev ? ' ' : '') + words[wordIndex])
        wordIndex++
      } else {
        clearInterval(timers.current.words)
        setIsRecording(false)
        setStep('structuring')

        // Turn the dictation into a structured clinical note
        timers.current.structure = setTimeout(() => {
          setStep('done')
          setShowSoap(true)
        }, 1500)
      }
    }, 120) // dictation typing speed
  }

  // Auto-start the demo on mount so it plays immediately, no click required.
  useEffect(() => {
    const kickoff = setTimeout(() => startDictation(), 600)
    const t = timers.current
    return () => {
      clearTimeout(kickoff)
      clearInterval(t.words)
      clearTimeout(t.structure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="module-detail__visual-frame" style={{ minHeight: '420px', padding: '24px', flexDirection: 'column', alignItems: 'stretch' }}>

        {/* Header / Trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Live Capture</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>On-Device Dictation</h3>
          </div>

          {/* Dictate Trigger Button */}
          <button
            onClick={startDictation}
            disabled={step === 'recording' || step === 'structuring'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: step === 'recording' ? 'rgba(220, 38, 38, 0.15)' : (isLight ? 'rgba(var(--clay-rgb), 0.1)' : 'rgba(var(--clay-rgb), 0.1)'),
              border: '1px solid',
              borderColor: step === 'recording' ? (isLight ? '#DC2626' : '#FF5252') : 'var(--accent)',
              color: step === 'recording' ? (isLight ? '#DC2626' : '#FF5252') : 'var(--accent)',
              padding: '8px 16px',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: (step === 'recording' || step === 'structuring') ? 'not-allowed' : 'pointer',
              opacity: (step === 'recording' || step === 'structuring') ? 0.7 : 1
            }}
          >
            {step === 'recording' && <span className="scribe-live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLight ? '#DC2626' : '#FF5252' }} />}
            {step === 'idle' && 'Replay'}
            {step === 'recording' && 'Listening...'}
            {step === 'structuring' && 'Structuring note…'}
            {step === 'done' && 'Replay'}
          </button>
        </div>

        {/* Soundwave container */}
        {step === 'recording' && (
          <div className="scribe-wave-container" style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', height: '40px', marginBottom: '20px' }}>
            <div className="scribe-bar" style={{ animationDelay: '0.1s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.3s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.5s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.2s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.4s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.6s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.1s' }} />
            <div className="scribe-bar" style={{ animationDelay: '0.3s' }} />
          </div>
        )}

        {/* Dictation feed & structured note output */}
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '20px', minHeight: '220px' }}>

          {/* Spoken dictation box */}
          <div style={{
            flex: 1,
            minWidth: '220px',
            background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Spoken Dictation
            </span>
            <p style={{ fontSize: '0.85rem', color: transcription ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: '1.5', fontStyle: transcription ? 'normal' : 'italic' }}>
              {transcription || "Listening for spoken clinical findings…"}
              {isRecording && <span className="scribe-cursor" style={{ background: 'var(--accent)' }}>&nbsp;</span>}
            </p>
          </div>

          {/* Structured clinical note box */}
          <div style={{
            flex: 1.2,
            minWidth: '220px',
            background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block', position: 'absolute', top: '16px', left: '16px' }}>
              Structured Clinical Note
            </span>

            {step === 'structuring' && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <div className="scribe-spinner" style={{ border: isLight ? '2px solid rgba(0,0,0,0.1)' : '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid var(--accent)', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-block', marginBottom: '8px' }} />
                <div>Turning speech into a structured note…</div>
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
                  <span style={{ color: isLight ? '#0c62b8' : 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Assessment:</span>
                  <span style={{ color: 'var(--text-primary)' }}>Acute substernal chest pain. Rule out acute myocardial infarction.</span>
                </div>
                <div>
                  <span style={{ color: 'var(--status-danger)', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', width: '90px' }}>Plan:</span>
                  <span style={{ color: 'var(--text-primary)' }}>Administer 325 mg aspirin PO immediately. Draw cardiac biomarkers. Urgent cardiology consultation.</span>
                </div>
              </div>
            )}

            {!showSoap && step !== 'structuring' && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Your structured clinical note will appear here once dictation is complete.
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        .scribe-live-dot {
          animation: scribe-pulse-live 1.5s infinite;
        }
        @keyframes scribe-pulse-live {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .scribe-bar {
          background: var(--accent);
          height: 100%;
          width: 3px;
          border-radius: 3px;
          animation: scribe-wave 1.2s ease-in-out infinite alternate;
        }
        @keyframes scribe-wave {
          0% { height: 10%; }
          100% { height: 100%; }
        }
        .scribe-spinner {
          animation: scribe-rotate-spinner 0.8s linear infinite;
        }
        @keyframes scribe-rotate-spinner {
          to { transform: rotate(360deg); }
        }
        @keyframes scribe-blink-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .scribe-cursor {
          animation: scribe-blink-cursor 1s infinite;
          display: inline-block;
          width: 8px;
          height: 15px;
        }
      `}</style>
    </>
  )
}
