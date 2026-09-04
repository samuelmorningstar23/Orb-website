import { useMemo, useState } from 'react'
import './News2Live.css'

/**
 * NEWS2, computed in the browser with the same table the ward uses.
 *
 * This is a port of compute_news2() in the Orb server (services/vigil_service.py):
 * the RCP 2017 bands, the +2 for supplemental oxygen, the ACVPU rule, the
 * single-parameter-3 rule and the escalation responses from the nurse shift
 * service. In the product the score is computed server-side on every set of
 * observations and never re-implemented in the UI; this widget exists so a
 * visitor can see the rule work with their own numbers. It is decision support
 * on a marketing page, not a clinical tool.
 */
type Consciousness = 'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive'

interface Obs {
  rr: number
  spo2: number
  onOxygen: boolean
  sbp: number
  hr: number
  temp: number
  consciousness: Consciousness
}

interface Part { parameter: string; points: number; note: string }

interface Result {
  total: number
  parts: Part[]
  singleParam3: boolean
  level: 'stable' | 'elevated' | 'critical'
  band: string
  response: string
  intervalMinutes: number
}

function scoreNews2(o: Obs): Result {
  const parts: Part[] = []
  let total = 0
  let single3 = false
  const add = (parameter: string, points: number, note: string) => {
    total += points
    if (points === 3) single3 = true
    parts.push({ parameter, points, note })
  }

  const rr = o.rr
  if (rr <= 8) add('Respiratory rate', 3, `${rr <= 8 ? 'Severe' : 'Moderate'} bradypnea (RR ${rr})`)
  else if (rr <= 11) add('Respiratory rate', 1, `Low RR (${rr})`)
  else if (rr <= 20) add('Respiratory rate', 0, '')
  else if (rr <= 24) add('Respiratory rate', 2, `Tachypnea (RR ${rr})`)
  else add('Respiratory rate', 3, `${rr >= 30 ? 'Severe' : 'Moderate'} tachypnea (RR ${rr})`)

  const s = o.spo2
  if (s >= 96) add('SpO2', 0, '')
  else if (s >= 94) add('SpO2', 1, `Mild hypoxia (SpO2 ${s}%)`)
  else if (s >= 92) add('SpO2', 2, `Hypoxia (SpO2 ${s}%)`)
  else add('SpO2', 3, `${s < 88 ? 'Severe' : 'Moderate'} hypoxia (SpO2 ${s}%)`)

  if (o.onOxygen) add('Supplemental O2', 2, 'On supplemental oxygen')
  else add('Supplemental O2', 0, '')

  const b = o.sbp
  if (b <= 90) add('Systolic BP', 3, `${b < 80 ? 'Severe' : 'Moderate'} hypotension (SBP ${b})`)
  else if (b <= 100) add('Systolic BP', 2, `Hypotension (SBP ${b})`)
  else if (b <= 110) add('Systolic BP', 1, `Low BP (SBP ${b})`)
  else if (b <= 219) add('Systolic BP', 0, '')
  else add('Systolic BP', 3, `Severe hypertension (SBP ${b})`)

  const h = o.hr
  if (h <= 40) add('Heart rate', 3, `Severe bradycardia (HR ${h})`)
  else if (h <= 50) add('Heart rate', 1, `Bradycardia (HR ${h})`)
  else if (h <= 90) add('Heart rate', 0, '')
  else if (h <= 110) add('Heart rate', 1, `Mild tachycardia (HR ${h})`)
  else if (h <= 130) add('Heart rate', 2, `Tachycardia (HR ${h})`)
  else add('Heart rate', 3, `${h >= 140 ? 'Severe' : 'Moderate'} tachycardia (HR ${h})`)

  const t = o.temp
  if (t <= 35.0) add('Temperature', 3, `${t < 32 ? 'Severe hypothermia' : 'Hypothermia'} (${t.toFixed(1)}°C)`)
  else if (t <= 36.0) add('Temperature', 1, `Low temp (${t.toFixed(1)}°C)`)
  else if (t <= 38.0) add('Temperature', 0, '')
  else if (t <= 39.0) add('Temperature', 1, `Fever (${t.toFixed(1)}°C)`)
  else add('Temperature', 2, `High fever (${t.toFixed(1)}°C)`)

  if (o.consciousness !== 'alert') add('Consciousness (ACVPU)', 3, 'Altered consciousness (ACVPU)')
  else add('Consciousness (ACVPU)', 0, '')

  const level: Result['level'] = total >= 7 ? 'critical' : total >= 5 || single3 ? 'elevated' : 'stable'

  // Escalation, as the nurse shift service phrases it (RCP NEWS2 responses).
  let band: string, response: string, interval: number
  if (total >= 7) { band = 'NEWS2 7 or more'; interval = 30; response = 'Continuous monitoring. Emergency assessment by a critical-care-competent team.' }
  else if (total >= 5) { band = 'NEWS2 5 to 6'; interval = 60; response = 'Urgent review by a clinician competent in acute illness. Escalate now.' }
  else if (single3) { band = 'Single parameter 3'; interval = 60; response = 'A single parameter scoring 3 requires urgent review. Escalate.' }
  else if (total >= 1) { band = 'NEWS2 1 to 4'; interval = 240; response = 'Ward-based response: inform the registered nurse in charge.' }
  else { band = 'NEWS2 0'; interval = 720; response = 'Routine monitoring, minimum 12-hourly.' }

  return { total, parts, singleParam3: single3, level, band, response, intervalMinutes: interval }
}

const PRESETS: { label: string; obs: Obs }[] = [
  { label: 'Settled', obs: { rr: 16, spo2: 97, onOxygen: false, sbp: 122, hr: 76, temp: 36.8, consciousness: 'alert' } },
  { label: 'Early sepsis', obs: { rr: 24, spo2: 91, onOxygen: true, sbp: 98, hr: 112, temp: 38.4, consciousness: 'alert' } },
  { label: 'Quiet but confused', obs: { rr: 14, spo2: 96, onOxygen: false, sbp: 128, hr: 72, temp: 36.9, consciousness: 'confusion' } },
]

const CONSCIOUSNESS: { id: Consciousness; key: string; label: string }[] = [
  { id: 'alert', key: 'A', label: 'Alert' },
  { id: 'confusion', key: 'C', label: 'Confusion' },
  { id: 'voice', key: 'V', label: 'Voice' },
  { id: 'pain', key: 'P', label: 'Pain' },
  { id: 'unresponsive', key: 'U', label: 'Unresponsive' },
]

const intervalText = (m: number) => (m >= 60 ? `${m / 60}-hourly` : `every ${m} minutes`)

export default function News2Live() {
  const [obs, setObs] = useState<Obs>(PRESETS[1].obs)
  const result = useMemo(() => scoreNews2(obs), [obs])
  const set = <K extends keyof Obs>(k: K, v: Obs[K]) => setObs(o => ({ ...o, [k]: v }))

  const fields: { key: 'rr' | 'spo2' | 'sbp' | 'hr' | 'temp'; label: string; unit: string; min: number; max: number; step: number }[] = [
    { key: 'rr', label: 'Respiratory rate', unit: '/min', min: 4, max: 45, step: 1 },
    { key: 'spo2', label: 'Oxygen saturation', unit: '%', min: 70, max: 100, step: 1 },
    { key: 'sbp', label: 'Systolic BP', unit: 'mmHg', min: 60, max: 240, step: 1 },
    { key: 'hr', label: 'Heart rate', unit: 'bpm', min: 30, max: 180, step: 1 },
    { key: 'temp', label: 'Temperature', unit: '°C', min: 33, max: 41.5, step: 0.1 },
  ]
  const pointsFor = (parameter: string) => result.parts.find(p => p.parameter === parameter)?.points ?? 0

  return (
    <section className="news2" aria-label="Try the NEWS2 score">
      <div className="news2__head">
        <span className="news2__eyebrow">Try the rule</span>
        <h2 className="news2__title">The score the ward runs on, with your numbers.</h2>
        <p className="news2__lead">
          NEWS2 (Royal College of Physicians, 2017), the same table Orb applies to every set of observations. No model is involved: a nurse can check any point by hand, and the escalation sentence is the one that appears on the ward.
        </p>
        <div className="news2__presets" role="group" aria-label="Example patients">
          {PRESETS.map(p => (
            <button key={p.label} type="button" className="news2__preset" onClick={() => setObs(p.obs)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="news2__body">
        <div className="news2__inputs">
          {fields.map(f => {
            const pts = pointsFor(f.label === 'Oxygen saturation' ? 'SpO2' : f.label)
            return (
              <label key={f.key} className="news2__field">
                <span className="news2__field-label">{f.label} <em>{f.unit}</em></span>
                <span className="news2__field-row">
                  <input
                    type="number"
                    inputMode="decimal"
                    className="news2__input"
                    value={obs[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    onChange={e => { const v = Number(e.target.value); if (!Number.isNaN(v)) set(f.key, v) }}
                  />
                  <span className={'news2__pts' + (pts ? ` news2__pts--${pts}` : '')} aria-label={`${pts} points`}>{pts ? `+${pts}` : '0'}</span>
                </span>
                <input
                  type="range"
                  className="news2__range"
                  value={obs[f.key]}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  aria-label={`${f.label} slider`}
                  onChange={e => set(f.key, Number(e.target.value))}
                />
              </label>
            )
          })}

          <div className="news2__field">
            <span className="news2__field-label">Supplemental oxygen <em>{pointsFor('Supplemental O2') ? '+2' : '0'}</em></span>
            <div className="news2__segment" role="group" aria-label="Supplemental oxygen">
              <button type="button" className={'news2__seg' + (!obs.onOxygen ? ' is-active' : '')} onClick={() => set('onOxygen', false)}>On air</button>
              <button type="button" className={'news2__seg' + (obs.onOxygen ? ' is-active' : '')} onClick={() => set('onOxygen', true)}>On oxygen</button>
            </div>
          </div>

          <div className="news2__field news2__field--wide">
            <span className="news2__field-label">Consciousness (ACVPU) <em>{pointsFor('Consciousness (ACVPU)') ? '+3' : '0'}</em></span>
            <div className="news2__segment" role="group" aria-label="Consciousness">
              {CONSCIOUSNESS.map(c => (
                <button key={c.id} type="button" className={'news2__seg' + (obs.consciousness === c.id ? ' is-active' : '')} onClick={() => set('consciousness', c.id)}>
                  <b>{c.key}</b> {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`news2__result news2__result--${result.level}`} aria-live="polite">
          <div className="news2__score">
            <span className="news2__score-label">NEWS2</span>
            <span className="news2__score-value">{result.total}</span>
            <span className="news2__score-level">{result.level}</span>
          </div>
          <div className="news2__escalation">
            <span className="news2__band">{result.band}{result.singleParam3 && result.total < 5 ? '' : result.singleParam3 ? ' · a single parameter scores 3' : ''}</span>
            <p className="news2__response">{result.response}</p>
            <span className="news2__interval">Observations at least {intervalText(result.intervalMinutes)}.</span>
          </div>
          <ul className="news2__drivers">
            {result.parts.filter(p => p.points > 0).map(p => (
              <li key={p.parameter}><span className="news2__driver-pts">+{p.points}</span> {p.note}</li>
            ))}
            {result.parts.every(p => p.points === 0) && <li className="news2__driver-none">Every parameter in range.</li>}
          </ul>
          <p className="news2__foot">
            Ported from the server's compute_news2, not re-derived for this page. In Orb the score is computed on the appliance for every observation, and the nurse sees it before saving.
          </p>
        </div>
      </div>
    </section>
  )
}
