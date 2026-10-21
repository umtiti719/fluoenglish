/* Seviye testi soru havuzu
   Her soru: {lv: 0-4 (A1..C1), sk: "kelime"|"gramer"|"okuma"|"dinleme", q, opts, a (doğru indeks), text?, audio?} */
const CEFR=[
 {code:"A1",name:"Başlangıç",desc:"Tanıdık günlük ifadeleri ve basit cümleleri anlarsın. Kendini tanıtabilir, basit sorular sorup cevaplayabilirsin."},
 {code:"A2",name:"Temel",desc:"Alışveriş, yol tarifi, aile gibi rutin konularda basit iletişim kurabilir, kısa ve basit metinleri anlayabilirsin."},
 {code:"B1",name:"Orta",desc:"İş, okul ve seyahat gibi tanıdık konularda kendini ifade edebilir, açık anlatılan metin ve konuşmaların ana fikrini yakalayabilirsin."},
 {code:"B2",name:"İleri Orta",desc:"Karmaşık metinlerin ana fikrini anlar, ana dili İngilizce olan biriyle oldukça akıcı ve doğal konuşabilirsin."},
 {code:"C1",name:"İleri",desc:"Uzun ve zorlayıcı metinleri, ima edilen anlamları anlar; dili iş ve akademik hayatta esnek ve etkili kullanabilirsin."}
];
const SKILLS={kelime:{name:"Kelime",icon:"cards"},gramer:{name:"Dil bilgisi",icon:"book"},okuma:{name:"Okuma",icon:"doc"},dinleme:{name:"Dinleme",icon:"headphones"}};
const TESTQ=[
 /* ---------- A1 ---------- */
 {lv:0,sk:"kelime",q:"\"kitchen\" kelimesinin anlamı nedir?",opts:["mutfak","bahçe","yatak odası","banyo"],a:0},
 {lv:0,sk:"kelime",q:"\"tired\" kelimesinin anlamı nedir?",opts:["yorgun","aç","mutlu","hasta"],a:0},
 {lv:0,sk:"kelime",q:"\"always\" kelimesinin anlamı nedir?",opts:["her zaman","bazen","asla","şimdi"],a:0},
 {lv:0,sk:"gramer",q:"My brother ___ a doctor.",opts:["is","are","am","be"],a:0},
 {lv:0,sk:"gramer",q:"___ you like coffee?",opts:["Do","Does","Are","Is"],a:0},
 {lv:0,sk:"gramer",q:"There ___ two cats in the garden.",opts:["are","is","am","be"],a:0},
 {lv:0,sk:"okuma",text:"Hi! I'm Elif. I'm 20 years old and I live in Izmir with my parents. I'm a student. Every morning I go to school by bus.",q:"Elif okula nasıl gidiyor?",opts:["Otobüsle","Yürüyerek","Arabayla","Metroyla"],a:0},
 {lv:0,sk:"dinleme",audio:"Can I have a glass of water, please?",q:"Konuşan kişi ne istiyor?",opts:["Bir bardak su","Bir fincan kahve","Bir dilim ekmek","Bir kâse çorba"],a:0},
 {lv:0,sk:"dinleme",audio:"The shop opens at nine o'clock.",q:"Dükkân saat kaçta açılıyor?",opts:["Saat 9'da","Saat 5'te","Saat 10'da","Saat 7'de"],a:0},
 /* ---------- A2 ---------- */
 {lv:1,sk:"kelime",q:"\"borrow\" kelimesinin anlamı nedir?",opts:["ödünç almak","satın almak","ödünç vermek","kaybetmek"],a:0},
 {lv:1,sk:"kelime",q:"\"neighbour\" kelimesinin anlamı nedir?",opts:["komşu","akraba","misafir","iş arkadaşı"],a:0},
 {lv:1,sk:"kelime",q:"\"cheap\" kelimesinin anlamı nedir?",opts:["ucuz","pahalı","eski","temiz"],a:0},
 {lv:1,sk:"gramer",q:"I ___ to the cinema last night.",opts:["went","go","have gone","going"],a:0},
 {lv:1,sk:"gramer",q:"She is ___ than her sister.",opts:["taller","tall","tallest","more tall"],a:0},
 {lv:1,sk:"gramer",q:"Look! It ___.",opts:["is raining","rains","rained","rain"],a:0},
 {lv:1,sk:"okuma",text:"Dear Mark, thanks for your email. I'm having a great time in Antalya. The hotel is next to the beach, and the weather is hot and sunny. Yesterday we visited an old city and ate fish. We're coming home on Sunday. Love, Ayşe",q:"Ayşe eve ne zaman dönüyor?",opts:["Pazar günü","Dün","Cumartesi günü","Bugün"],a:0},
 {lv:1,sk:"dinleme",audio:"I'm sorry, but the train to Ankara has been cancelled.",q:"Duyduğun duyuruda ne söyleniyor?",opts:["Ankara treni iptal edildi","Ankara treni gecikecek","Ankara treninin biletleri tükendi","Ankara treni erken kalkacak"],a:0},
 {lv:1,sk:"dinleme",audio:"Could you tell me where the nearest pharmacy is?",q:"Konuşan kişi ne soruyor?",opts:["En yakın eczanenin nerede olduğunu","Eczanenin kaçta açıldığını","Bir ilacın fiyatını","Hastaneye nasıl gidileceğini"],a:0},
 /* ---------- B1 ---------- */
 {lv:2,sk:"kelime",q:"\"achieve\" kelimesinin anlamı nedir?",opts:["başarmak","kaçınmak","beklemek","ertelemek"],a:0},
 {lv:2,sk:"kelime",q:"\"reliable\" kelimesinin anlamı nedir?",opts:["güvenilir","kullanışlı","dikkatsiz","pahalı"],a:0},
 {lv:2,sk:"kelime",q:"\"get along with\" ifadesinin anlamı nedir?",opts:["biriyle iyi geçinmek","birini beklemek","birinden kaçmak","birine benzemek"],a:0},
 {lv:2,sk:"gramer",q:"I ___ here since 2019.",opts:["have lived","live","am living","lived"],a:0},
 {lv:2,sk:"gramer",q:"If it rains tomorrow, we ___ at home.",opts:["will stay","stayed","would stay","stay"],a:0},
 {lv:2,sk:"gramer",q:"The bridge ___ in 1973.",opts:["was built","built","has built","is building"],a:0},
 {lv:2,sk:"okuma",text:"More and more people in Turkey are working from home. Many say they save time and money because they don't have to travel to the office. However, some workers feel lonely and find it difficult to separate their work and private life.",q:"Metne göre evden çalışmanın olumsuz yanı nedir?",opts:["Bazı çalışanlar kendini yalnız hissediyor","Daha fazla para harcanıyor","Yolculuk süresi uzuyor","Maaşlar düşüyor"],a:0},
 {lv:2,sk:"dinleme",audio:"If I were you, I'd book the tickets as soon as possible.",q:"Konuşan kişi ne öneriyor?",opts:["Biletleri bir an önce almayı","Biletleri çoktan aldığını","Biletlerin çok pahalı olduğunu","Seyahati ertelemeyi"],a:0},
 {lv:2,sk:"dinleme",audio:"She's been learning Spanish for three years, but she still finds it hard to speak.",q:"Duyduğun cümleye göre hangisi doğru?",opts:["Üç yıldır İspanyolca öğreniyor ama konuşmakta hâlâ zorlanıyor","Üç yıl önce İspanyolca öğrenmeyi bıraktı","Üç ayda akıcı İspanyolca konuşmaya başladı","İspanyolca öğretmeni olmak istiyor"],a:0},
 /* ---------- B2 ---------- */
 {lv:3,sk:"kelime",q:"\"reluctant\" kelimesinin anlamı nedir?",opts:["isteksiz","hevesli","kararlı","şaşkın"],a:0},
 {lv:3,sk:"kelime",q:"\"undermine\" kelimesinin anlamı nedir?",opts:["baltalamak, zayıflatmak","desteklemek","abartmak","ertelemek"],a:0},
 {lv:3,sk:"kelime",q:"\"consensus\" kelimesinin anlamı nedir?",opts:["fikir birliği","anlaşmazlık","sonuç","öneri"],a:0},
 {lv:3,sk:"gramer",q:"By the time we arrived, the film ___.",opts:["had already started","already started","has already started","was already starting"],a:0},
 {lv:3,sk:"gramer",q:"She said she ___ me the next day.",opts:["would call","will call","calls","has called"],a:0},
 {lv:3,sk:"gramer",q:"I wish I ___ more time to travel.",opts:["had","have","will have","would have had"],a:0},
 {lv:3,sk:"okuma",text:"Despite years of warnings from scientists, many cities have been slow to prepare for extreme heat. Experts argue that planting trees and using lighter materials on roofs could significantly reduce temperatures, yet these measures are often considered too expensive in the short term.",q:"Metne göre şehirler neden önlem almakta yavaş kalıyor?",opts:["Önlemler kısa vadede pahalı bulunuyor","Bilim insanları hiç uyarmadı","Ağaç dikmenin etkisi yok","Aşırı sıcak artık bir sorun değil"],a:0},
 {lv:3,sk:"dinleme",audio:"Had I known about the traffic, I would have left much earlier.",q:"Duyduğun cümleye göre hangisi doğru?",opts:["Trafiği bilseydi çok daha erken çıkardı","Trafik yüzünden erken çıktı","Trafiğe rağmen zamanında geldi","Yarın erken çıkmayı planlıyor"],a:0},
 {lv:3,sk:"dinleme",audio:"The company is expected to announce its new strategy at the end of the month.",q:"Duyduğun haberde ne söyleniyor?",opts:["Şirketin yeni stratejisini ay sonunda açıklaması bekleniyor","Şirket yeni stratejisini bu sabah açıkladı","Şirket stratejisini değiştirmeyecek","Şirket ay sonunda kapanacak"],a:0},
 /* ---------- C1 ---------- */
 {lv:4,sk:"kelime",q:"\"meticulous\" kelimesinin anlamı nedir?",opts:["titiz","dikkatsiz","cömert","kararsız"],a:0},
 {lv:4,sk:"kelime",q:"\"alleviate\" kelimesinin anlamı nedir?",opts:["hafifletmek","kötüleştirmek","ertelemek","açıklamak"],a:0},
 {lv:4,sk:"kelime",q:"\"ambiguous\" kelimesinin anlamı nedir?",opts:["belirsiz, iki anlamlı","açık ve net","tutarlı","abartılı"],a:0},
 {lv:4,sk:"gramer",q:"Not only ___ late, but he also forgot the documents.",opts:["was he","he was","he has","did he"],a:0},
 {lv:4,sk:"gramer",q:"Hardly ___ the meeting started when the power went out.",opts:["had","has","did","was"],a:0},
 {lv:4,sk:"gramer",q:"It's high time we ___ a decision.",opts:["made","make","will make","have made"],a:0},
 {lv:4,sk:"okuma",text:"Proponents of a four-day working week claim it boosts productivity and wellbeing, citing trials in which output remained stable despite reduced hours. Sceptics, however, caution that such results may not translate to sectors where demand is continuous, such as healthcare, and that the gains could be short-lived once the novelty wears off.",q:"Şüpheciler hangi konuda uyarıyor?",opts:["Sonuçlar her sektöre uymayabilir ve kalıcı olmayabilir","Dört günlük hafta üretkenliği hemen düşürür","Denemelerde üretim belirgin şekilde azaldı","Sağlık çalışanları daha uzun tatil istiyor"],a:0},
 {lv:4,sk:"dinleme",audio:"Notwithstanding the setbacks, the team managed to deliver the project ahead of schedule.",q:"Duyduğun cümleye göre hangisi doğru?",opts:["Aksiliklere rağmen proje planlanandan önce teslim edildi","Aksilikler yüzünden proje gecikti","Ekip projeden vazgeçti","Projenin teslim tarihi ertelendi"],a:0},
 {lv:4,sk:"dinleme",audio:"Her argument, albeit compelling, overlooks the long-term costs.",q:"Konuşan kişi argüman hakkında ne düşünüyor?",opts:["İkna edici ama uzun vadeli maliyetleri gözden kaçırıyor","Zayıf ve maliyetleri abartıyor","Uzun vadeli maliyetler argümanı güçlendiriyor","Argüman henüz açıklanmadı"],a:0}
];
/* Seviyeye göre başlangıç önerileri */
const TEST_REC=[
 {deck:"daily",topic:"to-be",quiz:"kolay"},
 {deck:"food",topic:"present-continuous",quiz:"kolay"},
 {deck:"work",topic:"present-perfect",quiz:"orta"},
 {deck:"phrasal",topic:"past-perfect",quiz:"zor"},
 {deck:"beautiful",topic:"wish",quiz:"uzman"}
];
