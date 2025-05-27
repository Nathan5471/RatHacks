import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

const matomoInstance = createInstance({
  urlBase: 'https://matomo.rathacks.com',
  siteId: 1,
  trackerUrl: 'https://matomo.rathacks.com/matomo.php',
  srcUrl: 'https://matomo.rathacks.com/matomo.js',
})

createRoot(document.getElementById('root')).render(
  <MatomoProvider value={matomoInstance}>
  <StrictMode>
    <App />
  </StrictMode>
  </MatomoProvider>
)
