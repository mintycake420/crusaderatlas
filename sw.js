// CrusaderAtlas service worker — repeat-visit fast path.
// Strategy:
//   navigations + .html + manifest      → stale-while-revalidate (instant from cache, refresh in background)
//   /fortress-pics/, /coat-of-arms/, *.png/.webp/.jpg → cache-first (immutable assets)
//   everything else (tiles, unpkg, fonts) → network passthrough (their own caches handle it)
//
// Bump CACHE_VERSION whenever you ship a breaking change to this file.
const CACHE_VERSION = "atlas-v3";
const HTML_CACHE = CACHE_VERSION + "-html";
const ASSET_CACHE = CACHE_VERSION + "-assets";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

function isHtmlRequest(req, url) {
  if (req.mode === "navigate") return true;
  const path = url.pathname;
  return path.endsWith(".html") || path.endsWith("/") || path === "/manifest.json";
}

function isAssetRequest(url) {
  const path = url.pathname;
  if (/^\/lordships-(top|bottom)\.(webp|png)$/i.test(path)) return false;
  if (path.startsWith("/fortress-pics/") || path.startsWith("/coat-of-arms/")) return true;
  return /\.(png|webp|jpe?g|svg|ico)$/i.test(path);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isHtmlRequest(req, url)) {
    event.respondWith(
      caches.open(HTML_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((response) => {
            if (response && response.ok) cache.put(req, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (isAssetRequest(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const response = await fetch(req);
        if (response && response.ok) cache.put(req, response.clone());
        return response;
      })
    );
  }
});
