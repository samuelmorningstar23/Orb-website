# Orb — Website

The **marketing / showcase site** for Orb. This is a standalone, static front-end
with **no backend, no API, and no connection to the clinical Orb app**. It exists
purely to present the product (landing page + per-module showcase pages).

> The actual clinical application ("Orb Hospital OS") is a **separate project**
> and is intentionally not linked to this site.

## Run

```bash
npm install
npm run dev      # http://localhost:5174
```

Build static output:

```bash
npm run build    # -> dist/
npm run preview
```

## Structure

- `src/pages/Landing.tsx` — homepage (bento grid, hero)
- `src/pages/details/*` — per-module showcase pages (`/vigil`, `/sage`, `/scribe`,
  `/lens`, `/relay`, `/helix`, `/surgical-suite`)
- `src/components/` — `MarketingHeader`, `Aurora` (background), `RequestDemoModal`,
  `OrbLogo`
- `src/index.css` / `src/App.css` — shared visual design tokens (copied from the app
  so the two look consistent; they are otherwise independent)

## Notes

- Runs on **port 5174** so it can run alongside the clinical app's dev server (5173).
- `Aurora`, `OrbLogo`, and the CSS tokens are **copies** shared with the app by
  convention — there is no code dependency between the two projects.
