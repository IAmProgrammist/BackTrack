import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../styles/fonts.css"
import "../styles/colors.css"
import "../styles/cleaner.css"
import "../styles/spaces.css"
import "../styles/transition.css"
import "../styles/shadows.css"
import "../styles/base.css"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
