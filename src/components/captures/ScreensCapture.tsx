import { useMemo } from 'react'
import Capture, { type CaptureFrame } from './Capture'
import { SCREENS } from '../../data/orbCaptures'
import { useIsLightTheme } from '../showcases/useIsLightTheme'

interface ScreensCaptureProps {
  /** Screen names from orbCaptures.SCREENS, shown in this order. */
  screens: string[]
  /** Optional caption per screen; falls back to the screen's title. */
  captions?: Record<string, string>
  /** Screens captured full-page (tall) are letterboxed instead of cropped. */
  tall?: string[]
  label: string
  holdMs?: number
  autoplay?: boolean
}

/**
 * Real module screens, following the site theme: the app was captured in both
 * its dark and light themes, so a visitor on the light site sees the light app.
 */
export default function ScreensCapture({ screens, captions, tall = [], label, holdMs = 4200, autoplay }: ScreensCaptureProps) {
  const isLight = useIsLightTheme()
  const frames = useMemo<CaptureFrame[]>(() => screens
    .filter(name => SCREENS[name])
    .map(name => ({
      src: isLight ? SCREENS[name].light : SCREENS[name].dark,
      caption: captions?.[name] ?? SCREENS[name].title,
      fit: tall.includes(name) ? 'contain' : 'cover',
    })), [screens, captions, tall, isLight])

  return <Capture frames={frames} label={label} holdMs={holdMs} autoplay={autoplay} />
}
