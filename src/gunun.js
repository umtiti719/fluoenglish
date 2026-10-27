/* ================= GÜNÜN DERSİ =================
   Her gün ~5 dakikalık paket: 3 yeni kelime → kelime testi → mini gramer → cümle kur → dinleme → bitiş.
   Ders o günün ilk açılışında seçilir ve P.daily[gün] içinde saklanır (cihazlar arası aynı kalır).
   Seviye: seviye testi sonucu, yoksa kolay. */
var DL={day:null,d:null,qi:0,tile:null,answered:false,lastOk:null};

function dlLevel(){return P.level?TEST_REC[P.level.idx].quiz:"kolay"}
function dlRand(seed){let x=seed>>>0||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
function dlShuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function dlWordPool(lv){
  const out=[],seen={};
  DECKS.forEach(d=>{if(lvOf(d.level)===lv)d.words.forEach(w=>{if(!seen[w[0]]){seen[w[0]]=1;out.push(w)}})});
  (WORDS[lv]||[]).forEach(w=>{if(!seen[w[0]]&&w[3]){seen[w[0]]=1;out.push([w[0],w[1],w[2],w[3],w[4]])}});
  return out;
}
const DL_GRAM={kolay:["A1","A2"],orta:["B1"],zor:["B2"],uzman:["B2"]};

function dlBuild(day){
  const lv=dlLevel(),r=dlRand(day*7919+lv.length*131);
  const pool=dlWordPool(lv);
  const fresh=pool.filter(w=>!P.learned[w[0]]&&!inBox(w[0]));
  const words=dlShuffle(fresh.length>=3?fresh:pool,r).slice(0,3);
  // kelime testi: her kelime için 3 yanlış şık
  const quiz=words.map(w=>{const wrong=dlShuffle(pool.filter(x=>x[0]!==w[0]&&x[1]!==w[1]),r).slice(0,3).map(x=>x[1]);
    return{w:w[0],opts:dlShuffle([w[1]].concat(wrong),r),a:w[1]}});
  // gramer: seviyedeki bitmemiş konulardan biri
  const tops=GRAMMAR.filter(t=>DL_GRAM[lv].includes(t.level));
  const open=tops.filter(t=>!P.gram[t.id]?.done);
  const topic=(open.length?open:tops)[day%(open.length||tops.length)];
  const gq=topic.quiz[Math.floor(r()*topic.quiz.length)];
  // cümle: bugünkü kelimelerden biriyle kurulan bir cümle, yoksa seviyeden biri
  const cp=cpool().filter(s=>s.lv===lv);
  const cpF=cp.filter(s=>!P.seen[ckey(s)]);
  const sent=cp.find(s=>words.some(w=>s.word===w[0])&&!P.seen[ckey(s)])||dlShuffle(cpF.length?cpF:cp,r)[0];
  // dinleme: seviyeden bir cümle + iki çeldirici
  const lsAll=LSENT.filter(s=>s.lv===lv&&!/^Metnin tamamı/.test(s.tr)&&s.en!==sent.en),lsF=lsAll.filter(s=>!P.seen["l:"+s.en]);
  const ls=lsF.length>=3?dlShuffle(lsF,r).concat(dlShuffle(lsAll,r)):dlShuffle(lsAll,r);touch("l:"+ls[0].en);
  const listen={en:ls[0].en,tr:ls[0].tr,opts:dlShuffle([ls[0].en,ls[1].en,ls[2].en],r)};
  return{day,lv,step:0,score:0,max:6,done:false,words:words.map(w=>w.slice(0,5)),quiz,topic:topic.id,gq:[gq[0],gq[1],gq[2],gq[3]],sent:sent.en,listen};
}
function dlToday(){
  const day=today();P.daily=P.daily||{};
  if(!P.daily[day]){P.daily[day]=dlBuild(day);
    const keys=Object.keys(P.daily).sort((a,b)=>a-b);while(keys.length>30)delete P.daily[keys.shift()];save()}
  return P.daily[day];
}
function dailyDone(){return !!(P.daily&&P.daily[today()]&&P.daily[today()].done)}

const DL_STEPS=["Yeni kelimeler","Kelime testi","Mini gramer","Cümle kur","Dinleme","Bitti"];
function openDaily(){DL.d=dlToday();DL.answered=false;DL.lastOk=null;DL.qi=DL.d.step===1?(DL.d.qi||0):0;DL.tile=null;renderDaily()}
function dlNext(){const d=DL.d;d.step++;d.qi=0;DL.qi=0;DL.answered=false;DL.lastOk=null;DL.tile=null;
  if(d.step>=5&&!d.done){d.done=true;markActive();toast("Günün dersi tamamlandı!")}
  save();renderDaily();window.scrollTo({top:0,behavior:reduceMotion()?"auto":"smooth"})}
function dlScore(ok){if(ok)DL.d.score++;save()}

function renderDaily(){
  const box=$("dailyBox"),d=DL.d;if(!box||!d)return;setTimeout(setFocus,0);
  const st=d.done?5:d.step;
  let h='<div class="dl-top"><div class="dl-steps">'+DL_STEPS.slice(0,5).map((s,i)=>'<span class="'+(i<st?"done":i===st?"now":"")+'" title="'+s+'"></span>').join("")+'</div>'+
    '<span class="dl-lbl">'+(st<5?"Adım "+(st+1)+" / 5 · "+DL_STEPS[st]:"Ders tamamlandı")+'</span></div>';
  if(st===0)h+=dlWordsHTML(d);
  else if(st===1)h+=dlQuizHTML(d);
  else if(st===2)h+=dlGramHTML(d);
  else if(st===3)h+=dlBuildHTML(d);
  else if(st===4)h+=dlListenHTML(d);
  else h+=dlEndHTML(d);
  box.innerHTML=h;dlBind(st);
}
function dlFoot(label,id,disabled){return '<div class="bfoot"><span class="sp"></span><button class="primary" id="'+(id||"dlGo")+'"'+(disabled?" disabled":"")+'>'+label+'<span class="arr">'+ic("right")+'</span></button></div>'}
function dlWordsHTML(d){
  return '<div class="dl-card"><h2>Bugünün 3 kelimesi</h2><p class="note">Oku, dinle; birazdan küçük bir testle pekiştireceğiz.</p><div class="dl-words">'+
    d.words.map(w=>'<div class="dl-w"><div class="dl-wh"><b>'+esc(w[0])+'</b>'+sayBtn(w[0],"sm")+savBtn(w[0])+'</div><p class="dl-wm">'+esc(w[1])+(w[2]?' <span>· '+esc(w[2])+'</span>':'')+'</p>'+
      (w[3]?'<p class="dl-wx"><span>'+hl(w[3])+'</span>'+(w[4]?'<small>'+esc(w[4])+'</small>':'')+'</p>':'')+'</div>').join("")+'</div>'+dlFoot("Teste geç")+'</div>';
}
function dlQuizHTML(d){
  const q=d.quiz[DL.qi];
  return '<div class="dl-card"><span class="tq-n">Soru '+(DL.qi+1)+' / '+d.quiz.length+'</span><h2 class="dl-qw">'+esc(q.w)+sayBtn(q.w,"sm")+'</h2><p class="note">Bu kelimenin anlamı ne?</p>'+
    '<div class="opts" id="dlOpts">'+q.opts.map((o,i)=>'<button class="opt'+(DL.answered?(o===q.a?" ok":DL.pick===i?" no":""):"")+'" data-i="'+i+'"'+(DL.answered?" disabled":"")+'><span class="k">'+"ABCD"[i]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+
    (DL.answered?dlFoot(DL.qi<d.quiz.length-1?"Sonraki soru":"Devam"):"")+'</div>';
}
function dlGramHTML(d){
  const t=GRAMMAR.find(x=>x.id===d.topic),q=d.gq,f=(t.forms||[])[0],ex=(t.examples||[]).slice(0,2);
  return '<div class="dl-card"><span class="badge">'+t.level+' · Dil bilgisi</span><h2>'+esc(t.title)+' <small>'+esc(t.tr)+'</small></h2><p>'+esc(t.intro)+'</p>'+
    (f?'<div class="dl-form"><small>'+esc(f[0])+'</small><b>'+esc(f[1])+'</b><span>'+hl(f[2])+'</span></div>':'')+
    (ex.length?'<ul class="dl-ex">'+ex.map(e=>'<li>'+hl(e[0])+'<small>'+esc(e[1])+'</small></li>').join("")+'</ul>':'')+
    '<a class="inlink" href="#g-'+t.id+'">'+ic("book")+'Konunun tamamını sonra oku</a>'+
    '<div class="dl-gq"><p class="tq-q">'+esc(q[0]).replace("___",'<span class="blank">&nbsp;</span>')+'</p><div class="opts" id="dlOpts">'+
      q[1].map((o,i)=>'<button class="opt'+(DL.answered?(i===q[2]?" ok":DL.pick===i?" no":""):"")+'" data-i="'+i+'"'+(DL.answered?" disabled":"")+'><span class="k">'+"ABCD"[i]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+
      (DL.answered?'<p class="note dl-why">'+ic("bulb")+esc(q[3]||"")+'</p>'+dlFoot("Devam"):"")+'</div></div>';
}
function dlBuildHTML(d){
  const s=cpool().find(x=>x.en===d.sent)||{en:d.sent,tr:"",tok:buildTokens(d.sent)};
  if(!DL.tile){const own=new Set(s.tok.map(t=>t.toLowerCase()));const dis=[];
    for(const o of shuffle(cpool().filter(x=>x.lv===d.lv))){if(dis.length>=2)break;const t=o.tok.find(t=>!own.has(t.toLowerCase())&&/^[a-z']+$/.test(t)&&t.length>2&&!dis.includes(t));if(t)dis.push(t)}
    DL.tile={s,bank:shuffle(s.tok.concat(dis).map((t,i)=>({t,id:i,used:false}))),picked:[]}}
  const T=DL.tile;
  return '<div class="dl-card"><h2>Cümleyi kur</h2><div class="bq"><p class="btr">'+esc(s.tr)+'</p><small class="bhelp">İngilizcesini kartları sırayla seçerek kur</small></div>'+
    '<div class="bans'+(DL.answered?(DL.lastOk?" ok":" bad"):"")+'" id="dlAns">'+(T.picked.length?T.picked.map((x,i)=>'<button class="btile in" data-p="'+i+'"'+(DL.answered?" disabled":"")+'>'+esc(x.t)+'</button>').join(""):'<span class="bph">Kartlara dokun</span>')+'</div>'+
    '<div class="bbank" id="dlBank">'+T.bank.map(x=>'<button class="btile'+(x.used?" used":"")+'" data-id="'+x.id+'"'+(x.used||DL.answered?" disabled":"")+'>'+esc(x.t)+'</button>').join("")+'</div>'+
    (DL.answered?'<div class="bres '+(DL.lastOk?"ok":"bad")+'"><div class="bres-h">'+ic(DL.lastOk?"check":"x")+'<b>'+(DL.lastOk?"Doğru!":"Doğrusu şöyle")+'</b></div><div class="bres-s"><p>'+esc(plain(s.en))+'</p>'+sayBtn(s.en,"sm")+'</div></div>'+dlFoot("Devam")
      :'<div class="bfoot"><button class="linkbtn" id="dlSkip">Bilmiyorum</button><span class="sp"></span><button class="primary" id="dlCheck"'+(T.picked.length?"":" disabled")+'>Kontrol et</button></div>')+'</div>';
}
function dlListenHTML(d){
  const L2=d.listen;
  return '<div class="dl-card"><h2>Dinle ve seç</h2><p class="note">Cümleyi dinle, duyduğun cümleyi seç.</p>'+
    '<div class="tq-audio aurora"><button class="playbtn" id="dlPlay" aria-label="Dinle">'+ic("play")+'</button><div><b>Dinle</b><small>İstediğin kadar tekrar dinleyebilirsin</small></div><button class="ghost" id="dlSlow">'+ic("slow")+'Yavaş</button></div>'+
    '<div class="opts" id="dlOpts">'+L2.opts.map((o,i)=>'<button class="opt'+(DL.answered?(o===L2.en?" ok":DL.pick===i?" no":""):"")+'" data-i="'+i+'"'+(DL.answered?" disabled":"")+'><span class="k">'+"ABC"[i]+'</span><span>'+esc(plain(o))+'</span></button>').join("")+'</div>'+
    (DL.answered?'<p class="note">'+esc(L2.tr)+'</p>'+dlFoot("Dersi bitir"):"")+'</div>';
}
function dlEndHTML(d){
  const pct=Math.round(d.score/d.max*100);
  return '<div class="dl-card dl-end aurora"><span class="auth-big">'+ic("check")+'</span><h2>Günün dersi tamam!</h2>'+
    '<p class="lead">'+d.score+' / '+d.max+' doğru'+(pct>=80?" · harika iş çıkardın.":pct>=50?" · iyi gidiyorsun.":" · yarın daha iyi olacak.")+'</p>'+
    '<p class="note">Bugünkü kelimeler tekrar takvimine eklendi. Yarın yeni bir ders seni bekliyor.</p>'+
    '<div class="hero-row"><a class="primary" href="#ogren">Kelime çalışmaya devam<span class="arr">'+ic("right")+'</span></a><a class="ghost" href="#g-'+d.topic+'">Gramer konusunu oku</a></div></div>';
}
function dlAnswerOpt(ok,i){DL.answered=true;DL.pick=i;DL.lastOk=ok;dlScore(ok);renderDaily()}
function dlBind(st){
  const d=DL.d,go=$("dlGo");
  if(st===0&&go)go.onclick=()=>{dlNext()};
  if(st===1){const q=d.quiz[DL.qi];
    if(!DL.answered)$("dlOpts").querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,ok=q.opts[i]===q.a;
      if(ok){P.learned[q.w]=1;srsLearn(q.w)}else srsWrong(q.w);dlAnswerOpt(ok,i)});
    else if(go)go.onclick=()=>{if(DL.qi<d.quiz.length-1){DL.qi++;d.qi=DL.qi;DL.answered=false;save();renderDaily()}else dlNext()}}
  if(st===2){if(!DL.answered)$("dlOpts").querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;dlAnswerOpt(i===d.gq[2],i)});else if(go)go.onclick=dlNext}
  if(st===3){const T=DL.tile;
    if(!DL.answered){
      $("dlBank").querySelectorAll(".btile").forEach(b=>b.onclick=()=>{const x=T.bank.find(y=>y.id===+b.dataset.id);if(!x||x.used)return;x.used=true;T.picked.push(x);renderDaily()});
      $("dlAns").querySelectorAll(".btile").forEach(b=>b.onclick=()=>{const x=T.picked.splice(+b.dataset.p,1)[0];if(x)x.used=false;renderDaily()});
      const fin=give=>{const ok=!give&&T.picked.map(x=>x.t.toLowerCase()).join(" ")===T.s.tok.map(t=>t.toLowerCase()).join(" ");
        touch(ckey(T.s));P.build=P.build||{n:0,ok:0};P.build.n++;if(ok)P.build.ok++;dlAnswerOpt(ok,-1);if(ok)speak(plain(T.s.en))};
      $("dlCheck").onclick=()=>fin(false);$("dlSkip").onclick=()=>fin(true);
    }else if(go)go.onclick=dlNext}
  if(st===4){const L2=d.listen;
    $("dlPlay").onclick=e=>speak(L2.en,e.currentTarget);$("dlSlow").onclick=()=>speak(L2.en,$("dlPlay"),.6);
    if(!DL.answered)$("dlOpts").querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;dlAnswerOpt(L2.opts[i]===L2.en,i)});
    else if(go)go.onclick=dlNext}
}
