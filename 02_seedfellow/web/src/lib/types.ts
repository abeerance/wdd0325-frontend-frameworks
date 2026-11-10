// Types only. They are erased at build time, so a server file and a client file can both import
// them. The data and its functions are server-only; this file is deliberately not.
// This kind type will be needed for the filter bar for example
export type Kind = "vegetable" | "herb" | "flower" | "grain";

export interface PhotoCredit {
	author: string;
	licence: string;
	source_url: string;
	modified: boolean;
}

// The shape every variety has. Exported so the card can type its prop with it.
export interface Variety {
	// Unique and stable, which is what makes it the right React key.
	id: number;
	name: string;
	species: string;
	kind: Kind;
	story: string;
	sowing_months: number[];
	packets_available: number;
	retired?: boolean;
	has_photo: boolean;
	photo_version: string | null;
	photo_credit: PhotoCredit | null;
}

// What a member wrote after growing a packet.
export interface HarvestNote {
	id: number;
	borrowing_id: number;
	body: string;
	seeds_sown: number;
	seeds_germinated: number;
	has_photo: boolean;
	photo_version: string | null;
	written_on: string;
	grown_by: string;
}

export interface VarietyDetail extends Variety {
	germination_rate: number | null;
	harvest_notes: HarvestNote[];
}

// A list the API sends one page at a time. Only the keys this project reads are named.
export interface Paginated<T> {
	data: T[];
	meta: { last_page: number };
}

// The part of a variety the browser needs to list, filter and borrow it. Everything a
// server component passes to a client component is published in the page, so the words
// that are only ever read stay out of it.
export type VarietyBrief = Pick<
	Variety,
	"id" | "name" | "kind" | "packets_available" | "retired"
>;
