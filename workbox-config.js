module.exports = {
    globDirectory: "dist/",
    globPatterns: [
        "**/*.{html,js,css,png,jpg,gif,svg,json}",
        "manifest.json",
        "*.js",
        "components/*.js"
    ],
    swDest: "dist/sw.js",
    clientsClaim: true,
    skipWaiting: true,
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
            cacheName: 'images',
            expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
        }
    }]
};
