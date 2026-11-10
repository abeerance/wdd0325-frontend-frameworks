import { CatalogueFilter } from "@/components/catalogue-filter";
import { VarietyCard } from "@/components/variety-card";
import { brief, getVarieties } from "@/lib/varieties";

// A server component, and async so it can wait for getVarieties(). It builds every card here, on the
// server, and hands the finished cards to the client filter, which only decides which to show.
// The cards therefore never become client JavaScript.
export async function Catalogue() {
	const varieties = await getVarieties();
	// No type annotation needed: the object shape matches CatalogueEntry, which
	// TypeScript checks where entries is passed to CatalogueFilter.
	const entries = varieties.map((variety) => ({
		...brief(variety),
		card: <VarietyCard variety={variety} />,
	}));

	return <CatalogueFilter entries={entries} />;
}
