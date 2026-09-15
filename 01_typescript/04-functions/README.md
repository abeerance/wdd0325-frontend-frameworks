# 04 - Functions

Typing function parameters and return values, `void` versus a real return, and
working with optional properties inside a function.

## Files

- `index.ts` - the examples
- `tsconfig.json` - `strict`, no `rootDir`/`outDir`, so output lands next to the source

## Run

```
npx tsc
node index.js
```

Expected output:

```
The volume is: 140m3
```

Only one line: `calculateVolumeD({ x: 5, y: 7 })` is missing `z` and hits the early
return, and the other functions are defined but never called.

`npx tsc --noEmit` typechecks without writing any files.

## Concepts

| Concept | Where |
| --- | --- |
| `void` - the function computes, it returns nothing | `calculateArea` |
| returning a value instead of printing it | `calculateAreaWithReturn` |
| destructuring a parameter object | every function here |
| inline parameter shape (works, but does not scale) | `calculateVolume` |
| an interface as the parameter type | `Aread` |
| optional property, and narrowing `number \| undefined` | `calculateVolumeD` |
