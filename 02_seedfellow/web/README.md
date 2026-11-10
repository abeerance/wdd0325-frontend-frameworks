# Seedfellow frontend

The Next.js app we build in class. React Compiler is enabled. Use npm and keep `package-lock.json` with the project.

This is the night-15 code. The catalogue and variety pages read from the backend API. The borrow dialog does not write to the backend yet.

The finished Laravel backend is supplied in `../backend/` and has to be running. See the [project README](../README.md) for the folder structure, the course sequence with documentation links, and the backend setup link.

## Run it

Start the backend first (`./serve.sh` in `../backend/`). Then, from this `web/` folder, with Node.js 24 installed:

```bash
npm ci
npm run dev
```

Before `npm run dev`, make sure `.env.local` in this folder holds the line `API_URL=http://localhost:8080`. Create the file if it is missing; if it exists, add the line and keep the rest. The file stays out of Git. The server reads `API_URL` for every request, and the browser loads photographs from that address.

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
