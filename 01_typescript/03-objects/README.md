# 03 - Objects, interfaces and types

Describing object shapes with `interface`, and building new types with `type`,
unions, intersections and `extends`.

## Files

- `index.ts` - the examples
- `tsconfig.json` - `strict`, no `rootDir`/`outDir`, so output lands next to the source

## Run

```
npx tsc
node index.js
```

This prints nothing. The file is only declarations and object literals - the
functions (`getCanine`, `lookup`, `search`) are defined but never called, so the
compiler is what checks the work here:

```
npx tsc --noEmit
```

## Concepts

| Concept | Where |
| --- | --- |
| nested interfaces | `Address`, `Company`, `User` |
| type and value namespaces are separate | `const User: User` |
| optional properties (`?`) | `LinkedInProfile` |
| `readonly`, checked at compile time only | `ReadOnlyUser` |
| type alias | `Canine` |
| unions, and narrowing them with `typeof` | `Id`, `SearchResult`, `Animal` |
| declaration merging (interface only) | `Dish`, declared twice |
| string literal unions | `ButtonVariants`, `ButtonSize` |
| `extends`, including from several interfaces | `Button`, `Goal`, `Employee` |
| intersection (`&`) | `Person` |

## The `Loadedx` warning example

At the bottom of the file, `Employee & Loaded` intersects an object shape with a
union of string literals. It compiles, but no value can ever satisfy it: nothing
is both an `Employee` object and the string `"loading"`. TypeScript keeps it as
`Employee & "loading" | Employee & "loaded"` rather than collapsing it to `never`,
so the error only shows up at the assignment, not at the type declaration.

`EmployeeWithState` directly below it shows the correct form - the state goes in a
property, so the intersection adds a field instead of contradicting the shape.
