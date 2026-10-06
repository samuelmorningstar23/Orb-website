import './TrustPosture.css'

/** The India note on the security page: what exists, what is still to come, and what none of it stands in for. */
export default function TrustPosture() {
  return (
    <section className="trust-posture">
      <div className="trust-posture__header">
        <span className="trust-posture__badge">For hospitals in India</span>
        <h2 className="trust-posture__title">Built for India first.</h2>
      </div>
      <p className="trust-posture__note">
        The consent, retention and breach registers exist inside Orb but have no screens yet. The screens come before the DPDP duties start in May 2027. The NABH evidence pack exports the quality indicators and the incident register, and lists the indicators it cannot compute. On ABDM, Orb is not yet certified and sends nothing today. None of it stands in for your own certification.
      </p>
    </section>
  )
}
