/* ================= BÜYÜK SÖZLÜK =================
   sozluk.js (window.FLUO_DICT) ihtiyaç olunca yüklenir: Çeviri, Metin Çevirisi ve Okuma sayfalarında.
   Katmanlar: Fluo çekirdek sözlüğü (f) + FreeDict eng-tur yedeği (d, GPL-2.0+). */
var DICT=null,DICT_P=null,DICT_REV=null;
var IRREG={went:"go",gone:"go",goes:"go",ran:"run",was:"be",were:"be",been:"be",is:"be",are:"be",am:"be",had:"have",has:"have",did:"do",does:"do",done:"do",
  made:"make",said:"say",took:"take",taken:"take",came:"come",saw:"see",seen:"see",knew:"know",known:"know",got:"get",gotten:"get",gave:"give",given:"give",
  found:"find",thought:"think",told:"tell",became:"become",left:"leave",felt:"feel",brought:"bring",began:"begin",begun:"begin",kept:"keep",held:"hold",wrote:"write",written:"write",
  stood:"stand",heard:"hear",meant:"mean",met:"meet",paid:"pay",sat:"sit",spoke:"speak",spoken:"speak",lay:"lie",led:"lead",grew:"grow",grown:"grow",lost:"lose",fell:"fall",fallen:"fall",
  sent:"send",built:"build",understood:"understand",drew:"draw",drawn:"draw",broke:"break",broken:"break",spent:"spend",rose:"rise",risen:"rise",drove:"drive",driven:"drive",bought:"buy",
  wore:"wear",worn:"wear",chose:"choose",chosen:"choose",sought:"seek",threw:"throw",thrown:"throw",caught:"catch",dealt:"deal",won:"win",forgot:"forget",forgotten:"forget",
  sold:"sell",fought:"fight",taught:"teach",ate:"eat",eaten:"eat",slept:"sleep",flew:"fly",flown:"fly",drank:"drink",drunk:"drink",sang:"sing",sung:"sing",swam:"swim",
  hid:"hide",hidden:"hide",shook:"shake",shaken:"shake",woke:"wake",woken:"wake",froze:"freeze",frozen:"freeze",stole:"steal",stolen:"steal",bit:"bite",bitten:"bite",
  children:"child",men:"man",women:"woman",people:"person",feet:"foot",teeth:"tooth",mice:"mouse",geese:"goose",better:"good",best:"good",worse:"bad",worst:"bad"};
function loadDict(){
  if(DICT)return Promise.resolve(DICT);
  return DICT_P||(DICT_P=new Promise((ok,no)=>{const s=document.createElement("script");s.src="sozluk.js";s.async=true;
    s.onload=()=>{DICT=(window.FLUO_DICT&&window.FLUO_DICT.e)||{};ok(DICT);onDictLoaded()};
    s.onerror=()=>{DICT_P=null;no()};document.head.appendChild(s)}));
}
function onDictLoaded(){
  if(lastHash==="cevir"){renderTrHint();const q=$("trInput").value.trim();if(q&&!TR.liveLocal)liveTranslate()}
}
function dictCount(){return DICT?Object.keys(DICT).length:0}
/* kelimeyi ve olası köklerini dener: running→run, studies→study, bigger→big, went→go */
function dictFind(word){
  if(!DICT)return null;
  const w=String(word).toLowerCase().trim().replace(/[’`]/g,"'").replace(/'s$/,"");
  const exact=DICT[w]?{lemma:w,v:DICT[w]}:null;
  if(exact&&exact.v.endsWith("|f"))return exact;
  const c=[];
  if(IRREG[w])c.push(IRREG[w]);
  const add=x=>{if(x&&x.length>1&&!c.includes(x))c.push(x)};
  if(/ies$/.test(w))add(w.slice(0,-3)+"y");
  if(/ied$/.test(w))add(w.slice(0,-3)+"y");
  if(/(ches|shes|xes|sses|zes|oes)$/.test(w))add(w.slice(0,-2));
  if(/s$/.test(w)&&!/ss$/.test(w))add(w.slice(0,-1));
  if(/ing$/.test(w)){const b=w.slice(0,-3);add(b);add(b+"e");if(/(.)\1$/.test(b))add(b.slice(0,-1));if(/y$/.test(b))add(b.slice(0,-1)+"ie")}
  if(/ed$/.test(w)){const b=w.slice(0,-2);add(b);add(w.slice(0,-1));if(/(.)\1$/.test(b))add(b.slice(0,-1))}
  if(/er$/.test(w)){const b=w.slice(0,-2);add(b);add(w.slice(0,-1));if(/(.)\1$/.test(b))add(b.slice(0,-1));if(/i$/.test(b))add(b.slice(0,-1)+"y")}
  if(/est$/.test(w)){const b=w.slice(0,-3);add(b);add(w.slice(0,-2));if(/(.)\1$/.test(b))add(b.slice(0,-1));if(/i$/.test(b))add(b.slice(0,-1)+"y")}
  if(/ly$/.test(w)){add(w.slice(0,-2));if(/ily$/.test(w))add(w.slice(0,-3)+"y")}
  // çekimli biçim: önce çekirdek sözlükteki kök (running→run), sonra yedekteki tam eşleşme, sonra yedekteki kök
  for(const x of c)if(DICT[x]&&DICT[x].endsWith("|f"))return{lemma:x,v:DICT[x]};
  if(exact)return exact;
  for(const x of c)if(DICT[x])return{lemma:x,v:DICT[x]};
  return null;
}
function dictEntry(word){
  const f=dictFind(word);if(!f)return null;
  const [pos,tr,src]=f.v.split("|");
  const senses=src==="f"?tr.split(/;\s*/):tr.split(/,\s*/);
  return{lemma:f.lemma,pos,senses:senses.filter(Boolean),src:src==="f"?"Fluo sözlüğü":"FreeDict sözlüğü",core:src==="f"};
}
/* Türkçeden İngilizceye: yalnızca çekirdek sözlükten (güvenilir) ters dizin */
function dictRev(){
  if(DICT_REV||!DICT)return DICT_REV||{};
  const m={};
  for(const [en,v] of Object.entries(DICT)){const p=v.split("|");if(p[2]!=="f")continue;
    p[1].replace(/\([^)]*\)/g,",").split(/[,;/]/).map(x=>trNorm(x.replace(/^-/,""))).filter(x=>x.length>1).forEach(k=>{(m[k]=m[k]||[]).includes(en)||m[k].push(en)})}
  return DICT_REV=m;
}
