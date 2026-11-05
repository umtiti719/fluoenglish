/* Fluo çevrimdışı çalışma ve hatırlatma (service worker). Sürüm build.py tarafından yazılır. */
const VERSION="6c59013cf5",CORE="fluo-core-"+VERSION,RUN="fluo-run",META="fluo-meta";
const CORE_FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","vendor/supabase.js","fonts/onest-latin-wght-normal.woff2","fonts/onest-latin-ext-wght-normal.woff2"];
const BIG={"ses-js/w-0.js": "85a589158a", "ses-js/w-1.js": "b51a86faa8", "ses-js/w-2.js": "5b4431179f", "ses-js/w-3.js": "4d72859aef", "ses-js/w-4.js": "4210365dbc", "ses-js/w-5.js": "b9979c7b45", "ses-js/w-6.js": "bb18bacdd9", "ses-js/w-7.js": "d1b25198c7", "ses-js/w-8.js": "82c116d746", "ses-js/w-9.js": "f511e45dfc", "ses-js/w-10.js": "b6707ae60a", "ses-js/w-11.js": "f734e8e95d", "ses-js/w-12.js": "d122add744", "ses-js/w-13.js": "83a32a0c9e", "ses-js/s-0.js": "f501899c80", "ses-js/s-1.js": "2a994e7a6f", "ses-js/s-2.js": "080983c727", "ses-js/s-3.js": "2c57a57f0e", "ses-js/s-4.js": "be78a5ede7", "ses-js/s-5.js": "f9593ae0fd", "ses-js/s-6.js": "cb63402102", "ses-js/s-7.js": "c23b0ec89e", "ses-js/s-8.js": "9a17bda400", "ses-js/s-9.js": "763c500f0d", "ses-js/s-10.js": "50ec88584e", "ses-js/s-11.js": "f938dc4017", "ses-js/s-12.js": "c44e562820", "ses-js/s-13.js": "da3873e1f9", "ses-js/s-14.js": "25bb653884", "ses-js/s-15.js": "e9849128c6", "ses-js/s-16.js": "e80a83e735", "ses-js/s-17.js": "31e643f225", "ses-js/s-18.js": "ecd9ec7a79", "ses-js/s-19.js": "c3433b5c51", "ses-js/s-20.js": "e83bd20371", "ses-js/s-21.js": "bcf9792c8d", "ses-js/s-22.js": "47a420ee91", "ses-js/s-23.js": "b6067eb4ce", "ses-js/s-24.js": "318b5b6437", "ses-js/s-25.js": "80e5a3c26b", "ses-js/t-0.js": "493689a665", "ses-js/t-1.js": "8387adb564", "ses-js/t-2.js": "954e66d7e1", "ses-js/t-3.js": "f49f8b6d42", "ses-js/r-0.js": "5d98258b43", "ses-js/r-1.js": "f8d0566f1a", "ses-js/r-2.js": "d24d0410e5", "ses-js/r-3.js": "0be06a61f8", "ses-js/r-4.js": "313bcdf46f", "ses-js/r-5.js": "431797b303", "ses-js/r-6.js": "e07765681a", "ses-js/r-7.js": "2e5f360a9a", "ses-js/r-8.js": "1d43791503", "ses-js/r-9.js": "0f0eff5c25", "ses-js/r-10.js": "d3290f0c67", "ses-js/r-11.js": "a82e3f0a9a", "ses-js/r-12.js": "b51aa12df6", "ses-js/r-13.js": "1c61fe6414", "ses-js/r-14.js": "c0c64ee7d4", "ses-js/r-15.js": "c6c6617c9b", "ses-js/r-16.js": "506df71e3c", "ses-js/r-17.js": "e92948a3f6", "ses-js/r-18.js": "6ca07b7b12", "ses-js/r-19.js": "15dd9d8764", "ses-js/r-20.js": "4f98a9f106", "ses-js/r-21.js": "e369a07093", "ses-js/r-22.js": "fbe6cc5257", "ses-js/d-0.js": "1e8811fdfc", "ses-js/d-1.js": "8d3cde35a0", "ses-js/d-2.js": "ab850237a3", "ses-js/d-3.js": "d4f7c69735", "ses-js/d-4.js": "334eb8ad9b", "ses-js/q1-0.js": "72e9951648", "ses-js/q1-1.js": "e4e72394f3", "ses-js/q1-2.js": "0edd72fd55", "ses-js/q1-3.js": "2f0b379cbd", "ses-js/q1-4.js": "d5599906a8", "ses-js/q1-5.js": "217ac3d4e1", "ses-js/q1-6.js": "58b7ab5483", "ses-js/q1-7.js": "0e82724bdf", "ses-js/q1-8.js": "450d26c242", "ses-js/q1-9.js": "49d99c3f5a", "ses-js/q1-10.js": "c69502ffa0", "ses-js/q1-11.js": "0ae07320f4", "ses-js/q1-12.js": "63530070d6", "ses-js/q1-13.js": "b1c141db06", "ses-js/q2-0.js": "61c75e298b", "ses-js/q2-1.js": "27257ef457", "ses-js/q2-2.js": "b2931f093d", "ses-js/q2-3.js": "5ba299da51", "ses-js/q2-4.js": "5b707418b7", "ses-js/q2-5.js": "6f1a382e23", "ses-js/q2-6.js": "07d7aa700b", "ses-js/q2-7.js": "0dcd9568d4", "ses-js/q2-8.js": "72dbded8de", "ses-js/q2-9.js": "e5d138411e", "ses-js/q2-10.js": "cdd8eafb9e", "ses-js/q2-11.js": "1482d41a78", "ses-js/q2-12.js": "c119e44647", "ses-js/q2-13.js": "6e8b34d19a", "ses-js/q2-14.js": "8ee08de0c7", "ses-js/q2-15.js": "efc60046ac", "ses-js/q2-16.js": "35129ae478", "ses-js/q2-17.js": "298e769957", "ses-js/q3-0.js": "bf5b1146e0", "ses-js/q3-1.js": "0263e640f1", "ses-js/q3-2.js": "69fffcc9ed", "ses-js/q3-3.js": "e589f742e7", "ses-js/q3-4.js": "c78430f12e", "ses-js/q3-5.js": "7d25775f39", "ses-js/q3-6.js": "558740fcfd", "ses-js/q3-7.js": "91d0ec05f8", "ses-js/q3-8.js": "2a28589bf0", "ses-js/q3-9.js": "6617daf9fe", "ses-js/q3-10.js": "1d55f89791", "ses-js/q3-11.js": "118743cf3a", "ses-js/q3-12.js": "d0f6e3ed14", "ses-js/q3-13.js": "8bbe9fa20b", "ses-js/q3-14.js": "3d270f8501", "ses-js/q3-15.js": "f2ea249907", "ses-js/q3-16.js": "53dee85386", "ses-js/q3-17.js": "1f238abd8c", "ses-js/q3-18.js": "d53d85afad", "ses-js/q4-0.js": "1b4c2aa45b", "ses-js/q4-1.js": "c360a3265b", "ses-js/q4-2.js": "823aedb801", "ses-js/q4-3.js": "780ddfb95d", "ses-js/q4-4.js": "6f644fe7c9", "ses-js/q4-5.js": "9a992935fb", "ses-js/q4-6.js": "18163bedc9", "ses-js/q4-7.js": "0a13321e15", "ses-js/q4-8.js": "635686d917", "ses-js/q4-9.js": "df06f1cbf2", "ses-js/q4-10.js": "2bf97f9938", "ses-js/q4-11.js": "e6b87e7122", "ses-js/q4-12.js": "1a1e7a4c8f", "ses-js/q4-13.js": "448192fc1b", "ses-js/q4-14.js": "04fd4a0db5", "ses-js/q4-15.js": "f96f1acd44", "ses-js/q4-16.js": "3e09d3ed27", "ses-js/q4-17.js": "d756ca6ba6", "ses-js/q4-18.js": "64f1a3addc", "ses-js/x2-0.js": "663679dfe6", "ses-js/x2-1.js": "a8291700a8", "ses-js/x2-2.js": "5a1aa7ef81", "ses-js/x2-3.js": "4be93f09b4", "ses-js/x2-4.js": "458f246590", "ses-js/x2-5.js": "d1856a6012", "ses-js/x2-6.js": "19735d39e5", "ses-js/x2-7.js": "bfee3f7bb7", "ses-js/x2-8.js": "dfa9eaad0f", "ses-js/x2-9.js": "e8e0244ebe", "ses-js/x2-10.js": "76e182d889", "ses-js/x2-11.js": "cd4209a23c", "ses-js/x2-12.js": "511c3e7e19", "ses-js/x2-13.js": "f69c848560", "ses-js/x2-14.js": "919729e019", "ses-js/x2-15.js": "f4efe490ef", "ses-js/x2-16.js": "324f4323df", "ses-js/x2-17.js": "83595b6f6f", "ses-js/x2-18.js": "5e1f798797", "ses-js/x2-19.js": "c7d2eb6337", "ses-js/x2-20.js": "a256fa415d", "ses-js/x2-21.js": "cfba093ba5", "ses-js/x2-22.js": "68da34800a", "ses-js/x2-23.js": "920454a169", "ses-js/x2-24.js": "3d9901a60c", "ses-js/x2-25.js": "ed0ac83784", "ses-js/x2-26.js": "253a27bdff", "ses-js/x2-27.js": "4fbab454a1", "ses-js/x2-28.js": "6bf3dbc508", "ses-js/x2-29.js": "49879f6204", "ses-js/x2-30.js": "7413d93523", "ses-js/x2-31.js": "cc03c8a750", "ses-js/x2-32.js": "d5074806b5", "ses-js/x2-33.js": "daf94981b9", "ses-js/x2-34.js": "a6699ea193", "ses-js/x1-0.js": "16636aa289", "ses-js/x1-1.js": "85a04c7a90", "ses-js/x1-2.js": "f981fda880", "ses-js/x1-3.js": "3ceae7b0b1", "ses-js/x1-4.js": "944cae5e8e", "ses-js/x1-5.js": "f1df904db0", "ses-js/x1-6.js": "314cfaf715", "ses-js/x1-7.js": "5e0dca1199", "ses-js/x1-8.js": "7667926bdd", "ses-js/c2-0.js": "b7a16de82a", "ses-js/c2-1.js": "90a149b26a", "ses-js/c2-2.js": "8054a65ccd", "ses-js/c2-3.js": "a9eabe7773", "ses-js/c2-4.js": "0dfe000cb8", "ses-js/c2-5.js": "d5630757fe", "ses-js/c2-6.js": "09b47505e6", "ses-js/c2-7.js": "2bf3321b78", "ses-js/c2-8.js": "68816d4f6d", "sozluk.js": "128d0b87ef"},BIG_FILES=Object.keys(BIG); /* dosya → içerik özeti: yalnızca değişen dosya yeniden indirilir */
self.addEventListener("install",e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(CORE_FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith("fluo-core-")&&k!==CORE)await caches.delete(k);
  // Büyük dosyalar sürüm değişince yenilensin
  const run=await caches.open(RUN);
  for(const req of await run.keys()){const f=relPath(req.url);
    if(/^(audio-|ses-js\/)/.test(f)&&!BIG[f])await run.delete(req); /* eski ses paketleri */
    else if(BIG[f]){const r=await run.match(req);if(r&&r.headers.get("x-fluo-v")!==BIG[f])await run.delete(req)}}
  await self.clients.claim();
})())});
const relPath=u=>{const p=new URL(u,location.href).pathname,b=new URL(self.registration.scope).pathname;return p.startsWith(b)?p.slice(b.length):p.split("/").pop()};
async function putRun(req,res){if(!res||!res.ok)return;const h=new Headers(res.headers);const f=relPath(typeof req==="string"?req:req.url);h.set("x-fluo-v",BIG[f]||VERSION);
  const body=await res.clone().blob();await (await caches.open(RUN)).put(req,new Response(body,{status:res.status,headers:h}))}
self.addEventListener("fetch",e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=="GET")return;
  if(url.origin!==location.origin){
    if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{caches.open(RUN).then(c=>c.put(req,res.clone()));return res})));
    return;
  }
  if(req.mode==="navigate"){ // sayfa: önce ağ, yoksa kayıtlı kopya
    const app=/^(index\.html)?$/.test(relPath(req.url)); /* konu sayfaları (gramer/, kelime/, okuma/) uygulamanın kopyasını ezmesin */
    e.respondWith(fetch(req).then(res=>{if(app&&res.ok)caches.open(CORE).then(c=>c.put("index.html",res.clone()));return res}).catch(()=>app?caches.match("index.html",{ignoreSearch:true}):caches.match(req)));
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
