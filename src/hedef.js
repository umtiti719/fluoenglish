/* ================= HAFTALIK HEDEF VE ROZETLER =================
   P.act[gün]=o gün yapılan alıştırma sayısı (kart, soru, cevap…) · P.goal={days,per} · P.badges[id]=kazanma zamanı
   Hafta pazartesi başlar. Rozetler ilerlemeden hesaplanır; ilk kazanılınca kısa bir bildirim çıkar. */
const GOAL_DAYS=[3,5,7],GOAL_PER=[[10,"Hafif","10 alıştırma · ~5 dk"],[20,"Düzenli","20 alıştırma · ~10 dk"],[40,"Yoğun","40 alıştırma · ~20 dk"]];
function goalOf(){return P.goal||{days:5,per:20}}
function weekDays(){
  const d=new Date();d.setHours(12,0,0,0);const wd=(d.getDay()+6)%7;d.setDate(d.getDate()-wd);
  return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return dayKey(x)});
}
function weekProgress(){
  const g=goalOf(),days=weekDays(),act=P.act||{},t=dayKey(new Date());
  const list=days.map(k=>({k,n:act[k]||0,met:(act[k]||0)>=g.per,today:k===t,future:k>t}));
  return{g,list,met:list.filter(x=>x.met).length,todayN:act[t]||0};
}
function countAct(){
  P.act=P.act||{};const t=dayKey(new Date());P.act[t]=(P.act[t]||0)+1;
  const ks=Object.keys(P.act).sort();while(ks.length>60)delete P.act[ks.shift()];
  // Hedef haftası tamamlandıysa kaydet
  const w=weekProgress();if(w.met>=w.g.days){P.goalWeeks=P.goalWeeks||[];const wk=weekDays()[0];if(!P.goalWeeks.includes(wk)){P.goalWeeks.push(wk);P.goalWeeks=P.goalWeeks.slice(-60);setTimeout(()=>toast("Haftalık hedefini tamamladın! 🎯"),900)}}
  checkBadges();
}
function maxStreak(){
  const s=[...new Set(P.days||[])].sort();let best=0,cur=0,prev=null;
  s.forEach(k=>{const d=new Date(k+"T12:00:00");if(prev&&Math.round((d-prev)/864e5)===1)cur++;else cur=1;best=Math.max(best,cur);prev=d});
  return best;
}
const okRate=r=>r&&r.n&&r.ok/r.n>=.85;
const BADGES=[
  {id:"ilk",icon:"spark",t:"İlk adım",d:"İlk alıştırmanı yaptın.",ok:()=>Object.keys(P.act||{}).length>0||(P.days||[]).length>0},
  {id:"seri3",icon:"flame",t:"3 gün seri",d:"Art arda 3 gün çalıştın.",ok:()=>maxStreak()>=3},
  {id:"seri7",icon:"flame",t:"Bir hafta",d:"Art arda 7 gün çalıştın.",ok:()=>maxStreak()>=7},
  {id:"seri30",icon:"flame",t:"Bir ay",d:"Art arda 30 gün çalıştın.",ok:()=>maxStreak()>=30},
  {id:"hedef1",icon:"target",t:"Hedef tuttu",d:"Haftalık hedefini ilk kez tamamladın.",ok:()=>(P.goalWeeks||[]).length>=1},
  {id:"hedef4",icon:"target",t:"Dört hafta",d:"Haftalık hedefini 4 kez tamamladın.",ok:()=>(P.goalWeeks||[]).length>=4},
  {id:"k50",icon:"cards",t:"50 kelime",d:"50 kelime öğrendin.",ok:()=>Object.keys(P.learned).length>=50},
  {id:"k150",icon:"cards",t:"150 kelime",d:"150 kelime öğrendin.",ok:()=>Object.keys(P.learned).length>=150},
  {id:"k300",icon:"cards",t:"300 kelime",d:"300 kelime öğrendin.",ok:()=>Object.keys(P.learned).length>=300},
  {id:"g1",icon:"book",t:"İlk konu",d:"İlk dil bilgisi konunu tamamladın.",ok:()=>gramDone()>=1},
  {id:"g10",icon:"book",t:"On konu",d:"10 dil bilgisi konusunu tamamladın.",ok:()=>gramDone()>=10},
  {id:"unite",icon:"trophy",t:"Ünite geçildi",d:"Bir dil bilgisi ünite sınavında %85'i geçtin.",ok:()=>Object.values(P.exam||{}).some(okRate)},
  {id:"deste5",icon:"trophy",t:"Beş deste",d:"5 kelime destesi sınavında %85'i geçtin.",ok:()=>Object.values(P.vexam||{}).filter(okRate).length>=5},
  {id:"okur",icon:"doc",t:"Okur",d:"5 okuma metnini bitirdin.",ok:()=>Object.keys(P.read||{}).length>=5},
  {id:"diyalog",icon:"chat",t:"Sohbet",d:"5 diyaloğu tamamladın.",ok:()=>Object.keys(P.dlg||{}).length>=5},
  {id:"hata",icon:"alert",t:"Tuzaklardan kaçan",d:"Sık yapılan hatalar testinde 10 doğru yaptın.",ok:()=>(P.mist&&P.mist.best||0)>=10},
  {id:"defter",icon:"bookmark",t:"Koleksiyoncu",d:"Defterine 20 kelime kaydettin.",ok:()=>Object.keys(P.saved).length>=20},
  {id:"gunun7",icon:"sun",t:"Günün öğrencisi",d:"7 kez günün dersini bitirdin.",ok:()=>Object.values(P.daily||{}).filter(x=>x&&x.done).length>=7}
];
function checkBadges(silent){
  P.badges=P.badges||{};const fresh=[];
  BADGES.forEach(b=>{if(!P.badges[b.id]){let ok=false;try{ok=b.ok()}catch(e){}if(ok){P.badges[b.id]=Date.now();fresh.push(b)}}});
  if(fresh.length){save();if(!silent)setTimeout(()=>toast("Yeni rozet: "+fresh[fresh.length-1].t),400)}
}
function goalHtml(){
  const w=weekProgress(),g=w.g,names=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
  const pct=Math.min(100,Math.round(w.todayN/g.per*100));
  return '<section class="sgroup st-goal"><h2>'+ic("target")+'Haftalık hedef<button class="linkbtn gl-edit" id="goalEdit">Değiştir</button></h2>'+
    '<div class="goal-body"><div class="goal-ring" style="--p:'+pct+'"><b>'+w.todayN+'</b><span>/ '+g.per+' bugün</span></div>'+
    '<div class="goal-r"><p class="goal-t"><b>'+w.met+' / '+g.days+' gün</b> bu hafta '+(w.met>=g.days?"· hedef tamam 🎉":"· "+(g.days-w.met)+" gün kaldı")+'</p>'+
    '<div class="goal-week">'+w.list.map((x,i)=>'<span class="gwd'+(x.met?" met":"")+(x.today?" today":"")+(x.future?" fut":"")+'" title="'+x.n+' alıştırma"><i>'+(x.met?ic("check"):"")+'</i>'+names[i]+'</span>').join("")+'</div>'+
    '<p class="note goal-n">Günde '+g.per+' alıştırma: kelime kartı, soru, cevap… hepsi sayılır.'+(pomoToday()?' Bugün '+pomoToday()+' pomodoro tamamladın.':' Odaklanmak için üstteki saatten pomodoro başlatabilirsin.')+'</p></div></div>'+
    '<div class="goal-edit" id="goalBox" hidden><div><b>Haftada kaç gün?</b><div class="chips-row">'+GOAL_DAYS.map(d=>'<button class="fchip" data-gd="'+d+'" aria-pressed="'+(g.days===d)+'">'+d+' gün</button>').join("")+'</div></div>'+
    '<div><b>Günde ne kadar?</b><div class="goal-opts">'+GOAL_PER.map(([n,l,s])=>'<button class="goal-opt" data-gp="'+n+'" aria-pressed="'+(g.per===n)+'"><b>'+l+'</b><span>'+s+'</span></button>').join("")+'</div></div></div></section>';
}
function badgesHtml(){
  checkBadges(true);const got=BADGES.filter(b=>P.badges[b.id]).length;
  return '<section class="sgroup st-badges"><h2>'+ic("trophy")+'Rozetler <small class="note">'+got+' / '+BADGES.length+'</small></h2><div class="badges">'+
    BADGES.map(b=>{const on=!!P.badges[b.id];return '<div class="bdg'+(on?" on":"")+'" title="'+esc(b.d)+'"><span class="bdg-i">'+ic(b.icon)+'</span><b>'+esc(b.t)+'</b><small>'+esc(on?new Date(P.badges[b.id]).toLocaleDateString("tr-TR",{day:"numeric",month:"short"}):b.d)+'</small></div>'}).join("")+'</div></section>';
}
function bindGoal(rerender){
  const e=$("goalEdit");if(!e)return;
  e.onclick=()=>{const b=$("goalBox");b.hidden=!b.hidden;e.textContent=b.hidden?"Değiştir":"Kapat"};
  document.querySelectorAll("[data-gd]").forEach(b=>b.onclick=()=>{P.goal={...goalOf(),days:+b.dataset.gd};save();rerender(true)});
  document.querySelectorAll("[data-gp]").forEach(b=>b.onclick=()=>{P.goal={...goalOf(),per:+b.dataset.gp};save();rerender(true)});
}
