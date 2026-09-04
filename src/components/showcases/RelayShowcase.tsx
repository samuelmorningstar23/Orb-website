import { useState, useEffect } from 'react'
import { useIsLightTheme } from './useIsLightTheme'
import '../../pages/details/ModuleDetails.css'

interface Message {
  sender: string
  role: 'doctor' | 'nurse' | 'pharmacist' | 'system'
  time: string
  content: string
}

interface Channel {
  id: string
  name: string
  unread: boolean
  activePatient?: string
  messages: Message[]
}

/**
 * Relay — secure clinical messaging: case-room channels on the left, a live
 * conversation on the right, and a simulated Vigil telemetry alert that lands
 * in the cardiology room a couple of seconds after mount. Self-contained: owns
 * its channel state, timers and responsive rules, so it can render on the
 * Relay page and inside the homepage module explorer alike.
 */
export default function RelayShowcase() {
  const isLight = useIsLightTheme()

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'room-302',
      name: 'room-302-cardiology',
      unread: true,
      activePatient: 'John Doe (Room 302)',
      messages: [
        { sender: 'Dr. Sarah Jenkins', role: 'doctor', time: '11:40 AM', content: 'Did we check John\'s morning potassium levels?' },
        { sender: 'Nurse Alex Thompson', role: 'nurse', time: '11:42 AM', content: 'Yes, drawn at 08:00. Potassium was 4.2 mEq/L, which is stable.' },
        { sender: 'Dr. Sarah Jenkins', role: 'doctor', time: '11:43 AM', content: 'Excellent. Keep him on current telemetry monitoring.' }
      ]
    },
    {
      id: 'icu-general',
      name: 'icu-general-staff',
      unread: false,
      activePatient: 'ICU Unit',
      messages: [
        { sender: 'Nurse Emily Vance', role: 'nurse', time: '10:15 AM', content: 'Bed 4 is cleared and prepped for the next admission.' },
        { sender: 'Dr. Robert Chen', role: 'doctor', time: '10:22 AM', content: 'Thanks Emily. Report from ER says candidate patient is transit-ready.' }
      ]
    },
    {
      id: 'pharmacy-orders',
      name: 'pharmacy-consults',
      unread: false,
      activePatient: 'Multi-Patient',
      messages: [
        { sender: 'Dr. Sarah Jenkins', role: 'doctor', time: '09:05 AM', content: 'Requested approval for Piperacillin order. Let me know if you need CrCl calculations.' },
        { sender: 'Pharmacist Dave Ross', role: 'pharmacist', time: '09:12 AM', content: 'Got it. Verification approved and stock dispatched.' }
      ]
    }
  ])

  const [activeChannelId, setActiveChannelId] = useState('room-302')
  const [isSimulatingAlert, setIsSimulatingAlert] = useState(false)
  const [customText, setCustomText] = useState('')

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0]

  // Distinct avatar tint per clinical role (doctor / nurse / pharmacist)
  const avatarTint = (role: Message['role']) => {
    if (role === 'doctor') {
      return { bg: isLight ? 'rgba(122, 165, 199, 0.1)' : 'rgba(41, 151, 255, 0.15)', accent: 'var(--accent)' }
    }
    if (role === 'pharmacist') {
      return { bg: isLight ? 'rgba(139, 92, 246, 0.1)' : 'rgba(167, 139, 250, 0.15)', accent: isLight ? '#7C3AED' : '#A78BFA' }
    }
    return { bg: isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.15)', accent: 'var(--status-ok)' }
  }

  const triggerMockAlert = () => {
    if (isSimulatingAlert) return
    setIsSimulatingAlert(true)

    // 1. Simulate Vigil Alert
    setTimeout(() => {
      const vigilAlert: Message = {
        sender: 'VIGIL AUTOMATED ALERT',
        role: 'system',
        time: '12:20 PM',
        content: '⚠ ALERT: Patient John Doe (Room 302) HR spike to 134 bpm (Sinus Tachycardia). SpO2 stable at 96%.'
      }
      setChannels(prev => prev.map(c => {
        if (c.id === 'room-302') {
          return { ...c, messages: [...c.messages, vigilAlert], unread: true }
        }
        return c
      }))
    }, 1000)

    // 2. Simulate Nurse reply
    setTimeout(() => {
      const nurseReply: Message = {
        sender: 'Nurse Alex Thompson',
        role: 'nurse',
        time: '12:21 PM',
        content: 'Copy that. Going into Room 302 now to check leads and assess vitals.'
      }
      setChannels(prev => prev.map(c => {
        if (c.id === 'room-302') {
          return { ...c, messages: [...c.messages, nurseReply] }
        }
        return c
      }))
    }, 3200)

    // 3. Simulate Doctor advice
    setTimeout(() => {
      const doctorReply: Message = {
        sender: 'Dr. Sarah Jenkins',
        role: 'doctor',
        time: '12:22 PM',
        content: 'Thanks Alex. If rhythm shows sustained SVT, pull up Sage drug interactions list for Adenosine.'
      }
      setChannels(prev => prev.map(c => {
        if (c.id === 'room-302') {
          return { ...c, messages: [...c.messages, doctorReply] }
        }
        return c
      }))
      setIsSimulatingAlert(false)
    }, 5500)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMockAlert()
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customText.trim()) return

    const userMsg: Message = {
      sender: 'Dr. Sarah Jenkins (You)',
      role: 'doctor',
      time: '12:23 PM',
      content: customText
    }

    setChannels(prev => prev.map(c => {
      if (c.id === activeChannelId) {
        return { ...c, messages: [...c.messages, userMsg] }
      }
      return c
    }))
    setCustomText('')
  }

  return (
    <>
      <div className="module-detail__visual-frame relay-demo" style={{ minHeight: '480px', padding: '0', display: 'flex', alignItems: 'stretch' }}>

        {/* Left sidebar: Active Case Rooms */}
        <div className="relay-demo__sidebar" style={{
          width: '32%',
          background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.01)',
          borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Channels
            </span>
          </div>

          {channels.map(c => (
            <button 
               key={c.id}
               onClick={() => {
                 setActiveChannelId(c.id)
                 // Clear unread indicator
                 setChannels(prev => prev.map(ch => ch.id === c.id ? { ...ch, unread: false } : ch))
               }} 
               style={{ 
                 textAlign: 'left', 
                 padding: '12px', 
                 borderRadius: '10px', 
                 fontSize: '0.8rem',
                 border: '1px solid',
                 borderColor: activeChannelId === c.id ? 'var(--accent)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'),
                 background: activeChannelId === c.id ? 'var(--accent-glow)' : (isLight ? '#ffffff' : 'rgba(255,255,255,0.01)'),
                 color: activeChannelId === c.id ? 'var(--accent)' : 'var(--text-secondary)',
                 position: 'relative',
                 transition: 'all 0.2s ease',
                 boxShadow: isLight && activeChannelId !== c.id ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
               }}
            >
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span># {c.name}</span>
                {c.unread && (
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%',
                    background: 'var(--status-danger)',
                    display: 'inline-block'
                  }} />
                )}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {c.activePatient}
              </div>
            </button>
          ))}
        </div>

        {/* Right side: Live Chat Conversation */}
        <div className="relay-demo__thread" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: isLight ? '#ffffff' : '#07080b' }}>
          
          {/* Chat Header */}
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                # {activeChannel.name}
              </h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Active Case: {activeChannel.activePatient}
              </span>
            </div>
          </div>

          {/* Chat Feed */}
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}>
            {activeChannel.messages.map((m, idx) => {
              const isSystem = m.role === 'system'
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: isSystem ? 'center' : 'flex-start',
                    width: '100%'
                  }}
                >
                  {isSystem ? (
                    <div style={{
                      background: isLight ? 'rgba(220, 38, 38, 0.05)' : 'rgba(255, 82, 82, 0.06)',
                      border: isLight ? '1px solid rgba(220, 38, 38, 0.15)' : '1px solid rgba(255, 82, 82, 0.15)',
                      color: isLight ? '#DC2626' : '#FF5252',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      textAlign: 'center',
                      maxWidth: '90%',
                      lineHeight: 1.4
                    }}>
                      {m.content}
                      <div style={{ fontSize: '0.6rem', color: isLight ? 'rgba(220, 38, 38, 0.7)' : 'rgba(255, 82, 82, 0.7)', marginTop: '4px' }}>
                        Auto-dispatched from Vigil Telemetry Unit • {m.time}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', maxWidth: '85%' }}>
                      {/* Mock Avatar */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: avatarTint(m.role).bg,
                        border: '1px solid',
                        borderColor: avatarTint(m.role).accent,
                        color: avatarTint(m.role).accent,
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {m.sender.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {m.sender}
                          </span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                            {m.time}
                          </span>
                        </div>
                        <div style={{ 
                          background: isLight ? '#f3f4f6' : 'rgba(255, 255, 255, 0.02)',
                          border: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.05)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          marginTop: '4px',
                          lineHeight: 1.4
                        }}>
                          {m.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Message Composer */}
          <form 
            onSubmit={handleSendMessage}
            style={{ 
              padding: '16px 20px', 
              borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '10px'
            }}
          >
            <input 
              type="text" 
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder={`Send message to #${activeChannel.name}...`}
              style={{
                flex: 1,
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.03)',
                border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                background: isLight ? 'rgba(122, 165, 199, 0.1)' : 'rgba(167, 193, 217, 0.1)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </form>

        </div>
      </div>

      {/* Responsive layout rules scoped to this showcase */}
      <style>{`
        .relay-demo { flex-direction: row; }
        @media (max-width: 640px) {
          .relay-demo { flex-direction: column !important; }
          .relay-demo__sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(128, 128, 128, 0.16) !important;
          }
          .relay-demo__thread { min-height: 320px; }
        }
      `}</style>
    </>
  )
}
