// Night 2. Shapes.
//
// Run `npm run watch` in one terminal and `npm start` in another.

// --- a literal union -------------------------------------------------------
// Not any string. One of four, and the compiler holds you to it.

type Kind = "vegetable" | "herb" | "flower" | "grain";

// --- an interface ----------------------------------------------------------
// The shape written once, so every variety in the program agrees on it.
// `photo` is optional: some have one, some do not, and the `?` says so.

interface Variety {
  name: string;
  species: string;
  kind: Kind;
  packets: number;
  photo?: string;
}

const bernerRose: Variety = {
  name: "Berner Rose",
  species: "Solanum lycopersicum",
  kind: "vegetable",
  packets: 4,
};

const genovese: Variety = {
  name: "Genovese",
  species: "Ocimum basilicum",
  kind: "herb",
  packets: 5,
  photo: "genovese.jpg",
};

// The parameter says Variety, so the function can rely on every field being there.
function describe(variety: Variety): string {
  return `${variety.name} (${variety.kind}): ${variety.packets} packets`;
}

console.log(describe(bernerRose));
console.log(describe(genovese));

// Try it: change a kind to "vegetabel" and read the error before fixing it.
