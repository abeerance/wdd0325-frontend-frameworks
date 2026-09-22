// The entry point Vite loads. It runs once and hands the whole app to React.
//
// index.css is imported here, not in App.tsx: it holds the Tailwind import and
// applies to the whole page, so it belongs in the file that owns the whole page.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// One root div in index.html, one createRoot, everything else inside it.
// The ! is the non-null assertion: getElementById can return null, and here it
// cannot, because that div is two lines away in the HTML.
//
// StrictMode is a development-only wrapper. It renders components twice on purpose
// to surface work that should not be happening during a render.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
