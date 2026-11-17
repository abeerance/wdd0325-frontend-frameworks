# Seedfellow web

Seed library front end: members browse, filter and borrow heritage varieties. Public data comes from the Seedfellow API at `API_URL`, through `src/lib/api/varieties.ts` and nothing else.
The browser never calls the API: every request to it runs on the server. A member's token lives in an httpOnly cookie that only `src/lib/api/session.ts` reads and the auth actions in `src/lib/actions/auth.ts` set and clear.
A member's own data is read on the server through `src/lib/api/member.ts`, which sends the token with `apiAsMember` from `src/lib/api/session.ts`.
Next.js App Router (React Compiler), TypeScript, Tailwind v4, Base UI, npm. Zod for every schema, in `src/lib/schemas.ts`. React Hook Form for every form whose fields go to a server action. API reads are request-time; caching is out of scope.

Folder rules live in `AGENTS.md` under `src/app/`, `src/components/`, `src/hooks/`.

- After every change run `npm run build` and `npm run lint` and show the output. Not done
  until both pass.
- Imports use `@/`, never `../`.
- No new dependency without asking. Confirm a package exists on npm before installing it.
- Never touch `../backend/`; it is a separate project with its own rules.
- No `any`, no `@ts-ignore`. A type that does not fit means the code is wrong.
- Never edit a check, type or test to make it pass. Fix the code, or stop and say why.
- An action takes `values: unknown` and parses it with a schema from `src/lib/schemas.ts`
  before anything else. Identity comes from the session, never from the values.
- A form uses `useForm` with `zodResolver` and the same schema the action parses. Inputs
  are Base UI `Field` parts: `register` for text and numbers.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
