// ResQNow service worker.
//
// - App shell: the HTML is network-first (so a deploy is picked up), falling
//   back to the cached shell when offline.
// - Built assets (/assets/*) are content-hashed, so they are cache-first.
// - Map tiles are cached for offline viewing, capped in size.
// - The API is NEVER cached: reports, SOS and sessions must always be live.

const VERSION = 'v1';
const SHELL_CACHE = `resqnow-shell-${VERSION}`;
const ASSET_CACHE = `resqnow-assets-${VERSION}`;
const TILE_CACHE = `resqnow-tiles-${VERSION}`;
const KEEP = [SHELL_CACHE, ASSET_CACHE, TILE_CACHE];

const SHELL_URLS = ['/', '/manifest.webmanifest', '/icon-192.png', '/favicon.svg'];
const MAX_TILES = 250;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('resqnow-') && !KEEP.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > max) {
    await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Map tiles: cache-first, so a pinned area still renders offline.
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const hit = await cache.match(request);

        if (hit) return hit;

        try {
          const response = await fetch(request);

          if (response.ok || response.type === 'opaque') {
            cache.put(request, response.clone());
            trim(TILE_CACHE, MAX_TILES);
          }

          return response;
        } catch {
          return Response.error();
        }
      })
    );
    return;
  }

  // Anything else cross-origin (the API, fonts, geocoding) goes straight to network.
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first, offline falls back to the shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((hit) => hit || Response.error()))
    );
    return;
  }

  // Hashed build output: cache-first.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(request);

        if (hit) return hit;

        const response = await fetch(request);

        if (response.ok) cache.put(request, response.clone());

        return response;
      })
    );
    return;
  }

  // Icons, manifest, favicon: stale-while-revalidate.
  event.respondWith(
    caches.open(SHELL_CACHE).then(async (cache) => {
      const hit = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => hit);

      return hit || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
