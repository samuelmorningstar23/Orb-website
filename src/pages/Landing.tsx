import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import ProofBand from '../components/ProofBand'
import AgenticShowcase from '../components/AgenticShowcase'
import ModuleExplorer from '../components/ModuleExplorer'
import VigilShowcase from '../components/showcases/VigilShowcase'
import { Reveal } from '../components/motion/Reveal'
import { ALL_MODULES, CONTACT_EMAIL, openDemoModal } from '../data/siteContent'
import './Landing.css'

/**
 * Homepage - five beats: the promise, Orb acting, the modules running live,
 * the proof, and one call to action. Detail lives on the module and security
 * pages; this page's job is to make someone want to see it.
 */
export default function Landing() {
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // The hero panel drifts and fades as the visitor scrolls out of the hero, handing focus to the flow below.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const panelY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2])

  const half = Math.ceil(ALL_MODULES.length / 2)

  return (
    <div className="landing-overview">
      <Aurora />
      <MarketingHeader />

      <main className="landing-overview__content">

        {/* Beat 1 - the promise */}
        <section className="landing-overview__hero" ref={heroRef}>
          <div className="landing-overview__hero-headers">
            <span className="landing-overview__badge">Hospital OS</span>
            <h1 className="landing-overview__title">
              The Hospital<br />Operating System.
            </h1>
            <p className="landing-overview__subtitle">
              Intelligence that stays within your walls, and acts on what it sees the moment a clinician confirms.
            </p>
            <div className="landing-overview__hero-actions">
              <button className="landing-overview__btn-primary" onClick={openDemoModal}>
                Request a demo
              </button>
              <a href="#modules" className="landing-overview__btn-secondary-action">
                Explore the modules &nbsp;&darr;
              </a>
            </div>
          </div>

          {/* Orb working within the first seconds: the Vigil monitor, live, in the product's own frame */}
          <motion.div className="landing-overview__hero-panel" style={reduce ? undefined : { y: panelY, opacity: panelOpacity }} aria-hidden="true">
            <div className="orb-frame">
              <div className="orb-frame__bar">
                <span className="orb-frame__label">Vigil · Bed 04 · Live vitals</span>
                <span className="orb-frame__tag">Illustrative data</span>
              </div>
              <div className="orb-frame__screen landing-overview__hero-screen">
                <VigilShowcase />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Beat 2 - Orb acts (scroll-driven flow) */}
        <AgenticShowcase />

        {/* Beat 3 - the modules, running */}
        <ModuleExplorer />

        {/* Beat 4 - the proof, stated once */}
        <ProofBand />

        {/* Beat 5 - one call to action */}
        <Reveal as="section" className="landing-overview__cta" amount={0.4}>
          <h2 className="landing-overview__cta-title">See Orb on your wards.</h2>
          <p className="landing-overview__cta-desc">
            A walkthrough on real clinical workflows, sized to your hospital. No slides.
          </p>
          <div className="landing-overview__cta-actions">
            <button className="landing-overview__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/plans" className="landing-overview__btn-secondary-action">Compare plans &nbsp;&rarr;</Link>
          </div>
        </Reveal>

        {/* Footer */}
        <footer className="landing-overview__footer">
          <div className="landing-overview__footer-top">
            <div className="landing-overview__footer-brand">
              <span className="landing-overview__footer-wordmark">Orb</span>
              <p className="landing-overview__footer-tagline">The local-first, AI-native operating system for the modern hospital.</p>
            </div>

            <nav className="landing-overview__footer-cols">
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Modules</span>
                {ALL_MODULES.slice(0, half).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">&nbsp;</span>
                {ALL_MODULES.slice(half).map(m => (
                  <Link key={m.to} to={m.to} className="landing-overview__footer-link">{m.label}</Link>
                ))}
              </div>
              <div className="landing-overview__footer-col">
                <span className="landing-overview__footer-col-title">Company</span>
                <a href="#modules" className="landing-overview__footer-link">Overview</a>
                <Link to="/plans" className="landing-overview__footer-link">Plans</Link>
                <Link to="/security" className="landing-overview__footer-link">Security</Link>
                <Link to="/support" className="landing-overview__footer-link">Support</Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="landing-overview__footer-link">Contact</a>
              </div>
            </nav>
          </div>

          <div className="landing-overview__footer-bottom">
            <p>© 2026 Orb. All rights reserved.</p>
            <p className="landing-overview__footer-fineprint">Interactive figures shown are illustrative.</p>
          </div>
        </footer>

      </main>
    </div>
  )
}
