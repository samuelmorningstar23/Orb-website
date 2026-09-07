import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SCREENS } from '../../data/orbCaptures'
import { useIsLightTheme } from '../showcases/useIsLightTheme'
import './ScreenGallery.css'

/**
 * The real screens, one at a time and large enough to read.
 *
 * The captures are full 1512 px windows of the app. Shown as a row of small
 * tiles nothing on them is legible, so this shows one at a time at the width of
 * the page, cropped past the navigation rail to the part that carries the
 * content. Tabs switch between them; the caption belongs to the one on screen.
 */
export interface Shot {
  /** Key into SCREENS (data/orbCaptures.ts). */
  name: string
  /** Short tab label. */
  label: string
  caption: string
}

export default function ScreenGallery({ shots, label }: { shots: Shot[]; label: string }) {
  const [i, setI] = useState(0)
  const isLight = useIsLightTheme()
  const reduce = useReducedMotion()
  const shot = shots[Math.min(i, shots.length - 1)]
  const screen = SCREENS[shot.name]
  if (!screen) return null
  // The patient portal is its own layout and has no navigation rail to crop.
  const full = shot.name.startsWith('bridge') || shot.name.startsWith('login')

  return (
    <div className="gallery" role="group" aria-label={label}>
      {shots.length > 1 && (
        <div className="gallery__tabs" role="tablist" aria-label={`${label} screens`}>
          {shots.map((s, n) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={n === i}
              className={'gallery__tab' + (n === i ? ' is-active' : '')}
              onClick={() => setI(n)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className={'gallery__frame' + (full ? ' gallery__frame--full' : '')}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={`${shot.name}-${isLight ? 'l' : 'd'}`}
            src={isLight ? screen.light : screen.dark}
            alt={shot.caption}
            draggable={false}
            loading="lazy"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
        </AnimatePresence>
      </div>

      <p className="gallery__caption">{shot.caption}</p>
    </div>
  )
}
