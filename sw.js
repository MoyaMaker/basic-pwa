const CACHE_NAME = 'qu1dev-cache';
const urlToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/main.js',
  '/sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlToCache)
      .then(() => self.skipWaiting()))
  )
});

self.addEventListener('active', (e) => {
  const cacheWhiteList = [CACHE_NAME];

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cacheWhiteList.indexOf(cache) === -1) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .catch((e => console.error(e)))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(e.request);
      })
  )
});
