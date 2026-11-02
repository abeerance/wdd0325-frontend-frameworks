# App routes

- Pages and layouts are the only default exports (Next.js requires it).
- Root layout owns the frame: header with `Logo`, the one `<main>`, `SiteFooter` in `<body>`
  after it. Pages never render `<main>`, header or footer.
- Colour tokens live in `globals.css`.
