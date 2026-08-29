const CACHE = 'bench-bin-bom-shell-v0.1.2';
const DOCUMENTS = ['/', '/demo/', '/privacy/', '/terms/', '/404.html', '/assets/bench-diorama-v1.webp', '/favicon.svg'];

async function fetchFresh(url) {
  const response = await fetch(new Request(url, { cache:'reload' }));
  if (!response.ok) throw new Error(`Could not cache ${url}`);
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = new Set(DOCUMENTS);
    for (const url of DOCUMENTS) {
      const response = await fetchFresh(url);
      await cache.put(url, response.clone());
      if (url.endsWith('/') || url.endsWith('.html')) {
        const html = await response.text();
        for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) assets.add(match[1]);
      }
    }
    for (const url of assets) {
      if (DOCUMENTS.includes(url)) continue;
      await cache.put(url, await fetchFresh(url));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreVary:true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await (await caches.open(CACHE)).put(event.request, response.clone());
      return response;
    } catch {
      if (event.request.mode === 'navigate') {
        const path = new URL(event.request.url).pathname;
        if (path === '/demo' || path.startsWith('/demo/')) return (await caches.match('/demo/'));
        return (await caches.match('/404.html'));
      }
      return new Response('Offline resource unavailable', { status:503, headers:{ 'Content-Type':'text/plain' } });
    }
  })());
});
