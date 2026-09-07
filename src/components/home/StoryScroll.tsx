import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './StoryScroll.css'

/**
 * A story told by scrolling: the text steps down the page, the real screen
 * stays pinned beside it and changes as each step arrives. The frames are
 * captures of the product (see orbCaptures); nothing is drawn.
 */
export interface StoryStep {
  kicker?: string
  title?: string
  body: string
  src: string
  link?: { to: string; label: string }
  /** Letterbox tall captures instead of cropping them. */
  fit?: 'cover' | 'contain'
}

interface StoryScrollProps {
  steps: StoryStep[]
  label: string
  /** Numbered steps show 01, 02 …; walkthroughs show the kicker instead. */
  numbered?: boolean
}

export default function StoryScroll({ steps, label, numbered = true }: StoryScrollProps) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const reduce = useReducedMotion()

  // The active step is the one whose centre is nearest the middle of the viewport.
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const mid = window.innerHeight * 0.5
      let best = 0, bestD = Infinity
      refs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestD) { bestD = d; best = i }
      })
      setActive(best)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [steps.length])

  const step = steps[active] ?? steps[0]

  return (
    <div className={'story' + (numbered ? '' : ' story--walk')} role="group" aria-label={label}>
      <div className="story__visual">
        <div className={'story__frame' + (step.fit === 'contain' ? ' story__frame--contain' : '')}>
          <AnimatePresence initial={false}>
            <motion.img
              key={step.src}
              className="story__img"
              src={step.src}
              alt={step.title ?? step.body}
              draggable={false}
              initial={reduce ? false : { opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <span className="story__mark" aria-hidden="true">Real screen</span>
        </div>
        <div className="story__dots" aria-hidden="true">
          {steps.map((_, i) => <span key={i} className={'story__dot' + (i === active ? ' is-active' : '')} />)}
        </div>
      </div>

      <div className="story__steps">
        {steps.map((s, i) => (
          <div
            key={i}
            ref={el => { refs.current[i] = el }}
            className={'story__step' + (i === active ? ' is-active' : '')}
          >
            {numbered
              ? <span className="story__num">{String(i + 1).padStart(2, '0')}</span>
              : s.kicker && <span className="story__kicker">{s.kicker}</span>}
            {s.title && <h3 className="story__title">{s.title}</h3>}
            <p className="story__body">{s.body}</p>
            {s.link && <Link to={s.link.to} className="story__link">{s.link.label} <span aria-hidden="true">&rarr;</span></Link>}
          </div>
        ))}
      </div>
    </div>
  )
}
