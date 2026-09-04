import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useIsLightTheme } from '../showcases/useIsLightTheme'
import './LiveDemo.css'

/**
 * The real Orb front end, running in the visitor's browser.
 *
 * /demo/ is a build of the clinical app whose API calls are answered from a
 * recording of the real backend (see src/demo/shim.ts in the Orb repo), so the
 * module the visitor clicks on is the module itself: same code, same screens,
 * same rules, on seeded demo patients. The frame boots on the persona and tab
 * for this module, shows a poster until the app reports ready, and can be
 * restarted or opened full screen.
 */
export interface LiveDemoView {
  id: string
  label: string
  persona: 'doctor' | 'surgeon' | 'nurse' | 'pharmacist' | 'admin' | 'patient'
  tab?: string
  subtab?: string
  /** An element id to click once the tab is open (e.g. the Pulse button). */
  open?: string
  poster?: string
  /** One thing worth trying in this view, shown under the frame. */
  hint?: string
}

interface LiveDemoProps {
  views: LiveDemoView[]
  label: string
  /** Mount the iframe only when scrolled into view (the explorer swaps often). */
  lazy?: boolean
}

const demoUrl = (v: LiveDemoView, light: boolean) => {
  const q = new URLSearchParams({ persona: v.persona })
  if (v.tab) q.set('tab', v.tab)
  if (v.subtab) q.set('subtab', v.subtab)
  if (v.open) q.set('open', v.open)
  q.set('theme', light ? 'light' : 'dark')
  return `/demo/index.html?${q.toString()}`
}

export default function LiveDemo({ views, label, lazy = true }: LiveDemoProps) {
  const [active, setActive] = useState(views[0].id)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [nonce, setNonce] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const inView = useInView(rootRef, { amount: 0.2, once: true })
  const isLight = useIsLightTheme()
  const reduce = useReducedMotion()
  const view = views.find(v => v.id === active) ?? views[0]
  const mount = !lazy || inView
  const src = demoUrl(view, isLight)

  // The shim posts a message when the app has booted on the requested tab.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return
      if (e.data?.type === 'orb-demo-ready') setReady(true)
      if (e.data?.type === 'orb-demo-error') setFailed(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // A boot that never reports is still shown after a while; a poster is not the product.
  useEffect(() => {
    if (!mount || ready) return
    const t = window.setTimeout(() => setReady(true), 9000)
    return () => window.clearTimeout(t)
  }, [mount, ready, nonce, src])

  const restart = () => { setReady(false); setFailed(false); setNonce(n => n + 1) }
  const switchView = (id: string) => { setActive(id); setReady(false); setFailed(false) }

  return (
    <div className={'module-detail__visual-frame live' + (ready ? ' is-ready' : '')} ref={rootRef} role="group" aria-label={label}>
      {mount && !failed && (
        <iframe
          key={`${view.id}-${nonce}-${isLight ? 'l' : 'd'}`}
          ref={frameRef}
          className="live__frame"
          src={src}
          title={label}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="clipboard-read; clipboard-write"
        />
      )}

      {(!ready || failed) && (
        <div className="live__poster" aria-hidden={ready}>
          {view.poster && <img className="live__poster-img" src={view.poster} alt="" draggable={false} />}
          <div className="live__poster-veil">
            {failed
              ? <span className="live__poster-text">The demo could not start in this browser. <button type="button" className="live__poster-link" onClick={restart}>Try again</button></span>
              : <span className="live__poster-text"><span className={'live__spinner' + (reduce ? ' live__spinner--still' : '')} aria-hidden="true" />Starting Orb in your browser</span>}
          </div>
        </div>
      )}

      <span className="live__badge" aria-hidden="true"><span className="live__badge-dot" />Live · runs in your browser</span>

      {views.length > 1 && (
        <div className="live__tabs" role="tablist" aria-label={`${label} views`}>
          {views.map(v => (
            <button key={v.id} type="button" role="tab" aria-selected={v.id === active} className={'live__tab' + (v.id === active ? ' is-active' : '')} onClick={() => switchView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="live__bar">
        <span className="live__bar-note">{view.hint ?? 'The product, on seeded demo patients. Click anything.'}</span>
        <div className="live__bar-actions">
          <button type="button" className="live__btn" onClick={restart}>Restart</button>
          <a className="live__btn live__btn--primary" href={src} target="_blank" rel="noopener">Open full screen</a>
        </div>
      </div>
    </div>
  )
}
