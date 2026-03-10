import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@salt-ds/theme/index.css'
import { SaltProvider } from '@salt-ds/core'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaltProvider mode="dark">
      <App />
    </SaltProvider>
  </StrictMode>,
)
