/* Yarışma kelimeleri, çeviri metinleri ve metin sözlüğü */
const LEVELS={
 kolay:{name:"Kolay",cefr:"A1–A2",bars:1,time:12,desc:"Günlük hayatın temel kelimeleri: ev, okul, yemek, basit fiiller."},
 orta:{name:"Orta",cefr:"B1",bars:2,time:15,desc:"Duygular, iş ve günlük konuşmada sık geçen kelimeler."},
 zor:{name:"Zor",cefr:"B2",bars:3,time:18,desc:"Haber, makale ve sınavlarda geçen akademik kelimeler."},
 uzman:{name:"Uzman",cefr:"C1–C2",bars:4,time:20,desc:"İleri düzey okuma ve yazmada geçen nadir kelimeler."}
};
const WORDS={
 kolay:[
  ["apple","elma","isim"],["house","ev","isim"],["water","su","isim"],["book","kitap","isim"],["dog","köpek","isim"],
  ["cat","kedi","isim"],["car","araba","isim"],["friend","arkadaş","isim"],["school","okul","isim"],["window","pencere","isim"],
  ["bread","ekmek","isim"],["chair","sandalye","isim"],["tree","ağaç","isim"],["sun","güneş","isim"],["door","kapı","isim"],
  ["family","aile","isim"],["city","şehir","isim"],["morning","sabah","isim"],["money","para","isim"],["teacher","öğretmen","isim"],
  ["river","nehir","isim"],["shoe","ayakkabı","isim"],["kitchen","mutfak","isim"],["rain","yağmur","isim"],["holiday","tatil","isim"],
  ["happy","mutlu","sıfat"],["big","büyük","sıfat"],["small","küçük","sıfat"],["cold","soğuk","sıfat"],["hot","sıcak","sıfat"],
  ["fast","hızlı","sıfat"],["new","yeni","sıfat"],["beautiful","güzel","sıfat"],["hungry","aç","sıfat"],["tired","yorgun","sıfat"],
  ["cheap","ucuz","sıfat"],["expensive","pahalı","sıfat"],["easy","kolay","sıfat"],["clean","temiz","sıfat"],["busy","meşgul","sıfat"],
  ["eat","yemek yemek","fiil"],["run","koşmak","fiil"],["write","yazmak","fiil"],["sleep","uyumak","fiil"],["open","açmak","fiil"],
  ["buy","satın almak","fiil"],["listen","dinlemek","fiil"],["walk","yürümek","fiil"],["help","yardım etmek","fiil"],["wait","beklemek","fiil"],
  ["learn","öğrenmek","fiil"],["today","bugün","zarf"],["always","her zaman","zarf"],["often","sık sık","zarf"],["tomorrow","yarın","zarf"]
 ],
 orta:[
  ["achieve","başarmak","fiil"],["borrow","ödünç almak","fiil"],["decide","karar vermek","fiil"],["improve","geliştirmek","fiil"],["avoid","kaçınmak","fiil"],
  ["explain","açıklamak","fiil"],["prepare","hazırlamak","fiil"],["suggest","önermek","fiil"],["complain","şikâyet etmek","fiil"],["forgive","affetmek","fiil"],
  ["reduce","azaltmak","fiil"],["support","desteklemek","fiil"],["arrange","düzenlemek","fiil"],["deserve","hak etmek","fiil"],["survive","hayatta kalmak","fiil"],
  ["compare","karşılaştırmak","fiil"],["refuse","reddetmek","fiil"],["admit","itiraf etmek","fiil"],["encourage","cesaretlendirmek","fiil"],["realise","fark etmek","fiil"],
  ["opinion","görüş","isim"],["advantage","avantaj","isim"],["knowledge","bilgi","isim"],["environment","çevre","isim"],["experience","deneyim","isim"],
  ["neighbour","komşu","isim"],["journey","yolculuk","isim"],["challenge","zorluk","isim"],["reason","sebep","isim"],["purpose","amaç","isim"],
  ["behaviour","davranış","isim"],["income","gelir","isim"],["skill","beceri","isim"],["agreement","anlaşma","isim"],["effort","çaba","isim"],
  ["careful","dikkatli","sıfat"],["available","müsait, mevcut","sıfat"],["honest","dürüst","sıfat"],["worried","endişeli","sıfat"],["polite","kibar","sıfat"],
  ["dangerous","tehlikeli","sıfat"],["necessary","gerekli","sıfat"],["proud","gururlu","sıfat"],["familiar","tanıdık","sıfat"],["generous","cömert","sıfat"],
  ["ordinary","sıradan","sıfat"],["rarely","nadiren","zarf"],["recently","son zamanlarda","zarf"],["although","-e rağmen, -dığı halde","bağlaç"],["however","ancak, fakat","zarf"]
 ],
 zor:[
  ["reluctant","isteksiz","sıfat"],["inevitable","kaçınılmaz","sıfat"],["resilient","dayanıklı, çabuk toparlanan","sıfat"],["tedious","sıkıcı, usandırıcı","sıfat"],["profound","derin, köklü","sıfat"],
  ["scarce","kıt","sıfat"],["plausible","akla yatkın","sıfat"],["vulnerable","savunmasız","sıfat"],["arbitrary","keyfi","sıfat"],["obsolete","modası geçmiş","sıfat"],
  ["reliable","güvenilir","sıfat"],["sufficient","yeterli","sıfat"],["temporary","geçici","sıfat"],["consistent","tutarlı","sıfat"],["substantial","büyük, kayda değer","sıfat"],
  ["mitigate","hafifletmek","fiil"],["undermine","baltalamak","fiil"],["deteriorate","kötüleşmek","fiil"],["advocate","savunmak","fiil"],["comply","uymak","fiil"],
  ["endorse","onaylamak, desteklemek","fiil"],["fluctuate","dalgalanmak","fiil"],["acquire","edinmek","fiil"],["emphasise","vurgulamak","fiil"],["assess","değerlendirmek","fiil"],
  ["pursue","peşinden gitmek","fiil"],["restrict","kısıtlamak","fiil"],["abandon","terk etmek","fiil"],["anticipate","öngörmek","fiil"],["enhance","güçlendirmek","fiil"],
  ["consensus","fikir birliği","isim"],["hindrance","engel","isim"],["dilemma","ikilem","isim"],["perseverance","azim","isim"],["liability","yükümlülük","isim"],
  ["outcome","sonuç","isim"],["threat","tehdit","isim"],["burden","yük","isim"],["framework","çerçeve","isim"],["insight","içgörü","isim"],
  ["whereas","oysa","bağlaç"],["nevertheless","yine de","zarf"],["despite","-e rağmen","edat"],["unless","-medikçe","bağlaç"],["consumption","tüketim","isim"]
 ],
 uzman:[
  ["meticulous","titiz","sıfat"],["eloquent","etkili konuşan","sıfat"],["candid","açık sözlü","sıfat"],["frugal","tutumlu","sıfat"],["ubiquitous","her yerde bulunan","sıfat"],
  ["pragmatic","pragmatik, gerçekçi","sıfat"],["ephemeral","kısa ömürlü","sıfat"],["superfluous","gereksiz, fazlalık","sıfat"],["idiosyncratic","kendine özgü","sıfat"],["benevolent","iyiliksever","sıfat"],
  ["ambivalent","karışık duygular içinde","sıfat"],["tenacious","inatçı, azimli","sıfat"],["complacent","rehavete kapılmış","sıfat"],["gregarious","sokulgan, sosyal","sıfat"],["insidious","sinsi","sıfat"],
  ["magnanimous","yüce gönüllü","sıfat"],["unprecedented","eşi görülmemiş","sıfat"],["lucid","berrak, anlaşılır","sıfat"],["cogent","ikna edici, sağlam","sıfat"],["ambiguous","belirsiz, iki anlamlı","sıfat"],
  ["scrutinise","dikkatle incelemek","fiil"],["alleviate","dindirmek","fiil"],["procrastinate","işi ertelemek","fiil"],["exacerbate","kötüleştirmek","fiil"],["juxtapose","yan yana koymak","fiil"],
  ["acquiesce","boyun eğmek","fiil"],["obfuscate","bulanıklaştırmak","fiil"],["vindicate","haklı çıkarmak","fiil"],["wane","azalmak, sönmek","fiil"],["corroborate","doğrulamak","fiil"],
  ["discrepancy","tutarsızlık","isim"],["nuance","ince fark, nüans","isim"],["leverage","etki gücü","isim"],["subsidy","devlet desteği","isim"],["conundrum","çetrefil sorun","isim"],
  ["prerogative","ayrıcalık","isim"],["propensity","eğilim","isim"],["ramification","dolaylı sonuç","isim"],["anachronism","zamana aykırılık","isim"],["zeal","şevk, gayret","isim"],
  ["notwithstanding","-e rağmen","edat"],["hitherto","şimdiye kadar","zarf"],["albeit","her ne kadar","bağlaç"],["ostensibly","görünüşte","zarf"],["tantamount","eşdeğer","sıfat"]
 ]
};
const TEXTS={
 kolay:[
  {en:"My name is Ali. I live in a small house with my family. We have a cat and a dog.",tr:"Benim adım Ali. Ailemle küçük bir evde yaşıyorum. Bir kedimiz ve bir köpeğimiz var.",keys:["ad","aile","küçük","ev","yaşı","kedi","köpek"]},
  {en:"Every morning I drink tea and eat bread with cheese. Then I go to school by bus.",tr:"Her sabah çay içerim ve peynirli ekmek yerim. Sonra otobüsle okula giderim.",keys:["sabah","çay","ekmek","peynir","okul","otobüs"]},
  {en:"The weather is very cold today. Please close the window and wear your jacket.",tr:"Bugün hava çok soğuk. Lütfen pencereyi kapat ve ceketini giy.",keys:["bugün","hava","soğuk","pencere","kapa","ceket","giy"]},
  {en:"My sister likes reading books. She has a lot of books in her room.",tr:"Kız kardeşim kitap okumayı sever. Odasında çok kitabı var.",keys:["kardeş","kitap","oku","sev","oda"]}
 ],
 orta:[
  {en:"Last summer we travelled to the Aegean coast. The sea was warm and the villages were quiet, so we decided to stay a few more days.",tr:"Geçen yaz Ege kıyısına seyahat ettik. Deniz ılıktı ve köyler sakindi, bu yüzden birkaç gün daha kalmaya karar verdik.",keys:["geçen yaz","ege","deniz","köy","sakin","karar","kal"]},
  {en:"If you want to improve your English, you should read something every day and try to use new words when you speak.",tr:"İngilizceni geliştirmek istiyorsan her gün bir şeyler okumalı ve konuşurken yeni kelimeler kullanmaya çalışmalısın.",keys:["ingilizce","geliştir","her gün","oku","yeni","kelime","konuş"]},
  {en:"Although the restaurant was expensive, the food was not very good and the waiter was quite rude.",tr:"Restoran pahalı olmasına rağmen yemekler pek iyi değildi ve garson oldukça kabaydı.",keys:["restoran","pahalı","rağmen","yemek","iyi","garson","kaba"]},
  {en:"Many people work from home now. It saves time, but some of them feel lonely without their colleagues.",tr:"Artık birçok insan evden çalışıyor. Bu zaman kazandırıyor ama bazıları iş arkadaşları olmadan kendini yalnız hissediyor.",keys:["evden","çalış","zaman","kazan","yalnız","arkadaş"]}
 ],
 zor:[
  {en:"Despite repeated warnings from scientists, governments have been reluctant to take measures that might slow economic growth in the short term.",tr:"Bilim insanlarının tekrarlanan uyarılarına rağmen hükümetler, kısa vadede ekonomik büyümeyi yavaşlatabilecek önlemler almakta isteksiz davrandı.",keys:["bilim","uyarı","rağmen","hükümet","isteksiz","önlem","kısa vade","büyüme","yavaşlat"]},
  {en:"Technology that once seemed revolutionary can become obsolete within a few years, which forces companies to adapt continuously.",tr:"Bir zamanlar devrim niteliğinde görünen teknoloji birkaç yıl içinde modası geçmiş hale gelebilir; bu da şirketleri sürekli uyum sağlamaya zorlar.",keys:["teknoloji","devrim","birkaç yıl","modası geçmiş","şirket","sürekli","uyum","zorla"]},
  {en:"Social media has made it easier to stay in touch with friends, but it has also increased the pressure to present a perfect life.",tr:"Sosyal medya arkadaşlarla iletişimde kalmayı kolaylaştırdı ama aynı zamanda kusursuz bir hayat sunma baskısını da artırdı.",keys:["sosyal medya","arkadaş","iletişim","kolay","baskı","kusursuz","hayat","art"]},
  {en:"Unless we reduce our energy consumption, the cost of living will continue to rise and the environment will suffer.",tr:"Enerji tüketimimizi azaltmazsak yaşam maliyeti artmaya devam edecek ve çevre zarar görecek.",keys:["enerji","tüketim","azalt","yaşam","maliyet","devam","art","çevre","zarar"]}
 ],
 uzman:[
  {en:"The committee scrutinized every detail of the proposal, yet it failed to reach a consensus on how the budget should be allocated.",tr:"Komite teklifin her ayrıntısını dikkatle inceledi, ancak bütçenin nasıl dağıtılacağı konusunda fikir birliğine varamadı.",keys:["komite","teklif","ayrıntı","incele","ancak","bütçe","dağıt","fikir birliği"]},
  {en:"Her argument, albeit persuasive, overlooked the fact that the data had been collected from a very small and unrepresentative sample.",tr:"Onun argümanı, ikna edici olsa da, verilerin çok küçük ve temsil gücü olmayan bir örneklemden toplandığı gerçeğini göz ardı ediyordu.",keys:["argüman","ikna","veri","küçük","temsil","örneklem","topla","göz ardı"]},
  {en:"The author's meticulous research notwithstanding, critics argued that the book's conclusions were too ambiguous to be of practical use.",tr:"Yazarın titiz araştırmasına rağmen eleştirmenler, kitabın sonuçlarının pratik bir işe yaramayacak kadar belirsiz olduğunu savundu.",keys:["yazar","titiz","araştırma","rağmen","eleştirmen","sonuç","belirsiz","savun"]},
  {en:"Rapid urbanization has exacerbated existing inequalities, leaving the most vulnerable communities with scarce access to clean water.",tr:"Hızlı kentleşme mevcut eşitsizlikleri derinleştirdi ve en savunmasız toplulukların temiz suya erişimini kısıtlı bıraktı.",keys:["hızlı","kentleşme","mevcut","eşitsizlik","savunmasız","topluluk","temiz su","erişim"]}
 ]
};
const GLOSS={
 "my":"benim","name":"ad, isim","is":"-dır, -dir (olmak)","i":"ben","live":"yaşamak","in":"içinde, -de","a":"bir","small":"küçük","house":"ev","with":"ile, -le","family":"aile","we":"biz","have":"sahip olmak","cat":"kedi","and":"ve","dog":"köpek","ali":"Ali (isim)",
 "every":"her","morning":"sabah","drink":"içmek","tea":"çay","eat":"yemek","bread":"ekmek","cheese":"peynir","then":"sonra","go":"gitmek","to":"-e, -a; -mek","school":"okul","by":"ile (araçla)","bus":"otobüs",
 "the":"belirli tanımlık (o, şu)","weather":"hava","very":"çok","cold":"soğuk","today":"bugün","please":"lütfen","close":"kapatmak","window":"pencere","wear":"giymek","your":"senin","jacket":"ceket",
 "sister":"kız kardeş","likes":"sever (like: sevmek)","reading":"okumak, okuma","books":"kitaplar","she":"o (kadın)","has":"sahip (have'in 3. tekil hali)","lot":"çok (a lot of: birçok)","of":"-in, -ın","her":"onun (kadın)","room":"oda",
 "last":"geçen, son","summer":"yaz","travelled":"seyahat ettik (travel)","aegean":"Ege","coast":"kıyı, sahil","sea":"deniz","was":"idi (be'nin geçmiş hali)","warm":"ılık, sıcak","villages":"köyler","were":"idiler (be'nin geçmiş hali)","quiet":"sessiz, sakin","so":"bu yüzden","decided":"karar verdik (decide)","stay":"kalmak","few":"az, birkaç","more":"daha","days":"günler",
 "if":"eğer","you":"sen, siz","want":"istemek","improve":"geliştirmek","english":"İngilizce","should":"-meli, -malı","read":"okumak","something":"bir şey","day":"gün","try":"denemek, çalışmak","use":"kullanmak; kullanım, fayda","new":"yeni","words":"kelimeler","when":"-dığında, ne zaman","speak":"konuşmak",
 "although":"-e rağmen, -dığı halde","restaurant":"restoran","expensive":"pahalı","food":"yemek","not":"değil","good":"iyi","waiter":"garson","quite":"oldukça","rude":"kaba",
 "many":"birçok","people":"insanlar","work":"çalışmak","from":"-den, -dan","home":"ev","now":"şimdi, artık","it":"o (cansız)","saves":"kazandırır (save)","time":"zaman","but":"ama","some":"bazı","them":"onları, onlar","feel":"hissetmek","lonely":"yalnız","without":"-sız, olmadan","colleagues":"iş arkadaşları","their":"onların",
 "despite":"-e rağmen","repeated":"tekrarlanan","warnings":"uyarılar","scientists":"bilim insanları","governments":"hükümetler","been":"olmuş (be'nin 3. hali)","reluctant":"isteksiz","take":"almak","measures":"önlemler","that":"ki, -en/-an","might":"-ebilir (ihtimal)","slow":"yavaşlatmak","economic":"ekonomik","growth":"büyüme","short":"kısa","term":"vade, dönem",
 "technology":"teknoloji","once":"bir zamanlar","seemed":"göründü (seem)","revolutionary":"devrim niteliğinde","can":"-ebilir","become":"olmak, hâline gelmek","obsolete":"modası geçmiş","within":"içinde, zarfında","years":"yıllar","which":"ki bu, hangi","forces":"zorlar (force)","companies":"şirketler","adapt":"uyum sağlamak","continuously":"sürekli olarak",
 "social":"sosyal","media":"medya","made":"yaptı, hale getirdi (make)","easier":"daha kolay","touch":"dokunma (stay in touch: iletişimde kalmak)","friends":"arkadaşlar","also":"ayrıca, de","increased":"artırdı (increase)","pressure":"baskı","present":"sunmak, göstermek","perfect":"kusursuz, mükemmel","life":"hayat",
 "unless":"-medikçe, -mezse","our":"bizim","energy":"enerji","consumption":"tüketim","reduce":"azaltmak","cost":"maliyet","living":"yaşam (cost of living: hayat pahalılığı)","will":"-ecek (gelecek zaman)","continue":"devam etmek","rise":"yükselmek, artmak","environment":"çevre","suffer":"acı çekmek, zarar görmek",
 "committee":"komite, kurul","scrutinized":"dikkatle inceledi (scrutinize)","detail":"ayrıntı","proposal":"teklif, öneri","yet":"ancak, yine de","failed":"başaramadı (fail)","reach":"ulaşmak, varmak","consensus":"fikir birliği","on":"üzerine, hakkında","how":"nasıl","budget":"bütçe","be":"olmak","allocated":"dağıtılmış, tahsis edilmiş",
 "argument":"argüman, görüş","albeit":"her ne kadar, -se de","persuasive":"ikna edici","overlooked":"göz ardı etti (overlook)","fact":"gerçek","data":"veri","had":"-mişti (have'in geçmiş hali)","collected":"toplanmış (collect)","unrepresentative":"temsil gücü olmayan","sample":"örneklem, örnek",
 "author":"yazar","meticulous":"titiz","research":"araştırma","notwithstanding":"-e rağmen","critics":"eleştirmenler","argued":"savundu (argue)","book":"kitap","conclusions":"sonuçlar","too":"fazla, çok (too…to: -emeyecek kadar)","ambiguous":"belirsiz, iki anlamlı","practical":"pratik, işe yarar",
 "rapid":"hızlı","urbanization":"kentleşme","exacerbated":"kötüleştirdi (exacerbate)","existing":"mevcut","inequalities":"eşitsizlikler","leaving":"bırakarak (leave)","most":"en, en çok","vulnerable":"savunmasız","communities":"topluluklar","scarce":"kıt","access":"erişim","clean":"temiz","water":"su"
};
