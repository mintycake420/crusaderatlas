# Crusader Atlas — Open Dataset

A structured, machine-readable dataset of Crusader-era sites, lordships, routes, rulers, and encyclopedic entries in the Latin East (c. 1099--1291), extracted from the live [Crusader Atlas](https://crusaderatlas.com).

**170 sites** | **27 lordships** | **24 monarchs** | **129 glossary entries** | **11 battle narratives** | **7 routes**

All geographic files render as interactive maps on GitHub. Click any `.geojson` file to preview.

## Files

| File | Format | Records | Description |
|------|--------|---------|-------------|
| [`geojson/sites.geojson`](geojson/sites.geojson) | GeoJSON | 170 | Castles, churches, towers, fortified towns, battles, and sieges |
| [`geojson/lordships.geojson`](geojson/lordships.geojson) | GeoJSON | 27 | Feudal lordship polygons with succession tables and heraldry |
| [`geojson/routes.geojson`](geojson/routes.geojson) | GeoJSON | 7 | Pilgrim and trade routes |
| [`geojson/borders.geojson`](geojson/borders.geojson) | GeoJSON | 7 | Modern country borders (reference layer) |
| [`json/rulers.json`](json/rulers.json) | JSON | 24 | Monarchs of the Kingdom of Jerusalem |
| [`json/glossary.json`](json/glossary.json) | JSON | 129 | Encyclopedic entries on people, events, orders, and institutions |
| [`json/battles.json`](json/battles.json) | JSON | 11 | Extended narratives for major battles and sieges |
| [`csv/sites.csv`](csv/sites.csv) | CSV | 170 | Flat export of sites for spreadsheet users |
| [`csv/rulers.csv`](csv/rulers.csv) | CSV | 24 | Flat export of rulers |
| [`csv/glossary.csv`](csv/glossary.csv) | CSV | 129 | Flat export of glossary entries |

Formal JSON Schemas are in [`schemas/`](schemas/).

## Data dictionary

### Sites (`sites.geojson`)

Each feature is a GeoJSON Point with the following properties:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | URL-safe kebab-case slug (e.g., `"belvoir-castle"`). Matches landing-page paths and deep-link query params. |
| `internal_key` | string | Original key from the source data array, preserving raw casing for build-pipeline compatibility. |
| `name` | string | Primary display name |
| `alternate_names` | string[] | Historical alternative names |
| `category` | string | Site type (see table below) |
| `territory` | string | Modern country or region |
| `modern_location` | string | City, Country |
| `lordship` | string or null | Medieval lordship this site fell within (e.g., `"Principality of Galilee"`). Computed via point-in-polygon against `lordships.geojson`. Null for sites outside the kingdom (Egypt, inland Syria). |
| `coordinate_precision` | string | `"exact"` or `"approximate"` |
| `description` | string | Narrative description with historical context |
| `fortification` | object or null | **Null for battle/siege entries** (concept does not apply). For all other categories, an object with the fields below. |
| `fortification.status` | string | `"definite"`, `"probable"`, `"uncertain"`, or `"no"` |
| `fortification.visible_remains` | string | `"yes"`, `"partial"`, `"fragmentary"`, `"unknown"`, or `"no"` |
| `fortification.harbor` | boolean | Whether the site had a medieval harbor |
| `has_extended_narrative` | boolean | Present only on battle/siege sites. True if `battles.json` contains an extended narrative for this site. |
| `image` | string | Photo filename (relative to `/fortress-pics/`) |
| `wikipedia.en` | string | English Wikipedia URL |
| `wikipedia.he` | string | Hebrew Wikipedia URL |

Coordinates are WGS84, `[longitude, latitude]` per GeoJSON RFC 7946.

### Site categories

| Category | Label | Count |
|----------|-------|-------|
| `capital` | Capital city | 3 |
| `major_castle` | Major castle / fortress | 52 |
| `urban` | Walled town / citadel | 15 |
| `tower` | Tower or smaller fortified site | 41 |
| `church` | Church or religious site | 29 |
| `battle` | Battle (open-field engagement) | 20 |
| `siege` | Siege | 10 |

### Lordships (`lordships.geojson`)

Each feature is a GeoJSON Polygon. Properties:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Kebab-case slug. Cross-referenced by the `lordship` field in `sites.geojson`. |
| `name` | string | Lordship name |
| `kind` | string | `"fief"`, `"great_fief"`, `"royal"`, `"sub_fief"`, `"crusader_state"`, `"water"`, or `"external_polity"` |
| `capital` | string | Capital city or stronghold |
| `parent` | string | Parent fief or `"Crown"` |
| `style.fill` | string | Hex color for map rendering |
| `coat_of_arms` | string | Heraldic crest SVG filename (relative to `/coat-of-arms/`) |
| `photo` | string | Image filename (relative to `/fortress-pics/`) |
| `description` | string[] | Historical description paragraphs |
| `lords` | object[] | Lord succession table: `{ name, reign, wikipedia }` |
| `lord_column_header` | string | Custom label for the lords column |
| `note` | string | Editorial note |

### Routes (`routes.geojson`)

Each feature is a GeoJSON LineString. Properties:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full route name |
| `short_name` | string | Abbreviated route name |
| `role` | string | `"pilgrim"`, `"caravan"`, or `"maritime"` |
| `summary` | string | One-sentence summary |
| `description` | string[] | Multi-paragraph historical narrative |
| `image` | string | Image filename |
| `style.color` | string | Hex color for map rendering |
| `style.halo_color` | string | Hex halo color |

### Rulers (`rulers.json`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"baldwin_i"`) |
| `name` | string | Full display name |
| `epithet` | string | Honorific or descriptive title |
| `dynasty` | string | Noble house |
| `regnal_title` | string | Official title held |
| `reign_start` | integer | Year reign began |
| `reign_end` | integer | Year reign ended |
| `predecessor` | string | Previous ruler |
| `successor` | string | Next ruler |
| `bio` | string[] | Biographical narrative paragraphs |
| `image` | string | Portrait filename |
| `wikipedia.en` | string | English Wikipedia URL |
| `wikipedia.he` | string | Hebrew Wikipedia URL |

### Glossary (`glossary.json`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (kebab-case) |
| `name` | string | Display name |
| `category` | string | Top-level category |
| `subcategory` | string | Sub-classification |
| `era` | string | Date range or period |
| `also_known_as` | string[] | Alternative names |
| `short` | string | One-sentence summary |
| `body` | string[] | Multi-paragraph content |
| `image_url` | string | Image path or Wikimedia URL |
| `wikipedia.en` | string | English Wikipedia URL |
| `wikipedia.he` | string | Hebrew Wikipedia URL |
| `see_also` | string[] | Related entry IDs |
| `source` | string | `"authored"` (hand-written) or `"rulers"` (projected from rulers data) |
| `ruler_id` | string | Cross-reference to `rulers.json` (monarch entries only) |

The glossary file also includes taxonomy arrays: `categories`, `subgroup_labels`, and `navigation_groups`.

### Battles (`battles.json`)

An array of battle/siege narrative objects, each with:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Kebab-case slug derived from the battle name |
| `name` | string | Canonical battle name (e.g., `"Battle of Hattin (1187)"`) |
| `site_id` | string or null | Cross-reference to the matching site's `id` in `sites.geojson` |
| `paragraphs` | string[] | Extended narrative paragraphs |

### CSV exports

Flat CSV versions of sites, rulers, and glossary for spreadsheet tools. Each CSV begins with a `#` comment line noting what was omitted. Nested fields (arrays, objects) are simplified:
- Arrays are joined with semicolons
- Site descriptions are truncated to 500 characters (column named `description_truncated`)
- Full body/bio text is omitted — use the JSON/GeoJSON files for complete content
- `see_also` relationships are omitted from the glossary CSV

The sites CSV includes `lordship` and `internal_key` columns. Fortification fields are blank for battle/siege entries.

### Image path conventions

All image references are bare filenames, not full URLs:
- Site/route/ruler images: relative to `/fortress-pics/`
- Coat of arms: relative to `/coat-of-arms/`
- Glossary images: either a bare filename (relative to `/fortress-pics/`) or a full `https://` Wikimedia URL

## Example queries

### Python / geopandas

```python
import geopandas as gpd

sites = gpd.read_file("data/geojson/sites.geojson")
castles = sites[sites["category"] == "major_castle"]
print(f"{len(castles)} castles")
castles.plot(figsize=(10, 12), color="darkred", markersize=20)
```

### JavaScript (fetch)

```javascript
const res = await fetch("https://crusaderatlas.com/data/geojson/sites.geojson");
const sites = await res.json();
const battles = sites.features.filter(f => f.properties.category === "battle");
console.log(`${battles.length} battles`);
```

### QGIS

1. Layer > Add Layer > Add Vector Layer
2. Browse to `data/geojson/sites.geojson`
3. Click Add — all 170 sites appear as points
4. Repeat for `lordships.geojson` to overlay the feudal polygons

### R / sf

```r
library(sf)
sites <- st_read("data/geojson/sites.geojson")
churches <- sites[sites$category == "church", ]
plot(st_geometry(churches), pch = 19, col = "blue")
```

## Validation

Run the validation script from the project root:

```bash
node archive/tools/validate_database.js
```

This checks structural integrity, field types, enum values, coordinate bounds, referential integrity (cross-references between files), and image file existence.

## Regeneration

The data files are extracted from the inline arrays in `crusaderatlas/index.html`. To regenerate after content changes:

```bash
node archive/tools/export_database.js
```

## License

Content (data, descriptions, historical text) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Code is licensed under MIT.

For academic citation, see [`CITATION.cff`](CITATION.cff) or cite as:

> Crusader Atlas Dataset. https://crusaderatlas.com / https://github.com/mintycake420/crusaderatlas

## Provenance

This dataset is extracted from the inline JavaScript data arrays in [`crusaderatlas/index.html`](../index.html), which is the runtime source of truth for the live atlas at [crusaderatlas.com](https://crusaderatlas.com). The primary scholarly source is Denys Pringle's *Secular Buildings in the Crusader Kingdom of Jerusalem: An Archaeological Gazetteer* (Cambridge University Press, 1997).
