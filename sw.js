const CACHE_NAME = 'pulse-timer-v8';
const APP_SHELL = [
  './', './index.html', './manifest.json', './icon.svg',
  './assets/boxing-start-loud.wav', './assets/boxing-rest-loud.wav', './assets/clear-bell-loud.wav',
  './assets/coach-whistle.wav', './assets/gong.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Private sync responses contain the user's workout data. They must always
  // go directly to the HTTPS API and never enter the offline app cache.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/v1/')) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
