# Yasal metinler — notlar

Sitedeki metinler: `#yasal` (KVKK Aydınlatma Metni), `#yasal-gizlilik`, `#yasal-kosullar`, `#yasal-cerez`.
Kaynak dosya: `src/yasal.js`. Bu metinler genel bir taslaktır, hukuki danışmanlık değildir.

## Fluo'nun durumu
Fluo bir şirket değil; bir gerçek kişinin gönüllü, gelir amacı gütmeyen bireysel projesi. Metinler buna göre yazıldı:
şirket unvanı, adres ve yetkili mahkeme ili gibi alanlar kaldırıldı.

KVKK'da "veri sorumlusu" yalnızca şirketler için değil, kişisel veri işleyen **gerçek kişiler** için de geçerli bir kavram
(KVKK md. 3). Üyelik ve ilerleme kaydı tutulduğu için bu rolden tamamen çıkmak mümkün değil; metinde veri sorumlusu
"Fluo'nun geliştiricisi" olarak tanımlandı.

## İsteğe bağlı alanlar (`src/yasal.js` → `LEGAL_INFO`)
- `name`: adın soyadın. Boş bırakılabilir; doldurulursa metinlerde "Ad Soyad (Fluo'nun geliştiricisi)" olarak görünür.
  KVKK md. 10 veri sorumlusunun "kimliğini" bildirmeyi istediği için doldurulması daha güvenli olur.
- `email`: KVKK başvuruları için gerçekten okuduğun bir e-posta. Boşsa başvurular Destek formuna yönlendirilir.
  Fluo için ayrı bir adres açmak (ör. fluoenglish@...) kişisel adresini paylaşmaktan iyi olur.
- `updated`: son güncelleme tarihi.

## İleride bakılacaklar
- **Yurt dışına aktarım (KVKK md. 9):** Supabase (İrlanda), GitHub (ABD), Google, MyMemory (İtalya). Metinde genel ifade var;
  2024 değişikliği sonrası uygun güvence (ör. standart sözleşme + Kurul'a bildirim) gerekip gerekmediği bir hukukçuyla teyit edilmeli.
- **VERBİS:** Kurul kararıyla, yıllık çalışan sayısı 50'den ve bilançosu 100 milyon TL'den az olan ve ana faaliyeti özel nitelikli
  veri işleme olmayan veri sorumluları kayıt yükümlülüğünden muaf; bireysel proje olarak bu kapsamda olman beklenir.
- **18 yaş altı kullanıcılar** için veli onayı yaklaşımı.
- Hizmet ileride ücretli olursa ya da gelir elde edilirse: şirket/şahıs işletmesi, mesafeli satış sözleşmesi, ön bilgilendirme
  formu, cayma hakkı metinleri gerekir ve bu metinler yeniden yazılmalı.

## Teknik olarak yapılanlar
- Yazı tipi Google Fonts yerine siteyle birlikte sunuluyor (Google'a IP aktarımı yok).
- Fluo çerez kullanmıyor; analiz aracı eklenirse Çerez sayfası güncellenmeli (Google Analytics seçilirse onay penceresi gerekir).
- Kayıt ve giriş ekranında Kullanım Koşulları ve Aydınlatma Metni bağlantıları; destek formunda aydınlatma notu var.
- Hesap silme şimdilik destek talebiyle (30 gün içinde). İleride "Hesabımı sil" düğmesi eklenebilir (Supabase Edge Function ile).
