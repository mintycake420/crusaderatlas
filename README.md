# Kingdom of Jerusalem — A Crusader Atlas of the Holy Land

Live site: [crusaderatlas.com](https://crusaderatlas.com/)

An interactive atlas of Crusader castles, towns, and fortifications across
the medieval Kingdom of Jerusalem and the surrounding Latin East. Click any
site on the map to read its history, see photographs, and follow Wikipedia
links.

## Deploying

The entire site is a single static HTML file plus two image folders. Any
static host (Cloudflare Pages, Netlify, GitHub Pages, plain nginx) will work
with zero configuration.

```
site/
  index.html        single-page app (Leaflet + embedded data)
  favicon.png
  fortress-pics/    site photographs (lazy-loaded)
  coat-of-arms/     heraldic crests for fiefs
  robots.txt
```

## Credits

- Site gazetteer based on Denys Pringle's *Secular Buildings in the Crusader
  Kingdom of Jerusalem: An Archaeological Gazetteer*.
- Map rendering: [Leaflet](https://leafletjs.com/) with
  [MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster).
- Basemap tiles: [CARTO](https://carto.com/) Voyager, based on
  [OpenStreetMap](https://www.openstreetmap.org/) data.
- Typography: Cinzel, IM Fell DW Pica SC, Spectral, Inter (Google Fonts).
