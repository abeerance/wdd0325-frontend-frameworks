//// Variable type annotation

// the annotation goes after the name: "name: string" reads as "name is a string".
// without it these consts would get the literal types 'SAE' and 2026, the
// annotation widens them to the general string and number types
const name: string = 'SAE'
const year: number = 2026

//// Function parameters type annotation

// "n: number" types the parameter, the ": number" after the parentheses types the
// return value. Callers can now only pass numbers and can rely on getting one back
function double(n: number): number {
  return n * 2;
};

console.log(double(3)) // 6

// here an example with a return type of string
// the parameter is still a number, only what comes back is a string
function returnTypeAsString(number: number): string {
  return `The sum is ${number * 3}`
}

console.log(returnTypeAsString(3)); // The sum is 9

// here an example without a return type
let fullName: string = '';
const firstName: string = 'Hadrian'

// no return type written, so TS infers void: the function returns nothing and
// works by changing fullName from the outer scope (a side effect)
function lastNameToUpperCase(lastName: string) {
  fullName = `${firstName} ${lastName.toUpperCase()}`
};

lastNameToUpperCase('Chio')

console.log(fullName); // Hadrian CHIO

//// Annotating arrays

// "number[]" means an array where every element is a number.
// the arrays stay mutable, const only stops the variable being reassigned
const score: number[] = [10, 20, 30];
const names: string[] = ['Alice','Bob', 'Carol'];
const flags: boolean[] = [true, false, true];

//// Inline object annotation

// the shape is written directly at the variable. Every listed property is
// required, and the object literal may not add extra ones (excess property
// check).
// repeating a shape like this is what interfaces and type aliases replace
const user: { name: string; age: number; active: boolean } = {
  name: 'Alice',
  age: 30,
  active: true,
}
