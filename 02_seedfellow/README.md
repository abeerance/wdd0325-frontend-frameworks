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

The code in `web/` is the night-13 project plus the visit page, which is your task for that night. Its catalogue reads the sample records in `web/src/data/varieties.ts`. Its borrow dialog shows a local confirmation; it does not borrow from the database.

The backend is already here so you can see the whole project. You do not need to run it for the current frontend. On night 15, we connect the catalogue and variety pages to the backend. Signup, login and real borrowing follow in later evenings.

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

## Keeping this table current

At the end of every night, add a block for that night, in the same three columns. Take the concepts from the lessons that night taught, find where each one lives in `web/`, and link the page of the Next.js documentation that describes it. Check that every path in the new rows exists.

## Run the current frontend

Use Node.js 24 and npm. From the repository root:

```bash
cd 02_seedfellow/web
npm ci
npm run dev
```

Open <http://localhost:3000>. Leave that terminal running while you work. Ctrl+C stops the development server.

Check your changes from `web/`:

```bash
npm run lint
npm run build
```

## Backend, when we connect it

Docker runs Laravel, nginx and PostgreSQL. The supplied database seed creates the example library and demonstration members. The backend listens on <http://localhost:8080>; the frontend stays on <http://localhost:3000>.

Follow [backend setup](backend/README.md#running-it) when instructed. Its first setup installs the PHP packages recorded in `composer.lock`, creates an application key and seeds an empty database. Later starts reuse the database. Keep your local configuration out of Git.

The backend README also documents the API routes, response shapes and demonstration accounts. You do not need to implement those routes.
