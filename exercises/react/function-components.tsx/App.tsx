// 1. Write a Logo component that returns:
//      <span className="text-lg font-bold">Acme</span>
function Logo() {
	return <span className="text-lg font-bold">Acme</span>;
}

// 2. Write a NavBar component that returns a <nav> with three
//    <a> links: Home, Products, About.
//    Give the <nav> the classes "flex gap-4 text-sm".
function NavBar() {
	return (
		<nav className="flex gap-4 text-sm">
			<a href="#home">Home</a>
			<a href="#products">Products</a>
			<a href="#about">About</a>
		</nav>
	);
}

// 3. Write a SiteHeader component that returns a <header> with the
//    classes "flex items-center justify-between border-b p-4",
//    containing <Logo /> and <NavBar />.
function SiteHeader() {
	return (
		<header className="flex items-center justify-between border-b p-4">
			<Logo />
			<NavBar />
		</header>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-white">
			{/* 4. Render SiteHeader here, as a tag. */}
			<SiteHeader />

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
