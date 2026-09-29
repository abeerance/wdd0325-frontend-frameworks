// Night 4, block 1. The function-components exercise, as we solved it in the room.
//
// Three components, one of them holding the other two. Nothing here takes a value
// from outside yet: every component renders exactly one fixed thing. That is the
// limit props remove in the next block.
//
// Two rules the whole file depends on:
//   - A component name starts with a capital letter. <logo /> compiles, renders an
//     unknown empty element and reports nothing at all.
//   - A component is used as a tag, <Logo />, never called as Logo().

// 1. Write a Logo component that returns:
//      <span className="text-lg font-bold">Acme</span>
function Logo() {
	return <span className="text-lg font-bold">Acme</span>;
}

// A component may return any single element. Here it is one <span>, which is why
// no wrapper and no fragment is needed.

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

// Three <a> tags inside one <nav>. The <nav> is the single root this return gives
// back, and the three links are its children.

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

// SiteHeader uses Logo and NavBar as tags. React reads those capitals, finds the
// functions above and calls them for us. In the project this becomes one component
// per file, kebab-case file name, PascalCase component, exported by name.

function App() {
	return (
		<div className="min-h-screen bg-white">
			{/* 4. Render SiteHeader here, as a tag. Self-closing, because it has no
			    children of its own. <SiteHeader></SiteHeader> is the same thing
			    written longer. */}
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


