# 02 - Type annotations

Where annotations go: variables, function parameters, return types, arrays and
inline object shapes.

## Files

- `index.ts` - the examples, with the expected console output as trailing comments
- `tsconfig.json` - `strict`, no `rootDir`/`outDir`, so output lands next to the source

## Run

```
npx tsc
node index.js
```

Expected output:

```
6
The sum is 9
Hadrian CHIO
```

`npx tsc --noEmit` typechecks without writing any files.

## Concepts

| Concept | Where |
| --- | --- |
| variable annotation, and how it widens a literal type | `name`, `year` |
| parameter and return type | `double`, `returnTypeAsString` |
| inferred `void` and side effects | `lastNameToUpperCase` |
| array types (`number[]`, `string[]`, `boolean[]`) | `score`, `names`, `flags` |
| inline object annotation and excess property checks | `user` |
