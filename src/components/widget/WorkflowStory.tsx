import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Widget from './Widget'
import { STORY_ACTS, STORY_FLOWS } from '../../data/widgetFlows'
import './WorkflowStory.css'

/**
 * One patient, three modules, on a conveyor.
 *
 * Rajesh Iyer deteriorates on the ward, the team settles it in his case room,
 * and the order is verified and carried back to his bedside. Each act is its
 * own card. When an act finishes, the whole row slides left: the card that was
 * on stage runs off the side of the page and the next one arrives from the
 * other side. It never runs backwards, so after Helix the ward comes round
 * again and the story loops.
 *
 * The loop is done by laying out three copies of the three acts and stepping a
 * counter forward for ever. When the counter has walked one full copy the row
 * is snapped back by exactly one copy, which is invisible because the card in
 * every slot is the same card it was a frame earlier.
 */
const COPIES = 3
const N = STORY_FLOWS.length
const CARDS = Array.from({ length: N * COPIES }, (_, i) => ({ i, flow: STORY_FLOWS[i % N] }))
const START = N            // start in the middle copy, so there is a card on both sides
const WRAP_AT = START + N  // one full copy later, snap back
const GAP = 30

export default function WorkflowStory() {
  const [pos, setPos] = useState(START)
  const [snap, setSnap] = useState(false)
  const [step, setStep] = useState(0)
  const [width, setWidth] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false

  useEffect(() => {
    const el = stage.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  // Once the row has walked a whole copy, put it back where it started. The
  // wait lets the slide finish first; the snap itself is not animated.
  useEffect(() => {
    if (pos < WRAP_AT) return
    const t = window.setTimeout(() => { setSnap(true); setPos(p => p - N) }, 1100)
    return () => window.clearTimeout(t)
  }, [pos])

  useEffect(() => {
    if (!snap) return
    const id = requestAnimationFrame(() => setSnap(false))
    return () => cancelAnimationFrame(id)
  }, [snap])

  const act = ((pos % N) + N) % N
  const narrow = width > 0 && width < 760
  const card = width ? (narrow ? Math.min(width - 24, 460) : Math.min(880, width * 0.72)) : 0
  const stride = card + GAP
  const left = width ? (width - card) / 2 : 0

  const next = useCallback(() => setPos(p => p + 1), [])
  const onStep = useCallback((n: number) => setStep(n), [])
  // Jumping to an act always moves the row forwards, so the conveyor never reverses.
  const goTo = (i: number) => setPos(p => p + ((i - (((p % N) + N) % N)) % N + N) % N)

  return (
    <div className="wstory">
      <div className="wstory__stage" ref={stage} style={{ ['--card-h' as string]: undefined }}>
        {CARDS.map(({ i, flow }) => {
          const slot = i - pos
          if (slot < -1 || slot > 1) return null
          const active = slot === 0
          return (
            <motion.div
              key={i}
              className={'wstory__card' + (active ? ' is-active' : '')}
              style={{ left, width: card || '60%' }}
              initial={false}
              animate={{
                x: slot * stride,
                scale: reduce ? 1 : active ? 1 : 0.86,
                opacity: active ? 1 : 0.45,
                rotateY: reduce ? 0 : active ? 0 : slot < 0 ? 12 : -12,
              }}
              transition={snap || reduce
                ? { duration: 0 }
                : { type: 'spring', stiffness: 52, damping: 16, mass: 0.9 }}
              aria-hidden={!active}
            >
              <Widget
                flows={[flow]}
                label={`${STORY_ACTS[i % N].name}: ${STORY_ACTS[i % N].hint}`}
                size="tall"
                active={active}
                onFinished={next}
                onStep={active ? onStep : undefined}
              />
            </motion.div>
          )
        })}
      </div>

      <div className="wstory__nav" role="tablist" aria-label="The story, in three acts">
        {STORY_ACTS.map((a, i) => {
          const total = STORY_FLOWS[i].steps.length
          const pct = i === act ? ((step + 1) / total) * 100 : 0
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={i === act}
              className={'wstory__act' + (i === act ? ' is-active' : '')}
              onClick={() => goTo(i)}
            >
              <span className="wstory__act-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="wstory__act-name">{a.name}</span>
              <span className="wstory__act-hint">{a.hint}</span>
              <span className="wstory__act-bar">
                <motion.span
                  className="wstory__act-fill"
                  animate={{ scaleX: pct / 100 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
