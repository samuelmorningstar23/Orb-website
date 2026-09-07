import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import { AT_A_GLANCE, FAQ, FX_NOTE, PRICE_NOTES, PRICE_ROWS, PROVISIONS, SCORECARD, STAGES, WEEKS } from '../data/plans'
import { openDemoModal } from '../data/siteContent'
import './Plans.css'

/**
 * Plans, written to be forwarded and short enough to read.
 *
 * Every number a CIO needs is here, but stacking it made a page nobody
 * finishes. So: the four headline figures sit beside the title, the three
 * stages are one band that opens the one you are reading, and the four things
 * procurement asks about live in a single card that slides between them.
 */
const EASE = [0.22, 1, 0.36, 1] as const

const TABS = [
  { id: 'weeks', label: 'The thirteen weeks' },
  { id: 'provide', label: 'Who provides what' },
  { id: 'proves', label: 'What the pilot proves' },
  { id: 'faq', label: 'Procurement and security' },
] as const

type TabId = typeof TABS[number]['id']

export default function Plans() {
  const [stage, setStage] = useState(STAGES[0].id)
  const [tab, setTab] = useState<TabId>('weeks')
  const [openQ, setOpenQ] = useState(FAQ[0].q)
  const reduce = useReducedMotion() ?? false

  const hospital = PROVISIONS.filter(p => p.side === 'hospital')
  const orb = PROVISIONS.filter(p => p.side === 'orb')

  return (
    <div className="module-detail plans-page">
      <Aurora />
      <MarketingHeader />

      <main className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        {/* ─── Title, with the answer beside it ─── */}
        <section className="plans__hero">
          <div className="plans__hero-copy">
            <span className="plans__eyebrow">Plans</span>
            <h1 className="plans__title">A pilot first.<br />Then the hospital.</h1>
            <p className="plans__lede">
              No tiers, because there is nothing to withhold. One ward proves it, then the hospital pays per bed for the wards it runs on. Every number is on this page, including what the hardware costs and who it belongs to.
            </p>
          </div>

          <motion.div
            className="plans__glance"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <span className="plans__glance-title">What it costs</span>
            {AT_A_GLANCE.map(g => (
              <div key={g.label} className="plans__glance-row">
                <span className="plans__glance-label">{g.label}</span>
                <span className="plans__glance-figs">
                  <span className="plans__glance-inr">{g.inr}</span>
                  <span className="plans__glance-usd">{g.usd}</span>
                </span>
                <span className="plans__glance-sub">{g.sub}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── The path: one band, opening the stage you are reading ─── */}
        <section className="plans__path" aria-label="How Orb is bought">
          {STAGES.map(s => {
            const open = s.id === stage
            return (
              <motion.button
                key={s.id}
                id={s.id}
                type="button"
                layout={!reduce}
                transition={{ duration: 0.55, ease: EASE }}
                className={'plans__stage' + (open ? ' is-open' : '')}
                style={{ flexGrow: open ? 3.2 : 1 }}
                onClick={() => setStage(s.id)}
                aria-expanded={open}
              >
                <motion.span layout={!reduce} className="plans__stage-head">
                  <span className="plans__stage-step">{s.step}</span>
                  <span className="plans__stage-name">{s.name}</span>
                  <span className="plans__stage-inr">{s.price}</span>
                  <span className="plans__stage-unit">{s.unit}</span>
                </motion.span>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.span
                      key="body"
                      className="plans__stage-body"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.15 } }}
                      exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <span className="plans__stage-when">{s.when} · {s.priceUsd}</span>
                      <span className="plans__stage-desc">{s.desc}</span>
                      <span className="plans__stage-points">
                        {s.points.map(p => <span key={p} className="plans__stage-point">{p}</span>)}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>

                {!open && <motion.span layout={!reduce} className="plans__stage-open">Open</motion.span>}
              </motion.button>
            )
          })}
        </section>

        {/* ─── The price list ─── */}
        <section className="plans__prices" aria-labelledby="price-list">
          <div className="plans__prices-head">
            <span className="plans__eyebrow">The price list</span>
            <h2 className="plans__h2" id="price-list">All of it, on the page.</h2>
            <ul className="plans__notes">
              {PRICE_NOTES.map(n => <li key={n}>{n}</li>)}
              <li>{FX_NOTE}</li>
            </ul>
          </div>

          <div className="plans__table-wrap">
            <table className="plans__table">
              <thead>
                <tr>
                  <th scope="col">What</th>
                  <th scope="col">How it is charged</th>
                  <th scope="col" className="plans__num">Rupees</th>
                  <th scope="col" className="plans__num">Dollars</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_ROWS.map(r => (
                  <tr key={r.what}>
                    <th scope="row">
                      {r.what}
                      {r.note && <span className="plans__row-note">{r.note}</span>}
                    </th>
                    <td>{r.how}</td>
                    <td className="plans__num plans__inr">{r.inr}</td>
                    <td className="plans__num plans__usd">{r.usd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── The dossier: four answers, one card ─── */}
        <section className="plans__dossier" aria-label="The detail your team will ask for">
          <div className="plans__tabs" role="tablist" aria-label="Sections">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tab}
                className={'plans__tab' + (t.id === tab ? ' is-active' : '')}
                onClick={() => setTab(t.id)}
              >
                {t.id === tab && !reduce && <motion.span layoutId="plans-tab" className="plans__tab-pill" transition={{ duration: 0.4, ease: EASE }} />}
                <span className="plans__tab-text">{t.label}</span>
              </button>
            ))}
          </div>

          <motion.div className="plans__panel-frame" layout={!reduce} transition={{ duration: 0.45, ease: EASE }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -28 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                {tab === 'weeks' && (
                  <div className="plans__panel">
                    <p className="plans__panel-lede">Shadow go-live is the end of week thirteen, not the start of it. The ward goes live after a clean shadow period, and the one hard gate is the hardware order by week three.</p>
                    <div className="plans__rail">
                      {WEEKS.map(w => (
                        <article key={w.title} className="plans__wcard">
                          <span className="plans__wcard-when">{w.weeks}</span>
                          <h3 className="plans__wcard-title">{w.title}</h3>
                          <p className="plans__wcard-body">{w.body}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'provide' && (
                  <div className="plans__panel plans__panel--split">
                    <div>
                      <h3 className="plans__col-title">The hospital provides</h3>
                      <ul className="plans__col-list">
                        {hospital.map(p => (
                          <li key={p.title}>
                            <span className="plans__item-title">{p.title}</span>
                            <span className="plans__item-body">{p.body}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="plans__col-title">Orb provides</h3>
                      <ul className="plans__col-list">
                        {orb.map(p => (
                          <li key={p.title}>
                            <span className="plans__item-title">{p.title}</span>
                            <span className="plans__item-body">{p.body}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === 'proves' && (
                  <div className="plans__panel">
                    <p className="plans__panel-lede">The scorecard at the end of the pilot, generated from the running system, so it is the same instrument whether the answer flatters us or not.</p>
                    <ul className="plans__proof">
                      {SCORECARD.map((s, i) => (
                        <li key={s.title} className="plans__proof-item">
                          <span className="plans__proof-num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="plans__item-title">{s.title}</span>
                          <span className="plans__item-body">{s.body}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'faq' && (
                  <div className="plans__panel">
                    <dl className="plans__faq">
                      {FAQ.map(f => {
                        const on = f.q === openQ
                        return (
                          <div key={f.q} className={'plans__faq-item' + (on ? ' is-open' : '')}>
                            <dt>
                              <button type="button" onClick={() => setOpenQ(on ? '' : f.q)} aria-expanded={on}>
                                <span>{f.q}</span>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              </button>
                            </dt>
                            <AnimatePresence initial={false}>
                              {on && (
                                <motion.dd
                                  initial={reduce ? false : { height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: EASE }}
                                >
                                  <span>{f.a}</span>
                                </motion.dd>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </dl>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="plans__cta">
          <h2 className="plans__cta-title">Start with one ward.</h2>
          <p className="plans__cta-desc">Bring your census and your ward list. The scoping is arithmetic, and you have already seen the prices it uses.</p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/security" className="module-detail__btn-secondary">Read the security brief &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
