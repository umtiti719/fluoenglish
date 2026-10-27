/* ================= SIK YAPILAN HATALAR =================
   #hatalar: kategoriye göre liste + "Kendini dene" (iki cümleden doğrusunu seç, 10 soru). Sonuç: P.mist={best,n} */
var HT={cat:"all",quiz:null};
function renderMistakes(){
  const box=$("htBox");if(!box)return;
  if(HT.quiz){renderMistQuiz();return}
  const cats=[...new Set(MISTAKES.map(m=>m[0]))],list=MISTAKES.filter(m=>HT.cat==="all"||m[0]===HT.cat),best=P.mist&&P.mist.best;
  box.innerHTML='<div class="ex-cta ht-cta"><span class="mod-ic">'+ic("target")+'</span><div><b>Kendini dene</b><span>İki cümleden doğrusunu seç · 10 soru.'+(best!==undefined?' En iyi sonucun: '+best+'/10':'')+'</span></div><button class="primary" id="htStart">Başla'+ic("right")+'</button></div>'+
    '<div class="chips-row" id="htCats">'+[["all","Tümü"],...cats.map(c=>[c,c])].map(([k,l])=>'<button class="fchip" data-c="'+esc(k)+'" aria-pressed="'+(HT.cat===k)+'">'+esc(l)+'</button>').join("")+'</div>'+
    '<div class="mistakes ht-list">'+list.map(m=>'<div class="mistake"><div class="wrong">'+ic("x")+'<span>'+esc(m[1])+'</span></div><div class="right">'+ic("check")+'<span>'+esc(m[2])+'</span>'+sayBtn(m[2],"sm")+sntBtn(m[2],"","Sık yapılan hatalar","sm")+'</div><p>'+ic("bulb")+esc(m[3])+'</p></div>').join("")+'</div>';
  box.querySelectorAll("#htCats .fchip").forEach(b=>b.onclick=()=>{HT.cat=b.dataset.c;renderMistakes()});
  $("htStart").onclick=()=>{HT.quiz={items:shuffle(pickFresh(MISTAKES,m=>"h:"+m[1],10)).map(m=>({m,right:Math.random()<.5?0:1})),i:0,ok:0,ans:null};renderMistakes();window.scrollTo({top:0,behavior:"auto"})};
}
function renderMistQuiz(){
  const box=$("htBox"),Q=HT.quiz,n=Q.items.length;
  if(Q.i>=n){
    P.mist=P.mist||{};P.mist.best=Math.max(P.mist.best||0,Q.ok);P.mist.n=(P.mist.n||0)+1;if(!Q.saved){Q.saved=1;save()}
    box.innerHTML='<div class="card exrun"><div class="pr-end"><div class="pr-score">'+Q.ok+' / '+n+'</div><p style="margin:0;font-weight:700">'+(Q.ok===n?"Kusursuz! Bu tuzakların hiçbirine düşmedin.":Q.ok>=7?"Çok iyi. Yanlış yaptığın kalıplara listeden bir göz at.":"Bu hatalar çok yaygın. Listeyi okuyup yeniden dene.")+'</p>'+
      '<div class="endbtns"><button class="ghost" id="htList">'+ic("left")+'Listeye dön</button><button class="primary" id="htAgain">'+ic("refresh")+'Yeniden dene</button></div></div></div>';
    $("htList").onclick=()=>{HT.quiz=null;renderMistakes()};
    $("htAgain").onclick=()=>{HT.quiz=null;renderMistakes();$("htStart").click()};
    return;
  }
  const it=Q.items[Q.i];touch("h:"+it.m[1]);const opts=it.right===0?[it.m[2],it.m[1]]:[it.m[1],it.m[2]],done=Q.ans!==null;
  box.innerHTML='<div class="card exrun"><div class="ex-top"><span class="badge">'+esc(it.m[0])+'</span><span class="note">Soru '+(Q.i+1)+' / '+n+'</span></div>'+
    '<div class="mbar ex-bar" style="--c:var(--brand)"><i style="width:'+(Q.i/n*100)+'%"></i></div><p class="pr-q ht-q">Hangisi doğru?</p>'+
    '<div class="opts dg-opts">'+opts.map((o,p)=>'<button class="opt'+(done?(o===it.m[2]?" ok":Q.ans===p?" no":""):"")+'" data-p="'+p+'"'+(done?" disabled":"")+'><span class="k">'+"AB"[p]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+
    (done?'<p class="note ht-why">'+ic("bulb")+'<span>'+esc(it.m[3])+'</span></p><div class="pr-act"><button class="primary" id="htNext">'+(Q.i+1<n?"Sonraki soru":"Sonucu gör")+ic("right")+'</button></div>':'')+
    '<div class="ex-foot"><button class="linkbtn" id="htQuit">Testten çık</button></div></div>';
  box.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{if(Q.ans!==null)return;const p=+b.dataset.p;Q.ans=p;markActive();if(opts[p]===it.m[2]){Q.ok++;speak(it.m[2],null)}renderMistQuiz()});
  if($("htNext"))$("htNext").onclick=()=>{Q.i++;Q.ans=null;renderMistQuiz()};
  $("htQuit").onclick=()=>{HT.quiz=null;renderMistakes()};
}
