// The page. It holds no card markup of its own: from night 4 the card lives in its
// own file and is used here as a tag, and from night 5 the page draws one card per
// variety in the data file instead of a fixed one.
//
// A named import, so the braces are required. VarietyCard is exported by name from
// that file; App is the one default export in the project, because main.tsx imports
// it that way.
import { useEffect } from "react";
import { Text } from "./components/ui/text";
import { VarietyCard } from "./components/variety-card";
import { VARIETIES } from "./data/varieties";
import { VarietyFilter } from "./components/variety-filter";
import { Card } from "./components/ui/card";
import { useVarietyFilter } from "./hooks/use-variety-filter";

// No return type. Every component returns a ReactNode, so writing it says nothing
// the compiler does not already know.
function App() {
	// The hook groups the filter's state, calculation and reset in one place.
	// Its state still belongs to this App; another caller would get its own state.
	// Read the returned values by name, then pass them to the filter bar below.
	const {
		search,
		setSearch,
		kind,
		setKind,
		inStock,
		setInStock,
		shelf,
		clear,
	} = useVarietyFilter(VARIETIES);

	// React calls App to work out the JSX, then updates the page's DOM.
	// The browser tab is outside that JSX, so an effect keeps its title in sync.
	// The setup runs after the first commit. On later renders, React compares
	// the dependencies and runs it again when the displayed count changes.
	// List the changing values read by the setup: shelf.length changes, while
	// the imported catalogue and the browser's document are stable here.
	// If a setup returns cleanup, React calls it before a changed-dependency
	// setup and when the component unmounts, not immediately after every setup.
	// This assignment starts no timer or listener, so there is nothing to clean up.
	useEffect(() => {
		document.title = `Seedfellow · ${shelf.length} of ${VARIETIES.length} varieties`;
	}, [shelf.length]); // The dependency array connects the effect to this count.

	return (
		<div>
			<main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
				<h1 className="font-semibold text-2xl">Seedfellow</h1>
				{/* Lifting state up: App owns search, kind and inStock, the filter bar only
				    shows them and reports changes. That is why both the bar and the list
				    below always agree. */}
				<VarietyFilter
					search={search}
					onSearch={setSearch}
					kind={kind}
					onKind={setKind}
					inStock={inStock}
					onInStock={setInStock}
					onClear={clear}
				/>
				{/* How many varieties the filters leave, out of the whole library. One
				    expression with no rule in it, so it stays inline. */}
				<Text variant="muted">
					{shelf.length} of {VARIETIES.length} varieties
				</Text>
				{/* Two outcomes, never both, so a ternary: an empty shelf gets a
				    sentence, a full one gets the list. */}
				{shelf.length === 0 ? (
					<Card>
						<Text>
							Nothing matches those filters. Clear them to see the whole
							library.
						</Text>
					</Card>
				) : (
					<ul className="flex flex-col gap-4">
						{/* .map turns each variety into an element. The key sits on the
						    outermost element of each item, the <li>, and uses the id:
						    stable across reorders, unlike the index. */}
						{shelf.map((variety) => (
							<li key={variety.id}>
								{/* The card decides when a borrow happens, App decides what a
								    borrow does. The card calls onSelect with its variety, and
								    this arrow receives it as picked. */}
								<VarietyCard
									variety={variety}
									onSelect={(picked) => alert(`Borrowing ${picked.name}`)}
								/>
							</li>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}

export default App;
