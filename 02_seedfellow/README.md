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

The code in `web/` is the completed night-11 project. Its catalogue reads the sample records in `web/src/data/varieties.ts`. Its borrow dialog shows a local confirmation; it does not borrow from the database.

The backend is already here so you can see the whole project. You do not need to run it for the current frontend. Night 12 refactors the catalogue. On night 15, we connect the catalogue and variety pages to the backend. Signup, login and real borrowing follow in later evenings.

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
