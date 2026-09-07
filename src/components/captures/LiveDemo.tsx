import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useIsLightTheme } from '../showcases/useIsLightTheme'
import './LiveDemo.css'

/**
 * The real Orb front end, running in the visitor's browser.
 *
 * /demo/ is a build of the clinical app whose API calls are answered from a
 * recording of the real backend (see src/demo/shim.ts in the Orb repo), so the
 * module the visitor sees is the module itself: same code, same screens, same
 * rules, on seeded demo patients. A view names a scripted workflow
 * (src/demo/scripts.ts in the Orb repo): the app is locked to that workflow,
 * carries only its recording, and is stepped through with a caption for each
 * step. It plays on its own while on screen and starts over when it ends;
 * clicking into the app pauses it.
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
  /** A scripted workflow (src/demo/scripts.ts in the Orb repo): the app is locked to it and stepped through. */
  script?: string
}

interface LiveDemoProps {
  views: LiveDemoView[]
  label: string
  /** Mount the iframe only when scrolled into view (the explorer swaps often). */
  lazy?: boolean
}

const demoUrl = (v: LiveDemoView, light: boolean) => {
  const q = new URLSearchParams({ persona: v.persona })
  if (v.script) q.set('script', v.script)
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
  const [captions, setCaptions] = useState<string[]>([])
  const [step, setStep] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [again, setAgain] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const pendingStart = useRef<number | null>(null)
  // Seen once: mount the app. On screen now: let the workflow play.
  const seen = useInView(rootRef, { amount: 0.2, once: true })
  const onScreen = useInView(rootRef, { amount: 0.35 })
  const isLight = useIsLightTheme()
  const reduce = useReducedMotion()
  const view = views.find(v => v.id === active) ?? views[0]
  const mount = !lazy || seen
  const src = demoUrl(view, isLight)

  // The shim posts a message when the app has booted on the requested tab.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return
      if (e.data?.type === 'orb-demo-ready') setReady(true)
      if (e.data?.type === 'orb-demo-error') setFailed(true)
      if (e.data?.type === 'orb-demo-script') { setCaptions(e.data.captions || []); setStep(-1) }
      if (e.data?.type === 'orb-demo-stepped') { setStep(e.data.n); setBusy(false) }
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

  // A real click or keystroke inside the app takes the wheel: the workflow stops
  // stepping over the visitor. The scripted steps are synthetic events and do not count.
  useEffect(() => {
    if (!ready) return
    const doc = frameRef.current?.contentDocument
    if (!doc) return
    const onInput = (e: Event) => { if (e.isTrusted) setPlaying(false) }
    doc.addEventListener('pointerdown', onInput, true)
    doc.addEventListener('keydown', onInput, true)
    return () => { doc.removeEventListener('pointerdown', onInput, true); doc.removeEventListener('keydown', onInput, true) }
  }, [ready, nonce, active])

  const reset = () => { setReady(false); setFailed(false); setCaptions([]); setStep(-1); setBusy(false) }
  const restart = () => { setAgain(false); reset(); setNonce(n => n + 1) }
  const replay = () => { setAgain(true); reset(); setNonce(n => n + 1) }
  const switchView = (id: string) => { setAgain(false); setActive(id); reset(); setPlaying(true) }

  const scripted = !!view.script
  const total = captions.length
  const runStep = (n: number) => {
    if (!scripted || busy || n < 0 || n >= total) return
    if (n < step) {
      // The app cannot rewind a workflow; start it again and replay up to that step.
      setAgain(false); reset(); setNonce(k => k + 1)
      pendingStart.current = n
      return
    }
    setBusy(true)
    frameRef.current?.contentWindow?.postMessage({ type: 'orb-demo-run', n }, '*')
  }

  // Autoplay: after a step lands, hold long enough to read its caption, then run
  // the next. After the last step, hold on that screen and play it again from the top.
  useEffect(() => {
    if (!scripted || !playing || busy || !ready || step < 0 || !onScreen || total < 1) return
    if (step < total - 1) {
      const hold = 2600 + Math.min(4200, (captions[step]?.length ?? 0) * 40)
      const t = window.setTimeout(() => runStep(step + 1), hold)
      return () => window.clearTimeout(t)
    }
    if (total < 2) return
    const t = window.setTimeout(replay, Math.max(8000, 3000 * total))
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripted, playing, busy, ready, step, total, onScreen])

  // A restart requested with a target step replays to it as soon as the script announces itself.
  useEffect(() => {
    if (captions.length && pendingStart.current !== null) { const n = pendingStart.current; pendingStart.current = null; runStep(n) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captions])

  return (
    <div className={'module-detail__visual-frame live' + (ready ? ' is-ready' : '')} ref={rootRef} role="group" aria-label={label}>
      <div className="live__top">
        <span className="live__badge" aria-hidden="true"><span className="live__badge-dot" />Live<span className="live__badge-tail"> · runs in your browser</span></span>
        {views.length > 1 && (
          <div className="live__tabs" role="tablist" aria-label={`${label} views`}>
            {views.map(v => (
              <button key={v.id} type="button" role="tab" aria-selected={v.id === active} className={'live__tab' + (v.id === active ? ' is-active' : '')} onClick={() => switchView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

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
          onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: 'orb-demo-hello' }, '*')}
        />
      )}

      {(!ready || failed) && (
        <div className="live__poster" aria-hidden={ready}>
          {view.poster && <img className="live__poster-img" src={view.poster} alt="" draggable={false} />}
          <div className="live__poster-veil">
            {failed
              ? <span className="live__poster-text">The demo could not start in this browser. <button type="button" className="live__poster-link" onClick={restart}>Try again</button></span>
              : <span className="live__poster-text"><span className={'live__spinner' + (reduce ? ' live__spinner--still' : '')} aria-hidden="true" />{again ? 'Playing it again' : 'Starting Orb in your browser'}</span>}
          </div>
        </div>
      )}

      {scripted ? (
        <div className="live__bar live__bar--script">
          <div className="live__script">
            <span className="live__script-count">{step >= 0 ? `${step + 1} / ${total || '…'}` : (ready ? 'Ready' : '…')}</span>
            <p className="live__caption" aria-live="polite">{step >= 0 ? captions[step] : (view.hint ?? 'Starting the workflow…')}</p>
          </div>
          <div className="live__bar-actions">
            <button type="button" className="live__btn" aria-label="Previous step" disabled={busy || step <= 0} onClick={() => runStep(step - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button type="button" className="live__btn" aria-label={playing ? 'Pause' : 'Play'} aria-pressed={playing} onClick={() => setPlaying(p => !p)}>
              {playing
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>}
            </button>
            <button type="button" className="live__btn" aria-label="Next step" disabled={busy || step >= total - 1} onClick={() => runStep(step + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
            <button type="button" className="live__btn" onClick={restart}>Restart</button>
            <a className="live__btn live__btn--primary" href={src} target="_blank" rel="noopener">Full screen</a>
          </div>
          <div className="live__dots" aria-hidden="true">
            {captions.map((_, i) => <span key={i} className={'live__dot' + (i <= step ? ' is-done' : '') + (i === step ? ' is-active' : '')} />)}
          </div>
        </div>
      ) : (
        <div className="live__bar">
          <span className="live__bar-note">{view.hint ?? 'The product, on seeded demo patients. Click anything.'}</span>
          <div className="live__bar-actions">
            <button type="button" className="live__btn" onClick={restart}>Restart</button>
            <a className="live__btn live__btn--primary" href={src} target="_blank" rel="noopener">Open full screen</a>
          </div>
        </div>
      )}
    </div>
  )
}
