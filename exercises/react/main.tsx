// The runner for the platform exercises we solved in class.
//
// Each exercise is a folder next to this file holding its own App, and each folder
// is its own page: `jsx-syntax/App.tsx` opens at /jsx-syntax. A new folder with an
// App.tsx in it gets its page without touching this file. The home page lists them.
//
//   npm install
//   npm run dev

import { type ComponentType, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import './index.css'

// Every `<folder>/App.tsx`, loaded only when its page is opened.
const apps = import.meta.glob<{ default: ComponentType }>('./*/App.tsx')

const exercises = Object.entries(apps)
	.map(([path, load]) => ({ name: path.split('/')[1], load }))
	.sort((a, b) => a.name.localeCompare(b.name))

function Index() {
	return (
		<main className="p-8">
			<h1 className="mb-4 text-2xl font-bold">Exercises</h1>
			<ul className="list-disc pl-6">
				{exercises.map(({ name }) => (
					<li key={name}>
						<Link to={`/${name}`} className="text-blue-600 underline">
							{name}
						</Link>
					</li>
				))}
			</ul>
		</main>
	)
}

const router = createBrowserRouter([
	{ path: '/', Component: Index },
	...exercises.map(({ name, load }) => ({
		path: `/${name}`,
		lazy: async () => ({ Component: (await load()).default }),
	})),
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
