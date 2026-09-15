# 01 - Basic types

First exercise set: the primitive types (`string`, `number`, `boolean`, `null`) and
`unknown` with `typeof` narrowing.

## Files

- `src/index.ts` - the exercises, each with its task and expected output as a comment
- `index.html` - the page the exercises print into
- `styles.css` - minimal styling for that page
- `tsconfig.json` - `strict`, `rootDir: ./src`, `outDir: ./dist`

## Run

```
npx tsc
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Expected on the page:

```
Tokyo
13960000
true
null
TOKYO
This is not a viable input
```

A server is needed because `<script type="module">` is blocked over `file://`.

`npx tsc --noEmit` typechecks without writing any files.

## How the page is wired

- `package.json` sets `"type": "module"`, so `tsc` emits ES modules into `dist/`
  instead of CommonJS, which is what a browser `<script type="module">` can load
- `index.html` has a `<main id="output">`, which `log()` appends one `<p>` to per call
- the script tag points at `./dist/index.js`, the compiled output, not the `.ts` source

## Concepts

| Concept | Where |
| --- | --- |
| type annotation vs inferred literal type | items 1-2 |
| `boolean` from a comparison | item 3 |
| the `null` type | item 4 |
| `unknown` and narrowing with `typeof` | item 5 |
| type assertion (`as`) and why it is a promise, not a check | top of the file |
