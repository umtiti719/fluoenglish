/* ================= BÖLÜM TESTİ (dil bilgisi konusunun en altında) =================
   İsteğe bağlı. Konunun alıştırma soruları + ünite sınavı soruları + "Hangisi doğru?" (sık yapılan hatalardan) karışık gelir.
   Sınav sırasında doğru/yanlış gösterilmez; sonunda puan, değerlendirme ve açıklamalar. Sonuç: P.ttest[konu]={best,last,n,at,runs}
   %60 ve üstü konu "tamamlandı" sayılır. */
var TT=null;
function ttBuild(t){
  const items=[];
  (t.quiz||[]).forEach(q=>items.push({q:q[0],opts:q[1],right:q[2],why:q[3]}));
  ((typeof EXAM!=="undefined"&&EXAM[t.id])||[]).forEach(q=>items.push({q:q[0],opts:q[1],right:q[2],why:q[3]}));
  (t.mistakes||[]).slice(0,3).forEach(m=>items.push({q:"Hangisi doğru?",opts:[m[0],plain(m[1])],right:1,why:m[2]}));
  return shuffle(items).map(it=>{const order=shuffle(it.opts.map((_,i)=>i));return{...it,order}});
}
function ttVerdict(r){return r>=.85?{k:"ok",t:"Konuyu biliyorsun",d:"Harika! Bir sonraki konuya geçebilirsin."}:r>=.6?{k:"mid",t:"Birkaç eksik var",d:"Konu tamamlandı sayıldı. Yanlışlarının açıklamalarına göz at."}:{k:"bad",t:"Konuyu tekrar et",d:"Anlatımı ve sık yapılan hataları bir kez daha oku, sonra yeniden dene."}}
function ttIntro(t){
  const r=P.ttest&&P.ttest[t.id],n=ttBuild(t).length;
  return '<div class="tt-intro"><div><b>'+n+' soruluk bölüm testi</b><span>İstersen konuyu bitirince kendini dene. Cevaplar testin sonunda gösterilir.'+
    (r?' Son sonucun <b>'+r.last+'/'+r.n+'</b>, en iyisi <b>'+r.best+'/'+r.n+'</b>.':'')+'</span></div><button class="primary" id="ttStart">'+(r?ic("refresh")+"Yeniden çöz":"Teste başla"+ic("right"))+'</button></div>';
}
function ttRender(){
  const box=$("ttest");if(!box||!TT)return;
  const t=TT.t,L=GRAMMAR_LEVELS[t.level];
  if(TT.phase==="intro"){box.innerHTML=ttIntro(t);$("ttStart").onclick=()=>{TT={t,phase:"run",items:ttBuild(t),i:0,pick:[]};ttRender();$("s-test").scrollIntoView({behavior:reduceMotion()?"auto":"smooth",block:"start"})};return}
  if(TT.phase==="run"){
    const n=TT.items.length,it=TT.items[TT.i],sel=TT.pick[TT.i],parts=esc(it.q).split("___");
    box.innerHTML='<div class="tt-run" style="--c:'+L.color+'"><div class="ex-top"><span class="badge" style="--c:'+L.color+'">Bölüm testi</span><span class="note">Soru '+(TT.i+1)+' / '+n+'</span></div>'+
      '<div class="mbar ex-bar"><i style="width:'+(TT.i/n*100)+'%"></i></div>'+
      '<p class="pr-q tt-q">'+parts[0]+(parts.length>1?'<span class="blank">'+(sel!==undefined?esc(it.opts[sel]):"&nbsp;")+'</span>'+parts[1]:"")+'</p>'+
      '<div class="opts'+(it.opts.length===2?" dg-opts":"")+'" id="ttOpts">'+it.order.map((oi,p)=>'<button class="opt'+(sel===oi?" sel":"")+'" data-i="'+oi+'"><span class="k">'+"ABCD"[p]+'</span><span>'+esc(it.opts[oi])+'</span></button>').join("")+'</div>'+
      '<div class="ex-foot">'+(TT.i?'<button class="ghost" id="ttPrev">'+ic("left")+'Önceki</button>':'<button class="linkbtn" id="ttQuit">Testten çık</button>')+'<span class="sp"></span><button class="primary" id="ttNext"'+(sel===undefined?" disabled":"")+'>'+(TT.i+1<n?"Sonraki":"Testi bitir")+ic("right")+'</button></div></div>';
    box.querySelectorAll("#ttOpts .opt").forEach(b=>b.onclick=()=>{TT.pick[TT.i]=+b.dataset.i;markActive();ttRender()});
    if($("ttPrev"))$("ttPrev").onclick=()=>{TT.i--;ttRender()};
    if($("ttQuit"))$("ttQuit").onclick=()=>{TT={t,phase:"intro"};ttRender()};
    $("ttNext").onclick=()=>{if(TT.pick[TT.i]===undefined)return;if(TT.i+1<n){TT.i++;ttRender()}else ttFinish()};
    return;
  }
  // sonuç
  const n=TT.items.length,ok=TT.items.filter((it,i)=>TT.pick[i]===it.right).length,v=ttVerdict(ok/n),wrong=TT.items.map((it,i)=>[it,TT.pick[i]]).filter(([it,p])=>p!==it.right);
  const idx=GRAMMAR.indexOf(t),nxt=GRAMMAR[idx+1];
  box.innerHTML='<div class="tt-res"><div class="ex-sum v-'+v.k+' tt-sum"><div class="ex-score"><b>'+Math.round(ok/n*100)+'<small>%</small></b><span>'+ok+' / '+n+' doğru</span></div>'+
    '<div><h3>'+v.t+'</h3><p>'+v.d+'</p><div class="hero-row">'+(v.k!=="bad"&&nxt?'<a class="primary" href="#g-'+nxt.id+'">Sonraki konu: '+esc(nxt.title)+'<span class="arr">'+ic("right")+'</span></a>':'')+
    '<button class="ghost" id="ttAgain">'+ic("refresh")+'Yeniden çöz</button>'+(v.k==="bad"?'<button class="ghost" id="ttTop">'+ic("book")+'Anlatıma dön</button>':'')+'</div></div></div>'+
    (wrong.length?'<div class="tt-wrong"><h3 class="tres-h">Yanlış cevapların <small>'+wrong.length+'</small></h3>'+wrong.map(([it,p])=>'<div class="ex-w"><p class="ex-wq">'+(it.q==="Hangisi doğru?"?esc(it.opts[it.right]):esc(it.q).replace("___","<u>"+esc(it.opts[it.right])+"</u>"))+'</p>'+
      '<p class="ex-wa"><span class="chip miss">Senin cevabın: '+esc(it.opts[p])+'</span>'+(it.q==="Hangisi doğru?"?'':'<span class="chip hit">Doğrusu: '+esc(it.opts[it.right])+'</span>')+'</p><p class="note">'+ic("bulb")+esc(it.why)+'</p></div>').join("")+'</div>'
      :'<p class="note tt-perfect">'+ic("check")+'Tüm soruları doğru cevapladın!</p>')+'</div>';
  $("ttAgain").onclick=()=>{TT={t,phase:"run",items:ttBuild(t),i:0,pick:[]};ttRender();$("s-test").scrollIntoView({behavior:reduceMotion()?"auto":"smooth",block:"start"})};
  if($("ttTop"))$("ttTop").onclick=()=>window.scrollTo({top:0,behavior:reduceMotion()?"auto":"smooth"});
}
function ttFinish(){
  const t=TT.t,n=TT.items.length,ok=TT.items.filter((it,i)=>TT.pick[i]===it.right).length;
  P.ttest=P.ttest||{};const prev=P.ttest[t.id];
  P.ttest[t.id]={best:Math.max(ok,prev?prev.best:0),last:ok,n,at:Date.now(),runs:(prev?prev.runs||1:0)+1};
  if(ok/n>=.6){const g=P.gram[t.id]||{best:0,total:t.quiz.length,done:false};P.gram[t.id]={...g,done:true}}
  save();TT.phase="end";ttRender();$("s-test").scrollIntoView({behavior:reduceMotion()?"auto":"smooth",block:"start"});
}
function ttMount(t){TT={t,phase:"intro"};ttRender()}
/* Çalışmam'daki özet */
function ttSummaryHtml(){
  const list=GRAMMAR.filter(t=>P.ttest&&P.ttest[t.id]).sort((a,b)=>P.ttest[b.id].at-P.ttest[a.id].at);
  return '<section class="sgroup"><h2>'+ic("check")+'Bölüm testleri <small class="note">'+list.length+' / '+GRAMMAR.length+'</small></h2>'+
    (list.length?list.slice(0,8).map(t=>{const r=P.ttest[t.id],v=ttVerdict(r.last/r.n);
      return '<div class="srow"><div><b>'+esc(t.title)+'</b><small>'+t.level+' · son '+r.last+'/'+r.n+' · en iyi '+r.best+'/'+r.n+' · '+new Date(r.at).toLocaleDateString("tr-TR",{day:"numeric",month:"short"})+'</small></div><span class="gt-ex v-'+v.k+' tt-chip">'+v.t+'</span><a class="ghost" href="#g-'+t.id+'-test">'+(v.k==="ok"?"Aç":"Tekrar")+'</a></div>'}).join("")+
      (list.length>8?'<p class="note" style="margin:0 0 14px">ve '+(list.length-8)+' test daha…</p>':'')
    :'<div class="srow"><div><b>Henüz bölüm testi çözmedin</b><small>Her dil bilgisi konusunun en altında isteğe bağlı bir test var.</small></div><a class="ghost" href="#gramer">Konular</a></div>')+'</section>';
}
