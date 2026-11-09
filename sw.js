/* Cache offline da aula: depois da primeira visita, tudo (código, simuladores, fontes, fotos) abre sem internet. */
const VERSION = 'aula-tamponantes-v1';
// O servidor manda `Vary: Origin`; scripts de módulo mandam o cabeçalho e o cache de outra forma não os reconheceria.
const MATCH = { ignoreVary: true };

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isFontHost = url => url.hostname.endsWith('fontshare.com') || url.hostname === 'cdn.fontshare.com';
const isCacheable = href => {
  try {
    const url = new URL(href);
    return url.origin === self.location.origin || isFontHost(url);
  } catch {
    return false;
  }
};

// A página manda a lista do que já carregou: guarda tudo na primeira visita, sem esperar uma segunda.
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'precache' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(VERSION).then(cache =>
      Promise.all(
        event.data.urls.filter(isCacheable).map(href =>
          cache.match(href, MATCH).then(hit => hit || fetch(href).then(res => {
            if (res && (res.ok || res.type === 'opaque')) return cache.put(href, res);
            return undefined;
          }).catch(() => undefined))
        )
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !isFontHost(url)) return;

  // Página: tenta a rede (pega versão nova) e cai no cache se estiver offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true, ignoreVary: true }).then(hit => hit || caches.match(self.registration.scope, MATCH)))
    );
    return;
  }

  // Resto (arquivos com hash no nome, fontes, fotos): usa o cache e atualiza em segundo plano.
  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req, MATCH).then(hit => {
        const network = fetch(req)
          .then(res => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    )
  );
});
