import { useState } from "react";
import type { Kind, Variety } from "../data/varieties";

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
// The return type below is written out so the contract reads at a glance. shelf
// is T[], not Variety[]: that line is where the generic pays off for the caller.
export function useVarietyFilter<
  T extends Pick<Variety, "name" | "kind" | "packets">,
>(
  varieties: T[],
): {
  search: string;
  setSearch: (value: string) => void;
  kind: Kind | "all";
  setKind: (value: Kind | "all") => void;
  inStock: boolean;
  setInStock: (value: boolean) => void;
  shelf: T[];
  clear: () => void;
} {
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
  // filter keeps the element type, so T[] in gives T[] out, and inside the arrow
  // variety is a T: only name, kind and packets are guaranteed, which is all it reads.
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
