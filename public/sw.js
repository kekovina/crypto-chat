if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let i = {};
    const r = (e) => a(e, t),
      o = { module: { uri: t }, exports: i, require: r };
    s[t] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (c(...e), i));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'f583823d2711c9dbead319587e6d16e7' },
        { url: '/_next/static/chunks/110-8031916578dc250d.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        { url: '/_next/static/chunks/173-c1e7069b2846e68b.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        { url: '/_next/static/chunks/203.2b4c1ee4fbe3a7cf.js', revision: '2b4c1ee4fbe3a7cf' },
        { url: '/_next/static/chunks/218.57a830a2c55ba802.js', revision: '57a830a2c55ba802' },
        { url: '/_next/static/chunks/463.cc70c3d71a7774c9.js', revision: 'cc70c3d71a7774c9' },
        {
          url: '/_next/static/chunks/4bd1b696-d86aaf8bdbc2a12a.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        { url: '/_next/static/chunks/509-3286d8b264bef598.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        { url: '/_next/static/chunks/517-83945ad74ca8686e.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        { url: '/_next/static/chunks/548.f5ad4bf81240be0f.js', revision: 'f5ad4bf81240be0f' },
        { url: '/_next/static/chunks/698-39e1fe9ea864a52e.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        { url: '/_next/static/chunks/aaea2bcf.1ee962a2d51c8044.js', revision: '1ee962a2d51c8044' },
        {
          url: '/_next/static/chunks/app/_not-found/page-f1320cc644d2d111.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/api/create-room/route-cc0e026020d7bf0b.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/api/socket/route-4f839f9228b55b0e.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/global-error-b97dcf4308c9dec2.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/layout-d11e96d03ae7dbbe.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/page-966ed620388153f2.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/app/pm/%5Bpid%5D/page-49f21779b3bd6eea.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/framework-6b27c2b7aa38af2d.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/main-app-0b5a433fe086077c.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        { url: '/_next/static/chunks/main-ecd615a9318f36f1.js', revision: 'hVfOwhuclQjO32GkYxNa-' },
        {
          url: '/_next/static/chunks/pages/_app-430fec730128923e.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/pages/_error-2d7241423c4a35ba.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-72ad313311a706a0.js',
          revision: 'hVfOwhuclQjO32GkYxNa-',
        },
        { url: '/_next/static/css/eb886458e0318069.css', revision: 'eb886458e0318069' },
        {
          url: '/_next/static/hVfOwhuclQjO32GkYxNa-/_buildManifest.js',
          revision: '3363a6b9f7bbf334c0746aa2118f2974',
        },
        {
          url: '/_next/static/hVfOwhuclQjO32GkYxNa-/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/fonts/AmaticSC-Bold.woff2', revision: '3555c375d93c1de88e570164bcb0998a' },
        { url: '/fonts/AmaticSC-Regular.woff2', revision: '020591bbe21b9e9a5738a2a1cc7a08d5' },
        { url: '/fonts/Ubuntu-Italic.woff2', revision: '35f3e3f0ac7d10915701f4a10bb6b2c0' },
        { url: '/fonts/Ubuntu-Medium.woff2', revision: '5c61525ac1c3dd23043b92ca83fbc6cc' },
        { url: '/fonts/Ubuntu-Regular.woff2', revision: '787ffd92ac45c2e6a67ea98a75a52a8a' },
        { url: '/img/lock.svg', revision: '14b11ec8199939d2d09774e220acbd92' },
        { url: '/manifest.json', revision: 'db43d3b0662e1c5f14b4c7f8bb7b7949' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: n }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET'
    );
});
