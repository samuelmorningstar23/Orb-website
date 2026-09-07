import { Link } from 'react-router-dom'
import { ALL_MODULES } from '../../data/siteContent'
import { SCREENS } from '../../data/orbCaptures'
import { useIsLightTheme } from '../showcases/useIsLightTheme'
import { Reveal } from '../motion/Reveal'
import './ModuleBento.css'

/**
 * Every module as a tile showing its real screen, in the visitor's theme.
 * Sizes follow the story: the ward and Sage get the room, the rest fill in.
 */
type Size = 'xl' | 'lg' | 'md' | 'sm'

const TILES: { to: string; screen: string; size: Size }[] = [
  { to: '/vigil', screen: 'vigil-patient-chart', size: 'xl' },
  { to: '/sage', screen: 'sage-panel', size: 'lg' },
  { to: '/helix', screen: 'pharmacy-verify-queue', size: 'md' },
  { to: '/scribe', screen: 'scribe', size: 'md' },
  { to: '/relay', screen: 'relay-case-room', size: 'md' },
  { to: '/bridge', screen: 'bridge-patient-portal', size: 'md' },
  { to: '/command-center', screen: 'command-center', size: 'md' },
  { to: '/forecast', screen: 'forecast-census', size: 'md' },
  { to: '/surge-simulator', screen: 'capacity-simulator', size: 'sm' },
  { to: '/surgical-suite', screen: 'surgical-suite-schedule', size: 'sm' },
  { to: '/pulse', screen: 'pulse-environmental', size: 'sm' },
  { to: '/appointments', screen: 'appointments', size: 'sm' },
  { to: '/revenue-integrity', screen: 'revenue-integrity', size: 'md' },
  { to: '/lens', screen: 'lens', size: 'md' },
]

const OPS = ['Front Desk', 'Billing', 'Payments', 'Insurance and TPA', 'Procurement', 'Housekeeping', 'Workforce', 'Equipment', 'Diet and Kitchen', 'NABH', 'ABDM']

export default function ModuleBento() {
  const isLight = useIsLightTheme()
  return (
    <section className="bento" id="modules" aria-label="The modules">
      <Reveal className="bento__header">
        <span className="bento__eyebrow">{TILES.length} modules, one record</span>
        <h2 className="bento__title">Pick one. Each page runs it.</h2>
        <p className="bento__lead">Every tile is a real screen of a running Orb appliance on seeded demo patients, in the theme you are reading in. Each page behind a tile walks that module’s workflow.</p>
      </Reveal>

      <div className="bento__grid">
        {TILES.map(t => {
          const m = ALL_MODULES.find(x => x.to === t.to)
          const shot = SCREENS[t.screen]
          if (!m || !shot) return null
          return (
            <Link key={t.to} to={t.to} className={`bento__tile bento__tile--${t.size}`}>
              <img className="bento__img" src={isLight ? shot.light : shot.dark} alt="" loading="lazy" draggable={false} />
              <span className="bento__label">
                <span className="bento__name">{m.label}</span>
                <span className="bento__badge">{m.badge}</span>
              </span>
              <span className="bento__open" aria-hidden="true">Open &rarr;</span>
            </Link>
          )
        })}
        <Link to="/plans" className="bento__tile bento__tile--md bento__tile--ops">
          <img className="bento__img" src={isLight ? SCREENS['module-billing'].light : SCREENS['module-billing'].dark} alt="" loading="lazy" draggable={false} />
          <span className="bento__label">
            <span className="bento__name">The rest of the house</span>
            <span className="bento__badge">{OPS.join(' · ')}</span>
          </span>
          <span className="bento__open" aria-hidden="true">Plans &rarr;</span>
        </Link>
      </div>
    </section>
  )
}
