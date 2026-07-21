import { Link } from 'react-router-dom'
import MarketingHeader from '../../components/MarketingHeader'
import Aurora from '../../components/Aurora'
import '../details/ModuleDetails.css'
import './CompanyPages.css'

// ── OWNER: add the registered legal entity name and jurisdiction once
// incorporation details are final, and have counsel review before launch.
export default function PrivacyPage() {
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
          <h1 className="module-detail__title">Privacy Policy</h1>
          <p className="module-detail__tagline">
            We build privacy-first software, so this policy is short — because this website collects
            almost nothing.
          </p>
        </section>

        <section className="company-prose animate-slide-up stagger-1">
          <p className="company-prose__updated">Last updated: 21 July 2026</p>

          <h2>What this policy covers</h2>
          <p>
            This policy covers your visit to this website (orbintelligence.co). The Orb product
            itself runs inside hospitals under separate agreements — its data boundary is described
            on our <Link to="/security">security page</Link>.
          </p>

          <h2>What we collect — and don&rsquo;t</h2>
          <ul>
            <li><strong>No advertising trackers.</strong> This site sets no advertising or cross-site tracking cookies.</li>
            <li><strong>No analytics cookies.</strong> We do not run third-party analytics scripts.</li>
            <li><strong>No third-party fonts or CDNs.</strong> All assets, including fonts, are served from this site — your IP address is not shared with font or CDN providers.</li>
            <li><strong>Theme preference.</strong> If you toggle light/dark mode, that choice is stored in your browser&rsquo;s localStorage. It stays on your device and is never transmitted to us.</li>
          </ul>

          <h2>The demo request form</h2>
          <p>
            If you submit the demo form, we receive the details you enter: your name, email address,
            organisation, and message. The submission is delivered to our inbox by Web3Forms, a form
            processing service acting on our behalf. We use these details only to respond to your
            enquiry — never for marketing lists, and never sold or shared beyond that purpose.
          </p>

          <h2>Retention</h2>
          <p>
            Demo enquiries are kept for as long as needed to handle the conversation, then deleted.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us at any time what we hold about you, ask us to correct it, or ask us to
            delete it. Email{' '}
            <a href="mailto:support@orbintelligence.co">support@orbintelligence.co</a> and we&rsquo;ll
            act on it promptly. Depending on where you live, you may have additional statutory
            rights (for example under GDPR); we honour them.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy:{' '}
            <a href="mailto:support@orbintelligence.co">support@orbintelligence.co</a>.
          </p>
        </section>
      </main>
    </div>
  )
}
