// Night 1. Values have types.
//
// Run `npm run watch` in one terminal and `npm start` in another.

// --- basic types -----------------------------------------------------------
// Three primitives, written without saying what they are. TypeScript already knows.

const name = "Berner Rose";
const packets = 4;
const retired = false;

// --- annotations -----------------------------------------------------------
// A parameter has no value to look at, so it has to be told. A return type is
// optional here, and stated anyway: it is a promise the function has to keep.

function label(variety: string, count: number): string {
  return `${variety}: ${count} packets`;
}

// --- inference -------------------------------------------------------------
// `summary` is a string because `label` returns one. Annotating it again would
// add nothing and would have to be corrected every time `label` changes.

const summary = label(name, packets);

console.log(summary);
console.log(retired ? "retired" : "on the shelf");
