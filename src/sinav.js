/* ================= ÜNİTE SINAVLARI =================
   Her dil bilgisi seviyesi bir ünite. Sınav sırasında doğru/yanlış gösterilmez; sonunda konu konu değerlendirme
   yapılır ve kişi "çalışmalı / kısa tekrar / hazır" diye yönlendirilir.
   Sonuç: P.exam[seviye]={at,ok,n,t:{konu:doğru},best} */
var EX=null;
function examVerdict(r){
  if(r>=.85)return{k:"ok",short:"Üniteyi biliyorsun",long:"Bu üniteyi iyi biliyorsun. Bir sonraki üniteye geçebilirsin."};
  if(r>=.6)return{k:"mid",short:"Birkaç konu tekrar",long:"İyi gidiyorsun. Aşağıda işaretli konuları kısaca tekrar edip devam et."};
  return{k:"bad",short:"Üniteyi çalışmalısın",long:"Bu ünitede eksiklerin var. Aşağıdaki konuları sırayla çalışıp sınavı yeniden dene."};
}
function topicVerdict(s){return s>=3?{k:"ok",t:"Hazırsın",d:"Bu konuyu biliyorsun, geçebilirsin."}:s===2?{k:"mid",t:"Kısa tekrar",d:"Konu anlatımına ve sık yapılan hatalara göz at."}:{k:"bad",t:"Çalışmalısın",d:"Konuyu baştan çalışıp alıştırmaları çöz."}}
const unitNo=lv=>Object.keys(GRAMMAR_LEVELS).indexOf(lv)+1;

var EXTAB="gramer";
function examTabs(){
  return '<div class="chips-row st-tabs ex-tabs">'+[["gramer","Dil bilgisi üniteleri","book","#sinav"],["kelime","Kelime desteleri","cards","#sinav-kelime"]].map(([k,l,i,hr])=>
    '<a class="fchip" href="'+hr+'" aria-pressed="'+(EXTAB===k)+'" style="--c:var(--brand)">'+ic(i)+l+'</a>').join("")+'</div>';
}
function setExamBack(sec){const b=$("examBack");if(!b)return;b.href=sec==="ogren"?"#ogren":"#gramer";b.querySelector("span").textContent=sec==="ogren"?"Kelime Öğren":"Dil Bilgisi"}
function renderExamList(){
  const box=$("exam");if(!box)return;EX=null;EXTAB="gramer";
  box.innerHTML=examTabs()+'<div class="ex-units">'+Object.entries(GRAMMAR_LEVELS).map(([k,L])=>{
    const ts=GRAMMAR.filter(t=>t.level===k),n=ts.length*3,r=P.exam&&P.exam[k],v=r&&examVerdict(r.ok/r.n);
    return '<article class="ex-unit card" style="--c:'+L.color+'"><div class="ex-uh"><span class="glevel-badge">'+k+'</span><div><small>Ünite '+unitNo(k)+'</small><h2>'+esc(L.name)+'</h2><p>'+esc(L.desc)+'</p></div></div>'+
      '<p class="ex-topics">'+ts.map(t=>esc(t.title)).join(" · ")+'</p>'+
      (r?'<div class="ex-last v-'+v.k+'">'+ic(v.k==="ok"?"check":"alert")+'<div><b>'+r.ok+' / '+r.n+' · '+v.short+'</b><small>'+new Date(r.at).toLocaleDateString("tr-TR",{day:"numeric",month:"long"})+'</small></div></div>':'')+
      '<div class="ex-uf"><span class="note">'+n+' soru · yaklaşık '+Math.round(n*.4)+' dakika</span>'+
      (r?'<a class="ghost" href="#sinav-'+k.toLowerCase()+'-sonuc">Sonucu gör</a>':'')+
      '<a class="primary" href="#sinav-'+k.toLowerCase()+'">'+(r?"Yeniden gir":"Sınava gir")+'</a></div></article>'}).join("")+'</div>';
}

function startExam(lv){
  const ts=GRAMMAR.filter(t=>t.level===lv);
  const qs=shuffle(ts.flatMap(t=>(EXAM[t.id]||[]).map(q=>({tid:t.id,q,order:shuffle(q[1].map((_,i)=>i))}))));
  EX={lv,qs,i:0,pick:[],done:false};renderExam();
}
function renderExam(){
  const box=$("exam");if(!box||!EX)return;
  if(EX.done){renderExamResult(EX.lv,EX);return}
  const L=GRAMMAR_LEVELS[EX.lv],n=EX.qs.length,it=EX.qs[EX.i],q=it.q,sel=EX.pick[EX.i];
  const parts=esc(q[0]).split("___");
  box.innerHTML='<div class="exrun card" style="--c:'+L.color+'">'+
    '<div class="ex-top"><span class="badge" style="--c:'+L.color+'">Ünite '+unitNo(EX.lv)+' · '+EX.lv+'</span><span class="note">Soru '+(EX.i+1)+' / '+n+'</span></div>'+
    '<div class="mbar ex-bar"><i style="width:'+(EX.i/n*100)+'%"></i></div>'+
    '<p class="pr-q">'+parts[0]+(parts.length>1?'<span class="blank">'+(sel!==undefined?esc(q[1][sel]):"&nbsp;")+'</span>'+parts[1]:"")+'</p>'+
    '<div class="opts" id="exOpts">'+it.order.map((oi,p)=>'<button class="opt'+(sel===oi?" sel":"")+'" data-i="'+oi+'" aria-pressed="'+(sel===oi)+'"><span class="k">'+"ABCD"[p]+'</span><span>'+esc(q[1][oi])+'</span></button>').join("")+'</div>'+
    '<div class="ex-foot">'+(EX.i?'<button class="ghost" id="exPrev">'+ic("left")+'Önceki</button>':'<a class="linkbtn" href="#sinav">Sınavdan çık</a>')+'<span class="sp"></span>'+
      '<button class="primary" id="exNext"'+(sel===undefined?" disabled":"")+'>'+(EX.i+1<n?"Sonraki":"Sınavı bitir")+ic("right")+'</button></div>'+
    '<p class="note ex-hint">Sınav sırasında cevaplar gösterilmez; sonunda konu konu değerlendirme ve açıklamalar gelir.</p></div>';
  box.querySelectorAll("#exOpts .opt").forEach(b=>b.onclick=()=>{EX.pick[EX.i]=+b.dataset.i;markActive();renderExam()});
  if($("exPrev"))$("exPrev").onclick=()=>{EX.i--;renderExam()};
  $("exNext").onclick=()=>{if(EX.pick[EX.i]===undefined)return;if(EX.i+1<n){EX.i++;renderExam()}else finishExam()};
}
function finishExam(){
  const t={};let ok=0;
  EX.qs.forEach((it,i)=>{const r=EX.pick[i]===it.q[2];t[it.tid]=(t[it.tid]||0)+(r?1:0);if(r)ok++});
  P.exam=P.exam||{};const prev=P.exam[EX.lv];
  P.exam[EX.lv]={at:Date.now(),ok,n:EX.qs.length,t,best:Math.max(ok,prev?prev.best||prev.ok:0)};
  save();EX.done=true;
  try{history.replaceState(null,"","#sinav-"+EX.lv.toLowerCase()+"-sonuc")}catch(e){}
  lastHash="sinav-"+EX.lv.toLowerCase()+"-sonuc";
  renderExam();window.scrollTo({top:0,behavior:"auto"});
}
function renderExamResult(lv,run){
  const box=$("exam"),r=P.exam&&P.exam[lv];if(!box)return;
  if(!r){location.hash="sinav-"+lv.toLowerCase();return}
  const L=GRAMMAR_LEVELS[lv],v=examVerdict(r.ok/r.n),ts=GRAMMAR.filter(t=>t.level===lv);
  const groups=[["bad","Çalışmalısın"],["mid","Kısa tekrar"],["ok","Hazırsın"]].map(([k,l])=>[k,l,ts.filter(t=>topicVerdict(r.t[t.id]||0).k===k)]).filter(g=>g[2].length);
  const first=ts.find(t=>(r.t[t.id]||0)<=1)||ts.find(t=>(r.t[t.id]||0)===2);
  const nextLv=Object.keys(GRAMMAR_LEVELS)[unitNo(lv)];
  let h='<div class="exres" style="--c:'+L.color+'">'+
    '<section class="card ex-sum v-'+v.k+'"><div class="ex-score"><b>'+Math.round(r.ok/r.n*100)+'<small>%</small></b><span>'+r.ok+' / '+r.n+' doğru</span></div>'+
      '<div><small class="eyebrow">Ünite '+unitNo(lv)+' · '+lv+' '+esc(L.name)+'</small><h2>'+esc(v.short)+'</h2><p>'+esc(v.long)+'</p>'+
      '<div class="hero-row">'+(first&&v.k!=="ok"?'<a class="primary" href="#g-'+first.id+'">'+esc(first.title)+' konusuyla başla<span class="arr">'+ic("right")+'</span></a>'
        :nextLv?'<a class="primary" href="#sinav-'+nextLv.toLowerCase()+'">Ünite '+(unitNo(lv)+1)+' sınavına geç<span class="arr">'+ic("right")+'</span></a>':'<a class="primary" href="#gramer">Dil Bilgisi</a>')+
      '<a class="ghost" href="#sinav-'+lv.toLowerCase()+'">'+ic("refresh")+'Yeniden gir</a></div></div></section>'+
    '<section class="ex-topicres">'+groups.map(([k,l,list])=>'<div class="ex-g v-'+k+'"><h3>'+ic(k==="ok"?"check":k==="mid"?"bulb":"alert")+l+' <small>'+list.length+' konu</small></h3>'+
      list.map(t=>{const s=r.t[t.id]||0,tv=topicVerdict(s);return '<a class="ex-t" href="#g-'+t.id+'"><div><b>'+esc(t.title)+'</b><small>'+esc(t.sub)+' · '+tv.d+'</small></div><span class="ex-ts">'+s+'/3</span>'+ic("right")+'</a>'}).join("")+'</div>').join("")+'</section>';
  if(run&&run.qs){
    const wrong=run.qs.map((it,i)=>[it,run.pick[i]]).filter(([it,p])=>p!==it.q[2]);
    h+='<section class="card ex-review"><h2 class="tres-h">'+(wrong.length?'Yanlış cevapların <small>'+wrong.length+'</small>':'Tüm sorular doğru!')+'</h2>'+
      wrong.map(([it,p])=>{const q=it.q,t=GRAMMAR.find(x=>x.id===it.tid);return '<div class="ex-w"><p class="ex-wq">'+esc(q[0]).replace("___","<u>"+esc(q[1][q[2]])+"</u>")+'</p>'+
        '<p class="ex-wa"><span class="chip miss">Senin cevabın: '+esc(q[1][p])+'</span><span class="chip hit">Doğrusu: '+esc(q[1][q[2]])+'</span></p><p class="note">'+ic("bulb")+esc(q[3])+' <a href="#g-'+t.id+'">'+esc(t.title)+'</a></p></div>'}).join("")+'</section>';
  }
  h+='<p class="note ex-back"><a href="#sinav">'+ic("left")+'Tüm üniteler</a></p></div>';
  box.innerHTML=h;
}
function openExamRoute(h){
  // "sinav" | "sinav-a1" | "sinav-a1-sonuc" | "sinav-kelime" | "sinav-k-<deste>" | "sinav-k-<deste>-sonuc"  → bölüm adı döner
  let sec="gramer";
  const m=h.match(/^sinav-(a1|a2|b1|b2|c1)(-sonuc)?$/),k=h.match(/^sinav-k-([a-z0-9]+?)(-sonuc)?$/);
  if(h==="sinav")renderExamList();
  else if(h==="sinav-kelime"){renderVList();sec="ogren"}
  else if(m){const lv=m[1].toUpperCase();if(m[2])renderExamResult(lv,EX&&EX.lv===lv&&EX.done?EX:null);else startExam(lv)}
  else if(k){const d=DECKS.find(x=>x.id===k[1]);if(!d)return false;sec="ogren";
    if(k[2])renderVResult(d,VX&&VX.d===d&&VX.done?VX:null);else startVExam(d)}
  else return false;
  setExamBack(sec);return sec;
}

/* ================= KELİME DESTESİ SINAVLARI =================
   Destedeki her kelime için bir soru; üç soru türü karışık gelir:
   anlam (İngilizce → Türkçe) · ters (Türkçe → İngilizce) · boşluk (örnek cümlede eksik kelime).
   Doğru bilinen kelimeler öğrenildi sayılır, bilinemeyenler tekrar kutusuna girer ve "Sınavda bilemediklerin" destesine eklenir.
   Sonuç: P.vexam[deste]={at,ok,n,miss:[kelime],best} · P.vmiss: son sınavda bilinemeyen kelimeler */
var VX=null;
function vVerdict(r){
  if(r>=.85)return{k:"ok",short:"Desteyi biliyorsun",long:"Bu destenin kelimelerini iyi biliyorsun. Bir sonraki desteye geçebilirsin."};
  if(r>=.6)return{k:"mid",short:"Birkaç kelime eksik",long:"Çoğunu biliyorsun. Bilemediğin kelimeleri çalışıp sınavı yeniden dene."};
  return{k:"bad",short:"Desteyi çalışmalısın",long:"Bu destede bilmediğin kelimeler çok. Desteyi kartlarla baştan çalışmanı öneririz."};
}
function vQuestions(d){
  const ws=shuffle(d.words),pick=(arr,n,not)=>shuffle(arr.filter(x=>!not.includes(x))).slice(0,n);
  return ws.map((w,i)=>{
    const others=d.words.filter(x=>x!==w);
    const m=(w[3]||"").match(/\*\*(.+?)\*\*/),blankOk=m&&m[1].toLowerCase()===w[0].toLowerCase();
    let type=["anlam","ters","bosluk"][i%3];if(type==="bosluk"&&!blankOk)type=i%2?"anlam":"ters";
    if(type==="anlam"){const opts=shuffle([w[1],...pick(others.map(x=>x[1]),3,[w[1]])]);return{w,type,opts,right:w[1]}}
    const opts=shuffle([w[0],...pick(others.map(x=>x[0]),3,[w[0]])]);
    return{w,type,opts,right:w[0]};
  });
}
function startVExam(d){VX={d,qs:vQuestions(d),i:0,pick:[],done:false};renderVExam()}
function renderVExam(){
  const box=$("exam");if(!box||!VX)return;
  const d=VX.d,n=VX.qs.length,q=VX.qs[VX.i],sel=VX.pick[VX.i];
  let prompt;
  if(q.type==="anlam")prompt='<small class="ex-qt">Bu kelimenin anlamı ne?</small>'+esc(q.w[0]);
  else if(q.type==="ters")prompt='<small class="ex-qt">İngilizcesi hangisi?</small>'+esc(q.w[1]);
  else{const parts=esc(q.w[3]).split(/\*\*.+?\*\*/);prompt='<small class="ex-qt">Boşluğa hangi kelime gelir?</small>'+parts[0]+'<span class="blank">'+(sel!==undefined?esc(q.opts[sel]):"&nbsp;")+'</span>'+(parts[1]||"")+'<small class="ex-qtr">'+esc(q.w[4]||"")+'</small>'}
  box.innerHTML='<div class="exrun card" style="--c:'+d.hue+'">'+
    '<div class="ex-top"><span class="badge" style="--c:'+d.hue+'">'+esc(d.name)+' · '+esc(d.level)+'</span><span class="note">Soru '+(VX.i+1)+' / '+n+'</span></div>'+
    '<div class="mbar ex-bar"><i style="width:'+(VX.i/n*100)+'%"></i></div>'+
    '<p class="pr-q">'+prompt+'</p>'+
    '<div class="opts" id="exOpts">'+q.opts.map((o,p)=>'<button class="opt'+(sel===p?" sel":"")+'" data-i="'+p+'" aria-pressed="'+(sel===p)+'"><span class="k">'+"ABCD"[p]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+
    '<div class="ex-foot">'+(VX.i?'<button class="ghost" id="exPrev">'+ic("left")+'Önceki</button>':'<a class="linkbtn" href="#sinav-kelime">Sınavdan çık</a>')+'<span class="sp"></span>'+
      '<button class="primary" id="exNext"'+(sel===undefined?" disabled":"")+'>'+(VX.i+1<n?"Sonraki":"Sınavı bitir")+ic("right")+'</button></div>'+
    '<p class="note ex-hint">Sınav sırasında cevaplar gösterilmez; sonunda bilemediğin kelimeler anlamlarıyla birlikte gelir.</p></div>';
  box.querySelectorAll("#exOpts .opt").forEach(b=>b.onclick=()=>{VX.pick[VX.i]=+b.dataset.i;markActive();renderVExam()});
  if($("exPrev"))$("exPrev").onclick=()=>{VX.i--;renderVExam()};
  $("exNext").onclick=()=>{if(VX.pick[VX.i]===undefined)return;if(VX.i+1<n){VX.i++;renderVExam()}else finishVExam()};
}
function finishVExam(){
  const miss=[];let ok=0;
  VX.qs.forEach((q,i)=>{const w=q.w[0];
    if(q.opts[VX.pick[i]]===q.right){ok++;P.learned[w]=1;srsLearn(w)}
    else{miss.push(w);delete P.learned[w];srsWrong(w)}});
  P.vexam=P.vexam||{};const prev=P.vexam[VX.d.id];
  P.vexam[VX.d.id]={at:Date.now(),ok,n:VX.qs.length,miss,best:Math.max(ok,prev?prev.best||prev.ok:0)};
  P.vmiss=miss.slice();save();VX.done=true;
  const h="sinav-k-"+VX.d.id+"-sonuc";try{history.replaceState(null,"","#"+h)}catch(e){}lastHash=h;
  renderVResult(VX.d,VX);window.scrollTo({top:0,behavior:"auto"});
}
function renderVResult(d,run){
  const box=$("exam"),r=P.vexam&&P.vexam[d.id];if(!box)return;
  if(!r){location.hash="sinav-k-"+d.id;return}
  const v=vVerdict(r.ok/r.n),idx=DECKS.indexOf(d);
  const next=DECKS.slice(idx+1).find(x=>!(P.vexam&&P.vexam[x.id]&&P.vexam[x.id].ok/P.vexam[x.id].n>=.85));
  const missW=(r.miss||[]).map(winfo).filter(Boolean),isLast=run||(P.vmiss||[]).join()===(r.miss||[]).join();
  let h='<div class="exres" style="--c:'+d.hue+'">'+
    '<section class="card ex-sum v-'+v.k+'"><div class="ex-score"><b>'+Math.round(r.ok/r.n*100)+'<small>%</small></b><span>'+r.ok+' / '+r.n+' doğru</span></div>'+
      '<div><small class="eyebrow">Kelime destesi · '+esc(d.name)+' · '+esc(d.level)+'</small><h2>'+esc(v.short)+'</h2><p>'+esc(v.long)+(r.ok?' Doğru bildiğin '+r.ok+' kelime öğrenildi sayıldı.':'')+'</p>'+
      '<div class="hero-row">'+(v.k==="bad"?'<a class="primary" href="#ogren-'+d.id+'">Desteyi çalış<span class="arr">'+ic("right")+'</span></a>'
        :missW.length&&isLast?'<a class="primary" href="#ogren-eksik">Bilemediğin '+missW.length+' kelimeyi çalış<span class="arr">'+ic("right")+'</span></a>'
        :next?'<a class="primary" href="#sinav-k-'+next.id+'">Sonraki deste: '+esc(next.name)+'<span class="arr">'+ic("right")+'</span></a>':'<a class="primary" href="#sinav-kelime">Tüm desteler</a>')+
      '<a class="ghost" href="#sinav-k-'+d.id+'">'+ic("refresh")+'Yeniden gir</a></div></div></section>';
  if(missW.length){
    h+='<section class="card ex-review"><h2 class="tres-h">Bilemediğin kelimeler <small>'+missW.length+'</small></h2><p class="note" style="margin:-6px 0 0">Bu kelimeler tekrar kutuna eklendi; yarın Tekrar zamanı\'nda yeniden karşına çıkacak.</p>'+
      missW.map(w=>'<div class="ex-w ex-vw"><div class="ex-vh"><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span><span class="sp"></span>'+sayBtn(w[0],"sm")+savBtn(w[0],"sm")+'</div>'+
        (w[3]?'<p class="note">'+hl(w[3])+' · '+esc(w[4]||"")+'</p>':'')+'</div>').join("")+'</section>';
  }else h+='<section class="card ex-review"><h2 class="tres-h">Tüm kelimeleri bildin!</h2><p class="note" style="margin:0">Bu destenin bütün kelimeleri öğrenildi olarak işaretlendi.</p></section>';
  h+='<p class="note ex-back"><a href="#sinav-kelime">'+ic("left")+'Tüm desteler</a></p></div>';
  box.innerHTML=h;
}
function renderVList(){
  const box=$("exam");if(!box)return;VX=null;EXTAB="kelime";
  const done=DECKS.filter(d=>P.vexam&&P.vexam[d.id]).length;
  box.innerHTML=examTabs()+'<p class="note ex-intro">Her destedeki '+DECKS[0].words.length+' kelime için birer soru: anlamını seç, İngilizcesini bul ya da cümledeki boşluğu doldur. '+done+' / '+DECKS.length+' deste sınandı.</p>'+
    '<div class="ex-g ex-vlist">'+DECKS.map(d=>{const r=P.vexam&&P.vexam[d.id],v=r&&vVerdict(r.ok/r.n);
      return '<a class="ex-t" href="#sinav-k-'+d.id+(r?'-sonuc':'')+'" style="--c:'+d.hue+'"><span class="mod-ic ex-vic">'+ic(d.icon)+'</span><div><b>'+esc(d.name)+'</b><small>'+esc(d.level)+' · '+d.words.length+' soru</small></div>'+
        (r?'<span class="gt-ex v-'+v.k+'">'+r.ok+'/'+r.n+'<i> · '+v.short+'</i></span>':'<span class="ex-new">Sınava gir</span>')+ic("right")+'</a>'}).join("")+'</div>';
}
