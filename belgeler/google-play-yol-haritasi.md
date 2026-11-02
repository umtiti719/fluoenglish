# Fluo · Google Play yol haritası

Hedef: Fluo'yu Google Play'de Android uygulaması olarak yayınlamak.
Yöntem: Trusted Web Activity (TWA). Mevcut site (fluo-english.com) PWABuilder ile Play paketine dönüştürülür.
Uygulama siteyi tam ekran açar; sitedeki her güncelleme uygulamaya anında yansır, mağazaya yeniden yükleme gerekmez.

Tahmini toplam süre: 3–4 hafta. En uzun kısmı Google'ın zorunlu 14 günlük kapalı testi.
Maliyet: Google Play geliştirici hesabı, bir kerelik yaklaşık 25 dolar (yıllık ücret yok).

---

## Aşama 1 · Geliştirici hesabı (Ümit) — 1–7 gün
- [ ] play.google.com/console → **Kişisel** (Personal) hesap aç
- [ ] Kayıt ücretini öde (tek seferlik)
- [ ] Kimlik doğrulamasını tamamla (kimlik belgesi + telefon). Onay birkaç gün sürebilir.
- [ ] Geliştirici adı: `Ümit Erdoğan` ya da `Fluo`
- [ ] İletişim e-postası: `iletisim@fluo-english.com`, web sitesi: `https://fluo-english.com`

## Aşama 2 · Mağaza materyalleri (Claude) — hesap onayı beklenirken
- [ ] Ayrı **gizlilik politikası** sayfası: `fluo-english.com/gizlilik/` (Play gerçek bir adres istiyor; `#yasal` olmaz)
- [ ] **Hesap silme** sayfası: `fluo-english.com/hesap-silme/` (hesap açılan uygulamalar için Play şartı)
- [ ] Mağaza metinleri:
  - Uygulama adı (en fazla 30 karakter): ör. "Fluo: Türkçe İngilizce"
  - Kısa açıklama (80 karakter)
  - Uzun açıklama (4000 karakter)
- [ ] Görseller:
  - 512×512 simge (mevcut `icons/icon-512.png`)
  - 1024×500 tanıtım görseli
  - En az 2, tercihen 6–8 telefon ekran görüntüsü
- [ ] **Veri güvenliği** formunun cevapları:
  - toplanan veriler: e-posta, ad, öğrenme ilerlemesi, geri bildirim, anonim kullanım istatistiği
  - şifreleme, silme isteği
- [ ] **İçerik derecelendirmesi** anketi için cevaplar (eğitim uygulaması, şiddet/kumar yok)
- [ ] **Hedef kitle:** 13 yaş ve üstü önerilir (13 altı seçilirse Google'ın "Aileler" programının ek şartları gelir)
- [ ] Siteye `.well-known/assetlinks.json` altyapısı ve GitHub Pages için `.nojekyll`

## Aşama 3 · Uygulama paketi (birlikte) — 1 gün
- [ ] pwabuilder.com → `https://fluo-english.com` → **Package for stores → Android**
- [ ] Ayarlar:
  - Paket adı: `com.fluoenglish.app`
  - Uygulama adı: `Fluo`
  - Sürüm: `1.0.0` (1)
- [ ] İndirilen zip'te `.aab` dosyası, imza anahtarı (`signing.keystore`) ve şifre bilgileri var
  - ⚠️ Anahtarı ve şifreleri güvenli bir yerde sakla (Google Drive + ikinci bir yedek). Kaybolursa güncelleme yapılamaz.
  - Anahtarı ve şifreleri Claude dahil kimseyle paylaşma.
- [ ] SHA-256 parmak izini Claude'a gönder (gizli değil). Claude `assetlinks.json` dosyasını siteye ekler.
- [ ] Play App Signing kullanılırsa Play Console'daki **App signing** sayfasındaki SHA-256 de eklenir. İki parmak izi birlikte olabilir.
- [ ] Google'ın Asset Links aracıyla doğrula. Uygulama adres çubuğu olmadan açılmalı.

## Aşama 4 · Play Console'da uygulama ve kapalı test (Ümit + Claude) — 14+ gün
- [ ] Play Console → **Uygulama oluştur**: ad Fluo, dil Türkçe, uygulama, ücretsiz
- [ ] Mağaza girişi: Aşama 2 metinleri ve görselleri
- [ ] Uygulama içeriği formları:
  - gizlilik politikası adresi
  - veri güvenliği
  - içerik derecelendirmesi
  - hedef kitle
  - reklam yok
  - hesap silme adresi
- [ ] **Kapalı test** kanalı oluştur, `.aab` dosyasını yükle
- [ ] En az **12 test kullanıcısı**: Gmail adreslerini listeye ekle, katılım bağlantısını gönder
  - Herkes bağlantıdan **"Test kullanıcısı ol"**a basıp uygulamayı yüklemeli
  - 14 gün boyunca testten çıkmamalı (yüklü kalması yeterli)
- [ ] 14 gün dolunca: **Üretime erişim başvurusu** (test hakkında birkaç soru sorulur)

## Aşama 5 · Yayın — Google incelemesi birkaç gün
- [ ] Üretim kanalına aynı sürümü gönder
- [ ] Onay gelince Play Store'da herkese açık
- [ ] Siteye "Google Play'den indir" düğmesi ekle (Claude)

---

## Notlar
- Uygulama siteyi gösterdiği için içerik ve tasarım güncellemeleri **mağazaya yeniden yükleme gerektirmez**.
- Yeni `.aab` sadece simge, ad ya da Android ayarları değişirse ya da Google hedef Android sürümünü yükselttiğinde (yılda bir) gerekir. PWABuilder ile aynı imza anahtarı kullanılarak yeniden üretilir.
- Play'deki istatistikler (yükleme sayısı, puanlar) Play Console'da; site içi kullanım Umami'de görünür.

## Kaynaklar
- Google Play Console Yardım, yeni kişisel hesaplar için test şartları: https://support.google.com/googleplay/android-developer/answer/14151465
- PWA'yı Google Play'de yayınlama kontrol listesi: https://spacenexus.us/blog/play-store-launch-checklist-pwa-twa-android
- PWABuilder: https://www.pwabuilder.com
