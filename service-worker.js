const CACHE_NAME = "vzla-cash-monitor-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH
self.addEventListener("fetch", event => {

  // ❌ No cachear APIs externas (Binance etc)
  if (event.request.url.includes("api.binance.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});