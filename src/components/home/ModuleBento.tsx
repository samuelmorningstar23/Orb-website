import { Link } from 'react-router-dom'
import { ALL_MODULES } from '../../data/siteContent'
import { WIDGET_FLOWS } from '../../data/widgetFlows'
import { WidgetStill } from '../widget/Widget'
import { Reveal } from '../motion/Reveal'
import './ModuleBento.css'

/**
 * The module wall: one card per module, each showing the moment its workflow
 * turns on, drawn at a size you can actually read. Equal cards on purpose. A
 * wall of shrunken screenshots looked busy and said nothing; this says one
 * thing per module and leaves the real screens for the module's own page.
 */
const TILES: { to: string; step: number }[] = [
  { to: '/vigil', step: 3 },
  { to: '/sage', step: 4 },
  { to: '/helix', step: 3 },
  { to: '/scribe', step: 4 },
  { to: '/relay', step: 3 },
  { to: '/bridge', step: 2 },
  { to: '/command-center', step: 1 },
  { to: '/forecast', step: 1 },
  { to: '/surge-simulator', step: 2 },
  { to: '/surgical-suite', step: 2 },
  { to: '/pulse', step: 2 },
  { to: '/appointments', step: 1 },
  { to: '/revenue-integrity', step: 2 },
  { to: '/lens', step: 2 },
]

const OPS = ['Front Desk', 'Billing', 'Payments', 'Insurance and TPA', 'Procurement', 'Housekeeping', 'Workforce', 'Equipment', 'Diet and Kitchen', 'NABH', 'ABDM']

export default function ModuleBento() {
  return (
    <section className="wall" id="modules" aria-label="The modules">
      <Reveal className="wall__header">
        <span className="wall__eyebrow">{TILES.length} modules, one record</span>
        <h2 className="wall__title">Pick one. Each page walks its workflow.</h2>
        <p className="wall__lead">
          Every card is a moment from that module, drawn from the product’s own screens on seeded demo patients. The screens themselves sit on each module’s page.
        </p>
      </Reveal>

      <div className="wall__grid">
        {TILES.map(t => {
          const m = ALL_MODULES.find(x => x.to === t.to)
          const flow = WIDGET_FLOWS[t.to]?.[0]
          if (!m || !flow) return null
          return (
            <Link key={t.to} to={t.to} className="wall__card">
              <span className="wall__preview">
                <WidgetStill flow={flow} step={t.step} />
              </span>
              <span className="wall__meta">
                <span className="wall__name">{m.label}</span>
                <span className="wall__line">{m.badge}</span>
                <span className="wall__go" aria-hidden="true">Open<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
              </span>
            </Link>
          )
        })}

        <Link to="/plans" className="wall__card wall__card--ops">
          <span className="wall__meta">
            <span className="wall__name">The rest of the house</span>
            <span className="wall__line">Running behind the same record, on the same appliance.</span>
            <span className="wall__ops">
              {OPS.map(o => <span key={o} className="wall__op">{o}</span>)}
            </span>
            <span className="wall__go" aria-hidden="true">Plans<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
          </span>
        </Link>
      </div>
    </section>
  )
}
