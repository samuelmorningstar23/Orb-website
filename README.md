# Orb website

The marketing site for Orb (orbsuite.com): a static front end with no backend of its own. It presents the product with the product itself: every module page and the homepage explorer embed a demo-mode build of the real Orb front end, answered in the browser from recordings of the real backend on seeded demo patients (see The live demo below), plus captioned walkthroughs captured from the same runs.

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
access key, and contact address live in `src/data/siteContent.ts` : the access
key must be registered in the Web3Forms dashboard to orbsuite.com and to an
inbox the team controls.

## Structure

- `src/pages/Landing.tsx` : homepage (bento grid, hero)
- `src/pages/details/*` : per-module showcase pages, one for every module in
  `ALL_MODULES` (14 today: Sage, Vigil, Scribe, Lens, Relay, Helix, Surgical
  Suite, Pulse, Forecast, Bridge, Slate, Revenue Integrity, Command Center,
  Surge Simulator)
- `src/pages/Plans.tsx` / `src/pages/Support.tsx` : plan comparison; support
  page with FAQ and a contact form
- `src/components/` : `MarketingHeader`, `Aurora` (background),
  `RequestDemoModal`, `OrbLogo`, the search overlay, and the landing sections
- `src/data/siteContent.ts` : single source of truth for modules, plans,
  contact email, and form delivery config
- `src/index.css` / `src/App.css` : shared visual design tokens (copied from the app
  so the two look consistent; they are otherwise independent)

## Notes

- Runs on **port 5174** so it can run alongside the clinical app's dev server (5173).
- `Aurora`, `OrbLogo`, and the CSS tokens are **copies** shared with the app by
  convention : there is no code dependency between the two projects.

## The live demo

Every module page and the homepage explorer embed the real Orb front end, built in demo mode from the Orb repo (`vite.demo.config.ts`): the app's API calls are answered in the browser from recordings of the real backend on seeded demo patients, and the realtime frames are replayed. Nothing is mocked by hand.

- `public/demo/` is the built app (do not edit; rebuild with `scripts/build_demo.sh`).
- `public/demo-data/<persona>.json` are the recordings, written by `node docs/website-assets/capture.cjs --record` in the Orb repo.
- `src/components/captures/LiveDemo.tsx` embeds `/demo/index.html?persona=…&tab=…`; `src/data/liveViews.ts` maps each module to a persona, a tab and a hint.
- `src/components/captures/Capture.tsx` plays the captioned walkthroughs (frames from the same capture run); `scripts/import_orb_assets.py` imports them.

To refresh after a product change: in the Orb repo, reseed, start the backend with the admin MFA wall lifted, run the capture with `--record`, then here run `scripts/build_demo.sh` and `python3 scripts/import_orb_assets.py`.
