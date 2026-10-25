/* ================= OKUMA ANLAMA =================
   #okuma: seviyelere göre metin listesi · #okuma-<id>: metin, sesli okuma (cümle vurgulu), çeviri, kelimeler, sorular.
   Sonuçlar: P.read[id]={ok,n,date}. Ses: audio-r.js (cümle başına kayıt). */
var RD={lv:"all",cur:null,ans:{},order:{},playing:false,idx:-1,slow:false};
function rSplit(p){return (p.match(/[^.!?]+(?:[.!?]+["”’']?|$)/g)||[p]).map(s=>s.trim()).filter(Boolean)}
function rWords(t){return t.en.split(/\s+/).length}
function rLvName(k){return LEVELS[k].name+" · "+LEVELS[k].cefr}

function renderReadList(){
  const box=$("readList");if(!box)return;P.read=P.read||{};
  $("rLevels").innerHTML=[["all","Tümü",""]].concat(Object.entries(LEVELS).map(([k,L])=>[k,L.name,L.cefr])).map(([k,n,c])=>'<button style="--c:var(--lv-'+(k==="all"?"kolay":k)+')" aria-pressed="'+(RD.lv===k)+'" data-k="'+k+'">'+n+(c?'<small>'+c+'</small>':'<small>'+READING.length+' metin</small>')+'</button>').join("");
  $("rLevels").querySelectorAll("button").forEach(b=>b.onclick=()=>{RD.lv=b.dataset.k;renderReadList()});
  const list=READING.filter(t=>RD.lv==="all"||t.lv===RD.lv);
  const done=READING.filter(t=>P.read[t.id]).length;
  $("readStat").innerHTML='<div><b>'+done+'</b><span>/ '+READING.length+' metin okundu</span></div>';
  box.innerHTML=list.map(t=>{const r=P.read[t.id],w=rWords(t);
    return '<a class="rcard" href="#okuma-'+t.id+'" style="--c:var(--lv-'+t.lv+')"><div class="rcard-top"><span class="lvl">'+LEVELS[t.lv].cefr+'</span>'+(r?'<span class="rdone">'+ic("check")+r.ok+'/'+r.n+'</span>':'')+'</div>'+
      '<h3>'+esc(t.title)+'</h3><span class="rtt">'+esc(t.tt)+'</span><p>'+esc(t.en.split(/\n\n/)[0].slice(0,120))+'…</p>'+
      '<div class="rcard-foot"><span>'+w+' kelime · ~'+Math.max(1,Math.round(w/120))+' dk</span><span class="go">'+(r?"Yeniden oku":"Oku")+' →</span></div></a>'}).join("");
}

function openReading(id){
  const t=READING.find(x=>x.id===id);if(!t){location.hash="okuma";return false}
  if(RD.cur!==t){RD.cur=t;RD.ans={};RD.order={};t.qs.forEach((q,i)=>RD.order[i]=shuffle(q[1].map((_,j)=>j)))}
  stopRead();renderReading();return true;
}
function renderReading(){
  const t=RD.cur,box=$("readBox");if(!t||!box)return;
  const idx=READING.indexOf(t),nxt=READING.find((x,i)=>i>idx&&x.lv===t.lv)||READING[(idx+1)%READING.length];
  let si=0;
  const paras=t.en.split(/\n\n/).map(p=>'<p>'+rSplit(p).map(s=>'<span class="rs" data-i="'+(si++)+'">'+esc(s)+'</span>').join(" ")+'</p>').join("");
  const nAns=Object.keys(RD.ans).length,nOk=Object.values(RD.ans).filter(Boolean).length;
  box.innerHTML='<a class="backlink" href="#okuma">'+ic("left")+'Tüm metinler</a>'+
    '<article class="rart card"><div class="rhead"><span class="badge" style="--c:var(--lv-'+t.lv+')">'+rLvName(t.lv)+'</span><h1>'+esc(t.title)+'</h1><p class="rtt">'+esc(t.tt)+' · '+rWords(t)+' kelime</p></div>'+
      '<div class="rplay"><button class="primary" id="rPlay">'+ic(RD.playing?"pause":"play")+(RD.playing?"Durdur":"Metni dinle")+'</button><button class="ghost'+(RD.slow?" on":"")+'" id="rSlow" aria-pressed="'+RD.slow+'">'+ic("slow")+'Yavaş</button><small>Bir cümleye dokunursan o cümle okunur.</small></div>'+
      '<div class="rtext" id="rText">'+paras+'</div>'+
      '<details class="rtr"><summary>'+ic("translate")+'Türkçesini göster</summary>'+t.tr.split(/\n\n/).map(p=>'<p>'+esc(p)+'</p>').join("")+'</details></article>'+
    '<section class="card rvocab"><h2 class="tres-h">Anahtar kelimeler</h2><div class="rv-list">'+t.vocab.map(v=>'<div class="rv-i"><b>'+esc(v[0])+'</b><span>'+esc(v[1])+'</span>'+sayBtn(v[0],"sm")+savBtn(v[0])+'</div>').join("")+'</div></section>'+
    '<section class="card rqs"><h2 class="tres-h">Anlama soruları <small>'+nAns+' / '+t.qs.length+'</small></h2>'+
      t.qs.map((q,i)=>{const a=RD.ans[i],done=a!==undefined;
        return '<div class="rq'+(done?(a?" ok":" bad"):"")+'"><p class="rq-q"><b>'+(i+1)+'.</b> '+esc(q[0])+'</p><div class="opts">'+
          RD.order[i].map((oi,p)=>'<button class="opt'+(done?(oi===0?" ok":RD.pick&&RD.pick[i]===oi?" no":""):"")+'" data-q="'+i+'" data-o="'+oi+'"'+(done?" disabled":"")+'><span class="k">'+"ABCD"[p]+'</span><span>'+esc(q[1][oi])+'</span></button>').join("")+'</div>'+
          (done?'<p class="note rq-why">'+ic("bulb")+'<span>'+esc(q[2])+'</span></p>':'')+'</div>'}).join("")+
      (nAns===t.qs.length?'<div class="rscore"><b>'+nOk+' / '+t.qs.length+'</b><span>'+(nOk===t.qs.length?"Kusursuz! Metni çok iyi anladın.":nOk>=t.qs.length/2?"Güzel. Açıklamalara göz atmayı unutma.":"Metni bir kez daha okuyup tekrar deneyebilirsin.")+'</span></div>'+
        '<div class="hero-row"><a class="primary" href="#okuma-'+nxt.id+'">Sonraki metin<span class="arr">'+ic("right")+'</span></a><button class="ghost" id="rRetry">'+ic("refresh")+'Soruları yeniden çöz</button></div>':'')+
    '</section>';
  box.querySelectorAll(".rqs .opt").forEach(b=>b.onclick=()=>{const qi=+b.dataset.q,oi=+b.dataset.o;if(RD.ans[qi]!==undefined)return;
    RD.ans[qi]=oi===0;RD.pick=RD.pick||{};RD.pick[qi]=oi;
    if(Object.keys(RD.ans).length===t.qs.length){P.read=P.read||{};const ok=Object.values(RD.ans).filter(Boolean).length,prev=P.read[t.id];
      P.read[t.id]={ok:Math.max(ok,prev?prev.ok:0),n:t.qs.length,date:Date.now()};markActive();save()}
    const y=window.scrollY;renderReading();window.scrollTo(0,y)});
  $("rPlay").onclick=()=>{if(RD.playing)stopRead();else playRead(RD.idx>=0?RD.idx:0)};
  $("rSlow").onclick=()=>{RD.slow=!RD.slow;const was=RD.playing,i=RD.idx;if(was){stopRead();playRead(i)}else renderPlayBtns()};
  box.querySelectorAll(".rs").forEach(s=>s.onclick=()=>{stopRead();playRead(+s.dataset.i,true)});
  if($("rRetry"))$("rRetry").onclick=()=>{RD.ans={};RD.pick={};t.qs.forEach((q,i)=>RD.order[i]=shuffle(q[1].map((_,j)=>j)));renderReading();document.querySelector(".rqs").scrollIntoView({behavior:"smooth",block:"start"})};
  markReading();
}
function renderPlayBtns(){const p=$("rPlay"),s=$("rSlow");if(!p)return;p.innerHTML=ic(RD.playing?"pause":"play")+(RD.playing?"Durdur":"Metni dinle");s.classList.toggle("on",RD.slow);s.setAttribute("aria-pressed",RD.slow)}
function markReading(){document.querySelectorAll("#rText .rs").forEach(s=>s.classList.toggle("now",RD.playing&&+s.dataset.i===RD.idx))}
function playRead(i,single){
  const spans=[...document.querySelectorAll("#rText .rs")];if(i>=spans.length){stopRead();RD.idx=-1;markReading();return}
  RD.playing=true;RD.idx=i;renderPlayBtns();markReading();
  const el=spans[i],r=el.getBoundingClientRect();if(r.top<80||r.bottom>innerHeight-90)el.scrollIntoView({behavior:reduceMotion()?"auto":"smooth",block:"center"});
  speak(el.textContent,null,RD.slow?.75:1,()=>{if(!RD.playing||RD.idx!==i)return;if(single){RD.playing=false;renderPlayBtns();markReading();return}playRead(i+1)});
}
function stopRead(){if(RD.playing){RD.playing=false;stopSpeak()}renderPlayBtns();markReading()}
