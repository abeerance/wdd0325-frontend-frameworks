import { CatalogueFilter } from "@/components/catalogue-filter";
import { VarietyCard } from "@/components/variety-card";
import { getVarieties } from "@/lib/varieties";

export async function Catalogue() {
  const varieties = await getVarieties();
  // No type annotation needed: the object shape matches CatalogueEntry, which
  // TypeScript checks where entries is passed to CatalogueFilter.
  const entries = varieties.map((variety) => ({
    id: variety.id,
    name: variety.name,
    kind: variety.kind,
    packets: variety.packets,
    card: <VarietyCard variety={variety} />,
  }));

  return <CatalogueFilter entries={entries} />;
}
