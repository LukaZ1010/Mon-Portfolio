const CACHE_NAME = 'hanzi-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Installation : on précache tout
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch : Cache-First (offline en priorité)
self.addEventListener('fetch', event => {
  // On ignore les requêtes non-GET et les extensions Chrome
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Retourner depuis le cache immédiatement (fonctionne offline)
        return cachedResponse;
      }
      // Si pas en cache, essayer le réseau
      return fetch(event.request).then(networkResponse => {
        // Mettre en cache les nouvelles ressources dynamiquement
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si tout échoue (offline + pas en cache), retourner la page principale
        return caches.match('./index.html');
      });
    })
  );
});
