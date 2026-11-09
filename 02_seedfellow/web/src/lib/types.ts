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
