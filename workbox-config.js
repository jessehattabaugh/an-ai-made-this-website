// Using CommonJS module syntax for Workbox compatibility
module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{html,css,js,json,png,jpg,jpeg,svg,webp,gif,ico,woff,woff2,ttf,eot,mp3,wav}',
	],
	swDest: 'dist/sw.js',
	clientsClaim: true,
	skipWaiting: true,
	runtimeCaching: [
		{
			urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'images',
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				},
			},
		},
		{
			urlPattern: /\.(?:mp3|wav)$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'audio',
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
				},
			},
		},
		{
			urlPattern: /\.(?:js|css)$/,
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'static-resources',
			},
		},
		{
			urlPattern: /\.(?:html)$/,
			handler: 'NetworkFirst',
			options: {
				cacheName: 'html-pages',
			},
		},
	],
};
