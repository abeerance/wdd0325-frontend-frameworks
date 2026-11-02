# Seedfellow web

Seed library front end: members browse, filter and borrow heritage varieties. Data is
local in `src/data/varieties.ts`. Next.js App Router (React Compiler), TypeScript,
Tailwind v4, Base UI, npm. API reads are request-time; caching is out of scope.

Folder rules live in `AGENTS.md` under `src/app/`, `src/components/`, `src/hooks/`.

- After every change run `npm run build` and `npm run lint` and show the output. Not done
  until both pass.
- Imports use `@/`, never `../`.
- No new dependency without asking. Confirm a package exists on npm before installing it.
- Never touch `../backend/`; it is a separate project with its own rules.
- No `any`, no `@ts-ignore`. A type that does not fit means the code is wrong.
- Never edit a check, type or test to make it pass. Fix the code, or stop and say why.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
