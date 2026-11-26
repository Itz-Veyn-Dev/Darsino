const CACHE='darsino-v4-cache';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const c=await caches.open(CACHE);try{await c.addAll(CORE)}catch(e){}await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 if(req.mode==='navigate'||new URL(req.url).pathname.endsWith('.html')){event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});if(fresh.ok){const c=await caches.open(CACHE);c.put(req,fresh.clone());return fresh}}catch(e){}return (await caches.match(req))||caches.match('./index.html')||Response.error()})());return}
 event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const res=await fetch(req);if(res.ok){const c=await caches.open(CACHE);c.put(req,res.clone())}return res}catch(e){return cached||Response.error()}})())
});
