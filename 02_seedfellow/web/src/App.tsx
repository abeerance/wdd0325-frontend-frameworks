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
import { VARIETIES } from "./data/varieties";

// No return type. Every component returns a ReactNode, so writing it says nothing
// the compiler does not already know.
function App() {
	// Search text typed by the user. Starts empty, so every variety shows.
	const [search, setSearch] = useState("");

	// Derived, not state: recomputed from search on every render, so it never goes
	// stale. Lowercasing both sides makes the match case-insensitive.
	const shelf = VARIETIES.filter((variety) =>
		variety.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div>
			<main className="mx-auto max-w-2xl p-8">
				<h1 className="mb-6 font-semibold text-2xl">Seedfellow</h1>
				<div className="flex flex-col gap-1 mb-4">
					<label
						htmlFor="search"
						className="font-medium text-slate-500 text-xs"
					>
						Search
					</label>
					<input
						type="text"
						// Controlled input: the field always shows what search holds.
						value={search}
						// Each keystroke stores the new text -> re-render -> shelf refilters.
						onChange={(event) => {
							setSearch(event.target.value);
						}}
						placeholder="z.B. Berner Rose"
						className="h-9 rounded-lg border border-slate-300 px-2 text-sm"
					/>
				</div>
				{/* Two outcomes, never both, so a ternary: an empty library gets a
				    sentence, a full one gets the list. */}
				{shelf.length === 0 ? (
					<Text>
						The library holds nothing yet. Bring seed to the next opening and it
						will be here.
					</Text>
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
