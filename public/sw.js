// Service Worker for EPISYS PWA
const CACHE_NAME = 'episys-v1.2.3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.jpg',
  '/images/mastercard.png',
  '/images/visa.png',
  '/images/instapay.png',
  '/images/vodafone.jfif',
  '/images/Banner1.png',
  '/images/banner2.png',
  '/images/banner3.png',
  '/images/p1.png',
  '/images/p2.png',
  '/images/p3.png',
  '/images/table.png',
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for Next.js files, API routes, and non-GET requests
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.search.includes('v=') || // Skip versioned files
    request.method !== 'GET' ||
    request.headers.get('accept')?.includes('text/html') // Skip HTML requests
  ) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(request).then(fetchResponse => {
        // Only cache successful responses with correct MIME types
        if (fetchResponse && fetchResponse.status === 200) {
          const contentType = fetchResponse.headers.get('content-type');
          
          // Only cache specific content types
          if (contentType && (
            contentType.includes('text/css') ||
            contentType.includes('application/javascript') ||
            contentType.includes('image/') ||
            contentType.includes('font/') ||
            contentType.includes('application/json')
          )) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
        }
        return fetchResponse;
      }).catch(() => {
        // Return cached version if network fails
        return response;
      });
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
