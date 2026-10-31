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
  DECKS.forEach(d=>{const r=P.vexam&&P.vexam[d.id];if(r&&r.ok/r.n<.6)out.push([{id:d.id,title:d.name,level:d.level,deck:1},"Deste sınavında "+r.ok+"/"+r.n])});
  GRAMMAR.forEach(t=>{const g=P.gram[t.id];if(g&&!g.done&&!out.some(o=>o[0]===t))out.push([t,"Alıştırma: "+g.best+"/"+g.total])});
  return out.slice(0,6);
}
function renderStudy(){
  const box=$("study");if(!box)return;
  const learned=Object.keys(P.learned).length,saved=Object.values(P.saved),sents=Object.values(P.sents||{}).sort((a,b)=>(b[3]||0)-(a[3]||0));
  const due=dueWords().length,lv=P.level?CEFR[P.level.idx].code:"–";
  const tabs=[["durum","Çalışma durumu","Durum",ic("target")],["pomo","Pomodoro","Pomodoro",ic("clock")+'<i class="tn">'+pomoToday()+'</i>'],["kelime","Kelimelerim","Kelimeler",ic("bookmark")+'<i class="tn">'+saved.length+'</i>'],["cumle","Cümlelerim","Cümleler",ic("chat")+'<i class="tn">'+sents.length+'</i>'],["not","Notlarım","Notlar",ic("pen")+'<i class="tn">'+noteCount()+'</i>']];
  let h='<div class="prof-stats st-top">'+[[learned,"öğrenilen kelime"],[gramDone()+"/"+GRAMMAR.length,"gramer konusu"],[lv,"seviye"],[streakCount(),"günlük seri"]].map(([b,s])=>'<div class="stat"><b>'+b+'</b><span>'+s+'</span></div>').join("")+'</div>';
  h+='<div class="chips-row st-tabs" role="tablist">'+tabs.map(([k,l,sh,i])=>'<button class="fchip" role="tab" data-st="'+k+'" aria-pressed="'+(STUDY.tab===k)+'" aria-selected="'+(STUDY.tab===k)+'" style="--c:var(--brand)">'+i+'<span class="tl">'+l+'</span><span class="ts">'+sh+'</span></button>').join("")+'</div>';
  if(STUDY.tab==="durum"){
    const adv=studyAdvice();
    h+=goalHtml()+'<div class="st-grid">';
    // Öneriler
    h+='<section class="sgroup st-adv"><h2>'+ic("bulb")+'Sırada ne var?</h2>'+
      (due?'<div class="srow"><div><b>'+due+' kelimenin tekrar zamanı geldi</b><small>Unutmadan önce kısa bir tekrar yap.</small></div><a class="primary" href="#ogren-tekrar">Tekrar et</a></div>':'')+
      (adv.length?((P.vmiss||[]).length?'<div class="srow"><div><b>Son kelime sınavında bilemediğin '+P.vmiss.length+' kelime</b><small>Kartlarla kısa bir tekrar yap.</small></div><a class="ghost" href="#ogren-eksik">Çalış</a></div>':'')+adv.map(([t,why])=>'<div class="srow"><div><b>'+esc(t.title)+'</b><small>'+esc(t.level+" · "+why)+'</small></div><a class="ghost" href="'+(t.deck?"#ogren-":"#g-")+t.id+'">Çalış</a></div>').join("")
        :'<div class="srow"><div><b>'+(P.exam&&Object.keys(P.exam).length||P.vexam&&Object.keys(P.vexam).length?"Eksik konu görünmüyor":"Bildiklerini ölç")+'</b><small>'+(P.exam&&Object.keys(P.exam).length?"Bir sonraki ünitenin sınavına girebilirsin.":"Ünite sınavına gir; sonuca göre hangi konuları çalışman gerektiğini gösterelim.")+'</small></div><a class="ghost" href="#sinav">Ünite sınavları</a></div>')+
      '</section>';
    // Üniteler
    h+='<section class="sgroup"><h2>'+ic("target")+'Ünite sınavları</h2>'+Object.entries(GRAMMAR_LEVELS).map(([k,L],i)=>{const r=P.exam&&P.exam[k];
      return '<div class="srow"><div><b>Ünite '+(i+1)+' · '+k+' '+esc(L.name)+'</b><small>'+(r?examVerdict(r.ok/r.n).short+" · son sonuç "+r.ok+"/"+r.n:"Henüz girilmedi")+'</small></div><a class="ghost" href="#sinav-'+k.toLowerCase()+'">'+(r?"Yeniden gir":"Sınava gir")+'</a></div>'}).join("")+
      (()=>{const vs=DECKS.filter(d=>P.vexam&&P.vexam[d.id]),good=vs.filter(d=>P.vexam[d.id].ok/P.vexam[d.id].n>=.85).length;
        return '<div class="srow"><div><b>Kelime desteleri</b><small>'+(vs.length?vs.length+' / '+DECKS.length+' deste sınandı · '+good+' destede başarılı':'Henüz bir deste sınavına girmedin')+'</small></div><a class="ghost" href="#sinav-kelime">'+(vs.length?"Sonuçlar":"Sınava gir")+'</a></div>'})()+'</section>';
    h+=ttSummaryHtml();
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
      [["Okuma",rd+" / "+READING.length+" metin okundu","#okuma"],["Diyaloglar",Object.keys(P.dlg||{}).length+" / "+DIALOGS.length+" diyalog tamamlandı","#diyalog"],["Sık yapılan hatalar",P.mist&&P.mist.n?"En iyi sonucun "+P.mist.best+" / 10":"Testi henüz çözmedin","#hatalar"],["Günün dersi",dl?dl+" ders tamamlandı (son 30 gün)":"Bugünkü dersi henüz bitirmedin","#gunun"],
       ["Dinleme",ls.n?ls.ok+" / "+ls.n+" doğru":"Henüz denemedin","#dinle"],["Telaffuz",sp.n?sp.ok+" / "+sp.n+" başarılı":"Henüz denemedin","#telaffuz"],
       ["Metin çevirisi",(P.trans||0)+" metin çevrildi","#metin"],["Seviye testi",P.level?CEFR[P.level.idx].code+" · "+new Date(P.level.date).toLocaleDateString("tr-TR"):"Henüz girilmedi","#seviye"]]
       .map(([a,b,c])=>'<a class="srow st-link" href="'+c+'"><div><b>'+a+'</b><small>'+b+'</small></div>'+ic("right")+'</a>').join("")+
       '<a class="srow st-link" href="#calismam" id="stPomo"><div><b>Pomodoro</b><small>'+(pomoToday()?"Bugün "+pomoToday()+" oturum":"Bugün henüz oturum yok")+' · geçmişi gör</small></div>'+ic("right")+'</a></section>';
    h+='</div>'+badgesHtml();
  }else if(STUDY.tab==="kelime"){
    const list=saved.slice().sort((a,b)=>a[0].localeCompare(b[0]));
    h+=list.length?'<div class="st-bar"><span class="note">'+list.length+' kayıtlı kelime</span><a class="ghost" href="#defter">'+ic("cards")+'Defterim\'de çalış</a></div>'+
      '<div class="st-words">'+list.map(w=>{const s=P.srs[w[0]];return '<div class="st-w"><div><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span>'+(s&&s.b?'<i class="st-box" title="Hafıza kutusu">'+s.b+'/5</i>':'')+'</div>'+sayBtn(w[0],"sm")+savBtn(w[0],"sm")+'</div>'}).join("")+'</div>'
      :'<div class="empty aurora"><span class="mod-ic">'+ic("bookmark")+'</span><h3>Henüz kayıtlı kelime yok</h3><p>Kartlarda ve metinlerde kelimelerin yanındaki '+ic("bookmark")+' işaretine dokunarak buraya ekleyebilirsin.</p><a class="primary" href="#ogren">Kelime Öğren</a></div>';
  }else if(STUDY.tab==="pomo"){
    h+=pomoHistHtml();
  }else if(STUDY.tab==="not"){
    h+=notesHtml();
  }else{
    h+=sents.length?'<div class="st-bar"><span class="note">'+sents.length+' kayıtlı cümle</span></div><div class="st-sents">'+sents.map(s=>'<div class="ex st-s"><div><p>'+esc(s[0])+'</p>'+(s[1]?'<small>'+esc(s[1])+'</small>':'')+(s[2]?'<span class="st-src">'+esc(s[2])+'</span>':'')+'</div><div class="dbtns">'+sayBtn(s[0],"sm")+sntBtn(s[0],s[1],s[2],"sm")+'</div></div>').join("")+'</div>'
      :'<div class="empty aurora"><span class="mod-ic">'+ic("chat")+'</span><h3>Henüz kayıtlı cümle yok</h3><p>Dil bilgisi örneklerinde, kelime kartlarında, Cümle Kur ve Dinleme sonuçlarında cümlenin yanındaki '+ic("bookmark")+' işaretine dokun; cümle buraya eklenir.</p><a class="primary" href="#gramer">Dil Bilgisi</a></div>';
  }
  box.innerHTML=h;
  box.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{if(b.dataset.st!==STUDY.tab||NOTE.open)noteCleanup();STUDY.tab=b.dataset.st;renderStudy()});
  if($("phStart"))$("phStart").onclick=e=>{e.stopPropagation();window.scrollTo({top:0,behavior:"auto"});pomoToggle(true)};
  if($("stPomo"))$("stPomo").onclick=e=>{e.preventDefault();STUDY.tab="pomo";renderStudy();window.scrollTo({top:0,behavior:"auto"})};
  if(STUDY.tab==="not")bindNotes();
  bindGoal(open=>{renderStudy();if(open){$("goalBox").hidden=false;$("goalEdit").textContent="Kapat"}});
}

/* ================= NOTLARIM =================
   P.notes[id]={id,t:başlık,b:metin,c:oluşturma,u:son değişiklik} · silinenler P._del["n:"+id] (cihazlar arası) */
var NOTE={open:null,q:"",del:null};
function noteCleanup(){P._del=P._del||{};const n=NOTE.open&&P.notes&&P.notes[NOTE.open];if(n&&!n.t.trim()&&!n.b.trim()){delete P.notes[n.id];if(n.u)P._del["n:"+n.id]=Date.now();save()}NOTE.open=null;NOTE.del=null}
const noteCount=()=>Object.values(P.notes||{}).filter(n=>(n.t||"").trim()||(n.b||"").trim()).length;
function notesList(){
  const q=NOTE.q.trim().toLocaleLowerCase("tr");
  return Object.values(P.notes||{}).filter(n=>((n.t||"").trim()||(n.b||"").trim())&&(!q||(n.t+" "+n.b).toLocaleLowerCase("tr").includes(q))).sort((a,b)=>(b.u||0)-(a.u||0));
}
function noteDate(t){const d=new Date(t),now=new Date();
  return d.toDateString()===now.toDateString()?"Bugün "+d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:d.getFullYear()===now.getFullYear()?undefined:"numeric"})}
function notesHtml(){
  P.notes=P.notes||{};P._del=P._del||{};const all=noteCount();
  const n=NOTE.open&&P.notes[NOTE.open];
  if(n)return '<div class="nt-edit card"><div class="nt-top"><button class="ghost" id="ntBack">'+ic("left")+'Notlar</button><span class="note" id="ntSaved">'+(n.u?"Kaydedildi · "+noteDate(n.u):"")+'</span></div>'+
    '<input id="ntTitle" class="nt-title" maxlength="120" placeholder="Başlık (isteğe bağlı)" value="'+esc(n.t||"")+'" aria-label="Not başlığı">'+
    '<textarea id="ntBody" class="nt-body" maxlength="20000" placeholder="Notunu buraya yaz… Örneğin: make ile do farkı, sınavdan önce tekrar edeceğim konular, yeni öğrendiğim kalıplar." aria-label="Not metni">'+esc(n.b||"")+'</textarea>'+
    '<div class="nt-foot">'+(NOTE.del===n.id?'<span class="note">Bu not silinsin mi?</span><button class="ghost" id="ntNo">Vazgeç</button><button class="primary nt-danger" id="ntYes">Sil</button>':'<button class="ghost nt-delbtn" id="ntDel">'+ic("x")+'Notu sil</button><button class="primary" id="ntDone">'+ic("check")+'Bitti</button>')+'</div></div>';
  const list=notesList();
  return '<div class="st-bar nt-bar">'+(all>3?'<label class="nt-search">'+ic("search")+'<input id="ntQ" type="search" placeholder="Notlarda ara" value="'+esc(NOTE.q)+'" aria-label="Notlarda ara"></label>':'<span class="note">'+(all?all+" not":"")+'</span>')+'<button class="primary" id="ntNew">'+ic("pen")+'Yeni not</button></div>'+
    (all?(list.length?'<div class="nt-list">'+list.map(n=>'<button class="nt-card" data-nt="'+n.id+'"><b>'+esc(n.t||(n.b||"").split("\n")[0].slice(0,60)||"Başlıksız not")+'</b><p>'+esc((n.t?n.b:(n.b||"").split("\n").slice(1).join(" ")).slice(0,160))+'</p><small>'+noteDate(n.u||n.c)+'</small></button>').join("")+'</div>'
      :'<p class="note st-empty">"'+esc(NOTE.q)+'" için not bulunamadı.</p>')
    :'<div class="empty aurora"><span class="mod-ic">'+ic("pen")+'</span><h3>Henüz notun yok</h3><p>Öğrendiklerini, zorlandığın konuları ya da kendine hatırlatmalarını buraya yazabilirsin. Notların otomatik kaydedilir; giriş yaptıysan cihazların arasında da eşitlenir.</p><button class="primary" id="ntNew2">'+ic("pen")+'İlk notunu yaz</button></div>');
}
function bindNotes(){
  const go=()=>{renderStudy()},nw=()=>{const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6),t=Date.now();P.notes[id]={id,t:"",b:"",c:t,u:0};NOTE.open=id;NOTE.del=null;go();setTimeout(()=>$("ntBody")&&$("ntBody").focus(),30)};
  if($("ntNew"))$("ntNew").onclick=nw;if($("ntNew2"))$("ntNew2").onclick=nw;
  if($("ntQ"))$("ntQ").oninput=e=>{NOTE.q=e.target.value;const pos=e.target.selectionStart;go();const q=$("ntQ");if(q){q.focus();q.setSelectionRange(pos,pos)}};
  $("study").querySelectorAll("[data-nt]").forEach(b=>b.onclick=()=>{NOTE.open=b.dataset.nt;NOTE.del=null;go();window.scrollTo({top:0,behavior:"auto"})});
  const n=NOTE.open&&P.notes[NOTE.open];if(!n)return;
  let tm=null;const store=()=>{n.t=$("ntTitle").value;n.b=$("ntBody").value;n.u=Date.now();delete P._del["n:"+n.id];clearTimeout(tm);tm=setTimeout(()=>{save();const s=$("ntSaved");if(s)s.textContent="Kaydedildi · "+noteDate(n.u)},400)};
  $("ntTitle").oninput=store;$("ntBody").oninput=store;
  const ta=$("ntBody"),fit=()=>{ta.style.height="auto";ta.style.height=Math.max(220,ta.scrollHeight+2)+"px"};ta.addEventListener("input",fit);fit();
  const close=()=>{clearTimeout(tm);if(n.u)save();noteCleanup();go()};
  $("ntBack").onclick=close;if($("ntDone"))$("ntDone").onclick=close;
  if($("ntDel"))$("ntDel").onclick=()=>{if(!n.t.trim()&&!n.b.trim()){close();return}NOTE.del=n.id;go()};
  if($("ntNo"))$("ntNo").onclick=()=>{NOTE.del=null;go()};
  if($("ntYes"))$("ntYes").onclick=()=>{delete P.notes[n.id];P._del["n:"+n.id]=Date.now();save();NOTE.open=null;NOTE.del=null;toast("Not silindi");go()};
}
