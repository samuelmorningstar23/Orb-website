import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// Orb-website — standalone marketing/showcase site.
// Intentionally has NO backend, NO proxy, NO socket.io. It is fully
// independent from the clinical Orb app (which lives in the Orb Project repo).
// Port 5174 so it can run alongside the app's dev server (5173) without clashing.
export default defineConfig(({ command }) => ({
  // Production is served from https://<user>.github.io/Orb-website/ (project
  // Pages), so assets must resolve under that sub-path. Local dev stays at root.
  base: command === 'build' ? '/Orb-website/' : '/',
  plugins: [
    react(),
    {
      // GitHub Pages is a static host with no SPA rewrite. Copy index.html to
      // 404.html so deep links (e.g. /Orb-website/vigil) and refreshes boot the
      // app instead of hitting GitHub's 404 page.
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
}))
