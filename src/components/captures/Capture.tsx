import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import './Capture.css'

/**
 * A real screen of Orb, one frame at a time.
 *
 * Every frame here was captured by Playwright from a running Orb appliance on
 * the seeded demo database (docs/website-assets in the Orb repo). Nothing is
 * drawn, mocked or animated by hand: the "demo" is the product, stepped through
 * with a caption per step. The component owns its autoplay (only while on
 * screen, never under the pointer, never with reduced motion), keyboard arrows
 * and a small control strip, so it renders the same on a module page and
 * inside the homepage explorer.
 */
export interface CaptureFrame {
  src: string
  /** Shown in the strip under the frame. Plain sentence, no marketing. */
  caption?: string
  /** Milliseconds to hold this frame during autoplay. */
  hold?: number
  /** Tall full-page captures are letterboxed instead of cropped. */
  fit?: 'cover' | 'contain'
  /** Name of the workflow this frame belongs to (used when several are combined). */
  group?: string
}

export interface CaptureTab {
  id: string
  label: string
}

interface CaptureProps {
  frames: CaptureFrame[]
  /** Accessible name for the whole widget. */
  label: string
  /** Optional switcher rendered inside the frame, top right. */
  tabs?: CaptureTab[]
  activeTab?: string
  onTabChange?: (id: string) => void
  /** Overrides the per-frame hold when autoplaying. */
  holdMs?: number
  autoplay?: boolean
}

const DEFAULT_HOLD = 3600

export default function Capture({ frames, label, tabs, activeTab, onTabChange, holdMs, autoplay = true }: CaptureProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.4 })
  const reduce = useReducedMotion()

  const count = frames.length
  const safeIndex = count ? Math.min(index, count - 1) : 0
  const frame = frames[safeIndex]
  const playing = autoplay && inView && !paused && !hovering && !reduce && count > 1

  // A new frame set (tab switch) starts from its first step.
  useEffect(() => { setIndex(0) }, [frames])

  const go = useCallback((next: number) => {
    if (!count) return
    setIndex(((next % count) + count) % count)
  }, [count])

  // Autoplay: hold the current frame, then advance. Restarts whenever the
  // frame or the playing state changes, so a manual step resets the clock.
  useEffect(() => {
    if (!playing) return
    const ms = holdMs ?? frame?.hold ?? DEFAULT_HOLD
    const t = window.setTimeout(() => go(safeIndex + 1), ms)
    return () => window.clearTimeout(t)
  }, [playing, safeIndex, frame, holdMs, go])

  // Warm the next frame so the crossfade never shows a blank.
  useEffect(() => {
    if (count < 2) return
    const next = frames[(safeIndex + 1) % count]
    if (!next || loaded[next.src]) return
    const img = new Image()
    img.onload = () => setLoaded(l => ({ ...l, [next.src]: true }))
    img.src = next.src
  }, [safeIndex, frames, count, loaded])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setPaused(true); go(safeIndex + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPaused(true); go(safeIndex - 1) }
    if (e.key === ' ') { e.preventDefault(); setPaused(p => !p) }
  }

  if (!frame) return null

  const groups = Array.from(new Set(frames.map(f => f.group).filter(Boolean))) as string[]
  const groupIndex = frame.group ? frames.filter(f => f.group === frame.group).indexOf(frame) + 1 : safeIndex + 1
  const groupCount = frame.group ? frames.filter(f => f.group === frame.group).length : count

  return (
    <div
      className={'module-detail__visual-frame cap' + (frame.fit === 'contain' ? ' cap--contain' : '')}
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHovering(true) }}
      onPointerLeave={() => setHovering(false)}
    >
      <div className="cap__stage">
        <AnimatePresence initial={false}>
          <motion.img
            key={frame.src}
            className="cap__img"
            src={frame.src}
            alt={frame.caption ?? label}
            draggable={false}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>

      <span className="cap__badge" aria-hidden="true">Real screen</span>

      {tabs && tabs.length > 1 && (
        <div className="cap__tabs" role="tablist" aria-label={`${label} views`}>
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === activeTab}
              className={'cap__tab' + (t.id === activeTab ? ' is-active' : '')}
              onClick={() => { setPaused(false); onTabChange?.(t.id) }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="cap__strip">
        <div className="cap__text">
          {(groups.length > 1 || frame.group) && <span className="cap__group">{frame.group}</span>}
          <p className="cap__caption">{frame.caption ?? ''}</p>
        </div>
        <div className="cap__controls">
          <span className="cap__count" aria-live="polite">{groupIndex} / {groupCount}</span>
          <button type="button" className="cap__btn" aria-label="Previous step" onClick={() => { setPaused(true); go(safeIndex - 1) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cap__btn" aria-label={paused ? 'Play' : 'Pause'} aria-pressed={!paused} onClick={() => setPaused(p => !p)}>
            {paused || !autoplay
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>}
          </button>
          <button type="button" className="cap__btn" aria-label="Next step" onClick={() => { setPaused(true); go(safeIndex + 1) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="cap__dots" aria-hidden="true">
          {frames.map((f, i) => (
            <button key={f.src + i} type="button" tabIndex={-1} className={'cap__dot' + (i === safeIndex ? ' is-active' : '')} onClick={() => { setPaused(true); go(i) }} />
          ))}
        </div>
        {playing && (
          <motion.span
            key={'bar-' + frame.src}
            className="cap__progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: (holdMs ?? frame.hold ?? DEFAULT_HOLD) / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  )
}
