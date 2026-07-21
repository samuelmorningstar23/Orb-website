import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { metaForPath, SITE_ORIGIN } from '../routeMeta'

// Keeps <title>, meta description, and the canonical link in sync during
// client-side navigation. First paint is already correct — the prerendered
// HTML for each route carries the same values from routeMeta.ts.
export default function RouteHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = metaForPath(pathname)
    document.title = meta.title

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = meta.description

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = SITE_ORIGIN + (meta.path === '/' ? '/' : meta.path)
  }, [pathname])

  return null
}
