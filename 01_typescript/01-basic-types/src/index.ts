// getElementById returns HTMLElement | null, because TS cannot know the element
// exists in the HTML. "as HTMLElement" is an assertion: we promise it is there.
// It is a promise, not a check - if #output is missing, this fails at runtime.
const out = document.getElementById('output') as HTMLElement;

// prints to the page instead of the console, so the browser shows the results.
// "...args: unknown[]" takes any number of arguments of any type, and unknown
// forces us to narrow each value before we use it.
// ": void" means the function returns nothing, it only has an effect.
function log(...args: unknown[]): void {
const p = document.createElement('p');
// each value is turned into text: null and undefined are spelled out, objects
// are serialised as JSON, everything else goes through String().
// the null and undefined branches are written out for clarity, String() would
// produce the same two words on its own
p.textContent = args.map(v =>
  v === null ? 'null' :
  v === undefined ? 'undefined' :
  // typeof null is 'object' too, so this branch must stay below the null check
  // to keep meaning what it says
  typeof v === 'object' ? JSON.stringify(v) : String(v)
).join(' ');
out.appendChild(p);
}

// 1. Declare a string variable for a city name and log it.
// Expected: Tokyo
// without the annotation TS would infer the literal type "Tokyo", not string.
// writing ": string" widens it, so the variable stands for any string
const city: string = "Tokyo";
log(city);


// 2. Declare a number variable for a population count and log it.
// Expected: 13960000
// number covers integers and floats alike, TS has no separate int type.
// as above, the annotation widens the inferred literal 13960000 to number.
// the underscores are numeric separators, they are ignored by the compiler
const population: number = 13_960_000 // 13'960'000
log(population);


// 3. Declare a boolean variable that is true when the population is above 10 million and log it.
// Expected: true
// a comparison always produces boolean, so here the annotation really is
// only documentation
const isMegaCity: boolean = population > 10_000_000;
log(isMegaCity)

// 4. Declare a variable explicitly typed as null and log it.
// Expected: null
// the null type has exactly one possible value: null. Nothing else can be
// assigned to it, which makes it useless on its own but handy in a union
const noData: null = null;
log(noData)


// 5. Declare a variable typed as unknown and assign it a string value.
//    Use typeof to check it is a string, then log its uppercase version.
// Expected: TOKYO
const mystery: unknown = city; // Tokyo - because of the unknown we do not know the type of the city

if (typeof mystery === 'string') { // here we check if the variable is of a type string to ensure that the
  // typesafety is set, and because of that we can use the method toUpperCase(), which can only be used
  // when it is of type string
  // this is called narrowing: inside the if, TS treats mystery as a string
  log(mystery.toUpperCase())
}

// advanced example of userInput
// this block only demonstrates the syntax: userInput is never assigned, so it
// stays undefined and the else branch is the one that actually runs
let userInput: unknown;

if (typeof userInput === 'string') {
  log(userInput.toUpperCase());
} else if (typeof userInput === 'number') {
  log(userInput.toExponential(2));
} else {
  // the fallback that catches everything the checks above did not narrow
  log('This is not a viable input')
}
