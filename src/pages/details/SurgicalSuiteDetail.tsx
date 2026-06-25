import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import './ModuleDetails.css'

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

export default function SurgicalSuiteDetail() {
  const [isLight, setIsLight] = useState(document.documentElement.getAttribute('data-theme') === 'light')
  useEffect(() => {
    const handleTheme = () => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    }
    window.addEventListener('theme-changed', handleTheme)
    return () => window.removeEventListener('theme-changed', handleTheme)
  }, [])

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
          <span className="module-detail__badge">Operating Room Coordinator</span>
          <h1 className="module-detail__title">Surgical Suite</h1>
          <p className="module-detail__tagline">
            Complete OR orchestration. Tracks active calendars, checklists, and anesthesia handoffs to keep surgical teams securely in sync.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <div className="module-detail__visual-frame" style={{ minHeight: '480px', padding: '0', display: 'flex' }}>
            
            {/* Left sidebar: OR Room Selector */}
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
                    borderColor: activeCaseId === c.id ? 'var(--accent-gold)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                    background: activeCaseId === c.id ? (isLight ? 'rgba(122, 165, 199, 0.08)' : 'rgba(255,215,0,0.04)') : 'transparent',
                    color: activeCaseId === c.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
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
                      background: c.phase === 'intra-op' ? 'var(--status-danger)' : c.phase === 'pre-op' ? 'var(--status-warn)' : '#2997ff',
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
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: isLight ? '#ffffff' : '#07080b', overflowY: 'auto' }}>
              
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
                    color: activeCase.phase === 'intra-op' ? 'var(--status-danger)' : activeCase.phase === 'pre-op' ? 'var(--status-warn)' : '#2997ff',
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
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Checklist Enforcement</h3>
            <p className="module-detail__card-desc">
              Mandates and locks phase transitions until identity checks, site markings, and equipment safety checks are confirmed.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Real-Time Schedules</h3>
            <p className="module-detail__card-desc">
              Synchronizes surgical schedules and OR staff responsibilities in real time, projecting ongoing surgical times on overhead dashboards.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Emergency Alert Broadcasts</h3>
            <p className="module-detail__card-desc">
              Broadcasts emergency alerts (e.g. cardiac arrest, anesthesiology backup required) to nearby clinicians in Relay channel rooms in one click.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="module-detail__card-title">Clinician Rosters</h3>
            <p className="module-detail__card-desc">
              Coordinates on-call surgical shifts and nursing team allocations locally, keeping personnel details completely private.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Surgical Suite</h2>
          <p className="module-detail__cta-desc">
            Complete OR orchestration. Keeping surgeries coordinated, recorded, and secure.
          </p>
          <div className="module-detail__buttons">
            <Link to="/" className="module-detail__btn-primary">
              Back to Overview
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
