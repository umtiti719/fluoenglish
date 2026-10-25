/* ================= DİYALOGLAR =================
   #diyalog: liste · #diyalog-<id>: konuşma. İki bölüm: "Dinle" (tüm konuşma, Türkçesiyle) ve "Sen konuş"
   (karşı taraf konuşur, sen doğru cevabı seçersin). Sonuç: P.dlg[id]={ok,n,date}. Ses: audio-d.js */
var DG={cur:null,mode:"dinle",tr:true,play:-1,step:0,ok:0,asked:0,res:{},opts:null,wrong:null};
const DG_LV={kolay:"A1–A2",orta:"A2–B1",zor:"B1",uzman:"B1–B2"};
const dgAsk=d=>d.lines.filter(l=>l[0]==="S"&&l[3]).length;
function renderDlgList(){
  const box=$("dlgBox");if(!box)return;P.dlg=P.dlg||{};
  const done=DIALOGS.filter(d=>P.dlg[d.id]).length;
  box.innerHTML='<div class="ph-stat dg-stat"><div><b>'+done+'</b><span>/ '+DIALOGS.length+' diyalog tamamlandı</span></div></div>'+
    '<div class="dg-list">'+DIALOGS.map(d=>{const r=P.dlg[d.id];
    return '<a class="dg-card" href="#diyalog-'+d.id+'" style="--c:var(--lv-'+d.lv+')"><span class="mod-ic">'+ic(d.icon)+'</span><div><small>'+DG_LV[d.lv]+' · '+d.lines.length+' replik</small><b>'+esc(d.title)+'</b><span>'+esc(d.desc)+'</span></div>'+
      (r?'<span class="dg-done">'+ic("check")+r.ok+'/'+r.n+'</span>':'<span class="tool-go">'+ic("right")+'</span>')+'</a>'}).join("")+'</div>';
}
function openDialog(id){
  const d=DIALOGS.find(x=>x.id===id);if(!d)return false;
  if(DG.cur!==d){DG.cur=d;DG.mode="dinle";dgReset()}
  dgStop();renderDialog();return true;
}
function dgReset(){DG.saved=null;DG.step=0;DG.ok=0;DG.asked=0;DG.res={};DG.opts=null;DG.wrong=null}
function dgStop(){DG.play=-1;stopSpeak()}
function dgBubble(l,i,extra){
  const me=l[0]==="S";
  return '<div class="dg-msg '+(me?"s":"a")+(DG.play===i?" now":"")+(extra||"")+'" data-li="'+i+'"><span class="dg-who">'+(me?"Sen":"Karşındaki")+'</span>'+
    '<p>'+esc(l[1])+'</p>'+(DG.tr||DG.mode==="konus"?'<small>'+esc(l[2])+'</small>':'')+'</div>';
}
function renderDialog(){
  const d=DG.cur,box=$("dlgView");if(!d||!box)return;
  const idx=DIALOGS.indexOf(d),nxt=DIALOGS[(idx+1)%DIALOGS.length];
  let h='<a class="backlink" href="#diyalog">'+ic("left")+'Tüm diyaloglar</a>'+
    '<header class="dg-head"><span class="badge" style="--c:var(--lv-'+d.lv+')">'+DG_LV[d.lv]+'</span><h1>'+esc(d.title)+'</h1><p class="rtt">'+esc(d.en)+' · '+esc(d.desc)+'</p></header>'+
    '<div class="chips-row st-tabs"><button class="fchip" data-dm="dinle" aria-pressed="'+(DG.mode==="dinle")+'">'+ic("headphones")+'Dinle</button><button class="fchip" data-dm="konus" aria-pressed="'+(DG.mode==="konus")+'">'+ic("chat")+'Sen konuş</button></div>';
  if(DG.mode==="dinle"){
    h+='<div class="dg-tools"><button class="primary" id="dgPlay">'+ic(DG.play>=0?"pause":"play")+(DG.play>=0?"Durdur":"Tümünü dinle")+'</button>'+
      '<button class="ghost'+(DG.tr?" on":"")+'" id="dgTr" aria-pressed="'+DG.tr+'">'+ic("translate")+'Türkçe</button><small class="note">Bir repliğe dokunursan yalnızca onu dinlersin.</small></div>'+
      '<div class="dg-chat card">'+d.lines.map((l,i)=>dgBubble(l,i)).join("")+'</div>'+
      '<div class="dg-next"><button class="primary" data-dm="konus">Şimdi sen konuş<span class="arr">'+ic("right")+'</span></button></div>';
  }else{
    const shown=d.lines.slice(0,DG.step);
    h+='<p class="note dg-help">Karşındaki konuşur; sıra sana gelince doğru cevabı seç. Her doğru cevap sesli okunur.</p><div class="dg-chat card" id="dgChat">'+
      shown.map((l,i)=>dgBubble(l,i,DG.res[i]===false?" missed":"")).join("");
    const cur=d.lines[DG.step];
    if(cur&&cur[0]==="S"&&cur[3]){
      if(!DG.opts)DG.opts=shuffle([cur[1],...cur[3]]);
      h+='<div class="dg-ask"><span class="dg-who">Senin sıran</span>'+(DG.wrong?'<p class="dg-wrong">'+ic("x")+'Bu cevap uygun değil. Doğrusu yeşil olan.</p>':'')+
        '<div class="opts dg-opts">'+DG.opts.map((o,p)=>'<button class="opt'+(DG.wrong&&o===cur[1]?" ok":DG.wrong===o?" no":"")+'" data-o="'+p+'"'+(DG.wrong?" disabled":"")+'><span class="k">'+"ABC"[p]+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>'+
        (DG.wrong?'<div class="pr-act"><button class="primary" id="dgGo">Devam'+ic("right")+'</button></div>':'')+'</div>';
    }
    h+='</div>';
    if(!cur){
      const r=P.dlg&&P.dlg[d.id];
      h+='<div class="rscore dg-end"><b>'+DG.ok+' / '+DG.asked+'</b><span>'+(DG.ok===DG.asked?"Harika! Bu konuşmayı kusursuz yürüttün.":DG.ok>=DG.asked/2?"Güzel. Kırmızı işaretli cevaplarına bir kez daha bak.":"Önce Dinle bölümünde konuşmayı birkaç kez dinleyip yeniden dene.")+'</span>'+
        '<div class="hero-row"><a class="primary" href="#diyalog-'+nxt.id+'">Sonraki diyalog<span class="arr">'+ic("right")+'</span></a><button class="ghost" id="dgAgain">'+ic("refresh")+'Yeniden oyna</button></div></div>';
    }
  }
  h+='<p class="report-line">'+ic("flag")+'Bu diyalogda bir hata mı gördün? <button class="linkbtn" id="dgReport">Bildir</button></p>';
  box.innerHTML=h;
  box.querySelectorAll("[data-dm]").forEach(b=>b.onclick=()=>{dgStop();DG.mode=b.dataset.dm;dgReset();renderDialog();window.scrollTo({top:0,behavior:"auto"});if(DG.mode==="konus")dgAdvance()});
  $("dgReport").onclick=()=>reportIssue("icerik",{yer:"Diyalog",oge:d.title});
  if(DG.mode==="dinle"){
    $("dgPlay").onclick=()=>{if(DG.play>=0){dgStop();renderDialog()}else dgPlayFrom(0,false)};
    $("dgTr").onclick=()=>{DG.tr=!DG.tr;renderDialog()};
    box.querySelectorAll(".dg-msg").forEach(m=>m.onclick=()=>dgPlayFrom(+m.dataset.li,true));
  }else{
    box.querySelectorAll(".dg-opts .opt").forEach(b=>b.onclick=()=>dgAnswer(DG.opts[+b.dataset.o],b));
    if($("dgGo"))$("dgGo").onclick=()=>{DG.wrong=null;DG.opts=null;DG.step++;renderDialog();dgAdvance()};
    if($("dgAgain"))$("dgAgain").onclick=()=>{dgReset();renderDialog();dgAdvance()};
    box.querySelectorAll(".dg-msg").forEach(m=>m.onclick=()=>speak(d.lines[+m.dataset.li][1],null));
    const c=$("dgChat");if(c&&DG.step>1){const last=c.lastElementChild;if(last)last.scrollIntoView({block:"nearest",behavior:reduceMotion()?"auto":"smooth"})}
  }
}
function dgPlayFrom(i,single){
  const d=DG.cur;if(!d||i>=d.lines.length){dgStop();renderDialog();return}
  DG.play=i;renderDialog();
  const el=document.querySelector('.dg-msg[data-li="'+i+'"]');if(el)el.scrollIntoView({block:"nearest",behavior:reduceMotion()?"auto":"smooth"});
  speak(d.lines[i][1],null,null,()=>{if(DG.play!==i)return;if(single){DG.play=-1;renderDialog();return}setTimeout(()=>{if(DG.play===i)dgPlayFrom(i+1,false)},350)});
}
// Konuş bölümü: karşı tarafın replikleri ve soru olmayan kendi repliklerin otomatik ilerler
function dgAdvance(){
  const d=DG.cur;if(!d||DG.mode!=="konus"||lastHash!=="diyalog-"+d.id)return;
  const cur=d.lines[DG.step];
  if(!cur){dgFinish();return}
  if(cur[0]==="S"&&cur[3]){renderDialog();return}
  const i=DG.step;DG.step++;renderDialog();
  speak(cur[1],null,null,()=>{if(DG.mode==="konus"&&DG.cur===d&&DG.step===i+1)setTimeout(dgAdvance,300)});
}
function dgAnswer(o,b){
  const d=DG.cur,cur=d.lines[DG.step];if(DG.wrong)return;
  markActive();DG.asked++;
  if(o===cur[1]){DG.ok++;DG.res[DG.step]=true;DG.opts=null;const i=DG.step;DG.step++;renderDialog();
    speak(cur[1],null,null,()=>{if(DG.mode==="konus"&&DG.step===i+1)setTimeout(dgAdvance,300)})}
  else{DG.res[DG.step]=false;DG.wrong=o;renderDialog();speak(cur[1],null)}
}
function dgFinish(){
  const d=DG.cur;P.dlg=P.dlg||{};const prev=P.dlg[d.id];
  if(!DG.saved||DG.saved!==d.id+DG.asked+":"+DG.ok){P.dlg[d.id]={ok:Math.max(DG.ok,prev?prev.ok:0),n:DG.asked,date:Date.now()};DG.saved=d.id+DG.asked+":"+DG.ok;save()}
  renderDialog();
}
