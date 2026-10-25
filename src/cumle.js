/* ================= CÜMLE KUR (Türkçeden İngilizceye) =================
   Türkçe cümleyi gör, İngilizcesini ya karışık kartları sıralayarak ya da yazarak kur.
   Cümleler uygulamanın kendi içeriğinden gelir: deste örnekleri, yarışma örnekleri, gramer örnekleri.
   Hafıza: P.seen["c:"+cümle] (görülme), yanlışlar sonra yeniden gelir; P.build={n,ok}. */
var CB={lv:"kolay",mode:"kart",cur:null,picked:[],bank:[],answered:false,hints:0,queue:[],res:null};
var CPOOL=null;

function buildTokens(en){
  return plain(en).replace(/[“”"]/g,"").split(/\s+/).map(t=>t.replace(/^[^\w']+|[^\w']+$/g,"")).filter(Boolean);
}
function cpool(){
  if(CPOOL)return CPOOL;
  CPOOL=LSENT.filter(s=>s.tr&&!/^Metnin tamamı/.test(s.tr)&&!/[;:()\[\]]/.test(s.en)).map(s=>({...s,tok:buildTokens(s.en)}))
    .filter(s=>s.tok.length>=3&&s.tok.length<=(s.lv==="kolay"?9:s.lv==="orta"?11:13));
  return CPOOL;
}
function ckey(s){return "c:"+plain(s.en)}

function newBuild(){
  const pool=cpool().filter(s=>s.lv===CB.lv);
  // önce daha önce yanlış yapılıp tekrar sırası gelenler
  let s=null;const qi=CB.queue.findIndex(q=>q.lv===CB.lv&&q.due<=Date.now());
  if(qi>=0){s=CB.queue.splice(qi,1)[0].s}
  if(!s){const cand=pickFresh(pool,ckey,8);s=cand[Math.floor(Math.random()*Math.min(3,cand.length))]}
  CB.cur=s;CB.picked=[];CB.answered=false;CB.hints=0;CB.res=null;
  // kart bankası: cümlenin kelimeleri + birkaç çeldirici
  const own=new Set(s.tok.map(t=>t.toLowerCase()));
  const nd=CB.lv==="kolay"?2:3;const dis=[];
  for(const o of shuffle(pool)){if(dis.length>=nd)break;
    for(const t of shuffle(o.tok)){const l=t.toLowerCase();
      if(!own.has(l)&&!dis.some(d=>d.toLowerCase()===l)&&/^[a-z']+$/.test(t)&&t.length>1){dis.push(t);break}}}
  CB.bank=shuffle(s.tok.concat(dis).map((t,i)=>({t,id:i,used:false})));
  renderBuild();
  if(CB.mode==="yaz")setTimeout(()=>{const i=$("bInput");if(i&&!matchMedia("(pointer:coarse)").matches)i.focus()},50);
}

function renderBuildStat(){const b=P.build||{n:0,ok:0};const el=$("buildStat");if(el)el.innerHTML='<div><b>'+b.ok+'</b><span>/ '+b.n+' doğru</span></div>'}
function renderBuildSel(){
  $("bLevels").innerHTML=Object.entries(LEVELS).map(([k,Lv])=>'<button style="--c:var(--lv-'+k+')" aria-pressed="'+(k===CB.lv)+'" data-k="'+k+'">'+Lv.name+'<small>'+Lv.cefr+'</small></button>').join("");
  $("bLevels").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(CB.lv===b.dataset.k)return;CB.lv=b.dataset.k;renderBuildSel();newBuild()});
  $("bModes").querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.m===CB.mode);
    b.onclick=()=>{if(CB.mode===b.dataset.m)return;CB.mode=b.dataset.m;renderBuildSel();if(CB.answered)newBuild();else{CB.picked=[];CB.bank.forEach(x=>x.used=false);renderBuild()}}});
}
function openBuild(){renderBuildStat();renderBuildSel();if(!CB.cur)newBuild();else renderBuild()}

function renderBuild(){
  const s=CB.cur,box=$("buildBox");if(!s||!box)return;
  let h='<div class="bq"><span class="badge">'+esc(s.src||"")+'</span><p class="btr">'+esc(s.tr)+'</p><small class="bhelp">'+(CB.mode==="kart"?"İngilizcesini kartları sırayla seçerek kur":"İngilizcesini yaz")+'</small></div>';
  if(CB.mode==="kart"){
    h+='<div class="bans'+(CB.answered?(CB.res.ok?" ok":" bad"):"")+'" id="bAns" aria-label="Kurduğun cümle">'+(CB.picked.length?CB.picked.map((x,i)=>'<button class="btile in" data-p="'+i+'"'+(CB.answered?" disabled":"")+'>'+esc(x.t)+'</button>').join(""):'<span class="bph">Kartlara dokun</span>')+'</div>'+
      '<div class="bbank" id="bBank">'+CB.bank.map(x=>'<button class="btile'+(x.used?" used":"")+'" data-id="'+x.id+'"'+(x.used||CB.answered?" disabled":"")+'>'+esc(x.t)+'</button>').join("")+'</div>';
  }else{
    h+='<label class="fld bwrite"><span class="sr">İngilizce cümle</span><textarea id="bInput" rows="2" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="İngilizcesini buraya yaz…"'+(CB.answered?" disabled":"")+'>'+esc(CB.typed||"")+'</textarea></label>';
  }
  if(!CB.answered){
    h+='<div class="bfoot"><button class="linkbtn" id="bSkip">Bilmiyorum</button><span class="sp"></span>'+
      (CB.mode==="kart"?'<button class="ghost" id="bHint">'+ic("bulb")+'İpucu</button>':'')+
      '<button class="primary" id="bCheck"'+(CB.mode==="kart"&&!CB.picked.length?" disabled":"")+'>Kontrol et</button></div>';
  }else{
    const r=CB.res;
    h+='<div class="bres '+(r.ok?"ok":"bad")+'"><div class="bres-h">'+ic(r.ok?"check":"x")+'<b>'+esc(r.title)+'</b></div>'+
      '<div class="bres-s"><p>'+r.refHtml+'</p>'+sayBtn(s.en,"sm")+'</div>'+(r.usrHtml?'<div class="bres-u"><small>Senin cümlen</small><p>'+r.usrHtml+'</p></div>':'')+
      (r.note?'<p class="note">'+esc(r.note)+'</p>':'')+
      '<div class="bfoot"><span class="sp"></span><button class="primary" id="bNext">Sonraki cümle<span class="arr">'+ic("right")+'</span></button></div></div>';
  }
  box.innerHTML=h;
  if(CB.mode==="kart"&&!CB.answered){
    box.querySelectorAll("#bBank .btile").forEach(b=>b.onclick=()=>{const x=CB.bank.find(y=>y.id===+b.dataset.id);if(!x||x.used)return;x.used=true;CB.picked.push(x);renderBuild()});
    box.querySelectorAll("#bAns .btile").forEach(b=>b.onclick=()=>{const x=CB.picked.splice(+b.dataset.p,1)[0];if(x)x.used=false;renderBuild()});
    $("bHint").onclick=buildHint;
  }
  if(CB.mode==="yaz"&&!CB.answered){const i=$("bInput");i.oninput=()=>{CB.typed=i.value};
    i.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();checkBuild()}}}
  if(!CB.answered){$("bCheck").onclick=()=>checkBuild();$("bSkip").onclick=()=>checkBuild(true)}
  else{$("bNext").onclick=()=>{CB.typed="";newBuild()};setTimeout(()=>{try{$("bNext").focus({preventScroll:true})}catch(e){}},30)}
}
function buildHint(){
  const want=CB.cur.tok;let i=0;
  while(i<CB.picked.length&&i<want.length&&CB.picked[i].t===want[i])i++;
  // yanlış kartları geri gönder, sıradaki doğru kartı ekle
  CB.picked.splice(i).forEach(x=>x.used=false);
  if(i<want.length){const x=CB.bank.find(y=>!y.used&&y.t===want[i]);if(x){x.used=true;CB.picked.push(x)}}
  CB.hints++;renderBuild();
}
function checkBuild(give){
  if(CB.answered)return;const s=CB.cur;
  let ok=false,title,refHtml,usrHtml="",note="";
  if(CB.mode==="kart"){
    const got=CB.picked.map(x=>x.t.toLowerCase()),want=s.tok.map(t=>t.toLowerCase());
    ok=!give&&got.join(" ")===want.join(" ");
    refHtml=esc(plain(s.en));
    if(!ok&&!give&&got.length){const {hitA,hitB}=lcs(want,got);
      usrHtml=CB.picked.map((x,i)=>'<span class="dw '+(hitB.has(i)?"":"x")+'">'+esc(x.t)+'</span>').join(" ");
      refHtml=s.tok.map((t,i)=>'<span class="dw '+(hitA.has(i)?"g":"r")+'">'+esc(t)+'</span>').join(" ")}
    if(ok&&CB.hints)note=CB.hints+" ipucuyla kurdun. Bir dahaki sefere ipucusuz dene!";
  }else{
    const txt=give?"":($("bInput").value||"").trim();
    if(!give&&!txt){$("bInput").focus();return}
    const ref=words_(s.en),usr=words_(txt);
    if(!give){
      if(ref.join(" ")===usr.join(" "))ok=true;
      else if(ref.length===usr.length){let d=0;ref.forEach((w,i)=>d+=lev(w,usr[i]));if(d<=2&&d<=Math.ceil(ref.join("").length/15)){ok=true;note="Küçük bir yazım hatası var; doğrusunu yukarıda görebilirsin."}}
    }
    const {hitA,hitB}=lcs(ref,usr);
    refHtml=ok&&!note?esc(plain(s.en)):ref.map((w,i)=>'<span class="dw '+(hitA.has(i)?"g":"r")+'">'+esc(w)+'</span>').join(" ");
    if(!ok&&usr.length)usrHtml=usr.map((w,i)=>'<span class="dw '+(hitB.has(i)?"":"x")+'">'+esc(w)+'</span>').join(" ");
    if(!ok&&!give&&usr.length){const sc=Math.round(hitA.size/ref.length*100);if(sc>=60)note="Çok yaklaştın (%"+sc+"). Kırmızı kelimelere dikkat et."}
  }
  title=ok?(["Harika!","Doğru!","Tam isabet!","Çok iyi!"][Math.floor(Math.random()*4)]):give?"Doğru cümle":"Tam olmadı";
  CB.answered=true;CB.res={ok,title,refHtml,usrHtml,note};
  P.build=P.build||{n:0,ok:0};P.build.n++;if(ok)P.build.ok++;
  touch(ckey(s));markActive();
  if(s.word&&winfo(s.word)){if(ok)srsOk(s.word);else srsWrong(s.word)}
  if(!ok)CB.queue.push({s,lv:s.lv,due:Date.now()+3*60*1000}); // yanlış cümle birkaç dakika sonra yeniden gelir
  save();renderBuildStat();renderBuild();
  if(P.set.autoSpeak||ok)speak(plain(s.en),document.querySelector("#buildBox .bres .speak"));
}

// Klavye: Enter ile kontrol et / sonraki cümle (yazma kutusu kendi Enter'ını yönetir)
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter"||$("v-cumle").hidden||e.target.id==="bInput"||/^(BUTTON|A|TEXTAREA|INPUT)$/.test(e.target.tagName))return;
  if(CB.answered)$("bNext")?.click();else if(CB.mode==="kart"&&CB.picked.length)checkBuild();
});
