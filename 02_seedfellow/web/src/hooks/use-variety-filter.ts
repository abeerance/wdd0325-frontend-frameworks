import { useState } from "react";
import type { Kind, Variety } from "@/lib/types";

// The filter's state and the list it narrows.
export function useVarietyFilter<
  T extends Pick<Variety, "name" | "kind" | "packets">,
>(varieties: T[]) {
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
      (!inStock || variety.packets > 0),
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
