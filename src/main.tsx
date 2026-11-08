import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import './index.css'
import App from './App.tsx'

// Cache offline: a aula abre e roda sem internet depois da primeira visita.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(() => navigator.serviceWorker.ready)
      .then(registration => {
        // Entrega ao cache o que a primeira visita já baixou (página, código, fontes).
        const urls = [window.location.href.split('#')[0], ...performance.getEntriesByType('resource').map(entry => entry.name)]
        registration.active?.postMessage({ type: 'precache', urls })
      })
      .catch(() => undefined)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
