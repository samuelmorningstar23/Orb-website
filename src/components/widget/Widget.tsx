import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion'
import type { Block, Scene, Tone, WidgetFlow } from '../../data/widgetFlows'
import './Widget.css'

/**
 * The workflow widget: a small animated drawing of one Orb workflow.
 *
 * It is not the product and does not pretend to be. Each step is a state of a
 * miniature screen, and the player animates between consecutive states, so a
 * NEWS2 score that rises, a board that reorders or an interlock that fires is a
 * movement the visitor watches rather than a screenshot they have to read.
 * The content is the same claims the module page makes, on the seeded demo
 * patients the captures were taken on.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const toneClass = (t?: Tone) => (t ? ` is-${t}` : '')

function Dots() {
  return (
    <span className="wg__typing" aria-label="working">
      {[0, 1, 2].map(i => (
        <motion.i key={i} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </span>
  )
}

function BlockView({ b, reduce }: { b: Block; reduce: boolean }) {
  switch (b.k) {
    case 'tiles':
      return (
        <div className="wg__tiles">
          {b.tiles.map(t => (
            <div key={t.label} className={'wg__tile' + toneClass(t.tone)}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={t.value}
                  className="wg__tile-value"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {t.value}
                </motion.span>
              </AnimatePresence>
              <span className="wg__tile-label">{t.label}</span>
            </div>
          ))}
        </div>
      )

    case 'rows':
      return (
        <div className="wg__rows">
          {b.label && <span className="wg__label">{b.label}</span>}
          <ul className="wg__list">
            <AnimatePresence initial={false}>
              {b.rows.map(r => (
                <motion.li
                  key={r.id}
                  layout={!reduce}
                  className={'wg__row' + (r.active ? ' is-active' : '')}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.38, ease: EASE }}
                >
                  {r.score && (
                    <span className={'wg__score' + toneClass(r.tone)}>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={r.score}
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          {r.score}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  )}
                  <span className="wg__row-main">
                    <span className="wg__row-title">{r.title}</span>
                    {r.sub && <span className="wg__row-sub">{r.sub}</span>}
                  </span>
                  {r.tag && <span className={'wg__tag' + toneClass(r.tagTone)}>{r.tag}</span>}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )

    case 'banner':
      return (
        <div className={'wg__banner' + toneClass(b.tone)}>
          {b.tag && <span className="wg__banner-tag">{b.tag}</span>}
          <span className="wg__banner-title">{b.title}</span>
          {b.body && <span className="wg__banner-body">{b.body}</span>}
        </div>
      )

    case 'chat':
      return (
        <div className="wg__chat">
          {b.msgs.map((m, i) => (
            <motion.div
              key={`${m.from}-${i}-${m.text.slice(0, 12)}`}
              className={'wg__msg is-' + m.from}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: EASE, delay: i * 0.06 }}
            >
              {m.badge && <span className="wg__msg-badge">{m.badge}</span>}
              {m.typing ? <Dots /> : <span className="wg__msg-text">{m.text}</span>}
              {m.meta && <span className="wg__msg-meta">{m.meta}</span>}
            </motion.div>
          ))}
        </div>
      )

    case 'fields':
      return (
        <div className="wg__fields">
          {b.label && <span className="wg__label">{b.label}</span>}
          <div className="wg__field-grid">
            {b.fields.map(f => (
              <div key={f.label} className={'wg__field' + toneClass(f.tone)}>
                <span className="wg__field-label">{f.label}</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={f.value}
                    className="wg__field-value"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    {f.value}
                  </motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )

    case 'checks':
      return (
        <div className="wg__checks">
          {b.label && <span className="wg__label">{b.label}</span>}
          <ul className="wg__check-list">
            {b.items.map(it => (
              <motion.li
                key={it.text}
                layout={!reduce}
                className={'wg__check is-' + it.state}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <span className="wg__check-mark" aria-hidden="true" />
                <span className="wg__check-text">{it.text}</span>
              </motion.li>
            ))}
          </ul>
          {b.note && <span className="wg__note">{b.note}</span>}
        </div>
      )

    case 'meter':
      return (
        <div className={'wg__meter' + toneClass(b.tone)}>
          <div className="wg__meter-top">
            <span className="wg__label">{b.label}</span>
            <span className="wg__meter-value">{b.value}</span>
          </div>
          <div className="wg__meter-track">
            <motion.div
              className="wg__meter-fill"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${Math.max(2, Math.min(100, b.pct))}%` }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </div>
          {b.note && <span className="wg__note">{b.note}</span>}
        </div>
      )

    case 'lines':
      return (
        <div className="wg__lines">
          {b.label && <span className="wg__label">{b.label}</span>}
          <ul className="wg__line-list">
            {b.lines.map((l, i) => (
              <motion.li
                key={l.text}
                className={'wg__line' + toneClass(l.tone) + (l.strong ? ' is-strong' : '')}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE, delay: i * 0.05 }}
              >
                {l.text}
              </motion.li>
            ))}
          </ul>
        </div>
      )

    case 'chips':
      return (
        <div className="wg__chips">
          {b.chips.map(c => (
            <motion.span
              key={c.text}
              layout={!reduce}
              className={'wg__chip' + toneClass(c.tone)}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {c.text}
            </motion.span>
          ))}
        </div>
      )
  }
}

function SceneView({ scene, reduce, flowId }: { scene: Scene; reduce: boolean; flowId: string }) {
  return (
    <LayoutGroup id={`${flowId}-scene`}>
      {scene.head && (
        <div className="wg__head">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h4
              key={scene.head}
              className="wg__head-title"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {scene.head}
            </motion.h4>
          </AnimatePresence>
          {scene.sub && <span className="wg__head-sub">{scene.sub}</span>}
        </div>
      )}

      <div className="wg__blocks">
        <AnimatePresence initial={false} mode="popLayout">
          {scene.blocks.map(b => (
            <motion.div
              key={b.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <BlockView b={b} reduce={reduce} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

/**
 * A still of one step, with no caption and no controls: used on the module wall,
 * where fifteen of these sit side by side and none of them should be moving.
 */
export function WidgetStill({ flow, step = 0 }: { flow: WidgetFlow; step?: number }) {
  const scene = (flow.steps[step] ?? flow.steps[0]).scene
  return (
    <div className="wg wg--still" aria-hidden="true">
      <div className="wg__bar">
        <span className="wg__app"><i className="wg__live" />{flow.app}</span>
      </div>
      <div className="wg__screen">
        <SceneView scene={scene} reduce flowId={flow.id} />
      </div>
    </div>
  )
}

interface WidgetProps {
  flows: WidgetFlow[]
  label: string
  /** Taller screen area for the hero, where there is room. */
  size?: 'default' | 'tall'
  /** In a story, only the act on screen plays; the others sit at step one. */
  active?: boolean
  /** Called instead of looping, when the last caption has been up long enough. */
  onFinished?: () => void
  /** Reports the step the act is on, for a progress rail outside the card. */
  onStep?: (n: number, total: number) => void
}

export default function Widget({ flows, label, size = 'default', active = true, onFinished, onStep }: WidgetProps) {
  const [flowId, setFlowId] = useState(flows[0].id)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const ref = useRef<HTMLElement>(null)
  const onScreen = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion() ?? false

  const flow = flows.find(f => f.id === flowId) ?? flows[0]
  const total = flow.steps.length
  const current = flow.steps[Math.min(step, total - 1)]
  const hold = 2800 + Math.min(3600, current.caption.length * 34)

  // Autoplay while the widget is on screen. On the last step it either starts
  // again, or hands over to whatever comes next in a story.
  useEffect(() => {
    if (!playing || reduce || !onScreen || !active) return
    const last = step >= total - 1
    if (last && onFinished) {
      const t = window.setTimeout(onFinished, hold)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setStep(last ? 0 : step + 1), last ? hold + 1400 : hold)
    return () => window.clearTimeout(t)
  }, [playing, reduce, onScreen, step, total, hold, active, onFinished])

  // An act that is not on stage waits at its first step, ready to play again.
  useEffect(() => {
    if (!active) { setStep(0); setPlaying(true) }
  }, [active])

  useEffect(() => { onStep?.(step, total) }, [step, total, onStep])

  // Stepping by hand does not stop the story: it moves the step and lets the
  // clock carry on, so a visitor who clicks once is not left on a dead card.
  // Past the last step, the act hands over to whatever comes next.
  const go = (n: number) => {
    if (n >= total) { if (onFinished) onFinished(); else setStep(0); return }
    setStep(Math.max(0, n))
  }
  const pick = (id: string) => { setFlowId(id); setStep(0); setPlaying(true) }

  return (
    <figure className={'wg' + (size === 'tall' ? ' wg--tall' : '')} ref={ref} aria-label={label}>
      <div className="wg__bar">
        <span className="wg__app"><i className="wg__live" aria-hidden="true" />{flow.app}</span>
        {flow.who && <span className="wg__who">{flow.who}</span>}
        {flows.length > 1 && (
          <div className="wg__tabs" role="tablist" aria-label={`${label} workflows`}>
            {flows.map(f => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={f.id === flow.id}
                className={'wg__tab' + (f.id === flow.id ? ' is-active' : '')}
                onClick={() => pick(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div className="wg__screen" layout={!reduce}>
        <SceneView scene={current.scene} reduce={reduce} flowId={flow.id} />
      </motion.div>

      <figcaption className="wg__cap">
        <p className="wg__caption" aria-live="polite">{current.caption}</p>
        <div className="wg__ctrl">
          <span className="wg__count">{String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span className="wg__dots" aria-hidden="true">
            {flow.steps.map((_, i) => (
              <button key={i} type="button" className={'wg__pip' + (i === step ? ' is-active' : '') + (i < step ? ' is-done' : '')} onClick={() => go(i)} tabIndex={-1} aria-label={`Step ${i + 1}`} />
            ))}
          </span>
          <span className="wg__buttons">
            <button type="button" className="wg__btn" onClick={() => go(step - 1)} aria-label="Previous step">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button type="button" className="wg__btn" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause' : 'Play'} aria-pressed={playing}>
              {playing
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>}
            </button>
            <button type="button" className="wg__btn" onClick={() => go(step + 1)} aria-label={step >= total - 1 && onFinished ? 'Next act' : 'Next step'}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </span>
        </div>
        {playing && !reduce && onScreen && active && (
          <motion.span key={`${flow.id}-${step}`} className="wg__progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: hold / 1000, ease: 'linear' }} aria-hidden="true" />
        )}
      </figcaption>
    </figure>
  )
}
