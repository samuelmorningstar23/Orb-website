import './WhyNow.css'

type Beat = {
  num: string
  text: string
}

const beats: Beat[] = [
  {
    num: '01',
    text: 'AI has crossed from suggesting to safely acting — under a clinician’s confirmation.',
  },
  {
    num: '02',
    text: 'On-device intelligence is finally powerful enough to run the hospital’s hardest work locally.',
  },
  {
    num: '03',
    text: 'And the people delivering care can’t absorb more clicks, more screens, more burnout.',
  },
]

export default function WhyNow() {
  return (
    <section className="why-now">
      <div className="why-now__header">
        <span className="why-now__eyebrow">Why now</span>
        <h2 className="why-now__title">The moment hospital AI grows up.</h2>
      </div>

      <ol className="why-now__beats">
        {beats.map((beat) => (
          <li className="why-now__beat" key={beat.num}>
            <span className="why-now__beat-num" aria-hidden="true">{beat.num}</span>
            <p className="why-now__beat-text">{beat.text}</p>
          </li>
        ))}
      </ol>

      <div className="why-now__moat">
        <span className="why-now__moat-bar" aria-hidden="true" />
        <p className="why-now__moat-text">
          Orb is the intelligence layer for that moment —{' '}
          <strong>modules that compound</strong>, so the more of the hospital it
          runs, the more valuable every confirmed action becomes.
        </p>
      </div>
    </section>
  )
}
