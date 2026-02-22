const CACHE_NAME = "vzla-cash-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./graficos.html"
];

// ==========================
// INSTALACIÓN
// ==========================
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ==========================
// ACTIVACIÓN (LIMPIA CACHE VIEJO)
// ==========================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ==========================
// FETCH (ESTRATEGIAS)
// ==========================
self.addEventListener("fetch", event => {

  const request = event.request;

  // 🔹 Estrategia Network First para APIs
  if (request.url.includes("ve.dolarapi.com")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, cloned);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 🔹 Cache First para estáticos
  event.respondWith(
    caches.match(request)
      .then(response => {
        return response || fetch(request);
      })
  );
});
