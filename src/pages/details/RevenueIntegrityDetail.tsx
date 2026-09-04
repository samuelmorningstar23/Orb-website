import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import RevenueIntegrityShowcase from '../../components/showcases/RevenueIntegrityShowcase'
import './ModuleDetails.css'

export default function RevenueIntegrityDetail() {
  return (
    <div className="module-detail">
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
          <span className="module-detail__badge">Revenue Integrity</span>
          <h1 className="module-detail__title">Revenue Integrity</h1>
          <p className="module-detail__tagline">
            Turns the care you already deliver into the reimbursement you're owed — catching the coding and documentation gaps that quietly cost hospitals millions.
          </p>
        </section>

        <section className="module-detail__showcase animate-slide-up stagger-1">
          <RevenueIntegrityShowcase />
        </section>

        <section className="module-detail__grid">
          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Automated Coding Support</h3>
            <p className="module-detail__card-desc">
              Reads the care already documented and suggests accurate, well-supported codes — every one presented for your coders to review and confirm.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6M9 15h6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Documentation Integrity</h3>
            <p className="module-detail__card-desc">
              Flags the gaps that quietly cause under-coding — an unspecified acuity, a missing detail — before the claim goes out, while the record can still be clarified.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Revenue Leakage, Caught</h3>
            <p className="module-detail__card-desc">
              Surfaces missed charges and unbilled services across encounters — the small, repeated losses that add up to real money over a year.
            </p>
          </div>

          <div className="module-detail__card">
            <div className="module-detail__card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="module-detail__card-title">Auditable &amp; On-Site</h3>
            <p className="module-detail__card-desc">
              Every suggestion traces back to the note that supports it, and the whole review stays inside your walls — patient data never leaves the building.
            </p>
          </div>
        </section>

        <section className="module-detail__cta-section">
          <h2 className="module-detail__cta-title">Revenue Integrity</h2>
          <p className="module-detail__cta-desc">
            The care is already happening. Orb makes sure it's captured.
          </p>
          <div className="module-detail__buttons">
            <button className="module-detail__btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-demo-modal"))}>Request a Demo</button>
            <Link to="/" className="module-detail__btn-secondary">Back to all modules &nbsp;&rarr;</Link>
          </div>
        </section>
      </main>

    </div>
  )
}
