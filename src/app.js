/* ================= YARDIMCILAR ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<mark class="hl">$1</mark>');
const plain=s=>String(s).replace(/\*\*/g,"");
const ic=n=>'<svg class="ic"><use href="#i-'+n+'"/></svg>';
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const reduceMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let sampleFn=null;
(async()=>{try{sampleFn=await window.claude?.use?.("sample")}catch(e){sampleFn=null}})();

/* ================= İLERLEME ================= */
const P=(()=>{
  const p=store.get("ka_p")||{};
  p.learned=p.learned||{};p.gram=p.gram||{};p.best=p.best||{};p.trans=p.trans||0;p.days=p.days||[];
  ["kolay","orta","zor","uzman"].forEach(k=>{const old=store.get("best_"+k);if(old&&!(p.best[k]>=old))p.best[k]=old});
  return p;
})();
const save=()=>store.set("ka_p",P);
const dayKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function markActive(){const t=dayKey(new Date());if(!P.days.includes(t)){P.days.push(t);P.days=P.days.slice(-90);save()}renderStreak()}
function streakCount(){
  const s=new Set(P.days);const d=new Date();
  if(!s.has(dayKey(d)))d.setDate(d.getDate()-1);
  let n=0;while(s.has(dayKey(d))){n++;d.setDate(d.getDate()-1)}return n;
}
function renderStreak(){
  const n=streakCount(),el=$("streak");
  el.className="streak"+(n?"":" off");
  el.innerHTML='<svg class="ic"><use href="#i-flame"/></svg>'+n+" gün";
}
const ALLWORDS=DECKS.flatMap(d=>d.words.map(w=>({w,d})));
const learnedIn=d=>d.words.filter(w=>P.learned[w[0]]).length;
const gramDone=()=>GRAMMAR.filter(t=>P.gram[t.id]?.done).length;

/* ================= HAFIZA VE ARALIKLI TEKRAR =================
   P.seen[anahtar] = son görülme zamanı (w:kelime, t:seviye:no, l:cümle)
   P.srs[kelime]   = {b: kutu 1-5, d: tekrar günü, ok, no}  · kutu aralıkları: 1, 3, 7, 14, 30 gün
   P.saved[kelime] = [en, tr, tür, örnek, örnek tr]  (Defterim) */
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const INTERVALS=[0,1,3,7,14,30];
P.srs=P.srs||{};P.seen=P.seen||{};P.saved=P.saved||{};P.listen=P.listen||{n:0,ok:0};
if(!P.srsMigrated){Object.keys(P.learned).forEach(w=>{if(!P.srs[w])P.srs[w]={b:3,d:today()+3}});P.srsMigrated=1;save()}
const touch=k=>{P.seen[k]=Date.now()};
const inBox=w=>!!(P.srs[w]&&P.srs[w].b);
const isDue=w=>inBox(w)&&P.srs[w].d<=today();
const dueWords=()=>Object.keys(P.srs).filter(isDue);
function srsOk(w){const s=P.srs[w];if(!s||!s.b)return;s.b=Math.min(s.b+1,5);s.d=today()+INTERVALS[s.b];s.ok=(s.ok||0)+1}
function srsLearn(w){if(inBox(w))srsOk(w);else P.srs[w]={b:3,d:today()+INTERVALS[3],ok:1}}
function srsWrong(w){const s=P.srs[w]||{};s.b=1;s.d=today()+1;s.no=(s.no||0)+1;P.srs[w]=s}
/* Önce tekrarı gelenler, sonra hiç görülmeyenler, sonra en uzun süredir görülmeyenler */
function pickFresh(items,keyFn,n,dueFn){
  return items.map(it=>{const t=P.seen[keyFn(it)];return{it,g:dueFn&&dueFn(it)?0:t?2:1,t:t||0,r:Math.random()}})
    .sort((a,b)=>a.g-b.g||a.t-b.t||a.r-b.r).slice(0,n).map(x=>x.it);
}
/* Kelime bilgisi: desteler (örnekli) > yarışma > defter > metinden kaydedilen */
const WINFO={};
Object.values(WORDS).flat().forEach(w=>WINFO[w[0]]=[w[0],w[1],w[2],"",""]);
DECKS.forEach(d=>d.words.forEach(w=>WINFO[w[0]]=w));
const EXTRA={};
const winfo=en=>WINFO[en]||P.saved[en]||EXTRA[en];
function virtualDeck(id){
  if(id==="tekrar")return{id,name:"Tekrar zamanı",en:"Review",level:"Tekrar",icon:"refresh",hue:"var(--g2)",words:dueWords().map(winfo).filter(Boolean)};
  if(id==="defter")return{id,name:"Defterim",en:"My words",level:"Defter",icon:"bookmark",hue:"var(--g3)",words:Object.values(P.saved)};
  return null;
}

/* ================= SESLENDİRME ================= */
let enVoice=null;
const PREFER=[/natural/i,/online/i,/google us english/i,/google uk english/i,/samantha/i,/ava/i,/allison/i,/aria/i,/jenny/i,/guy/i,/daniel/i,/karen/i,/serena/i,/zira/i,/david/i];
function pickVoice(){
  try{
    const vs=speechSynthesis.getVoices().filter(v=>/^en([-_]|$)/i.test(v.lang));
    if(!vs.length){enVoice=null;return}
    const score=v=>{let s=0;PREFER.forEach((r,i)=>{if(r.test(v.name))s+=100-i*3});
      if(/en[-_]us/i.test(v.lang))s+=20;else if(/en[-_]gb/i.test(v.lang))s+=15;if(!v.localService)s+=10;return s};
    enVoice=vs.sort((a,b)=>score(b)-score(a))[0];
  }catch(e){enVoice=null}
}
try{pickVoice();speechSynthesis.addEventListener("voiceschanged",pickVoice)}catch(e){}
function speak(text,btn,rate,onend){
  try{
    if(!enVoice)pickVoice();
    const u=new SpeechSynthesisUtterance(plain(text));
    u.lang=enVoice?enVoice.lang:"en-US";if(enVoice)u.voice=enVoice;u.rate=rate||.88;
    document.querySelectorAll(".speak.on").forEach(b=>b.classList.remove("on"));
    if(btn)btn.classList.add("on");
    u.onend=u.onerror=()=>{if(btn)btn.classList.remove("on");if(onend)onend()};
    speechSynthesis.cancel();speechSynthesis.speak(u);
  }catch(e){}
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-say]");if(b){e.stopPropagation();speak(b.dataset.say,b)}},true);
const isSaved=en=>!!P.saved[en];
const savBtn=(en,cls="")=>'<button class="savebtn '+cls+(isSaved(en)?" on":"")+'" data-save="'+esc(en)+'" aria-pressed="'+isSaved(en)+'" aria-label="Defterime kaydet" title="Defterime kaydet">'+ic("bookmark")+'</button>';
let toastT=null;
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),1800)}
function setSaveBtn(b,en){b.dataset.save=en;const on=isSaved(en);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)}
function toggleSave(en){
  if(!en)return;
  if(isSaved(en)){delete P.saved[en];toast("Defterinden çıkarıldı")}
  else{const w=winfo(en);if(!w)return;P.saved[en]=w.slice(0,5);toast("Defterine eklendi: "+en)}
  save();
  document.querySelectorAll('[data-save]').forEach(b=>{if(b.dataset.save===en)setSaveBtn(b,en)});
  if(!$("v-defter").hidden)renderDefter();
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-save]");if(b){e.stopPropagation();e.preventDefault();toggleSave(b.dataset.save)}},true);
const sayBtn=(t,cls="")=>'<button class="speak '+cls+'" data-say="'+esc(plain(t))+'" aria-label="Seslendir">'+ic("speaker")+'</button>';

/* ================= GEZİNME ================= */
const SECTIONS=[
  {id:"ana",label:"Ana Sayfa",short:"Ana Sayfa",icon:"home",c:"var(--accent)"},
  {id:"ogren",label:"Kelime Öğren",short:"Öğren",icon:"cards",c:"var(--m-learn)"},
  {id:"yarisma",label:"Yarışma",short:"Yarışma",icon:"trophy",c:"var(--m-quiz)"},
  {id:"gramer",label:"Dil Bilgisi",short:"Gramer",icon:"book",c:"var(--m-gram)"},
  {id:"ceviri",label:"Çeviri",short:"Çeviri",icon:"translate",c:"var(--m-trans)"}
];
function renderNav(){
  $("nav").innerHTML=SECTIONS.map(s=>'<a href="#'+s.id+'" data-sec="'+s.id+'" style="--c:'+s.c+'">'+ic(s.icon)+s.label+'</a>').join("");
  $("tabbar").innerHTML=SECTIONS.map(s=>'<a href="#'+s.id+'" data-sec="'+s.id+'" style="--c:'+s.c+'">'+ic(s.icon)+'<span>'+s.short+'</span></a>').join("");
}
const VIEWS=["ana","ogren","calis","deckend","defter","dinle","yarisma","gramer","konu","ceviri"];
function showView(v,sec){
  VIEWS.forEach(x=>$("v-"+x).hidden=x!==v);
  document.querySelectorAll("[data-sec]").forEach(a=>{if(a.dataset.sec===sec)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
}
let lastHash=null;
function route(){
  const h=(location.hash.slice(1)||"ana").toLowerCase();
  if(h===lastHash)return;lastHash=h;
  if(h!=="yarisma")pauseGame();
  if(h!=="dinle")try{speechSynthesis.cancel()}catch(e){}
  hidePop();
  if(h==="ana"){renderHome();showView("ana","ana")}
  else if(h==="ogren"){if(S&&S.done)S=null;renderDecks();showView("ogren","ogren")}
  else if(h.startsWith("ogren-")){
    const id=h.slice(6);let d=DECKS.find(x=>x.id===id);
    if(!d){
      if(id!=="tekrar"&&id!=="defter"){location.hash="ogren";return}
      d=(S&&S.deck.id===id&&!S.done)?S.deck:virtualDeck(id);
      if(!d.words.length){location.hash=id==="defter"?"defter":"ogren";return}
    }
    if(!S||S.deck!==d)startStudy(d);
    S.done?showDeckEnd():(showView("calis","ogren"),showCard());
  }
  else if(h==="defter"){renderDefter();showView("defter","ogren")}
  else if(h==="dinle"){showView("dinle","ogren");if(!L.cur)newListen();else renderListenStat()}
  else if(h==="yarisma"){showQuiz();}
  else if(h==="gramer"){renderGramList();showView("gramer","gramer")}
  else if(h.startsWith("g-")){
    const t=GRAMMAR.find(x=>x.id===h.slice(2));if(!t){location.hash="gramer";return}
    renderTopic(t);showView("konu","gramer");
  }
  else if(h==="ceviri"){showView("ceviri","ceviri")}
  else{location.hash="ana";return}
  window.scrollTo({top:0,behavior:"auto"});
}
window.addEventListener("hashchange",route);

/* ================= ANA SAYFA ================= */
function renderHome(){
  const learned=Object.keys(P.learned).length,best=Math.max(0,...Object.values(P.best));
  $("homeStats").innerHTML=[
    [learned,"öğrenilen kelime"],[gramDone()+"/"+GRAMMAR.length,"gramer konusu"],[best,"en yüksek puan"],[streakCount(),"günlük seri"]
  ].map(([b,s])=>'<div class="stat"><b>'+b+'</b><span>'+s+'</span></div>').join("");
  // günün kelimesi
  const n=Math.floor(Date.now()/864e5),pick=ALLWORDS[(n*7)%ALLWORDS.length],w=pick.w;
  $("wotd").innerHTML='<span class="eyebrow">'+ic("spark")+'Günün kelimesi</span>'+
    '<div class="wotd-w"><h3>'+esc(w[0])+'</h3>'+sayBtn(w[0])+savBtn(w[0])+'</div>'+
    '<p class="wotd-m">'+esc(w[1])+' <span class="wotd-pos">· '+esc(w[2])+'</span></p>'+
    '<p class="wotd-ex">'+hl(w[3])+'<small>'+esc(w[4])+'</small></p>'+
    '<div class="wotd-foot"><span>'+esc(pick.d.name)+' destesinden</span><a href="#ogren-'+pick.d.id+'">Desteyi çalış '+ic("right")+'</a></div>';
  const totalW=ALLWORDS.length,rec=Object.keys(LEVELS).filter(k=>P.best[k]).length,gd=gramDone();
  const mods=[
    {id:"ogren",t:"Kelime Öğren",c:"var(--m-learn)",tint:"var(--t-learn)",icon:"cards",d:"11 konu destesi, örnek cümleler ve telaffuzla kalıcı kelime öğrenimi.",f:learned+" / "+totalW+" kelime",p:learned/totalW},
    {id:"yarisma",t:"Kelime Yarışması",c:"var(--m-quiz)",tint:"var(--t-quiz)",icon:"trophy",d:"Süreye karşı 10 soruluk turlar, jokerler ve seri çarpanı.",f:rec+" / 4 seviyede rekor",p:rec/4},
    {id:"gramer",t:"Dil Bilgisi",c:"var(--m-gram)",tint:"var(--t-gram)",icon:"book",d:"A1'den B2'ye "+GRAMMAR.length+" konu: anlatım, tablolar, örnekler ve alıştırmalar.",f:gd+" / "+GRAMMAR.length+" konu",p:gd/GRAMMAR.length},
    {id:"ceviri",t:"Metin Çevirisi",c:"var(--m-trans)",tint:"var(--t-trans)",icon:"translate",d:"Gerçek metinleri oku, kelimelere dokun, çevir ve puan al.",f:P.trans+" çeviri yapıldı",p:Math.min(1,P.trans/16)}
  ];
  $("modules").innerHTML=mods.map(m=>'<a class="mod" href="#'+m.id+'" style="--c:'+m.c+';--t:'+m.tint+'"><span class="mod-ic">'+ic(m.icon)+'</span><h3>'+m.t+'</h3><p>'+m.d+'</p>'+
    '<div class="mod-foot"><span>'+m.f+'</span><div class="mbar"><i style="width:'+Math.round(m.p*100)+'%"></i></div><span class="mod-go">Başla '+ic("right")+'</span></div></a>').join("");
  const nextT=GRAMMAR.find(t=>!P.gram[t.id]?.done)||GRAMMAR[0];
  const nextD=DECKS.find(d=>{const l=learnedIn(d);return l>0&&l<d.words.length})||DECKS.find(d=>learnedIn(d)<d.words.length)||DECKS[0];
  const due=dueWords().length;
  $("continue").innerHTML=
    (due?'<a class="cont hot" href="#ogren-tekrar" style="--c:var(--g2)"><span class="mod-ic">'+ic("refresh")+'</span><div><small>Aralıklı tekrar</small><b>Bugün tekrar edilecek: '+due+' kelime</b><span>Unutmadan önce bir kez daha bak</span></div>'+ic("right")+'</a>':'')+
    '<a class="cont" href="#g-'+nextT.id+'" style="--c:var(--m-gram)"><span class="mod-ic">'+ic("book")+'</span><div><small>Sıradaki gramer konusu · '+nextT.level+'</small><b>'+esc(nextT.title)+'</b><span>'+esc(nextT.tr)+'</span></div>'+ic("right")+'</a>'+
    '<a class="cont" href="#ogren-'+nextD.id+'" style="--c:'+nextD.hue+'"><span class="mod-ic">'+ic(nextD.icon)+'</span><div><small>Kelime destesi · '+learnedIn(nextD)+'/'+nextD.words.length+'</small><b>'+esc(nextD.name)+'</b><span>'+esc(nextD.en)+'</span></div>'+ic("right")+'</a>'+
    '<a class="cont" href="#dinle" style="--c:var(--m-learn)"><span class="mod-ic">'+ic("headphones")+'</span><div><small>Dinleme · '+P.listen.ok+' doğru</small><b>Dinle ve anla</b><span>Cümleyi duy, kelimeyi seç ya da yaz</span></div>'+ic("right")+'</a>'+
    (Object.keys(P.saved).length?'<a class="cont" href="#defter" style="--c:var(--g3)"><span class="mod-ic">'+ic("bookmark")+'</span><div><small>Defterim</small><b>'+Object.keys(P.saved).length+' kayıtlı kelime</b><span>Kaydettiklerini çalış</span></div>'+ic("right")+'</a>':'');
}

/* ================= KELİME ÖĞREN ================= */
function renderDecks(){
  const learned=Object.keys(P.learned).length;
  $("learnTotal").innerHTML='<div><b>'+learned+'</b><span>/ '+ALLWORDS.length+' kelime öğrenildi</span></div>';
  const due=dueWords().length,nb=Object.keys(P.saved).length,inRev=Object.keys(P.srs).filter(inBox).length;
  $("learnTools").innerHTML=
    '<a class="tool'+(due?" hot":" calm")+'" href="'+(due?"#ogren-tekrar":"#ogren")+'" style="--c:var(--g2);--t:var(--t-gram)"><span class="mod-ic">'+ic("refresh")+'</span><div><b>'+(due?due+" kelime tekrar bekliyor":"Bugün tekrar yok")+'</b><span>'+(due?"Unutmadan önce bir kez daha bak.":inRev?inRev+" kelime takvimde. Zamanı gelince burada görünür.":"Kartlarda \"Tekrar et\" dediğin kelimeler burada birikir.")+'</span></div>'+(due?'<span class="tool-go">Başla '+ic("right")+'</span>':'')+'</a>'+
    '<a class="tool" href="#defter" style="--c:var(--g3);--t:var(--t-trans)"><span class="mod-ic">'+ic("bookmark")+'</span><div><b>Defterim</b><span>'+(nb?nb+" kayıtlı kelime":"Henüz kayıtlı kelime yok")+'</span></div><span class="tool-go">Aç '+ic("right")+'</span></a>'+
    '<a class="tool" href="#dinle" style="--c:var(--m-learn);--t:var(--t-learn)"><span class="mod-ic">'+ic("headphones")+'</span><div><b>Dinleme</b><span>Duy, seç ya da yaz</span></div><span class="tool-go">Başla '+ic("right")+'</span></a>';
  $("decks").innerHTML=DECKS.map(d=>{
    const l=learnedIn(d),n=d.words.length,off=119.4*(1-l/n);
    return '<a class="deck" href="#ogren-'+d.id+'" style="--c:'+d.hue+'">'+
      '<div class="deck-top"><span class="mod-ic">'+ic(d.icon)+'</span><div class="ring"><svg viewBox="0 0 46 46"><circle class="trk" cx="23" cy="23" r="19"/><circle class="val" cx="23" cy="23" r="19" stroke-dasharray="119.4" stroke-dashoffset="'+off+'"/></svg><span>'+l+'/'+n+'</span></div></div>'+
      '<div><h3>'+esc(d.name)+'</h3><span class="en">'+esc(d.en)+'</span></div><p>'+esc(d.desc)+'</p>'+
      '<div class="deck-words">'+d.words.slice(0,4).map(w=>'<span>'+esc(w[0])+'</span>').join("")+'</div>'+
      '<div class="deck-foot"><span class="lvl">'+d.level+'</span><span class="go">'+(l===n?"Tekrar et":l?"Devam et":"Çalışmaya başla")+' →</span></div></a>';
  }).join("");
}
let S=null;
function startStudy(d,only){
  const idx=only||pickFresh(d.words.map((_,i)=>i),i=>"w:"+d.words[i][0],d.words.length,i=>isDue(d.words[i][0]));
  S={deck:d,order:idx,i:0,known:[],rev:[],done:false,flipped:false};
  const c=d.hue;["v-calis","v-deckend"].forEach(v=>$(v).style.setProperty("--c",c));
  $("sDeck").innerHTML=$("dDeck").innerHTML=ic(d.icon)+esc(d.name);
}
function showCard(){
  const d=S.deck,w=d.words[S.order[S.i]],n=S.order.length;
  $("sPos").textContent=(S.i+1)+" / "+n;$("sBar").style.width=(S.i/n*100)+"%";
  $("sKnown").textContent=S.known.length;$("sRev").textContent=S.rev.length;
  $("fPos").textContent=w[2];$("fLvl").textContent=d.level;$("fWord").textContent=w[0];
  $("bWordSmall").textContent=w[0];$("bMean").textContent=w[1];$("bEx").innerHTML=hl(w[3]||"");$("bExTr").textContent=w[4]||"";
  $("bexBox").hidden=!w[3];setSaveBtn($("sSave"),w[0]);
  $("flip").classList.remove("flipped");S.flipped=false;
  const sc=$("scene");sc.style.transition="none";sc.style.transform="";sc.style.opacity="";
  if(!reduceMotion()){sc.classList.remove("flip-in");void sc.offsetWidth;sc.classList.add("flip-in")}
}
function flipCard(){$("flip").classList.toggle("flipped");S.flipped=!S.flipped}
let judging=false;
function judge(knew){
  if(!S||S.done||judging)return;judging=true;
  const w=S.deck.words[S.order[S.i]];
  if(knew){P.learned[w[0]]=1;srsLearn(w[0]);S.known.push(S.order[S.i])}else{delete P.learned[w[0]];srsWrong(w[0]);S.rev.push(S.order[S.i])}
  touch("w:"+w[0]);
  save();markActive();
  const sc=$("scene");
  if(!reduceMotion()){sc.style.transition="transform .3s ease, opacity .3s ease";sc.style.transform="translateX("+(knew?120:-120)+"%) rotate("+(knew?8:-8)+"deg)";sc.style.opacity="0"}
  setTimeout(()=>{judging=false;S.i++;if(S.i>=S.order.length){S.done=true;showDeckEnd()}else showCard()},reduceMotion()?0:280);
}
function showDeckEnd(){
  const d=S.deck;$("dOk").textContent=S.known.length;$("dRev").textContent=S.rev.length;
  $("dTitle").textContent=d.id==="tekrar"?"Bugünkü tekrar bitti":S.rev.length?"Destenin sonuna geldin":"Harika! Hepsini biliyorsun";
  $("dQuiz").hidden=d.words.length<4;
  $("dRevList").innerHTML=S.rev.map(i=>{const w=d.words[i];return '<div class="mrow"><span><b>'+esc(w[0])+'</b> <span>— '+esc(w[1])+'</span></span>'+savBtn(w[0],"sm")+'</div>'}).join("");
  $("dRevList").hidden=!S.rev.length;$("dReview").hidden=!S.rev.length;
  showView("deckend","ogren");window.scrollTo({top:0});
}
$("flip").addEventListener("click",()=>{if(!dragMoved)flipCard()});
$("jOk").onclick=()=>judge(true);$("jRev").onclick=()=>judge(false);
$("fSpeak").onclick=e=>{e.stopPropagation();speak($("fWord").textContent,e.currentTarget)};
$("bSpeak").onclick=e=>{e.stopPropagation();speak($("bWordSmall").textContent,e.currentTarget)};
$("bExSpeak").onclick=e=>{e.stopPropagation();speak($("bEx").textContent,e.currentTarget)};
$("dRestart").onclick=()=>{startStudy(S.deck);showView("calis","ogren");showCard()};
$("dReview").onclick=()=>{const r=S.rev.slice();startStudy(S.deck,shuffle(r));showView("calis","ogren");showCard()};
$("dQuiz").onclick=()=>{const d=S.deck;startDeckQuiz(d)};
// kaydırma
let dragX=null,dragMoved=false;
$("flip").addEventListener("pointerdown",e=>{dragX=e.clientX;dragMoved=false});
window.addEventListener("pointermove",e=>{
  if(dragX===null)return;const dx=e.clientX-dragX;
  if(Math.abs(dx)>8){dragMoved=true;const sc=$("scene");sc.style.transition="none";sc.style.transform="translateX("+dx+"px) rotate("+dx/25+"deg)"}
});
window.addEventListener("pointerup",e=>{
  if(dragX===null)return;const dx=e.clientX-dragX;dragX=null;
  if(Math.abs(dx)>90)judge(dx>0);
  else{const sc=$("scene");sc.style.transition="transform .25s";sc.style.transform=""}
  setTimeout(()=>dragMoved=false,30);
});
document.addEventListener("keydown",e=>{
  if($("v-calis").hidden||/INPUT|TEXTAREA|BUTTON|^A$/.test(e.target.tagName))return;
  if(e.key===" "||e.key==="Enter"){e.preventDefault();flipCard()}
  else if(e.key==="ArrowRight")judge(true);else if(e.key==="ArrowLeft")judge(false);
});

/* ================= YARIŞMA ================= */
const G={phase:"lobby",active:false};
function showQuiz(){
  if(G.pending){showView("yarisma","yarisma");startGame(G.pending);return}
  $("lobby").hidden=G.phase!=="lobby";$("game").hidden=G.phase!=="game";$("end").hidden=G.phase!=="end";
  $("quizHead").hidden=G.phase!=="lobby";
  if(G.phase==="lobby")renderLobby();
  showView("yarisma","yarisma");
  if(G.phase==="game")resumeGame();
}
function renderLobby(){
  $("lobby").innerHTML=Object.entries(LEVELS).map(([k,L])=>{
    const sample=shuffle(WORDS[k]).slice(0,3).map(w=>"<span>"+esc(w[0])+"</span>").join("");
    return '<button class="lvcard" data-lv="'+k+'" style="--c:var(--lv-'+k+')">'+
      '<div class="lvtop"><span class="cefr">'+L.cefr+'</span><span class="bars">'+[1,2,3,4].map(i=>'<i class="'+(i<=L.bars?"on":"")+'"></i>').join("")+'</span></div>'+
      '<p class="lvname">'+L.name+'</p><p class="lvdesc">'+L.desc+'</p><div class="lvsample">'+sample+'</div>'+
      '<div class="lvfoot"><span>Rekor <b>'+(P.best[k]||0)+'</b> · '+L.time+' sn</span><span class="lvgo">Başla →</span></div></button>';
  }).join("");
  $("lobby").querySelectorAll(".lvcard").forEach(b=>b.onclick=()=>{const k=b.dataset.lv;startGame({key:k,name:LEVELS[k].name,cefr:LEVELS[k].cefr,c:"var(--lv-"+k+")",words:WORDS[k],time:LEVELS[k].time})});
}
function startDeckQuiz(d){
  if(d.words.length<4){toast("Yarışma için en az 4 kelime gerekir");return}
  G.pending={key:"deste-"+d.id,name:d.name,cefr:d.level,c:d.hue,words:d.words.map(w=>[w[0],w[1],w[2]]),time:15};
  if(location.hash==="#yarisma")startGame(G.pending);else location.hash="yarisma";
}
function startGame(cfg){
  G.pending=null;
  const Q=Math.min(10,cfg.words.length);
  Object.assign(G,{cfg,Q,phase:"game",active:true,list:shuffle(pickFresh(cfg.words,w=>"w:"+w[0],Q,w=>isDue(w[0]))),i:0,pts:0,streak:0,maxStreak:0,ok:0,no:0,pass:0,half:1,passes:2,res:[],missed:[],left:cfg.time,locked:true,cur:null,paused:false});
  ["game","end"].forEach(x=>$(x).style.setProperty("--c",cfg.c));$("gLevel").style.setProperty("--c",cfg.c);$("eLevel").style.setProperty("--c",cfg.c);
  $("gSteps").style.setProperty("--n",Q);
  $("gLevel").textContent=cfg.name+" · "+cfg.cefr;$("gPts").textContent="0";
  $("lobby").hidden=true;$("end").hidden=true;$("quizHead").hidden=true;$("game").hidden=false;
  renderSteps();updJokers();
  $("gWordBox").hidden=true;$("gOpts").innerHTML="";$("gFb").textContent="";$("gCombo").hidden=true;
  $("gQn").textContent="Hazır ol!";$("gTfill").style.width="100%";$("gSec").textContent=cfg.time+"s";
  let n=3;const cd=$("gCount");
  const tick=()=>{if(!G.active||G.paused)return;if(n===0){cd.hidden=true;$("gWordBox").hidden=false;ask();return}
    cd.hidden=false;cd.textContent=n;cd.style.animation="none";void cd.offsetWidth;cd.style.animation="";n--;G.tm=setTimeout(tick,700)};
  tick();
}
function pauseGame(){if(G.phase==="game"){G.paused=true;stopTimer();clearTimeout(G.tm)}}
function resumeGame(){
  if(!G.paused)return;G.paused=false;
  if(!G.cur){$("gCount").hidden=true;$("gWordBox").hidden=false;ask()}
  else if(G.locked)G.tm=setTimeout(next,400);
  else startTimer(G.left);
}
function renderSteps(){
  const s=$("gSteps");s.innerHTML="";
  for(let i=0;i<G.Q;i++){const d=document.createElement("i");d.className=G.res[i]||(i===G.i&&G.active?"cur":"");s.appendChild(d)}
}
function updJokers(){$("jHalfN").textContent=G.half;$("jPassN").textContent=G.passes;$("jHalf").disabled=G.half<1||G.locked;$("jPass").disabled=G.passes<1||G.locked}
function ask(){
  const w=G.list[G.i];G.cur=w;G.locked=false;
  $("gQn").textContent=(G.i+1)+" / "+G.Q;renderSteps();
  $("gWord").textContent=w[0];$("gPos").textContent=w[2];setSaveBtn($("gSave"),w[0]);touch("w:"+w[0]);
  $("gFb").textContent="";$("gFb").className="feedback";
  const st=$("gStage");if(!reduceMotion()){st.classList.remove("flip-in");void st.offsetWidth;st.classList.add("flip-in")}
  const pool=G.cfg.words.filter(x=>x!==w&&x[1]!==w[1]);
  const same=shuffle(pool.filter(x=>x[2]===w[2])),other=shuffle(pool.filter(x=>x[2]!==w[2]));
  const wrong=[];for(const x of same.concat(other)){if(!wrong.includes(x[1]))wrong.push(x[1]);if(wrong.length===3)break}
  const box=$("gOpts");box.innerHTML="";
  shuffle([w[1],...wrong]).forEach((o,i)=>{
    const b=document.createElement("button");b.className="opt";b.dataset.v=o;
    b.innerHTML='<span class="k">'+"ABCD"[i]+'</span><span></span>';b.lastChild.textContent=o;
    b.onclick=()=>answer(b);box.appendChild(b);
  });
  updJokers();startTimer(G.cfg.time);
}
let raf=null,tEnd=0;
function startTimer(sec){
  stopTimer();const total=G.cfg.time;tEnd=performance.now()+sec*1000;
  const loop=now=>{
    G.left=Math.max(0,(tEnd-now)/1000);
    $("gTfill").style.width=(G.left/total*100)+"%";$("gSec").textContent=Math.ceil(G.left)+"s";
    $("gTbar").classList.toggle("low",G.left<=4);
    if(G.left<=0){stopTimer();timeUp();return}
    raf=requestAnimationFrame(loop);
  };raf=requestAnimationFrame(loop);
}
function stopTimer(){if(raf)cancelAnimationFrame(raf);raf=null}
function lockOpts(){G.locked=true;[...$("gOpts").children].forEach(b=>{b.disabled=true;if(b.dataset.v===G.cur[1])b.classList.add("ok")});updJokers()}
const mult=()=>G.streak>=5?2:G.streak>=3?1.5:1;
function answer(btn){
  if(G.locked)return;stopTimer();markActive();
  const correct=btn.dataset.v===G.cur[1];lockOpts();
  if(correct){
    G.streak++;G.maxStreak=Math.max(G.maxStreak,G.streak);G.ok++;srsOk(G.cur[0]);save();
    const gain=Math.round((100+Math.round(G.left/G.cfg.time*50))*mult());
    G.pts+=gain;G.res[G.i]="g";
    $("gFb").textContent=mult()>1?"Doğru! Seri x"+mult():"Doğru!";$("gFb").className="feedback ok";
    const g=document.createElement("span");g.className="gain";g.textContent="+"+gain;$("gStage").appendChild(g);setTimeout(()=>g.remove(),1000);
  }else{
    btn.classList.add("no");G.streak=0;G.no++;G.res[G.i]="r";G.missed.push(G.cur);srsWrong(G.cur[0]);save();
    $("gFb").textContent="Yanlış. Doğrusu: "+G.cur[1];$("gFb").className="feedback no";
  }
  after(correct?900:1700);
}
function timeUp(){
  if(G.locked)return;lockOpts();G.streak=0;G.no++;G.res[G.i]="r";G.missed.push(G.cur);srsWrong(G.cur[0]);save();
  $("gFb").textContent="Süre doldu! Doğrusu: "+G.cur[1];$("gFb").className="feedback no";after(1700);
}
function after(ms){
  $("gPts").textContent=G.pts;
  const m=mult();$("gCombo").hidden=m===1;$("gCombo").textContent="x"+m+" seri";
  renderSteps();clearTimeout(G.tm);G.tm=setTimeout(next,ms);
}
function next(){if(!G.active||G.paused)return;G.i++;if(G.i>=G.Q)finish();else ask()}
$("jHalf").onclick=()=>{
  if(G.locked||G.half<1)return;G.half--;
  shuffle([...$("gOpts").children].filter(b=>b.dataset.v!==G.cur[1])).slice(0,2).forEach(b=>{b.disabled=true;b.classList.add("gone")});updJokers();
};
$("jPass").onclick=()=>{
  if(G.locked||G.passes<1)return;G.passes--;stopTimer();lockOpts();G.pass++;G.res[G.i]="s";G.streak=0;
  $("gFb").textContent="Pas geçtin. Anlamı: "+G.cur[1];$("gFb").className="feedback";after(1300);
};
$("gSpeak").onclick=e=>speak($("gWord").textContent,e.currentTarget);
$("gQuit").onclick=()=>{stopTimer();clearTimeout(G.tm);finish()};
function finish(){
  stopTimer();clearTimeout(G.tm);G.active=false;G.phase="end";
  const k=G.cfg.key,best=P.best[k]||0,isRec=G.pts>best&&G.pts>0;if(isRec){P.best[k]=G.pts;save()}
  $("eLevel").textContent=G.cfg.name+" · "+G.cfg.cefr;
  const r=G.ok/G.Q,stars=r>=.9?3:r>=.7?2:r>=.4?1:0;
  const star='<svg viewBox="0 0 24 24"><path class="CLS" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  $("eStars").innerHTML=[0,1,2].map(i=>star.replace("CLS",i<stars?"on":"off")).join("");
  $("eRecord").hidden=!isRec;
  $("eOk").textContent=G.ok;$("eNo").textContent=G.no;$("ePass").textContent=G.pass;$("eStreak").textContent=G.maxStreak;
  $("eMissedWrap").hidden=G.missed.length===0;
  $("eMissed").innerHTML=G.missed.map(w=>'<div class="mrow"><span><b>'+esc(w[0])+'</b> <span>— '+esc(w[1])+'</span></span>'+savBtn(w[0],"sm")+'</div>').join("");
  $("eMissedNote").hidden=!G.missed.length;
  $("game").hidden=true;$("end").hidden=false;
  const el=$("eScore"),target=G.pts,t0=performance.now();
  if(reduceMotion())el.textContent=target;else(function f(now){const p=Math.min(1,(now-t0)/900);el.textContent=Math.round(target*p);if(p<1)requestAnimationFrame(f)})(t0);
}
$("eAgain").onclick=()=>startGame(G.cfg);
$("eLobby").onclick=()=>{G.phase="lobby";showQuiz()};
document.addEventListener("keydown",e=>{
  if($("v-yarisma").hidden||G.phase!=="game"||G.locked||/INPUT|TEXTAREA/.test(e.target.tagName))return;
  const k="1234abcd".indexOf(e.key.toLowerCase());
  if(k>=0){const b=$("gOpts").children[k%4];if(b&&!b.disabled)b.click()}
});

/* ================= DİL BİLGİSİ ================= */
let gFilter="all";
function renderGramList(){
  const done=gramDone();
  $("gramTotal").innerHTML='<div><b>'+done+'</b><span>/ '+GRAMMAR.length+' konu tamamlandı</span></div>';
  $("gramFilter").innerHTML=[["all","Tümü"],...Object.keys(GRAMMAR_LEVELS).map(k=>[k,k+" · "+GRAMMAR_LEVELS[k].name])]
    .map(([k,l])=>'<button class="fchip" data-f="'+k+'" aria-pressed="'+(gFilter===k)+'" style="--c:'+(k==="all"?"var(--m-gram)":GRAMMAR_LEVELS[k].color)+'">'+l+'</button>').join("");
  $("gramFilter").querySelectorAll(".fchip").forEach(b=>b.onclick=()=>{gFilter=b.dataset.f;renderGramList()});
  $("gramList").innerHTML=Object.entries(GRAMMAR_LEVELS).filter(([k])=>gFilter==="all"||gFilter===k).map(([k,L])=>{
    const ts=GRAMMAR.filter(t=>t.level===k),dn=ts.filter(t=>P.gram[t.id]?.done).length;
    return '<section class="glevel"><div class="glevel-h" style="--c:'+L.color+'"><span class="glevel-badge">'+k+'</span><div><h2>'+L.name+'</h2><p>'+L.desc+'</p></div>'+
      '<div class="gl-prog">'+dn+' / '+ts.length+'<div class="mbar"><i style="width:'+(dn/ts.length*100)+'%"></i></div></div></div>'+
      '<div class="gtopics">'+ts.map((t,i)=>{const g=P.gram[t.id];
        return '<a class="gt'+(g?.done?" done":"")+'" href="#g-'+t.id+'" style="--c:'+L.color+'"><span class="gt-n">'+(g?.done?ic("check"):i+1)+'</span>'+
          '<b>'+esc(t.title)+'</b><span class="sub">'+esc(t.sub)+'</span><span class="trt">'+esc(t.tr)+'</span>'+
          '<span class="gt-st">'+(g?(g.done?ic("check")+"Tamamlandı · "+g.best+"/"+g.total:"Alıştırma: "+g.best+"/"+g.total):"Başlanmadı")+'</span></a>'}).join("")+'</div></section>';
  }).join("");
}
let PR=null;
function renderTopic(t){
  const L=GRAMMAR_LEVELS[t.level],idx=GRAMMAR.indexOf(t),prev=GRAMMAR[idx-1],nxt=GRAMMAR[idx+1];
  const m=$("tmain");m.style.setProperty("--c",L.color);$("toc").style.setProperty("--c",L.color);
  const secs=[];let h="";
  h+='<header class="thero" data-big="'+esc(t.title)+'"><div class="thero-top"><span class="badge" style="--c:'+L.color+'">'+t.level+' · '+L.name+'</span><span class="note">Konu '+(idx+1)+' / '+GRAMMAR.length+'</span></div>'+
    '<h1>'+esc(t.title)+'</h1><span class="sub">'+esc(t.sub)+' · '+esc(t.tr)+'</span><p>'+esc(t.intro)+'</p></header>';
  if(t.uses){secs.push(["s-uses","Ne zaman kullanılır?"]);
    h+='<section class="tsec" id="s-uses"><h2>'+ic("bulb")+'Ne zaman kullanılır?</h2><ul class="uses">'+t.uses.map(u=>{const p=u.indexOf(": ");return '<li>'+(p>0?'<em>'+esc(u.slice(0,p))+'</em>: '+esc(u.slice(p+2)):esc(u))+'</li>'}).join("")+'</ul></section>'}
  if(t.forms){secs.push(["s-forms","Cümle yapısı"]);
    h+='<section class="tsec" id="s-forms"><h2>'+ic("cards")+'Cümle yapısı</h2><div class="forms">'+t.forms.map(f=>'<div class="form"><span class="form-l">'+esc(f[0])+'</span><div class="formula">'+
      f[1].split(" + ").map((tk,i)=>(i?'<span class="plus">+</span>':'')+'<span class="tok'+(/^(Özne|tamamlayıcı|isim|yer)/i.test(tk)?"":" v")+'">'+esc(tk)+'</span>').join("")+'</div><span class="form-ex">'+esc(f[2])+'</span></div>').join("")+'</div></section>'}
  if(t.table){secs.push(["s-table","Tablo"]);
    h+='<section class="tsec" id="s-table"><h2>'+ic("book")+'Özet tablo</h2><div class="tbl-wrap"><table class="tbl"><thead><tr>'+t.table.head.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr></thead><tbody>'+
      t.table.rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div></section>'}
  secs.push(["s-ex","Örnek cümleler"]);
  h+='<section class="tsec" id="s-ex"><h2>'+ic("chat")+'Örnek cümleler</h2><div class="exs">'+t.examples.map(e=>'<div class="ex"><div><p>'+hl(e[0])+'</p><small>'+esc(e[1])+'</small></div>'+sayBtn(e[0],"sm")+'</div>').join("")+'</div></section>';
  if(t.signals){secs.push(["s-sig","İpucu kelimeler"]);
    h+='<section class="tsec" id="s-sig"><h2>'+ic("spark")+'İpucu kelimeler</h2><p class="note" style="margin-top:-6px">Bu kelimeleri cümlede görürsen büyük ihtimalle bu yapı kullanılır.</p><div class="signals">'+t.signals.map(s=>'<span>'+esc(s)+'</span>').join("")+'</div></section>'}
  if(t.mistakes){secs.push(["s-mis","Sık yapılan hatalar"]);
    h+='<section class="tsec" id="s-mis"><h2>'+ic("alert")+'Sık yapılan hatalar</h2><div class="mistakes">'+t.mistakes.map(x=>'<div class="mistake"><div class="wrong">'+ic("x")+'<span>'+esc(x[0])+'</span></div><div class="right">'+ic("check")+'<span>'+hl(x[1])+'</span></div><p>'+ic("bulb")+esc(x[2])+'</p></div>').join("")+'</div></section>'}
  secs.push(["s-pr","Alıştırma"]);
  h+='<section class="tsec" id="s-pr"><h2>'+ic("check")+'Alıştırma</h2><div class="practice" id="practice"></div></section>';
  h+='<nav class="tnav">'+(prev?'<a href="#g-'+prev.id+'"><small>← Önceki konu</small><b>'+esc(prev.title)+'</b></a>':'')+(nxt?'<a class="next" href="#g-'+nxt.id+'"><small>Sonraki konu →</small><b>'+esc(nxt.title)+'</b></a>':'')+'</nav>';
  m.innerHTML=h;
  $("toc").innerHTML='<a class="backlink" href="#gramer">'+ic("left")+'Tüm konular</a><small style="margin-top:12px">Bu sayfada</small>'+secs.map(s=>'<a href="javascript:void 0" data-jump="'+s[0]+'">'+s[1]+'</a>').join("")+
    '<div class="toc-nav">'+(nxt?'<a href="#g-'+nxt.id+'">Sonraki: '+esc(nxt.title)+' →</a>':'')+'</div>';
  $("toc").querySelectorAll("[data-jump]").forEach(a=>a.onclick=e=>{e.preventDefault();$(a.dataset.jump).scrollIntoView({behavior:reduceMotion()?"auto":"smooth"})});
  PR={t,i:0,score:0,res:[],answered:false,order:shuffle(t.quiz.map((_,i)=>i))};renderPractice();
}
function renderPractice(){
  const t=PR.t,box=$("practice"),n=t.quiz.length;
  if(PR.i>=n){
    const total=n,ok=PR.score,done=ok>=Math.ceil(total*.6);
    const prev=P.gram[t.id]||{best:0,total,done:false};
    P.gram[t.id]={best:Math.max(prev.best,ok),total,done:prev.done||done};save();
    const idx=GRAMMAR.indexOf(t),nxt=GRAMMAR[idx+1];
    box.innerHTML='<div class="pr-end"><div class="dots">'+PR.res.map(r=>'<i class="'+r+'"></i>').join("")+'</div><div class="pr-score">'+ok+' / '+total+'</div>'+
      '<p style="margin:0;font-weight:700">'+(ok===total?"Kusursuz! Bu konuyu çok iyi anlamışsın.":done?"Tebrikler, konu tamamlandı.":"Biraz daha pratik yapalım. Anlatımı tekrar gözden geçirip yeniden dene.")+'</p>'+
      '<p class="note">Konuyu tamamlamak için en az '+Math.ceil(total*.6)+' doğru gerekir.</p>'+
      '<div class="endbtns"><button class="ghost" id="prAgain">'+ic("refresh")+'Tekrar çöz</button>'+(nxt?'<a class="primary" href="#g-'+nxt.id+'">Sonraki konu '+ic("right")+'</a>':'<a class="primary" href="#gramer">Tüm konular</a>')+'</div></div>';
    $("prAgain").onclick=()=>{PR={t,i:0,score:0,res:[],answered:false,order:shuffle(t.quiz.map((_,i)=>i))};renderPractice()};
    return;
  }
  const q=t.quiz[PR.order[PR.i]];PR.answered=false;
  const parts=esc(q[0]).split("___");
  box.innerHTML='<div class="pr-top"><span class="badge">Soru '+(PR.i+1)+' / '+n+'</span><div class="dots">'+Array.from({length:n},(_,i)=>'<i class="'+(PR.res[i]||(i===PR.i?"cur":""))+'"></i>').join("")+'</div></div>'+
    '<p class="pr-q">'+parts[0]+'<span class="blank" id="prBlank">&nbsp;</span>'+(parts[1]||"")+'</p>'+
    '<div class="opts" id="prOpts">'+shuffle(q[1].map((_,i)=>i)).map((oi,pos)=>'<button class="opt" data-i="'+oi+'"><span class="k">'+"ABCD"[pos]+'</span><span>'+esc(q[1][oi])+'</span></button>').join("")+'</div>'+
    '<div id="prEx"></div><div class="pr-act"><button class="primary" id="prNext" hidden>'+(PR.i+1<n?"Sonraki soru":"Sonucu gör")+ic("right")+'</button></div>';
  box.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    if(PR.answered)return;PR.answered=true;markActive();
    const i=+b.dataset.i,ok=i===q[2];
    box.querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(+x.dataset.i===q[2])x.classList.add("ok")});
    if(!ok)b.classList.add("no");
    const bl=$("prBlank");bl.textContent=q[1][i];bl.className="blank "+(ok?"g":"r");
    if(ok)PR.score++;PR.res[PR.i]=ok?"g":"r";
    $("prEx").innerHTML='<div class="pr-ex '+(ok?"g":"r")+'">'+ic(ok?"check":"x")+'<div>'+(ok?"Doğru! ":"Doğrusu: "+esc(q[1][q[2]])+". ")+'<span>'+esc(q[3])+'</span></div></div>';
    $("prNext").hidden=false;$("prNext").focus({preventScroll:true});
  });
  $("prNext").onclick=()=>{PR.i++;renderPractice()};
}

/* ================= METİN ÇEVİRİSİ ================= */
let tLevel="kolay",tn=0,lastText=-1,current=null;
function renderTextLevels(){
  $("tLevels").innerHTML=Object.entries(LEVELS).map(([k,L])=>'<button style="--c:var(--lv-'+k+')" aria-pressed="'+(k===tLevel)+'" data-k="'+k+'">'+L.name+'<small>'+L.cefr+'</small></button>').join("");
  $("tLevels").querySelectorAll("button").forEach(b=>b.onclick=()=>{tLevel=b.dataset.k;tn=0;lastText=-1;renderTextLevels();newText()});
}
function newText(){
  const list=TEXTS[tLevel];
  const i=pickFresh(list.map((_,j)=>j).filter(j=>list.length<2||j!==lastText),j=>"t:"+tLevel+":"+j,1)[0];
  lastText=i;current=list[i];tn++;touch("t:"+tLevel+":"+i);save();
  $("tLevel").textContent=LEVELS[tLevel].name+" · "+LEVELS[tLevel].cefr;$("tLevel").style.setProperty("--c","var(--lv-"+tLevel+")");
  $("tCount").textContent="Metin "+tn;
  renderPassage(current.en);$("tInput").value="";looked.clear();renderLooked();
  const pp=$("tPaper");if(!reduceMotion()){pp.classList.remove("flip-in");void pp.offsetWidth;pp.classList.add("flip-in")}
  $("tResult").hidden=true;$("tCheck").disabled=false;$("tReveal").hidden=true;$("tShow").lastChild.textContent="Türkçesini göster";
}
const looked=new Map();let activeW=null;
function renderPassage(txt){
  const p=$("tPassage");p.innerHTML="";hidePop();
  txt.split(/([A-Za-z']+)/).forEach(part=>{
    if(/^[A-Za-z']+$/.test(part)){const s=document.createElement("span");s.className="w";s.textContent=part;s.tabIndex=0;s.setAttribute("role","button");
      s.onclick=e=>{e.stopPropagation();showWord(s)};s.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showWord(s)}};p.appendChild(s)}
    else p.appendChild(document.createTextNode(part));
  });
}
async function lookup(word){
  const k=word.toLowerCase().replace(/'s$/,"");
  if(GLOSS[k])return GLOSS[k];
  if(sampleFn){try{const r=await sampleFn("İngilizce '"+word+"' kelimesinin bu cümledeki Türkçe anlamını sadece 1-4 kelimeyle yaz, başka hiçbir şey yazma. Cümle: "+current.en,{modelTier:"quick"});
    const t=(r.text||"").trim().replace(/^["']|["'.]$/g,"");if(t){GLOSS[k]=t;return t}}catch(e){}}
  return "sözlükte bulunamadı";
}
async function showWord(s){
  if(activeW===s){hidePop();return}
  if(activeW)activeW.classList.remove("active");
  activeW=s;s.classList.add("active","seen");speak(s.textContent);
  const pop=$("tPop"),paper=$("tPaper");
  $("tPopEn").textContent=s.textContent;$("tPopTr").textContent="…";pop.hidden=false;
  const pr=paper.getBoundingClientRect(),sr=s.getBoundingClientRect();
  const maxL=pr.width-Math.min(260,pr.width*.8)-8,l=Math.max(8,Math.min(sr.left-pr.left,maxL));
  pop.style.left=l+"px";pop.style.top=(sr.bottom-pr.top+10)+"px";
  pop.style.setProperty("--ax",Math.max(10,Math.min(sr.left-pr.left-l+sr.width/2-6,230))+"px");
  const tr=await lookup(s.textContent);
  if(activeW===s){
    $("tPopTr").textContent=tr;const en=s.textContent.toLowerCase();looked.set(en,tr);
    if(!WINFO[en]&&tr!=="sözlükte bulunamadı"){const re=new RegExp("\\b("+en.replace(/[^a-z']/g,"")+")\\b","i");EXTRA[en]=[en,tr,"metinden",current.en.replace(re,"**$1**"),current.tr]}
    renderLooked();
  }
}
function hidePop(){$("tPop").hidden=true;if(activeW)activeW.classList.remove("active");activeW=null}
function renderLooked(){
  $("tLookedWrap").hidden=looked.size===0;
  $("tLooked").innerHTML=[...looked].map(([en,tr])=>'<span class="lw"><b>'+esc(en)+'</b> = '+esc(tr)+(winfo(en)?savBtn(en,"xs"):"")+'</span>').join("");
}
document.addEventListener("click",e=>{if(!e.target.closest(".w"))hidePop()});
const norm=s=>s.toLocaleLowerCase("tr").replace(/[^a-zçğıöşüâî\s]/g," ").replace(/\s+/g," ");
function localGrade(txt){const t=norm(txt);const hit=current.keys.filter(k=>t.includes(norm(k).trim()));
  return {score:Math.round(hit.length/current.keys.length*100),hit,miss:current.keys.filter(k=>!hit.includes(k))}}
async function checkText(){
  const txt=$("tInput").value.trim();
  if(!txt){$("tInput").focus();$("tInput").placeholder="Önce bir çeviri yaz…";return}
  $("tCheck").disabled=true;$("tCheck").textContent="Değerlendiriliyor…";markActive();
  const lg=localGrade(txt);let score=lg.score,comment="",showChips=true;
  if(sampleFn){
    try{
      const r=await sampleFn.json(
        "Sen bir İngilizce öğretmenisin. Öğrencinin İngilizce metne yaptığı Türkçe çeviriyi değerlendir. "+
        "Anlamın doğruluğuna odaklan, küçük yazım hatalarını hoş gör, birebir aynı kelimeleri bekleme.\n\n"+
        "İngilizce metin: "+current.en+"\nÖrnek çeviri: "+current.tr+"\nÖğrencinin çevirisi: "+txt+
        '\n\nSadece şu JSON\'u döndür: {"score": 0-100 arası tamsayı, "comment": "Türkçe, 1-3 cümle, neyi doğru yaptığı ve neyi kaçırdığı"}',
        {modelTier:"quick"});
      if(r&&typeof r.score==="number"){score=Math.max(0,Math.min(100,Math.round(r.score)));comment=r.comment||"";showChips=false}
    }catch(e){}
  }
  if(!comment)comment=score>=85?"Metnin anlamını çok iyi yakalamışsın.":score>=60?"Ana fikir doğru. Eksik kalan kısımlara bir göz at.":score>=30?"Bazı kısımlar doğru ama önemli parçalar eksik.":"Anlamın çoğu kaçmış görünüyor. Örnek çeviriyle karşılaştır.";
  P.trans++;save();
  $("tScore").textContent=score;$("tRing").style.strokeDashoffset=213.6*(1-score/100);
  $("tRing").style.stroke=score>=60?"var(--good)":score>=30?"var(--marigold)":"var(--bad)";
  $("tVerdict").textContent=score>=85?"Mükemmel çeviri":score>=60?"İyi iş":score>=30?"Fena değil":"Tekrar dene";
  $("tComment").textContent=comment;$("tRef").textContent=current.tr;
  $("tChips").innerHTML=showChips?lg.hit.map(k=>'<span class="chip hit">✓ '+esc(k)+'</span>').join("")+lg.miss.map(k=>'<span class="chip miss">✗ '+esc(k)+'</span>').join(""):"";
  $("tResult").hidden=false;$("tCheck").textContent="Kontrol et";
}
$("tCheck").onclick=checkText;$("tNext").onclick=newText;$("tSkip").onclick=newText;
$("tSpeak").onclick=e=>speak(current.en,e.currentTarget);
$("tShow").onclick=()=>{const r=$("tReveal");r.hidden=!r.hidden;$("tRevealText").textContent=current.tr;$("tShow").lastChild.textContent=r.hidden?"Türkçesini göster":"Türkçesini gizle"};


/* ================= DEFTERİM ================= */
function renderDefter(){
  const all=Object.values(P.saved).sort((a,b)=>a[0].localeCompare(b[0])),q=($("defterSearch").value||"").trim().toLocaleLowerCase("tr");
  const list=q?all.filter(w=>(w[0]+" "+w[1]).toLocaleLowerCase("tr").includes(q)):all;
  $("defterCount").innerHTML='<div><b>'+all.length+'</b><span>kayıtlı kelime</span></div>';
  $("defterBar").hidden=!all.length;$("defterQuiz").disabled=all.length<4;
  $("defterQuiz").title=all.length<4?"Yarışma için en az 4 kelime gerekir":"";
  if(!all.length){
    $("defterList").innerHTML='<div class="empty aurora"><span class="mod-ic">'+ic("bookmark")+'</span><h3>Defterin henüz boş</h3>'+
      '<p>Kelime kartlarında, yarışmada ya da metinlerde bir kelimenin yanındaki '+ic("bookmark")+' işaretine dokun. Kelime anlamı ve örnek cümlesiyle buraya eklenir.</p>'+
      '<a class="primary" href="#ogren">Kelime öğrenmeye başla<span class="arr">'+ic("right")+'</span></a></div>';
    return;
  }
  $("defterList").innerHTML=list.length?list.map(w=>{const s=P.srs[w[0]];
    const st=s&&s.b?(isDue(w[0])?'<span class="dst due">Tekrar zamanı</span>':'<span class="dst">'+(s.d-today())+' gün sonra tekrar</span>'):'<span class="dst new">Yeni</span>';
    return '<article class="dcard"><div class="dtop"><div><h3>'+esc(w[0])+'</h3><span class="pill">'+esc(w[2]||"")+'</span></div><div class="dbtns">'+sayBtn(w[0],"sm")+savBtn(w[0],"sm")+'</div></div>'+
      '<p class="dmean">'+esc(w[1])+'</p>'+(w[3]?'<p class="dex">'+hl(w[3])+'<small>'+esc(w[4]||"")+'</small></p>':'')+st+'</article>'}).join("")
    :'<p class="note">"'+esc(q)+'" ile eşleşen kelime yok.</p>';
}
$("defterSearch").addEventListener("input",renderDefter);
$("defterQuiz").onclick=()=>startDeckQuiz(virtualDeck("defter"));

/* ================= DİNLEME ================= */
const LPOOL=[
  ...DECKS.flatMap(d=>d.words.map(w=>({en:w[3],tr:w[4],key:(w[3].match(/\*\*(.+?)\*\*/)||[,w[0]])[1],word:w[0],src:d.name}))),
  ...GRAMMAR.flatMap(t=>t.examples.map(e=>({en:e[0],tr:e[1],key:(e[0].match(/\*\*(.+?)\*\*/)||[,""])[1],word:null,src:t.title})))
].filter(x=>x.key);
const L={mode:"kolay",cur:null,plays:0,answered:false};
function renderListenStat(){$("listenStat").innerHTML='<div><b>'+P.listen.ok+'</b><span>/ '+P.listen.n+' doğru</span></div>'}
function newListen(){
  L.cur=pickFresh(LPOOL,x=>"l:"+x.en,1)[0];L.plays=0;L.answered=false;
  $("lSrc").textContent=L.cur.src;$("lPlays").textContent="Dinlemek için oynat düğmesine dokun";
  $("lResult").hidden=true;$("lResult").innerHTML="";
  const plain_=plain(L.cur.en);
  if(L.mode==="kolay"){
    const others=shuffle(LPOOL.filter(x=>x.key.toLowerCase()!==L.cur.key.toLowerCase()&&!plain_.toLowerCase().includes(x.key.toLowerCase())));
    const opts=[L.cur.key];for(const o of others){if(!opts.some(k=>k.toLowerCase()===o.key.toLowerCase()))opts.push(o.key);if(opts.length===4)break}
    $("lAsk").innerHTML='<p class="lq">Cümlede hangi ifadeyi duydun?</p><div class="opts" id="lOpts">'+shuffle(opts).map((o,i)=>'<button class="opt" data-v="'+esc(o)+'"><span class="k">'+"ABCD"[i]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>';
    $("lOpts").querySelectorAll(".opt").forEach(b=>b.onclick=()=>answerListen(b.dataset.v===L.cur.key,b));
  }else{
    $("lAsk").innerHTML='<label class="lq" for="lInput">Duyduğun cümleyi yaz</label><div class="notebook dict"><textarea id="lInput" rows="2" placeholder="Duyduğunu buraya yaz…" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea></div>'+
      '<div class="tactions"><button class="ghost" id="lGive">Bilmiyorum, göster</button><button class="primary" id="lCheck">Kontrol et</button></div>';
    $("lCheck").onclick=checkDictation;$("lGive").onclick=()=>checkDictation(true);
    $("lInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();checkDictation()}});
  }
  renderListenStat();
}
function playListen(rate){
  if(!L.cur)return;L.plays++;
  $("lPlayer").classList.add("playing");
  $("lPlays").textContent=L.plays+". dinleme"+(rate?" · yavaş":"");
  speak(L.cur.en,null,rate||.9,()=>$("lPlayer").classList.remove("playing"));
}
$("lPlay").onclick=()=>playListen();$("lAgain").onclick=()=>playListen();$("lSlow").onclick=()=>playListen(.6);
$("lModes").querySelectorAll("button").forEach(b=>b.onclick=()=>{
  L.mode=b.dataset.m;$("lModes").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));newListen();
});
const EXPAND=[[/\bi'm\b/g,"i am"],[/\bcan't\b/g,"can not"],[/\bcannot\b/g,"can not"],[/\bwon't\b/g,"will not"],[/n't\b/g," not"],[/'re\b/g," are"],[/'ll\b/g," will"],[/'ve\b/g," have"],[/'d\b/g," would"]];
function words_(s){let t=plain(s).toLowerCase().replace(/[’`]/g,"'");EXPAND.forEach(([r,v])=>t=t.replace(r,v));return t.replace(/[^a-z0-9'\s-]/g," ").split(/\s+/).filter(Boolean)}
function lcs(a,b){const m=a.length,n=b.length,d=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)d[i][j]=a[i]===b[j]?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);
  const hitA=new Set(),hitB=new Set();let i=0,j=0;while(i<m&&j<n){if(a[i]===b[j]){hitA.add(i);hitB.add(j);i++;j++}else if(d[i+1][j]>=d[i][j+1])i++;else j++}
  return{hitA,hitB}}
function checkDictation(give){
  if(L.answered)return;const txt=give===true?"":$("lInput").value.trim();
  if(give!==true&&!txt){$("lInput").focus();return}
  const ref=words_(L.cur.en),usr=words_(txt),{hitA,hitB}=lcs(ref,usr);
  const score=ref.length?hitA.size/ref.length:0,ok=score>=.9;
  const refHtml=ref.map((w,i)=>'<span class="dw '+(hitA.has(i)?"g":"r")+'">'+esc(w)+'</span>').join(" ");
  const usrHtml=usr.length?usr.map((w,i)=>'<span class="dw '+(hitB.has(i)?"":"x")+'">'+esc(w)+'</span>').join(" "):'<span class="note">—</span>';
  answerListen(ok,null,'<div class="dict-cmp"><div><small>Doğru cümle</small><p>'+refHtml+'</p></div><div><small>Senin yazdığın · %'+Math.round(score*100)+' doğru</small><p>'+usrHtml+'</p></div></div>');
}
function answerListen(ok,btn,extra){
  if(L.answered)return;L.answered=true;markActive();
  P.listen.n++;if(ok)P.listen.ok++;touch("l:"+L.cur.en);
  if(L.cur.word){if(ok)srsOk(L.cur.word);else if(P.srs[L.cur.word]||P.learned[L.cur.word])srsWrong(L.cur.word)}
  save();renderListenStat();
  if(btn){$("lOpts").querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.v===L.cur.key)b.classList.add("ok")});if(!ok)btn.classList.add("no")}
  if(L.mode==="dikte"){$("lInput").disabled=true;$("lCheck").disabled=true;$("lGive").disabled=true}
  const r=$("lResult");r.hidden=false;
  r.innerHTML='<div class="pr-ex '+(ok?"g":"r")+'">'+ic(ok?"check":"x")+'<div>'+(ok?"Doğru!":"Bu sefer olmadı.")+' <span>'+(ok?"Kulağın alışıyor.":L.mode==="kolay"?"Doğru cevap: "+esc(L.cur.key)+". Cümleyi bir kez daha dinle.":"Kırmızı kelimeleri kaçırdın. Yavaş dinleyip tekrar dene.")+'</span></div></div>'+
    (extra||"")+
    '<div class="lreveal"><div><p>'+hl(L.cur.en)+'</p><small>'+esc(L.cur.tr)+'</small></div><div class="dbtns">'+sayBtn(L.cur.en,"sm")+(L.cur.word?savBtn(L.cur.word,"sm"):"")+'</div></div>'+
    '<div class="pr-act"><button class="primary" id="lNext">Sonraki cümle'+ic("right")+'</button></div>';
  $("lNext").onclick=()=>{newListen();playListen()};$("lNext").focus({preventScroll:true});
}

/* ================= BAŞLAT ================= */
renderNav();renderStreak();renderTextLevels();newText();
route();
