/**
 * Yiğit Çelik Kapı — Service Worker (Adım 5.1)
 * JSON: CacheFirst · diğer istekler: ağ (SW devreye girmez)
 */
(function () {
  var CACHE_VERSION = "yck-2026-06-17-v1";
  var JSON_CACHE = "yck-json-" + CACHE_VERSION;

  var JSON_PATHS = [
    "/assets/data/products.json",
    "/assets/data/blog.json",
    "/assets/data/product-links.json",
  ];

  function isJsonDataRequest(url) {
    if (url.origin !== self.location.origin) return false;
    return JSON_PATHS.indexOf(url.pathname) !== -1;
  }

  function cacheFirst(request) {
    return caches.open(JSON_CACHE).then(function (cache) {
      return cache.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request)
          .then(function (response) {
            if (response && response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(function () {
            return cached;
          });
      });
    });
  }

  self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(
      caches.open(JSON_CACHE).then(function (cache) {
        return Promise.all(
          JSON_PATHS.map(function (path) {
            return cache.add(new Request(path, { cache: "reload" })).catch(function () {});
          })
        );
      })
    );
  });

  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key.indexOf("yck-json-") === 0 && key !== JSON_CACHE;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      }).then(function () {
        return self.clients.claim();
      })
    );
  });

  self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;
    var url = new URL(event.request.url);
    if (!isJsonDataRequest(url)) return;
    event.respondWith(cacheFirst(event.request));
  });
})();
