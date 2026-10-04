import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import WorkflowStory from '../widget/WorkflowStory'
import { openDemoModal } from '../../data/siteContent'
import './Hero.css'

/**
 * The first screen: the claim, and under it the product itself, already
 * running. The frame leans back a little at the top of the page and stands up
 * as the visitor starts to scroll, so the first movement they make is the
 * product turning to face them.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [14, 0])
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1])

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__copy">
        <span className="hero__eyebrow">Orb</span>
        <h1 className="hero__title" id="hero-title">
          Hospital software<br />that <em>never</em> leaves<br />your building.
        </h1>
        <p className="hero__sub">
          One computer in your hospital runs the ward record, the NEWS2 score, the drug chart and the case rooms.
        </p>
        <div className="hero__actions">
          <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Book a walkthrough</button>
          <Link className="hero__btn hero__btn--ghost" to="/modules">Meet the modules <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </div>

      <div className="hero__stage">
        <motion.div
          className="hero__frame"
          style={reduce ? undefined : { rotateX, scale }}
        >
          <WorkflowStory />
        </motion.div>
        <p className="hero__stage-note">
One demo patient. From the ward to the pharmacy and back to his bedside, in three acts. Pick one, or let it play.
        </p>
      </div>
    </section>
  )
}
