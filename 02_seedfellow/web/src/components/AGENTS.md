# Components

- One component per file: kebab-case file, PascalCase component, named export.
- Server component by default. `"use client"` only if the file holds state, runs an effect
  or takes an event handler.
- No component return type. Type only what the compiler cannot infer: props interface,
  `children: ReactNode`, handler parameters.
- Props interface named after the component (`VarietyCardProps`). Optional props take `?`
  and a default parameter.
- Paragraph text through `Text` (`ui/text.tsx`), panels through `Card`. Never a `<div>` for
  text. Headings stay real `<h1>`-`<h6>`.
- Merge classes with `cn` (`@/lib/cn`), never string joins: own classes first, `{...rest}`
  next, caller's `className` last.
- Derive from state or props during render. Never store it in state or sync it with an effect.
- Interactive widgets (switch, dialog, field) come from Base UI, imported per component from
  `@base-ui/react/<name>`, styled by state attributes (`data-checked:`, `data-invalid:`).
- List keys are stable ids, never the index.

## Design

- Colours from `src/app/globals.css` tokens (`bg-paper`, `text-ink`, `bg-moss`, ...). Never
  a raw hex or a default Tailwind colour like `slate`.
- Layouts work from 360px up: phone first, then `sm:`, `lg:`.
- Every image or picture slot has a fixed aspect ratio before content loads (`aspect-4/3`).
- Interactive elements: at least 44px tall (`min-h-11`), visible `focus-visible` outline in `moss`.
- `leaf` is decoration only; it fails the 3:1 contrast a control needs.
