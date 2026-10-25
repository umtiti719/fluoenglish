/* Ünite sınavları: her dil bilgisi seviyesi (A1, A2, B1, B2) bir ünitedir.
   Her konu için 3 sınav sorusu (alıştırmalardan farklı). Biçim: [cümle (___ boşluk), seçenekler, doğru indeks, açıklama]
   Sonuç konu konu değerlendirilir: 3/3 hazır · 2/3 kısa tekrar · 0-1 çalışmalı. */
var EXAM={
/* ---------- A1 ---------- */
"to-be":[
 ["Where ___ my keys? I can't find them.",["is","are","am","be"],1,"\"Keys\" çoğuldur, bu yüzden \"are\"."],
 ["My brother ___ eighteen years old.",["are","is","am","has"],1,"Yaş \"be\" ile söylenir: He is 18. \"He has 18 years\" yanlıştır."],
 ["___ you from Ankara? — No, I'm not.",["Is","Do","Are","Am"],2,"\"You\" ile \"are\" kullanılır; soru için fiil başa gelir."]],
"simple-present":[
 ["My mother ___ coffee in the morning.",["don't drink","doesn't drink","not drinks","doesn't drinks"],1,"He/she/it olumsuzu: doesn't + yalın fiil (-s almaz)."],
 ["___ they play basketball after school?",["Does","Are","Do","Is"],2,"\"They\" ile soru \"Do\" ile kurulur."],
 ["The shop ___ at nine o'clock every morning.",["open","opens","opening","to open"],1,"\"The shop\" = it, fiile -s eklenir."]],
"articles":[
 ["He is ___ honest man.",["a","an","the","—"],1,"\"Honest\" kelimesinde h okunmaz, sesli harfle başlar: an."],
 ["Can you close ___ door, please? It's cold.",["a","an","the","—"],2,"Hangi kapıdan söz edildiği belli olduğu için \"the\"."],
 ["My father is ___ engineer.",["a","an","the","—"],1,"Meslek söylerken a/an kullanılır; \"engineer\" sesli harfle başlar: an."]],
"there-is":[
 ["There ___ a cat under the table.",["is","are","be","have"],0,"Tekil isim (a cat) için \"there is\"."],
 ["There aren't ___ apples left.",["some","any","a","an"],1,"Olumsuz cümlelerde \"any\" kullanılır."],
 ["How many students ___ in the classroom?",["there is","is there","are there","there are"],2,"Soruda \"are there\"; \"students\" çoğul."]],
"can":[
 ["My grandmother can't ___ without glasses.",["reads","read","to read","reading"],1,"Can/can't'ten sonra fiil yalın gelir."],
 ["___ swim? — Yes, I can.",["Do you can","Can you","Are you can","You can"],1,"Soru: Can + özne + fiil. \"Do\" ile birlikte kullanılmaz."],
 ["Sorry, you ___ park here. It's not allowed.",["can","can't","don't can","not can"],1,"İzin olmadığını \"can't\" ile söyleriz."]],
"possessives":[
 ["I met Ali's sister. ___ name is Elif.",["His","Her","Its","Their"],1,"Kız kardeşten söz ediliyor (o kadın), bu yüzden \"Her\"."],
 ["The dog is eating ___ food.",["it's","its","his","their"],1,"İyelik \"its\"tir; \"it's\" = it is."],
 ["That house is ___. They bought it last year.",["their","theirs","them","they're"],1,"İsimden sonra tek başına \"theirs\" (onlarınki) gelir."]],
"question-words":[
 ["___ do you go to school? — By bus.",["What","How","Where","Who"],1,"Nasıl (hangi yolla) sorusu: How."],
 ["___ is that woman? — She's my aunt.",["What","Who","Whose","Which"],1,"Kişiyi sorarken \"Who\"."],
 ["___ does the film start? — At 8 pm.",["Where","Who","When","Why"],2,"Zaman sorusu: When."]],
/* ---------- A2 ---------- */
"present-continuous":[
 ["Be quiet! The baby ___.",["sleeps","is sleeping","sleep","sleeping"],1,"Şu an olan iş: am/is/are + -ing."],
 ["I ___ a book at the moment.",["'m not read","don't reading","'m not reading","not reading"],2,"Olumsuz: am not + -ing."],
 ["She usually walks to work, but today she ___ the bus.",["takes","is taking","take","took"],1,"Genel alışkanlık geniş zaman, \"today\" ise şimdiki zaman ister."]],
"simple-past":[
 ["We ___ to the beach last Sunday.",["go","goes","went","gone"],2,"\"Last Sunday\" geçmiştir; go → went."],
 ["She didn't ___ the email.",["sent","send","sends","sending"],1,"Didn't'ten sonra fiil yalın gelir."],
 ["Where ___ you buy that jacket?",["do","did","were","was"],1,"Geçmişte soru: Did + özne + yalın fiil."]],
"comparatives":[
 ["My house is ___ than yours.",["big","bigger","biggest","more big"],1,"Kısa sıfat + -er + than. Big → bigger (son harf ikilenir)."],
 ["Mount Everest is ___ mountain in the world.",["higher","the highest","the higher","most high"],1,"Dünyadaki en yüksek: the + -est."],
 ["This exercise is ___ than the last one.",["more easy","easier","easyer","the easiest"],1,"Y ile biten sıfatlarda y → ier: easier."]],
"future":[
 ["We've bought the tickets. We ___ visit Rome in May.",["will","are going to","going to","would"],1,"Önceden yapılmış plan: be going to."],
 ["The phone is ringing. — I ___ answer it!",["'m going to","'ll","am","would"],1,"O an verilen karar: will ('ll)."],
 ["Look at those black clouds. It ___ rain.",["will","is going to","going","rains"],1,"Gördüğümüz bir kanıta dayanan tahmin: be going to."]],
"countable":[
 ["How ___ eggs do we need for the cake?",["much","many","any","some"],1,"Eggs sayılabilir ve çoğul: How many."],
 ["There isn't ___ bread left. Can you buy some?",["many","any","some","a"],1,"Olumsuz cümle ve sayılamayan isim: any."],
 ["I drink ___ water every day.",["many","a lot of","a","any"],1,"\"A lot of\" sayılabilen ve sayılamayan isimlerle olumlu cümlede kullanılır."]],
"prepositions":[
 ["I was born ___ 2005.",["on","at","in","to"],2,"Yıllar için \"in\"."],
 ["Let's meet ___ the bus stop.",["in","on","at","to"],2,"Belirli bir nokta (durak, kapı) için \"at\"."],
 ["We have a party ___ New Year's Eve.",["in","on","at","to"],1,"Belirli bir gün için \"on\"."]],
"adverbs-frequency":[
 ["She ___ eats meat. She's a vegetarian.",["always","never","often","usually"],1,"Vejetaryen et yemez: never."],
 ["Hangisi doğru?",["He is always tired.","He always is tired.","Always he is tired.","He is tired always."],0,"Sıklık zarfı \"be\" fiilinden sonra gelir: He is always…"],
 ["How ___ do you go to the gym? — Twice a week.",["often","much","many","long"],0,"Ne sıklıkla: How often."]],
"used-to":[
 ["I ___ play tennis, but now I don't.",["use to","used to","was used to","using to"],1,"Geçmişteki ama artık olmayan alışkanlık: used to + yalın fiil."],
 ["Did she ___ have long hair?",["used to","use to","uses to","using"],1,"Soru ve olumsuzda \"did\" varken \"use to\" yazılır."],
 ["My grandfather ___ smoke, but he stopped ten years ago.",["is used to","used to","uses to","use to"],1,"Bırakılmış alışkanlık: used to."]],
/* ---------- B1 ---------- */
"present-perfect":[
 ["I ___ my homework. Can I go out now?",["finish","'ve finished","was finishing","had finish"],1,"Az önce bitmiş ve sonucu şimdi önemli: have + V3."],
 ["She has lived here ___ five years.",["since","for","ago","during"],1,"Süre (five years) için \"for\"; başlangıç noktası için \"since\"."],
 ["I ___ him yesterday.",["have seen","saw","have see","seen"],1,"\"Yesterday\" belirli bir geçmiş zamandır; present perfect değil simple past."]],
"past-continuous":[
 ["It ___ when we left the house.",["rained","was raining","is raining","were raining"],1,"Bir an sürmekte olan iş: was/were + -ing."],
 ["They ___ football when it started to snow.",["were playing","was playing","played","are playing"],0,"They ile \"were\"; devam eden iş kısa bir olayla kesiliyor."],
 ["What were you doing when I ___ you?",["was calling","called","call","were calling"],1,"Araya giren kısa olay simple past ile anlatılır."]],
"modals":[
 ["You ___ smoke in the hospital.",["mustn't","don't have to","shouldn't to","haven't"],0,"Yasak: mustn't."],
 ["You ___ bring food. We have plenty.",["mustn't","don't have to","must","should"],1,"Gerek yok (ama yasak değil): don't have to."],
 ["I think you ___ see a doctor about that cough.",["should","mustn't","don't have to","should to"],0,"Tavsiye: should + yalın fiil."]],
"conditionals":[
 ["If it rains tomorrow, we ___ at home.",["stay","will stay","would stay","stayed"],1,"Gerçek olası durum (1. tip): If + geniş zaman, will + fiil."],
 ["If I ___ more time, I would learn the guitar.",["have","had","will have","would have"],1,"Hayalî durum (2. tip): If + V2, would + fiil."],
 ["I would buy that house if it ___ cheaper.",["is","were","will be","would be"],1,"2. tip koşulda be fiili çoğunlukla \"were\" olur."]],
"passive":[
 ["This bridge ___ in 1890.",["built","was built","is built","has build"],1,"Geçmişte edilgen: was/were + V3."],
 ["Cars ___ in this factory.",["make","are made","made","are make"],1,"Genel bir gerçek, edilgen: are + V3."],
 ["The letters ___ every morning.",["are delivered","delivered","are deliver","is delivered"],0,"Letters çoğul: are + V3."]],
"gerund-infinitive":[
 ["I enjoy ___ in the sea.",["swim","to swim","swimming","swam"],2,"Enjoy'dan sonra -ing gelir."],
 ["She decided ___ a new job.",["find","to find","finding","found"],1,"Decide'dan sonra to + fiil gelir."],
 ["He is good at ___ stories.",["tell","to tell","telling","told"],2,"Edattan (at) sonra fiil -ing alır."]],
"question-tags":[
 ["You're a student, ___?",["aren't you","are you","don't you","isn't it"],0,"Olumlu cümle → olumsuz etiket: aren't you?"],
 ["He doesn't like coffee, ___?",["does he","doesn't he","is he","did he"],0,"Olumsuz cümle → olumlu etiket: does he?"],
 ["We met last year, ___?",["didn't we","did we","don't we","weren't we"],0,"Geçmiş zaman olumlu → didn't we?"]],
"too-enough":[
 ["This bag is ___ heavy for me to carry.",["enough","too","very much","so"],1,"Fazla ve sorun yaratıyor: too + sıfat."],
 ["We don't have ___ chairs for everyone.",["too","enough","too many","so"],1,"Yeterli: enough + isim."],
 ["Is the water warm ___ for a swim?",["too","enough","very","so"],1,"Sıfat + enough: warm enough."]],
"be-used-to":[
 ["She ___ getting up early. She's a nurse.",["used to","is used to","use to","uses to"],1,"Alışkın olmak: be used to + -ing."],
 ["I'm slowly getting used to ___ on the left.",["drive","driving","drove","to drive"],1,"Get used to'dan sonra -ing gelir."],
 ["When I was a child, I ___ climb trees.",["am used to","used to","was used to","get used to"],1,"Geçmişteki alışkanlık: used to + yalın fiil."]],
/* ---------- B2 ---------- */
"past-perfect":[
 ["When I got to the station, the train ___.",["already left","had already left","has already left","was leaving already"],1,"Geçmişteki bir andan daha önce olan iş: had + V3."],
 ["She was nervous because she ___ on a plane before.",["never flew","had never flown","has never flown","never flown"],1,"O ana kadar hiç: had never + V3."],
 ["I didn't recognise him because he ___ a lot.",["changed","had changed","has changed","was change"],1,"Değişim tanımadan önce olmuştu: had + V3."]],
"third-conditional":[
 ["If you ___ me, I would have helped you.",["asked","had asked","have asked","would ask"],1,"3. tip: If + had + V3, would have + V3."],
 ["We would have won if our best player ___ injured.",["hadn't got","didn't get","wouldn't get","hasn't got"],0,"Geçmişle ilgili hayal: if + had(n't) + V3."],
 ["If I had known about the party, I ___.",["would come","would have come","had come","will come"],1,"Sonuç kısmı: would have + V3."]],
"reported-speech":[
 ["\"I live in Izmir.\" → She said she ___ in Izmir.",["lives","lived","has lived","is living"],1,"Dolaylı anlatımda zaman bir geri gider: live → lived."],
 ["\"I can swim.\" → He said he ___ swim.",["can","could","can be","would can"],1,"Can → could."],
 ["\"Don't be late.\" → My mother told me ___ late.",["don't be","not to be","to not being","not be"],1,"Olumsuz emir: told + kişi + not to + fiil."]],
"relative-clauses":[
 ["The book ___ I bought yesterday is very good.",["who","which","whose","where"],1,"Nesne/şey için which (ya da that)."],
 ["She's the teacher ___ helped me with my English.",["which","who","whose","where"],1,"Kişi için who."],
 ["That's the restaurant ___ we had our first date.",["which","who","where","whose"],2,"Yer anlatırken where."]],
"wish":[
 ["I wish I ___ speak French.",["can","could","will","would can"],1,"Şimdiki bir dilek: wish + could/V2."],
 ["I wish I ___ that cake. Now I feel sick.",["didn't eat","hadn't eaten","don't eat","wouldn't eat"],1,"Geçmişteki bir pişmanlık: wish + had + V3."],
 ["I wish it ___ raining. I want to go out.",["would stop","stops","will stop","has stopped"],0,"Bir durumun değişmesini istemek: wish + would."]],
"modals-deduction":[
 ["He's been working all day. He ___ be tired.",["can't","must","mustn't","should"],1,"Neredeyse eminiz: must."],
 ["She ___ be at home. I just saw her in the café.",["must","can't","might","should"],1,"İmkânsız olduğunu düşünüyoruz: can't."],
 ["I'm not sure, but I ___ have left it on the bus.",["must","might","can't","mustn't"],1,"Emin değiliz, olasılık: might have + V3."]],
"causative":[
 ["I don't cut my own hair. I ___ it cut at the hairdresser's.",["have","make","do","am"],0,"Bir işi başkasına yaptırmak: have + nesne + V3."],
 ["She's having her car ___ tomorrow.",["repair","repaired","repairing","to repair"],1,"Nesneden sonra V3: repaired."],
 ["We got the windows ___ last week.",["clean","cleaning","cleaned","to clean"],2,"Get + nesne + V3: cleaned."]]
};
