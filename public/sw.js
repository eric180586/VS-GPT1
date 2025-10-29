self.addEventListener('install', (e)=>self.skipWaiting());
self.addEventListener('activate', (e)=>self.clients.claim());
self.addEventListener('fetch', ()=>{});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Villa Sun';
  const options = {
    body: data.body || '',
    data: data.data || {},
    tag: data.tag || 'villasun',
    renotify: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
