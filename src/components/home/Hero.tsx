import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Widget from '../widget/Widget'
import { WIDGET_FLOWS } from '../../data/widgetFlows'
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
        <span className="hero__eyebrow">Orb Hospital OS</span>
        <h1 className="hero__title" id="hero-title">
          The hospital,<br />running on one machine<br /><em>inside</em> the hospital.
        </h1>
        <p className="hero__sub">
          The record, the ward monitor, the pharmacy and the front desk on one appliance. The models run there too, so nothing about a patient leaves the building.
        </p>
        <div className="hero__actions">
          <button type="button" className="hero__btn hero__btn--primary" onClick={openDemoModal}>Request a demo</button>
          <Link className="hero__btn hero__btn--ghost" to="/modules">The modules <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </div>

      <div className="hero__stage">
        <motion.div
          className="hero__frame"
          style={reduce ? undefined : { rotateX, scale }}
        >
          <Widget flows={WIDGET_FLOWS['/vigil']} label="Orb Vigil, one workflow" size="tall" />
        </motion.div>
        <p className="hero__stage-note">
          One workflow at a time, on the seeded demo patients the screenshots were taken on. Step through it, or let it play.
        </p>
      </div>
    </section>
  )
}
