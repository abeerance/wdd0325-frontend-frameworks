//// Nested example for interfaces

// interface for an address
interface Address {
  street: string;
  city: string;
  country: string;
  plz: number;
}

// interface for an company
interface Company {
  name: string;
  email: string;
  // phone numbers are strings, not numbers: they keep leading zeros and spacing,
  // and are never used in arithmetic
  phone: string;
  // an interface can be the type of a property, which is how objects nest
  address: Address
}

// interface for an user
interface User {
  name: string;
  email: string;
  address: Address
  company: Company
}

// a type and a value may share a name: TS keeps type and value namespaces apart
const User: User = {
	name: "John Doe",
	email: "john.doe@example.ch",
	address: {
    street: "Musterstrasse 1",
		city: 'Münchausen',
		country: "Germany",
		plz: 4200,
	},
  company: {
    name: 'Example company',
    email: 'example@example.ch',
    phone: '012 234 22 24',
    address: {
      street: 'Bahnhofstrasse 1',
      city: 'Zürich',
      country: 'Switzerland',
      plz: 9999,
    },
  },
};

//// Optional properties

interface LinkedInProfile {
  username: string;
  email: string;
  password: string;
  bio?: string; // the "?" marks this property as optional
  website?: string; // the "?" marks this property as optional
}

const user: LinkedInProfile = {
  username: 'johndoe',
  email: 'john.doe@example.ch',
  password: 'test!12345678',
  bio: 'This is an optional bio' // all optional properties will not
  // throw an error if they are missing in the object itself
};

//// ReadOnly properties

interface ReadOnlyUser {
  readonly id: number;
  name: string;
  email: string;
}

const userReadOnly: ReadOnlyUser = {
  id: 1,
  name: 'Jane',
  email: 'jane.doe@example.ch',
}

// name is not readonly, so reassigning it is fine
userReadOnly.name = 'Bob';
// userReadOnly.id = 56; // this will throw an error because this is a
// read only property
// readonly is checked by the compiler only, at runtime the object is a normal
// mutable object

//// Type keyword
// a type alias renames an existing type, it does not create a new one
// Canine and string stay fully interchangeable
type Canine = string;

function getCanine(canine: Canine): void {
  console.log(canine)
}

// union
// this means, that the type Id can either be of type
// string or number
type Id = number | string;

function lookup(id: Id): void {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else if (typeof id === 'number') {
    console.log(id.toFixed(2));
  }
}

// the union can be used, if a value might be absent
type SearchResult = string | null;

function search(query: string): SearchResult {
  // this is a check, if the input has been populated or not
  // since every string has a lenght, and if an input has no value
  // the length of the value inside the query is 0

  // here, this works, because as long as the input is 0, we do not return
  // any search results
  if (query.length === 0) return null;

  // if the input is populated, here we return the results of the query
  // instead of null
  return `Results for ${query}`
}

// we can also combine different interfaces into a type
interface Cat {
  kind: string;
  name: string;
}

interface Fish {
  kind: string;
  name: string;
  coloring: string;
}

type Animal = Cat | Fish

// matches Cat: a union member only needs the props IT declares
const animal: Animal = {
  kind: 'Egyptian cat',
  name: 'Destroyer of worlds'
}

// matches Fish: 'coloring' is allowed because Fish declares it
const animal2: Animal = {
  kind: 'Shark',
  name: 'Jaws',
  coloring: 'Grey'
}

//// Stuff only an interface can do

// an interface can be declared more than once

interface Dish {
  name: string;
}

interface Dish {
  countryOfOrigin: string;
}

const dish: Dish = {
  name: 'Sinigang',
  countryOfOrigin: 'Philippines',
}

// type Mobile = { carrier: string }
// type Mobile = { ime: number}
// This will throw an error, because a type can not have a duplicate
// with the same name

//// When to use what

// we use interface to describe an object shape, type for unions and aliases
interface ButtonBase {
  label: string;
  href?: string;
}

// a union of string literals restricts the value to a fixed set of options
type ButtonVariants = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

// an interface can extend another and inherits its props (label, optional href)
interface Button extends ButtonBase {
  variant: ButtonVariants,
  size: ButtonSize,
}

const primaryButton: Button = {
  label: "label",
  href: 'urls',
  variant: 'primary',
  size: 'md'
}

//// Combining shapes

// interface extend (only exists in an interface)
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Blog extends BaseEntity {
  // id: string; // these 3 entries are being copied to the Blog interface
  // that means it's reusable and we do not need to set it
  // createdAt: string;
  // updatedAt: string;
  title: string;
  content: string;
  imageHref: string;
}

interface Todo extends BaseEntity {
  // here the id, createdAt and updatedAt from BaseEntity are also inherited
  // and do not need to be redeclared
  title: string;
  description: string;
  done: boolean;
}

// we can als extend something by multiple stuff
// here the goal inherits all properties from baseentity blog and todo
// title and description are redeclared, which is only allowed because the types
// match the inherited ones. A conflicting type here would be an error
interface Goal extends BaseEntity, Blog, Todo {
  title: string;
  description: string;
}

const goal: Goal = {
  id: "asdasd12123-123123-123123",
  createdAt: "10 September",
  updatedAt: "11 September",
  title: "GoalTitle",
  description: "Description",
  done: false,
  content: "content",
  imageHref: "imageUrl",
}

// Intersection type
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

// "&" is an intersection: the value must satisfy both interfaces at once, so it
// needs name AND age. This is the type-alias equivalent of extending
type Person = Named & Aged;

const alice: Person = { name: 'Alice', age: 30 };

//// when to use what

// use extend when you build object shapes on top other object shapes
interface Persond {
  firstName: string;
  lastName: string;
}

interface Addressed {
  street: string;
  streetNumber: number;
}

interface Employee extends Persond, Addressed {
  id: number;
  role: string;
}

const employee: Employee = {
  id: 3,
  role: "engineer",
  firstName: "john",
  lastName: "doe",
  street: "examplestreet",
  streetNumber: 1
}

type Loaded = "loading" | "loaded";

// a warning example: intersecting an object shape with string literals compiles,
// but no value can ever satisfy it. Nothing is both an Employee object and the
// string "loading", so Loadedx is unusable (TS keeps it as
// Employee & "loading" | Employee & "loaded", it does not collapse it to never).
// a state like this belongs in a property, e.g. Employee & { status: Loaded }
type Loadedx = Employee & Loaded

// how it should be done: put the state in a property, then the intersection
// adds a field to the object shape instead of contradicting it.
// the value needs everything Employee inherits from Persond and Addressed,
// plus the new status
type EmployeeWithState = Employee & { status: Loaded };

const loadingEmployee: EmployeeWithState = {
  id: 4,
  role: "engineer",
  firstName: "jane",
  lastName: "doe",
  street: "examplestreet",
  streetNumber: 2,
  status: "loading",
};
