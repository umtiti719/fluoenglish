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

function renderExamList(){
  const box=$("exam");if(!box)return;EX=null;
  box.innerHTML='<div class="ex-units">'+Object.entries(GRAMMAR_LEVELS).map(([k,L])=>{
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
  // h: "sinav" | "sinav-a1" | "sinav-a1-sonuc"
  const m=h.match(/^sinav-(a1|a2|b1|b2)(-sonuc)?$/);
  if(h==="sinav"){renderExamList();return true}
  if(!m)return false;
  const lv=m[1].toUpperCase();
  if(m[2]){renderExamResult(lv,EX&&EX.lv===lv&&EX.done?EX:null);return true}
  startExam(lv);return true;
}
