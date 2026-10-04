# Orb website

The marketing site for Orb (orbsuite.com): a static front end with no backend of its own. Each module page shows an animated drawing of one workflow (`src/data/widgetFlows.ts`) and, where captured, real screens of the product running on seeded demo patients.

> The actual clinical application ("Orb") is a **separate project** and is
> intentionally not linked to this site.

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
to Web3Forms, which emails submissions to the founder's inbox. The endpoint,
public access key, and contact address live in `src/data/siteContent.ts` : the
access key must be registered in the Web3Forms dashboard to orbsuite.com and to
an inbox the founder controls.

## Structure

- `src/pages/Landing.tsx` : homepage (the hero story, how it works, what you
  can check)
- `src/pages/Modules.tsx` : the module wall, one card per module
- `src/pages/details/ModulePage.tsx` : one layout for every module route, over
  the data in `src/data/modulePages.ts` (14 today: Vigil, Sage, Scribe, Lens,
  Relay, Helix, Surgical Suite, Pulse, Forecast, Command Center, Surge
  Simulator, Bridge, Appointments, Revenue Integrity)
- `src/pages/Plans.tsx` / `src/pages/Support.tsx` : the founding hospital
  programme, with no price published (copy in `src/data/plans.ts`); support
  page with FAQ and a contact form
- `src/components/` : `MarketingHeader`, `Aurora` (background),
  `RequestDemoModal`, `OrbLogo`, the search overlay, and the landing sections
- `src/data/siteContent.ts` : single source of truth for modules,
  contact email, and form delivery config
- `src/index.css` / `src/App.css` : shared visual design tokens (copied from the app
  so the two look consistent; they are otherwise independent)

## Notes

- Runs on **port 5174** so it can run alongside the clinical app's dev server (5173).
- `Aurora`, `OrbLogo`, and the CSS tokens are **copies** shared with the app by
  convention : there is no code dependency between the two projects.

## The workflow widgets

Every module page and the homepage show one workflow as a small animated screen (`src/components/widget/Widget.tsx`). These are drawings of the product, not the product: a step is a state of a miniature Orb screen and the player animates between consecutive states, so a NEWS2 score that rises or an interlock that fires is a movement rather than a screenshot to read.

- `src/data/widgetFlows.ts` holds every flow, keyed by route. A flow is a list of steps; a step is a caption and a scene built from blocks (rows, tiles, banner, chat, fields, checks, meter, lines, chips).
- Every caption is a claim the product can stand behind, and the figures are the seeded demo patients the captures were taken on. Keep it that way.
- The real screens sit under the widget on the module pages that have them, imported from the Orb repo's capture run by `python3 scripts/import_orb_assets.py`. Captures whose pixels carry words the site does not use are held back in that script until the product strings are swept and the screens retaken.

The site used to embed the whole front end in demo mode. That was removed on purpose: it handed the entire product to anyone who opened the page. The demo build itself still lives in the Orb repo (`vite.demo.config.ts`, `src/demo/`), so it can be put behind a login later.

