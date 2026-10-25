/* ================= UYGULAMA: ÇEVRİMDIŞI, ANA EKRANA EKLEME, HATIRLATMA =================
   Yalnızca gerçek sitede (https) çalışır; Claude önizlemesinde ve dosyadan açınca kapalıdır. */
var PWA={ok:(/^https:$/.test(location.protocol)||location.hostname==="localhost")&&!(window.claude||/claude|anthropic/.test(location.hostname))&&"serviceWorker" in navigator,
  reg:null,prompt:null,dl:null,installed:false};
PWA.installed=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
if(PWA.ok){
  navigator.serviceWorker.register("sw.js").then(r=>{PWA.reg=r;syncRemind()}).catch(()=>{});
  navigator.serviceWorker.addEventListener("message",e=>{const d=e.data||{};if(d.type==="dl"){PWA.dl=d;if(d.n>=d.total){try{localStorage.setItem(BRAND.id+"_offline","1")}catch(x){}toast("Çevrimdışı kullanım hazır")}if(lastHash==="ayarlar")renderAppStatus()}});
}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();PWA.prompt=e;if(lastHash==="ayarlar")renderSettings()});
window.addEventListener("appinstalled",()=>{PWA.installed=true;PWA.prompt=null;toast("Fluo ana ekrana eklendi")});
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);

/* ---------- Hatırlatma ---------- */
function remindOf(){return P.remind||{on:false,time:"19:00"}}
function syncRemind(){
  if(!PWA.ok||!navigator.serviceWorker.controller&&!PWA.reg)return;
  const m=remindOf(),t=dayKey(new Date());
  const data={on:!!m.on,time:m.time,due:Object.values(P.srs||{}).filter(s=>s&&s.b).map(s=>s.d),activeDay:(P.days||[]).includes(t)?new Date().toISOString().slice(0,10):"",lastSent:m.lastSent||""};
  const sw=navigator.serviceWorker.controller||(PWA.reg&&PWA.reg.active);if(sw)sw.postMessage({type:"remind",data});
}
async function setRemind(on){
  const m={...remindOf(),on};
  if(on){
    if(!("Notification" in window)){toast("Bu tarayıcı bildirimleri desteklemiyor");return}
    const perm=await Notification.requestPermission();
    if(perm!=="granted"){toast("Bildirim izni verilmedi");m.on=false}
    else if(PWA.reg&&"periodicSync" in PWA.reg){try{await PWA.reg.periodicSync.register("fluo-hatirlat",{minInterval:6*3600*1000})}catch(e){}}
  }
  P.remind=m;save();syncRemind();renderSettings();
}
// Sayfa açıkken (arka plandaki sekmede de) saati gelince bir kez hatırlat
setInterval(()=>{
  const m=remindOf();if(!m.on||!PWA.reg||typeof Notification==="undefined"||Notification.permission!=="granted")return;
  const now=new Date(),key=now.toISOString().slice(0,10),[hh,mm]=m.time.split(":").map(Number);
  if(now.getHours()*60+now.getMinutes()<hh*60+mm||m.lastSent===key||(P.days||[]).includes(dayKey(now)))return;
  const due=dueWords().length;
  PWA.reg.showNotification("Fluo",{body:due?"Bugün tekrar zamanı gelen "+due+" kelimen var. Birkaç dakikanı ayır!":"Bugün henüz çalışmadın. Kısa bir tekrar serini korur.",icon:"icons/icon-192.png",tag:"fluo-hatirlat",data:{url:due?"./#ogren-tekrar":"./#gunun"}});
  P.remind={...m,lastSent:key};save();syncRemind();
},60000);
document.addEventListener("visibilitychange",()=>{if(document.hidden)syncRemind()});

/* ---------- Ayarlar bölümü ---------- */
function offlineReady(){try{return localStorage.getItem(BRAND.id+"_offline")==="1"}catch(e){return false}}
function appSettingsHtml(){
  const row=(t,d,ctl,id)=>'<div class="srow"'+(id?' id="'+id+'"':'')+'><div><b>'+t+'</b><small>'+d+'</small></div>'+ctl+'</div>';
  const m=remindOf();
  let inst;
  if(PWA.installed)inst=row("Ana ekranda","Fluo uygulama olarak kurulu.",'<span class="pill">'+ic("check")+'Kurulu</span>');
  else if(PWA.prompt)inst=row("Ana ekrana ekle","Fluo'yu telefonuna ya da bilgisayarına uygulama gibi kur; tek dokunuşla açılır.",'<button class="primary" id="appInstall">Kur</button>');
  else if(isIOS())inst=row("Ana ekrana ekle","Safari'de alttaki Paylaş düğmesine dokun ve “Ana Ekrana Ekle”yi seç.",'<span class="pill">Safari</span>');
  else inst=row("Ana ekrana ekle","Tarayıcının menüsünde “Uygulamayı yükle” ya da “Ana ekrana ekle” seçeneğini kullan.",'<span class="pill">Menü</span>');
  if(!PWA.ok)return '<section class="sgroup"><h2>'+ic("monitor")+'Uygulama</h2>'+row("Çevrimdışı ve bildirimler","Bu özellikler Fluo sitesinde çalışır (umtiti719.github.io/fluoenglish).",'')+'</section>';
  return '<section class="sgroup"><h2>'+ic("monitor")+'Uygulama</h2>'+inst+
    row("Çevrimdışı kullanım","Tüm sesleri ve sözlüğü indir (yaklaşık 25 MB); sonra internet olmadan da çalışabilirsin.",'<span id="appDl"></span>',"appDlRow")+
    row("Tekrar hatırlatması","Seçtiğin saatte, o gün henüz çalışmadıysan bildirim gelir. En iyi Fluo ana ekrana eklenince çalışır.",
      '<div class="rem-ctl">'+(m.on?'<input type="time" id="remTime" value="'+esc(m.time)+'" aria-label="Hatırlatma saati">':'')+'<button class="switch" role="switch" id="remSw" aria-checked="'+!!m.on+'" aria-label="Tekrar hatırlatması"></button></div>')+
    '</section>';
}
function renderAppStatus(){
  const el=$("appDl");if(!el)return;
  if(PWA.dl&&PWA.dl.n<PWA.dl.total)el.innerHTML='<span class="pill"><i class="dotspin"></i>İndiriliyor '+PWA.dl.n+'/'+PWA.dl.total+'</span>';
  else if(offlineReady())el.innerHTML='<span class="pill">'+ic("check")+'Hazır</span>';
  else{el.innerHTML='<button class="ghost" id="appDlBtn">'+ic("download")+'İndir</button>';$("appDlBtn").onclick=()=>{const sw=navigator.serviceWorker.controller||(PWA.reg&&PWA.reg.active);if(!sw){toast("Biraz sonra yeniden dene");return}PWA.dl={n:0,total:6};renderAppStatus();sw.postMessage({type:"download"})}}
}
function bindAppSettings(){
  if($("appInstall"))$("appInstall").onclick=async()=>{const p=PWA.prompt;if(!p)return;p.prompt();try{await p.userChoice}catch(e){}PWA.prompt=null;renderSettings()};
  if($("remSw"))$("remSw").onclick=()=>setRemind(!remindOf().on);
  if($("remTime"))$("remTime").onchange=e=>{P.remind={...remindOf(),time:e.target.value||"19:00",lastSent:""};save();syncRemind();toast("Hatırlatma saati: "+P.remind.time)};
  renderAppStatus();
}
