// Kunz · fonctionnement hors ligne
// Change le numéro de version à chaque mise à jour des polices ou des images.
const CACHE = 'kunz-v1';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './img/kunz-photo.jpg', './img/icon-192.png', './img/icon-512.png', './img/apple-touch-icon.png',
  './fonts/GravurLLTT-CondBold.ttf', './fonts/GravurLLTT-CondBlack.ttf',
  './fonts/AkkuratLLTT-Regular.ttf', './fonts/AkkuratLLTT-Bold.ttf'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // La page elle-même : toujours la version en ligne si possible, la copie sinon.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then((r) => {
      const copy = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
