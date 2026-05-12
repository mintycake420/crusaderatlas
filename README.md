# Crusader Atlas

An interactive, hand-curated historical atlas of the medieval Kingdom of Jerusalem and the surrounding Latin East, c. 1099–1291.

**Live:** [crusaderatlas.com](https://crusaderatlas.com/)

167 verified sites — castles, fortified churches, towers, fortified towns, battles, and sieges — plotted on an interactive Leaflet map with photographs, primary sources, and Wikipedia links in English and Hebrew. The 25 Frankish lordships are drawn as actual polygon borders rather than dots, and a glossary of ~70 entries covers the kings, the orders, internal conflicts, and first-hand accounts by Christian, Jewish, and Muslim travellers who passed through the kingdom while it existed.

## What's on the map

- **167 verified sites** — from famous fortifications (Krak des Chevaliers, Montfort, Belvoir, Atlit, the Hospitaller Compound in Acre) to obscure standing remains most visitors have walked past without recognising (the Francheville tower in Romema, Haifa; Castellare Rogerii Longobardi outside Netanya; Cave de Tyron in southern Lebanon; and dozens more).
- **25 Frankish lordships** drawn as polygons with labelled borders, capitals, and parents — Tyre, Sidon, Galilee, Toron, Caesarea, Beirut, Oultrejourdain, and the rest.
- **~70 glossary entries** — kings and queens of Jerusalem with reign dates and dynasties; the military and religious orders (Templars, Hospitallers, Teutonic Knights, Lazarites); internal conflicts of the kingdom; and first-hand accounts by Christian, Jewish, and Muslim travellers (Benjamin of Tudela, Ibn Jubayr, William of Tyre, John of Würzburg, and others).
- **Photographs** of standing remains where they exist, with primary photo + WebP fallback + 400-px thumbnail variants for fast loading.
- **Cited sources** — Denys Pringle's *Churches of the Crusader Kingdom of Jerusalem* and *Secular Buildings in the Crusader Kingdom of Jerusalem*, contemporary chronicles, and named secondary sources, with a precision flag (exact coordinates vs. approximate location) on every entry.

## Tech

A single-page app built deliberately without a framework or backend.

- **Vanilla JavaScript** — no React, Vue, Svelte, jQuery, or TypeScript. ES2017+, 2-space indent.
- **[Leaflet 1.9.4](https://leafletjs.com/)** for the map, plus **[Leaflet.markercluster 1.5.3](https://github.com/Leaflet/Leaflet.markercluster)** for cluster behaviour at low zoom.
- **[CARTO Voyager](https://carto.com/)** raster basemap tiles over OpenStreetMap data, with a separate label overlay so labels sit cleanly on top of the lordship polygons.
- **No bundler, no `npm install` to run the site.** Everything (data arrays, SVG glyphs, panel markup, CSS) is inlined into a single `index.html`. The two large lordship-overlay rasters (`lordships-top.png`, `lordships-bottom.png`) are externalised so the HTML stays under ~1 MB; everything else ships in the page.
- **Service worker** (`sw.js`) — stale-while-revalidate for HTML, cache-first for assets, with a versioned cache key so content updates flush cleanly.
- **PWA manifest** (`manifest.json`) — installable on Android and iOS home screens.
- **Cloudflare Pages** hosting; cache rules in `_headers` mark `/fortress-pics/*`, `/coat-of-arms/*`, and `/*.png` as `immutable`, while `/index.html` and the per-entity SEO landing pages stay `must-revalidate`.

## Repository layout

```
index.html              single-page app (Leaflet, all data inlined)
sw.js                   service worker
manifest.json           PWA manifest
_headers                Cloudflare Pages cache rules
robots.txt              + sitemap.xml
favicon.png             + multi-resolution Jerusalem-cross favicons
apple-touch-icon.png    home-screen icon
og-image.png            social-card image (1200×630)
lordships-{top,bottom}.{png,webp}   externalised lordship-overlay rasters
fortress-pics/          site photographs (JPG + WebP + -400 thumbnail siblings)
coat-of-arms/           heraldic crests for fiefs
sites/<slug>/           SEO landing page per site (167)
glossary/<slug>/        SEO landing page per glossary entry (~70)
lordships/<slug>/       SEO landing page per lordship (25)
```

## Two-tier SEO architecture

The live experience at `/` is a single-page app — great for users, opaque to search engines that don't reliably execute JavaScript. To make every entity discoverable, the site also ships ~280 static landing pages (one per site, lordship, and glossary entry) generated from the same source-of-truth data as the SPA.

Each landing page is 8–15 KB: parchment-palette inline CSS, real `<h1>`/`<p>` content, `<picture>` with WebP fallback, JSON-LD (`Place` / `Article` / `Person` + `BreadcrumbList`), eight cross-links, and a "View on the live atlas" CTA that deep-links back via `?site=<slug>`, `?entry=<slug>`, or `?fief=<slug>`.

The SPA recognises those query params at startup and routes to the relevant detail panel, so search-engine traffic that lands on a static page can return to the live, interactive view in one click.

## Running locally

The site is fully static. From this directory:

```bash
npx http-server -p 8767
# or
python -m http.server 8767
```

Then open http://localhost:8767. No build step, no install, no environment variables.

## Mobile

- Two-row topbar that collapses to a floating action-button cluster below 720 px.
- Bottom-sheet detail panel with three states (closed / peek / expanded), drag-to-expand, focus trap, and a shared scrim across the four overlay drawers (detail, filters, glossary, layers).
- `overscroll-behavior: none` to disable Android pull-to-refresh inside the sheet.
- All four drawers close cleanly via `closeAllMobileOverlays()` and a single shared `<div class="sheet-scrim">` element — no orphaned dimming layers.

## Performance

- ~880 KB initial HTML payload (down from ~2.8 MB before the lordship overlays were externalised).
- All `<img>` tags use `loading="lazy"` and `decoding="async"`.
- WebP fast path with JPG fallback via `<picture>`; the primary `<img src>` is the 400-px thumbnail variant, with the full-size image only in the `1200w` `srcset` candidate.
- Procedural Web Audio SFX — no audio files served at runtime.
- No runtime XHR or `fetch` beyond Leaflet's tile requests.

## Contributing

This is a single-maintainer project, but **corrections, missing sites, and source pointers are very welcome**:

- **Factual corrections** — open an issue with the site or entry name, the field that's wrong, and a citation.
- **Missing sites** — open an issue with name, approximate coordinates, type (castle / church / tower / fortified town / battle / siege), and a source. Sites without a citation can't be added.
- **Better photographs** — especially of obscure standing remains. Original work or CC-licensed only, please.
- **Hebrew Wikipedia links** — bilingual coverage is a work in progress; pointers to better Hebrew Wikipedia targets for existing entries are useful.

For larger discussions (new buckets, new glossary categories, methodology questions), open an issue before submitting a PR.

## Credits

- **Site gazetteer** — Denys Pringle, *Secular Buildings in the Crusader Kingdom of Jerusalem: An Archaeological Gazetteer* (Cambridge University Press, 1997) and *The Churches of the Crusader Kingdom of Jerusalem: A Corpus* (Cambridge University Press, 1993–2009, 4 vols).
- **Map rendering** — [Leaflet](https://leafletjs.com/) and [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).
- **Basemap tiles** — [CARTO](https://carto.com/) Voyager, based on [OpenStreetMap](https://www.openstreetmap.org/) data.
- **Typography** — Cinzel, IM Fell DW Pica SC, Spectral, and Inter (Google Fonts).
- **Photography** — site photographs are a mix of original work, public-domain Wikimedia images, and CC-licensed contributions; per-image attributions appear in each site's detail panel.

## License

Content (data, photos, written descriptions) is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Code is licensed under MIT.

If you use the atlas in academic work, please cite as:
"Crusader Atlas — https://crusaderatlas.com/"
