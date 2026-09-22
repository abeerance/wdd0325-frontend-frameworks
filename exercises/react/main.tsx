// The runner for the platform exercises we solved in class.
//
// Each exercise is a folder next to this file holding its own App. Only one can be
// on screen at a time, so switch by changing which line below is commented in, then
// save: the browser updates without a reload.
//
//   npm install
//   npm run dev

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// import App from './jsx-syntax/App'
// import App from './function-components.tsx/App'
import App from './props-and-types/App'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
