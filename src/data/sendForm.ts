// ─── One way to send a form ───
// Both the demo modal and the support page post here, so the timeout, the
// trimming, the honeypot and the error wording cannot drift apart.
import { CONTACT_EMAIL, WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from './siteContent'

/** A request that never answers is worse than one that fails: it just spins. */
const TIMEOUT_MS = 15_000

export type SendResult = { ok: true } | { ok: false; error: string }

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export async function sendForm(fields: Record<string, string>, honeypot: string): Promise<SendResult> {
  // The hidden field is passed through as botcheck and Web3Forms decides. The
  // client must not drop the message itself: if a browser ever autofills that
  // field, silently swallowing a real enquiry is far worse than a little spam.
  const body: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    from_name: 'Orb Website',
    botcheck: honeypot.trim(),
  }
  for (const [k, v] of Object.entries(fields)) body[k] = v.trim()

  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    const detail = await res.json().catch(() => null)
    if (res.ok && detail?.success) return { ok: true }
    return { ok: false, error: `We couldn’t send that just now. Please try again, or email ${CONTACT_EMAIL}.` }
  } catch (e) {
    const timedOut = e instanceof DOMException && e.name === 'AbortError'
    return {
      ok: false,
      error: timedOut
        ? `That took too long to send. Please try again, or email ${CONTACT_EMAIL}.`
        : `We couldn’t reach the server. Please check your connection, or email ${CONTACT_EMAIL}.`,
    }
  } finally {
    window.clearTimeout(timer)
  }
}

/** Keeps Tab inside an open dialog, and hands focus back when it closes. */
export function trapFocus(container: HTMLElement | null): () => void {
  const previous = document.activeElement as HTMLElement | null
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !container) return
    const items = Array.from(
      container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'),
    ).filter(el => el.offsetParent !== null || el === document.activeElement)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
  window.addEventListener('keydown', onKey, true)
  return () => {
    window.removeEventListener('keydown', onKey, true)
    previous?.focus?.()
  }
}
