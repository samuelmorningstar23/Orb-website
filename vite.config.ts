import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Orb-website — standalone marketing/showcase site.
// Intentionally has NO backend, NO proxy, NO socket.io. It is fully
// independent from the clinical Orb app (which lives in the Orb Project repo).
// Port 5174 so it can run alongside the app's dev server (5173) without clashing.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0',
  },
})
