import { Link } from 'react-router-dom'
import Aurora from '../components/Aurora'
import MarketingHeader from '../components/MarketingHeader'
import { PLANS, openDemoModal } from '../data/siteContent'
import './Plans.css'

export default function Plans() {
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

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Plans</span>
          <h1 className="module-detail__title">One platform.<br />Four sizes.</h1>
          <p className="module-detail__tagline">
            Every plan runs the same local-first operating system inside your walls — pick how much of the hospital it covers, and grow tier by tier.
          </p>
        </section>

        <section className="plans-page__grid animate-slide-up stagger-1">
          {PLANS.map(plan => (
            <article key={plan.id} id={plan.id} className={`plans-page__card ${plan.id === 'max' ? 'plans-page__card--popular' : ''}`}>
              {plan.id === 'max' && <span className="plans-page__popular-badge">Most popular</span>}
              <span className="plans-page__audience">{plan.audience}</span>
              <h2 className="plans-page__name">{plan.name}</h2>
              <p className="plans-page__tagline">{plan.tagline}</p>
              <p className="plans-page__desc">{plan.desc}</p>

              <ul className="plans-page__includes">
                {plan.includes.map(item => (
                  <li key={item}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
                {plan.extras?.map(item => (
                  <li key={item} className="plans-page__extra">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="plans-page__cta" onClick={openDemoModal}>Request a Demo</button>
            </article>
          ))}
        </section>

        <p className="plans-page__note">
          Pricing is scoped to your wards, beds, and hardware — the team sizes it with you during the demo. Every plan is deployed on-premise, with no patient data leaving your walls.
        </p>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Not sure where to start?</h2>
          <p className="module-detail__cta-desc">
            Most hospitals begin with a single ward on Lite or Plus, then grow into the house-wide tiers as teams adopt it.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={openDemoModal}>Request a Demo</button>
            <Link to="/support" className="module-detail__btn-secondary">Talk to support &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
