import { useEffect, useRef, useState } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

/**
 * Vigil — live vitals monitor with an ECG trace and an early-warning score
 * that climbs into a simulated sepsis alert. Self-contained: owns its timers,
 * canvas loop, and keyframes, so it can render on the Vigil page and inside
 * the homepage module explorer alike.
 */
export default function VigilShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [warningScore, setWarningScore] = useState(2)
  const [triageText, setTriageText] = useState('Patient stable. Baseline vitals within normal limits. Continue standard ward monitoring protocols.')
  const [isAlert, setIsAlert] = useState(false)
  const isLight = useIsLightTheme()

  // Trigger the simulated deterioration alert after a few seconds, clear on unmount
  useEffect(() => {
    let streamTimer: ReturnType<typeof setInterval> | undefined

    const timer = setTimeout(() => {
      setWarningScore(7)
      setIsAlert(true)

      // Stream clinical triage advice
      const fullText = 'WARNING: Sepsis trajectory suspected. Heart rate increased from 74 to 108 bpm over 2h; temperature elevated to 39.0°C. Recommendation: 1) Initiate sepsis care bundle, 2) Obtain blood cultures, 3) Notify ICU outreach team, 4) Secure IV access and begin fluid resuscitation.'
      let currentIdx = 0
      setTriageText('')

      streamTimer = setInterval(() => {
        if (currentIdx < fullText.length) {
          setTriageText(prev => prev + fullText.charAt(currentIdx))
          currentIdx++
        } else {
          clearInterval(streamTimer)
        }
      }, 25)
    }, 4500)

    return () => {
      clearTimeout(timer)
      clearInterval(streamTimer)
    }
  }, [])

  // ECG canvas drawing loop
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

    const resize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      points = new Array(width).fill(height / 2)
      index = 0
    }
    window.addEventListener('resize', resize)

    // Clean ECG waveform: P-wave, Q-R-S complex, T-wave, flatline
    const ecgCycle = [0, 0, 0, 0, 0, 0, 2, 4, 0, -2, -30, 60, -15, 0, 2, 6, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0]
    let cycleIndex = 0

    const draw = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      ctx.fillStyle = light ? 'rgba(245, 245, 247, 0.08)' : 'rgba(0, 0, 0, 0.08)' // fade trail
      ctx.fillRect(0, 0, width, height)

      // Grid lines
      ctx.strokeStyle = light ? 'rgba(61, 118, 168, 0.06)' : 'rgba(167, 193, 217, 0.05)'
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

      const speed = isAlert ? 2 : 1.2
      cycleIndex = (cycleIndex + speed) % ecgCycle.length
      const valIndex = Math.floor(cycleIndex)
      const offset = ecgCycle[valIndex] * (height / 150)
      const nextY = height / 2 + offset

      points[index] = nextY

      // Telemetry line
      ctx.strokeStyle = isAlert ? '#FF5252' : '#00E676'
      ctx.shadowColor = isAlert ? '#FF5252' : '#00E676'
      ctx.shadowBlur = 10
      ctx.lineWidth = 2.5
      ctx.beginPath()

      const gap = 15 // scanning gap, like a bedside monitor
      for (let i = 0; i < width; i++) {
        if (Math.abs(i - index) < gap) continue
        if (i === 0) {
          ctx.moveTo(i, points[i])
        } else if (Math.abs(i - 1 - index) >= gap) {
          ctx.lineTo(i, points[i])
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Cursor dot
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
    <>
      <div className="module-detail__visual-frame" style={{ flexDirection: 'column', padding: '24px', alignItems: 'stretch' }}>

        {/* Header vitals dashboard */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Active Monitor</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bed 04 · Raj Patel</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
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

        {/* ECG grid and canvas */}
        <div style={{ flex: 1, minHeight: '120px', position: 'relative', background: isLight ? '#f9fafb' : '#050608', borderRadius: '12px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="vigil-live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: isAlert ? 'var(--status-danger)' : 'var(--status-ok)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: isAlert ? 'var(--status-danger)' : 'var(--status-ok)' }}>
              {isAlert ? 'DETERIORATING SIGNAL' : 'LIVE VITAL STREAM'}
            </span>
          </div>
        </div>

        {/* Early-warning panel and advisory */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
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
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
          }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Early Warning Score</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isAlert ? 'var(--status-danger)' : 'var(--text-primary)', transition: 'color 0.5s' }}>
                {warningScore}
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '99px',
                fontWeight: 600,
                background: isAlert ? (isLight ? 'rgba(220,38,38,0.1)' : 'rgba(255,82,82,0.1)') : (isLight ? 'rgba(5,150,105,0.1)' : 'rgba(0,230,118,0.1)'),
                color: isAlert ? 'var(--status-danger)' : 'var(--status-ok)',
              }}>
                {isAlert ? 'High Risk' : 'Normal'}
              </span>
            </div>
          </div>

          <div style={{
            flex: '2.5',
            minWidth: '220px',
            background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)',
            border: '1px solid',
            borderColor: isAlert ? 'var(--accent)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'),
            borderRadius: '12px',
            padding: '16px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
          }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Sage · Triage Assessment
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', fontFamily: 'var(--font-mono)' }}>
              {triageText}
              <span className="vigil-cursor" style={{ background: 'var(--accent)' }}>&nbsp;</span>
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes vigil-pulse-live {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .vigil-live-dot { animation: vigil-pulse-live 1.5s infinite; }
        @keyframes vigil-blink-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .vigil-cursor {
          animation: vigil-blink-cursor 1s infinite;
          display: inline-block;
          width: 8px;
          height: 15px;
        }
      `}</style>
    </>
  )
}
