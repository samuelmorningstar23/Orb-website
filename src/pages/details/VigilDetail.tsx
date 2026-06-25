import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

export default function VigilDetail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mewsScore, setMewsScore] = useState(2)
  const [triageText, setTriageText] = useState('Patient stable. Baseline vitals within normal parameters. Continue standard ward monitoring protocols.')
  const [isAlert, setIsAlert] = useState(false)
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')

  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

  // Trigger simulated deterioration alert after 4 seconds, clear on unmount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMewsScore(7)
      setIsAlert(true)
      
      // Stream clinical triage advice
      let fullText = 'WARNING: Sepsis trajectory suspected. Heart rate increased from 74 to 108 bpm over 2h; temperature elevated to 39.0°C. Recommendation: 1) Initiate sepsis bundle protocol (Sepsis Six), 2) Obtain blood cultures, 3) Notify ICU outreach team, 4) Secure IV access and begin fluid resuscitation.'
      let currentIdx = 0
      setTriageText('')
      
      const streamTimer = setInterval(() => {
        if (currentIdx < fullText.length) {
          setTriageText(prev => prev + fullText.charAt(currentIdx))
          currentIdx++
        } else {
          clearInterval(streamTimer)
        }
      }, 25)

      return () => clearInterval(streamTimer)
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  // ECG Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight
    let points: number[] = new Array(width).fill(height / 2)
    let index = 0

    // Resize listener
    const resize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      points = new Array(width).fill(height / 2)
      index = 0
    }
    window.addEventListener('resize', resize)

    // Generate clean ECG waveform points
    // P-wave, Q-R-S complex, T-wave, flatline
    let ecgCycle = [0, 0, 0, 0, 0, 0, 2, 4, 0, -2, -30, 60, -15, 0, 2, 6, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0]
    let cycleIndex = 0

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      ctx.fillStyle = isLight ? 'rgba(245, 245, 247, 0.08)' : 'rgba(0, 0, 0, 0.08)' // fade trail
      ctx.fillRect(0, 0, width, height)

      // Grid lines
      ctx.strokeStyle = isLight ? 'rgba(61, 118, 168, 0.06)' : 'rgba(255, 215, 0, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Next value calculation
      let speed = isAlert ? 2 : 1.2
      cycleIndex = (cycleIndex + speed) % ecgCycle.length
      let valIndex = Math.floor(cycleIndex)
      let offset = ecgCycle[valIndex] * (height / 150)
      let nextY = height / 2 + offset

      points[index] = nextY

      // Draw the telemetry line
      ctx.strokeStyle = isAlert ? '#FF5252' : '#00E676'
      ctx.shadowColor = isAlert ? '#FF5252' : '#00E676'
      ctx.shadowBlur = 10
      ctx.lineWidth = 2.5
      ctx.beginPath()

      // Drawing segments
      const gap = 15 // clean scanning gap like Apple/medical screens
      for (let i = 0; i < width; i++) {
        if (Math.abs(i - index) < gap) {
          continue
        }
        if (i === 0) {
          ctx.moveTo(i, points[i])
        } else if (Math.abs(i - 1 - index) >= gap) {
          ctx.lineTo(i, points[i])
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0 // Reset

      // Pulse indicator dot at scanning cursor
      ctx.fillStyle = isAlert ? '#FF5252' : '#00E676'
      ctx.beginPath()
      ctx.arc(index, points[index], 5, 0, Math.PI * 2)
      ctx.fill()

      index = (index + 2) % width
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [isAlert])

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
          <span className="module-detail__badge">Patient Safety</span>
          <h1 className="module-detail__title">Vigil</h1>
          <p className="module-detail__tagline">
            Tracks vital signs in real time and highlights early changes in patient risk, helping clinicians prevent critical events.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>
            
            {/* Header Vitals Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Active Monitor</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bed 04 · Raj Patel</h3>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Heart Rate</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: isAlert ? 'var(--status-danger)' : 'var(--status-ok)', transition: 'color 0.5s' }}>
                    {isAlert ? '108 bpm' : '74 bpm'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Temp</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: isAlert ? 'var(--status-warn)' : 'var(--text-primary)' }}>
                    {isAlert ? '39.0 °C' : '37.0 °C'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SpO2</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--status-ok)' }}>96%</div>
                </div>
              </div>
            </div>

            {/* ECG Grid Line and Canvas */}
            <div style={{ flex: 1, position: 'relative', background: isLight ? '#f9fafb' : '#050608', borderRadius: '12px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: isAlert ? 'var(--status-danger)' : 'var(--status-ok)', display: 'inline-block' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: isAlert ? 'var(--status-danger)' : 'var(--status-ok)' }}>
                  {isAlert ? 'DETERIORATING SIGNAL' : 'LIVE VITAL STREAM'}
                </span>
              </div>
            </div>

            {/* MEWS Alert Panel & AI Recommendations */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              
              {/* MEWS Indicator */}
              <div style={{ 
                flex: '1', 
                minWidth: '200px', 
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)', 
                border: '1px solid',
                borderColor: isAlert ? 'var(--status-danger)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'), 
                borderRadius: '12px', 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'
              }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>MEWS Risk Score</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isAlert ? 'var(--status-danger)' : 'var(--text-primary)', transition: 'color 0.5s' }}>
                    {mewsScore}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '99px', 
                    fontWeight: 600,
                    background: isAlert ? (isLight ? 'rgba(220,38,38,0.1)' : 'rgba(255,82,82,0.1)') : (isLight ? 'rgba(5,150,105,0.1)' : 'rgba(0,230,118,0.1)'),
                    color: isAlert ? 'var(--status-danger)' : 'var(--status-ok)'
                  }}>
                    {isAlert ? 'High Risk' : 'Normal'}
                  </span>
                </div>
              </div>

              {/* AI Advisory */}
              <div style={{ 
                flex: '2.5', 
                minWidth: '300px', 
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)', 
                border: '1px solid',
                borderColor: isAlert ? 'var(--accent-gold)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'), 
                borderRadius: '12px', 
                padding: '16px',
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'
              }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600, display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Sage-Vigil Agent Triage Assessment
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', fontFamily: 'var(--font-mono)' }}>
                  {triageText}
                  <span className="cursor" style={{ background: 'var(--accent-gold)' }}>&nbsp;</span>
                </p>
              </div>

            </div>

          </div>
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Real-Time Engine</h3>
            <p className="module-detail__card-desc">
              Harnesses localized real-time data streaming pipelines. Connects directly to clinical monitors to process vital telemetry without latency.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Risk Scoring</h3>
            <p className="module-detail__card-desc">
              Runs automated clinical tracking systems that evaluate patient physiological trends. Instantly isolates and flags shifts from stable stats to high-risk alerts.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinical Triage Synthesis</h3>
            <p className="module-detail__card-desc">
              Leverages local clinical language models to combine physiological data with historical trends, automatically outputting human-readable assessment summaries and recommendations.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">On-Premises Privacy</h3>
            <p className="module-detail__card-desc">
              Since all assessment calculations occur entirely inside the local server rack, patient monitoring avoids the risks of cloud networks, providing total security.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Vigil</h2>
          <p className="module-detail__cta-desc">
            Continuous vigilance. Protecting patient care, locally and securely.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>

      {/* Adding custom keyframes style directly to avoid CSS pollution */}
      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .live-dot {
          animation: pulse-live 1.5s infinite;
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
