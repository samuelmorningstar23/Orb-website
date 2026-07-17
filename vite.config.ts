import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// Orb-website — standalone marketing/showcase site.
// Intentionally has NO backend, NO proxy, NO socket.io. It is fully
// independent from the clinical Orb app (which lives in the Orb Project repo).
// Port 5174 so it can run alongside the app's dev server (5173) without clashing.
export default defineConfig({
  // Served from the root of the custom domain (orbintelligence.co), so assets
  // resolve at '/'. This was '/Orb-website/' while the site lived on the
  // github.io project sub-path — do not reintroduce that while a custom
  // domain is configured, or every asset 404s.
  base: '/',
  plugins: [
    react(),
    {
      // GitHub Pages is a static host with no SPA rewrite. Copy index.html to
      // 404.html so deep links (e.g. /sage) and refreshes boot the app instead
      // of hitting GitHub's 404 page.
      name: 'spa-fallback-404',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  server: {
    port: 5174,
    host: '0.0.0.0',
  },
})
