/* ================= TELAFFUZ =================
   Dinle → mikrofona söyle → tarayıcının konuşma tanıması ne duyduğunu yazar → kelime kelime karşılaştırılır.
   Chrome, Edge ve Safari destekler (Firefox desteklemez). Sonuçlar: P.speakStat={n,ok}; görülme: P.seen["p:"+metin]. */
var PZ={lv:"kolay",mode:"kelime",cur:null,state:"idle",heard:"",score:null,rec:null,tries:0,err:""};
function prSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function prPool(){return PZ.mode==="kelime"?LWORDS.filter(w=>w.lv===PZ.lv&&/^[a-z' -]+$/i.test(w.en)):LSENT.filter(s=>s.lv===PZ.lv&&!/^Metnin tamamı/.test(s.tr)&&buildTokens(s.en).length<=(PZ.lv==="kolay"?8:11))}
function newSpeakItem(){
  const c=pickFresh(prPool(),x=>"p:"+plain(x.en),6);PZ.cur=c[Math.floor(Math.random()*Math.min(3,c.length))];if(PZ.cur)touch("p:"+plain(PZ.cur.en));
  PZ.state="idle";PZ.heard="";PZ.score=null;PZ.tries=0;PZ.err="";PZ.counted=false;renderSpeak();
}
function openSpeak(){renderSpeakStat();renderSpeakSel();if(!PZ.cur)newSpeakItem();else renderSpeak()}
function renderSpeakStat(){const s=P.speakStat||{n:0,ok:0};const el=$("speakStat");if(el)el.innerHTML='<div><b>'+s.ok+'</b><span>/ '+s.n+' başarılı</span></div>'}
function renderSpeakSel(){
  $("pLevels").innerHTML=Object.entries(LEVELS).map(([k,Lv])=>'<button style="--c:var(--lv-'+k+')" aria-pressed="'+(k===PZ.lv)+'" data-k="'+k+'">'+Lv.name+'<small>'+Lv.cefr+'</small></button>').join("");
  $("pLevels").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(PZ.lv===b.dataset.k)return;PZ.lv=b.dataset.k;prStop();renderSpeakSel();newSpeakItem()});
  $("pModes").querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.m===PZ.mode);b.onclick=()=>{if(PZ.mode===b.dataset.m)return;PZ.mode=b.dataset.m;prStop();renderSpeakSel();newSpeakItem()}});
}
function prTarget(){return plain(PZ.cur.en)}
function renderSpeak(){
  const box=$("speakBox"),c=PZ.cur;if(!box||!c)return;
  const sup=prSupported();
  let res="";
  if(PZ.score!==null){
    const ref=words_(prTarget()),usr=words_(PZ.heard),{hitA}=lcs(ref,usr);
    const good=PZ.score>=80;
    res='<div class="bres '+(good?"ok":"bad")+'"><div class="bres-h">'+ic(good?"check":"refresh")+'<b>'+(good?(PZ.score===100?"Mükemmel telaffuz!":"Çok iyi!"):PZ.score>=50?"Yaklaştın, bir kez daha dene":"Tekrar dene")+'</b><span class="pscore">%'+PZ.score+'</span></div>'+
      '<div class="pwords">'+(()=>{const orig=buildTokens(prTarget());return orig.length===ref.length?orig:ref})().map((w,i)=>'<span class="dw '+(hitA.has(i)?"g":"r")+'">'+esc(w)+'</span>').join(" ")+'</div>'+
      '<p class="note">Duyduğum: <b>'+(PZ.heard?esc(PZ.heard):"—")+'</b></p>'+
      (!good?'<p class="note">Kırmızı kelimeleri dinleyip yavaşça, net söylemeyi dene. '+(PZ.mode==="cumle"?"Cümleyi tek nefeste, durmadan söyle.":"")+'</p>':'')+'</div>';
  }
  box.innerHTML='<div class="ptarget"><span class="badge">'+esc(c.src||LEVELS[PZ.lv].name)+'</span>'+
      '<p class="pen'+(PZ.mode==="kelime"?" big":"")+'">'+esc(prTarget())+'</p><p class="ptr">'+esc(c.tr)+'</p>'+
      '<div class="pctl"><button class="ghost" id="pListen">'+ic("speaker")+'Dinle</button><button class="ghost" id="pSlow">'+ic("slow")+'Yavaş</button></div></div>'+
    (sup?'<div class="pmic"><button class="micbtn'+(PZ.state==="rec"?" on":"")+'" id="pMic" aria-label="'+(PZ.state==="rec"?"Dinlemeyi durdur":"Söylemek için dokun")+'">'+ic("mic")+'</button>'+
      '<span class="pmic-l">'+(PZ.state==="rec"?"Dinliyorum… şimdi söyle":PZ.state==="wait"?"Değerlendiriliyor…":PZ.score!==null?"Tekrar denemek için dokun":"Dokun ve yüksek sesle söyle")+'</span>'+
      (PZ.err?'<p class="auth-msg err">'+ic("alert")+'<span>'+esc(PZ.err)+'</span></p>':'')+'</div>'
    :'<div class="auth-off">'+ic("alert")+'<span>Bu tarayıcı konuşma tanımayı desteklemiyor. Telaffuz alıştırması için bilgisayarda ya da telefonda <b>Chrome</b>, <b>Edge</b> veya <b>Safari</b> kullan. Bu arada kelimeyi dinleyip tekrar edebilirsin.</span></div>')+
    res+
    '<div class="bfoot"><span class="sp"></span><button class="'+(PZ.score!==null&&PZ.score>=80?"primary":"ghost")+'" id="pNext">'+(PZ.score!==null&&PZ.score>=80?"Sonraki":"Geç")+'<span class="arr">'+ic("right")+'</span></button></div>'+
    (sup?'<p class="tiny pnote">Konuşma tanıma tarayıcının kendi hizmetiyle yapılır; bazı tarayıcılarda ses bu iş için tarayıcı şirketinin sunucusuna gönderilebilir.</p>':'');
  $("pListen").onclick=e=>speak(c.en,e.currentTarget);$("pSlow").onclick=e=>speak(c.en,e.currentTarget,.7);
  $("pNext").onclick=()=>{prStop();newSpeakItem()};
  if(sup)$("pMic").onclick=()=>{if(PZ.state==="rec")prStop(true);else prStart()};
}
function prStart(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;stopSpeak();
  const r=new SR();PZ.rec=r;r.lang="en-US";r.interimResults=false;r.maxAlternatives=5;r.continuous=false;
  PZ.state="rec";PZ.err="";renderSpeak();
  let got=false;
  r.onresult=e=>{got=true;const alts=[...e.results[0]].map(a=>a.transcript);
    // en iyi eşleşen alternatifi seç
    const ref=words_(prTarget());let best={s:-1,t:""};
    alts.forEach(t=>{const u=words_(t),{hitA}=lcs(ref,u);const extra=Math.max(0,u.length-ref.length);const s=Math.round(Math.max(0,hitA.size-extra*.5)/ref.length*100);if(s>best.s)best={s,t}});
    prScore(best.t,Math.max(0,Math.min(100,best.s)))};
  r.onerror=e=>{PZ.state="idle";PZ.err=e.error==="not-allowed"||e.error==="service-not-allowed"?"Mikrofon izni verilmedi. Tarayıcının adres çubuğundaki mikrofon simgesinden izin verebilirsin."
      :e.error==="no-speech"?"Ses duyamadım. Mikrofona biraz daha yakın ve yüksek sesle söylemeyi dene."
      :e.error==="audio-capture"?"Mikrofon bulunamadı.":e.error==="network"?"Konuşma tanıma için internet bağlantısı gerekiyor.":e.error==="aborted"?"":"Konuşma tanınamadı ("+e.error+").";renderSpeak()};
  r.onend=()=>{if(PZ.state==="rec"&&!got){PZ.state="idle";if(!PZ.err)PZ.err="Ses duyamadım. Dokunup tekrar dene.";renderSpeak()}};
  try{r.start()}catch(e){PZ.state="idle";PZ.err="Mikrofon başlatılamadı.";renderSpeak()}
}
function prStop(user){if(PZ.rec){try{user?PZ.rec.stop():PZ.rec.abort()}catch(e){}if(!user){PZ.rec=null;PZ.state="idle"}}}
function prScore(heard,score){
  PZ.heard=heard;PZ.score=score;PZ.state="idle";PZ.tries++;
  const first=PZ.tries===1;P.speakStat=P.speakStat||{n:0,ok:0};
  if(first){P.speakStat.n++;touch("p:"+plain(PZ.cur.en))}
  if(score>=80&&!PZ.counted){P.speakStat.ok++;PZ.counted=true}
  markActive();save();renderSpeakStat();renderSpeak();
}
