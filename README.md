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

## Deploy

```bash
npm run deploy   # builds and publishes dist/ to GitHub Pages
```

GitHub Pages serves the site at **https://orbsuite.com** (`public/CNAME`, plus
DNS records and the custom-domain setting in the repo's Pages settings). There
is no server anywhere: both forms (the demo modal and the support page) submit
to Web3Forms, which emails submissions to the team inbox. The endpoint, public
access key, and contact address live in `src/data/siteContent.ts` — the access
key must be registered in the Web3Forms dashboard to orbsuite.com and to an
inbox the team controls.

## Structure

- `src/pages/Landing.tsx` — homepage (bento grid, hero)
- `src/pages/details/*` — per-module showcase pages, one for every module in
  `ALL_MODULES` (14 today: Sage, Vigil, Scribe, Lens, Relay, Helix, Surgical
  Suite, Pulse, Forecast, Bridge, Slate, Revenue Integrity, Command Center,
  Surge Simulator)
- `src/pages/Plans.tsx` / `src/pages/Support.tsx` — plan comparison; support
  page with FAQ and a contact form
- `src/components/` — `MarketingHeader`, `Aurora` (background),
  `RequestDemoModal`, `OrbLogo`, the search overlay, and the landing sections
- `src/data/siteContent.ts` — single source of truth for modules, plans,
  contact email, and form delivery config
- `src/index.css` / `src/App.css` — shared visual design tokens (copied from the app
  so the two look consistent; they are otherwise independent)

## Notes

- Runs on **port 5174** so it can run alongside the clinical app's dev server (5173).
- `Aurora`, `OrbLogo`, and the CSS tokens are **copies** shared with the app by
  convention — there is no code dependency between the two projects.
