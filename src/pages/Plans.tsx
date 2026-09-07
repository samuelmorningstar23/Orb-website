import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { FAQ, FX_NOTE, PRICE_NOTES, PRICE_ROWS, PROVISIONS, SCORECARD, STAGES, WEEKS } from '../data/plans'
import { openDemoModal } from '../data/siteContent'
import './Plans.css'

/**
 * Plans, written to be forwarded.
 *
 * A CIO reads this without me in the room, so every number is on the page:
 * the pilot fee, the per-bed price and how it is built, implementation, and
 * the hardware at cost. Then the three things they will be asked internally:
 * what the thirteen weeks actually contain, what each side has to provide,
 * and what the pilot will have proved at the end of it.
 */
export default function Plans() {
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

        <section className="plans__hero">
          <span className="module-detail__badge">Plans</span>
          <h1 className="plans__title">A pilot first.<br />Then the hospital.</h1>
          <p className="plans__lede">
            There are no tiers, because there is nothing to withhold. One ward proves it, then the hospital pays per bed for the wards it runs on. Every number is on this page, including what the hardware costs and who it belongs to.
          </p>
        </section>

        {/* ─── The path ─── */}
        <section className="plans__path" aria-label="How Orb is bought">
          <Stagger className="plans__stages" amount={0.15}>
            {STAGES.map(s => (
              <StaggerItem key={s.id} className="plans__stage">
                <span className="plans__stage-rule" aria-hidden="true"><i /></span>
                <span className="plans__stage-step">{s.step}</span>
                <h2 className="plans__stage-name">{s.name}</h2>
                <span className="plans__stage-when">{s.when}</span>
                <p className="plans__stage-price">
                  <span className="plans__stage-inr">{s.price}</span>
                  <span className="plans__stage-unit">{s.unit}</span>
                  <span className="plans__stage-usd">{s.priceUsd}</span>
                </p>
                <p className="plans__stage-desc">{s.desc}</p>
                <ul className="plans__stage-points">
                  {s.points.map(p => <li key={p}>{p}</li>)}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ─── The price list ─── */}
        <section className="plans__section" aria-labelledby="price-list">
          <Reveal className="plans__head">
            <span className="plans__eyebrow">The price list</span>
            <h2 className="plans__h2" id="price-list">All of it, on the page.</h2>
          </Reveal>

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

          <ul className="plans__notes">
            {PRICE_NOTES.map(n => <li key={n}>{n}</li>)}
            <li>{FX_NOTE}</li>
          </ul>
        </section>

        {/* ─── The thirteen weeks ─── */}
        <section className="plans__section" aria-labelledby="weeks">
          <Reveal className="plans__head">
            <span className="plans__eyebrow">The thirteen weeks</span>
            <h2 className="plans__h2" id="weeks">Signature to shadow go-live.</h2>
            <p className="plans__sub">Shadow go-live is the end of week thirteen, not the start of it. The ward goes live after a clean shadow period.</p>
          </Reveal>
          <Stagger className="plans__weeks" as="ul" amount={0.1}>
            {WEEKS.map(w => (
              <StaggerItem key={w.title} as="li" className="plans__week">
                <span className="plans__week-when">{w.weeks}</span>
                <h3 className="plans__week-title">{w.title}</h3>
                <p className="plans__week-body">{w.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ─── What each side provides ─── */}
        <section className="plans__section" aria-labelledby="provide">
          <Reveal className="plans__head">
            <span className="plans__eyebrow">Who provides what</span>
            <h2 className="plans__h2" id="provide">Nothing hidden in the scope.</h2>
          </Reveal>
          <div className="plans__split">
            <div className="plans__col">
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
            <div className="plans__col">
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
        </section>

        {/* ─── What the pilot proves ─── */}
        <section className="plans__section" aria-labelledby="proves">
          <Reveal className="plans__head">
            <span className="plans__eyebrow">What the pilot proves</span>
            <h2 className="plans__h2" id="proves">A measurement, not a trial.</h2>
            <p className="plans__sub">The scorecard at the end of the pilot, and what is in it. It is generated from the running system, so it is the same instrument whether the answer flatters us or not.</p>
          </Reveal>
          <Stagger className="plans__proof" as="ul" amount={0.15}>
            {SCORECARD.map((s, i) => (
              <StaggerItem key={s.title} as="li" className="plans__proof-item">
                <span className="plans__proof-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="plans__item-title">{s.title}</span>
                <span className="plans__item-body">{s.body}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ─── Procurement and security ─── */}
        <section className="plans__section" aria-labelledby="faq">
          <Reveal className="plans__head">
            <span className="plans__eyebrow">Procurement and security</span>
            <h2 className="plans__h2" id="faq">The questions your IT lead will ask.</h2>
          </Reveal>
          <dl className="plans__faq">
            {FAQ.map(f => (
              <div key={f.q} className="plans__faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Reveal as="section" className="plans__cta" amount={0.4}>
          <h2 className="plans__cta-title">Start with one ward.</h2>
          <p className="plans__cta-desc">
            Bring your census and your ward list to the call. The scoping is arithmetic, and you have already seen the prices it uses.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Request a demo</button>
            <Link to="/security" className="module-detail__btn-secondary">Read the security brief &nbsp;&rarr;</Link>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
