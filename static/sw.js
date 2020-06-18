const CACHE_KEY = '20200618';
const CACHE_FILES = [
  'background.jpg',
  'background-cover.svg',
  'aside.css',
  'base.css',
  'footer.css',
  'header.css',
  'nav.css',
  'NotoSansCJKjp-Bold.woff2',
  'NotoSansCJKjp-Regular.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', async e => {
  const cacheKeys = await caches.keys();
  const keys = cacheKeys.filter(key => key !== CACHE_KEY);
  await Promise.all(keys.map(key => caches.delete(key)));

  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  if (!CACHE_FILES.some(file => e.request.url.includes(file))) {
    return;
  }

  const cache = caches.match(e.request).then(response => {
    return response || fetch(e.request.clone()).then(async response => {
      if (response.ok) {
        const clone = response.clone();
        const cache = await caches.open(CACHE_KEY);
        await cache.put(e.request, clone);
      }

      return response;
    });
  });

  e.respondWith(cache);
});
