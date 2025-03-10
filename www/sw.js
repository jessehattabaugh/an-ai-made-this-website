const CACHE_NAME = 'simple-website-v1';
const ASSETS_TO_CACHE = [
	'/',
	'/index.html',
	'/about.html',
	'/contact.html',
	'/index.css',
	'/index.js',
	'/components/site-header.js',
	'/components/site-footer.js',
	'/components/theme-toggle.js',
	'/192.png',
	'/512.png',
	'/favicon.ico',
];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => response || fetch(event.request)),
	);
});
