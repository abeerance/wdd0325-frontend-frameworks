// The page. It holds no card markup of its own: from night 4 the card lives in its
// own file and is used here as a tag, and from night 5 the page draws one card per
// variety in the data file instead of a fixed one.
//
// A named import, so the braces are required. VarietyCard is exported by name from
// that file; App is the one default export in the project, because main.tsx imports
// it that way.
import { useState } from "react";
import { Text } from "./components/ui/text";
import { VarietyCard } from "./components/variety-card";
import { VARIETIES, type Kind } from "./data/varieties";
import { VarietyFilter } from "./components/variety-filter";
import { Card } from "./components/ui/card";

// No return type. Every component returns a ReactNode, so writing it says nothing
// the compiler does not already know.
function App() {
	// Search text typed by the user. Starts empty, so every variety shows.
	const [search, setSearch] = useState("");
	// The kind picked in the filter bar. Starts at "all", so every kind shows.
	const [kind, setKind] = useState<Kind | "all">("all");
	// The "on the shelf" checkbox. Starts false, so retired and empty varieties show too.
	const [inStock, setInStock] = useState(false);

	// Derived, not state: recomputed from search on every render, so it never goes
	// stale. Lowercasing both sides makes the match case-insensitive.
	const shelf = VARIETIES.filter(
		(variety) =>
			variety.name.toLowerCase().includes(search.toLowerCase()) &&
			(kind === "all" || variety.kind === kind) &&
			(!inStock || variety.packets > 0),
	);

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
					onClear={() => {
						// this will reset the search input to an empty string
						setSearch("");
						// this will reset the kind selection to "all"
						setKind("all");
						// this will reset the in stock check
						setInStock(false);
					}}
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
