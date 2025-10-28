/* eslint-disable no-restricted-globals */
const CACHE_NAME = "fedcoop-static-v1";
const STATIC_ASSETS = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle safe GET requests
  if (request.method !== "GET") return;

  try {
    const url = new URL(request.url);

    const isConvexHost = url.hostname.includes("convex");
    const isAPI = url.pathname.startsWith("/api/");
    const isNextData = url.pathname.startsWith("/_next/");
    const isWebSocket = url.protocol === "ws:" || url.protocol === "wss:";

    // Do not intercept Convex, APIs, Next data routes, or WS traffic
    if (isConvexHost || isAPI || isNextData || isWebSocket) {
      return;
    }
  } catch (err) {
      // If URL parsing fails, fall back to default behavior below
      console.error("URL parsing error:", err);
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Only cache successful, same-origin GET responses
          if (
            response &&
            response.ok &&
            request.url.startsWith(self.location.origin)
          ) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() =>
          caches.match("/offline.html").then((r) => r || Response.error())
        );
    })
  );
});
