export async function ensurePushSubscription(vapidPublicKey: string){
  if (!('serviceWorker' in navigator)) return null
  const reg = await navigator.serviceWorker.getRegistration() || await navigator.serviceWorker.register('/sw.js')
  const sub = await reg.pushManager.getSubscription()
  if (sub) return sub
  const converted = urlBase64ToUint8Array(vapidPublicKey)
  return await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: converted })
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
