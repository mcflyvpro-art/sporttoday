// Service worker : l'app marche hors-ligne. Changer VERSION à chaque mise à jour.
const VERSION = 'sporttoday-v2';
const ASSETS = [
  './',
  'index.html',
  'app.css',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/barlow-500.woff2',
  'fonts/barlow-600.woff2',
  'fonts/barlow-condensed-600.woff2',
  'fonts/barlow-condensed-700.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache d'abord (instantané, hors-ligne), mise à jour en arrière-plan.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const net = fetch(req).then(async res => {
    if (res && res.ok && res.type === 'basic') {
      const c = await caches.open(VERSION);
      await c.put(req, res.clone());
    }
    return res;
  });
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true })
      || (req.mode === 'navigate' ? await caches.match('index.html') : undefined);
    return hit || net;
  })());
  e.waitUntil(net.catch(() => {}));
});
