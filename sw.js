// ─── DayPulse Service Worker ─────────────────────────────────────────────────
const CACHE_NAME = 'daypulse-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some static assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── FETCH STRATEGY ───────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // ── API calls: Network first, fallback to cache ──────────────────────────
  if (url.hostname === 'www.positive-api.online' || url.hostname === 'positive-api.online' || url.hostname === 'api.open-meteo.com') {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // ── Google Fonts: Cache first ─────────────────────────────────────────────
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // ── App shell: Cache first, then network ─────────────────────────────────
  event.respondWith(cacheFirstStrategy(request));
});

// ─── STRATEGIES ───────────────────────────────────────────────────────────────

async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request.clone());
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(
      JSON.stringify({ error: 'Sin conexión' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request.clone());
    if (response && response.status === 200 && response.type !== 'opaque') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    return new Response('Sin conexión', { status: 503 });
  }
}

// ─── BACKGROUND SYNC (optional) ──────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});