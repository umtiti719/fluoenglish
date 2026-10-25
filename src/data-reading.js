/* Okuma anlama metinleri (Fluo için özgün yazıldı)
   {id, lv, title, tt (Türkçe başlık), en (paragraflar \n\n ile), tr (çeviri), vocab [[en,tr]], qs [[soru, [şıklar; ilki doğru], açıklama]]} */
const READING=[
/* ---------------- KOLAY (A1–A2) ---------------- */
{id:"morning",lv:"kolay",title:"My Morning Routine",tt:"Sabah rutinim",
en:`My name is Elif. I am fifteen years old and I live in Izmir with my parents and my little brother.

On school days, I wake up at seven o'clock. First, I take a quick shower. Then I have breakfast with my family. I usually eat cheese, olives, tomatoes and bread. My brother always drinks milk, but I prefer tea.

My school is not far from our house, so I walk there with my best friend, Deniz. We talk and laugh on the way. Classes start at half past eight.

On Saturdays, I don't get up early. I sleep until ten and have a big breakfast with my grandparents.`,
tr:`Benim adım Elif. On beş yaşındayım ve İzmir'de annem, babam ve küçük erkek kardeşimle yaşıyorum.

Okul günlerinde saat yedide uyanırım. Önce hızlı bir duş alırım. Sonra ailemle kahvaltı yaparım. Genellikle peynir, zeytin, domates ve ekmek yerim. Kardeşim her zaman süt içer ama ben çayı tercih ederim.

Okulum evimize uzak değil, bu yüzden oraya en iyi arkadaşım Deniz'le yürüyerek giderim. Yolda konuşur ve güleriz. Dersler sekiz buçukta başlar.

Cumartesileri erken kalkmam. Saat ona kadar uyurum ve büyükannem ve büyükbabamla büyük bir kahvaltı yaparım.`,
vocab:[["wake up","uyanmak"],["usually","genellikle"],["prefer","tercih etmek"],["far","uzak"],["laugh","gülmek"]],
qs:[["Elif okul günlerinde saat kaçta uyanır?",["Yedide","Sekiz buçukta","Onda","Altıda"],"\"I wake up at seven o'clock\" cümlesinde yazıyor."],
["Elif kahvaltıda ne içmeyi tercih eder?",["Çay","Süt","Kahve","Meyve suyu"],"\"My brother always drinks milk, but I prefer tea.\" Süt kardeşinin içeceği."],
["Elif okula nasıl gider?",["Arkadaşıyla yürüyerek","Otobüsle","Babasının arabasıyla","Bisikletle"],"\"I walk there with my best friend, Deniz.\""],
["Cumartesileri ne olur?",["Elif geç kalkar ve büyükanne-büyükbabasıyla kahvaltı yapar","Elif yedide kalkıp okula gider","Elif Deniz'le markete gider","Elif kahvaltı yapmaz"],"\"I sleep until ten and have a big breakfast with my grandparents.\""]]},

{id:"market",lv:"kolay",title:"Saturday at the Market",tt:"Pazarda cumartesi",
en:`Every Saturday morning, Ali goes to the market with his grandmother. The market is near their house, and it is always busy and noisy.

His grandmother has a shopping list. This week they need potatoes, onions, apples and some fresh fish. Ali carries the bags because his grandmother's bags are heavy.

The fruit seller is a friendly man. He gives Ali a free orange every week. "You are a good helper," he says.

The fish is expensive today, so they buy chicken instead. On the way home, they stop at a small café. His grandmother drinks Turkish coffee and Ali has a lemonade. Ali loves Saturdays.`,
tr:`Her cumartesi sabahı Ali büyükannesiyle pazara gider. Pazar evlerinin yakınındadır ve her zaman kalabalık ve gürültülüdür.

Büyükannesinin bir alışveriş listesi vardır. Bu hafta patatese, soğana, elmaya ve biraz taze balığa ihtiyaçları var. Ali çantaları taşır çünkü büyükannesinin çantaları ağırdır.

Meyveci arkadaş canlısı bir adamdır. Her hafta Ali'ye bedava bir portakal verir. "Sen iyi bir yardımcısın" der.

Bugün balık pahalı, bu yüzden onun yerine tavuk alırlar. Eve dönerken küçük bir kafede dururlar. Büyükannesi Türk kahvesi içer, Ali de limonata içer. Ali cumartesileri çok sever.`,
vocab:[["busy","kalabalık, yoğun"],["heavy","ağır"],["friendly","arkadaş canlısı"],["free","bedava"],["instead","yerine"]],
qs:[["Pazar nasıl bir yer?",["Kalabalık ve gürültülü","Sessiz ve boş","Evlerinden çok uzak","Sadece pazar günleri açık"],"\"It is always busy and noisy.\""],
["Ali neden çantaları taşır?",["Çantalar ağır olduğu için","Büyükannesi hasta olduğu için","Meyveci istediği için","Para kazanmak için"],"\"Ali carries the bags because his grandmother's bags are heavy.\""],
["Neden balık yerine tavuk alırlar?",["Balık pahalı olduğu için","Ali balık sevmediği için","Balık bittiği için","Büyükannesi tavuk istediği için"],"\"The fish is expensive today, so they buy chicken instead.\""],
["Metne göre hangisi doğrudur?",["Meyveci her hafta Ali'ye portakal verir","Ali kafede Türk kahvesi içer","Pazara pazar günleri giderler","Alışveriş listesinde ekmek var"],"\"He gives Ali a free orange every week.\" Kahveyi büyükannesi içer."]]},

{id:"neighbor",lv:"kolay",title:"Our New Neighbor",tt:"Yeni komşumuz",
en:`Last month, a new family moved into the flat next to ours. They are from Canada. The father, Tom, is an English teacher at a university in Ankara.

Tom has two children, Lily and Jack. Lily is ten and Jack is seven. They don't speak much Turkish yet, but they are learning quickly.

Yesterday, my mother made a cake and we took it to their flat. Tom was very happy. He said, "Thank you so much! In Canada, we do the same thing for new neighbors."

Now Lily and I play together after school. I help her with Turkish, and she helps me with English. It's a good deal for both of us!`,
tr:`Geçen ay bizim dairemizin yanındaki daireye yeni bir aile taşındı. Kanadalılar. Baba Tom, Ankara'da bir üniversitede İngilizce öğretmeni.

Tom'un iki çocuğu var: Lily ve Jack. Lily on, Jack yedi yaşında. Henüz pek Türkçe konuşmuyorlar ama hızla öğreniyorlar.

Dün annem bir kek yaptı ve onu dairelerine götürdük. Tom çok mutlu oldu. "Çok teşekkürler! Kanada'da biz de yeni komşular için aynı şeyi yaparız" dedi.

Artık Lily ve ben okuldan sonra birlikte oynuyoruz. Ben ona Türkçede, o da bana İngilizcede yardım ediyor. Bu ikimiz için de iyi bir anlaşma!`,
vocab:[["move into","(bir yere) taşınmak"],["flat","daire"],["yet","henüz"],["quickly","hızla"],["deal","anlaşma"]],
qs:[["Tom'un işi nedir?",["Üniversitede İngilizce öğretmeni","Doktor","İlkokul öğretmeni","Aşçı"],"\"Tom is an English teacher at a university in Ankara.\""],
["Yeni komşu çocukların Türkçesi nasıl?",["Henüz pek konuşamıyorlar ama hızla öğreniyorlar","Çok iyi Türkçe konuşuyorlar","Hiç öğrenmek istemiyorlar","Sadece Jack konuşabiliyor"],"\"They don't speak much Turkish yet, but they are learning quickly.\""],
["Tom kek için ne dedi?",["Kanada'da da yeni komşulara aynısının yapıldığını","Kek sevmediğini","Keki kendisinin yapmak istediğini","Kanada'da bu adetin olmadığını"],"\"In Canada, we do the same thing for new neighbors.\""],
["Son paragraftaki \"a good deal for both of us\" ne anlatıyor?",["İki taraf da birbirine dil öğreterek kazanıyor","Birlikte alışveriş yapıyorlar","Lily ona para veriyor","Sadece yazar kazançlı"],"Biri Türkçe, diğeri İngilizce öğretiyor; ikisi de faydalanıyor."]]},

{id:"rainy",lv:"kolay",title:"A Rainy Sunday",tt:"Yağmurlu bir pazar",
en:`On Sunday, my family wanted to have a picnic in the park. We prepared sandwiches, fruit and lemonade. But when we opened the door, it was raining heavily.

"Oh no! What can we do now?" asked my sister. My father had an idea. "Let's have a picnic in the living room!"

We put a big blanket on the floor and sat on it. We ate our sandwiches and played board games all afternoon. My mother won every game, and we laughed a lot.

In the evening, the rain stopped and we saw a beautiful rainbow from the window. It was not the day we planned, but it was a really fun day.`,
tr:`Pazar günü ailem parkta piknik yapmak istedi. Sandviç, meyve ve limonata hazırladık. Ama kapıyı açtığımızda şiddetli yağmur yağıyordu.

"Olamaz! Şimdi ne yapabiliriz?" diye sordu kız kardeşim. Babamın aklına bir fikir geldi. "Hadi oturma odasında piknik yapalım!"

Yere büyük bir battaniye serdik ve üzerine oturduk. Sandviçlerimizi yedik ve bütün öğleden sonra kutu oyunları oynadık. Annem her oyunu kazandı ve çok güldük.

Akşam yağmur durdu ve pencereden güzel bir gökkuşağı gördük. Planladığımız gün değildi ama gerçekten eğlenceli bir gündü.`,
vocab:[["prepare","hazırlamak"],["heavily","şiddetli, yoğun"],["blanket","battaniye"],["board game","kutu oyunu"],["rainbow","gökkuşağı"]],
qs:[["Aile pazar günü ne yapmak istiyordu?",["Parkta piknik yapmak","Sinemaya gitmek","Büyükanneyi ziyaret etmek","Evi temizlemek"],"\"My family wanted to have a picnic in the park.\""],
["Pikniği nerede yaptılar?",["Oturma odasında","Parkta","Bahçede","Bir kafede"],"Baba \"Let's have a picnic in the living room!\" dedi."],
["Oyunları kim kazandı?",["Anne","Baba","Kız kardeş","Yazar"],"\"My mother won every game.\""],
["Yazar günü nasıl anlatıyor?",["Planladıkları gibi geçmedi ama eğlenceliydi","Çok sıkıcıydı","Tam planladıkları gibi geçti","Yağmur yüzünden herkes üzgündü"],"\"It was not the day we planned, but it was a really fun day.\""]]},

/* ---------------- ORTA (B1) ---------------- */
{id:"cook",lv:"orta",title:"Learning to Cook Online",tt:"İnternetten yemek yapmayı öğrenmek",
en:`When Mert started university in another city, he had a big problem: he couldn't cook. For the first few weeks, he ate fast food almost every day. He soon felt tired, and he was spending too much money.

One evening, he decided to watch a cooking video online. The recipe was simple: lentil soup. He followed the steps carefully, and to his surprise, the soup tasted just like his mother's.

After that, Mert watched a new video every few days. He learned how to make pasta, rice and even a few desserts. He also started a notebook where he wrote down his favorite recipes and the mistakes he made.

Now his flatmates often ask him to cook for them. "I'm not a chef," Mert says, "but I've learned that cooking is just like any other skill. You get better with practice."`,
tr:`Mert başka bir şehirde üniversiteye başladığında büyük bir sorunu vardı: yemek yapamıyordu. İlk birkaç hafta neredeyse her gün fast food yedi. Kısa süre sonra kendini yorgun hissetti ve çok fazla para harcıyordu.

Bir akşam internette bir yemek videosu izlemeye karar verdi. Tarif basitti: mercimek çorbası. Adımları dikkatle takip etti ve şaşırtıcı bir şekilde çorbanın tadı tıpkı annesininki gibiydi.

Ondan sonra Mert birkaç günde bir yeni bir video izledi. Makarna, pilav ve hatta birkaç tatlı yapmayı öğrendi. Ayrıca en sevdiği tarifleri ve yaptığı hataları yazdığı bir defter tutmaya başladı.

Şimdi ev arkadaşları sık sık ondan onlar için yemek yapmasını istiyor. Mert, "Ben bir şef değilim," diyor, "ama yemek yapmanın da diğer her beceri gibi olduğunu öğrendim. Pratik yaptıkça daha iyi olursun."`,
vocab:[["recipe","tarif"],["follow","takip etmek, uymak"],["to his surprise","şaşırtıcı bir şekilde"],["flatmate","ev arkadaşı"],["skill","beceri"]],
qs:[["Mert'in üniversitenin başındaki sorunu neydi?",["Yemek yapmayı bilmiyordu","Ev arkadaşı bulamıyordu","Derslerini anlamıyordu","İnternet bağlantısı yoktu"],"\"He had a big problem: he couldn't cook.\""],
["Fast food yemenin Mert'e etkisi ne oldu?",["Yorgun hissetti ve çok para harcadı","Kilo verdi","Hiçbir etkisi olmadı","Yemek yapmayı sevdi"],"\"He soon felt tired, and he was spending too much money.\""],
["Mert'in defterinde ne vardı?",["Sevdiği tarifler ve yaptığı hatalar","Ders notları","Ev arkadaşlarının telefonları","Harcamalarının listesi"],"\"He wrote down his favorite recipes and the mistakes he made.\""],
["Mert'in son sözlerinin ana fikri nedir?",["Yemek yapmak da pratikle gelişen bir beceridir","Herkes şef olabilir","Videolar her zaman doğru bilgi vermez","Fast food sağlıklıdır"],"\"Cooking is just like any other skill. You get better with practice.\""]]},

{id:"sleep",lv:"orta",title:"Why Teenagers Need More Sleep",tt:"Gençler neden daha çok uyumalı",
en:`Many parents complain that their teenage children stay up late and are hard to wake up in the morning. They often think this is just laziness, but scientists say there is a biological reason.

During the teenage years, the body releases the sleep hormone, melatonin, later in the evening than it does in children or adults. As a result, most teenagers don't feel sleepy until around eleven o'clock at night.

Experts recommend that teenagers sleep between eight and ten hours a night. However, because school starts early, many of them sleep only six or seven hours. This lack of sleep can affect their mood, their memory and their grades.

Some schools have started classes later in the morning. In these schools, students arrive less tired, and their test results have improved. Doctors also advise teenagers to put their phones away an hour before bed, because the light from screens makes it even harder to fall asleep.`,
tr:`Birçok ebeveyn, ergenlik çağındaki çocuklarının geç saatlere kadar uyumadığından ve sabahları zor uyandığından yakınır. Bunun sadece tembellik olduğunu düşünürler ama bilim insanları bunun biyolojik bir nedeni olduğunu söylüyor.

Ergenlik yıllarında vücut, uyku hormonu melatonini akşam çocuklara ya da yetişkinlere göre daha geç salgılar. Bunun sonucunda çoğu genç gece on bire kadar uykusu gelmez.

Uzmanlar gençlerin gecede sekiz ila on saat uyumasını öneriyor. Ancak okul erken başladığı için birçoğu sadece altı ya da yedi saat uyuyor. Bu uyku eksikliği ruh hallerini, hafızalarını ve notlarını etkileyebilir.

Bazı okullar derslere sabah daha geç başlamaya başladı. Bu okullarda öğrenciler daha az yorgun geliyor ve sınav sonuçları iyileşti. Doktorlar ayrıca gençlere yatmadan bir saat önce telefonlarını bırakmalarını öneriyor, çünkü ekranların ışığı uykuya dalmayı daha da zorlaştırıyor.`,
vocab:[["complain","şikâyet etmek, yakınmak"],["release","salgılamak, salıvermek"],["recommend","önermek"],["lack of","…eksikliği"],["improve","iyileşmek, gelişmek"]],
qs:[["Metne göre gençlerin geç yatmasının nedeni nedir?",["Uyku hormonunun daha geç salgılanması","Tembellik","Çok fazla ödev","Geç saatte yemek yemeleri"],"\"The body releases the sleep hormone, melatonin, later in the evening.\""],
["Uzmanlara göre gençler gecede kaç saat uyumalı?",["8–10 saat","6–7 saat","5 saat","12 saatten fazla"],"\"Experts recommend that teenagers sleep between eight and ten hours a night.\""],
["Derslere geç başlayan okullarda ne oldu?",["Öğrenciler daha az yorgundu ve sınav sonuçları iyileşti","Öğrenciler daha geç yatmaya başladı","Hiçbir şey değişmedi","Öğrenciler derslere geç kaldı"],"\"Students arrive less tired, and their test results have improved.\""],
["Doktorlar neden yatmadan önce telefonu bırakmayı öneriyor?",["Ekran ışığı uykuya dalmayı zorlaştırdığı için","Telefon şarjı bittiği için","Ebeveynler kızdığı için","Mesajlar sabaha kadar beklediği için"],"\"The light from screens makes it even harder to fall asleep.\""]]},

{id:"cappadocia",lv:"orta",title:"Above the Fairy Chimneys",tt:"Peri bacalarının üzerinde",
en:`Last summer, Sarah, a nurse from Manchester, finally made her dream come true: a hot-air balloon ride in Cappadocia.

She had to get up at four in the morning because the balloons take off before sunrise, when the air is calm. A small bus picked her up from her hotel and took her to a large field. There, dozens of colorful balloons were slowly filling with hot air.

"At first I was a bit nervous," Sarah admits, "but as soon as we rose into the sky, I forgot all my fears." From above, she could see the famous fairy chimneys, the valleys and the small villages. The sun came up and turned the rocks pink and gold.

The flight lasted about an hour. After landing, the pilot opened a bottle of fruit juice to celebrate. Sarah says it was expensive, but worth every penny. "If you ever visit Turkey," she advises, "don't miss it."`,
tr:`Geçen yaz Manchesterlı bir hemşire olan Sarah sonunda hayalini gerçekleştirdi: Kapadokya'da sıcak hava balonu turu.

Saat dörtte kalkmak zorunda kaldı çünkü balonlar, havanın sakin olduğu güneş doğmadan önce havalanıyor. Küçük bir otobüs onu otelinden aldı ve geniş bir alana götürdü. Orada onlarca rengârenk balon yavaş yavaş sıcak havayla doluyordu.

"İlk başta biraz gergindim," diye itiraf ediyor Sarah, "ama gökyüzüne yükselir yükselmez bütün korkularımı unuttum." Yukarıdan ünlü peri bacalarını, vadileri ve küçük köyleri görebiliyordu. Güneş doğdu ve kayaları pembeye ve altın rengine boyadı.

Uçuş yaklaşık bir saat sürdü. İnişten sonra pilot kutlamak için bir şişe meyve suyu açtı. Sarah pahalı olduğunu ama her kuruşuna değdiğini söylüyor. "Bir gün Türkiye'yi ziyaret ederseniz," diye öneriyor, "sakın kaçırmayın."`,
vocab:[["make a dream come true","hayalini gerçekleştirmek"],["take off","havalanmak"],["calm","sakin"],["admit","itiraf etmek"],["worth every penny","her kuruşuna değer"]],
qs:[["Balonlar neden sabah erken havalanıyor?",["Güneş doğmadan önce hava sakin olduğu için","Turistler erken kalktığı için","Öğleden sonra yasak olduğu için","Daha ucuz olduğu için"],"\"The balloons take off before sunrise, when the air is calm.\""],
["Sarah uçuşun başında nasıl hissediyordu?",["Biraz gergin","Çok sıkılmış","Hasta","Kızgın"],"\"At first I was a bit nervous.\""],
["Sarah yukarıdan neler gördü?",["Peri bacaları, vadiler ve köyler","Deniz ve plajlar","Büyük bir şehir","Karla kaplı dağlar"],"\"She could see the famous fairy chimneys, the valleys and the small villages.\""],
["Sarah tur hakkında ne düşünüyor?",["Pahalı ama kesinlikle değer","Ucuz ama sıkıcı","Çok tehlikeli","Bir saat çok kısa"],"\"It was expensive, but worth every penny.\""]]},

{id:"library",lv:"orta",title:"More Than Books",tt:"Kitaplardan fazlası",
en:`When people think of a library, they usually imagine quiet rooms full of old books. But modern libraries are changing fast.

In many cities, libraries now lend much more than books. You can borrow laptops, cameras, musical instruments and even tools for repairing things at home. Some libraries have "makerspaces" with 3D printers, where young people can design and build their own projects.

Libraries have also become important meeting places. They offer free language classes, help for job seekers and activities for children and older people. For many people who live alone, the library is one of the few places where they can spend time with others without paying anything.

Of course, books are still at the heart of every library. But librarians say their real job is not just to look after books. "Our job," one librarian explains, "is to give everyone the same chance to learn."`,
tr:`İnsanlar kütüphane deyince genellikle eski kitaplarla dolu sessiz odalar hayal eder. Ama modern kütüphaneler hızla değişiyor.

Birçok şehirde kütüphaneler artık kitaptan çok daha fazlasını ödünç veriyor. Dizüstü bilgisayar, kamera, müzik aleti, hatta evde bir şeyleri tamir etmek için alet ödünç alabilirsiniz. Bazı kütüphanelerde gençlerin kendi projelerini tasarlayıp üretebildiği, 3D yazıcılı "üretim atölyeleri" var.

Kütüphaneler aynı zamanda önemli buluşma yerleri haline geldi. Ücretsiz dil kursları, iş arayanlara yardım, çocuklar ve yaşlılar için etkinlikler sunuyorlar. Yalnız yaşayan pek çok insan için kütüphane, hiçbir ücret ödemeden başkalarıyla vakit geçirebilecekleri az sayıdaki yerden biri.

Elbette kitaplar hâlâ her kütüphanenin kalbinde. Ama kütüphaneciler asıl işlerinin sadece kitaplara bakmak olmadığını söylüyor. Bir kütüphaneci, "Bizim işimiz," diye açıklıyor, "herkese öğrenmek için eşit şans vermek."`,
vocab:[["lend","ödünç vermek"],["borrow","ödünç almak"],["repair","tamir etmek"],["job seeker","iş arayan"],["at the heart of","…in merkezinde, kalbinde"]],
qs:[["Metnin ana fikri nedir?",["Modern kütüphaneler kitap dışında da birçok hizmet sunuyor","Kütüphaneler kapanıyor","Kitap okumak azaldı","Kütüphaneler çok sessiz"],"İlk paragraf \"modern libraries are changing fast\" diyor, devamında yeni hizmetler anlatılıyor."],
["Metne göre kütüphanelerden ne ödünç alınabilir?",["Dizüstü bilgisayar ve müzik aleti","Araba","Ev eşyası ve mobilya","Sadece kitap"],"\"You can borrow laptops, cameras, musical instruments and even tools.\""],
["Yalnız yaşayan insanlar için kütüphane neden önemli?",["Para ödemeden başkalarıyla vakit geçirebildikleri için","Orada yemek yedikleri için","Orada çalıştıkları için","Evlerinden daha sıcak olduğu için"],"\"…where they can spend time with others without paying anything.\""],
["Kütüphaneciye göre asıl işleri nedir?",["Herkese öğrenmek için eşit şans vermek","Kitapları korumak","Sessizliği sağlamak","Yeni kitap satmak"],"\"Our job is to give everyone the same chance to learn.\""]]},

/* ---------------- ZOR (B2) ---------------- */
{id:"fourday",lv:"zor",title:"The Four-Day Week",tt:"Dört günlük çalışma haftası",
en:`For more than a century, the five-day working week has been the norm in most countries. Recently, however, a growing number of companies have experimented with a four-day week, in which employees work fewer hours for the same salary.

The results of several large trials have been surprisingly positive. In one study involving dozens of companies, most employers reported that productivity stayed the same or even increased. Employees, meanwhile, said they felt less stressed, slept better and had more time for their families and hobbies. Perhaps most importantly for businesses, fewer staff quit their jobs during the trial.

Critics, though, argue that the model does not suit every sector. A hospital or a restaurant cannot simply close for an extra day, and in some jobs, squeezing five days of work into four may actually increase pressure on workers.

Supporters respond that the four-day week is less about the exact number of days and more about rethinking how we work. Shorter meetings, fewer distractions and clearer priorities, they say, could benefit any workplace, whatever schedule it follows.`,
tr:`Yüzyılı aşkın bir süredir beş günlük çalışma haftası çoğu ülkede olağan düzen oldu. Ancak son zamanlarda giderek artan sayıda şirket, çalışanların aynı maaşla daha az saat çalıştığı dört günlük haftayı denedi.

Birkaç büyük denemenin sonuçları şaşırtıcı derecede olumlu oldu. Düzinelerce şirketin katıldığı bir çalışmada işverenlerin çoğu verimliliğin aynı kaldığını, hatta arttığını bildirdi. Çalışanlar ise daha az stresli hissettiklerini, daha iyi uyuduklarını ve ailelerine ve hobilerine daha çok vakit ayırabildiklerini söyledi. Şirketler açısından belki de en önemlisi, deneme süresince daha az çalışan işinden ayrıldı.

Ne var ki eleştirmenler, bu modelin her sektöre uymadığını savunuyor. Bir hastane ya da restoran fazladan bir gün kapanamaz; bazı işlerde beş günlük işi dört güne sıkıştırmak aslında çalışanlar üzerindeki baskıyı artırabilir.

Destekçiler ise dört günlük haftanın gün sayısından çok, nasıl çalıştığımızı yeniden düşünmekle ilgili olduğunu söylüyor. Daha kısa toplantılar, daha az dikkat dağıtıcı ve daha net öncelikler, diyorlar, hangi düzeni izlerse izlesin her iş yerine fayda sağlayabilir.`,
vocab:[["norm","olağan durum, norm"],["trial","deneme"],["productivity","verimlilik"],["quit","(işten) ayrılmak"],["squeeze into","…e sıkıştırmak"]],
qs:[["Denemelerde işverenlerin çoğu verimlilik hakkında ne bildirdi?",["Aynı kaldı ya da arttı","Belirgin şekilde düştü","Ölçülemedi","Sadece ilk hafta arttı"],"\"Most employers reported that productivity stayed the same or even increased.\""],
["Metne göre şirketler için belki de en önemli sonuç neydi?",["Daha az çalışanın işten ayrılması","Maaşların düşmesi","Daha uzun toplantılar","Yeni şubeler açılması"],"\"Perhaps most importantly for businesses, fewer staff quit their jobs.\""],
["Eleştirmenlerin itirazı nedir?",["Model her sektöre uymaz ve bazı işlerde baskıyı artırabilir","Çalışanlar daha tembel olur","Şirketler daha çok para kazanır","Hastaneler bu modeli zaten kullanıyor"],"\"The model does not suit every sector… may actually increase pressure on workers.\""],
["Destekçilere göre asıl mesele nedir?",["Çalışma biçimimizi yeniden düşünmek","Tam olarak dört gün çalışmak","Maaşları artırmak","Hafta sonunu üç güne çıkarmak"],"\"…less about the exact number of days and more about rethinking how we work.\""]]},

{id:"plastic",lv:"zor",title:"The Problem with Plastic",tt:"Plastik sorunu",
en:`Plastic is cheap, light and incredibly useful, which explains why the world produces hundreds of millions of tonnes of it every year. Yet the very quality that makes plastic so practical — its durability — is also what makes it a serious environmental threat.

A plastic bottle can take hundreds of years to break down. Rather than disappearing, it gradually breaks into smaller and smaller pieces known as microplastics. These tiny particles have been found almost everywhere scientists have looked: in deep ocean water, in Arctic ice, and even in the food we eat and the air we breathe.

Marine animals are among the most affected. Sea turtles mistake plastic bags for jellyfish, while seabirds feed plastic fragments to their chicks. Many of these animals die because their stomachs are full of material they cannot digest.

Recycling helps, but only a small proportion of plastic is actually recycled. For this reason, many experts believe the most effective solution is to reduce the amount we use in the first place — for example, by choosing reusable bags and bottles, and by supporting laws that limit single-use plastics.`,
tr:`Plastik ucuz, hafif ve inanılmaz derecede kullanışlıdır; bu da dünyanın neden her yıl yüz milyonlarca ton plastik ürettiğini açıklar. Yine de plastiği bu kadar pratik yapan özellik, yani dayanıklılığı, onu ciddi bir çevre tehdidi haline getiren şeyin ta kendisidir.

Bir plastik şişenin parçalanması yüzlerce yıl sürebilir. Yok olmak yerine, mikroplastik denen giderek daha küçük parçalara ayrılır. Bu minik parçacıklar, bilim insanlarının baktığı neredeyse her yerde bulundu: derin okyanus sularında, Kuzey Kutbu buzunda, hatta yediğimiz yiyeceklerde ve soluduğumuz havada.

Deniz hayvanları en çok etkilenenler arasında. Deniz kaplumbağaları plastik poşetleri denizanası sanıyor, deniz kuşları ise yavrularını plastik parçalarıyla besliyor. Bu hayvanların birçoğu, sindiremedikleri malzemeyle dolu mideleri yüzünden ölüyor.

Geri dönüşüm yardımcı oluyor ama plastiğin yalnızca küçük bir kısmı gerçekten geri dönüştürülüyor. Bu nedenle birçok uzman, en etkili çözümün kullandığımız miktarı en baştan azaltmak olduğuna inanıyor; örneğin yeniden kullanılabilir poşet ve şişeleri tercih ederek ve tek kullanımlık plastikleri sınırlayan yasaları destekleyerek.`,
vocab:[["durability","dayanıklılık"],["break down","parçalanmak, ayrışmak"],["particle","parçacık"],["mistake A for B","A'yı B sanmak"],["single-use","tek kullanımlık"]],
qs:[["Metne göre plastiği hem kullanışlı hem tehlikeli yapan özellik nedir?",["Dayanıklılığı","Ucuzluğu","Hafifliği","Rengi"],"\"The very quality that makes plastic so practical — its durability — is also what makes it a serious environmental threat.\""],
["Mikroplastikler nedir?",["Plastiğin parçalanmasıyla oluşan çok küçük parçacıklar","Yeni bir geri dönüşüm yöntemi","Deniz hayvanlarının yiyeceği","Plastik şişe türü"],"\"…breaks into smaller and smaller pieces known as microplastics.\""],
["Deniz kaplumbağaları neden plastik poşet yiyor?",["Onları denizanası sandıkları için","Aç oldukları için her şeyi yedikleri için","Poşetler tatlı olduğu için","Yavrularını beslemek için"],"\"Sea turtles mistake plastic bags for jellyfish.\""],
["Uzmanlara göre en etkili çözüm nedir?",["Plastik kullanımını en baştan azaltmak","Daha fazla geri dönüşüm tesisi açmak","Plastiği yakmak","Plastiği okyanuslardan toplamak"],"\"The most effective solution is to reduce the amount we use in the first place.\""]]},

{id:"bilingual",lv:"zor",title:"Two Languages, One Brain",tt:"İki dil, tek beyin",
en:`For a long time, many parents worried that raising a child with two languages would confuse them or slow down their development. Today, most research suggests the opposite: speaking more than one language may actually offer the brain some valuable advantages.

When bilingual people speak, both of their languages remain active in the brain, even if they are only using one. To avoid mixing them up, the brain constantly has to choose one language and suppress the other. Some scientists believe that this daily mental exercise strengthens skills such as attention, focus and switching quickly between tasks.

There may be long-term benefits too. Several studies have found that, on average, bilingual people develop the symptoms of dementia a few years later than people who speak only one language. Researchers think that years of managing two languages may help build a kind of "cognitive reserve" that protects the brain as it ages.

It is worth noting that not all studies agree, and the advantages may depend on how often and how well people use both languages. Nevertheless, the message for learners is encouraging: it is never too late to start, and every new word is a workout for your brain.`,
tr:`Uzun süre birçok ebeveyn, çocuğu iki dille büyütmenin onun kafasını karıştıracağından ya da gelişimini yavaşlatacağından endişelendi. Bugün araştırmaların çoğu bunun tersini gösteriyor: birden fazla dil konuşmak aslında beyne bazı değerli avantajlar sağlayabilir.

İki dilli insanlar konuşurken, yalnızca birini kullansalar bile iki dilleri de beyinde aktif kalır. Onları karıştırmamak için beyin sürekli bir dili seçip diğerini bastırmak zorundadır. Bazı bilim insanları bu günlük zihinsel egzersizin dikkat, odaklanma ve görevler arasında hızla geçiş yapma gibi becerileri güçlendirdiğine inanıyor.

Uzun vadeli faydalar da olabilir. Birkaç çalışma, iki dilli insanların ortalamada demans belirtilerini tek dil konuşanlardan birkaç yıl daha geç gösterdiğini buldu. Araştırmacılar, yıllarca iki dili yönetmenin beyni yaşlandıkça koruyan bir tür "bilişsel rezerv" oluşturmaya yardım edebileceğini düşünüyor.

Şunu belirtmek gerekir ki bütün çalışmalar aynı fikirde değil ve avantajlar insanların iki dili ne sıklıkla ve ne kadar iyi kullandığına bağlı olabilir. Yine de öğrenenler için mesaj cesaret verici: başlamak için asla geç değil ve her yeni kelime beyniniz için bir antrenman.`,
vocab:[["confuse","kafasını karıştırmak"],["suppress","bastırmak"],["strengthen","güçlendirmek"],["on average","ortalamada"],["encouraging","cesaret verici"]],
qs:[["Eskiden birçok ebeveyn neden endişeleniyordu?",["İki dilin çocuğun kafasını karıştıracağını düşündükleri için","Dil kursları pahalı olduğu için","Çocuklar okulda başarısız olduğu için","İkinci dil öğretmeni bulamadıkları için"],"\"…would confuse them or slow down their development.\""],
["İki dilli birinin beyni konuşurken ne yapar?",["Bir dili seçer, diğerini bastırır","Sadece bir dili saklar","İki dili sürekli karıştırır","Dinlenir"],"\"The brain constantly has to choose one language and suppress the other.\""],
["\"Cognitive reserve\" metinde neyle ilişkilendiriliyor?",["Beyni yaşlanırken korumasıyla","Daha hızlı konuşmakla","Yeni kelimeleri unutmakla","Uykuyla"],"\"…a kind of 'cognitive reserve' that protects the brain as it ages.\""],
["Yazarın son paragraftaki tutumu nasıldır?",["Temkinli ama cesaret verici","Tamamen olumsuz","Kararsız ve kaygılı","Alaycı"],"Bütün çalışmaların aynı fikirde olmadığını belirtiyor (temkinli) ama \"the message for learners is encouraging\" diyor."]]},

{id:"remote",lv:"zor",title:"Learning from Home",tt:"Evden öğrenmek",
en:`Online learning was once seen as a second-best option, mainly for people who could not attend a real classroom. In recent years, however, it has become a normal part of education for millions of students around the world.

Its advantages are clear. Students can watch lessons again as many times as they need, study at their own pace and access courses from top universities without leaving home. For people with jobs or family responsibilities, this flexibility can make the difference between studying and not studying at all.

Yet online learning also has its drawbacks. Without a fixed timetable, many students find it hard to stay motivated, and a large proportion of people who sign up for free online courses never finish them. Others miss the social side of school: the conversations in the corridor, the group projects and the simple experience of learning alongside friends.

Many educators now believe the future lies in a mix of both. In this "blended" model, students learn basic content online and use classroom time for discussion, practice and teamwork — the things that are hardest to do through a screen.`,
tr:`Çevrim içi öğrenme bir zamanlar, esas olarak gerçek bir sınıfa gidemeyenler için ikinci en iyi seçenek olarak görülüyordu. Ancak son yıllarda dünya çapında milyonlarca öğrenci için eğitimin olağan bir parçası haline geldi.

Avantajları açık. Öğrenciler dersleri ihtiyaç duydukları kadar tekrar izleyebiliyor, kendi hızlarında çalışabiliyor ve evden çıkmadan en iyi üniversitelerin derslerine erişebiliyor. İşi ya da aile sorumlulukları olan insanlar için bu esneklik, okumakla hiç okumamak arasındaki farkı yaratabilir.

Yine de çevrim içi öğrenmenin dezavantajları da var. Sabit bir program olmadan birçok öğrenci motivasyonunu korumakta zorlanıyor ve ücretsiz çevrim içi kurslara kaydolanların büyük bir kısmı onları hiç bitirmiyor. Diğerleri okulun sosyal tarafını özlüyor: koridordaki sohbetleri, grup projelerini ve arkadaşlarla birlikte öğrenmenin o basit deneyimini.

Birçok eğitimci artık geleceğin ikisinin karışımında olduğuna inanıyor. Bu "harmanlanmış" modelde öğrenciler temel içeriği çevrim içi öğreniyor, sınıf zamanını ise tartışma, pratik ve takım çalışması için kullanıyor; yani bir ekran üzerinden yapılması en zor olan şeyler için.`,
vocab:[["second-best","ikinci en iyi"],["at one's own pace","kendi hızında"],["flexibility","esneklik"],["drawback","dezavantaj"],["blended","harmanlanmış, karma"]],
qs:[["Metne göre çevrim içi öğrenme eskiden nasıl görülüyordu?",["İkinci en iyi seçenek olarak","En iyi eğitim yolu olarak","Yalnızca çocuklar için","Yasaklanması gereken bir şey olarak"],"\"Online learning was once seen as a second-best option.\""],
["Çalışan insanlar için en büyük avantaj nedir?",["Esneklik","Ücretsiz olması","Sınav olmaması","Öğretmenlerin daha iyi olması"],"\"For people with jobs or family responsibilities, this flexibility can make the difference…\""],
["Metinde dezavantaj olarak HANGİSİ geçmez?",["Derslerin çok pahalı olması","Motivasyonu korumanın zor olması","Kursların yarıda bırakılması","Okulun sosyal tarafının özlenmesi"],"Fiyattan dezavantaj olarak söz edilmiyor; diğer üçü üçüncü paragrafta var."],
["\"Blended\" modelde sınıf zamanı ne için kullanılır?",["Tartışma, pratik ve takım çalışması için","Temel içeriği öğrenmek için","Sadece sınavlar için","Video izlemek için"],"\"…use classroom time for discussion, practice and teamwork.\""]]},

/* ---------------- UZMAN (C1–C2) ---------------- */
{id:"choice",lv:"uzman",title:"The Paradox of Choice",tt:"Seçim paradoksu",
en:`It seems self-evident that having more options makes us happier. If a café offers fifty kinds of coffee rather than five, surely every customer is more likely to find exactly what they want. Yet a substantial body of research suggests that, beyond a certain point, abundant choice can leave us less satisfied rather than more.

One frequently cited experiment illustrates the point. Shoppers in a supermarket were offered free samples of jam, sometimes from a table displaying twenty-four varieties and sometimes from one displaying only six. The larger display attracted more attention, but customers who saw the smaller selection were considerably more likely to actually buy a jar.

Psychologists offer several explanations. Evaluating dozens of alternatives is mentally exhausting, so we may postpone the decision altogether. And once we do choose, the sheer number of rejected options makes it easier to imagine that one of them would have been better, leaving us with a lingering sense of regret.

None of this means that choice is undesirable; being able to choose is fundamental to our sense of autonomy. The lesson, perhaps, is that we should be more deliberate about which decisions really deserve our time — and allow ourselves to settle for "good enough" in the rest.`,
tr:`Daha fazla seçeneğe sahip olmanın bizi daha mutlu ettiği apaçık görünür. Bir kafe beş yerine elli çeşit kahve sunuyorsa, her müşterinin tam istediğini bulma olasılığı kesinlikle daha yüksektir. Yine de kayda değer miktarda araştırma, belirli bir noktadan sonra bol seçeneğin bizi daha fazla değil, daha az tatmin edebileceğini gösteriyor.

Sıkça alıntılanan bir deney bunu iyi örnekliyor. Bir süpermarkette alışveriş yapanlara bedava reçel tadımı sunuldu; bazen yirmi dört çeşidin sergilendiği bir masadan, bazen yalnızca altı çeşidin olduğu bir masadan. Büyük sergi daha çok ilgi çekti ama küçük seçkiyi gören müşterilerin gerçekten bir kavanoz satın alma olasılığı belirgin biçimde daha yüksekti.

Psikologlar birkaç açıklama sunuyor. Düzinelerce alternatifi değerlendirmek zihinsel olarak yorucudur, bu yüzden kararı tümüyle erteleyebiliriz. Seçtiğimizde ise, reddedilen seçeneklerin çokluğu bunlardan birinin daha iyi olabileceğini hayal etmeyi kolaylaştırır ve geriye uzun süren bir pişmanlık duygusu bırakır.

Bunların hiçbiri seçimin istenmeyen bir şey olduğu anlamına gelmez; seçebilmek özerklik duygumuzun temelidir. Belki de çıkarılacak ders, hangi kararların gerçekten zamanımızı hak ettiği konusunda daha bilinçli olmamız ve geri kalanında "yeterince iyi" olanla yetinmemize izin vermemizdir.`,
vocab:[["self-evident","apaçık"],["abundant","bol"],["postpone","ertelemek"],["lingering","uzun süren, geçmeyen"],["settle for","…ile yetinmek"]],
qs:[["Reçel deneyinin sonucu nedir?",["Az çeşit gören müşteriler daha çok satın aldı","Çok çeşit gören müşteriler daha çok satın aldı","Kimse reçel almadı","İki masa aynı sonucu verdi"],"\"Customers who saw the smaller selection were considerably more likely to actually buy a jar.\""],
["Metne göre çok seçenek neden kararı ertelememize yol açabilir?",["Seçenekleri değerlendirmek zihinsel olarak yorucu olduğu için","Fiyatlar yüksek olduğu için","Ürünler kötü olduğu için","Zamanımız olmadığı için"],"\"Evaluating dozens of alternatives is mentally exhausting, so we may postpone the decision.\""],
["\"A lingering sense of regret\" neden ortaya çıkıyor?",["Reddedilen seçeneklerden birinin daha iyi olabileceğini düşündüğümüz için","Yanlış ürünü aldığımızı kesin bildiğimiz için","Satıcı bizi kandırdığı için","Paramız bittiği için"],"\"…makes it easier to imagine that one of them would have been better.\""],
["Yazarın vardığı sonuç nedir?",["Önemli kararlara özen gösterip diğerlerinde \"yeterince iyi\" ile yetinmek","Seçeneklerin tamamen kaldırılması","Her kararda en iyisini aramak","Kararları başkalarına bırakmak"],"\"…be more deliberate about which decisions really deserve our time — and allow ourselves to settle for 'good enough' in the rest.\""]]},

{id:"heat",lv:"uzman",title:"Cities That Trap the Heat",tt:"Isıyı hapseden şehirler",
en:`On a hot summer afternoon, the centre of a large city can be several degrees warmer than the countryside just a few kilometres away. This phenomenon, known as the urban heat island effect, is becoming an increasingly pressing concern as heatwaves grow more frequent and intense.

The causes are largely a consequence of how cities are built. Dark surfaces such as asphalt and roofing absorb sunlight during the day and release it slowly at night, preventing the city from cooling down. Dense buildings obstruct the wind, while air conditioners, vehicles and factories pump additional heat into the streets. Crucially, cities often lack the vegetation that, in rural areas, cools the air through shade and evaporation.

The consequences are not merely a matter of discomfort. Extreme urban heat has been linked to higher rates of illness and death, particularly among elderly people and those living in poorly insulated housing, and it drives up energy demand as residents turn to air conditioning.

Fortunately, the remedies are well understood. Planting trees, creating parks, installing "green roofs" and painting surfaces in lighter colours can all significantly reduce local temperatures. The challenge lies less in knowing what to do than in persuading cities to invest before the next heatwave arrives.`,
tr:`Sıcak bir yaz öğleden sonrasında büyük bir şehrin merkezi, sadece birkaç kilometre ötedeki kırsaldan birkaç derece daha sıcak olabilir. Kentsel ısı adası etkisi olarak bilinen bu olgu, sıcak hava dalgaları daha sık ve şiddetli hale geldikçe giderek daha acil bir kaygıya dönüşüyor.

Nedenleri büyük ölçüde şehirlerin nasıl inşa edildiğinin bir sonucu. Asfalt ve çatı kaplamaları gibi koyu yüzeyler gündüz güneş ışığını emer ve geceleri yavaş yavaş salarak şehrin serinlemesini engeller. Sık binalar rüzgârın önünü keserken klimalar, araçlar ve fabrikalar sokaklara ek ısı pompalar. En önemlisi, şehirlerde kırsal alanlarda gölge ve buharlaşma yoluyla havayı serinleten bitki örtüsü çoğu zaman eksiktir.

Sonuçları yalnızca bir rahatsızlık meselesi değil. Aşırı kentsel sıcaklık, özellikle yaşlılar ve yalıtımı zayıf evlerde yaşayanlar arasında daha yüksek hastalık ve ölüm oranlarıyla ilişkilendiriliyor; ayrıca sakinler klimaya yöneldikçe enerji talebini artırıyor.

Neyse ki çareler iyi biliniyor. Ağaç dikmek, park oluşturmak, "yeşil çatılar" kurmak ve yüzeyleri daha açık renklere boyamak yerel sıcaklıkları önemli ölçüde düşürebilir. Zorluk ne yapılacağını bilmekte değil, şehirleri bir sonraki sıcak hava dalgası gelmeden yatırım yapmaya ikna etmekte yatıyor.`,
vocab:[["phenomenon","olgu"],["pressing","acil, ivedi"],["obstruct","engellemek, önünü kesmek"],["vegetation","bitki örtüsü"],["remedy","çare"]],
qs:[["Kentsel ısı adası etkisi nedir?",["Şehir merkezinin çevresindeki kırsaldan daha sıcak olması","Şehirlerde kışın kar yağmaması","Adalarda sıcaklığın yüksek olması","Klimaların bozulması"],"\"The centre of a large city can be several degrees warmer than the countryside… This phenomenon, known as the urban heat island effect…\""],
["Koyu yüzeyler sıcaklığı nasıl etkiler?",["Gündüz ısıyı emip gece yavaşça salarak serinlemeyi engeller","Güneş ışığını yansıtarak şehri serinletir","Rüzgârı artırır","Buharlaşmayı hızlandırır"],"\"Dark surfaces… absorb sunlight during the day and release it slowly at night.\""],
["Metne göre aşırı sıcaktan en çok kimler etkilenir?",["Yaşlılar ve yalıtımı zayıf evlerde yaşayanlar","Kırsalda yaşayanlar","Gençler ve sporcular","Fabrika sahipleri"],"\"…particularly among elderly people and those living in poorly insulated housing.\""],
["Yazara göre asıl zorluk nedir?",["Şehirleri zamanında yatırım yapmaya ikna etmek","Çareleri bulmak","Sıcaklığı ölçmek","Ağaç bulmak"],"\"The challenge lies less in knowing what to do than in persuading cities to invest.\""]]},

{id:"creative",lv:"uzman",title:"Can a Machine Be Creative?",tt:"Bir makine yaratıcı olabilir mi?",
en:`Not long ago, creativity was widely regarded as the one domain in which humans would remain unchallenged by machines. Computers might beat us at chess or calculate faster than any mathematician, the argument went, but they could never write a poem, compose a melody or paint a picture worth looking at.

That assumption has been seriously shaken. Today's artificial intelligence systems can generate essays, images and music in seconds, and their output is sometimes difficult to distinguish from human work. Some artists have embraced these tools as a new kind of brush; others regard them as a threat to their livelihoods and to the very idea of art.

The debate often hinges on what we mean by creativity. If it simply means producing something new and valuable, then machines arguably already qualify. But many philosophers insist that genuine creativity involves intention, experience and the desire to communicate something — qualities that current systems, which work by identifying patterns in vast amounts of existing data, do not appear to possess.

Perhaps the more productive question is not whether machines can be creative, but how they will change human creativity. Just as photography did not end painting but pushed it in new directions, AI may ultimately prompt us to reconsider what is uniquely valuable about the things we make.`,
tr:`Kısa bir süre öncesine kadar yaratıcılık, insanların makineler karşısında rakipsiz kalacağı tek alan olarak yaygın biçimde kabul ediliyordu. Bilgisayarlar bizi satrançta yenebilir ya da her matematikçiden hızlı hesap yapabilirdi, diye düşünülüyordu, ama asla bir şiir yazamaz, bir melodi besteleyemez ya da bakmaya değer bir resim yapamazlardı.

Bu varsayım ciddi biçimde sarsıldı. Bugünün yapay zekâ sistemleri saniyeler içinde makale, görüntü ve müzik üretebiliyor ve ürettikleri bazen insan işinden ayırt etmesi güç oluyor. Bazı sanatçılar bu araçları yeni bir tür fırça olarak benimsedi; diğerleri ise onları geçim kaynaklarına ve sanat fikrinin kendisine yönelik bir tehdit olarak görüyor.

Tartışma çoğu zaman yaratıcılıktan ne kastettiğimize dayanıyor. Eğer yaratıcılık yalnızca yeni ve değerli bir şey üretmek demekse, makineler tartışmasız şekilde bu ölçütü zaten karşılıyor. Ama birçok filozof gerçek yaratıcılığın niyet, deneyim ve bir şey anlatma arzusu içerdiğinde ısrar ediyor; bunlar, var olan devasa veri yığınlarındaki örüntüleri saptayarak çalışan mevcut sistemlerde bulunmuyor gibi görünen niteliklerdir.

Belki de daha verimli soru, makinelerin yaratıcı olup olamayacağı değil, insan yaratıcılığını nasıl değiştirecekleridir. Fotoğrafçılık resmi sona erdirmeyip onu yeni yönlere ittiği gibi, yapay zekâ da sonunda bizi ürettiğimiz şeylerin neyinin benzersiz biçimde değerli olduğunu yeniden düşünmeye sevk edebilir.`,
vocab:[["domain","alan"],["assumption","varsayım"],["livelihood","geçim kaynağı"],["hinge on","…e bağlı olmak, …e dayanmak"],["prompt","sevk etmek, yol açmak"]],
qs:[["Eskiden yaratıcılık hakkında yaygın görüş neydi?",["Makinelerin insanla yarışamayacağı tek alan olduğu","Makinelerin insandan daha yaratıcı olduğu","Yaratıcılığın ölçülebileceği","Sadece sanatçıların yaratıcı olduğu"],"\"Creativity was widely regarded as the one domain in which humans would remain unchallenged by machines.\""],
["Sanatçıların yapay zekâya tepkisi nasıl anlatılıyor?",["Bazıları benimsiyor, bazıları tehdit olarak görüyor","Hepsi karşı çıkıyor","Hepsi kullanıyor","Kimse ilgilenmiyor"],"\"Some artists have embraced these tools… others regard them as a threat.\""],
["Filozoflara göre mevcut sistemlerde eksik olan nedir?",["Niyet, deneyim ve bir şey anlatma arzusu","Hız","Veri","Yeni şeyler üretme yeteneği"],"\"…genuine creativity involves intention, experience and the desire to communicate something.\""],
["Fotoğrafçılık örneği ne için veriliyor?",["Yeni bir teknolojinin bir sanatı bitirmek yerine dönüştürebileceğini göstermek için","Fotoğrafçılığın resmi sona erdirdiğini göstermek için","Yapay zekânın fotoğraf çekebildiğini anlatmak için","Ressamların fotoğrafçılığa karşı olduğunu anlatmak için"],"\"Just as photography did not end painting but pushed it in new directions…\""]]},

{id:"boredom",lv:"uzman",title:"In Praise of Boredom",tt:"Can sıkıntısına övgü",
en:`Few of us willingly spend time doing nothing. The moment we find ourselves waiting for a bus or standing in a queue, most of us instinctively reach for our phones. Boredom, it seems, has become something to be eliminated at all costs.

Yet a growing number of psychologists argue that this may come at a price. Boredom, they suggest, is not simply an unpleasant emotion but a useful signal: it tells us that our current situation is not meeting our needs and nudges us to seek something more meaningful. When we immediately silence that signal with endless scrolling, we may lose the motivation to change direction.

There is also evidence that boredom can fuel creativity. In one study, participants who first completed a deliberately dull task — copying numbers from a phone book — subsequently came up with more inventive ideas than those who had not. Researchers believe that when the mind is under-stimulated, it begins to wander, making unexpected connections between ideas.

This is not an argument for seeking out tedium, nor for abandoning technology. It is, rather, an invitation to tolerate the occasional empty moment. The next time you feel bored, consider leaving your phone in your pocket for a few minutes. You may be surprised where your thoughts take you.`,
tr:`Pek azımız isteyerek hiçbir şey yapmadan vakit geçirir. Kendimizi bir otobüs beklerken ya da bir kuyrukta dururken bulduğumuz an çoğumuz içgüdüsel olarak telefonumuza uzanırız. Görünen o ki can sıkıntısı ne pahasına olursa olsun ortadan kaldırılması gereken bir şey haline geldi.

Yine de giderek artan sayıda psikolog bunun bir bedeli olabileceğini savunuyor. Onlara göre can sıkıntısı yalnızca hoş olmayan bir duygu değil, yararlı bir sinyaldir: içinde bulunduğumuz durumun ihtiyaçlarımızı karşılamadığını söyler ve bizi daha anlamlı bir şey aramaya iter. Bu sinyali sonu gelmeyen ekran kaydırmalarıyla hemen susturduğumuzda, yön değiştirme motivasyonumuzu kaybedebiliriz.

Can sıkıntısının yaratıcılığı besleyebildiğine dair kanıtlar da var. Bir çalışmada, önce bilerek sıkıcı tutulan bir görevi (telefon rehberinden numara kopyalamak) tamamlayan katılımcılar, ardından bunu yapmayanlardan daha yaratıcı fikirler ortaya koydu. Araştırmacılar zihin yeterince uyarılmadığında dolaşmaya başladığını ve fikirler arasında beklenmedik bağlantılar kurduğunu düşünüyor.

Bu, can sıkıntısının peşine düşmemiz ya da teknolojiden vazgeçmemiz gerektiğine dair bir savunu değil. Daha çok, ara sıra yaşanan boş anlara katlanmaya bir davet. Bir dahaki sefere canınız sıkıldığında, telefonunuzu birkaç dakika cebinizde bırakmayı düşünün. Düşüncelerinizin sizi nereye götürdüğüne şaşırabilirsiniz.`,
vocab:[["eliminate","ortadan kaldırmak"],["at all costs","ne pahasına olursa olsun"],["nudge","hafifçe itmek, yönlendirmek"],["dull","sıkıcı"],["tolerate","katlanmak, tahammül etmek"]],
qs:[["Psikologlara göre can sıkıntısı neyin sinyalidir?",["Durumumuzun ihtiyaçlarımızı karşılamadığının","Yorgunluğun","Hastalığın","Mutluluğun"],"\"It tells us that our current situation is not meeting our needs.\""],
["Çalışmada sıkıcı görevi yapan katılımcılara ne oldu?",["Sonrasında daha yaratıcı fikirler ürettiler","Görevi yarıda bıraktılar","Daha yorgun ve mutsuz oldular","Telefonlarını kullandılar"],"\"…subsequently came up with more inventive ideas than those who had not.\""],
["Yazar okuyucudan ne yapmasını istiyor?",["Ara sıra boş anlara katlanmasını","Teknolojiden tamamen vazgeçmesini","Bilerek sıkıcı işler aramasını","Telefonunu daha çok kullanmasını"],"\"It is, rather, an invitation to tolerate the occasional empty moment.\" Diğerlerini açıkça reddediyor."],
["Metindeki \"endless scrolling\" ifadesi neyi anlatıyor?",["Telefonda sonu gelmeyen kaydırmayı","Uzun bir yürüyüşü","Kitap okumayı","Sıra beklemeyi"],"Telefona uzanma bağlamında, ekranı durmadan aşağı kaydırmak anlamında."]]}
];
