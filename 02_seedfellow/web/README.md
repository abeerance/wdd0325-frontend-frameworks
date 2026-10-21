# Seedfellow frontend

The Next.js app we build in class. React Compiler is enabled. Use npm and keep `package-lock.json` with the project.

This is the completed night-11 code. The catalogue uses local sample records in `src/data/varieties.ts`. The borrow dialog does not write to the backend yet.

The finished Laravel backend is supplied in `../backend/`. We start connecting to it on night 15. See the [project README](../README.md) for the folder structure, course sequence and backend setup link.

## Run it

From this `web/` folder, with Node.js 24 installed:

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Edit files under `src/`; the development server updates the page as you save.

## Check changes

```bash
npm run lint
npm run build
```

To serve the production build after a successful build:

```bash
npm start
```

Stop the development server before starting the production server; both use port 3000.
