# Fluo

**Proje kimliği:** `fluoenglish` · Web: fluoenglish.com (planlanıyor) · Destek: support@fluoenglish.com (planlanıyor) · Depo: github.com/umtiti719/fluoenglish

Uygulamada görünen ad ve logo **Fluo**; web adresi, e-posta, depo adı ve diğer dış kimlikler **fluoenglish**.


*(Önceki adı: Kelime Atölyesi)*
Türkçe arayüzlü, genel İngilizce öğrenme uygulaması.

## Bölümler
- **Ana Sayfa:** Günün kelimesi, ilerleme özeti, günlük çalışma serisi ve "kaldığın yerden devam et".
- **Kelime Öğren:** 11 konu destesi (132 kelime). Çevrilebilen kartlar, örnek cümleler ve Türkçeleri, telaffuz, "Biliyorum / Tekrar et" takibi, desteyle yarışma.
- **Kelime Yarışması:** 4 seviye (A1–A2, B1, B2, C1–C2), süreli 10 soruluk turlar, hız bonusu, seri çarpanı, 50:50 ve Pas jokerleri, rekorlar.
- **Dil Bilgisi:** A1'den B2'ye 23 konu. Her konuda Türkçe anlatım, kullanım alanları, cümle yapısı, özet tablo, sesli örnek cümleler, ipucu kelimeler, sık yapılan hatalar ve alıştırma.
- **Tekrar ve hafıza:** Uygulama görülen her kelimeyi, metni ve cümleyi hatırlar; önce görülmemişleri getirir. Yanlış bilinen ya da "Tekrar et" denen kelimeler 1, 3, 7, 14 ve 30 gün aralıklarla yeniden sorulur.
- **Defterim:** Kartlarda, yarışmada, metinlerde ve günün kelimesinde kaydet işaretiyle kişisel kelime listesi; kartlarla çalışma ve yarışma.
- **Dinleme:** Cümleyi dinle; kolay modda duyduğun ifadeyi seç, dikte modunda cümleyi yaz. Yavaş dinleme ve kelime kelime karşılaştırma.
- **Seviye testi:** Kelime, dil bilgisi, okuma ve dinleme sorularıyla (A1–C1, 45 soruluk havuz) iki aşamalı uyarlanabilir test; yetenek modeliyle seviye tahmini, beceri dağılımı ve başlangıç önerileri.
- **Üyelik:** Google, e-posta + şifre ya da e-postaya gelen bağlantıyla giriş; ilerleme Supabase ile cihazlar arasında eşitlenir (kurulum: `belgeler/uyelik-kurulumu.md`).
- **Telaffuz:** kelimeyi ya da cümleyi dinle, mikrofona söyle; tarayıcının konuşma tanımasıyla kelime kelime puan (Chrome, Edge, Safari).
- **Okuma:** 4 seviyede 16 özgün metin; cümle vurgulu doğal sesle okuma, Türkçe çeviri, anahtar kelimeler ve açıklamalı anlama soruları.
- **Günün dersi:** her gün seviyeye göre ~5 dakikalık paket: 3 yeni kelime, kelime testi, mini gramer, cümle kurma ve dinleme (ana sayfada).
- **Cümle Kur:** Türkçe cümleyi gör, İngilizcesini karışık kartları sıralayarak ya da yazarak kur (4 seviye, ~300 cümle; yanlışlar birkaç dakika sonra yeniden gelir).
- **Yardım ve destek:** sık sorulanlar ve "Bize yaz" formu; kelime kartı ve dil bilgisi konularından tek dokunuşla hata bildirme. Mesajlar Supabase'deki `feedback` tablosuna düşer (kurulum: `belgeler/destek.sql`).
- **Büyük sözlük (Çeviri):** ~32.000 İngilizce kelime; en sık kelimeler için Fluo'nun kendi güncel çekirdek sözlüğü (~5.900 kelime), nadir kelimeler için FreeDict (GPL-2.0+) yedeği; çekimli biçimler köke bağlanır; Türkçe→İngilizce arama; cümlelerde kelime kelime anlam (`sozluk.js`, kaynaklar: `sozluk/LISANS.md`).
- **Metin Çevirisi:** Seviyeye göre metinler, kelimeye dokununca anlamı, çeviri puanlama.

İlerleme kullanılan tarayıcıda saklanır.

## Dosyalar
- `index.html` — çalışan uygulama (telefon uyumlu tam sayfa; tarayıcıda açılır). **Doğrudan düzenleme; `src/` içinden üretilir.**
- `artifact.html` — Claude bağlantısında yayınlanan sürüm (sayfa iskeletsiz)
- `audio-w.js`, `audio-s.js`, `audio-t.js` — kayıtlı İngilizce sesler (index.html ile aynı klasörde olmalı)
- `src/shell.html` — sayfa iskeleti
- `src/style.css` — tasarım
- `src/app.js` — uygulama mantığı
- `src/data-learn.js` — kelime desteleri
- `src/data-grammar.js` — dil bilgisi konuları ve alıştırmalar
- `src/config.js` — Supabase adresi ve herkese açık anahtar
- `src/auth.js` — giriş, kayıt, hesap sayfası ve eşitleme
- `src/support.js` — yardım ve destek sayfası
- `src/cumle.js` — Cümle Kur
- `src/gunun.js` — Günün dersi
- `src/okuma.js`, `src/data-reading.js` — Okuma (ses: `audio-r.js`)
- `src/telaffuz.js` — Telaffuz
- `src/buyuksozluk.js` — büyük sözlüğü yükleme ve arama · `araclar/sozluk_yap.py` — `sozluk.js` üretimi · `sozluk/cekirdek/*.tsv` — çekirdek sözlük
- `supabase/functions/ceviri/index.ts` — sitede yapay zekâ çevirisi (Claude Haiku; giriş yapanlara, günde 100 istek) · sayaç: `belgeler/yapay-zeka.sql`
- `vendor/supabase.js` — Supabase istemcisi (MIT)
- `src/data-test.js` — seviye testi soruları
- `src/data-quiz.js` — yarışma kelimeleri, çeviri metinleri ve metin sözlüğü
- `build.py` — `src/` dosyalarını `index.html` olarak birleştirir: `python3 build.py`
- `kelime_atolyesi.xlsx` — ilk sürümdeki kelime ve metin listesi

## Sürümler
Eski tasarımlar kaybolmasın diye her sürüm ayrı saklanır:
- `surumler/v1-ilk-surum.html` — ilk sürüm (kelime yarışması + metin çevirisi). GitHub dalı: `surum-v1-ilk`
- `surumler/v2-yesil-tasarim.html` — yeşil tasarım (ana sayfa, kelime öğren, dil bilgisi). GitHub dalı: `surum-v2-yesil`
- `surumler/v3-acik-tasarim.html` — açık tasarım, hafıza öncesi. GitHub dalı: `surum-v3-acik`
- `index.html` — güncel sürüm: v4 (hafıza, aralıklı tekrar, defterim, dinleme)

Eski bir sürüme dönmek için ilgili dosyayı açman ya da dalı seçmen yeterli.

## Not
Yapay zekâ ile çeviri değerlendirmesi yalnızca claude.ai üzerinde yayınlanan sürümde çalışır; dosya doğrudan açıldığında anahtar kelimeye dayalı puanlama kullanılır.
