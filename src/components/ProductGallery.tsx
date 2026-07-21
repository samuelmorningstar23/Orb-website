import { useEffect, useRef } from 'react'
import './ProductGallery.css'

// ── OWNER: drop real screenshots of the Orb app into src/assets/product/
// (png/jpg/webp). They appear here automatically, newest design last —
// files are sorted by name, so prefix with 01-, 02-, … to control order.
// Captions come from the filename: "02-ward-overview.png" → "Ward overview".
// Until at least one screenshot exists, this section renders nothing at all —
// same rule as the proof band: no real artifact, no section.
const shots = Object.entries(
  import.meta.glob<{ default: string }>('../assets/product/*.{png,jpg,jpeg,webp}', { eager: true })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const file = path.split('/').pop() ?? ''
    const caption = file
      .replace(/\.[a-z]+$/i, '')
      .replace(/^\d+[-_]?/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
    return { src: mod.default, caption }
  })

export default function ProductGallery() {
  const trackRef = useRef<HTMLDivElement>(null)

  // Gentle reveal as frames enter the viewport. CSS ignores the class under
  // prefers-reduced-motion, so this stays decorative.
  useEffect(() => {
    const track = trackRef.current
    if (!track || shots.length === 0) return
    const frames = Array.from(track.querySelectorAll('.product-gallery__frame'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-seen')),
      { threshold: 0.25 }
    )
    frames.forEach((f) => io.observe(f))
    return () => io.disconnect()
  }, [])

  if (shots.length === 0) return null

  return (
    <section className="product-gallery" aria-label="Screenshots of the Orb application">
      <div className="product-gallery__header">
        <span className="product-gallery__eyebrow">The real thing</span>
        <h2 className="product-gallery__title">Straight from the product.</h2>
        <p className="product-gallery__lede">
          Actual screenshots of the Orb application — not mockups, not animations.
        </p>
      </div>

      <div className="product-gallery__track" ref={trackRef}>
        {shots.map((shot) => (
          <figure className="product-gallery__frame" key={shot.src}>
            <img src={shot.src} alt={`Orb application — ${shot.caption}`} loading="lazy" />
            <figcaption>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
