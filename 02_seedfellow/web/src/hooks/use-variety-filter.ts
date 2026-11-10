import { useState } from "react";
import type { Kind, Variety, VarietyBrief } from "@/lib/types";

// App was handling both filtering and page markup. This hook separates those jobs.
// Accept the list from the caller so filtering does not depend on one fixed catalogue.
//
// <T> is a generic: a type parameter, filled in by TypeScript from whatever the
// caller passes. Call it with CatalogueEntry[] and T becomes CatalogueEntry; call it
// with Variety[] and T becomes Variety. Nobody writes the type out by hand.
//
// Why: the hook filters, it does not care what else an item carries. With a plain
// Variety[] parameter, shelf would come back as Variety[] and the caller would lose
// its extra fields (CatalogueEntry's card). With T, what goes in comes back out.
//
// `extends` is the constraint: T may be any shape, as long as it has at least the
// three fields the filter reads. Pick<Variety, ...> builds that minimum from
// Variety, so a renamed field on Variety breaks here instead of drifting silently.
// Passing something without packets is a type error at the call site.
//
// The return type is not written out: TypeScript infers it, and shelf comes back as T[], not
// Variety[]. That is where the generic pays off for the caller.
export function useVarietyFilter<T extends VarietyBrief>(varieties: T[]) {
	const [search, setSearch] = useState("");
	// The kind picked in the filter bar. Starts at "all", so every kind shows.
	const [kind, setKind] = useState<Kind | "all">("all");
	// The "on the shelf" checkbox. Starts false, so retired and empty varieties show too.
	const [inStock, setInStock] = useState(false);

	// Derived, not stored. It is recalculated on every render and is therefore never stale.
	const shelf = varieties.filter(
		(variety) =>
			variety.name.toLowerCase().includes(search.toLowerCase()) &&
			(kind === "all" || variety.kind === kind) &&
			(!inStock || variety.packets_available > 0),
	);

	// Clear resets everything that narrows the list.
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
