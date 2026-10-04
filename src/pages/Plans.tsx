import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import SiteFooter from '../components/SiteFooter'
import { AT_A_GLANCE, NOT_TODAY, PLANS_LEDE } from '../data/plans'
import { openDemoModal } from '../data/siteContent'
import './Plans.css'

/**
 * Plans, short enough to read in one sitting.
 *
 * No price is published. The page says how the founding hospital programme
 * starts, then says plainly what Orb is not today, then asks for a
 * conversation. Three parts and a call to action, nothing to open or tab through.
 */
const EASE = [0.22, 1, 0.36, 1] as const

export default function Plans() {
  const reduce = useReducedMotion() ?? false

  return (
    <div className="module-detail plans-page">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to the overview
        </Link>

        {/* ─── Title, with how it starts beside it ─── */}
        <section className="plans__hero">
          <div className="plans__hero-copy">
            <span className="plans__eyebrow">Founding programme</span>
            <h1 className="plans__title">Three places. One ward each.</h1>
            <p className="plans__lede">{PLANS_LEDE}</p>
          </div>

          <motion.div
            className="plans__glance"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <span className="plans__glance-title">At a glance</span>
            {AT_A_GLANCE.map(g => (
              <div key={g.label} className="plans__glance-row">
                <span className="plans__glance-label">{g.label}</span>
                <span className="plans__glance-value">{g.value}</span>
                <span className="plans__glance-sub">{g.sub}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── Where Orb stands today ─── */}
        <section className="plans__plain" aria-labelledby="not-today">
          <div className="plans__plain-head">
            <span className="plans__eyebrow">Read this first</span>
            <h2 className="plans__h2" id="not-today">Where Orb stands today.</h2>
          </div>

          <ol className="plans__proof">
            {NOT_TODAY.map((n, i) => (
              <li key={n.title} className="plans__proof-item">
                <span className="plans__proof-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="plans__item-title">{n.title}</span>
                <span className="plans__item-body">{n.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="plans__cta">
          <h2 className="plans__cta-title">Begin with one ward.</h2>
          <p className="plans__cta-desc">Tell me about your wards and the software you run today. The first conversation is about how your ward works, with no contract on the table.</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Book a walkthrough</button>
            <Link to="/security" className="module-detail__btn-secondary">Read the security brief &nbsp;&rarr;</Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
