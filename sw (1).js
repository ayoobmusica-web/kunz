// Kunz · fonctionnement hors ligne
// Change le numéro de version à chaque mise à jour des polices ou des images.
const CACHE = 'kunz-v3';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './kunz-photo.jpg', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './GravurLLTT-CondBold.ttf', './GravurLLTT-CondBlack.ttf',
  './AkkuratLLTT-Regular.ttf', './AkkuratLLTT-Bold.ttf'
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
