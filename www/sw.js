const CACHE_NAME = 'ai-website-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/index.js',
    '/manifest.json',
    '/favicon.ico',
    '/192.png',
    '/512.png',
    '/components/site-footer.js',
    '/components/site-header.js',
    '/components/theme-toggle.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch new
                return response || fetch(event.request)
                    .then(response => {
                        // Cache new responses except for dynamic API calls
                        if (event.request.url.includes('/api/')) {
                            return response;
                        }
                        
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
            })
            .catch(() => {
                // Return offline page if available
                return caches.match('/');
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
    );
});
