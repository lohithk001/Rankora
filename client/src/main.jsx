import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx'
import './lib/errorTracker.js'
import './lib/analytics.js'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY. Please ensure it is present in .env.local')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ClerkProvider>
  </StrictMode>,
)