import { useState } from "react";
import type { Kind, Variety } from "../data/varieties";

// App was handling both filtering and page markup. This hook separates those jobs.
// Accept the list from the caller so filtering does not depend on one fixed catalogue.
export function useVarietyFilter(varieties: Variety[]) {
	// Hooks run at the top level, in the same order on every render.
	// Each caller gets its own state; extracting these calls does not share state.
	// Search text typed by the user. Starts empty, so every variety shows.
	const [search, setSearch] = useState("");
	// The kind picked in the filter bar. Starts at "all", so every kind shows.
	const [kind, setKind] = useState<Kind | "all">("all");
	// The "on the shelf" checkbox. Starts false, so retired and empty varieties show too.
	const [inStock, setInStock] = useState(false);

	// Derived, not state: recomputed from search on every render, so it never goes
	// stale. Lowercasing both sides makes the match case-insensitive.
	const shelf = varieties.filter(
		(variety) =>
			variety.name.toLowerCase().includes(search.toLowerCase()) &&
			(kind === "all" || variety.kind === kind) &&
			(!inStock || variety.packets > 0),
	);

	// Clear resets every filter together so no old selection keeps hiding varieties.
	// Return this function to App, which can pass it straight to the Clear button.
	function clear() {
		// this will reset the search input to an empty string
		setSearch("");
		// this will reset the kind selection to "all"
		setKind("all");
		// this will reset the in stock check
		setInStock(false);
	}

	// Named properties let App read the values without remembering tuple positions.
	// Returning the setters keeps VarietyFilter controlled: values down, changes up.
	return {
		search,
		setSearch,
		kind,
		setKind,
		inStock,
		setInStock,
		shelf,
		clear,
	};
}
