/* ================= YARIŞMA TÜRLERİ =================
   Klasik yarışmaya ek olarak: 60 Saniye, Doğru mu?, Eşleştir, Dinle ve Yaz. Hepsi seviye seçerek oynanır.
   Rekorlar: P.best["m:<tür>:<seviye>"] (Eşleştir'de en kısa süre, diğerlerinde en yüksek puan). Son oyunlar: P.qhist */
var QMODES={
  klasik:{t:"Klasik",icon:"trophy",d:"10 kelime, her biri için süre. Hız bonusu ve seri çarpanı.",rules:["10 kelime","Süre sınırı","Hızlı cevap = bonus","Seri yap, puanı katla"]},
  hizli:{t:"60 Saniye",icon:"clock",d:"Bir dakikada bildiğin kadar kelimenin anlamını bul.",rules:["60 saniye","Sınırsız soru","Her doğru 1 puan"]},
  dy:{t:"Doğru mu?",icon:"check",d:"Kelime ile anlam eşleşiyor mu? Hızlıca karar ver.",rules:["60 saniye","Doğru +1, yanlış −1","Klavye: ← yanlış · → doğru"]},
  eslestir:{t:"Eşleştir",icon:"puzzle",d:"Kelimeleri anlamlarıyla eşleştir. En kısa süre kazanır.",rules:["3 tur × 5 kelime","Yanlış eşleşme +2 sn","En kısa süre rekor"]},
  yaz:{t:"Dinle ve Yaz",icon:"headphones",d:"Kelimeyi dinle, Türkçesine bak, İngilizcesini yaz.",rules:["10 kelime","Doğru 10 puan","İpucu alırsan 5 puan"]}
};
var G2=null;
const qMode=()=>QMODES[P.set.qMode]?P.set.qMode:"klasik";
const m2Key=(m,k)=>"m:"+m+":"+k;
function m2Best(m,k){const v=P.best[m2Key(m,k)];return v===undefined?null:v}
function m2BestLabel(m,k){if(m==="klasik")return "Rekor <b>"+(P.best[k]||0)+"</b>";const v=m2Best(m,k);return v===null?"Rekor <b>–</b>":"Rekor <b>"+v+(m==="eslestir"?" sn":"")+"</b>"}
function m2Pool(k){return shuffle(WORDS[k].filter(w=>w[1]))}
function m2Stop(){if(!G2)return;clearInterval(G2.tick);clearTimeout(G2.tm);G2=null;if(G.phase==="m2")G.phase="lobby"}
function m2Start(mode,k){
  const L=LEVELS[k];m2Stop();
  G2={mode,k,L,c:"var(--lv-"+k+")",score:0,ok:0,no:0,hint:0,missed:[],start:Date.now(),pool:m2Pool(k),pi:0,lock:false};
  G.phase="m2";$("lobby").hidden=true;$("ready").hidden=true;$("modeBar").hidden=false;$("lobbyMore").hidden=true;$("quizHead").hidden=true;$("game").hidden=true;$("end").hidden=true;
  const box=$("game2");box.hidden=false;box.style.setProperty("--c",G2.c);
  if(mode==="hizli"||mode==="dy"){G2.left=60;G2.end=Date.now()+60000;G2.tick=setInterval(m2Timer,200)}
  if(mode==="eslestir"){G2.round=0;G2.pen=0;m2MatchRound()}
  else if(mode==="yaz"){G2.list=G2.pool.slice(0,10);G2.i=0;m2YazQ()}
  else m2Next();
  window.scrollTo({top:0,behavior:"auto"});markActive();
}
function m2Take(){if(G2.pi>=G2.pool.length){G2.pool=m2Pool(G2.k);G2.pi=0}return G2.pool[G2.pi++]}
function m2Timer(){
  if(!G2)return;const left=Math.max(0,(G2.end-Date.now())/1000);G2.left=left;
  const f=$("m2Fill"),s=$("m2Sec");if(f){f.style.width=(left/60*100)+"%";s.textContent=Math.ceil(left)+" sn";$("m2Bar").classList.toggle("low",left<=10)}
  if(left<=0)m2Finish();
}
function m2Head(extra){
  const M=QMODES[G2.mode];
  return '<div class="hud"><span class="badge" style="--c:'+G2.c+'">'+M.t+' · '+G2.L.name+'</span><span class="qn">'+(extra||"")+'</span><div class="points"><b id="m2Pts">'+G2.score+'</b><small>'+(G2.mode==="eslestir"?"sn":"puan")+'</small></div></div>'+
    (G2.mode==="hizli"||G2.mode==="dy"?'<div class="timer"><div class="tbar" id="m2Bar"><i id="m2Fill" style="width:'+(G2.left/60*100)+'%"></i></div><span class="sec" id="m2Sec">'+Math.ceil(G2.left)+' sn</span></div>':'');
}
function m2Foot(){return '<div class="g2-foot"><button class="linkbtn" id="m2Quit">Bitir</button></div>'}
function m2BindFoot(){$("m2Quit").onclick=()=>m2Finish(true)}
/* ---------- 60 Saniye ---------- */
function m2Next(){
  if(!G2)return;G2.lock=false;
  if(G2.mode==="dy"){m2DyQ();return}
  const w=m2Take(),opts=shuffle([w[1],...shuffle(WORDS[G2.k].filter(x=>x[1]!==w[1])).slice(0,3).map(x=>x[1])]);G2.cur=w;
  $("game2").innerHTML=m2Head(G2.ok+" doğru")+
    '<div class="stage g2-stage"><p class="word">'+esc(w[0])+'</p><span class="pill">'+esc(w[2]||"")+'</span></div>'+
    '<div class="opts" id="m2Opts">'+opts.map((o,i)=>'<button class="opt" data-v="'+esc(o)+'"><span class="k">'+(i+1)+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+m2Foot();
  $("m2Opts").querySelectorAll(".opt").forEach(b=>b.onclick=()=>m2Pick(b));m2BindFoot();
}
function m2Pick(b){
  if(!G2||G2.lock)return;G2.lock=true;const ok=b.dataset.v===G2.cur[1];
  $("m2Opts").querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(x.dataset.v===G2.cur[1])x.classList.add("ok")});
  if(ok){G2.ok++;G2.score++;if(inBox(G2.cur[0]))srsOk(G2.cur[0])}else{b.classList.add("no");G2.no++;G2.missed.push(G2.cur);srsWrong(G2.cur[0])}
  $("m2Pts").textContent=G2.score;save();
  G2.tm=setTimeout(m2Next,ok?260:850);
}
/* ---------- Doğru mu? ---------- */
function m2DyQ(){
  const w=m2Take(),truth=Math.random()<.5,shown=truth?w[1]:shuffle(WORDS[G2.k].filter(x=>x[1]!==w[1]))[0][1];G2.cur=w;G2.truth=truth;G2.shown=shown;
  $("game2").innerHTML=m2Head(G2.ok+" doğru · "+G2.no+" yanlış")+
    '<div class="stage g2-stage dy-stage"><p class="word">'+esc(w[0])+'</p><p class="dy-eq">=</p><p class="dy-mean">'+esc(shown)+'</p></div>'+
    '<div class="dy-btns"><button class="dy-b no" id="dyNo">'+ic("x")+'Yanlış</button><button class="dy-b yes" id="dyYes">'+ic("check")+'Doğru</button></div>'+m2Foot();
  $("dyNo").onclick=()=>m2Dy(false);$("dyYes").onclick=()=>m2Dy(true);m2BindFoot();
}
function m2Dy(say){
  if(!G2||G2.lock)return;G2.lock=true;const ok=say===G2.truth;
  if(ok){G2.ok++;G2.score++}else{G2.no++;G2.score=Math.max(0,G2.score-1);G2.missed.push(G2.cur);srsWrong(G2.cur[0])}
  const st=document.querySelector(".dy-stage");st.classList.add(ok?"good":"bad");
  if(!ok&&!G2.truth)st.insertAdjacentHTML("beforeend",'<p class="dy-fix">Doğrusu: '+esc(G2.cur[1])+'</p>');
  $("m2Pts").textContent=G2.score;save();
  G2.tm=setTimeout(m2Next,ok?220:(G2.truth?700:1100));
}
/* ---------- Eşleştir ---------- */
function m2MatchRound(){
  if(!G2)return;
  if(G2.round>=3){m2Finish();return}
  const ws=[];while(ws.length<5){const w=m2Take();if(!ws.some(x=>x[1]===w[1]))ws.push(w)}
  G2.round++;G2.pairs=ws;G2.sel=null;G2.done=0;if(!G2.tick){G2.tick=setInterval(()=>{if(!G2)return;const s=Math.floor((Date.now()-G2.start)/1000)+G2.pen;G2.score=s;const e=$("m2Pts");if(e)e.textContent=s},250)}
  const left=shuffle(ws.map((w,i)=>[i,w[0]])),right=shuffle(ws.map((w,i)=>[i,w[1]]));
  $("game2").innerHTML=m2Head("Tur "+G2.round+" / 3")+
    '<p class="note g2-help">Bir İngilizce kelimeye, sonra Türkçe anlamına dokun.</p><div class="mt-grid"><div class="mt-col">'+left.map(([i,t])=>'<button class="mt-b" data-s="en" data-i="'+i+'">'+esc(t)+'</button>').join("")+'</div>'+
    '<div class="mt-col">'+right.map(([i,t])=>'<button class="mt-b tr" data-s="tr" data-i="'+i+'">'+esc(t)+'</button>').join("")+'</div></div>'+m2Foot();
  document.querySelectorAll(".mt-b").forEach(b=>b.onclick=()=>m2MatchTap(b));m2BindFoot();
}
function m2MatchTap(b){
  if(!G2||b.classList.contains("done"))return;
  if(!G2.sel||G2.sel.dataset.s===b.dataset.s){if(G2.sel)G2.sel.classList.remove("sel");G2.sel=b;b.classList.add("sel");return}
  const a=G2.sel;G2.sel=null;a.classList.remove("sel");
  if(a.dataset.i===b.dataset.i){[a,b].forEach(x=>{x.classList.add("done");x.disabled=true});G2.ok++;G2.done++;if(G2.done===5)G2.tm=setTimeout(m2MatchRound,450)}
  else{G2.no++;G2.pen+=2;const w=G2.pairs[+(a.dataset.s==="en"?a:b).dataset.i];if(!G2.missed.includes(w))G2.missed.push(w);
    [a,b].forEach(x=>{x.classList.add("bad");setTimeout(()=>x.classList.remove("bad"),450)})}
}
/* ---------- Dinle ve Yaz ---------- */
function m2Mask(w,show){return w.split("").map((c,i)=>c===" "?"&nbsp;&nbsp;":(i<show?esc(c):"_")).join(" ")}
function m2YazQ(){
  if(!G2)return;if(G2.i>=G2.list.length){m2Finish();return}
  const w=G2.list[G2.i];G2.cur=w;G2.hintN=0;G2.lock=false;
  $("game2").innerHTML=m2Head("Kelime "+(G2.i+1)+" / "+G2.list.length)+
    '<div class="stage g2-stage yz-stage"><button class="speak big" id="yzSay" aria-label="Dinle">'+ic("speaker")+'</button><p class="yz-tr">'+esc(w[1])+'</p><p class="yz-mask" id="yzMask">'+m2Mask(w[0],0)+'</p></div>'+
    '<form class="yz-form" id="yzForm" autocomplete="off"><input id="yzIn" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="İngilizcesini yaz…" aria-label="İngilizcesini yaz"><button class="primary" type="submit">Kontrol et</button></form>'+
    '<div class="yz-acts"><button class="ghost" id="yzHint">'+ic("bulb")+'İpucu</button><button class="linkbtn" id="yzSkip">Bilmiyorum</button></div><p class="feedback" id="yzFb"></p>'+m2Foot();
  const say=()=>speak(w[0],$("yzSay"));$("yzSay").onclick=say;setTimeout(()=>{if(G2&&G2.cur===w)say()},250);
  $("yzHint").onclick=()=>{if(G2.lock)return;G2.hintN=Math.min(G2.hintN+1,Math.max(1,w[0].length-1));$("yzMask").innerHTML=m2Mask(w[0],G2.hintN);$("yzIn").focus()};
  $("yzSkip").onclick=()=>m2YazDone(false);
  $("yzForm").onsubmit=e=>{e.preventDefault();if(G2.lock){return}const v=$("yzIn").value.trim().toLowerCase().replace(/\s+/g," ");if(!v)return;
    if(v===w[0].toLowerCase())m2YazDone(true);else{$("yzFb").textContent="Olmadı, bir daha dene ya da ipucu al.";$("yzFb").className="feedback no";$("yzIn").select()}};
  try{$("yzIn").focus({preventScroll:true})}catch(e){}m2BindFoot();
}
function m2YazDone(ok){
  if(!G2||G2.lock)return;G2.lock=true;const w=G2.cur;
  if(ok){const p=G2.hintN?5:10;G2.score+=p;G2.ok++;if(G2.hintN)G2.hint++;if(inBox(w[0]))srsOk(w[0])}else{G2.no++;G2.missed.push(w);srsWrong(w[0])}
  $("m2Pts").textContent=G2.score;$("yzMask").innerHTML=esc(w[0]);$("yzMask").classList.add(ok?"good":"bad");
  $("yzFb").textContent=ok?(G2.hintN?"Doğru! (+5, ipucuyla)":"Doğru! +10"):"Doğrusu: "+w[0];$("yzFb").className="feedback "+(ok?"ok":"no");
  $("yzIn").disabled=true;save();speak(w[0],null);G2.i++;G2.tm=setTimeout(m2YazQ,ok?1100:1900);
}
/* ---------- Bitiş ---------- */
function m2Finish(early){
  if(!G2)return;clearInterval(G2.tick);clearTimeout(G2.tm);G2.tick=null;
  const m=G2.mode,k=G2.k,key=m2Key(m,k),M=QMODES[m],prev=m2Best(m,k);
  let score=G2.score,valid=true;
  if(m==="eslestir"){score=Math.floor((Date.now()-G2.start)/1000)+G2.pen;valid=G2.round>=3&&G2.done===5&&!early}
  if(m==="yaz"&&early)valid=G2.i>0;
  const isRec=valid&&(m==="eslestir"?(prev===null||score<prev):score>0&&(prev===null||score>prev));
  if(isRec)P.best[key]=score;
  if(valid)P.qhist=(P.qhist||[]).concat([{t:Date.now(),k:key,n:M.t+" · "+G2.L.name,c:G2.L.cefr,p:score,u:m==="eslestir"?" sn":"",ok:G2.ok,q:G2.ok+G2.no,r:isRec?1:0}]).slice(-20);
  save();
  const missed=[...new Map(G2.missed.map(w=>[w[0],w])).values()];
  $("game2").innerHTML='<div class="g2-end"><span class="badge" style="--c:'+G2.c+';align-self:center">'+M.t+' · '+G2.L.name+'</span>'+
    '<div><div class="final">'+score+(m==="eslestir"?'<small> sn</small>':'')+'</div><p class="note">'+(m==="eslestir"?"toplam süre":"puan")+(valid?"":" · tamamlanmadı, rekora sayılmaz")+'</p></div>'+
    (isRec?'<span class="record">Yeni rekor!</span>':(prev!==null&&valid?'<p class="note">Rekorun: '+prev+(m==="eslestir"?" sn":"")+'</p>':''))+
    '<div class="stats4 g2-stats"><div class="stat"><b>'+G2.ok+'</b><span>'+(m==="eslestir"?"Eşleşme":"Doğru")+'</span></div><div class="stat"><b>'+G2.no+'</b><span>Yanlış</span></div>'+
      (m==="yaz"?'<div class="stat"><b>'+G2.hint+'</b><span>İpucuyla</span></div>':'')+'</div>'+
    (missed.length?'<div class="missed"><h3>Tekrar etmen gereken kelimeler</h3><div class="mlist">'+missed.slice(0,12).map(w=>'<div class="mrow"><span><b>'+esc(w[0])+'</b> <span>— '+esc(w[1])+'</span></span>'+savBtn(w[0],"sm")+'</div>').join("")+'</div></div>':'')+
    '<div class="endbtns"><button class="ghost" id="m2Lobby">Yarışmalar</button><button class="primary" id="m2Again">Tekrar oyna</button></div></div>';
  const mode=m;
  $("m2Lobby").onclick=()=>{G2=null;$("game2").hidden=true;G.phase="lobby";showQuiz();window.scrollTo({top:0,behavior:"auto"})};
  $("m2Again").onclick=()=>m2Start(mode,k);
  G2.finished=true;
}
document.addEventListener("keydown",e=>{
  if(!G2||G2.finished||$("game2").hidden||/INPUT|TEXTAREA/.test(document.activeElement&&document.activeElement.tagName))return;
  if(G2.mode==="dy"){if(e.key==="ArrowLeft"){e.preventDefault();m2Dy(false)}else if(e.key==="ArrowRight"){e.preventDefault();m2Dy(true)}}
  if(G2.mode==="hizli"){const n="1234".indexOf(e.key);if(n>=0){const b=document.querySelectorAll("#m2Opts .opt")[n];if(b&&!b.disabled)b.click()}}
});
/* ---------- Lobi: tür seçimi ---------- */
function renderModeBar(){
  const bar=$("modeBar");if(!bar)return;const m=qMode();
  bar.innerHTML='<div class="mode-tabs" role="tablist">'+Object.entries(QMODES).map(([k,M])=>'<button class="mode-t" role="tab" data-m="'+k+'" aria-selected="'+(m===k)+'">'+ic(M.icon)+'<span>'+M.t+'</span></button>').join("")+'</div>'+
    '<p class="mode-d">'+esc(QMODES[m].d)+'</p>';
  $("quizRules").innerHTML=QMODES[m].rules.map(r=>'<span>'+esc(r)+'</span>').join("");
  bar.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{const was=G.phase!=="lobby";P.set.qMode=b.dataset.m;save();quizAbort();showQuiz();if(was)window.scrollTo({top:0,behavior:"auto"})});
}
