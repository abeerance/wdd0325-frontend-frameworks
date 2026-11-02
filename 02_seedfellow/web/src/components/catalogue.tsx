import { CatalogueFilter } from "@/components/catalogue-filter";
import { VarietyCard } from "@/components/variety-card";
import { VARIETIES } from "@/data/varieties";

// No "use client": this is a server component. It renders every card once on the
// server, then hands the client filter only what it needs to filter, plus the
// finished cards to show or hide.
export function Catalogue() {
  // No type annotation needed: the object shape matches CatalogueEntry, which
  // TypeScript checks where entries is passed to CatalogueFilter.
  const entries = VARIETIES.map((variety) => ({
    id: variety.id,
    name: variety.name,
    kind: variety.kind,
    packets: variety.packets,
    card: <VarietyCard variety={variety} />,
  }));

  return <CatalogueFilter entries={entries} />;
}
