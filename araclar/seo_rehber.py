"""Genel aramalar için açılış sayfaları: "ingilizce öğren", "ingilizce seviye testi", "ingilizce kelime ezberleme",
"a1 ingilizce" … "c2 ingilizce". Her sayfa özgün Türkçe içerik, sık sorulan sorular (FAQPage) ve iç bağlantılar taşır.
build.py → seo_sayfalar.build() içinden çağrılır; dönen adresler sitemap.xml'e eklenir."""
import json
from seo_sayfalar import page, e

LV_INFO = {
    'A1': ('Başlangıç', 'İngilizceye sıfırdan başlayanlar için: kendini tanıtmak, basit sorular sormak ve günlük ihtiyaçları anlatmak.',
           'Kendini ve aileni tanıtabilir, alışveriş ve yön sorma gibi basit durumlarda kısa cümlelerle anlaşabilirsin.'),
    'A2': ('Temel', 'Geçmiş ve gelecek zamanları kullanmaya, karşılaştırma yapmaya ve günlük konuşmaları anlamaya başladığın seviye.',
           'Tatilini anlatabilir, planlarından söz edebilir, kısa e-postalar ve mesajlar yazabilirsin.'),
    'B1': ('Orta', 'Kendini rahatça ifade etmeye başladığın, iş ve okul hayatında İngilizceyi kullanabildiğin seviye.',
           'Deneyimlerini anlatabilir, fikrini gerekçesiyle savunabilir, dizi ve haberlerin ana fikrini anlayabilirsin.'),
    'B2': ('İleri Orta', 'Akıcı ve doğru konuşma, karmaşık metinleri anlama ve yazılı anlatımı geliştirme seviyesi.',
           'Tartışmalara katılabilir, ayrıntılı rapor ve yazılar yazabilir, anadili İngilizce olanlarla zorlanmadan konuşabilirsin.'),
    'C1': ('İleri', 'Akademik ve profesyonel ortamlarda İngilizceyi esnek ve etkili kullanma seviyesi.',
           'Uzun ve zor metinleri anlayabilir, üslubunu duruma göre değiştirebilir, vurgu ve ince anlam farklarını kullanabilirsin.'),
    'C2': ('Ustalık', 'Anadile en yakın seviye: resmî üslup, incelikli ifadeler ve tam hâkimiyet.',
           'Neredeyse her şeyi zahmetsizce anlayabilir, en ince anlam farklarını bile doğru ve doğal biçimde ifade edebilirsin.'),
}
READ_LV = {'kolay': ['A1', 'A2'], 'orta': ['B1'], 'zor': ['B2'], 'uzman': ['C1', 'C2']}


def faq_ld(qas):
    return ('<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qas]}, ensure_ascii=False) + '</script>')


def faq_html(qas):
    return '<h2>Sık sorulan sorular</h2>' + ''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in qas) + faq_ld(qas)


def lv_links():
    return '<div class="grid">' + ''.join(f'<a href="/seviye/{k.lower()}/"><b>{k} İngilizce · {e(v[0])}</b><small>{e(v[1])}</small></a>' for k, v in LV_INFO.items()) + '</div>'


def build_guides(write, data):
    G, D, R = data['GRAMMAR'], data['DECKS'], data['READING']
    nw = sum(len(d['words']) for d in D)

    # 1) Ücretsiz İngilizce öğren (ana rehber)
    qas = [
        ("İngilizceyi ücretsiz öğrenmek mümkün mü?", f"Evet. Fluo tamamen ücretsizdir: {len(G)} dil bilgisi konusu, {nw} örnek cümleli kelime, {len(R)} okuma metni, seviye testi ve kelime yarışmaları için ücret, reklam ya da zorunlu üyelik yoktur."),
        ("İngilizceye nereden başlamalıyım?", "Önce seviye testini çözüp seviyeni öğren. Sonra o seviyenin dil bilgisi konularını sırayla çalış, her gün bir kelime destesinden birkaç kart tekrar et ve seviyene uygun kısa metinler oku."),
        ("Günde ne kadar İngilizce çalışmalıyım?", "Düzenli olmak süreden daha önemlidir. Her gün 15–30 dakika çalışmak, haftada bir kez saatlerce çalışmaktan çok daha etkilidir. Fluo'daki Günün dersi 5 dakikalık bir başlangıç sunar."),
        ("İngilizce öğrenmek ne kadar sürer?", "Kişiye göre değişir; ama düzenli çalışan biri bir seviyeyi (ör. A2'den B1'e) genellikle 4–6 ayda atlayabilir. İlerlemeni Çalışmam sayfasından ve ünite sınavlarından takip edebilirsin."),
        ("Telefonda kullanabilir miyim?", "Evet. Fluo telefona uygun tasarlandı; tarayıcı menüsünden ana ekrana ekleyerek uygulama gibi kullanabilirsin, internet olmadan da çalışır."),
    ]
    body = (f'<h1>Ücretsiz İngilizce öğren: adım adım çalışma rehberi</h1>'
            f'<p class="sub">Türkçe anlatımlı, reklamsız ve tamamen ücretsiz İngilizce çalışma alanı</p>'
            f'<p class="lead">İngilizce öğrenmek için pahalı kurslara ya da karmaşık uygulamalara ihtiyacın yok. Fluo; dil bilgisi konu anlatımları, örnek cümleli kelime kartları, okuma metinleri, dinleme alıştırmaları ve seviye testini tek bir yerde, Türkçe açıklamalarla sunar. Aşağıdaki adımlarla nereden başlayacağını ve nasıl ilerleyeceğini bulabilirsin.</p>'
            '<h2>1. Seviyeni öğren</h2><p>Her şeyden önce nerede olduğunu bilmelisin. <a href="/ingilizce-seviye-testi/">Ücretsiz İngilizce seviye testi</a> yaklaşık 10 dakikada kelime, dil bilgisi, okuma ve dinleme becerini ölçer ve seni A1–C1 arasında bir seviyeye yerleştirir. Sonuçta hangi konulardan başlaman gerektiği de önerilir.</p>'
            f'<h2>2. Dil bilgisini sırayla çalış</h2><p>Gramer, cümle kurmanın iskeletidir. <a href="/gramer/">{len(G)} İngilizce gramer konusunun</a> her biri Türkçe anlatım, cümle yapısı, örnek cümleler, sık yapılan hatalar ve alıştırmalarla gelir. Konuları seviye sırasıyla çalış; her konunun sonunda bölüm testi, her ünitenin sonunda ünite sınavı ve sınırsız ünite testi var.</p>'
            f'<h2>3. Her gün kelime tekrar et</h2><p>Kelime bilgisi anlamanın anahtarıdır. <a href="/kelime/">{len(D)} konu destesindeki {nw} kelime</a> örnek cümleleri ve sesli telaffuzlarıyla kartlarda çalışılır. Bilmediğin kelimeler aralıklı tekrar sistemiyle tam unutmak üzereyken yeniden karşına çıkar. Yöntemin ayrıntıları için <a href="/ingilizce-kelime-ezberleme/">İngilizce kelime ezberleme rehberine</a> bakabilirsin.</p>'
            f'<h2>4. Bol bol oku ve dinle</h2><p><a href="/okuma/">{len(R)} seviyeli okuma metni</a> Türkçe çevirisi, anahtar kelimeleri ve anlama sorularıyla gelir. Metinleri doğal bir sesle dinleyebilir, bilmediğin kelimeye dokunup anlamını görebilirsin. Diyaloglar ve dinleme alıştırmaları kulağını gerçek konuşmaya alıştırır.</p>'
            '<h2>5. Kendini dene ve tekrar et</h2><p>Öğrendiğini kullanmadıkça kalıcı olmaz. Kelime yarışmaları, Cümle Kur, Telaffuz ve sınavlar ilerlemeni ölçer; Çalışmam sayfası neyi tekrar etmen gerektiğini gösterir.</p>'
            '<h2>Seviyene göre İngilizce</h2>' + lv_links() + faq_html(qas))
    write('ingilizce-ogren', page('ingilizce-ogren/', 'Ücretsiz İngilizce Öğren · Adım Adım İngilizce Çalışma Rehberi | Fluo',
                                  f'İngilizceyi ücretsiz ve Türkçe anlatımla öğren: seviye testi, {len(G)} gramer konusu, {nw} örnekli kelime ve {len(R)} okuma metniyle adım adım İngilizce çalışma rehberi.',
                                  [('Fluo', ''), ('İngilizce öğren', 'ingilizce-ogren/')], body, '/', 'Hemen başla'))

    # 2) Seviye testi
    qas = [
        ("İngilizce seviye testi ücretsiz mi?", "Evet, tamamen ücretsizdir ve üyelik gerektirmez. Sonucun cihazında saklanır; giriş yaparsan tüm cihazlarında görünür."),
        ("Test kaç soru ve ne kadar sürüyor?", "Yaklaşık 18 soru ve 8–10 dakika. Sorular cevaplarına göre zorlaşır ya da kolaylaşır, böylece seviyen daha az soruyla belirlenir."),
        ("Hangi beceriler ölçülüyor?", "Kelime, dil bilgisi, okuma ve dinleme. Sonuçta her becerideki başarı yüzden ayrı ayrı gösterilir."),
        ("Sonuç resmî bir belge yerine geçer mi?", "Hayır. Test yol göstericidir; resmî bir dil yeterlilik belgesi (IELTS, TOEFL, YDS gibi) yerine geçmez. Ama hangi seviyeden başlaman gerektiğini doğru şekilde gösterir."),
        ("Bilmediğim sorularda tahmin etmeli miyim?", "Hayır. Emin değilsen \"Bilmiyorum\" seçeneğini kullan; tahmin etmek sonucu yanıltır ve sana uygun olmayan bir seviyeden başlamana yol açabilir."),
    ]
    body = ('<h1>Ücretsiz İngilizce seviye testi</h1><p class="sub">10 dakikada A1–C1 arası seviyeni öğren · kelime, dil bilgisi, okuma ve dinleme</p>'
            '<p class="lead">İngilizce seviyeni bilmek, doğru yerden başlamanın ilk adımıdır. Fluo seviye testi Avrupa Ortak Dil Çerçevesi\'ne (CEFR) göre seni A1, A2, B1, B2 ya da C1 seviyesine yerleştirir ve hangi konuları çalışman gerektiğini önerir.</p>'
            '<h2>Test nasıl çalışır?</h2><p>Test kolay sorularla başlar. Doğru cevap verdikçe sorular zorlaşır, yanlış yaptıkça kolaylaşır. Böylece yaklaşık 18 soruda seviyen belirlenir. Dinleme soruları için sesinin açık olması gerekir.</p>'
            '<h2>Seviyeler ne anlama geliyor?</h2>' + lv_links() +
            '<h2>Testten sonra ne yapmalıyım?</h2><p>Sonuç ekranı sana bir başlangıç kelime destesi, ilk dil bilgisi konusu ve uygun okuma metinleri önerir. Seviyendeki <a href="/gramer/">gramer konularını</a> sırayla çalışıp ünite sınavına girerek ilerlemeni ölçebilirsin.</p>' + faq_html(qas))
    write('ingilizce-seviye-testi', page('ingilizce-seviye-testi/', 'Ücretsiz İngilizce Seviye Testi (A1–C1) · 10 Dakikada Seviyeni Öğren | Fluo',
                                         'Ücretsiz İngilizce seviye testi: kelime, dil bilgisi, okuma ve dinleme sorularıyla 10 dakikada A1–C1 seviyeni öğren, sana uygun çalışma planını gör.',
                                         [('Fluo', ''), ('Seviye testi', 'ingilizce-seviye-testi/')], body, '/#seviye', 'Teste başla'))

    # 3) Kelime ezberleme
    qas = [
        ("İngilizce kelime ezberlemenin en etkili yolu nedir?", "Kelimeyi tek başına değil, örnek bir cümle içinde öğrenmek ve aralıklı tekrar yapmak. Unutmaya yaklaştığın anda yapılan tekrar, kelimeyi uzun süreli belleğe taşır."),
        ("Günde kaç kelime öğrenmeliyim?", "Günde 8–12 yeni kelime ve önceki günlerin tekrarı çoğu kişi için idealdir. Fluo her turda 12 kelime gösterir ve tekrar zamanı gelenleri öne alır."),
        ("Kelimelerin telaffuzunu nasıl öğrenirim?", "Fluo'daki her kelime ve örnek cümle doğal bir İngilizce sesle kaydedildi. Hoparlöre dokunarak dinleyebilir, Telaffuz bölümünde kendi söyleyişini deneyebilirsin."),
        ("Hangi kelimelerden başlamalıyım?", "En sık kullanılan günlük kelimelerden. Günlük Hayat, Aile, Ev ve Yemek desteleri A1–A2 seviyesinde başlamak için uygundur."),
    ]
    body = (f'<h1>İngilizce kelime ezberleme: kalıcı öğrenmenin yolu</h1><p class="sub">{len(D)} konu destesi · {nw} kelime · örnek cümle ve sesli telaffuz</p>'
            '<p class="lead">Kelime listelerini defalarca okuyup ertesi gün unutmak çok yaygın bir sorundur. Kalıcı öğrenmenin sırrı üç şeyde yatar: kelimeyi bağlamı içinde görmek, sesini duymak ve doğru zamanda tekrar etmek.</p>'
            '<h2>1. Kelimeyi cümle içinde öğren</h2><p>"Commute" kelimesini tek başına ezberlemek zordur; ama "She commutes to work by metro" cümlesiyle görünce hem anlamını hem kullanımını öğrenirsin. Fluo\'daki her kelime gerçek hayattan bir örnek cümle ve Türkçesiyle gelir.</p>'
            '<h2>2. Aralıklı tekrar yap</h2><p>Bildiğin kelimeler giderek daha seyrek, zorlandıkların daha sık karşına çıkar. Fluo bu takvimi senin yerine tutar; "Tekrar zamanı" bölümü her gün hangi kelimelere bakman gerektiğini gösterir.</p>'
            '<h2>3. Dinle ve söyle</h2><p>Her kelimenin ve örnek cümlenin doğal sesli kaydı var. Duyarak öğrenmek hem telaffuzunu hem dinleme becerini geliştirir.</p>'
            '<h2>4. Kendini sına</h2><p>Kelime yarışmaları ve deste sınavları öğrendiğini pekiştirir; bilemediğin kelimeler otomatik olarak tekrar listene eklenir.</p>'
            '<h2>Konu konu kelime listeleri</h2><div class="grid">' +
            ''.join(f'<a href="/kelime/{d["id"]}/"><b>{e(d["name"])}</b><small>{e(d["level"])} · {len(d["words"])} kelime</small></a>' for d in D) + '</div>' + faq_html(qas))
    write('ingilizce-kelime-ezberleme', page('ingilizce-kelime-ezberleme/', 'İngilizce Kelime Ezberleme Yöntemi ve Konu Konu Kelime Listeleri | Fluo',
                                             f'İngilizce kelime ezberlemenin etkili yolu: örnek cümle, sesli telaffuz ve aralıklı tekrar. {len(D)} konuda {nw} kelime, Türkçe anlamlarıyla ücretsiz.',
                                             [('Fluo', ''), ('Kelime ezberleme', 'ingilizce-kelime-ezberleme/')], body, '/#ogren', 'Kelime çalışmaya başla'))

    # 4) Seviye sayfaları: A1 … C2
    codes = list(LV_INFO)
    for i, (k, (name, desc, can)) in enumerate(LV_INFO.items()):
        gs = [g for g in G if g['level'] == k]
        ds = [d for d in D if k in d['level'] or (k in ('A1', 'A2') and d['level'] == 'A1–A2')]
        rs = [r for r in R if k in READ_LV.get(r['lv'], [])]
        qas = [
            (f"{k} seviye İngilizce ne demek?", f"{k} ({name}), Avrupa Ortak Dil Çerçevesi'nde (CEFR) bir İngilizce seviyesidir. {can}"),
            (f"{k} seviyesinde hangi gramer konuları var?", (', '.join(g['title'] for g in gs) + '.') if gs else 'Bu seviyede ayrı bir gramer ünitesi yok; bir önceki ve sonraki seviyenin konularına bakabilirsin.'),
            (f"{k} seviyesine geldiğimi nasıl anlarım?", f"Ücretsiz seviye testini çözebilir ya da Fluo'daki {k} ünite sınavına girebilirsin. Sınavda %85 ve üstü alırsan bir sonraki seviyeye geçmeye hazırsın."),
        ]
        body = (f'<p><span class="pill">{k} · {e(name)}</span></p><h1>{k} İngilizce: konular, kelimeler ve okuma metinleri</h1>'
                f'<p class="sub">{e(desc)}</p><p class="lead">{e(can)} Bu sayfada {k} seviyesinde çalışman gereken her şeyi bir arada bulabilirsin.</p>')
        if gs:
            body += f'<h2>{k} gramer konuları</h2><div class="grid">' + ''.join(f'<a href="/gramer/{g["id"]}/"><b>{e(g["title"])}</b><small>{e(g["sub"])} · {e(g["tr"])}</small></a>' for g in gs) + '</div>'
        if ds:
            body += f'<h2>{k} kelime listeleri</h2><div class="grid">' + ''.join(f'<a href="/kelime/{d["id"]}/"><b>{e(d["name"])}</b><small>{e(d["level"])} · {len(d["words"])} kelime</small></a>' for d in ds) + '</div>'
        if rs:
            body += f'<h2>{k} okuma metinleri</h2><div class="grid">' + ''.join(f'<a href="/okuma/{r["id"]}/"><b>{e(r["title"])}</b><small>{e(r["tt"])}</small></a>' for r in rs) + '</div>'
        body += ('<h2>Diğer seviyeler</h2><div class="tags">' + ''.join(f'<a class="pill" href="/seviye/{c.lower()}/">{c} · {e(LV_INFO[c][0])}</a>' for c in codes if c != k) + '</div>' + faq_html(qas))
        write(f'seviye/{k.lower()}', page(f'seviye/{k.lower()}/', f'{k} İngilizce ({name}) · Gramer Konuları, Kelimeler ve Okuma Metinleri | Fluo',
                                          f'{k} seviye İngilizce: {len(gs)} gramer konusu, {sum(len(d["words"]) for d in ds)} kelime ve {len(rs)} okuma metni. {desc}'[:158],
                                          [('Fluo', ''), ('Seviyeler', 'seviye/'), (f'{k} İngilizce', f'seviye/{k.lower()}/')], body,
                                          f'/#sinav-{k.lower()}' if gs else '/#seviye', f'{k} ünite sınavına gir' if gs else 'Seviye testini çöz'))
    write('seviye', page('seviye/', 'İngilizce Seviyeleri A1, A2, B1, B2, C1, C2 Nedir? · Seviyene Göre Çalış | Fluo',
                         'İngilizce seviyeleri (CEFR) A1\'den C2\'ye: her seviyede neler yapabildiğin, hangi gramer konularını ve kelimeleri çalışman gerektiği.',
                         [('Fluo', ''), ('Seviyeler', 'seviye/')],
                         '<h1>İngilizce seviyeleri: A1\'den C2\'ye</h1><p class="sub">Avrupa Ortak Dil Çerçevesi (CEFR) seviyeleri ve her seviyede çalışman gerekenler</p>' +
                         ''.join(f'<h2><a href="/seviye/{k.lower()}/">{k} · {e(v[0])}</a></h2><p>{e(v[1])} {e(v[2])}</p>' for k, v in LV_INFO.items()),
                         '/ingilizce-seviye-testi/', 'Seviyeni öğren'))
