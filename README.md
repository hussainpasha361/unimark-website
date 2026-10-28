# UniMark Pharmaceuticals — website

Marketing site for UniMark Pharmaceuticals: our cardiovascular brands and toll manufacturing.
Static multi-page site built with Vite, vanilla JS, GSAP and Lenis.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Products | `products.html` |
| Toll manufacturing | `toll-manufacturing.html` |

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serve the production build
```

## Deploy

Vercel builds this repo automatically (`vercel.json`: framework Vite, output `dist/`).
Every push to `main` deploys to production; other branches get preview URLs.

## Where things live

- `partials/` — shared head, header and footer, inlined into each page at build time (`vite.config.js`).
- `src/styles.css` — design tokens (colours, type, spacing) at the top, then sections.
- `src/products-data.js` — the 15 products: names, strengths, packs, indications, accent colours.
- `src/toll-anim.js` — the scroll-driven "molecule to medicine" animation.
- `public/media/` — web-optimised images; `assets-source/` holds the full-size originals.

## Before launch

- Connect the quote form (`toll-manufacturing.html`) to an email or CRM endpoint; it currently only shows a confirmation.
- Add the real social profile links in `partials/footer.html`.
- Remove the "Design preview" label in `partials/header.html` and its style at the end of `src/styles.css`.
