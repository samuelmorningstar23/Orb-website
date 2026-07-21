import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import '../details/ModuleDetails.css'
import './CompanyPages.css'

// ── OWNER: add the registered legal entity name and governing law once
// incorporation details are final, and have counsel review before launch.
export default function TermsPage() {
  return (
    <div className="module-detail">
      <Aurora />
      <MarketingHeader />

      <main id="main" className="module-detail__content">
        <Link to="/" className="module-detail__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>

        <section className="module-detail__hero animate-slide-up">
          <span className="module-detail__badge">Legal</span>
          <h1 className="module-detail__title">Terms of Use</h1>
          <p className="module-detail__tagline">
            The short version: this site describes a product, it isn&rsquo;t the product — and
            nothing here is medical advice.
          </p>
        </section>

        <section className="company-prose animate-slide-up stagger-1">
          <p className="company-prose__updated">Last updated: 21 July 2026</p>

          <h2>About this website</h2>
          <p>
            This website presents Orb, a hospital software product, for informational purposes.
            Using this site does not create any commercial, clinical, or professional relationship
            between you and Orb.
          </p>

          <h2>Not medical advice</h2>
          <p>
            Nothing on this website constitutes medical advice, diagnosis, or treatment guidance.
            Content is directed at healthcare organisations evaluating software, not at patients.
          </p>

          <h2>Simulated demonstrations</h2>
          <p>
            Product visuals on this site are simulated demonstrations. Patients, clinicians, vitals,
            and figures shown are fictional and illustrative — they are labelled as such where they
            appear. Product capabilities, availability, and regulatory status vary by market and are
            subject to change; see our <Link to="/security">security page</Link> for how we handle
            regulatory status.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content, design, and branding of this site belong to Orb. You may view and share
            links to it; you may not reproduce it commercially or present it as your own.
          </p>

          <h2>No warranties</h2>
          <p>
            This site is provided &ldquo;as is&rdquo;. We work to keep it accurate and available but
            make no warranty that it is error-free, and we accept no liability for decisions taken
            on the basis of marketing content alone — evaluations happen under separate written
            agreements.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms as the product and company evolve; the date above reflects the
            latest revision.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a href="mailto:support@orbintelligence.co">support@orbintelligence.co</a>.
          </p>
        </section>
      </main>
    </div>
  )
}
