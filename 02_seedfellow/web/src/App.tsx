// 1. Write a Logo component that returns:
//      <span className="text-lg font-bold">Acme</span>

// 2. Write a NavBar component that returns a <nav> with three
//    <a> links: Home, Products, About.
//    Give the <nav> the classes "flex gap-4 text-sm".

// 3. Write a SiteHeader component that returns a <header> with the
//    classes "flex items-center justify-between border-b p-4",
//    containing <Logo /> and <NavBar />.

function App() {
	return (
		/*<div>
			<main className="mx-auto max-w-2xl p-8">
				<h1 className="mb-6 font-semibold text-2xl">Seedfellow</h1>
				<article className="rounded-xl border border-slate-200 p-4">
					<h2 className="font-medium text-lg">Berner Rose</h2>
					<p className="text-slate-500 text-sm italic">Solanum lycopersicum</p>
					<p className="mt-2 text-slate-700">
						A pink beefsteak tomato kept around Bern since the 1950s. Thin skin,
						so it travels badly and tastes like nothing you can buy.
					</p>
					<p className="mt-2 text-slate-700">Sow in March and April.</p>
					<p className="mt-2 font-medium text-sm">4 packets on the shelf</p>
				</article>
			</main>
		</div>*/
		<div className="min-h-screen bg-white">
			{/* 4. Render SiteHeader here, as a tag. */}
			<p className="p-4 text-red-600">No header yet.</p>

			<main className="p-4">
				<h2 className="text-2xl font-bold">Welcome</h2>
				<p className="mt-2 text-slate-600">
					The header above should show the logo on the left and the navigation
					on the right.
				</p>
			</main>
		</div>
	);
}

export default App;
