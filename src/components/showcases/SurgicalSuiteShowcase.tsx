import { useEffect, useState } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

interface SurgeryCase {
  id: string
  room: string
  procedure: string
  patient: string
  surgeon: string
  anesthetist: string
  phase: 'pre-op' | 'intra-op' | 'post-op'
  timer: number // in seconds
  checklist: { id: string; label: string; checked: boolean }[]
}

/**
 * Surgical Suite — operating-room coordination board with a room selector,
 * staff assignments and a WHO safety checklist that walks a pre-op case into
 * active surgery. Self-contained: owns its case state, surgery timer and the
 * narrow-screen stacking styles, so it can render on the Surgical Suite page
 * and inside the homepage module explorer alike.
 */
export default function SurgicalSuiteShowcase() {
  const isLight = useIsLightTheme()

  const [cases, setCases] = useState<SurgeryCase[]>([
    {
      id: 'surg-301',
      room: 'OR Room 3',
      procedure: 'Laparoscopic Cholecystectomy',
      patient: 'Robert Miller',
      surgeon: 'Dr. Evelyn Martinez',
      anesthetist: 'Dr. Kyle Brody',
      phase: 'pre-op',
      timer: 0,
      checklist: [
        { id: 'c1', label: 'Patient identity, site, & procedure verified', checked: true },
        { id: 'c2', label: 'Surgical site marked & visible', checked: true },
        { id: 'c3', label: 'Anesthesia machine & drug check complete', checked: false },
        { id: 'c4', label: 'Pulse oximeter functioning on patient', checked: false },
        { id: 'c5', label: 'Known patient allergies reviewed', checked: true }
      ]
    },
    {
      id: 'surg-302',
      room: 'OR Room 1',
      procedure: 'Total Knee Arthroplasty',
      patient: 'Martha Vance',
      surgeon: 'Dr. John Henderson',
      anesthetist: 'Dr. Kyle Brody',
      phase: 'intra-op',
      timer: 5052, // 1h 24m 12s
      checklist: [
        { id: 'c1', label: 'Patient identity, site, & procedure verified', checked: true },
        { id: 'c2', label: 'Surgical site marked & visible', checked: true },
        { id: 'c3', label: 'Anesthesia check complete', checked: true },
        { id: 'c4', label: 'Pulse oximeter functioning', checked: true },
        { id: 'c5', label: 'Allergies reviewed', checked: true }
      ]
    },
    {
      id: 'surg-303',
      room: 'OR Room 5',
      procedure: 'Acute Appendectomy',
      patient: 'David Lee',
      surgeon: 'Dr. Evelyn Martinez',
      anesthetist: 'Dr. Robert Chen',
      phase: 'post-op',
      timer: 2700,
      checklist: []
    }
  ])

  const [activeCaseId, setActiveCaseId] = useState('surg-301')
  const [transitioning, setTransitioning] = useState(false)

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0]

  // Post-op status accent — a calm blue that reads cleanly on both themes
  const postOpColor = isLight ? '#0071e3' : '#2997ff'

  // Timer simulation for active surgery
  useEffect(() => {
    const interval = setInterval(() => {
      setCases(prev => prev.map(c => {
        if (c.phase === 'intra-op') {
          return { ...c, timer: c.timer + 1 }
        }
        return c
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0')
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const startSurgeryPhase = () => {
    if (activeCase.phase !== 'pre-op' || transitioning) return
    setTransitioning(true)

    // Complete checklist sequentially with animations
    let checkIdx = 0
    const unchecked = activeCase.checklist.filter(item => !item.checked)

    const checkTimer = setInterval(() => {
      if (checkIdx < unchecked.length) {
        const itemToCheck = unchecked[checkIdx]
        setCases(prev => prev.map(c => {
          if (c.id === activeCase.id) {
            return {
              ...c,
              checklist: c.checklist.map(item => item.id === itemToCheck.id ? { ...item, checked: true } : item)
            }
          }
          return c
        }))
        checkIdx++
      } else {
        clearInterval(checkTimer)
        // Transition to intra-op
        setTimeout(() => {
          setCases(prev => prev.map(c => {
            if (c.id === activeCase.id) {
              return { ...c, phase: 'intra-op', timer: 1 }
            }
            return c
          }))
          setTransitioning(false)
        }, 800)
      }
    }, 500)
  }

  const toggleChecklistItem = (itemId: string) => {
    if (activeCase.phase !== 'pre-op') return
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          checklist: c.checklist.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
        }
      }
      return c
    }))
  }

  return (
    <>
      <div className="module-detail__visual-frame surgical-suite-frame" style={{ minHeight: '480px', padding: '0', display: 'flex', alignItems: 'stretch' }}>

        {/* Left sidebar: OR Room Selector */}
        <div className="surgical-suite-sidebar" style={{
          width: '32%',
          background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.01)',
          borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Active Operating Rooms
          </span>
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCaseId(c.id)
              }}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                border: '1px solid',
                borderColor: activeCaseId === c.id ? 'var(--accent)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                background: activeCaseId === c.id ? (isLight ? 'rgba(122, 165, 199, 0.08)' : 'rgba(167,193,217,0.04)') : 'transparent',
                color: activeCaseId === c.id ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                boxShadow: isLight && activeCaseId !== c.id ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
              }}
            >
              <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{c.room}</span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: c.phase === 'intra-op' ? 'var(--status-danger)' : c.phase === 'pre-op' ? 'var(--status-warn)' : postOpColor,
                  display: 'inline-block'
                }} />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.procedure}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{c.patient}</span>
                <span style={{ fontWeight: 600, color: c.phase === 'intra-op' ? 'var(--status-danger)' : 'var(--text-secondary)' }}>
                  {c.phase === 'intra-op' ? formatTimer(c.timer) : c.phase.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right side: OR Dashboard */}
        <div className="surgical-suite-dashboard" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: isLight ? '#ffffff' : '#07080b', overflowY: 'auto' }}>

          {/* OR Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Active Procedure</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>{activeCase.procedure}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Status</span>
              <span style={{
                fontSize: '0.8rem',
                color: activeCase.phase === 'intra-op' ? 'var(--status-danger)' : activeCase.phase === 'pre-op' ? 'var(--status-warn)' : postOpColor,
                fontWeight: 700
              }}>
                {activeCase.phase === 'intra-op' ? `ACTIVE SURGERY (${formatTimer(activeCase.timer)})` : activeCase.phase.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Staff Assignments */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.01)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Primary Surgeon</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeCase.surgeon}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Attending Anesthesiologist</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeCase.anesthetist}</span>
            </div>
          </div>

          {/* WHO Checklist */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                WHO Surgical Safety Checklist
              </span>
              {activeCase.phase === 'pre-op' && (
                <button
                  onClick={startSurgeryPhase}
                  disabled={transitioning}
                  style={{
                    background: isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.1)',
                    border: '1px solid var(--status-ok)',
                    color: 'var(--status-ok)',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    padding: '4px 10px',
                    cursor: transitioning ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {transitioning ? 'Verifying Checklist...' : 'Initiate Incision (Start Surgery)'}
                </button>
              )}
            </div>

            <div style={{
              flex: 1,
              background: isLight ? '#f9fafb' : 'rgba(255, 255, 255, 0.02)',
              border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {activeCase.phase === 'post-op' ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '20px 0' }}>
                  Surgery complete. Patient successfully transferred to recovery unit. Checklist logs archived.
                </div>
              ) : (
                activeCase.checklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: activeCase.phase === 'pre-op' ? 'pointer' : 'default',
                      opacity: activeCase.phase === 'pre-op' ? 1 : 0.85
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '1.5px solid',
                      borderColor: item.checked ? 'var(--status-ok)' : (isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.2)'),
                      background: item.checked ? (isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.1)') : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      color: 'var(--status-ok)',
                      transition: 'all 0.2s ease'
                    }}>
                      {item.checked && '✓'}
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      color: item.checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textDecoration: item.checked && activeCase.phase === 'intra-op' ? 'line-through' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {item.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Narrow-screen stacking for the split OR-coordination demo */}
      <style>{`
        @media (max-width: 640px) {
          .surgical-suite-frame {
            flex-direction: column !important;
            aspect-ratio: auto !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .surgical-suite-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(128, 128, 128, 0.18) !important;
          }
          .surgical-suite-dashboard {
            flex: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  )
}
