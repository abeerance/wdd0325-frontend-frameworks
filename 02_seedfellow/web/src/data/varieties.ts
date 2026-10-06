// The data, kept apart from the markup. Components import it; nothing in here
// knows about React.

// This kind type will be needed for the filter bar for example
export type Kind = "vegetable" | "herb" | "flower" | "grain";

// The shape every variety has. Exported so the card can type its prop with it.
export interface Variety {
	// Unique and stable, which is what makes it the right React key.
	id: number;
	name: string;
	species: string;
	kind: Kind;
	story: string;
	sowing: string;
	packets: number;
	// Optional: most varieties leave it out, which reads as not retired.
	retired?: boolean;
}

// Upper case marks a constant that never changes while the app runs. Typing it
// Variety[] makes the compiler check every entry against the interface.
export const VARIETIES: Variety[] = [
	{
		id: 1,
		name: "Berner Rose",
		species: "Solanum lycopersicum",
		kind: "vegetable",
		story:
			"A pink beefsteak tomato kept around Bern since the 1950s. Thin skin, so it travels badly and tastes like nothing you can buy.",
		sowing: "March and April",
		packets: 4,
	},
	{
		id: 4,
		name: "Küttiger Rüebli",
		species: "Daucus carota",
		kind: "vegetable",
		story:
			"A white carrot from Küttigen in the Aargau, short and blunt and a little peppery. It nearly disappeared when orange carrots took the market.",
		sowing: "April, May and June",
		packets: 2,
	},
	{
		id: 17,
		name: "Genovese",
		species: "Ocimum basilicum",
		kind: "herb",
		story:
			"Large soft leaves, the basil grown for pesto. It hates cold feet, so keep the pot off a stone floor until June.",
		sowing: "April, May and June",
		packets: 5,
	},
	{
		id: 28,
		name: "Schwarzer Hafer",
		species: "Avena sativa",
		kind: "grain",
		story:
			"A black-husked oat, kept by the library as a green manure as much as a grain. Cut it before it seeds and it feeds the soil instead of you.",
		sowing: "March and April",
		packets: 0,
		retired: true,
	},
	{
		id: 22,
		name: "Resina",
		species: "Calendula officinalis",
		kind: "flower",
		story:
			"A single-flowered calendula grown for its resin, which is what makes the salve. Deadhead it and it flowers until the first hard frost.",
		sowing: "March to August",
		packets: 6,
	},
];
