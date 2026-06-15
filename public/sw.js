const CACHE = "fitpro-v4";
const SHELL = ["/", "/treino", "/dieta", "/agentes", "/historico"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Push notification received from server (future backend integration)
self.addEventListener("push", (e) => {
  const data = e.data ? e.data.json() : { title: "FitPro 💪", body: "Hora do treino!" };
  e.waitUntil(
    self.registration.showNotification(data.title ?? "FitPro 💪", {
      body: data.body ?? "Hora do treino!",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "fitpro-reminder",
      data: { url: "/" },
    })
  );
});

// Tapping a notification opens the app
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = e.notification.data?.url ?? "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = request.url;

  // Skip non-GET, API calls, and Next.js internal chunks (they change on every build)
  if (
    request.method !== "GET" ||
    url.includes("/api/") ||
    url.includes("/_next/") ||
    url.includes("/__nextjs")
  ) return;

  e.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() => cached ?? new Response("Offline", { status: 503 }));
      return cached || networkFetch;
    })
  );
});
