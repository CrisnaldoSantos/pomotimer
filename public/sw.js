// Service worker do pomotimer: deixa o app abrir offline (os dados já ficam no navegador).
// - páginas: rede primeiro, cache como reserva
// - /_next/static (arquivos com hash no nome): cache primeiro
// Aumente a versão para descartar caches antigos.
const VERSION = "v2";
const PAGES_CACHE = `pomotimer-pages-${VERSION}`;
const STATIC_CACHE = `pomotimer-static-${VERSION}`;
const ROUTES = ["/", "/ciclos", "/configuracoes"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES_CACHE);
      const statics = await caches.open(STATIC_CACHE);
      for (const route of ROUTES) {
        try {
          const response = await fetch(route, { cache: "reload" });
          if (!response.ok) continue;
          await pages.put(route, response.clone());
          // Guarda também os arquivos que a página referencia, para ela funcionar offline
          const html = await response.text();
          const assets = new Set(html.match(/\/_next\/static\/[^"'\\\s<>)]+/g) ?? []);
          await Promise.all([...assets].map((url) => statics.add(url).catch(() => {})));
        } catch {
          // Sem rede na instalação: as páginas entram no cache conforme forem visitadas
        }
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGES_CACHE, STATIC_CACHE]);
      for (const key of await caches.keys()) {
        if (key.startsWith("pomotimer-") && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGES_CACHE);
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(url.pathname, response.clone());
          return response;
        } catch {
          return (await cache.match(url.pathname)) ?? (await cache.match("/")) ?? Response.error();
        }
      })(),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })(),
    );
  }
});

// Clicar na notificação (fim de foco/pausa) traz o app para a frente
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = windows[0];
      if (existing) return existing.focus();
      return self.clients.openWindow("/");
    })(),
  );
});
