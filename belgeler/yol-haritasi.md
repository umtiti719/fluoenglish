# Fluo – yol haritası

## Tamamlananlar (20 Ekim 2026)
- Hafıza ve aralıklı tekrar (1-3-7-14-30 gün), Defterim, Dinleme (seviye + kelime/cümle/dikte, duraklat)
- 835 kayıtlı İngilizce ses (cihaz sesi kullanılmıyor)
- Çeviri bölümü (yazarken çeviri, önbellek, iki aşamalı yapay zekâ), Metin Çevirisi
- Ayarlar (tema, palet, yazı boyutu, ses hızı, otomatik seslendirme, yarışma süresi, sıfırlama)
- Ana sayfa: misafire genel karşılama; giriş yapana kişisel karşılama ve günlük seri

## Kimlik
- Uygulamada görünen ad ve logo: **Fluo** (Akış logosu)
- Dış kimlik: **fluoenglish** – fluoenglish.com, support@fluoenglish.com, GitHub deposu fluoenglish

## Sıradakiler (21 Ekim)
1. **Yeni logo** – Fluo için özgün logo ve uygulama simgesi
2. ~~**Üye girişi**~~ – tamamlandı (23 Ekim): site https://umtiti719.github.io/fluoenglish/ · Supabase (İrlanda) · Google, e-posta + şifre ve e-posta bağlantısıyla giriş, cihazlar arası eşitleme çalışıyor. Sonra: fluoenglish.com alan adı, kendi SMTP'miz ve Türkçe e-posta şablonları, Google giriş ekranında Fluo adı, sitede yapay zekâ çevirisi için sunucu tarafı
   (claude.ai bağlantısı mı, kendi web adresi mi). Girişle birlikte: cihazlar arası ilerleme,
   PERSONAL_HERO ve SHOW_STREAK açılır.
3. ~~**Seviye testi**~~ (21 Ekim'de tamamlandı) – kelime, gramer, okuma ve dinleme sorularıyla CEFR seviyesi (A1–C1) belirleme,
   sonuca göre başlangıç önerisi

## Daha sonra
- Türkçeden İngilizceye cümle kurma, günün dersi, içeriği büyütme, okuma anlama, telaffuz köşesi
- Destek bölümü (25 Ekim): sık sorulanlar, Bize yaz formu, kelime kartı ve dil bilgisinden hata bildirme; mesajlar feedback tablosunda (Table Editor → feedback).
- Sitede yapay zekâ çevirisi (25 Ekim, kod hazır, KAPALI — ücretli kurulum sona bırakıldı; açmak için config.js aiOn:true): Supabase Edge Function 'ceviri' + Claude Haiku 5.5; yalnızca giriş yapanlar, kişi başı günde 100 istek. Kurulum: Anthropic API anahtarı (Supabase gizli değişkeni ANTHROPIC_API_KEY), belgeler/yapay-zeka.sql, fonksiyonun panelden yüklenmesi.
- Cümle Kur (25 Ekim): Türkçeden İngilizceye, kartlarla ya da yazarak; kelime öğren araçlarında ve ana sayfada.
- Günün dersi (25 Ekim): 5 adım, seviye testine göre; P.daily[gün] içinde saklanır, cihazlar arası eşitlenir.
- Okuma (25 Ekim): 16 özgün metin (her seviyeden 4), 64 anlama sorusu, 178 cümle Kokoro sesiyle; Metin Çevirisi sayfasından ve ana sayfadan.
- Telaffuz (25 Ekim): Web Speech API ile; Firefox'ta desteklenmiyor uyarısı. Kelime Öğren araçlarında.
