import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * React Router keeps the window's scroll position across navigations, so
 * clicking a module link from far down the landing page would open the detail
 * page already scrolled into its middle. Reset to the top on each new
 * navigation.
 *
 * Two deliberate exceptions:
 *  - a hash link (#modules, /plans#max) scrolls to its anchor — retried across
 *    a few frames because the target page may not have rendered it yet
 *  - back/forward (POP) is left to the browser, which restores the previous
 *    position — so returning from a module lands you back in the grid
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let attempts = 0
      let raf = 0
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (attempts++ < 15) raf = requestAnimationFrame(tryScroll)
      }
      raf = requestAnimationFrame(tryScroll)
      return () => cancelAnimationFrame(raf)
    }
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash, navigationType])

  return null
}
