# Seedfellow

Seedfellow is a neighbourhood seed library. Members will browse varieties, borrow a packet, return seed and write a harvest note with a photograph.

## Two parts

```text
02_seedfellow/
  backend/   Finished Laravel application and database setup
  web/       Next.js frontend we build during class
```

The frontend is what people see and use in their browser. The backend stores the library and its members, checks permissions and answers requests through an application programming interface (API).

`backend/` is supplied complete. Our work is in `web/`. The folder name is `backend`; its HTTP addresses still start with `/api/`.

## Where we are now

The code in `web/` is the night-15 project. The catalogue and the variety pages read from the backend API, so the backend has to be running. Variety pages also show the photograph with its credit and the harvest notes members wrote. The borrow dialog still does not borrow from the database: it only logs what was asked for. Signup, login and real borrowing follow in later evenings.

The local sample records are gone: the API is now the only source of varieties.

## What each night added

Every row names a concept, the file in `web/` where you can see it, and the page of the Next.js documentation that describes it. Paths are relative to `web/`. The table grows by one block every night.

### Night 11: the server, and a framework that owns it

| Concept | Where | Next.js documentation |
| --- | --- | --- |
| Project created by `create-next-app` | `package.json`, `next.config.ts` | [Installation](https://nextjs.org/docs/app/getting-started/installation) |
| Folder layout: `app/`, `components/`, `public/` | `src/` | [Project structure](https://nextjs.org/docs/app/getting-started/project-structure) |
| A page is a `page.tsx` | `src/app/page.tsx` | [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) |
| Root layout, `metadata` and `next/font` | `src/app/layout.tsx` | [Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [Font](https://nextjs.org/docs/app/api-reference/components/font) |
| Server Components by default, `"use client"` where the browser is needed | `src/components/catalogue.tsx`, `src/components/variety-card.tsx` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [`use client`](https://nextjs.org/docs/app/api-reference/directives/use-client) |
| `cacheComponents` and `partialPrefetching` | `next.config.ts` | [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) |
| The palette in `@theme` | `src/app/globals.css` | none, this is Tailwind |

### Night 12: a server catalogue and one shared frame

| Concept | Where | Next.js documentation |
| --- | --- | --- |
| A route is a folder | `src/app/about/page.tsx` | [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) |
| A nested layout wraps every page below it | `src/app/varieties/layout.tsx` | [Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) |
| `LayoutProps` types a layout without an import | `src/app/layout.tsx`, `src/app/varieties/layout.tsx` | [Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) |
| The catalogue split into server and client parts | `src/components/catalogue.tsx`, `src/components/catalogue-filter.tsx`, `src/components/catalogue-results.tsx` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |

### Night 13: navigation and an address per variety

| Concept | Where | Next.js documentation |
| --- | --- | --- |
| `Link` for client-side navigation | `src/components/site-nav.tsx`, `src/components/variety-card.tsx` | [Linking and navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating), [`Link`](https://nextjs.org/docs/app/api-reference/components/link) |
| `usePathname` marks the current page | `src/components/site-nav.tsx` | [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) |
| A dynamic segment, `[id]` | `src/app/varieties/[id]/page.tsx` | [Dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) |
| `params` is a promise, awaited in a child inside `Suspense` | `src/app/varieties/[id]/page.tsx` | [Dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) |
| `generateStaticParams` lists the known ids | `src/app/varieties/[id]/page.tsx` | [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) |
| `notFound()` and `not-found.tsx` | `src/app/varieties/[id]/page.tsx`, `src/app/varieties/[id]/not-found.tsx`, `src/app/not-found.tsx` | [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found), [`not-found.js`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) |

### Night 14: a data layer, shared types and filtering

From this night on, the last column links React, TypeScript, MDN or Base UI pages where Next.js has no page for the concept.

| Concept | Where | Documentation |
| --- | --- | --- |
| Shared types in one file, importable by server and client | `src/lib/types.ts` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| A data layer: pages ask `getVarieties` and `getVariety`, never the data itself | `src/lib/varieties.ts` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| `server-only` keeps the data layer out of the browser bundle | `src/lib/varieties.ts` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| An `async` Server Component waits for its data | `src/components/catalogue.tsx` | [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) |
| Cards rendered on the server and passed to a client component as a `ReactNode` | `src/components/catalogue.tsx`, `src/components/catalogue-filter.tsx` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| `Pick` builds the smallest type a component needs | `src/lib/types.ts` | [TypeScript: utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) |
| A generic hook, `useVarietyFilter<T>`: what goes in comes back out | `src/hooks/use-variety-filter.ts` | [TypeScript: generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) |
| Derived values are calculated in render, not stored in state | `src/hooks/use-variety-filter.ts` | [React: You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) |
| Lifting state up: the owner holds the filters, the bar reports changes | `src/components/catalogue-filter.tsx`, `src/components/variety-filter.tsx` | [React: Sharing state between components](https://react.dev/learn/sharing-state-between-components) |
| Controlled inputs, and a Base UI `Switch` | `src/components/variety-filter.tsx` | [React: `useState`](https://react.dev/reference/react/useState), [Base UI: Switch](https://base-ui.com/react/components/switch) |
| Related and neighbouring varieties from a sorted copy of the list | `src/components/more-like-this.tsx`, `src/components/variety-nav.tsx` | [MDN: `toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted), [MDN: `localeCompare`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) |
| Server Components inside a page, each fetching its own data | `src/app/varieties/[id]/page.tsx` | [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) |

### Night 15: the frontend reads from the API

| Concept | Where | Documentation |
| --- | --- | --- |
| Fetching data in a Server Component with `fetch` | `src/lib/varieties.ts`, `src/components/catalogue.tsx`, `src/components/harvest-notes.tsx` | [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data), [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) |
| `cache: "no-store"`: every read goes to the API at request time | `src/lib/varieties.ts` | [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch), [Caching](https://nextjs.org/docs/app/getting-started/caching) |
| An environment variable for the API address, read on the server only | `src/lib/varieties.ts` | [Environment variables](https://nextjs.org/docs/app/guides/environment-variables) |
| A failed response throws; a 404 becomes `null` and then `notFound()` | `src/lib/varieties.ts`, `src/app/varieties/[id]/page.tsx` | [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found) |
| Pagination: one page of 50, and an error if the API reports more | `src/lib/varieties.ts`, `src/lib/types.ts` | none, this is the [backend API](backend/README.md#what-it-publishes) |
| Waiting data inside `Suspense`, so the frame streams first | `src/app/page.tsx`, `src/app/varieties/[id]/page.tsx` | [Streaming](https://nextjs.org/docs/app/guides/streaming) |
| `usePathname` suspends on a route whose param is unknown until the request, so it sits in `Suspense` | `src/components/site-nav.tsx` | [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) |
| `generateStaticParams` removed: variety pages are built per request | `src/app/varieties/[id]/page.tsx` | [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) |
| Only the fields a client component needs cross to it (`brief`, `VarietyBrief`) | `src/lib/varieties.ts`, `src/lib/types.ts`, `src/components/borrow-dialog.tsx` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Data security](https://nextjs.org/docs/app/guides/data-security) |
| API response shapes as TypeScript types | `src/lib/types.ts` | [backend: what an answer carries](backend/README.md#what-an-answer-carries) |
| A photograph with a reserved 4:3 slot, `loading` and `fetchPriority`, and its licence credit | `src/components/variety-photo.tsx`, `src/components/photo-credit.tsx` | [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img), [Next.js `Image`](https://nextjs.org/docs/app/api-reference/components/image) for the alternative |
| Versioned photo address (`?v=photo_version`) so the browser can cache it | `src/lib/varieties.ts` | [backend: photographs and caching](backend/README.md#photographs-and-caching) |
| Formatting months, lists, percentages and dates with `Intl` | `src/lib/months.ts`, `src/components/harvest-notes.tsx` | [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), [`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat) |
| Harvest notes and germination rate on the variety page | `src/components/harvest-notes.tsx` | [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) |
| Trying the API by hand with Bruno: `List varieties`, `Show one variety`, `Show a variety that is not there`, `Show a variety photo at its version` | `backend/bruno/` | none, see [backend README](backend/README.md#checking-it) |

## Keeping this table current

At the end of every night, add a block for that night, in the same three columns. Take the concepts from the lessons that night taught, find where each one lives in `web/`, and link the page of the Next.js documentation that describes it. Check that every path in the new rows exists.

## Run the current frontend

Use Node.js 24 and npm. Start the [backend](#backend) first: the pages need it. Then, from the repository root:

```bash
cd 02_seedfellow/web
npm ci
npm run dev
```

Before `npm run dev`, make sure `web/.env.local` holds the line `API_URL=http://localhost:8080`. Create the file if it is missing; if it exists, add the line and keep the rest. The file holds your local configuration and stays out of Git. `API_URL` tells the frontend where the API answers; the browser loads photographs from the same address.

Open <http://localhost:3000>. Leave that terminal running while you work. Ctrl+C stops the development server.

Check your changes from `web/`:

```bash
npm run lint
npm run build
```

## Backend

Since night 15 the frontend needs the API running. Start the API with `./serve.sh` in `backend/`. It needs no Docker and no database server: PHP 8.3 or newer with SQLite and Composer, and the data lives in one SQLite file. Docker is still there as an alternative. The supplied database seed creates the example library and demonstration members. The backend listens on <http://localhost:8080>; the frontend stays on <http://localhost:3000>.

Follow [backend setup](backend/README.md#running-it). Its first setup installs the PHP packages recorded in `composer.lock`, creates an application key and seeds an empty database. Later starts reuse the database. Keep your local configuration out of Git.

The backend README also documents the API routes, response shapes and demonstration accounts. You do not need to implement those routes.
