//// void

interface Area {
  x: number;
  y: number;
}

function calculateArea({ x, y }: Area): void {
  // a void is a function, that simply computes the
  // javascript inside the function itself
  // it has an absent return, because we do not expect
  // anything in return, we just want something to be computed
  console.log(x * y);
};


// the same input, but with a return type: instead of printing, it hands the
// result back so the caller decides what to do with it
function calculateAreaWithReturn({ x, y }: Area): number {
  const calculatedArea = x * y;
  return calculatedArea;
};


//// how do we work with interfaces and functions

// here is an example (not best practice), on how to type annotate
// a function inline
function calculateVolume({ x, y, z }: { x: number, y: number, z: number }): void {
  console.log(`The volume is: ${x *y *z}m3`)
};

// how to use an interface to describe the properties of a function
interface Aread {
  x: number,
  y: number,
  z?: number,
}

// z is optional in Aread, so a function that does not need it can just ignore it.
// no return type written, TS infers void
function calculateAreaD({ x, y }: Aread) {
  console.log(`The area is: ${x * y}m2`)
};

function calculateVolumeD({ x, y, z }: Aread) {
  // z has the type "number | undefined" because it is optional, so it cannot be
  // multiplied directly. The early return narrows it to number for the rest of
  // the function
  if (z === undefined) return;
  console.log(`The volume is: ${x * y * z}m3`);
};

// this function call will call the early return, because we are missing
// the z value
calculateVolumeD({ x: 5, y: 7 })

// this function call with work until the console.log, because
// here we are not missing the z value
calculateVolumeD({x: 5, y: 7, z: 4})
