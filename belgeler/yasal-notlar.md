# Yasal metinler — yayından önce yapılacaklar

Sitedeki metinler: `#yasal` (KVKK Aydınlatma Metni), `#yasal-gizlilik`, `#yasal-kosullar`, `#yasal-cerez`.
Kaynak dosya: `src/yasal.js`. Bu metinler genel bir taslaktır, hukuki danışmanlık değildir.

## 1. Doldurulacak alanlar (`src/yasal.js` → `LEGAL_INFO`)
- `owner`: veri sorumlusu — gerçek kişiysen ad soyad, şirketsen tam unvan
- `address`: tebligata elverişli açık adres
- `email`: KVKK başvurularının geleceği, gerçekten okunan bir e-posta adresi
- `city`: uyuşmazlıklarda yetkili mahkemenin ili
- `updated`: son güncelleme tarihi

Bu alanlar doldurulana kadar sayfaların başında "taslak" uyarısı görünür.

## 2. Hukukçuya sorulacaklar
- **Yurt dışına aktarım (KVKK md. 9):** Supabase (İrlanda), GitHub (ABD), Google, MyMemory (İtalya). 2024 değişikliğinden sonra düzenli aktarımlar için uygun güvence (ör. standart sözleşme ve 5 iş günü içinde Kurul'a bildirim) gerekebilir. Metindeki `[YURT DIŞI AKTARIM DAYANAĞI]` alanı buna göre doldurulmalı.
- **VERBİS kaydı:** Yıllık çalışan sayısı ve bilanço eşiklerinin altındaysan ve özel nitelikli veri işlemiyorsan muaf olabilirsin; durumunu teyit ettir.
- **18 yaş altı kullanıcılar** için veli onayı yaklaşımı.
- **Kullanım Koşulları**ndaki sorumluluk sınırlaması ve yetkili mahkeme maddeleri (tüketici mevzuatıyla uyum).
- Hizmet ileride ücretli olursa: mesafeli satış sözleşmesi, ön bilgilendirme formu, cayma hakkı metinleri ayrıca gerekir.

## 3. Teknik olarak yapılanlar
- Yazı tipi artık Google Fonts yerine siteyle birlikte sunuluyor (Google'a IP aktarımı yok).
- Fluo çerez kullanmıyor; analiz aracı eklenirse Çerez sayfası güncellenmeli (Google Analytics seçilirse onay penceresi gerekir).
- Kayıt ve giriş ekranında Kullanım Koşulları ve Aydınlatma Metni bağlantıları; destek formunda aydınlatma notu var.
- Hesap silme şimdilik destek talebiyle (30 gün içinde). İleride "Hesabımı sil" düğmesi eklenebilir (Supabase Edge Function ile).
