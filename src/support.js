/* ================= YARDIM VE DESTEK =================
   Sık sorulanlar + "Bize yaz" formu. Mesajlar Supabase'deki "feedback" tablosuna kaydedilir
   (herkes yazabilir, kimse okuyamaz; okumak yalnızca Supabase panelinden). Kurulum: belgeler/destek.sql */
const FAQ=[
  ["İlerlemem nerede saklanıyor?","Giriş yapmadıysan ilerlemen yalnızca bu cihazdaki tarayıcıda saklanır. Giriş yaparsan hesabına kaydedilir ve telefonda, bilgisayarda aynı kalır. Tarayıcı verilerini silersen giriş yapmamış kullanıcıların ilerlemesi de silinir."],
  ["Fluo ücretli mi?","Hayır. Fluo'nun tüm bölümleri şu an ücretsiz."],
  ["Şifremi unuttum, ne yapmalıyım?","Giriş ekranında \"Şifremi unuttum\"a dokun ve e-posta adresini yaz. Gelen bağlantıyla yeni bir şifre belirleyebilirsin. İstersen şifresiz giriş bağlantısı da isteyebilirsin."],
  ["E-posta bağlantısı gelmedi.","Birkaç dakika bekle ve gereksiz (spam) klasörüne bak. Bağlantıyı, isteği gönderdiğin cihazda ve tarayıcıda açman gerekiyor. Hâlâ gelmediyse aşağıdan bize yaz."],
  ["Sesler çalmıyor ya da robot gibi geliyor.","Telefonunun sessiz modda olmadığından ve sesin açık olduğundan emin ol. Kelime ve cümlelerin çoğu doğal sesle kaydedildi; kaydı olmayanlar cihazının İngilizce sesiyle okunur. Ayarlar'dan konuşma hızını değiştirebilirsin."],
  ["Çeviri bazı kelimeleri bulamıyor.","Sitede çeviri şimdilik uygulamanın kendi sözlüğüyle çalışıyor. Her kelimeyi ve cümleyi çevirebilen yapay zekâ çevirisini yakında ekleyeceğiz."],
  ["Seviye testi nasıl çalışıyor?","Test kelime, dil bilgisi, okuma ve dinleme sorularıyla yaklaşık 18 sorudan oluşur ve cevaplarına göre zorlaşır ya da kolaylaşır. Sonuçta A1–C1 ölçeğinde seviyeni, becerilerini ve cevaplarını görürsün. İstediğin zaman yeniden çözebilirsin."],
  ["Hesabımı nasıl silerim?","Aşağıdaki formdan \"Soru\" seçip hesabını silmek istediğini yaz; hesabın ve tüm verilerin silinir."]
];
const FB_KINDS=[["sorun","Sorun bildir","alert"],["icerik","İçerik hatası","book"],["oneri","Öneri","bulb"],["soru","Soru","help"]];
const FB={kind:"sorun",ctx:null,busy:false,done:false,last:0,draft:""};

/* Uygulamanın herhangi bir yerinden: reportIssue("icerik",{yer:"Kelime kartı",oge:"apple"}) */
function reportIssue(kind,ctx){FB.kind=kind||"sorun";FB.ctx=ctx||null;FB.done=false;location.hash="destek"}

function fbContext(){
  return {sayfa:FB.ctx?.yer||lastPage||"",oge:FB.ctx?.oge||"",tarayici:navigator.userAgent.slice(0,180),
    ekran:innerWidth+"x"+innerHeight,dil:navigator.language,tema:document.documentElement.getAttribute("data-theme")||P.set?.theme||"",
    seviye:P.level?CEFR[P.level.idx].code:"",giris:signedIn()?"evet":"hayır",zaman:new Date().toISOString()};
}
let lastPage="";
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(h&&h!=="destek")lastPage=h});

function renderSupport(){
  const box=$("support");if(!box)return;
  const email=signedIn()?(AUTH.user.email||""):"";
  const faq='<section class="faq card"><h2 class="tres-h">'+ic("help")+'Sık sorulanlar</h2>'+
    FAQ.map(([q,a])=>'<details class="faq-i"><summary>'+esc(q)+ic("right")+'</summary><p>'+esc(a)+'</p></details>').join("")+'</section>';
  let form;
  if(FB.done){
    form='<section class="card fb fb-done"><span class="auth-big">'+ic("check")+'</span><h2>Mesajın bize ulaştı</h2>'+
      '<p class="lead">Teşekkürler! '+(FB.sentEmail?'Gerekirse <b>'+esc(FB.sentEmail)+'</b> adresinden sana döneceğiz.':'Her mesajı okuyoruz.')+'</p>'+
      '<button class="ghost" id="fbNew">Yeni mesaj yaz</button></section>';
  }else{
    const ctx=FB.ctx;
    form='<section class="card fb"><h2 class="tres-h">'+ic("mail")+'Bize yaz</h2>'+
      '<p class="note">Bir sorun mu var, bir kelimede ya da konuda hata mı gördün, aklında bir öneri mi var? Yaz, okuyalım.</p>'+
      (!AUTH.on?'<div class="auth-off">'+ic("alert")+'<span>Mesaj gönderme bu önizlemede çalışmaz; Fluo sitesinde çalışır.</span></div>':'')+
      '<form id="fbForm" novalidate>'+
        '<div class="fb-kinds" role="radiogroup" aria-label="Mesaj türü">'+FB_KINDS.map(([v,l,icn])=>'<button type="button" role="radio" data-kind="'+v+'" aria-checked="'+(FB.kind===v)+'">'+ic(icn)+l+'</button>').join("")+'</div>'+
        (ctx?'<div class="fb-ctx">'+ic("target")+'<span><small>Bildirilen yer</small>'+esc(ctx.yer)+(ctx.oge?' · <b>'+esc(ctx.oge)+'</b>':'')+'</span><button type="button" class="linkbtn" id="fbCtxX">Kaldır</button></div>':'')+
        '<label class="fld"><span>Mesajın</span><textarea id="fbMsg" rows="5" maxlength="3000" placeholder="'+(FB.kind==="icerik"?"Hangi kelime, cümle ya da açıklamada hata var? Doğrusu ne olmalı?":FB.kind==="sorun"?"Ne yaparken oldu? Ne bekliyordun, ne oldu?":FB.kind==="oneri"?"Fluo'da neyi görmek istersin?":"Sorunu yaz.")+'">'+esc(FB.draft)+'</textarea></label>'+
        '<label class="fld"><span>E-posta <small>(cevap istersen)</small></span><input type="email" id="fbMail" autocomplete="email" placeholder="ornek@eposta.com" value="'+esc(email)+'"></label>'+
        '<label class="fb-check"><input type="checkbox" id="fbTech" checked><span>Sorunu çözmemize yardımcı olacak teknik bilgileri ekle <small>(tarayıcı, ekran boyutu, bulunduğun sayfa)</small></span></label>'+
        '<p class="auth-msg err" id="fbErr" role="alert" hidden></p>'+
        '<button class="primary wide" type="submit"'+(FB.busy?" disabled":"")+'>'+(FB.busy?"Gönderiliyor…":"Gönder")+'</button>'+
      '</form></section>';
  }
  box.innerHTML='<div class="sup-grid">'+form+faq+'</div>';
  if(FB.done){$("fbNew").onclick=()=>{FB.done=false;FB.ctx=null;FB.draft="";renderSupport()};return}
  const msg=$("fbMsg");msg.oninput=()=>{FB.draft=msg.value};
  box.querySelectorAll("[data-kind]").forEach(b=>b.onclick=()=>{FB.kind=b.dataset.kind;FB.draft=msg.value;renderSupport()});
  if($("fbCtxX"))$("fbCtxX").onclick=()=>{FB.ctx=null;FB.draft=msg.value;renderSupport()};
  $("fbForm").onsubmit=e=>{e.preventDefault();sendFeedback()};
}
async function sendFeedback(){
  const msg=$("fbMsg").value.trim(),mail=$("fbMail").value.trim(),err=$("fbErr");
  const fail=s=>{err.hidden=false;err.innerHTML=ic("alert")+'<span>'+esc(s)+'</span>'};
  if(msg.length<5)return fail("Mesajın biraz kısa; ne olduğunu birkaç kelimeyle anlatır mısın?");
  if(mail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))return fail("E-posta adresi geçerli görünmüyor. Cevap istemiyorsan boş bırakabilirsin.");
  if(!AUTH.on||!AUTH.sb)return fail("Mesaj gönderme bu önizlemede çalışmaz. Fluo sitesinden dene.");
  if(Date.now()-FB.last<30000)return fail("Az önce bir mesaj gönderdin. Birkaç saniye sonra yeniden dene.");
  FB.busy=true;FB.draft=msg;renderSupport();
  const row={kind:FB.kind,message:msg,email:mail||null,context:$("fbTech")?.checked===false?{oge:FB.ctx?.oge||"",sayfa:FB.ctx?.yer||""}:fbContext()};
  try{
    const {error}=await AUTH.sb.from("feedback").insert(row);
    if(error)throw error;
    FB.busy=false;FB.done=true;FB.last=Date.now();FB.sentEmail=mail;FB.draft="";FB.ctx=null;renderSupport();window.scrollTo({top:0,behavior:"smooth"});
  }catch(e){FB.busy=false;renderSupport();$("fbMsg").value=msg;
    const m=String(e?.message||e);
    const t=/failed to fetch|network/i.test(m)?"Bağlantı kurulamadı. İnternetini kontrol edip yeniden dene."
      :/relation .* does not exist|could not find the table|permission denied|42501|PGRST205/i.test(m)?"Destek kutusu henüz kurulmadı. Kısa süre içinde açılacak."
      :"Mesaj gönderilemedi: "+m;
    const er=$("fbErr");er.hidden=false;er.innerHTML=ic("alert")+'<span>'+esc(t)+'</span>'}
}
