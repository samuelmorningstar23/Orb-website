import { useEffect, useState } from 'react'

const readTheme = () => document.documentElement.getAttribute('data-theme') === 'light'

/**
 * Tracks the site theme for showcases that pick colours in JS (canvas
 * drawing, inline styles). Listens to both the `theme-changed` event the
 * header dispatches and the attribute itself, so it stays correct even if a
 * showcase mounts somewhere the event is never fired.
 */
export function useIsLightTheme(): boolean {
  const [isLight, setIsLight] = useState(readTheme)

  useEffect(() => {
    const update = () => setIsLight(readTheme())
    window.addEventListener('theme-changed', update)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      window.removeEventListener('theme-changed', update)
      observer.disconnect()
    }
  }, [])

  return isLight
}
