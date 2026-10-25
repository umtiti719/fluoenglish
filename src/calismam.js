/* ================= ÇALIŞMAM =================
   Üst menüde profil simgesinin solundaki "Çalışmam" düğmesi (giriş yapınca görünür) bu sayfayı açar:
   kayıtlı kelimeler, kayıtlı cümleler ve tüm bölümlerdeki çalışma durumu tek yerde.
   Kayıtlı cümleler: P.sents[metin]=[en,tr,kaynak,zaman] · silinenler P._del["s:"+metin] (cihazlar arası) */

/* ---------- Cümle kaydetme ---------- */
function sntKey(en){return plain(String(en||"")).replace(/\s+/g," ").trim()}
function isSnt(en){return !!(P.sents&&P.sents[sntKey(en)])}
function sntBtn(en,tr,src,cls){
  const k=sntKey(en);if(!k)return "";
  return '<button class="savebtn snt '+(cls||"")+(isSnt(k)?" on":"")+'" data-snt="'+esc(k)+'" data-sntr="'+esc(plain(tr||""))+'" data-snsrc="'+esc(src||"")+'" aria-pressed="'+isSnt(k)+'" aria-label="Cümleyi kaydet" title="Cümleyi kaydet">'+ic("bookmark")+'</button>';
}
function setSntBtn(b){const on=isSnt(b.dataset.snt);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)}
function toggleSnt(en,tr,src){
  const k=sntKey(en);if(!k)return;
  P.sents=P.sents||{};P._del=P._del||{};
  if(P.sents[k]){delete P.sents[k];P._del["s:"+k]=Date.now();toast("Cümle kayıtlardan çıkarıldı")}
  else{P.sents[k]=[k,tr||"",src||"",Date.now()];delete P._del["s:"+k];toast("Cümle kaydedildi")}
  save();
  document.querySelectorAll("[data-snt]").forEach(b=>{if(b.dataset.snt===k)setSntBtn(b)});
  if(lastHash==="calismam")renderStudy();
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-snt]");
  if(b){e.stopPropagation();e.preventDefault();toggleSnt(b.dataset.snt,b.dataset.sntr,b.dataset.snsrc)}
},true);

/* ---------- Üst menü düğmesi ---------- */
function renderStudyBtn(){
  const el=document.getElementById("studyBtn");if(!el)return;
  el.hidden=!signedIn();
}

/* ---------- Sayfa ---------- */
var STUDY={tab:"durum"};
function stRow(label,val,max,c,href,note){
  const pct=max?Math.round(val/max*100):0;
  return '<a class="st-row" href="'+href+'" style="--c:'+c+'"><div class="st-rt"><b>'+esc(label)+'</b><span>'+(note||val+" / "+max)+'</span></div><div class="mbar"><i style="width:'+pct+'%"></i></div></a>';
}
function studyAdvice(){
  // Sınav sonuçlarına göre çalışılması gereken konular, sonra yarım kalan konular
  const out=[];
  Object.keys(GRAMMAR_LEVELS).forEach(lv=>{const r=P.exam&&P.exam[lv];if(!r)return;
    GRAMMAR.filter(t=>t.level===lv).forEach(t=>{const s=r.t[t.id];if(s!==undefined&&s<=1)out.push([t,"Ünite sınavında "+s+"/3"])})});
  GRAMMAR.forEach(t=>{const g=P.gram[t.id];if(g&&!g.done&&!out.some(o=>o[0]===t))out.push([t,"Alıştırma: "+g.best+"/"+g.total])});
  return out.slice(0,6);
}
function renderStudy(){
  const box=$("study");if(!box)return;
  const learned=Object.keys(P.learned).length,saved=Object.values(P.saved),sents=Object.values(P.sents||{}).sort((a,b)=>(b[3]||0)-(a[3]||0));
  const due=dueWords().length,lv=P.level?CEFR[P.level.idx].code:"–";
  const tabs=[["durum","Çalışma durumu",ic("target")],["kelime","Kelimelerim",ic("bookmark")+'<i class="tn">'+saved.length+'</i>'],["cumle","Cümlelerim",ic("chat")+'<i class="tn">'+sents.length+'</i>']];
  let h='<div class="prof-stats st-top">'+[[learned,"öğrenilen kelime"],[gramDone()+"/"+GRAMMAR.length,"gramer konusu"],[lv,"seviye"],[streakCount(),"günlük seri"]].map(([b,s])=>'<div class="stat"><b>'+b+'</b><span>'+s+'</span></div>').join("")+'</div>';
  h+='<div class="chips-row st-tabs" role="tablist">'+tabs.map(([k,l,i])=>'<button class="fchip" role="tab" data-st="'+k+'" aria-pressed="'+(STUDY.tab===k)+'" aria-selected="'+(STUDY.tab===k)+'" style="--c:var(--brand)">'+i+l+'</button>').join("")+'</div>';
  if(STUDY.tab==="durum"){
    const adv=studyAdvice();
    h+='<div class="st-grid">';
    // Öneriler
    h+='<section class="sgroup st-adv"><h2>'+ic("bulb")+'Sırada ne var?</h2>'+
      (due?'<div class="srow"><div><b>'+due+' kelimenin tekrar zamanı geldi</b><small>Unutmadan önce kısa bir tekrar yap.</small></div><a class="primary" href="#ogren-tekrar">Tekrar et</a></div>':'')+
      (adv.length?adv.map(([t,why])=>'<div class="srow"><div><b>'+esc(t.title)+'</b><small>'+esc(t.level+" · "+why)+'</small></div><a class="ghost" href="#g-'+t.id+'">Çalış</a></div>').join("")
        :'<div class="srow"><div><b>'+(P.exam&&Object.keys(P.exam).length?"Eksik konu görünmüyor":"Bildiklerini ölç")+'</b><small>'+(P.exam&&Object.keys(P.exam).length?"Bir sonraki ünitenin sınavına girebilirsin.":"Ünite sınavına gir; sonuca göre hangi konuları çalışman gerektiğini gösterelim.")+'</small></div><a class="ghost" href="#sinav">Ünite sınavları</a></div>')+
      '</section>';
    // Üniteler
    h+='<section class="sgroup"><h2>'+ic("target")+'Ünite sınavları</h2>'+Object.entries(GRAMMAR_LEVELS).map(([k,L],i)=>{const r=P.exam&&P.exam[k];
      return '<div class="srow"><div><b>Ünite '+(i+1)+' · '+k+' '+esc(L.name)+'</b><small>'+(r?examVerdict(r.ok/r.n).short+" · son sonuç "+r.ok+"/"+r.n:"Henüz girilmedi")+'</small></div><a class="ghost" href="#sinav-'+k.toLowerCase()+'">'+(r?"Yeniden gir":"Sınava gir")+'</a></div>'}).join("")+'</section>';
    // Dil bilgisi
    h+='<section class="sgroup"><h2>'+ic("book")+'Dil bilgisi</h2><div class="st-rows">'+Object.entries(GRAMMAR_LEVELS).map(([k,L])=>{const ts=GRAMMAR.filter(t=>t.level===k);
      return stRow(k+" · "+L.name,ts.filter(t=>P.gram[t.id]?.done).length,ts.length,L.color,"#gramer")}).join("")+'</div></section>';
    // Kelime desteleri
    const started=DECKS.filter(d=>learnedIn(d)>0).sort((a,b)=>learnedIn(b)/b.words.length-learnedIn(a)/a.words.length);
    h+='<section class="sgroup"><h2>'+ic("cards")+'Kelime desteleri</h2><div class="st-rows">'+
      (started.length?started.map(d=>stRow(d.name,learnedIn(d),d.words.length,d.hue,"#ogren-"+d.id)).join(""):'<p class="note st-empty">Henüz bir desteye başlamadın. <a href="#ogren">Kelime Öğren</a>\'den bir deste seç.</p>')+
      '<p class="note st-sum">'+started.length+' / '+DECKS.length+' desteye başladın · toplam '+ALLWORDS.length+' kelime</p></div></section>';
    // Diğer
    const rd=Object.keys(P.read||{}).length,dl=Object.values(P.daily||{}).filter(x=>x&&x.done).length,sp=P.speakStat||{n:0,ok:0},ls=P.listen||{n:0,ok:0};
    h+='<section class="sgroup"><h2>'+ic("pulse")+'Diğer çalışmalar</h2>'+
      [["Okuma",rd+" / "+READING.length+" metin okundu","#okuma"],["Günün dersi",dl?dl+" ders tamamlandı (son 30 gün)":"Bugünkü dersi henüz bitirmedin","#gunun"],
       ["Dinleme",ls.n?ls.ok+" / "+ls.n+" doğru":"Henüz denemedin","#dinle"],["Telaffuz",sp.n?sp.ok+" / "+sp.n+" başarılı":"Henüz denemedin","#telaffuz"],
       ["Metin çevirisi",(P.trans||0)+" metin çevrildi","#metin"],["Seviye testi",P.level?CEFR[P.level.idx].code+" · "+new Date(P.level.date).toLocaleDateString("tr-TR"):"Henüz girilmedi","#seviye"]]
       .map(([a,b,c])=>'<a class="srow st-link" href="'+c+'"><div><b>'+a+'</b><small>'+b+'</small></div>'+ic("right")+'</a>').join("")+'</section>';
    h+='</div>';
  }else if(STUDY.tab==="kelime"){
    const list=saved.slice().sort((a,b)=>a[0].localeCompare(b[0]));
    h+=list.length?'<div class="st-bar"><span class="note">'+list.length+' kayıtlı kelime</span><a class="ghost" href="#defter">'+ic("cards")+'Defterim\'de çalış</a></div>'+
      '<div class="st-words">'+list.map(w=>{const s=P.srs[w[0]];return '<div class="st-w"><div><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span>'+(s&&s.b?'<i class="st-box" title="Hafıza kutusu">'+s.b+'/5</i>':'')+'</div>'+sayBtn(w[0],"sm")+savBtn(w[0],"sm")+'</div>'}).join("")+'</div>'
      :'<div class="empty aurora"><span class="mod-ic">'+ic("bookmark")+'</span><h3>Henüz kayıtlı kelime yok</h3><p>Kartlarda ve metinlerde kelimelerin yanındaki '+ic("bookmark")+' işaretine dokunarak buraya ekleyebilirsin.</p><a class="primary" href="#ogren">Kelime Öğren</a></div>';
  }else{
    h+=sents.length?'<div class="st-bar"><span class="note">'+sents.length+' kayıtlı cümle</span></div><div class="st-sents">'+sents.map(s=>'<div class="ex st-s"><div><p>'+esc(s[0])+'</p>'+(s[1]?'<small>'+esc(s[1])+'</small>':'')+(s[2]?'<span class="st-src">'+esc(s[2])+'</span>':'')+'</div><div class="dbtns">'+sayBtn(s[0],"sm")+sntBtn(s[0],s[1],s[2],"sm")+'</div></div>').join("")+'</div>'
      :'<div class="empty aurora"><span class="mod-ic">'+ic("chat")+'</span><h3>Henüz kayıtlı cümle yok</h3><p>Dil bilgisi örneklerinde, kelime kartlarında, Cümle Kur ve Dinleme sonuçlarında cümlenin yanındaki '+ic("bookmark")+' işaretine dokun; cümle buraya eklenir.</p><a class="primary" href="#gramer">Dil Bilgisi</a></div>';
  }
  box.innerHTML=h;
  box.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{STUDY.tab=b.dataset.st;renderStudy()});
}
