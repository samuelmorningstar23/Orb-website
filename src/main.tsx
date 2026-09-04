import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Product type stack, self-hosted (no CDN): Manrope body, Space Grotesk display,
// JetBrains Mono for data, Fraunces for editorial accents.
import '@fontsource-variable/manrope'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/fraunces/opsz-italic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
