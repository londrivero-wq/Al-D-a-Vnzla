const CACHE_NAME = "vzla-cash-v2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./graficos.html"
];

// Instalación
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activación (limpia caché vieja)
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

// Estrategia de caché
self.addEventListener("fetch", event => {

  // 🔥 IMPORTANTE: No cachear la API (para que siempre conecte)
  if (event.request.url.includes("open.er-api.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first para archivos locales
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});