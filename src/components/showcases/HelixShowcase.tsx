import { useState, useEffect, useRef } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

interface Order {
  id: string
  patient: string
  medication: string
  dose: string
  route: string
  frequency: string
  status: 'pending' | 'verifying' | 'ready' | 'dispensed'
  logs: string[]
}

/**
 * Helix - medication verification hub: a pharmacy queue on the left and, on
 * the right, a safety-check run that streams its audit log line by line and
 * auto-starts on mount. Self-contained: owns its order state, timers and
 * keyframes, so it can render on the Helix page and inside the homepage module
 * explorer alike.
 */
export default function HelixShowcase() {
  const isLight = useIsLightTheme()

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      patient: 'John Doe (Room 302)',
      medication: 'Piperacillin-Tazobactam',
      dose: '3.375 g',
      route: 'IV',
      frequency: 'Every 6 hours',
      status: 'pending',
      logs: []
    },
    {
      id: 'ord-102',
      patient: 'Emily Vance (Room 105)',
      medication: 'Metoprolol Tartrate',
      dose: '5 mg',
      route: 'IV Push',
      frequency: 'Once - PRN Hypertension',
      status: 'ready',
      logs: ['[08:00 AM] Order received from Dr. Chen', '[08:02 AM] Local interaction check completed', '[08:02 AM] Verified by Pharmacist Dave Ross']
    },
    {
      id: 'ord-103',
      patient: 'William Harrison (Room 214)',
      medication: 'Aspirin (Delayed-Release)',
      dose: '325 mg',
      route: 'Oral',
      frequency: 'Daily',
      status: 'dispensed',
      logs: ['[07:15 AM] Order received from Dr. Jenkins', '[07:16 AM] Verified by Pharmacist Dave Ross', '[07:30 AM] Dispensed to Telemetry Ward A']
    }
  ])

  const [activeOrderId, setActiveOrderId] = useState('ord-101')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationLogs, setVerificationLogs] = useState<string[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasAutoStarted = useRef(false)

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0]

  const runVerification = () => {
    if (isVerifying) return
    if (intervalRef.current) clearInterval(intervalRef.current)

    setActiveOrderId('ord-101')
    setIsVerifying(true)
    setVerificationLogs([])
    setOrders(prev => prev.map(o => (o.id === 'ord-101' ? { ...o, status: 'pending', logs: [] } : o)))

    const simulatedLogs = [
      'Reading the patient medication record...',
      'Cross-checking active medications (Aspirin, KCl)...',
      'Checking allergies: No contraindications found.',
      'Checking drug-drug interaction: Piperacillin-Tazobactam + Aspirin -> No interactions.',
      'Validating local guidelines: 3.375g is compliant with Renal CrCl (35 mL/min).',
      'Result: Verification approved.'
    ]

    let logIdx = 0
    const logInterval = setInterval(() => {
      if (logIdx < simulatedLogs.length) {
        setVerificationLogs(prev => [...prev, simulatedLogs[logIdx]])
        logIdx++
      } else {
        clearInterval(logInterval)
        intervalRef.current = null
        setOrders(prev => prev.map(o => {
          if (o.id === 'ord-101') {
            return {
              ...o,
              status: 'ready',
              logs: [
                '[12:25 PM] Order received from Dr. Jenkins',
                ...simulatedLogs.map(l => `[12:26 PM] ${l}`)
              ]
            }
          }
          return o
        }))
        setIsVerifying(false)
      }
    }, 600)
    intervalRef.current = logInterval
  }

  // Auto-start the verification scan on mount so the demo is alive immediately
  useEffect(() => {
    if (hasAutoStarted.current) return
    hasAutoStarted.current = true
    runVerification()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="module-detail__visual-frame helix-split" style={{ minHeight: '480px', padding: '0', display: 'flex' }}>

        {/* Left sidebar: Order List */}
        <div className="helix-queue" style={{
          width: '32%',
          background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.01)', 
          borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Medication Queue
          </span>
          {orders.map(o => (
            <button 
              key={o.id}
              onClick={() => {
                setActiveOrderId(o.id)
                setVerificationLogs([])
              }} 
              style={{ 
                textAlign: 'left', 
                padding: '12px', 
                borderRadius: '10px', 
                fontSize: '0.8rem',
                border: '1px solid',
                borderColor: activeOrderId === o.id ? 'var(--accent)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                background: activeOrderId === o.id ? (isLight ? 'rgba(var(--clay-rgb), 0.08)' : 'rgba(var(--clay-rgb), 0.04)') : 'transparent',
                color: activeOrderId === o.id ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                boxShadow: isLight && activeOrderId !== o.id ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
              }}
            >
              <div style={{ fontWeight: 600 }}>{o.medication}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {o.patient}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{o.dose}</span>
                <span style={{ 
                  fontSize: '0.6rem', 
                  background: o.status === 'pending' ? (isLight ? 'rgba(217,119,6,0.1)' : 'rgba(var(--clay-rgb), 0.08)') : o.status === 'ready' ? (isLight ? 'rgba(5,150,105,0.1)' : 'rgba(0, 230, 118, 0.08)') : (isLight ? 'rgba(var(--clay-rgb), 0.1)' : 'rgba(41, 151, 255, 0.08)'),
                  color: o.status === 'pending' ? 'var(--status-warn)' : o.status === 'ready' ? 'var(--status-ok)' : 'var(--accent)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {o.status.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right side: Verification Hub */}
        <div className="helix-hub" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: isLight ? '#ffffff' : '#07080b', overflowY: 'auto' }}>
          
          {/* Order Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Active Patient</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>{activeOrder.patient}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Order ID</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeOrder.id}</span>
            </div>
          </div>

          {/* Order Details */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px', 
            background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.01)', 
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '20px' 
          }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Medication</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeOrder.medication}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Dosage & Route</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeOrder.dose} ({activeOrder.route})</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Frequency</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{activeOrder.frequency}</span>
            </div>
          </div>

          {/* Action Button */}
          {activeOrder.id === 'ord-101' && (
            <button
              onClick={runVerification}
              disabled={isVerifying}
              style={{
                width: '100%',
                background: isLight ? 'rgba(var(--clay-rgb), 0.1)' : 'rgba(var(--clay-rgb), 0.1)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isVerifying ? 'not-allowed' : 'pointer',
                marginBottom: '20px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {isVerifying && <span className="helix-spinner" style={{ border: '2px solid rgba(var(--clay-rgb), 0.2)', borderTop: '2px solid var(--accent)', borderRadius: '50%', width: '12px', height: '12px', display: 'inline-block' }} />}
              {isVerifying ? 'Running safety checks…' : 'Run again'}
            </button>
          )}

          {/* Verification & Audit Logs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Verification / Activity Logs
            </span>
            <div style={{ 
              flex: 1, 
              background: isLight ? '#f9fafb' : 'rgba(0,0,0,0.2)', 
              border: isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '8px', 
              padding: '16px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              color: isLight ? 'var(--status-ok)' : '#00E676', 
              lineHeight: '1.6', 
              overflowY: 'auto' 
            }}>
              {verificationLogs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: isLight ? 'var(--status-ok)' : '#00E676' }}>✓</span>
                  <span>{log}</span>
                </div>
              ))}
              {isVerifying && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--accent)' }}>
                  <span className="helix-spinner" style={{ border: '2px solid rgba(var(--clay-rgb), 0.2)', borderTop: '2px solid var(--accent)', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block' }} />
                  <span>Evaluating the order…</span>
                </div>
              )}

              {!isVerifying && verificationLogs.length === 0 && activeOrder.logs.map((log, idx) => (
                <div key={idx} style={{ color: 'var(--text-secondary)' }}>
                  {log}
                </div>
              ))}

              {activeOrder.status === 'pending' && !isVerifying && (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Ready for safety interaction scan. Click button above to initiate check.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Keyframes and responsive rules scoped to this showcase, so they don't leak into the page */}
      <style>{`
        @keyframes helix-rotate-spinner {
          to { transform: rotate(360deg); }
        }
        .helix-spinner {
          animation: helix-rotate-spinner 0.8s linear infinite;
        }
        @media (max-width: 640px) {
          .helix-split {
            flex-direction: column !important;
          }
          .helix-queue {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(128, 128, 128, 0.18) !important;
          }
        }
      `}</style>
    </>
  )
}
