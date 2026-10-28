/* ================= YASAL METİNLER =================
   #yasal (KVKK Aydınlatma Metni) · #yasal-gizlilik · #yasal-kosullar · #yasal-cerez
   Fluo bir şirket değil, gelir amacı gütmeyen bireysel bir projedir; metinler buna göre yazıldı.
   name ve email boş bırakılabilir: boşsa metinlerde "Fluo'nun geliştiricisi" ve Destek formu kullanılır.
   Not: Bu metinler genel bir taslaktır, hukuki danışmanlık değildir; yayından önce bir hukukçuya kontrol ettirilmelidir. */
var LEGAL_INFO={
  name:"",   /* isteğe bağlı: geliştiricinin adı soyadı */
  email:"",  /* isteğe bağlı: KVKK başvuruları için okunan bir e-posta */
  updated:"28 Ekim 2026"
};
var LEGAL_TABS=[["kvkk","Aydınlatma Metni"],["gizlilik","Gizlilik"],["kosullar","Kullanım Koşulları"],["cerez","Çerezler"]];
function lgDocs(){
  const I=LEGAL_INFO,F='<a href="#destek">Yardım ve destek</a> sayfasındaki form',
    E=I.email?'<b>'+esc(I.email)+'</b> adresi ya da '+F:F,
    O=I.name?'<b>'+esc(I.name)+'</b> (Fluo\'nun geliştiricisi)':'<b>Fluo\'nun geliştiricisi</b>';
  const providers='<ul>'+
    '<li><b>Supabase</b> (Supabase Inc.): üyelik, giriş ve ilerleme kaydı için veritabanı ve kimlik doğrulama hizmeti. Sunucular İrlanda\'da (Avrupa Birliği) bulunur.</li>'+
    '<li><b>GitHub Pages</b> (GitHub Inc., ABD): sitenin barındırılması. Siteye her girişte IP adresi ve tarayıcı bilgisi gibi teknik bağlantı kayıtları GitHub sunucularında oluşur.</li>'+
    '<li><b>Google</b> (Google LLC / Google Ireland Ltd.): yalnızca "Google ile devam et" seçeneğini kullanırsan kimlik doğrulama; ayrıca Chrome gibi bazı tarayıcılarda Telaffuz bölümündeki konuşma tanıma, tarayıcının kendi hizmetiyle yapılır.</li>'+
    '<li><b>MyMemory</b> (Translated S.r.l., İtalya): Çeviri bölümüne yazdığın <b>cümleler</b>, makine çevirisi için bu hizmete gönderilir. Bu metinler hesabınla ilişkilendirilmez; kişisel bilgi içeren metinleri çeviriye yazmamanı öneririz.</li></ul>';
  return{
  kvkk:{t:"KVKK Aydınlatma Metni",h:
    '<p>Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") madde 10 uyarınca, Fluo İngilizce öğrenme sitesi ve uygulamasını ("Fluo") kullananlara ("sen") kişisel verilerinin nasıl işlendiğini anlatmak için hazırlanmıştır.</p>'+
    '<h3>1. Fluo hakkında ve veri sorumlusu</h3><p>Fluo bir şirket ya da kurum tarafından değil, <b>bir gerçek kişi tarafından</b>, insanların İngilizce öğrenmesine yardımcı olmak amacıyla <b>gönüllü olarak</b> geliştirilen bireysel bir projedir. Fluo\'nun bir şirketi, ticari unvanı veya gelir amacı yoktur; reklam gösterilmez ve ücret alınmaz.</p>'+
    '<p>KVKK, kişisel verileri işleyen gerçek kişileri de "veri sorumlusu" olarak tanımlar. Bu nedenle Fluo\'daki kişisel verilerin veri sorumlusu '+O+'\'dir. Kişisel verilerinle ilgili her konuda '+E+' üzerinden ulaşabilirsin.</p>'+
    '<h3>2. Hangi kişisel verileri işliyoruz?</h3><ul>'+
      '<li><b>Kimlik ve iletişim:</b> e-posta adresin, isteğe bağlı olarak yazdığın adın. "Google ile devam et" seçeneğini kullanırsan Google hesabındaki ad, e-posta adresi ve profil fotoğrafı bağlantısı.</li>'+
      '<li><b>Öğrenme ve kullanım verileri:</b> öğrendiğin kelimeler, Defterim\'e ve Cümlelerim\'e kaydettiklerin, tekrar takvimin, dil bilgisi, test, sınav ve yarışma sonuçların, seviye testi sonucun, günlük serin, haftalık hedefin, rozetlerin, pomodoro geçmişin ve ayarların.</li>'+
      '<li><b>İşlem güvenliği:</b> oturum anahtarları, giriş zamanları ve hizmet sağlayıcılarımızın sunucu kayıtlarında oluşan IP adresi ve tarayıcı bilgileri.</li>'+
      '<li><b>Destek ve geri bildirim:</b> "Bize yaz" ya da "Bildir" ile gönderdiğin mesaj, isteğe bağlı olarak yazdığın e-posta ve onay verirsen teknik bilgiler (tarayıcı, ekran boyutu, bulunduğun sayfa).</li>'+
      '<li><b>Çeviri metinleri:</b> Çeviri bölümüne yazdığın cümleler (yalnızca çeviri için hizmet sağlayıcıya iletilir, tarafımızca saklanmaz).</li></ul>'+
    '<p>Fluo <b>ses kaydı almaz ve saklamaz</b>. Telaffuz bölümünde mikrofon yalnızca sen başlattığında açılır; söylediğin, tarayıcının kendi konuşma tanıma hizmeti tarafından yazıya çevrilir. Özel nitelikli kişisel veri (sağlık, din, biyometrik vb.) işlemeyiz.</p>'+
    '<p><b>Giriş yapmadan</b> kullandığında ilerlemen yalnızca kendi cihazındaki tarayıcıda saklanır ve bize ulaşmaz.</p>'+
    '<h3>3. İşleme amaçları</h3><ul><li>Hesabını oluşturmak, giriş yapmanı sağlamak ve hesabını yönetmek,</li><li>öğrenme ilerlemeni kaydetmek ve cihazların arasında eşitlemek,</li><li>sitenin ve içeriğin çalışmasını, güvenliğini ve gelişmesini sağlamak, hataları gidermek,</li><li>destek taleplerini ve geri bildirimleri yanıtlamak,</li><li>kötüye kullanımı önlemek ve hukuki yükümlülüklerimizi yerine getirmek.</li></ul>'+
    '<h3>4. Hukuki sebepler</h3><p>Kişisel verilerin KVKK madde 5/2 kapsamında; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (hesap ve hizmetin sunulması), veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi ve temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (güvenlik, hizmetin geliştirilmesi) hukuki sebeplerine dayanarak işlenir.</p>'+
    '<h3>5. Toplama yöntemi</h3><p>Veriler; site üzerindeki formlar (kayıt, giriş, destek), Google ile giriş ve siteyi kullanırken otomatik yollarla elektronik ortamda toplanır.</p>'+
    '<h3>6. Aktarım</h3><p>Kişisel verilerin, yalnızca hizmetin sunulması için gereken ölçüde aşağıdaki hizmet sağlayıcılarla paylaşılır. Bu sağlayıcıların bir kısmı yurt dışında bulunduğundan veriler yurt dışına aktarılabilir:</p>'+providers+
    '<p>Yurt dışına aktarım, KVKK madde 9 hükümlerine uygun olarak ve yalnızca hizmetin çalışması için gereken ölçüde yapılır. Kişisel verilerin satılmaz, reklam amacıyla paylaşılmaz. Yasal bir zorunluluk olduğunda yetkili kamu kurumlarına aktarılabilir.</p>'+
    '<h3>7. Saklama süresi</h3><p>Hesap verilerin hesabın açık olduğu sürece saklanır. Hesabını silmeni istediğinde verilerin en geç 30 gün içinde silinir ya da anonim hâle getirilir. Destek mesajları en fazla 2 yıl saklanır. Hizmet sağlayıcıların güvenlik kayıtları ve yedekleri kendi politikalarında belirtilen sürelerle tutulur.</p>'+
    '<h3>8. KVKK madde 11 kapsamındaki hakların</h3><ul><li>Kişisel verilerinin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme,</li><li>işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li><li>yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li><li>eksik veya yanlış işlenmişse düzeltilmesini isteme,</li><li>KVKK madde 7 çerçevesinde silinmesini veya yok edilmesini isteme,</li><li>düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li><li>münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuç çıkmasına itiraz etme,</li><li>kanuna aykırı işleme nedeniyle zarara uğraman hâlinde zararın giderilmesini talep etme.</li></ul>'+
    '<h3>9. Başvuru</h3><p>Haklarını kullanmak için '+E+' üzerinden, hesabına kayıtlı e-posta adresini belirterek başvurabilirsin. Kimliğini doğrulamak için hesabına kayıtlı e-posta adresinden ek teyit istenebilir. Başvurun en geç 30 gün içinde ücretsiz olarak yanıtlanır. Başvurunun reddedilmesi, yanıtın yetersiz bulunması veya süresinde yanıt verilmemesi hâlinde Kişisel Verileri Koruma Kurulu\'na şikâyette bulunma hakkın saklıdır.</p>'},
  gizlilik:{t:"Gizlilik Politikası",h:
    '<p>Fluo, gelir amacı gütmeyen bireysel bir projedir ve yalnızca öğrenmene yardım etmek için yapıldı; verilerin bundan başka bir amaçla kullanılmaz. Bu sayfa, neyi neden topladığımızı kısaca anlatır. Ayrıntılar için <a href="#yasal">KVKK Aydınlatma Metni</a>\'ne bakabilirsin.</p>'+
    '<h3>Kısaca</h3><ul><li><b>Reklam yok</b>, verilerini satmıyoruz ve reklam amacıyla paylaşmıyoruz.</li><li><b>Takip çerezi yok.</b> Fluo çerez kullanmaz; ayrıntılar <a href="#yasal-cerez">Çerezler ve Yerel Depolama</a> sayfasında.</li><li><b>Giriş zorunlu değil.</b> Giriş yapmadan kullanırsan ilerlemen sadece kendi cihazında kalır.</li><li><b>Ses kaydı yok.</b> Telaffuz bölümünde söylediklerin kaydedilmez.</li></ul>'+
    '<h3>Giriş yaparsan</h3><p>E-posta adresin, (isteğe bağlı) adın ve öğrenme ilerlemen, cihazların arasında eşitlenebilmesi için Supabase üzerindeki hesabında saklanır. Veritabanındaki her kayıt satır düzeyinde güvenlik kurallarıyla korunur: herkes yalnızca kendi verisini görebilir ve değiştirebilir. Şifren bizim tarafımızdan görülemez; yalnızca şifrelenmiş (hash) hâli kimlik doğrulama hizmetinde tutulur.</p>'+
    '<h3>Üçüncü taraf hizmetler</h3>'+providers+
    '<h3>Bildirimler</h3><p>Tekrar hatırlatması ve pomodoro bildirimleri yalnızca sen açarsan ve tarayıcın izin verirse gösterilir; bu bildirimler cihazında oluşturulur. Pazarlama e-postası göndermeyiz; yalnızca kayıt onayı, giriş bağlantısı ve şifre yenileme gibi hesapla ilgili e-postalar gönderilir.</p>'+
    '<h3>Çocuklar</h3><p>Fluo her yaştan öğrenciye açıktır. 18 yaşından küçükler hesap oluşturmadan önce velisinin ya da vasisinin onayını almalıdır. Veli olarak çocuğuna ait verilerin silinmesini istersen '+E+' üzerinden ulaşabilirsin.</p>'+
    '<h3>Güvenlik</h3><p>Bağlantılar şifrelidir (HTTPS). Verilerini korumak için makul teknik ve idari önlemleri alırız; ancak internet üzerinden hiçbir aktarımın tamamen güvenli olduğu garanti edilemez.</p>'+
    '<h3>Hesabını silmek</h3><p>Destek sayfasındaki formda "Soru"yu seçip hesabını silmek istediğini ve hesabına kayıtlı e-posta adresini yaz'+(I.email?' ya da kayıtlı e-postandan <b>'+esc(I.email)+'</b> adresine yaz':'')+'. Hesabın ve ilerleme verilerin en geç 30 gün içinde silinir. Bu cihazdaki verileri ise istediğin an Ayarlar → Veriler bölümünden silebilirsin.</p>'+
    '<h3>Değişiklikler</h3><p>Bu politikayı güncelleyebiliriz; önemli değişiklikleri sitede duyururuz. Sayfanın başındaki tarih son güncellemeyi gösterir.</p>'},
  kosullar:{t:"Kullanım Koşulları",h:
    '<p>Bu koşullar, Fluo sitesini ve uygulamasını ("Hizmet") kullanımına ilişkin kuralları belirler. Hizmeti kullanarak ya da hesap oluşturarak bu koşulları kabul etmiş olursun. Fluo, '+O+' tarafından gönüllü olarak geliştirilen, şirket veya kurum bağlantısı olmayan ve gelir amacı gütmeyen bireysel bir projedir.</p>'+
    '<h3>1. Hizmet</h3><p>Fluo; kelime kartları, dil bilgisi anlatımları, alıştırmalar, testler, yarışmalar, okuma, dinleme, diyaloglar ve çeviri araçlarıyla Türkçe konuşanlara İngilizce öğrenmede yardımcı olan bir eğitim hizmetidir. Hizmet şu an ücretsizdir. İleride ücretli özellikler eklenirse koşulları ve ücretleri önceden açıkça bildiririz; mevcut ücretsiz kullanım bu nedenle kendiliğinden ücretli hâle gelmez.</p>'+
    '<h3>2. Hesap</h3><ul><li>Hesap oluştururken doğru bilgi vermeyi ve hesabını yalnızca kendin kullanmayı kabul edersin.</li><li>Şifrenin ve e-posta hesabının güvenliğinden sen sorumlusun; hesabının izinsiz kullanıldığını düşünürsen bize hemen bildir.</li><li>18 yaşından küçüksen hesap oluşturmadan önce velinin ya da vasinin onayını almalısın.</li></ul>'+
    '<h3>3. Kullanım kuralları</h3><p>Hizmeti kullanırken şunları yapmamayı kabul edersin:</p><ul><li>Hizmetin işleyişini bozmaya, güvenliğini aşmaya, başkalarının hesaplarına veya verilerine erişmeye çalışmak,</li><li>otomatik araçlarla aşırı istek göndermek, içeriği toplu olarak kopyalamak veya ticari amaçla yeniden yayınlamak,</li><li>geri bildirim alanlarına hakaret, nefret söylemi, yasa dışı ya da başkalarının haklarını ihlal eden içerik yazmak.</li></ul>'+
    '<h3>4. İçerik ve fikri mülkiyet</h3><p>Sitedeki anlatımlar, alıştırmalar, testler, kelime listeleri, metinler, tasarım ve yazılım, aksi belirtilmedikçe Fluo\'ya aittir ve yalnızca kişisel öğrenme amacıyla kullanılabilir. Bazı bileşenler kendi lisanslarıyla kullanılır: sözlüğün yedek katmanı FreeDict (GPL-2.0 ve sonrası), yazı tipi Onest (SIL Open Font License 1.1). Ayrıntılar proje belgelerinde yer alır.</p>'+
    '<h3>5. Doğruluk ve sorumluluk</h3><ul><li>İçeriği özenle hazırlıyoruz; yine de hatalar bulunabilir. Gördüğün hataları "Bildir" düğmesiyle bize iletebilirsin.</li><li><b>Makine çevirisi</b> ve sözlük sonuçları yaklaşık sonuçlardır; resmî belgeler, hukuki, tıbbi veya ticari önemi olan metinler için tek başına kullanılmamalıdır.</li><li>Seviye testi ve diğer değerlendirmeler yol gösterici niteliktedir; resmî bir dil yeterlilik belgesi yerine geçmez.</li><li>Hizmet "olduğu gibi" sunulur. Kesintisiz veya hatasız çalışacağını garanti etmeyiz; bakım, güncelleme veya üçüncü taraf hizmetlerdeki sorunlar nedeniyle geçici kesintiler olabilir.</li><li>Yürürlükteki mevzuatın izin verdiği ölçüde; hizmetin kullanılmasından veya kullanılamamasından doğan dolaylı zararlardan sorumlu değiliz. Kasıt ve ağır kusurdan doğan sorumluluk ile tüketicinin kanundan doğan hakları saklıdır.</li></ul>'+
    '<h3>6. Hesabın kapatılması</h3><p>Hesabını istediğin zaman kapatabilir ve verilerinin silinmesini isteyebilirsin. Bu koşulları açıkça ve ciddi biçimde ihlal eden hesapları, mümkünse önceden bildirerek askıya alabilir veya kapatabiliriz.</p>'+
    '<h3>7. Değişiklikler</h3><p>Hizmeti ve bu koşulları geliştirebilir veya değiştirebiliriz. Önemli değişiklikleri sitede duyururuz; değişiklikten sonra hizmeti kullanmaya devam etmen güncel koşulları kabul ettiğin anlamına gelir.</p>'+
    '<h3>8. Uygulanacak hukuk ve uyuşmazlıklar</h3><p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda genel hükümlere göre yetkili Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir; kanundan doğan hakların saklıdır.</p>'+
    '<h3>9. İletişim</h3><p>Sorular için: '+E+'.</p>'},
  cerez:{t:"Çerezler ve Yerel Depolama",h:
    '<p><b>Fluo çerez (cookie) kullanmaz.</b> Reklam veya takip amaçlı hiçbir araç yoktur. Sitenin çalışması için tarayıcının yerel depolama alanı (localStorage ve uygulama önbelleği) kullanılır. Bu bilgiler senin cihazında tutulur:</p><ul>'+
      '<li><b>İlerleme ve ayarlar:</b> öğrendiğin kelimeler, Defterim, sonuçların, tema ve ses ayarların. Giriş yapmadıysan bu bilgiler yalnızca bu cihazda kalır.</li>'+
      '<li><b>Oturum:</b> giriş yaptıysan, oturumunu açık tutmak için kimlik doğrulama hizmetinin oluşturduğu oturum anahtarı.</li>'+
      '<li><b>Çeviri geçmişi:</b> son aramaların ve hızlı yanıt için daha önce çevrilen metinler.</li>'+
      '<li><b>Pomodoro:</b> çalışan sayacın durumu.</li>'+
      '<li><b>Çevrimdışı kullanım:</b> siteyi internetsiz açabilmen için sayfa, yazı tipi, ses ve sözlük dosyalarının önbellek kopyaları; hatırlatmayı açtıysan hatırlatma ayarın.</li></ul>'+
    '<p>Sitenin yazı tipi ve sesleri Fluo ile birlikte sunulur; bu dosyalar için üçüncü taraf sunuculara bağlanılmaz.</p>'+
    '<h3>Bu verileri silmek</h3><p>Ayarlar → Veriler bölümünden çeviri geçmişini veya tüm ilerlemeni silebilirsin. Tarayıcının ayarlarından bu site için depolanan verileri temizleyerek her şeyi silebilirsin. Giriş yaptıysan hesabındaki kopya ayrıca saklanır; onun silinmesi için <a href="#yasal-gizlilik">Gizlilik Politikası</a>\'ndaki adımları izle.</p>'+
    '<p>İleride ziyaretçi istatistikleri için bir analiz aracı eklenirse bu sayfa güncellenecek ve gerekiyorsa onayın alınacaktır.</p>'}
  };
}
function renderLegal(tab){
  const box=$("legalBox");if(!box)return;const D=lgDocs(),d=D[tab]||D.kvkk;
  const draft=/\[[A-ZÇĞİÖŞÜ]/.test(d.h);
  box.innerHTML='<div class="chips-row st-tabs lg-tabs">'+LEGAL_TABS.map(([k,l])=>'<a class="fchip" href="#yasal'+(k==="kvkk"?"":"-"+k)+'" aria-pressed="'+(k===(D[tab]?tab:"kvkk"))+'">'+l+'</a>').join("")+'</div>'+
    (draft?'<p class="lg-draft">'+ic("alert")+'<span>Bu metin taslaktır. Köşeli parantez içindeki bilgiler yayından önce doldurulacak.</span></p>':'')+
    '<article class="card lg-doc"><h2>'+esc(d.t)+'</h2><p class="note lg-date">Son güncelleme: '+esc(LEGAL_INFO.updated)+'</p>'+d.h+'</article>';
}
