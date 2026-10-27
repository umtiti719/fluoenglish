/* Fluo çevrimdışı çalışma ve hatırlatma (service worker). Sürüm build.py tarafından yazılır. */
const VERSION="4a4cfceb97",CORE="fluo-core-"+VERSION,RUN="fluo-run",META="fluo-meta";
const CORE_FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","vendor/supabase.js"];
const BIG={"audio-w.js": "10db78333a", "audio-s.js": "668732a5d3", "audio-t.js": "41a3a5d099", "audio-r.js": "0926ecf90b", "audio-d.js": "5b380a556e", "audio-q1.js": "9b9cd2d246", "audio-q2.js": "09aa01dc7f", "audio-q3.js": "bd908dc342", "audio-q4.js": "70f4f05a74", "sozluk.js": "128d0b87ef"},BIG_FILES=Object.keys(BIG); /* dosya → içerik özeti: yalnızca değişen dosya yeniden indirilir */
self.addEventListener("install",e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(CORE_FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith("fluo-core-")&&k!==CORE)await caches.delete(k);
  // Büyük dosyalar sürüm değişince yenilensin
  const run=await caches.open(RUN);for(const f of BIG_FILES){const r=await run.match(f);if(r&&r.headers.get("x-fluo-v")!==BIG[f])await run.delete(f)}
  await self.clients.claim();
})())});
async function putRun(req,res){if(!res||!res.ok)return;const h=new Headers(res.headers);const f=new URL(typeof req==="string"?req:req.url,location.href).pathname.split("/").pop();h.set("x-fluo-v",BIG[f]||VERSION);
  const body=await res.clone().blob();await (await caches.open(RUN)).put(req,new Response(body,{status:res.status,headers:h}))}
self.addEventListener("fetch",e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=="GET")return;
  if(url.origin!==location.origin){
    if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{caches.open(RUN).then(c=>c.put(req,res.clone()));return res})));
    return;
  }
  if(req.mode==="navigate"){ // sayfa: önce ağ, yoksa kayıtlı kopya
    e.respondWith(fetch(req).then(res=>{caches.open(CORE).then(c=>c.put("index.html",res.clone()));return res}).catch(()=>caches.match("index.html",{ignoreSearch:true})));
    return;
  }
  e.respondWith((async()=>{
    const hit=await caches.match(req,{ignoreSearch:true});
    if(hit)return hit;
    const res=await fetch(req);putRun(req,res.clone());return res;
  })());
});
/* Sayfadan gelen istekler: tümünü indir · hatırlatma ayarı */
self.addEventListener("message",e=>{
  const d=e.data||{};
  if(d.type==="download")e.waitUntil((async()=>{
    let n=0;for(const f of BIG_FILES){try{const r=await caches.open(RUN).then(c=>c.match(f));if(!r){const res=await fetch(f,{cache:"no-cache"});await putRun(f,res)}}catch(err){}
      n++;for(const c of await self.clients.matchAll())c.postMessage({type:"dl",n,total:BIG_FILES.length})}
  })());
  if(d.type==="remind")e.waitUntil(caches.open(META).then(c=>c.put("remind",new Response(JSON.stringify(d.data)))));
});
async function checkRemind(){
  const c=await caches.open(META),r=await c.match("remind");if(!r)return;
  const m=await r.json();if(!m.on)return;
  const now=new Date(),key=now.toISOString().slice(0,10),[hh,mm]=m.time.split(":").map(Number);
  if(now.getHours()*60+now.getMinutes()<hh*60+mm||m.lastSent===key||m.activeDay===key)return;
  const day=Math.floor((Date.now()-now.getTimezoneOffset()*6e4)/864e5),due=(m.due||[]).filter(d=>d<=day).length;
  await self.registration.showNotification("Fluo",{body:due?"Bugün tekrar zamanı gelen "+due+" kelimen var. Birkaç dakikanı ayır!":"Bugün henüz çalışmadın. Kısa bir tekrar serini korur.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"fluo-hatirlat",data:{url:due?"./#ogren-tekrar":"./#gunun"}});
  m.lastSent=key;await c.put("remind",new Response(JSON.stringify(m)));
}
self.addEventListener("periodicsync",e=>{if(e.tag==="fluo-hatirlat")e.waitUntil(checkRemind())});
self.addEventListener("notificationclick",e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(self.clients.matchAll({type:"window"}).then(cs=>{for(const c of cs){if("focus" in c){c.navigate(u);return c.focus()}}return self.clients.openWindow(u)}))});
