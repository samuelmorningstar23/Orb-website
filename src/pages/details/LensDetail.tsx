import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

export default function LensDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  // Starts in 'scanning' so the demo reads as alive from the first frame (it auto-runs on mount)
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete'>('scanning')
  const [reportText, setReportText] = useState('')

  // Keep timer ids so we can clear them if the user navigates away mid-demo
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    }
  }, [])

  const reportData = `[DRAFT OBSERVATIONS · FOR CLINICIAN REVIEW]
Modality: Chest Radiograph (PA View)
Observations:
- Hyperlucent right pleural space with absent peripheral lung markings, measuring approximately 3.2 cm in width at the apex, consistent with a moderate right-sided pneumothorax.
- Mild contralateral tracheal and mediastinal deviation to the left side, raising concern for early tension physiology.
- Cardiorespiratory silhouette size is within normal limits.

Impression (draft):
Moderate right-sided pneumothorax with early tension displacement.

Suggested next steps for the care team:
1. STAT clinical correlation and bedside evaluation.
2. Consider immediate needle decompression or thoracostomy tube insertion (chest tube).
3. Obtain follow-up chest radiograph post-procedure to confirm lung re-expansion.

These observations are assistive and must be confirmed by a clinician.`

  const startScan = () => {
    // Clear any timers from a previous run before replaying (keeps re-runs clean)
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current)
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    setScanState('scanning')
    setReportText('')

    // Read the image for a few seconds, then stream the draft observations
    scanTimeoutRef.current = setTimeout(() => {
      setScanState('complete')

      let charIdx = 0
      streamIntervalRef.current = setInterval(() => {
        if (charIdx < reportData.length) {
          setReportText(prev => prev + reportData.charAt(charIdx))
          charIdx++
        } else if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current)
        }
      }, 10) // stream speed
    }, 3200)
  }

  // Auto-run the analysis → draft-observations animation on mount
  useEffect(() => {
    startScan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <span className="module-detail__badge">Bedside Image Review</span>
          <h1 className="module-detail__title">Lens</h1>
          <p className="module-detail__tagline">
            Bedside image analysis. Review chest X-rays, ECG traces, and scans on-device to surface draft observations for clinician review — in seconds, at the bedside.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ minHeight: '440px', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

            {/* Left Box: X-ray reader container */}
            <div style={{
              flex: 1,
              minWidth: '260px',
              position: 'relative',
              background: '#040507',
              borderRadius: '16px',
              border: isLight ? '1px solid rgba(0, 0, 0, 0.15)' : '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>

              {/* Replay control — the demo auto-runs on mount */}
              {scanState === 'complete' && (
                <button
                  onClick={startScan}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--accent-gold)',
                    color: 'var(--btn-primary-text)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    padding: '7px 14px',
                    borderRadius: '99px',
                    boxShadow: '0 4px 12px var(--accent-glow-strong)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  Replay
                </button>
              )}

              {/* The Mock Chest X-ray SVG */}
              <svg width="220" height="260" viewBox="0 0 100 120" style={{ width: '100%', maxWidth: '220px', height: 'auto', opacity: scanState === 'idle' ? 0.45 : 1, transition: 'opacity 0.5s' }}>
                <defs>
                  <radialGradient id="lung-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>

                {/* Body Outline */}
                <path d="M15 110 C15 70, 20 20, 50 20 C80 20, 85 70, 85 110 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <path d="M50 20 L50 110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" /> {/* Spine */}

                {/* Lungs */}
                <path d="M22 35 C24 30, 43 30, 45 42 C45 70, 40 98, 20 95 C18 70, 20 45, 22 35 Z" fill="url(#lung-glow)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <path d="M78 35 C76 30, 57 30, 55 42 C55 70, 60 98, 80 95 C82 70, 80 45, 78 35 Z" fill="url(#lung-glow)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                {/* Heart outline */}
                <path d="M42 65 C42 60, 48 55, 55 60 C62 65, 60 78, 50 82 C44 78, 42 70, 42 65 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

                {/* Rib lines (simplified representation) */}
                <path d="M22 45 Q35 48 44 45 M20 58 Q35 60 43 56 M20 72 Q35 74 41 68 M22 85 Q32 86 41 78" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <path d="M78 45 Q65 48 56 45 M80 58 Q65 60 57 56 M80 72 Q65 74 59 68 M78 85 Q68 86 59 78" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* Flagged-region overlay for clinician review */}
                {scanState === 'complete' && (
                  <g className="animate-fade-in">
                    <rect x="18" y="32" width="28" height="66" fill="none" stroke={isLight ? 'var(--status-danger)' : '#FF5252'} strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="20" y="28" fill={isLight ? 'var(--status-danger)' : '#FF5252'} fontSize="5" fontWeight="bold" fontFamily="var(--font-mono)">FLAGGED · PNEUMOTHORAX</text>
                  </g>
                )}
              </svg>

              {/* Active Reading Bar */}
              {scanState === 'scanning' && (
                <div className="scanning-laser" style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #2997ff, transparent)',
                  boxShadow: '0 0 12px #2997ff, 0 0 4px #2997ff',
                  zIndex: 8
                }} />
              )}

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: scanState === 'scanning' ? '#2997ff' : (scanState === 'complete' ? 'var(--status-danger)' : 'var(--text-muted)'), display: 'inline-block' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {scanState === 'idle' && 'READY'}
                  {scanState === 'scanning' && 'READING THE IMAGE…'}
                  {scanState === 'complete' && 'DRAFT OBSERVATIONS READY'}
                </span>
              </div>
            </div>

            {/* Right Box: draft observations report */}
            <div style={{
              flex: 1.2,
              minWidth: '260px',
              background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
              border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: 'auto'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Draft Observations · For Clinician Review
              </span>

              {scanState === 'idle' && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Awaiting an image. Start the demo to surface draft observations.
                </div>
              )}

              {scanState === 'scanning' && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <div className="spinner" style={{ border: '2px solid rgba(41,151,255,0.2)', borderTop: '2px solid #2997ff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-block', marginBottom: '8px' }} />
                  <div>Reading the chest radiograph on-device…</div>
                </div>
              )}

              {scanState === 'complete' && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: '1.45', fontFamily: 'var(--font-mono)' }}>
                  {reportText}
                  {reportText.length < reportData.length && <span className="cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>}
                </div>
              )}
            </div>

          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="22" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="12" x2="2" y2="12"/>
                <line x1="12" y1="6" x2="12" y2="2"/>
                <line x1="12" y1="22" x2="12" y2="18"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Device Image Intelligence</h3>
            <p className="module-detail__card-desc">
              On-device image intelligence reviews clinical images — chest X-rays, ECG traces, and scans — on hardware inside your hospital, in real time.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Anatomical Isolation</h3>
            <p className="module-detail__card-desc">
              Highlights regions of interest directly on X-rays and ECG traces, so clinicians can verify each flagged area at a glance.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Structured Draft Notes</h3>
            <p className="module-detail__card-desc">
              Organizes draft observations into familiar Observations, Impression, and next-step sections — ready for a radiologist or physician to confirm, edit, or sign off.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Site by Default</h3>
            <p className="module-detail__card-desc">
              Medical images and the observations drawn from them never leave the building. Everything stays on hardware inside your hospital — nothing is sent to the cloud.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Lens</h2>
          <p className="module-detail__cta-desc">
            On-device image analysis. Surfacing draft observations for clinician review — offline, on-site, and secure.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
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
        @keyframes laser-sweep {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .scanning-laser {
          animation: laser-sweep 2.2s linear infinite;
        }
      `}</style>
    </div>
  )
}
