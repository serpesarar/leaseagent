// Enhanced Service Worker for PWA functionality
const CACHE_NAME = 'leaseflow-v2'
const DYNAMIC_CACHE = 'leaseflow-dynamic-v2'
const OFFLINE_CACHE = 'leaseflow-offline-v2'

// Critical URLs to cache for offline functionality
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/properties',
  '/dashboard/tenants',
  '/dashboard/leases',
  '/dashboard/payments',
  '/dashboard/maintenance',
  '/dashboard/contractors',
  '/properties',
  '/maintenance/create',
  '/payments',
  '/contractors',
  '/settings',
  '/offline',
  '/manifest.json'
]

// API endpoints to cache for offline functionality
const apiEndpoints = [
  '/api/properties',
  '/api/tenants',
  '/api/maintenance',
  '/api/contractors',
  '/api/payments'
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      caches.open(OFFLINE_CACHE).then((cache) => 
        cache.add('/offline')
      )
    ])
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== OFFLINE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request))
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request))
})

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Fallback to cache for offline functionality
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline data for critical endpoints
    return getOfflineResponse(request)
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

// Navigation strategy for page requests
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for unmatched navigation
    return caches.match('/offline')
  }
}

// Generate offline responses for API endpoints
function getOfflineResponse(request) {
  const url = new URL(request.url)
  
  if (url.pathname.includes('/properties')) {
    return new Response(JSON.stringify({
      properties: [],
      offline: true,
      message: 'Offline mode - cached data not available'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (url.pathname.includes('/maintenance')) {
    return new Response(JSON.stringify({
      maintenanceRequests: [],
      offline: true,
      message: 'Offline mode - cached data not available'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({
    error: 'Offline',
    message: 'No cached data available'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-maintenance') {
    event.waitUntil(syncMaintenanceRequests())
  }
  
  if (event.tag === 'background-sync-payments') {
    event.waitUntil(syncPayments())
  }
})

// Sync maintenance requests when online
async function syncMaintenanceRequests() {
  try {
    const cache = await caches.open('pending-requests')
    const requests = await cache.keys()
    
    for (const request of requests) {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.log('Failed to sync request:', error)
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}

// Sync payments when online
async function syncPayments() {
  try {
    // Implement payment sync logic
    console.log('Syncing payments...')
  } catch (error) {
    console.log('Payment sync failed:', error)
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-72x72.png'
      }
    ],
    requireInteraction: data.urgent || false,
    silent: false,
    tag: data.tag || 'general'
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/dashboard'
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag)
  
  // Track notification dismissal
  if (event.notification.data && event.notification.data.trackDismissal) {
    fetch('/api/notifications/track', {
      method: 'POST',
      body: JSON.stringify({
        action: 'dismissed',
        notificationId: event.notification.data.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => {
      // Silently fail if offline
    })
  }
})

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'urgent-updates') {
    event.waitUntil(checkForUrgentUpdates())
  }
})

async function checkForUrgentUpdates() {
  try {
    const response = await fetch('/api/urgent-updates')
    const data = await response.json()
    
    if (data.urgentIssues && data.urgentIssues.length > 0) {
      // Show urgent notification
      self.registration.showNotification('Urgent Issues Detected', {
        body: `${data.urgentIssues.length} urgent maintenance issues require attention`,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: 'urgent-issues',
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        data: {
          url: '/maintenance?filter=urgent',
          urgent: true
        }
      })
    }
  } catch (error) {
    console.log('Failed to check urgent updates:', error)
  }
}
