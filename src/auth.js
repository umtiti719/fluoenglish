/* ================= ÜYELİK VE EŞİTLEME (Supabase) =================
   Giriş yolları: Google, e-posta + şifre, e-postaya giriş bağlantısı (şifresiz).
   İlerleme (P) "progress" tablosunda kullanıcı başına tek satır olarak tutulur ve cihazlar arasında birleştirilir.
   Misafirken yapılan çalışma, ilk girişte hesaba eklenir. */
var SITE_URL=location.origin+location.pathname;
AUTH.on=AUTH.configured&&/^https?:$/.test(location.protocol)&&!(window.claude||/claude|anthropic/.test(location.hostname));

function firstName(){const u=AUTH.user;if(!u)return "";const m=u.user_metadata||{};
  const n=(m.full_name||m.name||"").trim();return n?n.split(/\s+/)[0]:(u.email||"").split("@")[0]}
function fullName(){const u=AUTH.user;if(!u)return "";const m=u.user_metadata||{};return (m.full_name||m.name||"").trim()||(u.email||"").split("@")[0]}
function avatarUrl(){const m=AUTH.user?.user_metadata||{};return m.avatar_url||m.picture||""}
function viaGoogle(){return (AUTH.user?.app_metadata?.providers||[AUTH.user?.app_metadata?.provider]).includes("google")}

function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}

/* ---------- Geliştirme kolaylığı: deneme girişi (FLUO_CONFIG.devLogin) ---------- */
const DEV_KEY=BRAND.id+"_devlogin";
const DEV_USER={id:"dev-deneme",dev:true,email:"deneme@fluo.dev",user_metadata:{full_name:"Deneme Kullanıcı"},app_metadata:{provider:"email",providers:["email"]}};
function devOn(){try{return FLUO_CONFIG.devLogin&&localStorage.getItem(DEV_KEY)==="1"}catch(e){return false}}
function devSignIn(){
  try{localStorage.setItem(DEV_KEY,"1")}catch(e){}
  AUTH.user=DEV_USER;AUTH.ready=true;AUTH.mode="login";AUTH.msg=null;
  renderAcctBtn();toast("Deneme hesabıyla giriş yapıldı");refreshUserViews();
}
document.addEventListener("click",e=>{
  if(!FLUO_CONFIG.devLogin||AUTH.user)return;
  const a=e.target.closest&&e.target.closest("#acctBtn");
  if(a){e.preventDefault();devSignIn();location.hash="hesap"}
},true);

async function initAuth(){
  renderAcctBtn();
  if(devOn()){AUTH.user=DEV_USER;AUTH.ready=true;renderAcctBtn();refreshUserViews();return}
  if(!AUTH.on){AUTH.ready=true;renderAcctBtn();return}
  try{
    if(!window.supabase)await loadScript("vendor/supabase.js");
    AUTH.sb=window.supabase.createClient(FLUO_CONFIG.supabaseUrl,FLUO_CONFIG.supabaseAnonKey,{
      auth:{flowType:"pkce",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storageKey:BRAND.id+"_auth"}});
  }catch(e){AUTH.on=false;AUTH.ready=true;renderAcctBtn();return}
  // Dönüş adresindeki hata (ör. süresi geçmiş bağlantı)
  const qs=new URLSearchParams(location.search),hs=new URLSearchParams(location.hash.slice(1));
  const urlErr=qs.get("error_description")||hs.get("error_description");
  AUTH.welcome=qs.has("code");
  AUTH.sb.auth.onAuthStateChange((ev,session)=>{
    // Supabase çağrıları bu geri çağrının dışında yapılmalı
    setTimeout(()=>onAuthEvent(ev,session),0);
  });
  if(urlErr){setTimeout(()=>{toast(trErr({message:urlErr}));},300);cleanUrl(true)}
}
function cleanUrl(dropHash){
  if(location.search||dropHash&&/access_token|error/.test(location.hash)){
    try{history.replaceState(null,"",location.pathname+(dropHash?"":location.hash))}catch(e){}
  }
}

async function onAuthEvent(ev,session){
  const before=AUTH.user?.id||null;
  AUTH.user=session?.user||null;AUTH.ready=true;
  if(ev==="PASSWORD_RECOVERY"){AUTH.mode="recover";AUTH.msg=null;cleanUrl();location.hash="hesap";if(lastHash==="hesap")renderAccount()}
  if(/SIGNED_IN|INITIAL_SESSION/.test(ev))cleanUrl();
  renderAcctBtn();
  if(AUTH.user&&AUTH.user.id!==before){
    if((ev==="SIGNED_IN"||AUTH.welcome)&&before===null&&AUTH.mode!=="recover"&&ev!=="PASSWORD_RECOVERY"){AUTH.welcome=false;
      toast("Hoş geldin"+(firstName()?", "+firstName():"")+"!");
      if(lastHash==="hesap"&&AUTH.mode!=="recover")AUTH.mode="login";
    }
    await pullProgress(true);
  }
  if(!AUTH.user&&before){/* başka sekmede çıkış yapıldı */}
  refreshUserViews();
}
function refreshUserViews(){
  // Sitede yapay zekâ çevirisi yalnızca giriş yapanlara (Claude önizlemesinde Claude'un kendi yeteneği kullanılır)
  if(AUTH.on)sampleFn=AUTH.user&&FLUO_CONFIG.aiOn?siteSample():null;
  if(lastHash==="cevir"&&typeof renderTrHint==="function")renderTrHint();
  renderStreak();
  if(lastHash==="ana")renderHome();
  else if(lastHash==="hesap")renderAccount();
  else if(lastHash==="ayarlar")renderSettings();
}

/* ---------- İlerlemeyi birleştirme ---------- */
var isObj=x=>x&&typeof x==="object"&&!Array.isArray(x);
function mergeP(a,b){
  a=a||{};b=b||{};
  const ta=a._t||0,tb=b._t||0,newer=ta>=tb?a:b,older=newer===a?b:a;
  // "Tüm ilerlemeyi sıfırla" diğer cihazdaki eski verilerle geri gelmesin
  if(newer._reset&&newer._reset>=(older._t||0))return JSON.parse(JSON.stringify(newer));
  const r={};
  const keys=new Set([...Object.keys(a),...Object.keys(b)]);
  const maxMap=(x={},y={})=>{const o={...x};for(const k in y){const v=y[k],u=o[k];o[k]=(typeof v==="number"&&typeof u==="number")?Math.max(u,v):(u??v)}return o};
  for(const k of keys){
    const x=a[k],y=b[k];
    if(x===undefined){r[k]=y;continue}
    if(y===undefined){r[k]=x;continue}
    switch(k){
      case "learned":case "best":case "seen":r[k]=maxMap(x,y);break;
      case "trans":r[k]=Math.max(+x||0,+y||0);break;
      case "days":r[k]=[...new Set([...x,...y])].sort().slice(-90);break;
      case "gram":{const o={...x};for(const id in y){const p=o[id],q=y[id];o[id]=p?{best:Math.max(p.best||0,q.best||0),total:Math.max(p.total||0,q.total||0),done:!!(p.done||q.done)}:q}r[k]=o;break}
      case "srs":{const o={...x};for(const w in y){const p=o[w],q=y[w];if(!p){o[w]=q;continue}
        const np=(p.ok||0)+(p.no||0),nq=(q.ok||0)+(q.no||0);o[w]=nq>np||(nq===np&&(q.d||0)>(p.d||0))?q:p}r[k]=o;break}
      case "listen":r[k]=(y.n||0)>(x.n||0)?y:x;break;
      case "level":r[k]=(y.date||0)>(x.date||0)?y:x;break;
      case "saved":{const del=maxMap(a._del||{},b._del||{}),o={...older.saved,...newer.saved};
        for(const w in del){if(!(newer.saved||{})[w])delete o[w]}r[k]=o;break}
      case "sents":{const del=maxMap(a._del||{},b._del||{}),o={...older.sents,...newer.sents};
        for(const w in o){const d=del["s:"+w];if(d&&d>(o[w][3]||0))delete o[w]}r[k]=o;break}
      case "exam":case "vexam":{const o={...x};for(const lv in y){const p=o[lv],q=y[lv];o[lv]=!p||(q.at||0)>(p.at||0)?{...q,best:Math.max(q.best||0,p?p.best||0:0)}:{...p,best:Math.max(p.best||0,q.best||0)}}r[k]=o;break}
      case "_del":r[k]=maxMap(x,y);break;
      case "hist":r[k]=newer.hist;break;
      case "_t":r[k]=Math.max(ta,tb);break;
      default:r[k]=isObj(newer[k])&&isObj(older[k])&&k!=="set"?{...older[k],...newer[k]}:newer[k];
    }
  }
  return r;
}
function replaceP(np){
  Object.keys(P).forEach(k=>delete P[k]);Object.assign(P,np);
  P.learned=P.learned||{};P.gram=P.gram||{};P.best=P.best||{};P.trans=P.trans||0;P.days=P.days||[];
  P.srs=P.srs||{};P.seen=P.seen||{};P.saved=P.saved||{};P.listen=P.listen||{n:0,ok:0};
  P.set=Object.assign({theme:"system",palette:"aurora",font:"normal",motion:false,rate:1,autoSpeak:false,quizTime:"normal"},P.set||{});
  store.set(BRAND.id+"_progress",P);
}
const stripLocal=p=>{const o={...p};delete o._uid;return o};

async function pullProgress(first){
  if(!AUTH.user||!AUTH.sb||AUTH.user.dev)return;
  const S=AUTH.sync;S.state="sync";renderSyncState();
  try{
    const {data,error}=await AUTH.sb.from("progress").select("data,updated_at").eq("user_id",AUTH.user.id).maybeSingle();
    if(error)throw error;
    S.pulledAt=Date.now();
    const remote=data?.data||null,mine=AUTH.user.id;
    let next;
    if(!remote)next={...P};
    else if(P._uid&&P._uid!==mine)next=remote;          // bu cihazdaki kayıt başka bir hesabın
    else next=mergeP(P,remote);
    next._uid=mine;
    const changedLocal=JSON.stringify(stripLocal(next))!==JSON.stringify(stripLocal(P));
    replaceP(next);
    if(changedLocal){applySettings();lastHash=null;route()}
    if(!remote||JSON.stringify(stripLocal(next))!==JSON.stringify(remote))await pushProgress();
    else{S.state="ok";S.at=Date.now();S.dirty=false}
  }catch(e){S.state=navigator.onLine?"err":"off"}
  renderSyncState();
}
async function pushProgress(){
  if(!AUTH.user||!AUTH.sb||AUTH.user.dev)return;
  const S=AUTH.sync;clearTimeout(S.timer);S.timer=null;S.state="sync";renderSyncState();
  try{
    const {error}=await AUTH.sb.from("progress").upsert({user_id:AUTH.user.id,data:stripLocal(P),updated_at:new Date().toISOString()});
    if(error)throw error;
    S.state="ok";S.at=Date.now();S.dirty=false;
  }catch(e){S.state=navigator.onLine?"err":"off";S.dirty=true}
  renderSyncState();
}
// app.js içindeki save() her kayıttan sonra bunu çağırır
function onSaved(){
  if(!AUTH.user||AUTH.user.dev)return;
  const S=AUTH.sync;S.dirty=true;clearTimeout(S.timer);S.timer=setTimeout(pushProgress,1500);
}
document.addEventListener("visibilitychange",()=>{
  if(!AUTH.user)return;
  if(document.hidden){if(AUTH.sync.dirty)pushProgress()}
  else if(Date.now()-AUTH.sync.pulledAt>30000&&!AUTH.sync.dirty)pullProgress();
});
window.addEventListener("online",()=>{if(AUTH.user&&AUTH.sync.dirty)pushProgress()});

/* ---------- Hata iletileri ---------- */
function trErr(e){
  const m=String(e?.message||e||"");
  if(/invalid login credentials/i.test(m))return "E-posta ya da şifre hatalı.";
  if(/email not confirmed/i.test(m))return "E-postanı henüz onaylamadın. Gelen kutundaki onay bağlantısına dokun.";
  if(/already registered|already been registered|user already exists/i.test(m))return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.";
  if(/password should be at least|weak password/i.test(m))return "Şifre çok zayıf. En az 8 karakter, harf ve rakam kullan.";
  if(/rate limit|only request this after|too many/i.test(m))return "Çok sık denendi. Biraz bekleyip yeniden dene.";
  if(/invalid email|unable to validate email|email address .* is invalid/i.test(m))return "Geçerli bir e-posta adresi yaz.";
  if(/expired|invalid.*(link|token|code)|otp/i.test(m))return "Bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir bağlantı iste.";
  if(/provider is not enabled|unsupported provider/i.test(m))return "Bu giriş yolu henüz açılmadı.";
  if(/signups not allowed/i.test(m))return "Şu an yeni kayıt alınmıyor.";
  if(/same.*password|different from the old/i.test(m))return "Yeni şifre eskisinden farklı olmalı.";
  if(/failed to fetch|network/i.test(m))return "Bağlantı kurulamadı. İnternetini kontrol et.";
  return "Bir sorun oldu: "+m;
}

/* ---------- Üst menüdeki hesap düğmesi ---------- */
function renderAcctBtn(){
  if(typeof renderStudyBtn==="function")renderStudyBtn();
  const el=$("acctBtn");if(!el)return;
  if(AUTH.user){
    const img=avatarUrl(),n=fullName();
    el.className="acct on";el.title=n;el.setAttribute("aria-label","Hesabım: "+n);
    el.innerHTML=img?'<img src="'+esc(img)+'" alt="" referrerpolicy="no-referrer">':'<span>'+esc((n[0]||"?").toLocaleUpperCase("tr"))+'</span>';
  }else{
    el.className="acct";el.title="Giriş yap";el.setAttribute("aria-label","Giriş yap");
    el.innerHTML=ic("user")+'<span class="acct-t">Giriş yap</span>';
  }
}

/* ---------- Hesap sayfası ---------- */
function renderSyncState(){
  const el=$("syncState");if(!el)return;const S=AUTH.sync;
  const t=S.at?new Date(S.at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}):"";
  el.className="syncst s-"+S.state;
  el.innerHTML=S.state==="sync"?'<i class="dotspin"></i>Eşitleniyor…'
    :S.state==="ok"?ic("check")+"Eşitlendi"+(t?" · "+t:"")
    :S.state==="off"?ic("alert")+"Çevrimdışı · bağlanınca eşitlenecek"
    :S.state==="err"?ic("alert")+"Eşitlenemedi · yeniden denenecek"
    :ic("check")+"Hazır";
}
function renderAccount(){
  const box=$("acct");if(!box)return;
  if(AUTH.on&&!AUTH.ready){box.innerHTML='<div class="auth"><div class="auth-card"><p class="auth-lead">Hesap bilgilerin yükleniyor…</p></div></div>';return}
  if(AUTH.user&&AUTH.mode!=="recover"){renderProfile(box);return}
  const m=AUTH.mode,msg=AUTH.msg;
  const logo='<span class="auth-mark" aria-hidden="true">'+$("logoMark").innerHTML.replace(/id="lg-tile"/,'id="lg-tile2"').replace(/url\(#lg-tile\)/,"url(#lg-tile2)")+'</span>';
  const off=!AUTH.on?'<div class="auth-off">'+ic("alert")+'<span>'+(AUTH.configured?"Üye girişi bu önizlemede çalışmaz; Fluo sitesinde çalışır.":"Üye girişi hazırlanıyor. Kurulum tamamlanınca buradan giriş yapabileceksin.")+'</span></div>':"";
  const msgH=msg?'<p class="auth-msg '+msg.t+'" role="'+(msg.t==="err"?"alert":"status")+'">'+ic(msg.t==="err"?"alert":"check")+'<span>'+esc(msg.s)+'</span></p>':"";
  const email='<label class="fld"><span>E-posta</span><input type="email" id="aEmail" autocomplete="email" inputmode="email" required placeholder="ornek@eposta.com" value="'+esc(AUTH.sentTo||"")+'"></label>';
  const pass=(id,lbl,ac)=>'<label class="fld"><span>'+lbl+'</span><div class="pw"><input type="password" id="'+id+'" autocomplete="'+ac+'" required minlength="8" placeholder="En az 8 karakter"><button type="button" class="pw-eye" data-for="'+id+'" aria-label="Şifreyi göster">'+ic("eye")+'</button></div></label>';
  let h='<div class="auth-card">'+logo;
  if(m==="sent"){
    const k=AUTH.sentKind;
    h+='<span class="auth-big">'+ic("mail")+'</span><h1>E-postanı kontrol et</h1>'+
      '<p class="auth-lead"><b>'+esc(AUTH.sentTo)+'</b> adresine '+(k==="signup"?"bir onay bağlantısı":k==="forgot"?"şifre yenileme bağlantısı":"bir giriş bağlantısı")+' gönderdik. Bağlantıya bu cihazda, bu tarayıcıda dokun.</p>'+
      '<p class="auth-note">Birkaç dakika içinde gelmezse gereksiz (spam) klasörüne bak.</p>'+
      '<button class="ghost wide" data-mode="login">'+ic("left")+'Girişe dön</button>';
  }else if(m==="recover"){
    h+='<h1>Yeni şifreni belirle</h1><p class="auth-lead">Hesabın için yeni bir şifre seç.</p>'+off+msgH+
      '<form id="aForm" novalidate>'+pass("aPass","Yeni şifre","new-password")+
      '<button class="primary wide" type="submit"'+(AUTH.busy?" disabled":"")+'>Şifreyi kaydet</button></form>';
  }else if(m==="forgot"||m==="magic"){
    h+='<h1>'+(m==="forgot"?"Şifreni mi unuttun?":"Şifresiz giriş")+'</h1><p class="auth-lead">'+(m==="forgot"?"E-posta adresini yaz, şifreni yenilemen için bir bağlantı gönderelim.":"E-posta adresini yaz, tek dokunuşla giriş yapman için bir bağlantı gönderelim. Hesabın yoksa otomatik oluşturulur.")+'</p>'+off+msgH+
      '<form id="aForm" novalidate>'+email+'<button class="primary wide" type="submit"'+(AUTH.busy?" disabled":"")+'>'+(AUTH.busy?"Gönderiliyor…":"Bağlantıyı gönder")+'</button></form>'+
      '<button class="linkbtn auth-back" data-mode="login">'+ic("left")+'Girişe dön</button>';
  }else{
    const su=m==="signup";
    h+='<h1>'+(su?"Hesap oluştur":"Fluo'ya giriş yap")+'</h1><p class="auth-lead">İlerlemen, Defterin ve seviyen tüm cihazlarında seninle olsun.</p>'+off+
      '<button class="gbtn wide" id="aGoogle"'+(AUTH.busy?" disabled":"")+'>'+ic("globe")+'Google ile devam et</button>'+
      '<div class="or"><span>ya da e-posta ile</span></div>'+
      '<div class="auth-tabs" role="tablist"><button role="tab" data-mode="login" aria-selected="'+!su+'">Giriş yap</button><button role="tab" data-mode="signup" aria-selected="'+su+'">Kayıt ol</button></div>'+msgH+
      '<form id="aForm" novalidate>'+(su?'<label class="fld"><span>Adın</span><input type="text" id="aName" autocomplete="given-name" placeholder="Adın" maxlength="40"></label>':'')+email+pass("aPass","Şifre",su?"new-password":"current-password")+
      (su?'':'<button type="button" class="linkbtn auth-forgot" data-mode="forgot">Şifremi unuttum</button>')+
      '<button class="primary wide" type="submit"'+(AUTH.busy?" disabled":"")+'>'+(AUTH.busy?"Bekle…":su?"Hesap oluştur":"Giriş yap")+'</button></form>'+
      '<button class="ghost wide" data-mode="magic">'+ic("mail")+'E-postama giriş bağlantısı gönder</button>';
  }
  h+='</div><p class="auth-foot">Giriş yapmadan da kullanmaya devam edebilirsin; ilerlemen bu cihazda saklanır.<br>Giriş yapınca bu cihazdaki ilerlemen hesabına eklenir.</p>';
  box.innerHTML='<div class="auth">'+h+'</div>';
  box.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{const em=$("aEmail")?.value.trim();if(em)AUTH.sentTo=em;AUTH.mode=b.dataset.mode;AUTH.msg=null;renderAccount();setTimeout(()=>{const f=box.querySelector("input");if(f&&!matchMedia("(pointer:coarse)").matches)f.focus()},30)});
  box.querySelectorAll(".pw-eye").forEach(b=>b.onclick=()=>{const i=$(b.dataset.for),show=i.type==="password";i.type=show?"text":"password";b.setAttribute("aria-label",show?"Şifreyi gizle":"Şifreyi göster");b.classList.toggle("on",show)});
  if($("aGoogle"))$("aGoogle").onclick=googleSignIn;
  if($("aForm"))$("aForm").onsubmit=e=>{e.preventDefault();submitAuth()};
}
function setMsg(t,s){AUTH.msg=s?{t,s}:null;AUTH.busy=false;renderAccount()}
function needOn(){if(AUTH.on)return true;setMsg("err",AUTH.configured?"Üye girişi bu önizlemede çalışmaz. Fluo sitesinden dene.":"Üye girişi henüz kurulmadı.");return false}
async function googleSignIn(){
  if(!needOn())return;AUTH.busy=true;renderAccount();
  const {error}=await AUTH.sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:SITE_URL}});
  if(error)setMsg("err",trErr(error));
}
async function submitAuth(){
  const m=AUTH.mode,email=$("aEmail")?.value.trim(),pw=$("aPass")?.value||"",name=$("aName")?.value.trim();
  if(email!==undefined){AUTH.sentTo=email;if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setMsg("err","Geçerli bir e-posta adresi yaz.")}
  if((m==="login"||m==="signup"||m==="recover")&&pw.length<8)return setMsg("err","Şifre en az 8 karakter olmalı.");
  if((m==="signup"||m==="recover")&&!(/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(pw)&&/\d/.test(pw)))return setMsg("err","Şifrede en az bir harf ve bir rakam olsun.");
  if(!needOn())return;
  AUTH.busy=true;AUTH.msg=null;renderAccount();
  const A=AUTH.sb.auth;let r;
  try{
    if(m==="login"){r=await A.signInWithPassword({email,password:pw});if(r.error)throw r.error;AUTH.busy=false;AUTH.msg=null;return}
    if(m==="signup"){
      r=await A.signUp({email,password:pw,options:{data:name?{full_name:name}:{},emailRedirectTo:SITE_URL}});if(r.error)throw r.error;
      AUTH.busy=false;
      if(!r.data.session){
        // Supabase, var olan bir e-posta için de hata vermeden döner; kimlik listesi boşsa hesap zaten vardır
        if(r.data.user&&Array.isArray(r.data.user.identities)&&r.data.user.identities.length===0)return setMsg("err",trErr("already registered"));
        AUTH.sentKind="signup";AUTH.mode="sent";renderAccount()}
      return}
    if(m==="magic"){r=await A.signInWithOtp({email,options:{emailRedirectTo:SITE_URL,shouldCreateUser:true}});if(r.error)throw r.error;AUTH.busy=false;AUTH.sentKind="magic";AUTH.mode="sent";renderAccount();return}
    if(m==="forgot"){r=await A.resetPasswordForEmail(email,{redirectTo:SITE_URL});if(r.error)throw r.error;AUTH.busy=false;AUTH.sentKind="forgot";AUTH.mode="sent";renderAccount();return}
    if(m==="recover"){r=await A.updateUser({password:pw});if(r.error)throw r.error;AUTH.mode="login";AUTH.busy=false;AUTH.msg=null;toast("Şifren güncellendi");renderAccount();return}
  }catch(e){setMsg("err",trErr(e))}
}
function renderProfile(box){
  const u=AUTH.user,img=avatarUrl(),n=fullName(),lv=P.level?CEFR[P.level.idx].code:"–";
  box.innerHTML='<div class="prof">'+
    '<div class="prof-card aurora">'+
      '<span class="prof-av">'+(img?'<img src="'+esc(img)+'" alt="" referrerpolicy="no-referrer">':esc((n[0]||"?").toLocaleUpperCase("tr")))+'</span>'+
      '<h1>'+esc(n)+'</h1><p class="prof-mail">'+esc(u.email||"")+'</p>'+
      '<span class="prof-via">'+(viaGoogle()?ic("globe")+"Google hesabıyla":ic("mail")+"E-posta ile")+' bağlı</span>'+
      '<span class="syncst" id="syncState"></span>'+
    '</div>'+
    '<div class="prof-stats">'+[[Object.keys(P.learned).length,"öğrenilen kelime"],[Object.keys(P.saved).length,"Defterim"],[lv,"seviye"],[streakCount(),"günlük seri"]].map(([b,s])=>'<div class="stat"><b>'+b+'</b><span>'+s+'</span></div>').join("")+'</div>'+
    '<section class="sgroup"><h2>'+ic("user")+'Hesap</h2>'+
      '<div class="srow"><div><b>Eşitleme</b><small>İlerlemen, Defterin, seviyen ve ayarların bu hesapla tüm cihazlarında aynı kalır.</small></div><button class="ghost" id="pSync">'+ic("refresh")+'Şimdi eşitle</button></div>'+
      (viaGoogle()?'':'<div class="srow"><div><b>Şifre</b><small>Hesabının şifresini değiştir.</small></div><button class="ghost" id="pPass">Değiştir</button></div>')+
      '<div class="srow"><div><b>Çıkış yap</b><small>Bu cihazdaki ilerleme silinir; hesabında saklı kalır.</small></div><button class="danger" id="pOut">Çıkış yap</button></div>'+
      '<div class="srow"><div><b>Yardım ve destek</b><small>Sık sorulanlar, sorun bildirme ve hesabını silme isteği.</small></div><a class="ghost" href="#destek">'+ic("help")+'Destek</a></div>'+
    '</section></div>';
  renderSyncState();
  $("pSync").onclick=()=>pullProgress();
  if($("pPass"))$("pPass").onclick=()=>{AUTH.mode="recover";AUTH.msg=null;renderAccount()};
  $("pOut").onclick=signOut;
}
async function signOut(){
  const b=$("pOut");if(b)b.disabled=true;
  if(AUTH.user?.dev){try{localStorage.removeItem(DEV_KEY)}catch(e){}AUTH.user=null;toast("Çıkış yapıldı");setTimeout(()=>{location.hash="ana";location.reload()},500);return}
  if(AUTH.sync.dirty)await pushProgress();
  try{await AUTH.sb.auth.signOut()}catch(e){}
  try{const keep=P.set;localStorage.setItem(BRAND.id+"_progress",JSON.stringify({set:keep}));localStorage.removeItem(BRAND.id+"_translations")}catch(e){}
  toast("Çıkış yapıldı");setTimeout(()=>{location.hash="ana";location.reload()},500);
}
initAuth();

/* ---------- Sitede yapay zekâ çevirisi ----------
   Supabase "ceviri" fonksiyonu Claude'a sorar; anahtar sunucuda gizli kalır. Kişi başı günde 100 istek. */
const AI={kalan:null,limitDay:"",warnDay:""};
async function callAI(prompt,wantJson){
  const {data}=await AUTH.sb.auth.getSession();const tok=data?.session?.access_token;
  if(!tok)throw new Error("giris");
  const r=await fetch(FLUO_CONFIG.supabaseUrl+"/functions/v1/ceviri",{method:"POST",
    headers:{"Content-Type":"application/json",apikey:FLUO_CONFIG.supabaseAnonKey,Authorization:"Bearer "+tok},
    body:JSON.stringify({prompt,json:!!wantJson})});
  const d=await r.json().catch(()=>({}));
  const day=new Date().toDateString();
  if(r.status===429){AI.kalan=0;if(AI.limitDay!==day){AI.limitDay=day;toast("Bugünkü "+(d.limit||100)+" yapay zekâ çevirisi hakkın doldu; yarın yenilenir. Sözlük çevirisi çalışmaya devam ediyor.")}throw new Error("limit")}
  if(!r.ok||typeof d.text!=="string")throw new Error(d.error||("ai "+r.status));
  AI.kalan=d.kalan;
  if(d.kalan<=10&&AI.warnDay!==day){AI.warnDay=day;toast("Bugün "+d.kalan+" yapay zekâ çevirisi hakkın kaldı")}
  return d.text;
}
function parseJSONText(t){
  t=String(t||"").replace(/^\s*```(?:json)?/i,"").replace(/```\s*$/,"").trim();
  const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0||b<a)throw new Error("json");
  return JSON.parse(t.slice(a,b+1));
}
function siteSample(){
  const f=async(prompt)=>({text:await callAI(prompt,false)});
  f.json=async(prompt)=>parseJSONText(await callAI(prompt,true));
  f.remote=true;return f;
}

