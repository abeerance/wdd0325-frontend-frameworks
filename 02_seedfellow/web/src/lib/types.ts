// Types only. They are erased at build time, so a server file and a client file can both import
// them. The data and its functions are server-only; this file is deliberately not.
// This kind type will be needed for the filter bar for example
export type Kind = "vegetable" | "herb" | "flower" | "grain";

// Who took a photograph and on what licence. The API sends null for no credit on record.
export interface PhotoCredit {
  author: string;
  licence: string;
  source_url: string;
  modified: boolean;
}

// The shape every variety has, as the API sends it (see "What an answer carries" in
// backend/README.md). Exported so the card can type its prop with it.
export interface Variety {
  // Unique and stable, which is what makes it the right React key.
  id: number;
  name: string;
  species: string;
  kind: Kind;
  story: string;
  // Month numbers, 1 for January.
  sowing_months: number[];
  packets_available: number;
  // True once a librarian has retired the variety: it stays listed but cannot be borrowed.
  retired: boolean;
  has_photo: boolean;
  // Changes whenever the photograph does; null when there is no photograph.
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
  // A calendar date as text, for example "2026-10-03", not a moment in time.
  written_on: string;
  grown_by: string;
}

// What the one-variety address adds to the list's shape.
export interface VarietyDetail extends Variety {
  // A fraction from 0 to 1, or null while no member has written a note.
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
