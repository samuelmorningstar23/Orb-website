import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ALL_MODULES, AREA_LABELS, AREA_ORDER, type ModuleInfo } from '../data/siteContent'
import { SHOWCASES } from './showcases'
import { Reveal, EASE } from './motion/Reveal'
import './ModuleExplorer.css'

const AUTO_ADVANCE_MS = 8000

/** Modules in rail order: grouped by where they live in the hospital. */
const ORDERED: ModuleInfo[] = AREA_ORDER.flatMap(area => ALL_MODULES.filter(m => m.area === area))

/**
 * The homepage's centrepiece: a rail of modules on the left, and on the right a
 * device frame running the selected module's real showcase. It walks through
 * the modules on its own until the visitor touches it, then follows them.
 */
export default function ModuleExplorer() {
  const [index, setIndex] = useState(0)
  const [touched, setTouched] = useState(false)
  const [hovering, setHovering] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { amount: 0.35 })
  const reduce = useReducedMotion()

  const active = ORDERED[index]
  const Showcase = SHOWCASES[active.to]
  const autoplay = inView && !touched && !hovering && !reduce

  // Auto-advance while on screen and untouched; each showcase gets a full turn.
  useEffect(() => {
    if (!autoplay) return
    const t = window.setTimeout(() => setIndex(i => (i + 1) % ORDERED.length), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(t)
  }, [autoplay, index])

  const select = (i: number) => {
    setTouched(true)
    setIndex(i)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((index + 1) % ORDERED.length) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((index - 1 + ORDERED.length) % ORDERED.length) }
  }

  // On narrow screens the rail is a horizontal strip: keep the active chip in
  // view. Scrolls the rail only, never the page, so autoplay can't hijack scroll.
  useEffect(() => {
    const rail = railRef.current
    if (!rail || rail.scrollWidth <= rail.clientWidth + 4) return
    const el = rail.querySelector<HTMLElement>('[data-active="true"]')
    if (!el) return
    rail.scrollTo({ left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }, [index, reduce])

  return (
    <section className="explorer" id="modules" ref={sectionRef} aria-label="Explore the modules">
      <Reveal className="explorer__header">
        <span className="explorer__eyebrow">Fourteen modules</span>
        <h2 className="explorer__title">One operating system, module by module.</h2>
        <p className="explorer__lead">
          Pick a module to watch it work. Every demo is the real interface running illustrative data.
        </p>
      </Reveal>

      <Reveal className="explorer__body" delay={0.1} amount={0.15}>
        <div className="explorer__rail" ref={railRef} role="tablist" aria-label="Modules" onKeyDown={onKeyDown}>
          {AREA_ORDER.map(area => (
            <div className="explorer__group" key={area} role="presentation">
              <span className="explorer__group-label" aria-hidden="true">{AREA_LABELS[area]}</span>
              {ORDERED.filter(m => m.area === area).map(m => {
                const i = ORDERED.indexOf(m)
                const isActive = i === index
                return (
                  <button
                    key={m.to}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="explorer-stage"
                    data-active={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={'explorer__tab' + (isActive ? ' is-active' : '')}
                    onClick={() => select(i)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="explorer-active-pill"
                        className="explorer__tab-pill"
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className="explorer__tab-label">{m.label}</span>
                    <span className="explorer__tab-badge">{m.badge}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div
          className="explorer__stage"
          id="explorer-stage"
          role="tabpanel"
          onPointerEnter={e => { if (e.pointerType === 'mouse') setHovering(true) }}
          onPointerLeave={() => setHovering(false)}
        >
          <div className="explorer__device">
            <div className="explorer__device-bar" aria-hidden="true">
              <span className="explorer__device-dot" /><span className="explorer__device-dot" /><span className="explorer__device-dot" />
              <span className="explorer__device-title">{active.label} · {active.badge}</span>
            </div>
            <div className="explorer__screen">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.to}
                  className="explorer__screen-inner"
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Showcase />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="explorer__progress-track" aria-hidden="true">
              {autoplay && (
                <motion.div
                  key={'progress-' + active.to}
                  className="explorer__progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              )}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={'caption-' + active.to}
              className="explorer__caption"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="explorer__caption-line">{active.line}</p>
              <Link to={active.to} className="explorer__caption-link">
                Open {active.label} <span aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}
