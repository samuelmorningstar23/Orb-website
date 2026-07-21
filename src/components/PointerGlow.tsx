import { useEffect } from 'react'

// One delegated listener that lets cards render a soft highlight that follows
// the pointer (see the .glow rules in index.css). Card selectors are opted in
// here; the CSS gates the effect to hover-capable devices that haven't asked
// for reduced motion, so this stays purely decorative.
const CARD_SELECTOR = '.landing-overview__bento-card, .module-detail__card, .company-founder'

export default function PointerGlow() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(CARD_SELECTOR) as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
