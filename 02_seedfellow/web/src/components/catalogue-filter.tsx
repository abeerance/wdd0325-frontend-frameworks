"use client";

import type { ReactNode } from "react";
import { CatalogueResults } from "@/components/catalogue-results";
import { VarietyFilter } from "@/components/variety-filter";
import { useVarietyFilter } from "@/hooks/use-variety-filter";
import type { Variety } from "@/lib/types";

// One row of the catalogue: the plain data the filter needs, plus the card already
// rendered. Pick<Variety, ...> is a built-in generic type: it takes Variety and a
// union of key names, and returns a type with only those keys. id is for the list
// key; name, kind and packets are what useVarietyFilter's constraint asks for.
//
// Why a pre-rendered card instead of the whole Variety: this file is a client
// component, the card is not. Data and elements cross the server -> client line;
// passing the card as a ReactNode keeps VarietyCard on the server.
export interface CatalogueEntry
  extends Pick<Variety, "id" | "name" | "kind" | "packets"> {
  card: ReactNode;
}

interface CatalogueFilterProps {
  entries: CatalogueEntry[];
}

// "use client" at the top: state and event handlers live here, so this part runs
// in the browser. Everything it renders from entries was built on the server.
export function CatalogueFilter({ entries }: CatalogueFilterProps) {
  // No <CatalogueEntry> written here: TypeScript infers T = CatalogueEntry from
  // entries, checks it has name, kind and packets, and types shelf as
  // CatalogueEntry[]. That is why shelf still has card for CatalogueResults below.
  const {
    search,
    setSearch,
    kind,
    setKind,
    inStock,
    setInStock,
    shelf,
    clear,
  } = useVarietyFilter(entries);

  return (
    <>
      {/* Lifting state up: this component owns the filters, the bar only shows them and reports changes,
          so the bar and the list always agree. */}
      <VarietyFilter
        search={search}
        onSearch={setSearch}
        kind={kind}
        onKind={setKind}
        inStock={inStock}
        onInStock={setInStock}
        onClear={clear}
      />
      <CatalogueResults entries={shelf} total={entries.length} />
    </>
  );
}
