/* Türkçe konuşanların İngilizcede sık yaptığı hatalar: [kategori, yanlış, doğru, açıklama] */
var MISTAKES=[
/* Fiiller ve "be" */
["Fiiller","I am agree with you.","I agree with you.","\"Agree\" bir fiildir, önüne \"am\" gelmez. Türkçedeki \"katılıyorum\" yapısı İngilizcede tek fiille söylenir."],
["Fiiller","She is work in a bank.","She works in a bank.","Geniş zamanda \"be\" kullanılmaz; he/she/it için fiile -s eklenir."],
["Fiiller","I am have two brothers.","I have two brothers.","Bir cümlede iki ana fiil yan yana gelmez. \"Have\" tek başına yeterli."],
["Fiiller","He said me the truth.","He told me the truth.","\"Say\" kişiyle doğrudan kullanılmaz (say to someone). Kişiye söylerken \"tell + kişi\"."],
["Fiiller","Can you explain me this word?","Can you explain this word to me?","\"Explain\" kişiyi doğrudan almaz: explain something to someone."],
["Fiiller","I want that you come.","I want you to come.","\"Want\"tan sonra \"that\" cümlesi gelmez: want + kişi + to + fiil."],
["Fiiller","It depends of the weather.","It depends on the weather.","\"Depend\" her zaman \"on\" ile kullanılır."],
["Fiiller","Let's discuss about the plan.","Let's discuss the plan.","\"Discuss\" zaten \"hakkında konuşmak\" demektir; \"about\" almaz."],
/* Zamanlar */
["Zamanlar","I am living in Ankara since 2019.","I have been living in Ankara since 2019.","Geçmişte başlayıp hâlâ süren durumlar için present perfect (continuous) kullanılır, şimdiki zaman değil."],
["Zamanlar","How long are you here?","How long have you been here?","\"Ne zamandır buradasın?\" sorusu present perfect ister."],
["Zamanlar","I have seen him yesterday.","I saw him yesterday.","\"Yesterday, last week, ago\" gibi belirli geçmiş zamanlarla present perfect kullanılmaz."],
["Zamanlar","If it will rain, we will stay home.","If it rains, we will stay home.","\"If\"li kısımda gelecek zaman için \"will\" değil geniş zaman kullanılır."],
["Zamanlar","When I will finish, I'll call you.","When I finish, I'll call you.","\"When, after, before, as soon as\" ile gelecekten söz ederken \"will\" kullanılmaz."],
["Zamanlar","Did you went to school?","Did you go to school?","\"Did\"den sonra fiil yalın gelir; geçmiş zamanı \"did\" zaten gösterir."],
/* Edatlar */
["Edatlar","I'm good in English.","I'm good at English.","Bir konuda iyi olmak: good at."],
["Edatlar","We arrived to Istanbul at night.","We arrived in Istanbul at night.","Şehir ve ülkeye varmak: arrive in. Bina, istasyon gibi bir noktaya: arrive at. \"Arrive to\" kullanılmaz."],
["Edatlar","I'm married with Ayşe.","I'm married to Ayşe.","Biriyle evli olmak: married to."],
["Edatlar","She is afraid from dogs.","She is afraid of dogs.","Bir şeyden korkmak: afraid of. Türkçedeki \"-den\" eki \"from\" demek değildir."],
["Edatlar","I'll see you in Monday.","I'll see you on Monday.","Günlerle \"on\" kullanılır: on Monday, on my birthday."],
["Edatlar","I'm waiting you.","I'm waiting for you.","Birini beklemek: wait for someone."],
["Edatlar","Listen me, please.","Listen to me, please.","Birini dinlemek: listen to someone."],
/* Kelime seçimi */
["Kelime seçimi","This film is very boring. I'm boring.","This film is very boring. I'm bored.","-ing hissi yaratan şeyi anlatır (sıkıcı), -ed hisseden kişiyi (sıkılmış)."],
["Kelime seçimi","I'm very exciting about the trip.","I'm very excited about the trip.","Heyecanlanan kişi \"excited\" olur; \"exciting\" heyecan verici olan şeydir."],
["Kelime seçimi","Can you make me a favour?","Can you do me a favour?","Kalıp: do someone a favour. \"Yapmak\"ın her zaman \"make\" olmadığını unutma."],
["Kelime seçimi","I made my homework.","I did my homework.","Ödev, iş, alışveriş gibi görevlerde \"do\" kullanılır: do homework, do the shopping."],
["Kelime seçimi","I forgot my umbrella at home.","I left my umbrella at home.","Bir şeyi bir yerde unuttuğunu söylerken \"leave\" kullanılır. \"Forget\" yerle birlikte kullanılmaz: I forgot my umbrella ✓, I left it at home ✓."],
["Kelime seçimi","Please close the light.","Please turn off the light.","Işık, televizyon gibi cihazlar için \"close/open\" değil \"turn off / turn on\" kullanılır."],
["Kelime seçimi","The informations are on the website.","The information is on the website.","\"Information\" sayılamaz; çoğul eki almaz ve tekil fiille kullanılır. Aynısı advice, furniture, news için de geçerli."],
["Kelime seçimi","Can you give me an advice?","Can you give me some advice?","\"Advice\" sayılamaz; \"an advice\" denmez. \"A piece of advice\" ya da \"some advice\"."],
["Kelime seçimi","I'm living near to the sea.","I live near the sea.","\"Near\" doğrudan isim alır; \"near to\" gereksizdir. Kalıcı durumda da geniş zaman daha doğaldır."],
["Kelime seçimi","Actually, I'm reading a good book these days.","Currently, I'm reading a good book.","\"Actually\" \"aslında\" demektir, \"şu anda\" değil. Şu anda: currently / at the moment."],
["Kelime seçimi","He is a very sympathetic person, everyone likes him.","He is a very nice person, everyone likes him.","\"Sympathetic\" \"anlayışlı, halden anlayan\" demektir; Türkçedeki \"sempatik\" için nice, friendly, likeable."],
/* Cümle yapısı */
["Cümle yapısı","Where you live?","Where do you live?","Soru cümlesinde yardımcı fiil (do/does/did) gerekir."],
["Cümle yapısı","I don't know where is the station.","I don't know where the station is.","Dolaylı sorularda özne fiilden önce gelir: where the station is."],
["Cümle yapısı","There is a lot of people here.","There are a lot of people here.","\"People\" çoğuldur, bu yüzden \"there are\"."],
["Cümle yapısı","She has 25 years old.","She is 25 years old.","Yaş \"be\" ile söylenir, \"have\" ile değil."],
["Cümle yapısı","I very like coffee.","I like coffee very much.","\"Very\" fiili nitelemez. \"Çok seviyorum\": I really like… ya da I like… very much."],
["Cümle yapısı","Is very cold today.","It is very cold today.","İngilizcede özne düşmez. Hava, saat ve mesafe cümlelerinde \"it\" kullanılır."],
["Cümle yapısı","I didn't see nobody.","I didn't see anybody.","İngilizcede çift olumsuz kullanılmaz: didn't + anybody ya da saw + nobody."],
["Cümle yapısı","Me and my sister went to the cinema.","My sister and I went to the cinema.","Özellikle yazılı ve resmî dilde özne konumunda \"I\" kullanılır ve kibarlık gereği kendini sona koyarsın."]
];
