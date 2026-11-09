import type { CatalogueEntry } from "./catalogue-filter";
import { Card } from "./ui/card";
import { Text } from "./ui/text";

interface CatalogueResultsProps {
  entries: CatalogueEntry[];
  total: number;
}

// Only draws what it is given: entries is the filtered shelf, total the full count.
// It never filters itself, so the rule lives in one place, useVarietyFilter.
export function CatalogueResults({ entries, total }: CatalogueResultsProps) {
  return (
    <>
      {/* How many entries the filters leave, out of the whole library. */}
      <Text variant="muted">
        {entries.length} of {total} varieties
      </Text>
      {/* Two outcomes, never both, so a ternary: an empty shelf gets a
	    sentence, a full one gets the list. */}
      {entries.length === 0 ? (
        <Card>
          <Text>
            Nothing matches those filters. Clear them to see the whole library.
          </Text>
        </Card>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* The key sits on the outermost element of each item and uses the
					    id: stable across filtering, unlike the index. */}
          {entries.map((entry) => (
            <li key={entry.id} className="flex *:w-full">
              {entry.card}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
