/* ================= POMODORO =================
   Üst menüdeki saat düğmesi küçük bir panel açar. Çalışırken düğme kalan süreyi gösterir; sayfa değişse ya da
   yenilense de sayaç devam eder (bitiş zamanı tarayıcıda saklanır). Biten çalışma oturumları P.pomo[gün] içinde sayılır. */
var POMO_MODES={work:{l:"Çalışma",icon:"book"},short:{l:"Kısa mola",icon:"cup"},long:{l:"Uzun mola",icon:"leaf"}};
var POMO_SETS=[[25,5,15,"Klasik"],[15,3,10,"Kısa"],[50,10,20,"Derin"]];
var PM={mode:"work",end:0,left:0,running:false,round:0,timer:null,open:false};
const POMO_KEY="fluoenglish_pomo";
const POMO_LIM=[[1,180,"Çalışma"],[1,60,"Kısa mola"],[1,90,"Uzun mola"]];
function pomoCustom(){const c=(P.set&&P.set.pomoC)||[30,5,15];return c.map((v,i)=>Math.min(POMO_LIM[i][1],Math.max(1,Math.round(+v)||POMO_SETS[0][i])))}
function pomoDur(m){const s=(P.set&&P.set.pomo)||0,t=s===3?pomoCustom():(POMO_SETS[s]||POMO_SETS[0]);return (m==="work"?t[0]:m==="short"?t[1]:t[2])*60}
function pomoLoad(){try{const s=JSON.parse(localStorage.getItem(POMO_KEY)||"null");if(s)Object.assign(PM,{mode:s.mode,end:s.end,left:s.left,running:s.running,round:s.round||0})}catch(e){}
  if(!PM.left)PM.left=pomoDur(PM.mode);
  if(PM.running&&PM.end<=Date.now()){PM.running=false;PM.left=0;setTimeout(()=>pomoDone(true),500)}
  else if(PM.running)pomoTick();}
function pomoSave(){try{localStorage.setItem(POMO_KEY,JSON.stringify({mode:PM.mode,end:PM.end,left:PM.left,running:PM.running,round:PM.round}))}catch(e){}}
function pomoRemain(){return PM.running?Math.max(0,Math.round((PM.end-Date.now())/1000)):PM.left}
const mmss=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
function pomoToday(){return (P.pomo&&P.pomo[dayKey(new Date())])||0}
function pomoStart(){if(PM.running)return;if(!PM.left)PM.left=pomoDur(PM.mode);PM.end=Date.now()+PM.left*1000;PM.running=true;pomoSave();pomoTick();pomoRender()}
function pomoPause(){if(!PM.running)return;PM.left=pomoRemain();PM.running=false;clearTimeout(PM.timer);pomoSave();pomoRender()}
function pomoReset(){clearTimeout(PM.timer);PM.running=false;PM.left=pomoDur(PM.mode);pomoSave();pomoRender()}
function pomoSet(mode){clearTimeout(PM.timer);PM.mode=mode;PM.running=false;PM.left=pomoDur(mode);pomoSave();pomoRender()}
function pomoTick(){clearTimeout(PM.timer);const r=pomoRemain();pomoRenderBtn();if(PM.open)pomoRenderTime();
  if(PM.running&&r<=0){PM.running=false;PM.left=0;pomoSave();pomoDone(false);return}
  if(PM.running)PM.timer=setTimeout(pomoTick,1000-(Date.now()%1000)+20);}
function pomoChime(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C();
  [0,.28,.56].forEach((t,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=[784,988,1175][i];
    g.gain.setValueAtTime(0,c.currentTime+t);g.gain.linearRampToValueAtTime(.18,c.currentTime+t+.03);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t+.9);
    o.connect(g).connect(c.destination);o.start(c.currentTime+t);o.stop(c.currentTime+t+1)});setTimeout(()=>c.close(),2500)}catch(e){}}
function pomoDone(late){
  const was=PM.mode;let msg;
  if(was==="work"){P.pomo=P.pomo||{};const k=dayKey(new Date());P.pomo[k]=(P.pomo[k]||0)+1;
    const ks=Object.keys(P.pomo).sort();while(ks.length>60)delete P.pomo[ks.shift()];save();
    PM.round++;const next=PM.round%4===0?"long":"short";msg="Harika! Bir pomodoro tamamlandı. Şimdi "+POMO_MODES[next].l.toLowerCase()+" zamanı.";PM.mode=next}
  else{msg="Mola bitti. Hadi yeni bir çalışma oturumuna!";PM.mode="work"}
  PM.left=pomoDur(PM.mode);pomoSave();
  if(!late)pomoChime();toast(msg);
  try{if(document.hidden&&"Notification" in window&&Notification.permission==="granted"){
    const opt={body:msg,icon:"icons/icon-192.png",tag:"fluo-pomo"};
    if(typeof PWA!=="undefined"&&PWA.reg)PWA.reg.showNotification("Fluo · Pomodoro",opt);else new Notification("Fluo · Pomodoro",opt)}}catch(e){}
  pomoRender();if(lastHash==="calismam")renderStudy();
}
/* ---------- Görünüm ---------- */
function pomoRenderBtn(){
  const b=document.getElementById("pomoBtn");if(!b)return;const r=pomoRemain(),active=PM.running||PM.left<pomoDur(PM.mode);
  b.classList.toggle("run",PM.running);b.classList.toggle("brk",PM.mode!=="work");b.classList.toggle("act",active);
  b.querySelector(".pomo-t").textContent=active?mmss(r):"";
  b.setAttribute("aria-label","Pomodoro"+(active?" · "+POMO_MODES[PM.mode].l+" "+mmss(r)+(PM.running?"":" (duraklatıldı)"):""));
  document.title=PM.running?mmss(r)+" · "+(PM.mode==="work"?"Çalışma":"Mola")+" · Fluo":"Fluo";
}
function pomoRenderTime(){
  const t=$("pomoTime");if(!t)return;const r=pomoRemain(),tot=pomoDur(PM.mode);
  t.textContent=mmss(r);$("pomoRing").style.setProperty("--p",((1-r/tot)*100).toFixed(2));
}
function pomoRender(){
  pomoRenderBtn();
  const p=$("pomoPanel");if(!p)return;p.hidden=!PM.open;if(!PM.open)return;
  const s=(P.set&&P.set.pomo)||0,n=pomoToday();
  p.innerHTML='<div class="pm-head"><b>'+ic("clock")+'Pomodoro</b><button class="pm-x" id="pmClose" aria-label="Kapat">'+ic("x")+'</button></div>'+
    '<div class="pm-modes" role="group">'+Object.entries(POMO_MODES).map(([k,m])=>'<button data-pm="'+k+'" aria-pressed="'+(PM.mode===k)+'">'+m.l+'</button>').join("")+'</div>'+
    '<div class="pm-ring'+(PM.mode!=="work"?" brk":"")+'" id="pomoRing"><b id="pomoTime"></b><span>'+POMO_MODES[PM.mode].l+'</span></div>'+
    '<div class="pm-ctl">'+(PM.running?'<button class="primary" id="pmPause">'+ic("pause")+'Duraklat</button>':'<button class="primary" id="pmStart">'+ic("play")+(PM.left<pomoDur(PM.mode)&&PM.left>0?"Devam et":"Başlat")+'</button>')+
      '<button class="ghost" id="pmReset" aria-label="Sıfırla">'+ic("refresh")+'</button></div>'+
    '<p class="pm-today">'+(n?'Bugün <b>'+n+'</b> pomodoro tamamladın '+'<span class="pm-dots">'+Array.from({length:Math.min(n,8)},()=>'<i></i>').join("")+'</span>':'Bugün henüz pomodoro yok. '+Math.round(pomoDur("work")/60)+' dakika odaklan, '+Math.round(pomoDur("short")/60)+' dakika dinlen.')+'</p>'+
    '<div class="pm-sets"><small>Süreler</small><div>'+POMO_SETS.map((t,i)=>'<button data-ps="'+i+'" aria-pressed="'+(s===i)+'" title="'+t[0]+' dk çalışma · '+t[1]+' dk mola"><b>'+t[3]+'</b><span>'+t[0]+'/'+t[1]+'</span></button>').join("")+
      (()=>{const c=pomoCustom();return '<button data-ps="3" aria-pressed="'+(s===3)+'" title="Süreleri kendin ayarla"><b>Özel</b><span>'+c[0]+'/'+c[1]+'</span></button>'})()+'</div></div>'+
    (s===3?'<div class="pm-custom">'+pomoCustom().map((v,i)=>'<div class="pm-num"><small>'+POMO_LIM[i][2]+'</small><div><button data-pd="'+i+'" data-d="-1" aria-label="'+POMO_LIM[i][2]+' azalt">−</button>'+
      '<input type="number" inputmode="numeric" min="1" max="'+POMO_LIM[i][1]+'" value="'+v+'" data-pi="'+i+'" aria-label="'+POMO_LIM[i][2]+' (dakika)"><button data-pd="'+i+'" data-d="1" aria-label="'+POMO_LIM[i][2]+' artır">+</button></div><span>dakika</span></div>').join("")+'</div>':'');
  pomoRenderTime();
  $("pmClose").onclick=()=>pomoToggle(false);
  p.querySelectorAll("[data-pm]").forEach(b=>b.onclick=()=>pomoSet(b.dataset.pm));
  const setC=(i,v)=>{const c=pomoCustom();c[i]=Math.min(POMO_LIM[i][1],Math.max(1,Math.round(v)||1));P.set.pomoC=c;save();
    if(!PM.running&&(i===0?PM.mode==="work":i===1?PM.mode==="short":PM.mode==="long"))PM.left=pomoDur(PM.mode);pomoSave();pomoRender()};
  p.querySelectorAll("[data-pd]").forEach(b=>b.onclick=()=>{const i=+b.dataset.pd,c=pomoCustom(),st=i===0&&c[0]>=10?5:1;setC(i,c[i]+st*(+b.dataset.d))});
  p.querySelectorAll("[data-pi]").forEach(inp=>inp.onchange=()=>setC(+inp.dataset.pi,+inp.value));
  p.querySelectorAll("[data-ps]").forEach(b=>b.onclick=()=>{P.set.pomo=+b.dataset.ps;save();if(!PM.running)PM.left=pomoDur(PM.mode);pomoSave();pomoRender()});
  if($("pmStart"))$("pmStart").onclick=()=>{pomoStart();try{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission()}catch(e){}};
  if($("pmPause"))$("pmPause").onclick=pomoPause;
  $("pmReset").onclick=pomoReset;
}
function pomoToggle(open){PM.open=open===undefined?!PM.open:open;const b=$("pomoBtn");if(b)b.setAttribute("aria-expanded",PM.open);pomoRender()}
document.addEventListener("click",e=>{
  if(e.target.closest("#pomoBtn")){e.preventDefault();pomoToggle();return}
  if(PM.open&&!e.composedPath().some(n=>n.id==="pomoPanel"))pomoToggle(false);
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&PM.open)pomoToggle(false)});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)pomoTick()});
